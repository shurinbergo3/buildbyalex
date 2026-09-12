# Карта семантики страниц услуг

Собрано 12.09.2026 из Google Suggest (клиент `chrome`, `hl`/`gl` под каждую локаль):
~11 000 живых подсказок по 12 разделам × 4 локали, две волны сидов. Сырые выборки не
хранятся в репозитории, здесь - итоговая карта и решения по ней.

Данных Search Console на момент сбора не было, поэтому частотность не указана: приоритет
внутри кластера определялся по тому, сколько раз запрос всплывал в разных ветках подсказок.

## Как ключи разложены по странице

| Элемент | Что несёт |
|---|---|
| `meta.title` | головной ключ + один вариант формулировки, без цены (цена ушла в description) |
| `meta.description` | 2-3 ключа, стартовая цена, срок |
| `headline` (H1) | головной ключ в живой формулировке |
| `lead` | синонимы головного («создание» / «разработка» / «на заказ» / «под ключ») |
| `answers` (новый блок) | короткие самодостаточные ответы: цена, срок, стек, что входит, гео, чей результат |
| `industries` (новый блок) | отраслевой long-tail: «сайт для клиники», «strona dla kancelarii» и т.п. |
| `faq` | +4-6 вопросов, сформулированных дословно как запросы |
| `seo.aliases` | синонимы в `Service.alternateName` и `provider.knowsAbout` в JSON-LD |

Блок `answers` стоит сразу под hero: это самый цитируемый фрагмент для AI Overviews,
ChatGPT и Perplexity - каждая строка отвечает на вопрос целиком, без контекста остальной
страницы.

## Головные и второстепенные кластеры

### Сайты · `/services/websites`

- **RU:** разработка сайтов · создание сайта под ключ · заказать сайт · разработка сайта на
  заказ · сайт для бизнеса · лендинг под ключ · одностраничный сайт · корпоративный сайт ·
  редизайн сайта · многоязычный сайт
- **PL:** tworzenie stron internetowych · **projektowanie stron internetowych / stron www**
  (второй по объёму кластер, до правок не был закрыт вообще) · strona internetowa dla firmy ·
  wykonanie strony www · strony na zamówienie / na zlecenie · ile kosztuje strona internetowa ·
  cennik · agencja interaktywna · redesign strony · strona wizytówka · strona one page
- **EN:** custom website development · website development services · hire a web developer ·
  small business website design · corporate website development · website redesign services
- **UA:** розробка сайтів · створення сайту під ключ · замовити сайт · вартість сайту

Отраслевой long-tail (закрыт блоком `industries`): клиника и стоматология, юрист и кадровая
фирма, ресторан, салон красоты, стройка и ремонт, производство и B2B, транспорт, онлайн-школа,
услуги с выездом. В PL это отдельный сильный кластер: `strona dla kancelarii`,
`strona internetowa dla gabinetu / restauracji / hotelu / salonu`.

### Интернет-магазины · `/services/online-store`

- **RU:** разработка интернет-магазина · создать интернет-магазин · интернет-магазин под ключ ·
  сколько стоит интернет-магазин · разработка сайта интернет-магазина · купить магазин под ключ
- **PL:** tworzenie sklepów internetowych · ile kosztuje sklep internetowy (+ prosty / mały /
  profesjonalny / gotowy) · sklep internetowy cennik · wdrożenie Shopify · migracja sklepu ·
  integracja z Allegro (BaseLinker, InPost, WooCommerce, PrestaShop, hurtownia) · sklep B2B
- **EN:** ecommerce development company · custom ecommerce development · build an online store ·
  B2B ecommerce development · ecommerce website cost
- **UA:** розробка інтернет-магазину · створити інтернет-магазин · інтернет-магазин під ключ

### AI-агенты и чат-боты · `/services/ai-agents`

- **RU:** разработка чат-бота (под ключ / на заказ / цена) · разработка чат-ботов · внедрение
  искусственного интеллекта в бизнес · ИИ для бизнеса · чат-бот для сайта · бот для WhatsApp ·
  голосовой AI-агент · внедрение ИИ в отдел продаж
- **PL:** wdrożenie AI w firmie · wdrożenia sztucznej inteligencji · chatbot dla firmy ·
  wdrożenie chatbota · agent AI (cena, ile kosztuje) · voicebot dla firm · sztuczna inteligencja
  w firmach · automatyzacja obsługi klienta AI
- **EN:** AI agent development (company / cost / for business) · AI chatbot development services ·
  AI integration services · RAG chatbot · AI voice agent for customer service
- **UA:** розробка чат-бота · впровадження штучного інтелекту · ШІ для бізнесу

### Автоматизация · `/services/automation`

- **RU:** автоматизация бизнес-процессов (под ключ / заказать / услуги) · интеграция CRM
  (с сайтом, телефонией, мессенджерами) · интеграция amoCRM с Telegram / WhatsApp /
  Google-таблицами / 1С · настройка n8n · внедрение Битрикс24
- **PL:** automatyzacja procesów biznesowych · automatyzacja procesów w firmie · automatyzacja
  procesów finansowych / w logistyce / w biurze rachunkowym · robotyzacja procesów RPA ·
  wdrożenie n8n · integracja systemów · automatyzacja raportowania · automatyzacja sprzedaży B2B
- **EN:** business process automation services · workflow automation services · n8n developer ·
  CRM integration services · hire Zapier consultant
- **UA:** автоматизація бізнес-процесів · інтеграція CRM · налаштування n8n

Осторожно с PL: `automatyzacja procesów biznesowych` в подсказках сильно забит вузовскими
запросами (UŁ, SGH, Koźmiński, studia podyplomowe). Коммерческий трафик идёт по
`automatyzacja procesów w firmie` и по названиям инструментов.

