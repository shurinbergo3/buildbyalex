/**
 * File-based store for leads and reviews.
 *
 * Persists to a single JSON file on disk so the data survives across requests
 * and (with a mounted volume) across deploys. Writes are serialized through an
 * in-process queue and written atomically (temp file + rename) to avoid
 * corruption. This is intentionally dependency-free — perfect for the modest
 * volume of an agency site, and trivially swappable for SQLite later.
 *
 * Node runtime only (uses node:fs). Routes that import this must NOT use the
 * edge runtime.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

export type Status = "new" | "in_progress" | "done";

export type Lead = {
  id: number;
  createdAt: string; // ISO
  status: Status;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  type?: string;
  budget?: string;
  description: string;
  locale: string;
  ip?: string;
};

export type Review = {
  id: number;
  createdAt: string; // ISO
  status: Status;
  name: string;
  role?: string;
  rating: number;
  quote: string;
  locale: string;
  ip?: string;
};

type DB = {
  seqLead: number;
  seqReview: number;
  leads: Lead[];
  reviews: Review[];
};

const DATA_DIR =
  process.env.DATA_DIR && process.env.DATA_DIR.trim()
    ? process.env.DATA_DIR.trim()
    : path.join(process.cwd(), ".data");

const DB_FILE = path.join(DATA_DIR, "buildbyalex.json");

const EMPTY: DB = { seqLead: 0, seqReview: 0, leads: [], reviews: [] };

// In-process mutex: every mutation chains onto the previous one so reads/writes
// never interleave within this process.
let chain: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  // Keep the chain alive even if a task rejects.
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function read(): Promise<DB> {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<DB>;
    return {
      seqLead: parsed.seqLead ?? 0,
      seqReview: parsed.seqReview ?? 0,
      leads: Array.isArray(parsed.leads) ? parsed.leads : [],
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
    };
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return { ...EMPTY };
    // Corrupt file — don't blow away data silently; surface it.
    throw err;
  }
}

async function write(db: DB): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DB_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, DB_FILE);
}

export type NewLead = Omit<Lead, "id" | "createdAt" | "status">;
export type NewReview = Omit<Review, "id" | "createdAt" | "status">;

export function addLead(data: NewLead): Promise<Lead> {
  return withLock(async () => {
    const db = await read();
    const lead: Lead = {
      id: db.seqLead + 1,
      createdAt: new Date().toISOString(),
      status: "new",
      ...data,
    };
    db.seqLead = lead.id;
    db.leads.push(lead);
    await write(db);
    return lead;
  });
}

export function addReview(data: NewReview): Promise<Review> {
  return withLock(async () => {
    const db = await read();
    const review: Review = {
      id: db.seqReview + 1,
      createdAt: new Date().toISOString(),
      status: "new",
      ...data,
    };
    db.seqReview = review.id;
    db.reviews.push(review);
    await write(db);
    return review;
  });
}

export type Page<T> = {
  items: T[];
  total: number;
  page: number;
  pages: number;
  pageSize: number;
};

function paginate<T>(all: T[], page: number, pageSize: number): Page<T> {
  const total = all.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(Math.max(0, page), pages - 1);
  const start = p * pageSize;
  return {
    items: all.slice(start, start + pageSize),
    total,
    page: p,
    pages,
    pageSize,
  };
}

export async function listLeads(opts: {
  page?: number;
  pageSize?: number;
  onlyNew?: boolean;
}): Promise<Page<Lead>> {
  const db = await read();
  let all = [...db.leads].sort((a, b) => b.id - a.id);
  if (opts.onlyNew) all = all.filter((l) => l.status === "new");
  return paginate(all, opts.page ?? 0, opts.pageSize ?? 6);
}

export async function listReviews(opts: {
  page?: number;
  pageSize?: number;
  onlyNew?: boolean;
}): Promise<Page<Review>> {
  const db = await read();
  let all = [...db.reviews].sort((a, b) => b.id - a.id);
  if (opts.onlyNew) all = all.filter((r) => r.status === "new");
  return paginate(all, opts.page ?? 0, opts.pageSize ?? 6);
}

export async function getLead(id: number): Promise<Lead | undefined> {
  const db = await read();
  return db.leads.find((l) => l.id === id);
}

export async function getReview(id: number): Promise<Review | undefined> {
  const db = await read();
  return db.reviews.find((r) => r.id === id);
}

export function setLeadStatus(id: number, status: Status): Promise<Lead | undefined> {
  return withLock(async () => {
    const db = await read();
    const lead = db.leads.find((l) => l.id === id);
    if (!lead) return undefined;
    lead.status = status;
    await write(db);
    return lead;
  });
}

export function setReviewStatus(
  id: number,
  status: Status,
): Promise<Review | undefined> {
  return withLock(async () => {
    const db = await read();
    const review = db.reviews.find((r) => r.id === id);
    if (!review) return undefined;
    review.status = status;
    await write(db);
    return review;
  });
}

export type Stats = {
  leads: { total: number; new: number; in_progress: number; done: number; last7: number };
  reviews: { total: number; new: number; last7: number; avgRating: number };
};

export async function getStats(): Promise<Stats> {
  const db = await read();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const last7 = (rows: { createdAt: string }[]) =>
    rows.filter((r) => new Date(r.createdAt).getTime() >= weekAgo).length;
  const count = (rows: { status: Status }[], s: Status) =>
    rows.filter((r) => r.status === s).length;
  const avg =
    db.reviews.length === 0
      ? 0
      : db.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / db.reviews.length;
  return {
    leads: {
      total: db.leads.length,
      new: count(db.leads, "new"),
      in_progress: count(db.leads, "in_progress"),
      done: count(db.leads, "done"),
      last7: last7(db.leads),
    },
    reviews: {
      total: db.reviews.length,
      new: count(db.reviews, "new"),
      last7: last7(db.reviews),
      avgRating: Math.round(avg * 10) / 10,
    },
  };
}
