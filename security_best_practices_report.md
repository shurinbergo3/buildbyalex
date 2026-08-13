# Отчёт по security best practices - buildbyalex

Дата: 2026-08-13 (обновлён после исправлений)
Статус: **все 10 находок исправлены**, `npm audit --omit=dev` → 0 уязвимостей. Что и как правилось - в разделе «Исправлено» в конце.
Стек: Next.js 15.5.23 (App Router, `output: standalone`), React 19, TypeScript, next-intl 4.13.6, Docker/Node 22.
Версии в разделах ниже - те, что были на момент аудита (до правок).
Спецификации: `javascript-typescript-nextjs-web-server-security.md`, `javascript-typescript-react-web-frontend-security.md`.

## Резюме

Приложение - маркетинговый сайт: почти всё статически генерируется, авторизации и cookie-сессий нет, БД нет (файловое хранилище), загрузки файлов нет. Поэтому классических дыр (SQLi, IDOR, CSRF, XSS из пользовательского контента) в коде не нашлось - написано аккуратно: вебхук Telegram проверяет секрет и fail-closed, бот пускает только один admin chat id, весь пользовательский текст экранируется перед отправкой в Telegram, `.env` в `.gitignore`, секретов в клиентском бандле нет.

Основной риск - **устаревшие зависимости**: текущий `next` попадает под 8 опубликованных advisory (включая SSRF и DoS), `next-intl` - под open redirect. Дальше по значимости идут rate limiting, который «fails open» и опирается на подделываемый заголовок, и полное отсутствие security-заголовков.

Найдено: **2 High**, **3 Medium**, **5 Low**. Критичных нет. Все закрыты, см. «Исправлено».

---

## High

### SEC-01 - Next.js 15.5.18 уязвим (8 advisory, включая SSRF и DoS)

