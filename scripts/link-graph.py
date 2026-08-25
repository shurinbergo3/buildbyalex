#!/usr/bin/env python3
"""Internal link graph for content/blog.

Builds the blog->blog / blog->money-page graph straight from the MDX sources and
the routing/cluster tables in src/, then reports orphans, hubs, anchor spread,
topic balance and keyword cannibalisation per locale.

    python3 scripts/link-graph.py            # full report
    python3 scripts/link-graph.py --orphans  # only the orphan list
"""
import os, re, sys, json, datetime, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG = os.path.join(ROOT, "content", "blog")
LOCALES = ["ru", "en", "pl", "ua"]
TODAY = datetime.date.today().isoformat()

FM_RE = re.compile(r"^---\n(.*?)\n---\n", re.S)
MD_LINK = re.compile(r"\[([^\]\[]*)\]\((/[^)\s]*)\)")


def load_pathnames():
    src = open(os.path.join(ROOT, "src", "i18n", "routing.ts"), encoding="utf8").read()
    block = re.search(r"pathnames:\s*\{(.*)\n  \},", src, re.S).group(1)
    rev, canon_key = {}, None
    for line in block.split("\n"):
        m = re.match(r'\s*"(/[^"]*)":', line)
        if m:
            canon_key = m.group(1)
            m2 = re.match(r'\s*"(/[^"]*)":\s*"(/[^"]*)"', line)
            if m2:
                for loc in LOCALES:
                    rev[(loc, m2.group(2))] = canon_key
            continue
        m3 = re.match(r'\s*(ru|en|pl|ua):\s*"(/[^"]*)"', line)
        if m3 and canon_key:
            rev[(m3.group(1), m3.group(2))] = canon_key
    return rev


def load_cluster_map():
    src = open(os.path.join(ROOT, "src", "lib", "blog.ts"), encoding="utf8").read()
    block = re.search(r"clusterToService: Record<[^>]*> = \{(.*?)\n\};", src, re.S).group(1)
    return {m.group(1): m.group(2) for m in re.finditer(r'"([^"]+)":\s*\{\s*menuKey:\s*"([a-z]+)"', block)}


def parse_frontmatter(raw):
    mo = FM_RE.match(raw)
    if not mo:
        return {}, raw
    fm, cur = {}, None
    for line in mo.group(1).split("\n"):
        if re.match(r"^\s*-\s", line) and cur:
            fm.setdefault(cur + "#list", []).append(line.strip()[2:].strip().strip("\"'"))
            continue
        m = re.match(r"^([A-Za-z_]+):\s*(.*)$", line)
        if m:
            cur, val = m.group(1), m.group(2).strip()
            if val.startswith("[") and val.endswith("]"):
                fm[cur + "#list"] = [x.strip().strip("\"'") for x in val[1:-1].split(",") if x.strip()]
                val = ""
            fm[cur] = val.strip("\"'")
    return fm, raw[mo.end():]


REV = load_pathnames()
CLUSTER = load_cluster_map()


def menu_key(cluster):
    return CLUSTER.get(cluster) or CLUSTER.get(re.sub(r"-(en|pl|ru|ua)$", "", cluster))


posts = {}
for loc in LOCALES:
    for name in sorted(os.listdir(os.path.join(BLOG, loc))):
        if not name.endswith(".mdx"):
            continue
        fm, body = parse_frontmatter(open(os.path.join(BLOG, loc, name), encoding="utf8").read())
        posts[(loc, name[:-4])] = dict(
            fm=fm, body=body, cluster=fm.get("cluster", ""), date=str(fm.get("date", "")),
            keywords=[k.lower().strip() for k in fm.get("keywords#list", [])],
            words=len(body.split()), live=str(fm.get("date", "")) <= TODAY,
        )
live = {k: v for k, v in posts.items() if v["live"]}

inbound, outbound = collections.Counter(), collections.Counter()
anchors = collections.defaultdict(collections.Counter)
svc_hits, svc_posts = collections.Counter(), collections.defaultdict(set)
money_posts = collections.defaultdict(lambda: collections.defaultdict(set))
broken, cross, within = [], 0, 0

for key, p in posts.items():
    loc = key[0]
    for m in MD_LINK.finditer(p["body"]):
        anchor = m.group(1).strip()
        href = m.group(2).split("#")[0].split("?")[0].rstrip("/") or "/"
        pref = re.match(r"^/(en|pl|ua|ru)(/|$)", href)
        hloc = pref.group(1) if pref else "ru"
        rest = re.sub(r"^/(en|pl|ua|ru)(?=/|$)", "", href) or "/"
        bm = re.match(r"^/blog/([^/]+)$", rest)
        if bm:
            tgt = (hloc, bm.group(1))
            if tgt not in posts:
                broken.append((key, href))
                continue
            inbound[tgt] += 1
            outbound[key] += 1
            anchors[tgt][anchor] += 1
            if key in live and tgt in live:
                if menu_key(posts[tgt]["cluster"]) == menu_key(p["cluster"]):
                    within += 1
                else:
                    cross += 1
            continue
        canon = REV.get((hloc, rest))
        if canon and canon.startswith("/services/"):
            svc_hits[(loc, canon)] += 1
            svc_posts[loc].add(key)
            anchors[canon][anchor] += 1
        elif canon in ("/contact", "/pricing", "/work", "/about"):
            money_posts[loc][canon].add(key)