### Мобильные приложения · `/services/mobile-apps`

- **RU:** разработка мобильных приложений · заказать приложение (цена / под ключ) · разработка
  приложений на заказ · создать приложение для бизнеса · сколько стоит приложение · приложение
  для iOS и Android · мобильная разработка · разработчик мобильных приложений · сколько стоит
  публикация в App Store
- **PL:** tworzenie aplikacji mobilnych · aplikacja mobilna dla firmy · ile kosztuje aplikacja
  mobilna · koszt stworzenia aplikacji · aplikacje mobilne na zamówienie · firma tworząca
  aplikacje mobilne · publikacja aplikacji w Google Play / App Store
- **EN:** mobile app development company · app development cost (огромный кластер) · React Native
  development company · cross-platform app development · MVP app development · app development
  for startups · hire React Native developers
- **UA:** розробка мобільних додатків · створення мобільного додатку · вартість розробки додатку

### Telegram-боты · `/services/telegram-bots`

- **RU:** разработка телеграм-бота (под ключ / на заказ / цена / стоимость) · заказать телеграм
  бота · бот для приёма заказов · бот с оплатой · создать бота для канала · telegram mini app ·
  разработка Telegram Web App
- **PL:** bot Telegram dla firmy · stworzenie bota Telegram · Telegram Mini App · bot do zamówień ·
  bot do rezerwacji · chatbot Telegram cena
- **EN:** telegram bot development (services / company / price) · telegram mini app development ·
  hire telegram bot developer
- **UA:** розробка телеграм-бота · замовити телеграм бота · Telegram Mini App

### Реклама · `/services/advertising`

- **RU:** настройка Google Ads · настройка контекстной рекламы под ключ · настройка рекламы цена ·
  ведение контекстной рекламы · специалист по Google Ads · настройка рекламы в Meta
- **PL:** prowadzenie kampanii Google Ads (cennik) · agencja Google Ads · specjalista Google Ads
  Warszawa · obsługa Google Ads cena · reklama Google cena / cennik · kampanie Facebook Ads cennik ·
  certyfikowany specjalista Google Ads
- **EN:** Google Ads management services · PPC management agency · Google Ads freelancer ·
  Facebook Ads management
- **UA:** налаштування Google Ads · ведення реклами · реклама в гугл ціна

### Офферы с фиксированной ценой

- **AI-аудит:** аудит внедрения ИИ · консультация по ИИ · PL `audyt AI w firmie`, `doradztwo AI`,
  `konsultacje AI`, `konsultant ds. wdrożeń AI`, `audyt procesów biznesowych` · EN
  `AI readiness assessment`, `AI consulting`
- **Документы:** автоматизация документооборота · распознавание счетов · PL `automatyzacja faktur`,
  `automatyzacja fakturowania`, `OCR dokumentów`, `elektroniczny obieg faktur`,
  `automatyzacja księgowości`, `automatyzacja KSeF` · EN `document automation services`,
  `invoice OCR automation`
- **AI Act:** PL `zgodność z AI Act`, `obowiązki AI Act`, `oznaczenie chatbota`,
  `akt o sztucznej inteligencji` · RU `соответствие AI Act`, `маркировка чат-бота` · EN
  `EU AI Act compliance`, `AI Act chatbot disclosure`
- **Видимость в AI:** `answer engine optimization` (сформировавшийся кластер с собственными
  подсказками), `generative engine optimization`, PL `optymalizacja pod AI`, `pozycjonowanie w AI`,
  RU `продвижение в ChatGPT`, `оптимизация под AI-поиск`

## Что намеренно не закрывали посадочными

- **Городские подстраницы** (`/uslugi/.../krakow`) - решение от 16.08.2026 в силе: города
  закрыты статьями блога, а на страницах услуг - `areaServed` со списком городов в JSON-LD
  и ответ «вся Польша» в блоке `answers` и в FAQ.
- **Информационные запросы** («jak założyć sklep internetowy», «как создать приложение»,
  «tworzenie stron internetowych od podstaw») - это блог, не money-страница.
- **Запросы обучения и вакансий** («kurs», «praca», «ryczałt», «PKD», «INF.03») - отфильтрованы
  как нецелевые.

## Кандидаты в блог из несобранного спроса

Кластеры с коммерческим или околокоммерческим интентом, у которых нет своей страницы:

1. PL `projektowanie stron internetowych` как отдельный разбор процесса (сейчас только вкраплён
   в money-страницу).
2. PL `integracja Allegro z ...` - серия: BaseLinker, InPost, WooCommerce, PrestaShop, hurtownia.
3. PL `robotyzacja procesów RPA` vs автоматизация на n8n.
4. RU/PL «интеграция amoCRM / Bitrix24 с Telegram и WhatsApp» - отдельный практический разбор.
5. EN `app development cost` - калькулятор и разбор вилок по рынкам (очень объёмный кластер).
6. PL `automatyzacja faktur kosztowych` и `obieg faktur w firmie` под оффер документов.
7. `answer engine optimization` / `AEO` - терминологический хаб под оффер видимости в AI.

## Как повторить сбор

Скрипты сбора лежали в scratchpad сессии и в репозиторий не переносились. Схема простая:
`https://suggestqueries.google.com/complete/search?client=chrome&ie=utf-8&oe=utf-8&hl=<lang>&gl=pl&q=<seed>`,
по 3 головных сида на раздел раскрываются алфавитом (`seed + пробел + буква`), остальные
запрашиваются как есть. Больше 20 параллельных запросов Google начинает отбивать пустыми
ответами - тогда помогает пауза и 5 потоков.