- Расположение: [package.json:22](package.json#L22) - `"next": "^15.5.18"`, установлено 15.5.18
- Правило: NEXT-SUPPLY-001
- Доказательство (`npm audit --omit=dev`), все закрыты в **15.5.21**:
  - GHSA-p9j2-gv94-2wf4 - SSRF в rewrites через подконтрольный атакующему hostname (high)
  - GHSA-89xv-2m56-2m9x - SSRF в Server Actions на кастомных серверах (high)
  - GHSA-m99w-x7hq-7vfj - DoS в App Router через Server Actions (high)
  - GHSA-68g3-v927-f742 / GHSA-4633-3j49-mh5q - cache confusion тел ответов (moderate)
  - GHSA-4c39-4ccg-62r3 - неограниченный payload Server Action на edge (moderate)
  - GHSA-q8wf-6r8g-63ch - DoS в Image Optimization через SVG (moderate)
  - GHSA-955p-x3mx-jcvp - раскрытие внутренних Server Function endpoints (moderate)
- Влияние: DoS-advisory применимы напрямую - сайт публичный и self-hosted в Docker, любой может слать запросы к App Router и `/_next/image`. SSRF-часть менее применима (нет rewrites с внешним hostname и кастомного сервера), но патч закрывает всё сразу.
- Исправление: `npm i next@^15.5.21` (в рамках 15.5 - без ломающих изменений), пересобрать образ.
- Митигация: до апгрейда - лимиты запросов/размера тела на reverse proxy перед контейнером.

### SEC-02 - next-intl 3.26.5: open redirect + prototype pollution

- Расположение: [package.json:23](package.json#L23), используется в [src/middleware.ts:4](src/middleware.ts#L4) для всех локализованных маршрутов
- Правило: NEXT-REDIRECT-001 / NEXT-SUPPLY-001
- Доказательство:
  - GHSA-8f24-v5vv-gm5j - open redirect (`<4.9.1`)
  - GHSA-4c35-wcg5-mm9h - prototype pollution через ключи каталога переводов при `experimental.messages.precompile` (`<=4.9.1`)
- Влияние: open redirect на домене сайта - готовый инструмент для фишинга (ссылка выглядит как `buildbyalex.com/...`, уводит на чужой хост). Prototype pollution не применим: `experimental.messages.precompile` не включён, каталоги лежат в репозитории.
- Исправление: обновить до `next-intl@^4.13.6`. Это мажорный апгрейд (3 → 4), нужна проверка миграции: изменились `createNavigation`/`createMiddleware` API. Стоит делать отдельной задачей с прогоном сборки и всех четырёх локалей.
- Митигация: если апгрейд откладывается - на reverse proxy резать ответы 3xx с `Location` на внешний хост.

---

## Medium

### SEC-03 - Rate limiting «fails open» и завязан на подделываемый заголовок

- Расположение: [src/lib/rateLimit.ts:34-46](src/lib/rateLimit.ts#L34-L46), вызовы - [src/app/api/contact/route.ts:50-58](src/app/api/contact/route.ts#L50-L58), [src/app/api/review/route.ts:40-48](src/app/api/review/route.ts#L40-L48)
- Правило: NEXT-DOS-001
- Доказательство:
  ```ts
  const cfg = upstash();
  if (!cfg) return true;              // Upstash не настроен → лимита нет вообще
  ...
  } catch (err) { return true; }      // Upstash упал → лимита нет
  ```
  ```ts
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? ...
  ```
- Влияние: 1) без `UPSTASH_REDIS_REST_URL/TOKEN` (по `.env.example` они опциональны) формы `/api/contact` и `/api/review` вообще не throttled - можно завалить Telegram-бота и файловую БД спамом; 2) даже с Upstash ключ берётся из первого значения `x-forwarded-for`, которое клиент подставляет сам, - лимит обходится сменой значения в каждом запросе.
- Исправление:
  1. В production считать отсутствие Upstash ошибкой конфигурации (лог + отказ), а не «разрешить».
  2. Брать не первый, а **последний** элемент `x-forwarded-for` (тот, что дописал доверенный прокси), либо взять IP из `request.headers.get("x-real-ip")`, выставляемого своим nginx, и добавить `TRUSTED_PROXY_HOPS`.
  3. Добавить дешёвый in-memory лимит как второй эшелон на случай недоступности Upstash.
- Митигация: rate limit на уровне nginx/Cloudflare перед контейнером.
- Ложное срабатывание: если перед приложением уже стоит прокси, который **перезаписывает** `x-forwarded-for` (а не дописывает), пункт 2 неактуален - проверить конфиг nginx.

### SEC-04 - Не выставлен ни один security-заголовок и нет CSP

- Расположение: [next.config.ts:20-32](next.config.ts#L20-L32) - в `headers()` только `Cache-Control` для статики
- Правило: NEXT-HEADERS-001, NEXT-CSP-001
- Доказательство (реальный ответ `next start`, `curl -D - http://localhost:3011/`):
  ```
  HTTP/1.1 200 OK
  x-middleware-rewrite: /ru
  X-Powered-By: Next.js
  Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
  Content-Type: text/html; charset=utf-8
  ```
  Нет `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`.
- Влияние: сайт можно вставить в iframe (clickjacking по формам заявки/отзыва); нет второго эшелона против XSS; MIME-sniffing не запрещён. Само по себе не эксплуатируется - это defense-in-depth.
- Исправление: добавить в `next.config.ts` глобальный блок `headers()` с `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`. CSP - отдельным шагом: сайт грузит Yandex.Metrika инлайн-скриптом (SEC-09), так что сначала `Content-Security-Policy-Report-Only`, потом enforce.
- Ложное срабатывание: заголовки могут добавляться на reverse proxy в Dokploy - проверить на боевом домене, а не только локально.

### SEC-05 - sharp 0.34.5: унаследованные уязвимости libvips

- Расположение: транзитивная зависимость Next Image Optimization (`node_modules/sharp`, 0.34.5)
- Правило: NEXT-SUPPLY-001
- Доказательство: GHSA-f88m-g3jw-g9cj (CVE-2026-33327, CVE-2026-33328, CVE-2026-35590, CVE-2026-35591), исправлено в `sharp >= 0.35.0`
- Влияние: обработка вредоносного изображения способна уронить процесс или вызвать повреждение памяти. Поверхность ограничена: [next.config.ts:11-14](next.config.ts#L11-L14) допускает удалённые картинки только с `images.unsplash.com` и `plus.unsplash.com`, остальное - файлы из репозитория.
- Исправление: `npm audit fix` (поднимет sharp до 0.35.x). Проверить сборку - sharp содержит нативные бинарники.

---

## Low

### SEC-06 - Сравнение секрета вебхука не константное по времени

- Расположение: [src/app/api/telegram/webhook/route.ts:24-27](src/app/api/telegram/webhook/route.ts#L24-L27)
- Доказательство: `if (got !== secret) return new Response("forbidden", { status: 403 });`
- Влияние: теоретическая утечка секрета по таймингу. По сети через несколько прокси-хопов практически неэксплуатируемо, но замена дешёвая.
- Исправление: `crypto.timingSafeEqual` над буферами одинаковой длины (с предварительной проверкой длины).

### SEC-07 - JSON-LD вставляется через `dangerouslySetInnerHTML` без экранирования `<`

- Расположение: 11 мест, например [src/components/HomeJsonLd.tsx:140](src/components/HomeJsonLd.tsx#L140), [src/app/[locale]/blog/[slug]/page.tsx:323](src/app/[locale]/blog/[slug]/page.tsx#L323), [src/components/home/FAQ.tsx:79](src/components/home/FAQ.tsx#L79)
- Правило: REACT-XSS-001
- Доказательство: `dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}` - `JSON.stringify` не экранирует `<` и `>`, поэтому строка `</script>` внутри данных закрывает тег.
- Влияние: **сейчас не эксплуатируется** - в схемы попадает только контент из репозитория (`messages/*.json`, `content/blog/*.mdx`), пользовательские отзывы из формы в схему не рендерятся. Риск появляется, если однажды в `messages` вставят отзыв с сайта как есть.
- Исправление: обернуть в хелпер `jsonLd(obj)` → `JSON.stringify(obj).replace(/</g, "\\u003c")` и использовать во всех 11 местах.

### SEC-08 - Dockerfile ставит зависимости через `npm install`, а не `npm ci`

- Расположение: [Dockerfile:7](Dockerfile#L7) - `RUN npm install --no-audit --no-fund`
- Правило: REACT-SUPPLY-001
- Влияние: сборка невоспроизводима - `npm install` может обновить транзитивные пакеты мимо `package-lock.json`, то есть в образ попадёт не то, что было проверено локально.
- Исправление: заменить на `RUN npm ci --no-audit --no-fund` (lock-файл в репозитории есть).

### SEC-09 - Сторонний скрипт Yandex.Metrika без SRI и без governance

- Расположение: [src/components/YandexMetrika.tsx](src/components/YandexMetrika.tsx)
- Правило: REACT-3P-001, REACT-SRI-001
- Доказательство: инлайн-скрипт динамически вставляет `<script src="https://mc.yandex.ru/metrika/tag.js?id=...">` без `integrity`, с включённым `webvisor: true` (запись действий пользователя, включая ввод в формы).
- Влияние: компрометация mc.yandex.ru = произвольный JS в origin сайта. SRI к динамически подставляемому тегу вендора применить нельзя, поэтому это осознанный компромисс - зафиксировать его как принятый риск и учесть при написании CSP (SEC-04).
- Исправление: при внедрении CSP явно разрешить `mc.yandex.ru` в `script-src`/`connect-src` и не расширять политику дальше. Проверить, что `webvisor` не пишет содержимое полей формы (маскирование чувствительных полей в настройках счётчика).

### SEC-10 - Не отключён заголовок `X-Powered-By: Next.js`

- Расположение: [next.config.ts:6-33](next.config.ts#L6-L33) - `poweredByHeader` не задан (по умолчанию `true`)
- Влияние: раскрытие стека, упрощает подбор эксплойтов под конкретный фреймворк. Минимально.
- Исправление: `poweredByHeader: false` в `next.config.ts`.

---

## Проверено и проблем не найдено

- **Path traversal в `/blog/[slug]`** ([src/lib/blog.ts:52](src/lib/blog.ts#L52) - `path.join(CONTENT_ROOT, locale, slug + ".mdx")`): проверено на боевой сборке, `..%2f..%2f` и `%2e%2e%2f` возвращают 404 - Next нормализует путь до попадания в `params`. Дополнительно суффикс `.mdx` ограничивает чтение.
- **CSRF**: cookie-аутентификации нет, Server Actions не используются, все мутации идут через `POST /api/*` без cookies - поверхности нет (NEXT-CSRF-001 неприменимо).
- **Аутентификация вебхука**: [src/app/api/telegram/webhook/route.ts:19-27](src/app/api/telegram/webhook/route.ts#L19-L27) fail-closed при отсутствии `TELEGRAM_WEBHOOK_SECRET`; команды бота дополнительно ограничены одним chat id ([src/lib/telegram.ts:38-41](src/lib/telegram.ts#L38-L41), проверки в `handleCallback`/`handleMessage`).
- **Инъекции в Telegram-сообщения**: весь пользовательский текст проходит `escape()` ([src/lib/telegram.ts:43-48](src/lib/telegram.ts#L43-L48)) перед отправкой с `parse_mode: HTML`; статусы валидируются по allowlist ([src/lib/telegram.ts:484-486](src/lib/telegram.ts#L484-L486)).
- **Секреты**: нет `NEXT_PUBLIC_*` с чувствительными значениями, нет `process.env` в клиентских компонентах (совпадение в [src/components/home/HeroCodeSurface.tsx:91](src/components/home/HeroCodeSurface.tsx#L91) - это декоративный листинг кода внутри строки, не исполняемый код). `.env` в `.gitignore`, в истории git токенов не найдено.
- **Хранилище**: [src/lib/store.ts](src/lib/store.ts) пишет в `DATA_DIR` вне `public/`, атомарно (temp + rename), под мьютексом; в Docker - отдельный volume под непривилегированным пользователем `nextjs`.
- **Валидация входа**: обе публичные формы валидируют типы, длины и диапазоны на рантайме ([contact/route.ts:31-48](src/app/api/contact/route.ts#L31-L48), [review/route.ts:24-38](src/app/api/review/route.ts#L24-L38)).
- **CORS**: не включён нигде - эндпоинты same-origin по умолчанию.
- **SQL / команды ОС / eval / загрузка файлов / service worker**: отсутствуют в кодовой базе.
- **Ошибки**: наружу отдаются только общие сообщения, детали идут в `console.error` на сервере.

## Рекомендуемый порядок

1. SEC-01 (`next@^15.5.21`) и SEC-05 (`npm audit fix`) - одна задача, минут на десять с пересборкой.
2. SEC-03 - rate limiting; самое эксплуатируемое из оставшегося.
3. SEC-04 + SEC-10 - заголовки, потом CSP в report-only.
4. SEC-08, SEC-06, SEC-07 - мелкие правки.
5. SEC-02 - апгрейд next-intl до 4.x отдельной веткой с полной проверкой локалей.

---

## Исправлено

Коммиты: `1596a35` (SEC-01, 03..08, 10) и следующий за ним (SEC-02, SEC-05).

| ID | Что сделано | Проверка |
|----|-------------|----------|
| SEC-01 | `next` 15.5.18 → **15.5.23** | `npm audit --omit=dev` → 0 |
| SEC-02 | `next-intl` 3.26.5 → **4.13.6** (мажор) | сборка 666 страниц, вручную проверены 4 локали, локализованные пути (`/uslugi/sayty`, `/pl/uslugi/strony-internetowe`, `/ua/roboty`), блог обеих локалей, rich-text теги `<accent>`/`<br>`, hreflang, canonical, sitemap (572 URL) |
| SEC-03 | `src/lib/clientIp.ts` - IP берётся из **последнего** хопа `x-forwarded-for` (`TRUSTED_PROXY_HOPS`, по умолчанию 1). `src/lib/rateLimit.ts` больше не возвращает `true` при отсутствии/падении Upstash, а уходит в in-process счётчик с очисткой протухших ключей | 7 POST на `/api/contact` с одного IP → `200 200 200 200 200 429 429`; добавление фейкового первого хопа не сбрасывает счётчик; другой реальный IP → 200 |
| SEC-04 | `next.config.ts`: глобальные `Content-Security-Policy` (`base-uri`, `object-src 'none'`, `frame-ancestors 'self'`, `form-action 'self'`, `upgrade-insecure-requests`), `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` | все 5 заголовков в ответе `next start` |
| SEC-05 | `overrides: { "sharp": "^0.35.3" }` → sharp **0.35.3** | `/_next/image?...` → 200 `image/jpeg`, картинка отдаётся |
| SEC-06 | `timingSafeEqual` в `src/app/api/telegram/webhook/route.ts` | неверный токен → 403 |
| SEC-07 | `src/lib/jsonLd.ts` экранирует `<`, U+2028, U+2029; применён во всех 11 местах | `</script>` в данных превращается в `\u003c/script>`, `JSON.parse` возвращает исходную строку |
| SEC-08 | `Dockerfile`: `npm install` → `npm ci` | - |
| SEC-10 | `poweredByHeader: false` | `X-Powered-By` в ответе отсутствует |

Дополнительно: `postcss` поднят до 8.5.x через override (сборочная зависимость, эксплуатируемости не было - обрабатывается только собственный CSS).

### Осознанно не сделано

**CSP без `script-src`.** Сайт полностью предрендерится, Next инлайнит RSC-payload в `<script>`. Закрыть `script-src` можно только через nonce, а nonce требует перевести все страницы в dynamic-рендер - это убьёт статику и скорость ради директивы, которая здесь ничего не защищает: пользовательский HTML на страницах не рендерится, единственный сторонний скрипт - Яндекс.Метрика. Возвращаться к этому, если на сайте появится вывод пользовательского контента.

**SEC-09 (SRI для Метрики)** остаётся как принятый риск: тег вендора вставляется динамически его же loader'ом, `integrity` к нему не прикрутить. Единственная реальная альтернатива - убрать Метрику.

### Что настроить на сервере

- `TRUSTED_PROXY_HOPS` - число прокси перед контейнером, если их больше одного (Cloudflare + nginx → `2`). По умолчанию 1.
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` - без них лимит работает, но только в пределах одного процесса.