# related-posts module (mirrors getRelatedPosts in src/lib/blog.ts)
related = collections.Counter()
for loc in LOCALES:
    ordered = sorted(((v["date"], k[1], v["cluster"]) for k, v in live.items() if k[0] == loc), reverse=True)
    for _, slug, cluster in ordered:
        mk = menu_key(cluster)
        others = [o for o in ordered if o[1] != slug]
        same = [o for o in others if mk and menu_key(o[2]) == mk]
        rest = [o for o in others if o not in same]
        for o in (same + rest)[:3]:
            related[(loc, o[1])] += 1

# blog links placed on the service pages (messages/<locale>.json)
resources = collections.Counter()
for loc in LOCALES:
    msg = json.load(open(os.path.join(ROOT, "messages", f"{loc}.json"), encoding="utf8"))
    for branch in ["websites", "store", "mobile", "ai", "automation", "telegram", "ads"]:
        for item in msg.get("services", {}).get(branch, {}).get("resources", {}).get("items", []):
            resources[(loc, item["slug"])] += 1

only_orphans = "--orphans" in sys.argv

print(f"files={len(posts)}  live={len(live)}  queued(future-dated)={len(posts) - len(live)}  today={TODAY}")
print(f"in-body blog->blog edges (live): within-topic={within} cross-topic={cross}  broken={len(broken)}\n")
print(f"{'loc':>4} {'live':>5} {'noInbody':>9} {'+noRelated':>11} {'+noService':>11} {'maxIn':>6}")
for loc in LOCALES:
    ks = [k for k in live if k[0] == loc]
    a = [k for k in ks if inbound[k] == 0]
    b = [k for k in a if related[k] == 0]
    c = [k for k in b if resources[k] == 0]
    print(f"{loc:>4} {len(ks):>5} {len(a):>9} {len(b):>11} {len(c):>11} {max(inbound[k] for k in ks):>6}")
    if only_orphans:
        for k in sorted(c):
            print(f"        content/blog/{k[0]}/{k[1]}.mdx")
if only_orphans:
    sys.exit(0)

print("\nhubs (in-body inbound >= 5):")
for loc in LOCALES:
    hot = sorted((k for k in live if k[0] == loc), key=lambda k: -inbound[k])
    print(f"  [{loc}] " + ", ".join(f"{k[1]}:{inbound[k]}" for k in hot if inbound[k] >= 5))

print("\nblog -> money pages (posts with >= 1 in-body link):")
for loc in LOCALES:
    n = sum(1 for k in posts if k[0] == loc)
    row = {p.rsplit("/", 1)[-1]: len(v) for p, v in money_posts[loc].items()}
    print(f"  [{loc}] services={len(svc_posts[loc])}/{n} " + " ".join(f"{k}={v}" for k, v in sorted(row.items())))
print("  service link hits:", {f"{l}:{c.rsplit('/', 1)[-1]}": n for (l, c), n in sorted(svc_hits.items())})

print("\nposts per topic (menuKey):")
buckets = collections.defaultdict(collections.Counter)
for k, p in live.items():
    buckets[k[0]][menu_key(p["cluster"]) or "UNMAPPED"] += 1
cols = ["websites", "store", "ai", "automation", "mobile", "ads", "telegram", "UNMAPPED"]
print("      " + " ".join(f"{c:>10}" for c in cols))
for loc in LOCALES:
    print(f"  {loc:>3} " + " ".join(f"{buckets[loc][c]:>10}" for c in cols))

print("\nunmapped clusters (no service link, no category chip):")
for k, p in sorted(live.items()):
    if menu_key(p["cluster"]) is None:
        print(f"  content/blog/{k[0]}/{k[1]}.mdx  cluster=\"{p['cluster']}\"")

print("\nkeyword cannibalisation (same locale, identical frontmatter keyword):")
kw = collections.defaultdict(list)
for k, p in live.items():
    for word in p["keywords"]:
        kw[(k[0], word)].append(k[1])
for (loc, word), slugs in sorted(kw.items(), key=lambda x: -len(x[1])):
    if len(set(slugs)) > 1:
        print(f"  [{loc}] \"{word}\" -> {', '.join(sorted(set(slugs)))}")

allanch = collections.Counter()
for tgt, c in anchors.items():
    allanch.update(c)
print(f"\nanchors: {len(allanch)} distinct / {sum(allanch.values())} links; top-10 = "
      f"{100 * sum(n for _, n in allanch.most_common(10)) / sum(allanch.values()):.0f}% of all")
for a, n in allanch.most_common(10):
    print(f"  {n:>4} {a[:70]}")
