import type { Locale } from "@/i18n/routing";

export const PRIVACY_EMAIL = "shurinbergo@gmail.com";
const FOUNDATION_EMAIL = "rodo@twojstartup.pl";

type Block = string | { list: string[] };
type PolicySection = { title: string; body: Block[] };

// Polish is the binding version: the site is run from Warsaw and answers to UODO.
// The project works inside the Twój StartUp incubator, whose rules make the
// beneficiary act on the foundation's behalf, so the foundation is the controller.
export const PRIVACY_POLICY: Record<Locale, PolicySection[]> = {
  pl: [
    {
      title: "1. Kto jest administratorem danych",
      body: [
        "Administratorem Twoich danych osobowych jest Fundacja Rozwoju Przedsiębiorczości „Twój StartUp” z siedzibą w Warszawie (ul. Żurawia 6/12 lok. 766, 00-503 Warszawa), wpisana do KRS pod numerem 0000442857, NIP 5213641211, REGON 14643346700000.",
        "Serwis buildbyalex.com prowadzi Evgenii Marchenko w ramach programu inkubacji Fundacji, dalej „my”.",
        `W sprawach danych przekazanych przez tę stronę pisz na ${PRIVACY_EMAIL}. Z Fundacją możesz się skontaktować pod adresem ${FOUNDATION_EMAIL}. Odpowiadamy bez zbędnej zwłoki, najpóźniej w ciągu miesiąca.`,
      ],
    },
    {
      title: "2. Jakie dane zbieramy i po co",
      body: [
        "**Formularz kontaktowy i formularz wyceny.** Zbieramy imię, e-mail lub telefon, a jeśli je podasz, także nazwę firmy, typ projektu, budżet i opis zadania. Zapisujemy też język strony i adres IP. Dane służą do odpowiedzi na zapytanie i przygotowania oferty (art. 6 ust. 1 lit. b RODO, działania przed zawarciem umowy na Twoje żądanie). Adres IP wykorzystujemy do ochrony formularzy przed spamem i nadużyciami (art. 6 ust. 1 lit. f RODO, prawnie uzasadniony interes).",
        "**Formularz opinii.** Zbieramy imię, ocenę, treść opinii i adres IP. Po sprawdzeniu opinia może zostać opublikowana na stronie razem z imieniem. Podstawą jest Twoja zgoda wyrażona przez wysłanie opinii (art. 6 ust. 1 lit. a RODO).",
        "**Analityka.** Tylko jeśli zgodzisz się na to w banerze cookies, korzystamy z Google Analytics 4. Widzimy wtedy, skąd przychodzą odwiedzający, które strony czytają, z jakich urządzeń korzystają i czy wysłali formularz (bez jego treści). Podstawą jest Twoja zgoda (art. 6 ust. 1 lit. a RODO oraz art. 399 ustawy Prawo komunikacji elektronicznej).",
        "**Reklama.** Jeśli zgodzisz się na kategorię „Marketingowe”, Google może wykorzystywać dane z wizyty do mierzenia skuteczności reklam Google Ads i wyświetlania reklam osobom, które odwiedziły stronę. Podstawą jest Twoja zgoda.",
        "**Logi serwera.** Serwer może rejestrować adres IP, datę i godzinę żądania, adres strony i typ przeglądarki. Robimy to dla bezpieczeństwa i diagnozowania błędów (art. 6 ust. 1 lit. f RODO).",
      ],
    },
    {
      title: "3. Pliki cookies i podobne technologie",
      body: [
        "Niezbędne, działają zawsze:",
        {
          list: [
            "NEXT_LOCALE: zapamiętuje wybrany język strony, 12 miesięcy.",
            "bba-consent (pamięć przeglądarki): zapamiętuje Twój wybór w banerze cookies, 12 miesięcy.",
            "Pamięć sesji przeglądarki: przekazuje imię z formularza na stronę podziękowania, do zamknięcia karty.",
          ],
        },
        "Analityczne, tylko za zgodą:",
        { list: ["_ga, _ga_*: Google Analytics 4, do 2 lat."] },
        "Zgodę możesz w każdej chwili zmienić lub wycofać przez link „Ustawienia cookies” w stopce strony. Po wycofaniu zgody usuwamy pliki cookies analityki i przestajemy ładować Google Analytics. Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania sprzed wycofania.",
      ],
    },
    {
      title: "4. Komu przekazujemy dane",
      body: [
        "Nie sprzedajemy danych. Korzystają z nich wyłącznie dostawcy, bez których strona nie działa:",
        {
          list: [
            "Hetzner Online GmbH (Niemcy): hosting. Serwer i zapisane zapytania znajdują się w UE.",
            "Telegram FZ-LLC (Zjednoczone Emiraty Arabskie): powiadomienia o nowych zapytaniach i opiniach trafiają do komunikatora osoby prowadzącej serwis.",
            "Google Ireland Limited (Irlandia) i Google LLC (USA): Google Analytics 4 i reklama, tylko za zgodą.",
          ],
        },
        "Dane możemy też udostępnić organom państwowym, jeśli wymaga tego prawo.",
      ],
    },
    {
      title: "5. Przekazywanie danych poza EOG",
      body: [
        "Część dostawców działa poza Europejskim Obszarem Gospodarczym:",
        {
          list: [
            "USA (Google): na podstawie EU-US Data Privacy Framework, w ramach którego Komisja Europejska uznała odpowiedni poziom ochrony.",
            "Zjednoczone Emiraty Arabskie (Telegram): gdy jest to niezbędne do obsługi Twojego zapytania (art. 49 ust. 1 lit. b RODO).",
          ],
        },
      ],
    },
    {
      title: "6. Jak długo przechowujemy dane",
      body: [
        {
          list: [
            "Zapytania z formularzy: przez czas rozmów i ewentualnej współpracy, a potem do 3 lat od ostatniego kontaktu (okres przedawnienia roszczeń).",
            "Opinie: do czasu wycofania zgody.",
            "Dane Google Analytics: 14 miesięcy.",
            "Liczniki ochrony przed spamem: do 10 minut.",
            "Wybór w banerze cookies: 12 miesięcy, potem zapytamy ponownie.",
          ],
        },
      ],
    },
    {
      title: "7. Twoje prawa",
      body: [
        "Masz prawo do:",
        {
          list: [
            "dostępu do swoich danych i otrzymania ich kopii,",
            "sprostowania danych,",
            "usunięcia danych,",
            "ograniczenia przetwarzania,",
            "przenoszenia danych,",
            "sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie,",
            "wycofania zgody w dowolnym momencie.",
          ],
        },
        `Aby skorzystać z tych praw, napisz na ${PRIVACY_EMAIL} lub ${FOUNDATION_EMAIL}.`,
        "Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa, https://uodo.gov.pl) lub organu nadzorczego w kraju, w którym mieszkasz.",
      ],
    },
    {
      title: "8. Czy musisz podawać dane",
      body: [
        "Podanie danych jest dobrowolne. Bez imienia i jednego sposobu kontaktu nie będziemy jednak w stanie odpowiedzieć na zapytanie. Nie podejmujemy wobec Ciebie decyzji w sposób zautomatyzowany i nie profilujemy Cię w sposób wywołujący skutki prawne.",
      ],
    },
    {
      title: "9. Zmiany polityki",
      body: [
        "Gdy zmienimy sposób przetwarzania danych, zaktualizujemy tę stronę i datę na górze. Jeśli zmiana dotyczy narzędzi działających za zgodą, baner cookies pojawi się ponownie.",
      ],
    },
  ],

  en: [
    {
      title: "1. Who the controller is",
      body: [
        "The controller of your personal data is Fundacja Rozwoju Przedsiębiorczości „Twój StartUp” (Twój StartUp Business Development Foundation), ul. Żurawia 6/12 lok. 766, 00-503 Warsaw, Poland, registered in the National Court Register (KRS) under number 0000442857, NIP 5213641211, REGON 14643346700000.",
        "buildbyalex.com is run by Evgenii Marchenko within the Foundation's incubation programme, referred to as “we”.",
        `For anything about data sent through this site, write to ${PRIVACY_EMAIL}. You can reach the Foundation at ${FOUNDATION_EMAIL}. We reply without undue delay and within one month at the latest.`,
      ],
    },
    {
      title: "2. What we collect and why",
      body: [
        "**Contact and quote forms.** We collect your name, email or phone and, if you provide them, company name, project type, budget and project description. We also record the page language and your IP address. We use this to answer your enquiry and prepare an offer (Art. 6(1)(b) GDPR, steps taken at your request before entering into a contract). The IP address is used to protect the forms from spam and abuse (Art. 6(1)(f) GDPR, legitimate interest).",
        "**Review form.** We collect your name, rating, review text and IP address. After moderation the review may be published on the site together with your name. The legal basis is your consent, given by submitting the review (Art. 6(1)(a) GDPR).",
        "**Analytics.** Only if you allow it in the cookie banner, we use Google Analytics 4. It shows where visitors come from, which pages they read, what devices they use and whether a form was sent (without its content). The legal basis is your consent (Art. 6(1)(a) GDPR and Art. 399 of the Polish Electronic Communications Law).",
        "**Advertising.** If you allow the “Advertising” category, Google may use visit data to measure Google Ads performance and show ads to people who have visited the site. The legal basis is your consent.",
        "**Server logs.** The server may record the IP address, date and time of the request, the page address and browser type, for security and troubleshooting (Art. 6(1)(f) GDPR).",
      ],
    },
    {
      title: "3. Cookies and similar technologies",
      body: [
        "Necessary, always on:",
        {
          list: [
            "NEXT_LOCALE: remembers the site language you chose, 12 months.",
            "bba-consent (browser storage): remembers your choice in the cookie banner, 12 months.",
            "Browser session storage: passes your name from the form to the thank-you page, until the tab is closed.",
          ],
        },
        "Analytics, only with consent:",
        { list: ["_ga, _ga_*: Google Analytics 4, up to 2 years."] },
        "You can change or withdraw your consent at any time using the “Cookie settings” link in the site footer. Once you withdraw it, we delete the analytics cookies and stop loading Google Analytics. Withdrawal does not affect the lawfulness of processing carried out before it.",
      ],
    },
    {
      title: "4. Who receives the data",
      body: [
        "We do not sell data. It is only handled by the providers the site depends on:",
        {
          list: [
            "Hetzner Online GmbH (Germany): hosting. The server and stored enquiries are in the EU.",
            "Telegram FZ-LLC (United Arab Emirates): notifications about new enquiries and reviews go to the messenger of the person running the site.",
            "Google Ireland Limited (Ireland) and Google LLC (USA): Google Analytics 4 and advertising, only with consent.",
          ],
        },
        "We may also disclose data to public authorities where the law requires it.",
      ],
    },
    {
      title: "5. Transfers outside the EEA",
      body: [
        "Some providers operate outside the European Economic Area:",
        {
          list: [
            "USA (Google): under the EU-US Data Privacy Framework, for which the European Commission has found an adequate level of protection.",
            "United Arab Emirates (Telegram): where necessary to handle your enquiry (Art. 49(1)(b) GDPR).",
          ],
        },
      ],
    },
    {
      title: "6. How long we keep data",
      body: [
        {
          list: [
            "Form enquiries: for as long as we talk and work together, then up to 3 years after the last contact (limitation period for claims).",
            "Reviews: until you withdraw consent.",
            "Google Analytics data: 14 months.",
            "Anti-spam counters: up to 10 minutes.",
            "Your cookie banner choice: 12 months, after which we ask again.",
          ],
        },
      ],
    },
    {
      title: "7. Your rights",
      body: [
        "You have the right to:",
        {
          list: [
            "access your data and receive a copy,",
            "have your data corrected,",
            "have your data erased,",
            "restrict processing,",
            "data portability,",
            "object to processing based on legitimate interest,",
            "withdraw consent at any time.",
          ],
        },
        `To exercise these rights, write to ${PRIVACY_EMAIL} or ${FOUNDATION_EMAIL}.`,
        "You can also lodge a complaint with the President of the Polish Personal Data Protection Office (ul. Stawki 2, 00-193 Warsaw, https://uodo.gov.pl) or with the supervisory authority in your country of residence.",
      ],
    },
    {
      title: "8. Do you have to provide data",
      body: [
        "Providing data is voluntary. Without a name and one way to reach you, however, we cannot reply to your enquiry. We do not make automated decisions about you or profile you in a way that has legal effects.",
      ],
    },
    {
      title: "9. Changes to this policy",
      body: [
        "When we change how we process data, we will update this page and the date at the top. If the change concerns tools that require consent, the cookie banner will appear again.",
      ],
    },
  ],

  ru: [
    {
      title: "1. Кто оператор данных",
      body: [
        "Оператор (администратор) ваших персональных данных - Фонд развития предпринимательства «Twój StartUp» (Fundacja Rozwoju Przedsiębiorczości „Twój StartUp”), ul. Żurawia 6/12 lok. 766, 00-503 Варшава, Польша, KRS 0000442857, NIP 5213641211, REGON 14643346700000.",
        "Сайт buildbyalex.com ведёт Evgenii Marchenko в рамках программы инкубации Фонда, далее «мы».",
        `По вопросам о данных, отправленных через этот сайт, пишите на ${PRIVACY_EMAIL}. С Фондом можно связаться по адресу ${FOUNDATION_EMAIL}. Отвечаем без лишних задержек, не позднее чем через месяц.`,
      ],
    },
    {
      title: "2. Какие данные мы собираем и зачем",
      body: [
        "**Форма контактов и форма расчёта.** Собираем имя, email или телефон, а если вы их укажете, ещё название компании, тип проекта, бюджет и описание задачи. Также сохраняем язык страницы и IP-адрес. Данные нужны, чтобы ответить на заявку и подготовить предложение (ст. 6(1)(b) GDPR, действия до заключения договора по вашему запросу). IP-адрес используем для защиты форм от спама и злоупотреблений (ст. 6(1)(f) GDPR, законный интерес).",
        "**Форма отзыва.** Собираем имя, оценку, текст отзыва и IP-адрес. После проверки отзыв может быть опубликован на сайте вместе с именем. Основание - ваше согласие, которое вы даёте, отправляя отзыв (ст. 6(1)(a) GDPR).",
        "**Аналитика.** Только если вы разрешите это в баннере cookies, мы используем Google Analytics 4. Он показывает, откуда приходят посетители, какие страницы читают, с каких устройств заходят и была ли отправлена форма (без её содержимого). Основание - ваше согласие (ст. 6(1)(a) GDPR и ст. 399 польского закона об электронных коммуникациях).",
        "**Реклама.** Если вы разрешите категорию «Реклама», Google может использовать данные визита, чтобы измерять эффективность Google Ads и показывать объявления тем, кто уже был на сайте. Основание - ваше согласие.",
        "**Логи сервера.** Сервер может записывать IP-адрес, дату и время запроса, адрес страницы и тип браузера. Это нужно для безопасности и поиска ошибок (ст. 6(1)(f) GDPR).",
      ],
    },
    {
      title: "3. Cookies и похожие технологии",
      body: [
        "Необходимые, работают всегда:",
        {
          list: [
            "NEXT_LOCALE: запоминает выбранный язык сайта, 12 месяцев.",
            "bba-consent (хранилище браузера): запоминает ваш выбор в баннере cookies, 12 месяцев.",
            "Сессионное хранилище браузера: передаёт имя из формы на страницу благодарности, до закрытия вкладки.",
          ],
        },
        "Аналитические, только с согласия:",
        { list: ["_ga, _ga_*: Google Analytics 4, до 2 лет."] },
        "Изменить или отозвать согласие можно в любой момент по ссылке «Настройки cookies» внизу сайта. После отзыва мы удаляем cookies аналитики и перестаём загружать Google Analytics. Отзыв согласия не делает незаконной обработку, которая была до него.",
      ],
    },
    {
      title: "4. Кому передаются данные",
      body: [
        "Мы не продаём данные. С ними работают только сервисы, без которых сайт не функционирует:",
        {
          list: [
            "Hetzner Online GmbH (Германия): хостинг. Сервер и сохранённые заявки находятся в ЕС.",
            "Telegram FZ-LLC (ОАЭ): уведомления о новых заявках и отзывах приходят в мессенджер человека, который ведёт сайт.",
            "Google Ireland Limited (Ирландия) и Google LLC (США): Google Analytics 4 и реклама, только с согласия.",
          ],
        },
        "Данные также могут быть переданы государственным органам, если этого требует закон.",
      ],
    },
    {
      title: "5. Передача данных за пределы ЕЭЗ",
      body: [
        "Часть сервисов работает за пределами Европейской экономической зоны:",
        {
          list: [
            "США (Google): на основании EU-US Data Privacy Framework, по которому Европейская комиссия признала уровень защиты достаточным.",
            "ОАЭ (Telegram): когда это необходимо для обработки вашей заявки (ст. 49(1)(b) GDPR).",
          ],
        },
      ],
    },
    {
      title: "6. Сколько мы храним данные",
      body: [
        {
          list: [
            "Заявки из форм: пока идёт общение и возможное сотрудничество, затем до 3 лет после последнего контакта (срок исковой давности).",
            "Отзывы: до отзыва согласия.",
            "Данные Google Analytics: 14 месяцев.",
            "Счётчики защиты от спама: до 10 минут.",
            "Выбор в баннере cookies: 12 месяцев, потом спросим снова.",
          ],
        },
      ],
    },
    {
      title: "7. Ваши права",
      body: [
        "Вы имеете право:",
        {
          list: [
            "получить доступ к своим данным и их копию,",
            "исправить данные,",
            "удалить данные,",
            "ограничить обработку,",
            "перенести данные,",
            "возразить против обработки на основании законного интереса,",
            "отозвать согласие в любой момент.",
          ],
        },
        `Чтобы воспользоваться этими правами, напишите на ${PRIVACY_EMAIL} или ${FOUNDATION_EMAIL}.`,
        "Вы также можете подать жалобу Председателю Управления по защите персональных данных Польши (UODO, ul. Stawki 2, 00-193 Варшава, https://uodo.gov.pl) или в надзорный орган страны, где вы живёте.",
      ],
    },
    {
      title: "8. Обязательно ли давать данные",
      body: [
        "Нет, это добровольно. Но без имени и одного способа связи мы не сможем ответить на заявку. Мы не принимаем в отношении вас автоматизированных решений и не профилируем вас так, чтобы это имело юридические последствия.",
      ],
    },
    {
      title: "9. Изменения политики",
      body: [
        "Если мы изменим порядок обработки данных, то обновим эту страницу и дату вверху. Если изменение касается инструментов, которые работают по согласию, баннер cookies появится снова.",
      ],
    },
  ],

  ua: [
    {
      title: "1. Хто контролер даних",
      body: [
        "Контролер (адміністратор) ваших персональних даних - Фонд розвитку підприємництва «Twój StartUp» (Fundacja Rozwoju Przedsiębiorczości „Twój StartUp”), ul. Żurawia 6/12 lok. 766, 00-503 Варшава, Польща, KRS 0000442857, NIP 5213641211, REGON 14643346700000.",
        "Сайт buildbyalex.com веде Evgenii Marchenko в межах програми інкубації Фонду, далі «ми».",
        `З питань щодо даних, надісланих через цей сайт, пишіть на ${PRIVACY_EMAIL}. З Фондом можна зв'язатися за адресою ${FOUNDATION_EMAIL}. Відповідаємо без зайвих затримок, не пізніше ніж за місяць.`,
      ],
    },
    {
      title: "2. Які дані ми збираємо і навіщо",
      body: [
        "**Форма контактів і форма розрахунку.** Збираємо ім'я, email або телефон, а якщо ви їх вкажете, ще назву компанії, тип проєкту, бюджет і опис задачі. Також зберігаємо мову сторінки та IP-адресу. Дані потрібні, щоб відповісти на заявку й підготувати пропозицію (ст. 6(1)(b) GDPR, дії до укладення договору на ваш запит). IP-адресу використовуємо для захисту форм від спаму та зловживань (ст. 6(1)(f) GDPR, законний інтерес).",
        "**Форма відгуку.** Збираємо ім'я, оцінку, текст відгуку та IP-адресу. Після перевірки відгук може бути опублікований на сайті разом з ім'ям. Підстава - ваша згода, яку ви надаєте, надсилаючи відгук (ст. 6(1)(a) GDPR).",
        "**Аналітика.** Лише якщо ви дозволите це в банері cookies, ми використовуємо Google Analytics 4. Він показує, звідки приходять відвідувачі, які сторінки читають, з яких пристроїв заходять і чи була надіслана форма (без її вмісту). Підстава - ваша згода (ст. 6(1)(a) GDPR і ст. 399 польського закону про електронні комунікації).",
        "**Реклама.** Якщо ви дозволите категорію «Реклама», Google може використовувати дані візиту, щоб вимірювати ефективність Google Ads і показувати оголошення тим, хто вже був на сайті. Підстава - ваша згода.",
        "**Логи сервера.** Сервер може записувати IP-адресу, дату й час запиту, адресу сторінки та тип браузера. Це потрібно для безпеки та пошуку помилок (ст. 6(1)(f) GDPR).",
      ],
    },
    {
      title: "3. Cookies і схожі технології",
      body: [
        "Необхідні, працюють завжди:",
        {
          list: [
            "NEXT_LOCALE: запам'ятовує обрану мову сайту, 12 місяців.",
            "bba-consent (сховище браузера): запам'ятовує ваш вибір у банері cookies, 12 місяців.",
            "Сесійне сховище браузера: передає ім'я з форми на сторінку подяки, до закриття вкладки.",
          ],
        },
        "Аналітичні, лише за згодою:",
        { list: ["_ga, _ga_*: Google Analytics 4, до 2 років."] },
        "Змінити або відкликати згоду можна будь-коли за посиланням «Налаштування cookies» унизу сайту. Після відкликання ми видаляємо cookies аналітики й перестаємо завантажувати Google Analytics. Відкликання згоди не робить незаконною обробку, що відбувалася до нього.",
      ],
    },
    {
      title: "4. Кому передаються дані",
      body: [
        "Ми не продаємо дані. З ними працюють лише сервіси, без яких сайт не функціонує:",
        {
          list: [
            "Hetzner Online GmbH (Німеччина): хостинг. Сервер і збережені заявки знаходяться в ЄС.",
            "Telegram FZ-LLC (ОАЕ): сповіщення про нові заявки та відгуки надходять у месенджер людини, яка веде сайт.",
            "Google Ireland Limited (Ірландія) і Google LLC (США): Google Analytics 4 і реклама, лише за згодою.",
          ],
        },
        "Дані також можуть бути передані державним органам, якщо цього вимагає закон.",
      ],
    },
    {
      title: "5. Передача даних за межі ЄЕЗ",
      body: [
        "Частина сервісів працює за межами Європейської економічної зони:",
        {
          list: [
            "США (Google): на підставі EU-US Data Privacy Framework, за яким Європейська комісія визнала рівень захисту достатнім.",
            "ОАЕ (Telegram): коли це необхідно для обробки вашої заявки (ст. 49(1)(b) GDPR).",
          ],
        },
      ],
    },
    {
      title: "6. Скільки ми зберігаємо дані",
      body: [
        {
          list: [
            "Заявки з форм: поки триває спілкування й можлива співпраця, потім до 3 років після останнього контакту (строк позовної давності).",
            "Відгуки: до відкликання згоди.",
            "Дані Google Analytics: 14 місяців.",
            "Лічильники захисту від спаму: до 10 хвилин.",
            "Вибір у банері cookies: 12 місяців, потім запитаємо знову.",
          ],
        },
      ],
    },
    {
      title: "7. Ваші права",
      body: [
        "Ви маєте право:",
        {
          list: [
            "отримати доступ до своїх даних і їх копію,",
            "виправити дані,",
            "видалити дані,",
            "обмежити обробку,",
            "перенести дані,",
            "заперечити проти обробки на підставі законного інтересу,",
            "відкликати згоду будь-коли.",
          ],
        },
        `Щоб скористатися цими правами, напишіть на ${PRIVACY_EMAIL} або ${FOUNDATION_EMAIL}.`,
        "Ви також можете подати скаргу Голові Управління із захисту персональних даних Польщі (UODO, ul. Stawki 2, 00-193 Варшава, https://uodo.gov.pl) або до наглядового органу країни, де ви живете.",
      ],
    },
    {
      title: "8. Чи обов'язково надавати дані",
      body: [
        "Ні, це добровільно. Але без імені та одного способу зв'язку ми не зможемо відповісти на заявку. Ми не ухвалюємо щодо вас автоматизованих рішень і не профілюємо вас так, щоб це мало юридичні наслідки.",
      ],
    },
    {
      title: "9. Зміни політики",
      body: [
        "Якщо ми змінимо порядок обробки даних, то оновимо цю сторінку й дату вгорі. Якщо зміна стосується інструментів, що працюють за згодою, банер cookies з'явиться знову.",
      ],
    },
  ],
};
