import { useState, useEffect, useRef } from "react";

// ─── TRANSLATIONS ───
const LANGS = {
  uz: {
    code:"uz", label:"O'zbekcha", flag:"🇺🇿",
    login:"Kirish", register:"Ro'yxatdan o'tish", phone:"Telefon raqam", password:"Parol",
    confirmPass:"Parolni tasdiqlang", forgotPass:"Parolni unutdingiz?",
    orWith:"yoki", googleLogin:"Google orqali kirish",
    noAccount:"Hisobingiz yo'qmi?", haveAccount:"Hisobingiz bormi?",
    name:"Ism", surname:"Familiya", createAccount:"Hisob yarating va o'rganishni boshlang",
    hello:"Assalomu alaykum,", home:"Bosh sahifa", todayResult:"Bugungi natija", allBtn:"Barchasi →",
    active:"Faollar", tests:"Testlar", rating:"Reyting",
    tickets:"Biletlar", ticketsSub:"100 ta bilet", testsSub:"Cheksiz savol",
    exam:"Imtihon", examSub:"Rasmiy test", stats:"Statistika", statsSub:"Natijalaringiz",
    ratingSub:"Top Natijalar", profile:"Profil", profileSub:"Sozlamalar",
    todayGoal:"Bugungi maqsad", lastActivity:"Oxirgi faoliyat",
    allTickets:"100 ta bilet mavjud", bookmarked:"Saqlangan",
    allTab:"Barchasi", done:"Yakunlangan", undone:"Yakunlanmagan",
    questions:"ta savol", questionOf:"Savol",
    back:"Orqaga", next:"Keyingi", finish:"Tugatish", explanation:"Izoh", explanationTitle:"To'g'ri javob izohi", noExplanation:"Bu savol uchun izoh qo'shilmagan.",
    greatResult:"Zo'r natija!", failed:"Muvaffaqiyatsiz",
    ticketDone:"yakunlandi", otherTicket:"Boshqa bilet tanlash", goHome:"Bosh sahifaga qaytish",
    infiniteTest:"Cheksiz test", infiniteSub:"Barcha savollar aralash holda keladi", startTest:"Testni boshlash",
    currentSeries:"Joriy seriya", bestSeries:"Eng yaxshi seriya", rightAnswer:"to'g'ri javob",
    lastResults:"So'nggi natijalar", byTopic:"Mavzular bo'yicha", hardQ:"Qiyin savollar",
    examTitle:"Imtihon", examReady:"Rasmiy imtihonga tayyorlik",
    examRules:"Imtihon qoidalari",
    rule1:"20 ta savol beriladi", rule2:"Har bir savolga 1 daqiqa",
    rule3:"2 tadan ortiq xato bo'lsa imtihondan o'ta olmaysiz",
    rule4:"Imtihon yakunida natija va statistika ko'rsatiladi",
    questionCount:"Savollar", time:"Vaqt", errorLimit:"Xato limit",
    startExam:"Imtihonni boshlash", question:"Savol", errors:"Xatolar",
    congrats:"Tabriklaymiz! 🎉", examPassed:"Imtihondan muvaffaqiyatli o'tdingiz.",
    examFailed:"Imtihondan o'ta olmadingiz", tooManyErrors:"tadan ortiq xato qayd etildi.",
    correct:"To'g'ri javob", wrong:"Noto'g'ri javob", result:"Natija",
    avgResult:"O'rtacha natija", examCount:"Imtihonlar soni",
    passedExams:"O'tgan imtihonlar", failedExams:"O'tmagan imtihonlar",
    retryExam:"Qayta urinish",
    statistics:"Statistika", general:"Umumiy", weekly:"Haftalik", monthly:"Oylik", yearly:"Yillik",
    totalQ:"Jami savollar", correctA:"To'g'ri javoblar", wrongA:"Noto'g'ri javoblar", correctPct:"To'g'ri foizi",
    resultsGraph:"Natijalar grafigi",
    ratingTitle:"Reyting", daily:"Kunlik",
    certs:"Sertifikatlarim", settings:"Sozlamalar", lang:"Til", about:"Biz haqimizda", news:"Yangiliklar", logout:"Chiqish",
    pro:"Pro obuna", support:"Qo'llab-quvvatlash", share:"Ulashish",
    referral:"Referal", referralTitle:"Do'stlarni taklif qiling",
    referralSub:"Har bir taklif uchun mukofot oling",
    referralCode:"Sizning referal kodingiz",
    referralCopy:"Nusxalash", referralCopied:"Nusxalandi!",
    referralShare:"Do'stlarga ulashish",
    referralStats:"Statistika", referralInvited:"Taklif qilingan",
    referralEarned:"Qo'lga kiritilgan mukofotlar",
    referralProgress:"Keyingi mukofotga",
    referralHowTitle:"Qanday ishlaydi?",
    referralStep1:"Referal kodingizni do'stlarga yuboring",
    referralStep2:"Do'stingiz kod bilan ro'yxatdan o'tadi",
    referralStep3:"Chegara to'lganda Pro sovg'a olasiz",
    referralRewards:"Mukofot darajalari",
    referralHistory:"Taklif tarixi",
    referralPending:"Kutilmoqda",
    referralGifted:"Sovg'a berildi",
    proTitle:"Nazariy PRO", proSubtitle:"Imtihonga eng yaxshi tayyorgarlik ko'ring",
    proNoAds:"Reklama yo'q", proNoAdsSub:"Hech qanday reklama ko'rmaysiz",
    proUnlimited:"Cheksiz testlar", proUnlimitedSub:"Barcha bilet va testlarga to'liq kirish",
    proStats:"Batafsil statistika", proStatsSub:"Kuchli va zaif tomonlaringizni biling",
    proMonthly:"Oylik obuna", proCancel:"Istalgan vaqt bekor qilish mumkin",
    proSubscribe:"Obuna bo'lish", proSecure:"To'lov xavfsiz va himoyalangan", proChoosePay:"To'lov usulini tanlang",
    proWeekly:"Haftalik", proMonth1:"1 oylik", proMonth2:"2 oylik",
    proPopular:"Mashhur", proBest:"Tejamli",
    exams:"Imtihonlar", passed:"O'tgan", notPassed:"O'tmagan",
    darkMode:"Tungi rejim", lightMode:"Kunduzgi rejim",
    notifications:"Bildirishnomalar", notifEmpty:"Bildirishnomalar yo'q",
    notifAll:"Barchasi", notifUnread:"O'qilmagan",
    markAllRead:"Barchasini o'qilgan deb belgilash",
    notifSettings:"Bildirishnoma sozlamalari",
    notifDaily:"Kunlik eslatma", notifResult:"Natija haqida",
    notifNew:"Yangi bilet", notifExam:"Imtihon eslatmasi",
    notifOn:"Yoqilgan", notifOff:"O'chirilgan",
    justNow:"Hozir", minsAgo:"daqiqa oldin", hoursAgo:"soat oldin",
    savedQ:"Saqlanganlar", savedEmpty:"Hali saqlanganlar yo'q",
    savedSub:"Savollarni bookmark qilib saqlang",
    savedCount:"ta saqlangan savol", removeBookmark:"Olib tashlash",
    practiceAll:"Hammasini mashq qilish", ticket:"Bilet",
    bookmarkAdded:"Savol saqlandi!", bookmarkRemoved:"Savol o'chirildi",
    skip:"O'tkazib yuborish", getStarted:"Boshlash", continue:"Davom etish",
    ob1Title:"Nazariy bilan o'rganin!",   ob1Sub:"100 ta bilet va minglab savollar orqali haydovchilik imtihoniga tayyorlaning.",
    ob2Title:"Bilet va testlar",           ob2Sub:"Har bir biletda 20 ta savol. Cheksiz test rejimi bilan bilimingizni sinab ko'ring.",
    ob3Title:"Imtihon rejimi",             ob3Sub:"Rasmiy imtihon sharoitida mashq qiling. Xato limitiga rioya qilib, natijangizni oshiring.",
    ob4Title:"Natija va reyting",          ob4Sub:"O'z natijangizni kuzating, reyting jadvalida o'z o'rningizni toping!",
    search:"Qidirish", searchPlaceholder:"Bilet, savol yoki mavzu...",
    searchResults:"Natijalar", noResults:"Hech narsa topilmadi",
    filterAll:"Barchasi", filterTickets:"Biletlar", filterQuestions:"Savollar",
    searchHint:"Bilet raqami yoki kalit so'z kiriting",
    topics:"Mavzular", topicsSub:"Bo'limlar bo'yicha o'rganish",
    rules:"Yo'l Qoidalari", rulesSub:"PBX qoidalari",
    topicsTitle:"Mavzular bo'yicha o'rganish",
    rulesTitle:"Yo'l Harakati Qoidalari",
  },
  ru: {
    code:"ru", label:"Русский", flag:"🇷🇺",
    login:"Войти", register:"Регистрация", phone:"Номер телефона", password:"Пароль",
    confirmPass:"Подтвердите пароль", forgotPass:"Забыли пароль?",
    orWith:"или", googleLogin:"Войти через Google",
    noAccount:"Нет аккаунта?", haveAccount:"Уже есть аккаунт?",
    name:"Имя", surname:"Фамилия", createAccount:"Создайте аккаунт и начните обучение",
    hello:"Здравствуйте,", home:"Главная", todayResult:"Сегодняшний результат", allBtn:"Все →",
    active:"Активность", tests:"Тесты", rating:"Рейтинг",
    tickets:"Билеты", ticketsSub:"100 билетов", testsSub:"Без ограничений",
    exam:"Экзамен", examSub:"Официальный тест", stats:"Статистика", statsSub:"Ваши результаты",
    ratingSub:"Топ результаты", profile:"Профиль", profileSub:"Настройки",
    todayGoal:"Цель на сегодня", lastActivity:"Последняя активность",
    allTickets:"100 билетов доступно", bookmarked:"Сохранённые",
    allTab:"Все", done:"Завершённые", undone:"Незавершённые",
    questions:"вопросов", questionOf:"Вопрос",
    back:"Назад", next:"Далее", finish:"Завершить", explanation:"Пояснение", explanationTitle:"Пояснение к правильному ответу", noExplanation:"Пояснение не добавлено.",
    greatResult:"Отличный результат!", failed:"Не сдано",
    ticketDone:"завершён", otherTicket:"Выбрать другой билет", goHome:"На главную",
    infiniteTest:"Бесконечный тест", infiniteSub:"Все вопросы в случайном порядке", startTest:"Начать тест",
    currentSeries:"Текущая серия", bestSeries:"Лучшая серия", rightAnswer:"правильных",
    lastResults:"Последние результаты", byTopic:"По темам", hardQ:"Сложные вопросы",
    examTitle:"Экзамен", examReady:"Подготовка к официальному экзамену",
    examRules:"Правила экзамена",
    rule1:"Даётся 20 вопросов", rule2:"1 минута на каждый вопрос",
    rule3:"Более 2 ошибок — экзамен не сдан",
    rule4:"В конце показывается результат и статистика",
    questionCount:"Вопросы", time:"Время", errorLimit:"Лимит ошибок",
    startExam:"Начать экзамен", question:"Вопрос", errors:"Ошибки",
    congrats:"Поздравляем! 🎉", examPassed:"Вы успешно сдали экзамен.",
    examFailed:"Экзамен не сдан", tooManyErrors:"ошибок зафиксировано.",
    correct:"Правильных", wrong:"Неправильных", result:"Результат",
    avgResult:"Средний результат", examCount:"Всего экзаменов",
    passedExams:"Сданных", failedExams:"Не сданных",
    retryExam:"Попробовать снова",
    statistics:"Статистика", general:"Общий", weekly:"Недельный", monthly:"Месячный", yearly:"Годовой",
    totalQ:"Всего вопросов", correctA:"Правильных ответов", wrongA:"Неправильных ответов", correctPct:"Процент правильных",
    resultsGraph:"График результатов",
    ratingTitle:"Рейтинг", daily:"Ежедневный",
    certs:"Мои сертификаты", settings:"Настройки", lang:"Язык", about:"О нас", news:"Yangiliklar kanali", logout:"Выйти",
    pro:"Pro подписка", support:"Поддержка", share:"Поделиться",
    proTitle:"Nazariy PRO", proSubtitle:"Лучшая подготовка к экзамену",
    proNoAds:"Без рекламы", proNoAdsSub:"Никакой рекламы",
    proUnlimited:"Безлимитные тесты", proUnlimitedSub:"Полный доступ ко всем билетам",
    proStats:"Подробная статистика", proStatsSub:"Узнайте свои сильные и слабые стороны",
    proMonthly:"Ежемесячная подписка", proCancel:"Отмена в любое время",
    proSubscribe:"Подписаться", proSecure:"Безопасная оплата", proChoosePay:"Выберите способ оплаты",
    proWeekly:"Недельный", proMonth1:"1 месяц", proMonth2:"2 месяца",
    proPopular:"Популярный", proBest:"Выгодный",
    exams:"Экзамены", passed:"Сдано", notPassed:"Не сдано",
    darkMode:"Тёмный режим", lightMode:"Светлый режим",
    notifications:"Уведомления", notifEmpty:"Нет уведомлений",
    notifAll:"Все", notifUnread:"Непрочитанные",
    markAllRead:"Отметить все прочитанными",
    notifSettings:"Настройки уведомлений",
    notifDaily:"Ежедневное напоминание", notifResult:"О результатах",
    notifNew:"Новый билет", notifExam:"Напоминание об экзамене",
    notifOn:"Включено", notifOff:"Выключено",
    justNow:"Только что", minsAgo:"мин. назад", hoursAgo:"ч. назад",
    savedQ:"Сохранённые", savedEmpty:"Нет сохранённых вопросов",
    savedSub:"Сохраняйте вопросы с помощью закладок",
    savedCount:"сохранённых вопросов", removeBookmark:"Удалить",
    practiceAll:"Практиковать все", ticket:"Билет",
    bookmarkAdded:"Вопрос сохранён!", bookmarkRemoved:"Вопрос удалён",
    skip:"Пропустить", getStarted:"Начать", continue:"Продолжить",
    ob1Title:"Учитесь с Nazariy!",        ob1Sub:"Готовьтесь к экзамену по вождению с 100 билетами и тысячами вопросов.",
    ob2Title:"Билеты и тесты",             ob2Sub:"20 вопросов в каждом билете. Режим бесконечного теста для тренировки.",
    ob3Title:"Режим экзамена",             ob3Sub:"Тренируйтесь в условиях официального экзамена. Следите за лимитом ошибок.",
    ob4Title:"Результаты и рейтинг",       ob4Sub:"Отслеживайте свои результаты и найдите своё место в таблице лидеров!",
    search:"Поиск", searchPlaceholder:"Билет, вопрос или тема...",
    searchResults:"Результаты", noResults:"Ничего не найдено",
    filterAll:"Все", filterTickets:"Билеты", filterQuestions:"Вопросы",
    searchHint:"Введите номер билета или ключевое слово",
    topics:"Темы", topicsSub:"Учёба по разделам",
    rules:"ПДД", rulesSub:"Правила дорожного движения",
    topicsTitle:"Темы для изучения",
    rulesTitle:"Правила дорожного движения",
  },
  kril: {
    code:"kril", label:"Ўзбекча", flag:"🇺🇿",
    login:"Кириш", register:"Рўйхатдан ўтиш", phone:"Телефон рақам", password:"Парол",
    confirmPass:"Паролни тасдиқланг", forgotPass:"Паролни унутдингизми?",
    orWith:"ёки", googleLogin:"Google орқали кириш",
    noAccount:"Ҳисобингиз йўқми?", haveAccount:"Ҳисобингиз борми?",
    name:"Исм", surname:"Фамилия", createAccount:"Ҳисоб яратинг ва ўрганишни бошланг",
    hello:"Ассалому алайкум,", home:"Бош саҳифа", todayResult:"Бугунги натижа", allBtn:"Барчаси →",
    active:"Фаоллар", tests:"Тестлар", rating:"Рейтинг",
    tickets:"Билетлар", ticketsSub:"100 та билет", testsSub:"Чексиз савол",
    exam:"Имтиҳон", examSub:"Расмий тест", stats:"Статистика", statsSub:"Натижаларингиз",
    ratingSub:"Топ Натижалар", profile:"Профил", profileSub:"Созламалар",
    todayGoal:"Бугунги мақсад", lastActivity:"Охирги фаолият",
    allTickets:"100 та билет мавжуд", bookmarked:"Сақланган",
    allTab:"Барчаси", done:"Якунланган", undone:"Якунланмаган",
    questions:"та савол", questionOf:"Савол",
    back:"Орқага", next:"Кейинги", finish:"Тугатиш", explanation:"Изоҳ", explanationTitle:"Тўғри жавоб изоҳи", noExplanation:"Бу савол учун изоҳ қўшилмаган.",
    greatResult:"Зўр натижа!", failed:"Муваффақиятсиз",
    ticketDone:"якунланди", otherTicket:"Бошқа билет танлаш", goHome:"Бош саҳифага қайтиш",
    infiniteTest:"Чексиз тест", infiniteSub:"Барча саволлар аралаш ҳолда келади", startTest:"Тестни бошлаш",
    currentSeries:"Жорий серия", bestSeries:"Энг яхши серия", rightAnswer:"тўғри жавоб",
    lastResults:"Сўнгги натижалар", byTopic:"Мавзулар бўйича", hardQ:"Қийин саволлар",
    examTitle:"Имтиҳон", examReady:"Расмий имтиҳонга тайёрлик",
    examRules:"Имтиҳон қоидалари",
    rule1:"20 та савол берилади", rule2:"Ҳар бир саволга 1 дақиқа",
    rule3:"2 тадан ортиқ хато бўлса имтиҳондан ўта олмайсиз",
    rule4:"Имтиҳон якунида натижа ва статистика кўрсатилади",
    questionCount:"Саволлар", time:"Вақт", errorLimit:"Хато лимит",
    startExam:"Имтиҳонни бошлаш", question:"Савол", errors:"Хатолар",
    congrats:"Табрикlaймиз! 🎉", examPassed:"Имтиҳондан муваффақиятли ўтдингиз.",
    examFailed:"Имтиҳондан ўта олмадингиз", tooManyErrors:"тадан ортиқ хато қайд этилди.",
    correct:"Тўғри жавоб", wrong:"Нотўғри жавоб", result:"Натижа",
    avgResult:"Ўртача натижа", examCount:"Имтиҳонлар сони",
    passedExams:"Ўтган имтиҳонлар", failedExams:"Ўтмаган имтиҳонлар",
    retryExam:"Қайта уриниш",
    statistics:"Статистика", general:"Умумий", weekly:"Ҳафталик", monthly:"Ойлик", yearly:"Йиллик",
    totalQ:"Жами саволлар", correctA:"Тўғри жавоблар", wrongA:"Нотўғри жавоблар", correctPct:"Тўғри фоизи",
    resultsGraph:"Натижалар графиги",
    ratingTitle:"Рейтинг", daily:"Кунлик",
    certs:"Сертификатларим", settings:"Созламалар", lang:"Тил", about:"Биз ҳақимизда", news:"Янгиликлар", logout:"Чиқиш",
    pro:"Pro обуна", support:"Қўллаб-қувватлаш", share:"Улашиш",
    proTitle:"Nazariy PRO", proSubtitle:"Имтиҳонга энг яхши тайёргарлик кўринг",
    proNoAds:"Реклама йўқ", proNoAdsSub:"Ҳеч қандай реклама кўрмайсиз",
    proUnlimited:"Чексиз тестлар", proUnlimitedSub:"Барча билет ва тестларга тўлиқ кириш",
    proStats:"Батафсил статистика", proStatsSub:"Кучли ва заиф томонларингизни билинг",
    proMonthly:"Ойлик обуна", proCancel:"Истаган вақт бекор қилиш мумкин",
    proSubscribe:"Обуна бўлиш", proSecure:"Тўлов хавфсиз ва ҳимояланган", proChoosePay:"Тўлов усулини танланг",
    proWeekly:"Ҳафталик", proMonth1:"1 ойлик", proMonth2:"2 ойлик",
    proPopular:"Машҳур", proBest:"Тежамли",
    exams:"Имтиҳонлар", passed:"Ўтган", notPassed:"Ўтмаган",
    darkMode:"Тунги режим", lightMode:"Кундузги режим",
    notifications:"Билдиришномалар", notifEmpty:"Билдиришномалар йўқ",
    notifAll:"Барчаси", notifUnread:"Ўқилмаган",
    markAllRead:"Барчасини ўқилган деб белгилаш",
    notifSettings:"Билдиришнома созламалари",
    notifDaily:"Кунлик эслатма", notifResult:"Натижа ҳақида",
    notifNew:"Янги билет", notifExam:"Имтиҳон эслатмаси",
    notifOn:"Ёқилган", notifOff:"Ўчирилган",
    justNow:"Ҳозир", minsAgo:"дақиқа олдин", hoursAgo:"соат олдин",
    savedQ:"Сақланганлар", savedEmpty:"Ҳали сақланган савол йўқ",
    savedSub:"Саволларни bookmark қилиб сақланг",
    savedCount:"та сақланган савол", removeBookmark:"Олиб ташлаш",
    practiceAll:"Ҳамасини машқ қилиш", ticket:"Билет",
    bookmarkAdded:"Савол сақланди!", bookmarkRemoved:"Савол ўчирилди",
    skip:"Ўтказиб юбориш", getStarted:"Бошлаш", continue:"Давом этиш",
    ob1Title:"Назарий билан ўрганинг!",   ob1Sub:"100 та билет ва минглаб саволлар орқали ҳайдовчилик имтиҳонига тайёрланинг.",
    ob2Title:"Билет ва тестлар",           ob2Sub:"Ҳар бир билетда 20 та савол. Чексиз тест режими билан билимингизни синаб кўринг.",
    ob3Title:"Имтиҳон режими",             ob3Sub:"Расмий имтиҳон шароитида машқ қилинг. Хато лимитига риоя қилиб, натижангизни оширинг.",
    ob4Title:"Натижа ва рейтинг",          ob4Sub:"Ўз натижангизни кузатинг, рейтинг жадвалида ўз ўрнингизни топинг!",
    search:"Қидириш", searchPlaceholder:"Билет, савол ёки мавзу...",
    searchResults:"Натижалар", noResults:"Ҳеч нарса топилмади",
    filterAll:"Барчаси", filterTickets:"Билетлар", filterQuestions:"Саволлар",
    searchHint:"Билет рақами ёки калит сўз киритинг",
    topics:"Мавзулар", topicsSub:"Бўлимлар бўйича ўрганиш",
    rules:"Йўл Қоидалари", rulesSub:"ЙҲҚ қоидалари",
    topicsTitle:"Мавзулар бўйича ўрганиш",
    rulesTitle:"Йўл Ҳаракати Қоидалари",
  }
};

// ─── THEMES ───
function getTheme(dark) {
  // Telegram theme params — foydalanuvchi Telegram ranglaridan olamiz
  const tgParams = typeof window !== "undefined"
    ? window?.Telegram?.WebApp?.themeParams || {}
    : {};

  // Telegram bergan ranglar (bo'lmasa fallback)
  const tgBg       = tgParams.bg_color;
  const tgCard     = tgParams.secondary_bg_color;
  const tgText     = tgParams.text_color;
  const tgHint     = tgParams.hint_color;
  const tgLink     = tgParams.link_color;
  const tgButton   = tgParams.button_color;
  const tgNavBg    = tgParams.bottom_bar_bg_color || tgParams.secondary_bg_color;

  if (dark) {
    return {
      primary:    tgButton  || "#3B82F6",
      primaryDark:"#2563EB",
      success:"#22C55E", danger:"#EF4444", warning:"#F59E0B",
      bg:         tgBg      || "#0F172A",
      white:      tgCard    || "#1E293B",
      card:       tgCard    || "#1E293B",
      cardBorder: tgHint    ? tgHint+"33" : "#334155",
      gray100:    tgCard    || "#1E293B",
      gray200:"#334155", gray300:"#475569",
      gray400:"#64748B",
      gray600:    tgHint    || "#94A3B8",
      gray800:"#F1F5F9",
      text:       tgText    || "#F1F5F9",
      subtext:    tgHint    || "#94A3B8",
      muted:      tgHint    || "#64748B",
      navBg:      tgNavBg   || "#1E293B",
      inputBg:    tgBg      || "#0F172A",
      gradStart:  tgButton  ? tgButton+"CC" : "#1E3A5F",
      gradEnd:    tgButton  || "#1E40AF",
      primary_light: (tgButton||"#3B82F6")+"22",
    };
  } else {
    return {
      primary:    tgButton  || "#1A6BFF",
      primaryDark:"#1250CC",
      success:"#22C55E", danger:"#EF4444", warning:"#F59E0B",
      bg:         tgBg      || "#F0F4FF",
      white:      "#FFFFFF",
      card:       tgCard    || "#FFFFFF",
      cardBorder: tgHint    ? tgHint+"22" : "transparent",
      gray100:"#F8FAFC", gray200:"#E2E8F0", gray300:"#CBD5E1",
      gray400:"#94A3B8",
      gray600:    tgHint    || "#64748B",
      gray800:"#1E293B",
      text:       tgText    || "#1E293B",
      subtext:    tgHint    || "#64748B",
      muted:      tgHint    || "#94A3B8",
      navBg:      tgNavBg   || "#FFFFFF",
      inputBg:    tgCard    || "#F8FAFC",
      gradStart:  tgButton  || "#1A6BFF",
      gradEnd:    tgLink    || "#3B82F6",
      primary_light: (tgButton||"#1A6BFF")+"18",
    };
  }
}

// ─── SVG ICONS ───
const IC = {
  Home: ({size=24,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/></svg>,
  Ticket: ({size=24,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.5a1.5 1.5 0 0 0 0 3V15a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1.5a1.5 1.5 0 0 0 0-3V9Z" stroke={color} strokeWidth="2"/><path d="M9 12H15M9 9.5H15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Clipboard: ({size=24,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="17" rx="2" stroke={color} strokeWidth="2"/><path d="M9 3h6v3H9zM9 11h6M9 15h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Clock: ({size=24,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/><path d="M12 7V12L15 15" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  User: ({size=24,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Bell: ({size=24,color="white"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Lock: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="11" rx="2" stroke={color} strokeWidth="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Phone: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Eye: ({size=18,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/></svg>,
  EyeOff: ({size=18,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  BarChart: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="12" width="4" height="9" rx="1" stroke={color} strokeWidth="2"/><rect x="10" y="7" width="4" height="14" rx="1" stroke={color} strokeWidth="2"/><rect x="17" y="3" width="4" height="18" rx="1" stroke={color} strokeWidth="2"/></svg>,
  Trophy: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M8 21h8M12 17v4M7 4H4v4c0 2.2 1.8 4 4 4M17 4h3v4c0 2.2-1.8 4-4 4" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4z" stroke={color} strokeWidth="2"/></svg>,
  Star: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth="2" strokeLinejoin="round"/></svg>,
  Flame: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" stroke={color} strokeWidth="2" strokeLinejoin="round"/></svg>,
  BookOpen: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={color} strokeWidth="2" strokeLinejoin="round"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={color} strokeWidth="2" strokeLinejoin="round"/></svg>,
  AlertTriangle: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="2" strokeLinejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Award: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="6" stroke={color} strokeWidth="2"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Settings: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth="2"/></svg>,
  Globe: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/><line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={color} strokeWidth="2"/></svg>,
  Info: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/><line x1="12" y1="16" x2="12" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="8" x2="12.01" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  LogOut: ({size=20,color="#EF4444"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="2" strokeLinecap="round"/><polyline points="16 17 21 12 16 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Edit: ({size=18,color="white"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Bookmark: ({size=20,color="white"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ChevronRight: ({size=16,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><polyline points="9 18 15 12 9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  CheckCircle: ({size=24,color="#22C55E"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/><polyline points="9 12 11 14 15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  XCircle: ({size=24,color="#EF4444"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/><line x1="15" y1="9" x2="9" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="9" y1="9" x2="15" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  TrendingUp: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 6 23 6 23 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Medal: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="14" r="6" stroke={color} strokeWidth="2"/><path d="M9 2h6l1 5H8L9 2z" stroke={color} strokeWidth="2" strokeLinejoin="round"/><path d="M12 10v8M9 14h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  ArrowLeft: ({size=18,color="white"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><line x1="19" y1="12" x2="5" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/><polyline points="12 19 5 12 12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ArrowRight: ({size=18,color="white"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/><polyline points="12 5 19 12 12 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Crown: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M2 20h20M4 20l2-10 6 5 6-5 2 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="2" stroke={color} strokeWidth="2"/></svg>,
  Headphones: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M3 18v-6a9 9 0 0 1 18 0v6" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" stroke={color} strokeWidth="2"/></svg>,
  Share: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="3" stroke={color} strokeWidth="2"/><circle cx="6" cy="12" r="3" stroke={color} strokeWidth="2"/><circle cx="18" cy="19" r="3" stroke={color} strokeWidth="2"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  FileText: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="2" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" stroke={color} strokeWidth="2" strokeLinejoin="round"/><line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Infinity: ({size=28,color="white"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z" stroke={color} strokeWidth="2"/></svg>,
  GraduationCap: ({size=48,color="white"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 12v5c3 3 9 3 12 0v-5" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Sun: ({size=20,color="#F59E0B"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2"/><line x1="12" y1="1" x2="12" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="1" y1="12" x2="3" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="21" y1="12" x2="23" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Moon: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Search: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Filter: ({size=18,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><line x1="4" y1="6" x2="20" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="11" y1="18" x2="13" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Map: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="8" y1="2" x2="8" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="6" x2="16" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Shield: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 12 11 14 15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  CreditCard: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="1" y="4" width="22" height="16" rx="2" stroke={color} strokeWidth="2"/><line x1="1" y1="10" x2="23" y2="10" stroke={color} strokeWidth="2"/><line x1="5" y1="16" x2="9" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="16" x2="14" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Smartphone: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth="2"/><line x1="12" y1="18" x2="12.01" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Diamond: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M6 3h12l4 6-10 13L2 9z" stroke={color} strokeWidth="2" strokeLinejoin="round"/><path d="M2 9h20M6 3l4 6m4 0l4-6M6 3L2 9l10 13M18 3l4 6-10 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ShieldCheck: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 12 11 14 15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ClickPay: ({size=24,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="3" stroke={color} strokeWidth="2"/><path d="M2 10h20" stroke={color} strokeWidth="2"/><circle cx="7" cy="15" r="1.5" fill={color}/><path d="M11 14h6" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Gift:       ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><polyline points="20 12 20 22 4 22 4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="2" y="7" width="20" height="5" rx="1" stroke={color} strokeWidth="2"/><line x1="12" y1="22" x2="12" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Celebrate:  ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M3 21l7-7" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M7 3l1 4L3 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 3l-1 4 4 1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 21l4-1 1 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 13a6 6 0 0 0 8.5-8.5" stroke={color} strokeWidth="2" strokeLinecap="round"/><circle cx="16" cy="8" r="1" fill={color}/><circle cx="12" cy="4" r="1" fill={color}/><circle cx="20" cy="12" r="1" fill={color}/></svg>,
  Send:       ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><line x1="22" y1="2" x2="11" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polygon points="22 2 15 22 11 13 2 9 22 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Traffic:    ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="8" y="2" width="8" height="20" rx="2" stroke={color} strokeWidth="2"/><circle cx="12" cy="7" r="2" fill={color}/><circle cx="12" cy="12" r="2" fill={color}/><circle cx="12" cy="17" r="2" fill={color}/></svg>,
  RoadSign:   ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 2L2 12l10 10 10-10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8v4M12 16h.01" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Refresh:    ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><polyline points="23 4 23 10 17 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="1 20 1 14 7 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Walk:       ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="4" r="2" stroke={color} strokeWidth="2"/><path d="M9 20l1-5-2-3 3-4 3 3 2-3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 20l-1-5" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Weather:    ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="8" y1="19" x2="8" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="13" x2="8" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="19" x2="16" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="13" x2="16" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="15" x2="12" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Speed:      ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 1 0 10 10" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M12 12l4-4" stroke={color} strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="2" stroke={color} strokeWidth="2"/></svg>,
  Ambulance:  ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="1" y="9" width="15" height="13" rx="2" stroke={color} strokeWidth="2"/><path d="M16 13h4l3 3v4h-7V13z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" stroke={color} strokeWidth="2"/><circle cx="18.5" cy="18.5" r="2.5" stroke={color} strokeWidth="2"/><path d="M7 6h4M9 4v4" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Wrench:     ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  NoEntry:    ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Warning:    ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="2" strokeLinejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Mandatory:  ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/><polyline points="9 12 11 14 15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Prohibit:   ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/><path d="M4.93 4.93l14.14 14.14" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Hospital:   ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2"/><path d="M12 8v8M8 12h8" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Train:      ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="14" rx="3" stroke={color} strokeWidth="2"/><path d="M4 11h16" stroke={color} strokeWidth="2"/><circle cx="9" cy="18" r="2" stroke={color} strokeWidth="2"/><circle cx="15" cy="18" r="2" stroke={color} strokeWidth="2"/><path d="M9 17l-2 3M15 17l2 3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Ticket2:    ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.5a1.5 1.5 0 0 0 0 3V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.5a1.5 1.5 0 0 0 0-3V9z" stroke={color} strokeWidth="2"/></svg>,
  Stats:      ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  GraduationCap2: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  TelegramIcon: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 7a2.25 2.25 0 0 0 .126 4.198l3.938 1.317 1.49 4.47a2.25 2.25 0 0 0 3.916.605l1.9-2.534 3.96 2.64a2.25 2.25 0 0 0 3.372-1.612l2-14a2.25 2.25 0 0 0-3.18-2.3z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.5 14l-2-6.5 9-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  PaymePay: ({size=24,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="6" y="2" width="12" height="20" rx="3" stroke={color} strokeWidth="2"/><path d="M10 6h4" stroke={color} strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="17" r="1.5" fill={color}/><path d="M9 11h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><path d="M10 13.5h4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
};


// ─── STYLE CONSTANTS — takrorlanadigan style lar ───
// Bu yerda bir marta aniqlanadi, har render da qayta yaratilmaydi
const SC = {
  // Screen wrapper
  screen: (C) => ({ minHeight:"100vh", background:C.bg, paddingBottom:80 }),
  // Header gradient
  header: (C, extra={}) => ({ background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`, padding:"52px 20px 20px", ...extra }),
  // Card
  card: (C) => ({ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.cardBorder}`, boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }),
  // Primary button
  btnPrimary: (C) => ({ width:"100%", padding:"16px", borderRadius:16, border:"none", background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`, color:"white", fontSize:16, fontWeight:800, cursor:"pointer", boxShadow:`0 6px 20px ${C.primary}50` }),
  // Row
  row: { display:"flex", alignItems:"center" },
  // Text styles
  title: (C) => ({ fontWeight:800, fontSize:22, color:C.text, margin:0 }),
  sub: (C) => ({ fontSize:13, color:C.subtext }),
  label: (C) => ({ fontSize:12, color:C.subtext, fontWeight:500 }),
};

// ─── DATA ───
// ─── LIMITLAR (admin tomonidan boshqariladi) ───
const LIMITS = {
  dailyTestLimit: 100,
  freeExamCount: 2,
  freeTicketCount: 10,
};


// ─── BACKEND API ───
const API_URL = "https://nazariy-backend.onrender.com";

// API helper funksiyalar
async function apiGet(endpoint, token) {
  const res = await fetch(API_URL + endpoint, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiPost(endpoint, data, token) {
  const res = await fetch(API_URL + endpoint, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── APP KONFIGURATSIYASI (admin tomonidan boshqariladi) ───
const APP_CONFIG = {
  supportUsername: "nazariy_support",   // Telegram support username (@siz)
  newsChannel: "nazariy_avtotest",      // Telegram kanal username
  aboutText: {
    uz: "Nazariy — O'zbekiston haydovchilik guvohnomasi olish uchun nazariy imtihonga tayyorgarlik ko'rish ilovasi. 100 ta rasmiy bilet, testlar va imtihon rejimlari.",
    ru: "Nazariy — приложение для подготовки к теоретическому экзамену на водительские права в Узбекистане. 100 официальных билетов, тесты и режим экзамена.",
    kril: "Назарий — Ўзбекистон ҳайдовчилик гувоҳномаси олиш учун назарий имтиҳонга тайёргарлик кўриш иловаси.",
  },
  version: "2.0.0",
};

// ─── CHEGIRMA KONFIGURATSIYASI ───
// Admin paneldan boshqariladi
const DISCOUNT = {
  active: true,           // Chegirma faolmi
  percent: 20,            // Foiz chegirma (20%)
  label: "Maxsus taklif", // Chegirma sarlavhasi
  endDate: "2025-07-01",  // Tugash sanasi (YYYY-MM-DD)
  code: "",               // Promo-kod (bo'sh = hamma uchun)
};

// ─── REFERAL KONFIGURATSIYASI ───
const REFERRAL_CONFIG = {
  milestones: [
    { count: 3,  reward: "week",   label: "Haftalik Pro",  days: 7  },
    { count: 5,  reward: "month1", label: "1 oylik Pro",   days: 30 },
    { count: 10, reward: "month2", label: "2 oylik Pro",   days: 60 },
  ],
};

// Foydalanuvchi referal kod generatsiyasi (tg_id asosida)
function genReferralCode(user) {
  const base = user?.tgId || user?.username || "USER";
  return ("NAZ" + String(base).slice(-4).toUpperCase() + Math.floor(1000 + (base%9000||1234))).slice(0,10);
}

// Keyingi milestone
function nextMilestone(count) {
  return REFERRAL_CONFIG.milestones.find(m => m.count > count) || null;
}

// Chegara hisoblash yordamchi funksiya
// Chegirma hisoblash yordamchi funksiya
function calcDiscounted(price) {
  if (!DISCOUNT.active || !DISCOUNT.percent) return { original: price, final: price, saved: 0 };
  const saved = Math.round(price * DISCOUNT.percent / 100);
  return { original: price, final: price - saved, saved };
}

// Tugash sanasiga qolgan kunlar
function discountDaysLeft() {
  if (!DISCOUNT.active || !DISCOUNT.endDate) return null;
  const diff = new Date(DISCOUNT.endDate) - new Date();
  return Math.max(0, Math.ceil(diff / 86400000));
}

// ─── SESSION STORAGE — kunlik hisoblagich ───
function getTodayKey() {
  return new Date().toISOString().slice(0,10);
}
function getDailyCount(key) {
  try {
    const data = JSON.parse(sessionStorage.getItem('daily_' + key) || '{}');
    return data[getTodayKey()] || 0;
  } catch { return 0; }
}
function incDailyCount(key) {
  try {
    const stKey = 'daily_' + key;
    const data = JSON.parse(sessionStorage.getItem(stKey) || '{}');
    data[getTodayKey()] = (data[getTodayKey()] || 0) + 1;
    sessionStorage.setItem(stKey, JSON.stringify(data));
  } catch {}
}

// Biletlar: 1-10 bepul, 11-100 Pro
const tickets = Array.from({length:100},(_,i)=>({
  id:i+1,
  isPro: i >= 10,  // 11-dan boshlab Pro
  questions:Array.from({length:20},(_,j)=>({ 
    id:j+1, question:j, sign:j%3===0?j%8:null, options:j%10, correct:0,
    explanation:{
      uz: "Yo'l harakati qoidalari bo'yicha to'g'ri javob: haydovchi belgilangan tartibda harakat qilishi shart.",
      ru: "Согласно правилам дорожного движения: водитель обязан соблюдать установленный порядок движения.",
      kril: "Йўл ҳаракати қоидалари бўйича тўғри жавоб: ҳайдовчи белгиланган тартибда ҳаракат қилиши шарт."
    }
  }))
}));

const QUESTIONS = [
  "Quyidagi rasmda qaysi yo'l belgisi ko'rsatilgan? / Какой знак изображён на рисунке? / Қуйидаги расмда қайси йўл белгиси кўрсатилган?",
  "Yo'l harakatida chapga burilish qachon taqiqlanadi? / Когда запрещён поворот налево? / Йўл ҳаракатида чапга бурилиш қачон тақиқланади?",
  "Tuman sharoitida to'xtash masofasi qanday o'zgaradi? / Как меняется тормозной путь в туман? / Туман шароитида тўхташ масофаси қандай ўзгаради?",
  "Piyodalar o'tish joyida haydovchi nima qilishi kerak? / Что должен делать водитель на пешеходном переходе? / Пиёдалар ўтиш жойида ҳайдовчи нима қилиши керак?",
  "Yashil chiroqda haydovchi nima qilishi kerak? / Что делать водителю на зелёный сигнал? / Яшил чироқда ҳайдовчи нима қилиши керак?",
  "Yo'lda ustunlik huquqi kimda bo'ladi? / Кто имеет преимущество на дороге? / Йўлда устунлик ҳуқуқи кимда бўлади?",
  "Qanday holatda signal chalinishi mumkin? / В каком случае разрешено подавать сигнал? / Қандай ҳолатда сигнал чалиниши мумкин?",
  "Avtomobil tormoz yo'li nimaga bog'liq? / От чего зависит тормозной путь? / Автомобил тормоз йўли нимага боғлиқ?",
  "Shahar ichida maksimal tezlik qancha? / Какова максимальная скорость в городе? / Шаҳар ичида максимал тезлик қанча?",
  "Bolalar tashiydigan avtobusni qanday chetlab o'tish kerak? / Как обогнать автобус с детьми? / Болалар ташийдиган автобусни қандай четлаб ўтиш керак?",
];
const OPTIONS = [
  ["Bolalar","Piyodalar o'tish joyi","Ehtiyot bo'ling","Maktab yaqinida"],
  ["Chapga burilish belgisi bo'lmasa","Har doim","Trafik tirband bo'lsa","Yo'l tor bo'lsa"],
  ["2 barobar uzayadi","Qisqaradi","O'zgarmaydi","Tezlik taqiqlanadi"],
  ["To'xtash kerak","Tezlashish kerak","Signal berish","Harakatni davom ettirish"],
  ["Harakatni davom ettirish","To'xtatish","Chiroqni kutish","Signal berish"],
  ["Asosiy yo'ldagi haydovchida","Ikkilamchi yo'lda","Ikkoviga teng","Tezroq harakatlanuvchida"],
  ["Xavfli vaziyatda","Har doim","Tungi paytda","Shaharda hech qachon"],
  ["Tezlikka","Yo'l yuzasiga","Ob-havoga","Barcha omillarga"],
  ["60 km/s","80 km/s","50 km/s","70 km/s"],
  ["Chap tarafdan","O'ng tarafdan","Har ikki tarafdan","To'xtab kutish"],
];
const SIGNS = ["warn","no-left","stop","ped","children","no-entry","speed","rail"];

function SignSVG({type}) {
  const shapes = { stop:"oct", "no-entry":"oct", warn:"tri", children:"tri" };
  const s = shapes[type]||"circ";
  const bg = { warn:"#FFD600","no-left":"#EF4444",stop:"#EF4444",ped:"#F59E0B",children:"#F59E0B","no-entry":"#EF4444",speed:"white",rail:"#1A6BFF" }[type]||"#EEE";
  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      {s==="tri"&&<polygon points="45,8 82,75 8,75" fill={bg} stroke="#333" strokeWidth="3"/>}
      {s==="circ"&&<circle cx="45" cy="45" r="38" fill={bg} stroke="#333" strokeWidth="3"/>}
      {s==="oct"&&<polygon points="28,10 62,10 80,28 80,62 62,80 28,80 10,62 10,28" fill={bg} stroke="#333" strokeWidth="3"/>}
      {type==="warn"&&<text x="45" y="66" textAnchor="middle" fontSize="34" fill="#333" fontWeight="900">!</text>}
      {type==="ped"&&<><circle cx="45" cy="22" r="7" fill="#333"/><path d="M45 29v14M38 35l7-4 7 4M40 43l5-4M50 43l-5-4" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/></>}
      {type==="children"&&<><circle cx="45" cy="30" r="9" fill="#333"/><path d="M36 48c0-5 4-9 9-9s9 4 9 9" stroke="#333" strokeWidth="2.5" strokeLinecap="round" fill="none"/></>}
      {type==="no-left"&&<><line x1="30" y1="45" x2="60" y2="45" stroke="white" strokeWidth="6"/><polyline points="43,34 30,45 43,56" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/><line x1="15" y1="15" x2="75" y2="75" stroke="white" strokeWidth="5"/></>}
      {type==="stop"&&<text x="45" y="57" textAnchor="middle" fontSize="18" fontWeight="900" fill="white">STOP</text>}
      {type==="no-entry"&&<rect x="22" y="41" width="46" height="8" rx="3" fill="white"/>}
      {type==="speed"&&<><circle cx="45" cy="45" r="28" fill="#EF4444" stroke="white" strokeWidth="4"/><text x="45" y="54" textAnchor="middle" fontSize="22" fontWeight="900" fill="white">60</text></>}
      {type==="rail"&&<><rect x="22" y="28" width="46" height="30" rx="6" fill="white" opacity="0.9"/><circle cx="34" cy="62" r="5" fill="white"/><circle cx="56" cy="62" r="5" fill="white"/><line x1="29" y1="38" x2="29" y2="52" stroke="#1A6BFF" strokeWidth="2.5"/><line x1="61" y1="38" x2="61" y2="52" stroke="#1A6BFF" strokeWidth="2.5"/><line x1="22" y1="45" x2="68" y2="45" stroke="#1A6BFF" strokeWidth="1.5"/></>}
    </svg>
  );
}

function getQ(q,lang) {
  const parts = QUESTIONS[q%10].split(" / ");
  return parts[lang==="ru"?1:lang==="kril"?2:0];
}
function getOpts(q,lang) {
  if(lang==="ru"){
    const ru=[["Дети","Пешеходный переход","Осторожно","Рядом школа"],["Если нет знака","Всегда","В пробке","Узкая дорога"],["Увеличивается вдвое","Уменьшается","Не изменяется","Скорость запрещена"],["Остановиться","Ускориться","Сигналить","Продолжать движение"],["Продолжать движение","Остановиться","Ждать","Сигналить"],["У водителя главной дороги","На второстепенной","Поровну","У быстрого"],["В опасной ситуации","Всегда","Ночью","Никогда в городе"],["От скорости","От покрытия","От погоды","От всего"],["60 км/ч","80 км/ч","50 км/ч","70 км/ч"],["Слева","Справа","С обеих сторон","Ждать"]];
    return ru[q%10];
  }
  if(lang==="kril"){
    const kr=[["Болалар","Пиёдалар ўтиш жойи","Эҳтиёт бўлинг","Мактаб яқинида"],["Чапга бурилиш белгиси бўлмаса","Ҳар доим","Трафик тирбанд бўлса","Йўл тор бўлса"],["2 баробар узаяди","Қисқаради","Ўзгармайди","Тезлик тақиқланади"],["Тўхташ керак","Тезлашиш керак","Сигнал бериш","Ҳаракатни давом эттириш"],["Ҳаракатни давом эттириш","Тўхтатиш","Чироқни кутиш","Сигнал бериш"],["Асосий йўлдаги ҳайдовчида","Иккиламчи йўлда","Иккисига тенг","Тезроқ ҳаракатланувчида"],["Хавфли вазиятда","Ҳар доим","Тунги пайтда","Шаҳарда ҳеч қачон"],["Тезликка","Йўл юзасига","Об-ҳавога","Барча омилларга"],["60 км/с","80 км/с","50 км/с","70 км/с"],["Чап тарафдан","Ўнг тарафдан","Ҳар икки тарафдан","Тўхтаб кутиш"]];
    return kr[q%10];
  }
  return OPTIONS[q%10];
}

const leaderboard=[{rank:1,name:"Jasur",xp:1850,av:"J"},{rank:2,name:"Alisher",xp:2460,av:"A",me:true},{rank:3,name:"Sardor",xp:1750,av:"S"},{rank:4,name:"Behzod",xp:1640,av:"B"},{rank:5,name:"Sanjar",xp:1500,av:"SA"},{rank:6,name:"Bobur",xp:1400,av:"BO"}];

// ─── UI COMPONENTS ───
function BottomNav({screen,setScreen,T,C}) {
  const tabs=[{id:"home",lk:"home",Icon:IC.Home},{id:"tickets",lk:"tickets",Icon:IC.Ticket},{id:"tests",lk:"tests",Icon:IC.Clipboard},{id:"exam",lk:"exam",Icon:IC.Clock},{id:"profile",lk:"profile",Icon:IC.User}];
  // Telegram va iPhone uchun pastki safe area
  const safeBottom = typeof window !== "undefined"
    ? (window?.Telegram?.WebApp?.safeAreaInset?.bottom || 0)
    : 0;
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,width:"100%",background:C.navBg,borderTop:`1px solid ${C.gray200}`,display:"flex",flexDirection:"row",zIndex:100,boxShadow:"0 -4px 20px rgba(0,0,0,0.1)",paddingBottom:safeBottom}}>
      {tabs.map(tab=>{
        const active=screen===tab.id||screen.startsWith(tab.id);
        return <button key={tab.id} onClick={()=>setScreen(tab.id)} style={{flex:1,padding:"10px 0 14px",border:"none",background:"transparent",display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer"}}>
          <tab.Icon size={22} color={active?C.primary:C.gray400}/>
          <span style={{fontSize:10,fontWeight:active?600:400,color:active?C.primary:C.gray400}}>{T[tab.lk]}</span>
        </button>;
      })}
    </div>
  );
}

function PhoneWrapper({children,showNav,screen,setScreen,T,C}) {
  return <div style={{width:"100%",minHeight:"100vh",background:C.bg,position:"relative",fontFamily:"'DM Sans','Segoe UI',sans-serif",paddingBottom:showNav?70:0}}>
    {children}
    {showNav&&<BottomNav screen={screen} setScreen={setScreen} T={T} C={C}/>}
  </div>;
}

function Btn({children,onClick,variant="primary",style={},disabled,C}) {
  const v={primary:{background:C.primary,color:"white"},outline:{background:"transparent",color:C.primary,border:`2px solid ${C.primary}`},danger:{background:C.danger,color:"white"}};
  return <button onClick={disabled?undefined:onClick} style={{padding:"14px 20px",borderRadius:14,border:"none",cursor:disabled?"not-allowed":"pointer",fontWeight:600,fontSize:15,width:"100%",opacity:disabled?0.6:1,...v[variant],...style}}>{children}</button>;
}

function Card({children,style={},C,onClick}) {
  return <div onClick={onClick} style={{background:C.card,borderRadius:16,padding:16,boxShadow:C===undefined?"0 2px 12px rgba(0,0,0,0.06)":`0 2px 12px rgba(0,0,0,0.12)`,border:`1px solid ${C.cardBorder}`,...style}}>{children}</div>;
}

function CircleProgress({percent,size=56,color}) {
  const r=(size-6)/2,circ=2*Math.PI*r;
  return <svg width={size} height={size}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={5}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5} strokeDasharray={circ} strokeDashoffset={circ-(percent/100)*circ} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
    <text x="50%" y="54%" textAnchor="middle" fontSize={size*0.22} fontWeight="700" fill={color}>{percent}%</text>
  </svg>;
}

// Lang selector modal
function LangModal({visible,onClose,lang,setLang,C}) {
  if(!visible) return null;
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
    <div style={{width:"100%",maxWidth:600,background:C.card,borderRadius:"24px 24px 0 0",padding:24}} onClick={e=>e.stopPropagation()}>
      <div style={{width:40,height:4,background:C.gray300,borderRadius:100,margin:"0 auto 20px"}}/>
      <div style={{fontWeight:700,fontSize:18,color:C.text,marginBottom:16}}>Tilni tanlang / Выберите язык</div>
      {Object.values(LANGS).map(l=>(
        <div key={l.code} onClick={()=>{setLang(l.code);onClose();}} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:14,marginBottom:8,background:lang===l.code?C.primary+"22":"transparent",border:`1.5px solid ${lang===l.code?C.primary:C.gray200}`,cursor:"pointer"}}>
          <span style={{fontWeight:600,fontSize:15,color:lang===l.code?C.primary:C.text}}>{l.label}</span>
          {lang===l.code&&<div style={{marginLeft:"auto"}}><IC.CheckCircle size={20} color={C.primary}/></div>}
        </div>
      ))}
    </div>
  </div>;
}

// Dark mode toggle button
function DarkToggle({dark,setDark,C,T}) {
  return <button onClick={()=>setDark(!dark)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:20,border:`1.5px solid ${C.gray200}`,background:C.card,cursor:"pointer"}}>
    {dark?<IC.Sun size={16} color="#F59E0B"/>:<IC.Moon size={16} color={C.gray400}/>}
    <span style={{fontSize:12,fontWeight:600,color:C.subtext}}>{dark?T.lightMode:T.darkMode}</span>
  </button>;
}

// ─── SCREENS ───
// ─── ONBOARDING ───
const OB_SLIDES = [
  {
    titleKey:"ob1Title", subKey:"ob1Sub",
    accent:"#1A6BFF",
    gradA:"#1A6BFF", gradB:"#6366F1",
    illustration:(
      <svg viewBox="0 0 280 220" width="280" height="220">
        {/* Road */}
        <rect x="0" y="140" width="280" height="80" rx="0" fill="rgba(255,255,255,0.08)"/>
        <rect x="120" y="148" width="40" height="8" rx="4" fill="rgba(255,255,255,0.3)"/>
        <rect x="120" y="168" width="40" height="8" rx="4" fill="rgba(255,255,255,0.3)"/>
        {/* Car body */}
        <rect x="80" y="100" width="120" height="50" rx="14" fill="white"/>
        <rect x="96" y="78" width="84" height="36" rx="12" fill="white" opacity="0.9"/>
        {/* Windows */}
        <rect x="102" y="84" width="32" height="24" rx="6" fill="#6366F1" opacity="0.4"/>
        <rect x="142" y="84" width="32" height="24" rx="6" fill="#6366F1" opacity="0.4"/>
        {/* Wheels */}
        <circle cx="110" cy="152" r="14" fill="#1E293B"/>
        <circle cx="110" cy="152" r="7" fill="white" opacity="0.5"/>
        <circle cx="170" cy="152" r="14" fill="#1E293B"/>
        <circle cx="170" cy="152" r="7" fill="white" opacity="0.5"/>
        {/* Headlights */}
        <rect x="190" y="112" width="14" height="8" rx="4" fill="#FEF3C7"/>
        <rect x="190" y="126" width="14" height="8" rx="4" fill="#FEF3C7" opacity="0.6"/>
        {/* N logo on car */}
        <rect x="124" y="108" width="32" height="26" rx="6" fill="#1A6BFF"/>
        <text x="140" y="126" textAnchor="middle" fontSize="16" fontWeight="900" fill="white" fontFamily="serif">N</text>
        {/* Scenery */}
        <circle cx="30" cy="110" r="22" fill="rgba(255,255,255,0.08)"/>
        <circle cx="250" cy="100" r="18" fill="rgba(255,255,255,0.06)"/>
        <circle cx="40" cy="55" r="5" fill="rgba(255,255,255,0.5)"/>
        <circle cx="240" cy="40" r="3" fill="rgba(255,255,255,0.4)"/>
        <circle cx="260" cy="75" r="4" fill="rgba(255,255,255,0.3)"/>
        <circle cx="18" cy="80" r="3" fill="rgba(255,255,255,0.35)"/>
        {/* Speed lines */}
        <line x1="20" y1="120" x2="60" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="3" strokeLinecap="round"/>
        <line x1="15" y1="130" x2="50" y2="130" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    titleKey:"ob2Title", subKey:"ob2Sub",
    accent:"#8B5CF6",
    gradA:"#7C3AED", gradB:"#4F46E5",
    illustration:(
      <svg viewBox="0 0 280 220" width="280" height="220">
        {/* Stacked ticket cards */}
        {[2,1,0].map(i=>(
          <g key={i} transform={`translate(${14+i*12},${50+i*10})`} opacity={i===0?1:i===1?0.7:0.45}>
            <rect x="0" y="0" width="200" height="110" rx="18" fill="white"/>
            <circle cx="0" cy="55" r="12" fill="#4F46E5" opacity="0.15"/>
            <circle cx="200" cy="55" r="12" fill="#4F46E5" opacity="0.15"/>
            <rect x="20" y="22" width="90" height="10" rx="5" fill="#7C3AED" opacity={0.35-i*0.05}/>
            <rect x="20" y="40" width="60" height="8" rx="4" fill="#7C3AED" opacity={0.2-i*0.03}/>
            <rect x="20" y="56" width="75" height="8" rx="4" fill="#7C3AED" opacity={0.15-i*0.02}/>
            <circle cx="152" cy="55" r="26" fill="#7C3AED" opacity={i===0?0.12:0.07}/>
            <text x="152" y="61" textAnchor="middle" fontSize="18" fontWeight="900" fill="#7C3AED" opacity={i===0?0.9:0.5}>20</text>
          </g>
        ))}
        {/* Check badge */}
        <circle cx="220" cy="170" r="28" fill="#22C55E"/>
        <polyline points="208,170 217,180 234,160" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Dots */}
        <circle cx="28" cy="188" r="5" fill="rgba(255,255,255,0.4)"/>
        <circle cx="44" cy="196" r="3" fill="rgba(255,255,255,0.3)"/>
        <circle cx="258" cy="50" r="4" fill="rgba(255,255,255,0.35)"/>
      </svg>
    )
  },
  {
    titleKey:"ob3Title", subKey:"ob3Sub",
    accent:"#EF4444",
    gradA:"#F59E0B", gradB:"#EF4444",
    illustration:(
      <svg viewBox="0 0 280 220" width="280" height="220">
        {/* Big clock */}
        <circle cx="140" cy="105" r="80" fill="rgba(255,255,255,0.07)"/>
        <circle cx="140" cy="105" r="66" fill="rgba(255,255,255,0.1)"/>
        <circle cx="140" cy="105" r="54" fill="rgba(255,255,255,0.15)"/>
        {/* Ticks */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a=>{
          const big=[0,90,180,270].includes(a);
          const r=54,rad=a*Math.PI/180;
          const len=big?10:6;
          const x1=140+r*Math.sin(rad),y1=105-r*Math.cos(rad);
          const x2=140+(r-len)*Math.sin(rad),y2=105-(r-len)*Math.cos(rad);
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={big?2.5:1.5} opacity={big?0.9:0.5}/>;
        })}
        {/* Hour numbers */}
        {[12,3,6,9].map((n,i)=>{
          const a=(i*90-90)*Math.PI/180;
          const r=42;
          return <text key={n} x={140+r*Math.cos(a)} y={105+r*Math.sin(a)+4} textAnchor="middle" fontSize="11" fontWeight="700" fill="white" opacity="0.8">{n}</text>;
        })}
        {/* Clock hands */}
        <line x1="140" y1="105" x2="140" y2="62" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="140" y1="105" x2="168" y2="120" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="140" y1="105" x2="112" y2="98" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="140" cy="105" r="5" fill="white"/>
        {/* Error indicator */}
        <rect x="30" y="175" width="50" height="22" rx="11" fill="rgba(255,255,255,0.2)"/>
        <text x="55" y="190" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">0 / 2</text>
        <rect x="200" y="175" width="50" height="22" rx="11" fill="#EF4444" opacity="0.8"/>
        <text x="225" y="190" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">2 / 2</text>
        <circle cx="258" cy="48" r="4" fill="rgba(255,255,255,0.4)"/>
        <circle cx="24" cy="70" r="3" fill="rgba(255,255,255,0.3)"/>
      </svg>
    )
  },
  {
    titleKey:"ob4Title", subKey:"ob4Sub",
    accent:"#22C55E",
    gradA:"#10B981", gradB:"#0891B2",
    illustration:(
      <svg viewBox="0 0 280 220" width="280" height="220">
        {/* Podium */}
        <rect x="60" y="155" width="52" height="44" rx="10" fill="rgba(255,255,255,0.25)"/>
        <rect x="114" y="130" width="52" height="69" rx="10" fill="rgba(255,255,255,0.4)"/>
        <rect x="168" y="165" width="52" height="34" rx="10" fill="rgba(255,255,255,0.2)"/>
        {/* Podium numbers */}
        <text x="86" y="182" textAnchor="middle" fontSize="16" fontWeight="900" fill="white" opacity="0.8">2</text>
        <text x="140" y="168" textAnchor="middle" fontSize="20" fontWeight="900" fill="#FFD700">1</text>
        <text x="194" y="190" textAnchor="middle" fontSize="14" fontWeight="900" fill="white" opacity="0.7">3</text>
        {/* Avatars on podium */}
        <circle cx="86" cy="140" r="18" fill="rgba(255,255,255,0.3)"/>
        <text x="86" y="146" textAnchor="middle" fontSize="14" fill="white" fontWeight="700">J</text>
        <circle cx="140" cy="112" r="22" fill="white" opacity="0.95"/>
        <text x="140" y="120" textAnchor="middle" fontSize="16" fill="#10B981" fontWeight="900">A</text>
        <circle cx="194" cy="152" r="16" fill="rgba(255,255,255,0.25)"/>
        <text x="194" y="157" textAnchor="middle" fontSize="13" fill="white" fontWeight="700">S</text>
        {/* Crown on 1st */}
        <polygon points="126,98 133,86 140,94 147,86 154,98" fill="#FFD700"/>
        {/* Stars */}
        <circle cx="38" cy="55" r="4" fill="rgba(255,255,255,0.5)"/>
        <circle cx="55" cy="35" r="3" fill="rgba(255,255,255,0.35)"/>
        <circle cx="242" cy="42" r="4" fill="rgba(255,255,255,0.45)"/>
        <circle cx="260" cy="65" r="3" fill="rgba(255,255,255,0.3)"/>
        {/* XP bar */}
        <rect x="60" y="60" width="160" height="12" rx="6" fill="rgba(255,255,255,0.15)"/>
        <rect x="60" y="60" width="110" height="12" rx="6" fill="rgba(255,255,255,0.6)"/>
        <text x="60" y="50" fontSize="10" fill="rgba(255,255,255,0.7)" fontWeight="600">2460 XP</text>
        <text x="220" y="50" fontSize="10" fill="rgba(255,255,255,0.5)" fontWeight="600">3000</text>
      </svg>
    )
  },
];

// Static translations for lang-select screen (before lang is chosen)
const LANG_SELECT_TEXTS = {
  uz:   { title:"Tilni tanlang",    subtitle:"Davom etish uchun qulay tilni tanlang" },
  ru:   { title:"Выберите язык",    subtitle:"Выберите удобный язык для продолжения" },
  kril: { title:"Тилни танланг",    subtitle:"Давом этиш учун қулай тилни танланг" },
};

function OnboardingScreen({onFinish, lang, setLang}) {
  // Step 0 = lang select, steps 1-4 = slides
  const [step, setStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState(lang);

  const T = LANGS[selectedLang];
  const slideIdx = step - 1;
  const slide = OB_SLIDES[slideIdx] || OB_SLIDES[0];
  const isSlide = step > 0;
  const isLast = step === OB_SLIDES.length;

  const confirmLang = () => {
    setLang(selectedLang);
    setStep(1);
  };

  // ── LANG SELECT SCREEN ──
  if(step === 0) {
    const lt = LANG_SELECT_TEXTS[selectedLang];
    return (
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",background:"linear-gradient(160deg,#0F172A,#1E293B)"}}>
        {/* Top decorations */}
        <div style={{position:"relative",height:220,overflow:"hidden",flexShrink:0}}>
          {/* Circles decoration */}
          <div style={{position:"absolute",top:-60,left:-60,width:220,height:220,borderRadius:"50%",background:"rgba(26,107,255,0.12)"}}/>
          <div style={{position:"absolute",top:-30,left:-30,width:140,height:140,borderRadius:"50%",background:"rgba(26,107,255,0.1)"}}/>
          <div style={{position:"absolute",top:40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(99,102,241,0.1)"}}/>
          {/* N Logo */}
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:80,height:80,borderRadius:24,background:"linear-gradient(135deg,#1A6BFF,#6366F1)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 40px rgba(26,107,255,0.5)"}}>
            <span style={{color:"white",fontSize:44,fontWeight:900,fontFamily:"serif",lineHeight:1}}>N</span>
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1,padding:"0 28px",display:"flex",flexDirection:"column"}}>
          <h2 style={{color:"white",fontSize:26,fontWeight:900,margin:"0 0 8px",textAlign:"center",letterSpacing:"-0.5px"}}>
            {lt.title}
          </h2>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:14,margin:"0 0 32px",textAlign:"center",lineHeight:1.5}}>
            {lt.subtitle}
          </p>

          {/* Lang options */}
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:32}}>
            {Object.values(LANGS).map(l=>{
              const active = selectedLang === l.code;
              return (
                <div key={l.code} onClick={()=>setSelectedLang(l.code)}
                  style={{
                    display:"flex",alignItems:"center",gap:16,
                    padding:"16px 20px",borderRadius:18,cursor:"pointer",
                    background:active?"rgba(26,107,255,0.15)":"rgba(255,255,255,0.05)",
                    border:`2px solid ${active?"#1A6BFF":"rgba(255,255,255,0.08)"}`,
                    transition:"all 0.2s"
                  }}>
                  {/* Left color bar */}
                  <div style={{width:4,height:36,borderRadius:2,background:active?"#1A6BFF":"rgba(255,255,255,0.15)",transition:"background 0.2s"}}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:15,color:active?"white":"rgba(255,255,255,0.7)"}}>
                      {l.label}
                    </div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:2}}>
                      {l.code==="uz"?"Lotin alifbosi":l.code==="ru"?"Кириллица / Русский":"Кирилл алифбоси"}
                    </div>
                  </div>
                  {/* Radio */}
                  <div style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${active?"#1A6BFF":"rgba(255,255,255,0.2)"}`,background:active?"#1A6BFF":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s"}}>
                    {active&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirm button */}
          <button onClick={confirmLang}
            style={{width:"100%",padding:"16px",borderRadius:18,border:"none",background:"linear-gradient(135deg,#1A6BFF,#6366F1)",color:"white",fontSize:16,fontWeight:800,cursor:"pointer",boxShadow:"0 4px 24px rgba(26,107,255,0.4)",letterSpacing:"0.3px"}}>
            {T.continue} →
          </button>
        </div>
        <div style={{height:32}}/>
      </div>
    );
  }

  // ── SLIDES ──
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",background:`linear-gradient(150deg,${slide.gradA},${slide.gradB})`,transition:"background 0.45s"}}>
      {/* Top bar */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"52px 24px 0"}}>
        {/* Back to lang select */}
        <button onClick={()=>setStep(step-1)}
          style={{width:36,height:36,borderRadius:12,background:"rgba(255,255,255,0.15)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="19" y1="12" x2="5" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><polyline points="12 19 5 12 12 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {/* Step dots top */}
        <div style={{display:"flex",gap:6}}>
          {OB_SLIDES.map((_,i)=>(
            <div key={i} onClick={()=>setStep(i+1)} style={{height:6,borderRadius:3,cursor:"pointer",transition:"all 0.3s",width:slideIdx===i?22:6,background:slideIdx===i?"white":"rgba(255,255,255,0.35)"}}/>
          ))}
        </div>
        {/* Skip */}
        {!isLast
          ? <button onClick={onFinish} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:12,padding:"8px 14px",color:"white",fontSize:12,fontWeight:700,cursor:"pointer"}}>{T.skip}</button>
          : <div style={{width:60}}/>
        }
      </div>

      {/* Illustration */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px 0"}}>
        <div style={{filter:"drop-shadow(0 16px 40px rgba(0,0,0,0.25))",transition:"opacity 0.3s"}}>
          {slide.illustration}
        </div>
      </div>

      {/* Bottom sheet */}
      <div style={{background:"rgba(0,0,0,0.18)",backdropFilter:"blur(20px)",borderRadius:"28px 28px 0 0",padding:"28px 28px 44px"}}>
        <h2 style={{color:"white",fontSize:23,fontWeight:900,margin:"0 0 10px",textAlign:"center",lineHeight:1.3,letterSpacing:"-0.3px"}}>
          {T[slide.titleKey]}
        </h2>
        <p style={{color:"rgba(255,255,255,0.8)",fontSize:14,margin:"0 0 28px",textAlign:"center",lineHeight:1.65}}>
          {T[slide.subKey]}
        </p>
        {/* Next / Start */}
        <button onClick={isLast?onFinish:()=>setStep(step+1)}
          style={{width:"100%",padding:"16px",borderRadius:18,border:"none",background:"white",color:slide.gradA,fontSize:16,fontWeight:900,cursor:"pointer",boxShadow:"0 4px 24px rgba(0,0,0,0.2)",letterSpacing:"0.2px"}}>
          {isLast ? T.getStarted : T.continue}
        </button>
      </div>
    </div>
  );
}



// ─── TOPIC ICON HELPER ───
function TopicIcon({icon, size=20, color="#94A3B8"}) {
  const map = {
    traffic: IC.Traffic, roadsign: IC.RoadSign, refresh: IC.Refresh,
    walk: IC.Walk, weather: IC.Weather, speed: IC.Speed,
    ambulance: IC.Ambulance, wrench: IC.Wrench,
    mandatory: IC.Mandatory, prohibit: IC.Prohibit, warning: IC.Warning,
    warning2: IC.Warning, info: IC.Info, hospital: IC.Hospital,
    ticket: IC.Ticket2, stats: IC.Stats, graduation: IC.GraduationCap2,
  };
  const Comp = map[icon] || IC.Info;
  return <Comp size={size} color={color}/>;
}

// ─── PRO GATE KOMPONENTI ───
function ProGate({T, C, setScreen, reason, onBack}) {
  const reasons = {
    ticket: {
      title: "Bu bilet Pro uchun",
      sub: "Ushbu bilet faqat Pro obuna foydalanuvchilari uchun ochiq.",
      icon: "ticket",
    },
    testLimit: {
      title: "Kunlik limit tugadi",
      sub: `Bugun ${LIMITS.dailyTestLimit} ta bepul test savoliga javob berdingiz. Davom etish uchun Pro obuna oling.`,
      icon: "stats",
    },
    examLimit: {
      title: "Bepul imtihon tugadi",
      sub: `Kuniga ${LIMITS.freeExamCount} ta bepul imtihon. Bugungi imtihon huquqingiz tugadi.`,
      icon: "graduation",
    },
  };
  const r = reasons[reason] || reasons.ticket;
  return (
    <div style={{minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, textAlign:"center"}}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:20}}><TopicIcon icon={r.icon} size={60} color="#8B5CF6"/></div>
      <div style={{width:72, height:72, borderRadius:22, background:"linear-gradient(135deg,#8B5CF6,#6366F1)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", boxShadow:"0 8px 24px rgba(139,92,246,0.4)"}}>
        <IC.Diamond size={34} color="white"/>
      </div>
      <h2 style={{fontSize:22, fontWeight:900, color:C.text, margin:"0 0 10px"}}>{r.title}</h2>
      <p style={{fontSize:14, color:C.subtext, margin:"0 0 32px", lineHeight:1.7, maxWidth:280}}>{r.sub}</p>
      <button onClick={()=>setScreen("pro")} style={{width:"100%", maxWidth:300, padding:"16px", borderRadius:16, border:"none", background:"linear-gradient(135deg,#8B5CF6,#6366F1)", color:"white", fontSize:16, fontWeight:800, cursor:"pointer", boxShadow:"0 6px 20px rgba(139,92,246,0.4)", marginBottom:12}}>
        <span style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}><IC.Diamond size={18} color="white"/>Pro obuna olish</span>
      </button>
      <button onClick={onBack} style={{width:"100%", maxWidth:300, padding:"14px", borderRadius:14, border:`2px solid ${C.gray200}`, background:"transparent", color:C.subtext, fontSize:14, fontWeight:600, cursor:"pointer"}}>
        Orqaga qaytish
      </button>
    </div>
  );
}

function LoginScreen({setScreen,setUser,T,C,dark,setDark,lang,setLang}) {
  const [showPass,setShowPass]=useState(false);
  const [phone,setPhone]=useState("+998 90 123 45 67");
  const [pass,setPass]=useState("12345678");
  const [showLang,setShowLang]=useState(false);
  return (
    <div style={{minHeight:"100vh",background:dark?"#0F172A":`linear-gradient(160deg,#e8f0ff,#f5f8ff)`,padding:24,display:"flex",flexDirection:"column"}}>
      <LangModal visible={showLang} onClose={()=>setShowLang(false)} lang={lang} setLang={setLang} C={C}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <button onClick={()=>setShowLang(true)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderRadius:20,border:`1.5px solid ${C.gray200}`,background:C.card,cursor:"pointer"}}>
          <IC.Globe size={14} color={C.gray400}/><span style={{fontSize:12,fontWeight:600,color:C.subtext}}>{LANGS[lang].flag} {LANGS[lang].label}</span>
        </button>
        <DarkToggle dark={dark} setDark={setDark} C={C} T={T}/>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <div style={{width:90,height:90,borderRadius:24,background:"linear-gradient(135deg,#1A6BFF,#5B9FFF)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 32px rgba(26,107,255,0.3)",marginBottom:12}}>
          <span style={{color:"white",fontSize:48,fontWeight:900,fontFamily:"serif"}}>N</span>
        </div>
        <h2 style={{fontSize:26,fontWeight:800,color:C.text,margin:"0 0 4px"}}>Nazariy</h2>
        <p style={{color:C.subtext,margin:"0 0 36px",fontSize:14}}>Avtotest Ilovasi</p>
        <Card C={C} style={{width:"100%",padding:24}}>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:13,color:C.subtext,fontWeight:500,display:"block",marginBottom:6}}>{T.phone}</label>
            <div style={{background:C.inputBg,borderRadius:12,padding:"13px 16px",border:`1.5px solid ${C.gray200}`,display:"flex",alignItems:"center",gap:8}}>
              <IC.Phone size={18} color={C.gray400}/><input value={phone} onChange={e=>setPhone(e.target.value)} style={{border:"none",background:"transparent",fontSize:15,flex:1,outline:"none",color:C.text}}/>
            </div>
          </div>
          <div style={{marginBottom:8}}>
            <label style={{fontSize:13,color:C.subtext,fontWeight:500,display:"block",marginBottom:6}}>{T.password}</label>
            <div style={{background:C.inputBg,borderRadius:12,padding:"13px 16px",border:`1.5px solid ${C.gray200}`,display:"flex",alignItems:"center",gap:8}}>
              <IC.Lock size={18} color={C.gray400}/>
              <input type={showPass?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} style={{border:"none",background:"transparent",fontSize:15,flex:1,outline:"none",color:C.text}}/>
              <button onClick={()=>setShowPass(!showPass)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",padding:0}}>
                {showPass?<IC.EyeOff size={18} color={C.gray400}/>:<IC.Eye size={18} color={C.gray400}/>}
              </button>
            </div>
          </div>
          <p style={{textAlign:"right",color:C.primary,fontSize:13,marginBottom:20,cursor:"pointer"}}>{T.forgotPass}</p>
          <Btn C={C} onClick={()=>{setUser({name:"Alisher",surname:"Karimov",phone:"+998 90 123 45 67"});setScreen("home");}}>{T.login}</Btn>
          <div style={{display:"flex",alignItems:"center",gap:12,margin:"16px 0"}}>
            <div style={{flex:1,height:1,background:C.gray200}}/><span style={{color:C.gray400,fontSize:13}}>{T.orWith}</span><div style={{flex:1,height:1,background:C.gray200}}/>
          </div>
          <button onClick={()=>{setUser({name:"Alisher",surname:"Karimov",phone:"+998 90 123 45 67"});setScreen("home");}} style={{width:"100%",padding:13,borderRadius:12,border:`1.5px solid ${C.gray200}`,background:C.card,display:"flex",alignItems:"center",justifyContent:"center",gap:10,fontSize:14,fontWeight:600,cursor:"pointer",color:C.text}}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            {T.googleLogin}
          </button>
        </Card>
        <p style={{marginTop:20,fontSize:14,color:C.subtext}}>{T.noAccount} <span onClick={()=>setScreen("register")} style={{color:C.primary,fontWeight:600,cursor:"pointer"}}>{T.register}</span></p>
      </div>
    </div>
  );
}

function RegisterScreen({setScreen,setUser,T,C}) {
  const [form,setForm]=useState({name:"Alisher",surname:"Karimov",phone:"+998 90 123 45 67",pass:"",pass2:""});
  const [show,setShow]=useState({});
  const fields=[[T.name,"name","text"],[T.surname,"surname","text"],[T.phone,"phone","tel"],[T.password,"pass","password"],[T.confirmPass,"pass2","password"]];
  return (
    <div style={{minHeight:"100vh",background:C.white,padding:24}}>
      <button onClick={()=>setScreen("login")} style={{background:C.gray100,border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
        <IC.ArrowLeft size={18} color={C.text}/>
      </button>
      <h2 style={{fontSize:24,fontWeight:800,color:C.text,marginBottom:4}}>{T.register}</h2>
      <p style={{color:C.subtext,fontSize:14,marginBottom:28}}>{T.createAccount}</p>
      {fields.map(([label,key,type])=>(
        <div key={key} style={{marginBottom:14}}>
          <label style={{fontSize:13,color:C.subtext,fontWeight:500,display:"block",marginBottom:6}}>{label}</label>
          <div style={{background:C.inputBg,borderRadius:12,padding:"13px 16px",border:`1.5px solid ${C.gray200}`,display:"flex",alignItems:"center",gap:8}}>
            {type==="password"&&<IC.Lock size={16} color={C.gray400}/>}
            {type==="tel"&&<IC.Phone size={16} color={C.gray400}/>}
            {type==="text"&&<IC.User size={16} color={C.gray400}/>}
            <input type={type==="password"?(show[key]?"text":"password"):type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} style={{border:"none",background:"transparent",fontSize:15,flex:1,outline:"none",color:C.text}}/>
            {type==="password"&&<button onClick={()=>setShow({...show,[key]:!show[key]})} style={{background:"none",border:"none",cursor:"pointer",display:"flex",padding:0}}>
              {show[key]?<IC.EyeOff size={16} color={C.gray400}/>:<IC.Eye size={16} color={C.gray400}/>}
            </button>}
          </div>
        </div>
      ))}
      <div style={{marginTop:8}}><Btn C={C} onClick={()=>{setUser({name:form.name,surname:form.surname,phone:form.phone});setScreen("home");}}>{T.register}</Btn></div>
      <p style={{textAlign:"center",marginTop:16,fontSize:14,color:C.subtext}}>{T.haveAccount} <span onClick={()=>setScreen("login")} style={{color:C.primary,fontWeight:600,cursor:"pointer"}}>{T.login}</span></p>
    </div>
  );
}

function HomeScreen({setScreen,user,T,C,unreadCount,savedQuestions,dark,setDark,lang,setLang}) {
  const [showLang,setShowLang]=useState(false);
  const [searchQuery,setSearchQuery]=useState("");

  const menuItems=[
    {lk:"tickets", Icon:IC.Ticket,       sc:"tickets", accent:"#1A6BFF", light:"#EBF2FF"},
    {lk:"topics",  Icon:IC.Map,          sc:"topics",  accent:"#22C55E", light:"#DCFCE7"},
    {lk:"exam",    Icon:IC.GraduationCap,sc:"exam",    accent:"#F59E0B", light:"#FEF3C7"},
    {lk:"stats",   Icon:IC.BarChart,     sc:"stats",   accent:"#8B5CF6", light:"#F5F3FF"},
    {lk:"rating",  Icon:IC.Medal,        sc:"rating",  accent:"#F59E0B", light:"#FEF3C7"},
    {lk:"rules",   Icon:IC.Shield,       sc:"rules",   accent:"#EC4899", light:"#FCE7F3"},
  ];

  const activities=[
    {Icon:IC.Ticket,    label:"Bilet 12", score:"18/20", p:90,  color:"#1A6BFF"},
    {Icon:IC.Clipboard, label:"Test",     score:"19/25", p:76,  color:"#8B5CF6"},
    {Icon:IC.Clock,     label:"Imtihon",  score:"18/20", p:90,  color:"#22C55E"},
  ];

  return (
    <div style={{minHeight:"100vh",background:C.bg,paddingBottom:24}} onClick={()=>showLang&&setShowLang(false)}>

      {/* ── TOP BAR ── */}
      <div style={{padding:"52px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>

        {/* Lang dropdown trigger */}
        <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
          <button onClick={()=>setShowLang(!showLang)}
            style={{display:"flex",alignItems:"center",gap:7,padding:"8px 14px",borderRadius:20,border:`1.5px solid ${showLang?C.primary:C.gray200}`,background:showLang?C.primary+"18":C.card,cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",transition:"all 0.2s"}}>
            <IC.Globe size={14} color={showLang?C.primary:C.gray400}/>
            <span style={{fontSize:12,fontWeight:700,color:showLang?C.primary:C.subtext}}>{LANGS[lang].label}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{transform:showLang?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.25s"}}>
              <polyline points="6 9 12 15 18 9" stroke={showLang?C.primary:C.gray400} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Dropdown panel */}
          {showLang&&(
            <div style={{
              position:"absolute",top:"calc(100% + 8px)",left:0,
              background:C.card,borderRadius:16,
              boxShadow:`0 8px 32px rgba(0,0,0,${dark?0.4:0.14})`,
              border:`1.5px solid ${C.gray200}`,
              overflow:"hidden",zIndex:200,minWidth:190,
              animation:"dropDown 0.18s ease"
            }}>
              <style>{`@keyframes dropDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
              {Object.values(LANGS).map((l,i)=>{
                const active=lang===l.code;
                return (
                  <div key={l.code} onClick={()=>{setLang(l.code);setShowLang(false);}}
                    style={{
                      display:"flex",alignItems:"center",gap:12,
                      padding:"12px 16px",cursor:"pointer",
                      background:active?C.primary+"15":"transparent",
                      borderBottom:i<Object.values(LANGS).length-1?`1px solid ${C.gray200}`:"none",
                      transition:"background 0.15s"
                    }}>
                    <span style={{flex:1,fontSize:13,fontWeight:active?700:500,color:active?C.primary:C.text}}>{l.label}</span>
                    {active&&(
                      <div style={{width:18,height:18,borderRadius:"50%",background:C.primary,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {/* Dark toggle */}
          <button onClick={()=>setDark(!dark)}
            style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderRadius:20,border:`1.5px solid ${C.gray200}`,background:C.card,cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            {dark
              ? <IC.Sun size={15} color="#F59E0B"/>
              : <IC.Moon size={15} color="#8B5CF6"/>
            }
          </button>
          {/* Bell */}
          <button onClick={()=>setScreen("notifications")}
            style={{width:36,height:36,borderRadius:"50%",background:C.card,border:`1.5px solid ${C.gray200}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            <IC.Bell size={16} color={C.gray600}/>
            {unreadCount>0&&<div style={{position:"absolute",top:-2,right:-2,minWidth:16,height:16,borderRadius:8,background:"#EF4444",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:900,color:"white",padding:"0 3px"}}>{unreadCount>9?"9+":unreadCount}</div>}
          </button>
        </div>
      </div>

      {/* ── HERO GREETING ── */}
      <div style={{padding:"24px 20px 0"}}>

        {/* SEARCH BAR */}
        <div style={{marginTop:20,display:"flex",alignItems:"center",gap:10,background:C.card,borderRadius:16,padding:"12px 16px",border:`1.5px solid ${searchQuery?C.primary:C.gray200}`,boxShadow:"0 1px 6px rgba(0,0,0,0.05)",transition:"border 0.2s"}}>
          <IC.Search size={16} color={searchQuery?C.primary:C.gray400}/>
          <input
            value={searchQuery||""}
            onChange={e=>setSearchQuery(e.target.value)}
            placeholder={T.searchPlaceholder}
            style={{flex:1,border:"none",background:"transparent",fontSize:14,outline:"none",color:C.text}}
          />
          {searchQuery
            ? <button onClick={()=>setSearchQuery("")} style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex"}}><IC.XCircle size={16} color={C.gray400}/></button>
            : <IC.Filter size={15} color={C.gray400}/>
          }
        </div>

        {/* STATS STRIP */}
        <div style={{display:"flex",gap:10,marginTop:14}}>
          {[
            {label:T.active,  val:"92%", color:"#1A6BFF", bg:dark?"#1A3A6B22":"#EBF2FF"},
            {label:T.tests,   val:"85%", color:"#22C55E", bg:dark?"#16653622":"#DCFCE7"},
            {label:T.rating,  val:"#24", color:"#F59E0B", bg:dark?"#78350f22":"#FEF3C7"},
          ].map(s=>(
            <div key={s.label} style={{flex:1,background:s.bg,borderRadius:16,padding:"12px 10px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:900,color:s.color}}>{s.val}</div>
              <div style={{fontSize:10,color:C.subtext,marginTop:2,fontWeight:500}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"18px 20px 0"}}>
        <div style={{background:dark?"linear-gradient(135deg,#1e3a5f,#1e2d5a)":"linear-gradient(135deg,#1A6BFF,#3B82F6)",borderRadius:22,padding:"18px 20px",position:"relative",overflow:"hidden"}}>
          {/* decorative circle */}
          <div style={{position:"absolute",right:-20,top:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
          <div style={{position:"absolute",right:30,bottom:-30,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative"}}>
            <div>
              <div style={{color:"rgba(255,255,255,0.75)",fontSize:12,fontWeight:500,marginBottom:4}}>{T.todayGoal}</div>
              <div style={{color:"white",fontSize:22,fontWeight:900}}>120 <span style={{fontSize:14,fontWeight:500,opacity:0.7}}>/ 150 {T.questions}</span></div>
            </div>
            <div style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"6px 12px"}}>
              <span style={{color:"white",fontSize:14,fontWeight:800}}>80%</span>
            </div>
          </div>
          <div style={{marginTop:14,height:6,background:"rgba(255,255,255,0.2)",borderRadius:100}}>
            <div style={{height:"100%",width:"80%",background:"white",borderRadius:100,boxShadow:"0 0 8px rgba(255,255,255,0.5)"}}/>
          </div>
        </div>
      </div>

      {/* ── QUICK MENU ── */}
      <div style={{padding:"20px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontWeight:700,fontSize:15,color:C.text}}>Xizmatlar</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {menuItems.map(item=>{
            const bg = dark ? item.accent+"28" : item.light;
            return (
              <div key={item.lk} onClick={()=>setScreen(item.sc)}
                style={{background:bg,borderRadius:18,padding:"16px 10px",textAlign:"center",cursor:"pointer",position:"relative",transition:"transform 0.15s",border:`1px solid ${item.accent}22`}}>
                <div style={{width:40,height:40,borderRadius:14,background:item.accent+"22",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px"}}>
                  <item.Icon size={20} color={item.accent}/>
                </div>
                <div style={{fontSize:12,fontWeight:700,color:C.text}}>{T[item.lk]}</div>
                {item.lk==="tests"&&savedQuestions.length>0&&(
                  <div style={{position:"absolute",top:8,right:8,minWidth:16,height:16,borderRadius:8,background:"#F59E0B",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:900,color:"white",padding:"0 3px"}}>{savedQuestions.length}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RECENT ACTIVITY ── */}
      <div style={{padding:"20px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontWeight:700,fontSize:15,color:C.text}}>{T.lastActivity}</span>
          <span onClick={()=>setScreen("tickets")} style={{fontSize:12,color:C.primary,fontWeight:600,cursor:"pointer"}}>{T.allBtn}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {activities.map((a,i)=>(
            <div key={i} style={{background:C.card,borderRadius:16,padding:"13px 16px",display:"flex",alignItems:"center",gap:12,border:`1px solid ${C.cardBorder}`,boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
              <div style={{width:38,height:38,borderRadius:12,background:a.color+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <a.Icon size={18} color={a.color}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13,color:C.text}}>{a.label}</div>
                <div style={{fontSize:11,color:C.subtext,marginTop:1}}>{a.score}</div>
              </div>
              <div style={{background:a.p>=80?C.success+"18":C.warning+"18",borderRadius:20,padding:"4px 10px"}}>
                <span style={{fontSize:12,fontWeight:800,color:a.p>=80?C.success:C.warning}}>{a.p}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TicketsScreen({setScreen,setActiveTicket,T,C,user}) {
  const [tab,setTab]=useState("all");
  const isPro = user?.pro || false;
  const pm=[95,90,80,100,75,null,null,null,null,null,88,null,null,null,null,null,null,null,null,null];
  const list=tickets.slice(0,20).map((t,i)=>({...t,progress:pm[i]}));
  const filtered=list.filter(t=>tab==="all"?true:tab==="done"?t.progress!==null:t.progress===null);

  const handleTicketClick = (ticket) => {
    if(ticket.isPro && !isPro) {
      setActiveTicket(ticket);
      setScreen("ticket-pro-gate");
      return;
    }
    setActiveTicket(ticket);
    setScreen("ticket-quiz");
  };

  return (
    <div>
      <div style={SC.header(C)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><h2 style={{color:"white",fontSize:22,fontWeight:800,margin:0}}>{T.tickets}</h2><p style={{color:"rgba(255,255,255,0.7)",fontSize:13,margin:0}}>{T.allTickets}</p></div>
          {isPro && <div style={{background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"5px 12px",display:"flex",alignItems:"center",gap:5}}><IC.Diamond size={14} color="white"/><span style={{color:"white",fontSize:12,fontWeight:700}}>PRO</span></div>}
        </div>
        <div style={{display:"flex",gap:8,marginTop:16}}>
          {[["all",T.allTab],["done",T.done],["undone",T.undone]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",background:tab===id?"white":"rgba(255,255,255,0.2)",color:tab===id?C.primary:"white",fontSize:13,fontWeight:600}}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{padding:16}}>
        {/* Bepul/Pro info */}
        {!isPro && <div style={{background:C.card,borderRadius:12,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10,border:`1px solid ${C.cardBorder}`}}>
          <IC.Info size={16} color={C.primary}/>
          <span style={{fontSize:12,color:C.subtext,flex:1}}>Biletlar 1-{LIMITS.freeTicketCount} bepul. {LIMITS.freeTicketCount+1}-100 Pro uchun <IC.Diamond size={12} color="#8B5CF6"/></span>
        </div>}
        {filtered.map(ticket=>{
          const isLocked = ticket.isPro && !isPro;
          return (
            <div key={ticket.id} onClick={()=>handleTicketClick(ticket)}
              style={{background:C.card,borderRadius:14,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.08)",cursor:"pointer",border:`1px solid ${isLocked?"#E2E8F0":C.cardBorder}`,opacity:isLocked?0.8:1}}>
              <div style={{width:40,height:40,borderRadius:12,background:isLocked?"#F1F5F9":ticket.progress!==null?C.primary+"22":C.gray100,display:"flex",alignItems:"center",justifyContent:"center",marginRight:12,fontWeight:700,color:isLocked?C.muted:ticket.progress!==null?C.primary:C.gray600,fontSize:13}}>
                {isLocked ? <IC.Lock size={18} color={C.muted}/> : `B${ticket.id}`}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14,color:isLocked?C.subtext:C.text,display:"flex",alignItems:"center",gap:6}}>
                  {T.ticket} {ticket.id}
                  {ticket.isPro && <span style={{fontSize:9,fontWeight:800,background:"linear-gradient(135deg,#8B5CF6,#6366F1)",color:"white",borderRadius:6,padding:"2px 6px"}}>PRO</span>}
                </div>
                <div style={{fontSize:12,color:C.subtext}}>20 {T.questions}</div>
              </div>
              {!isLocked && ticket.progress!==null
                ? <CircleProgress percent={ticket.progress} size={44} color={ticket.progress>=80?C.success:C.warning}/>
                : isLocked
                  ? <IC.Diamond size={18} color="#8B5CF6"/>
                  : <div style={{width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center"}}><IC.ChevronRight size={16} color={C.muted}/></div>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OptionsList({options,correct,selected,onSelect,C}) {
  return <>{options.map((opt,i)=>{
    const letter=String.fromCharCode(65+i),isSel=selected===i,isCorr=i===correct;
    let bg=C.gray100,border="transparent",color=C.text;
    if(selected!==null){if(isCorr){bg="#DCFCE7";border=C.success;color=C.success;}else if(isSel){bg="#FEE2E2";border=C.danger;color=C.danger;}}
    return <div key={i} onClick={()=>selected===null&&onSelect(i)} style={{background:bg,borderRadius:14,padding:"14px 16px",marginBottom:10,border:`2px solid ${border}`,cursor:selected!==null?"default":"pointer",display:"flex",alignItems:"center",gap:12}}>
      <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,background:selected!==null&&isCorr?C.success:selected!==null&&isSel?C.danger:C.card,border:`2px solid ${C.gray300}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:selected!==null&&(isCorr||isSel)?"white":C.gray600}}>{letter}</div>
      <span style={{fontWeight:500,fontSize:14,color}}>{opt}</span>
    </div>;
  })}</>;
}

function TicketQuizScreen({setScreen,ticket,setLastResult,T,C,lang,savedQuestions,setSavedQuestions,addToast}) {
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState({});
  const [selected,setSelected]=useState(null);
  const [answered,setAnswered]=useState(false);
  if(!ticket){setScreen("tickets");return null;}
  const q=ticket.questions[current],total=ticket.questions.length;

  const qKey = `${ticket.id}-${q.id}`;
  const isSaved = savedQuestions.some(s=>s.key===qKey);

  const toggleBookmark = () => {
    if(isSaved){
      setSavedQuestions(savedQuestions.filter(s=>s.key!==qKey));
      addToast(T.bookmarkRemoved,"info");
    } else {
      setSavedQuestions([...savedQuestions,{
        key:qKey, ticketId:ticket.id, questionId:q.id,
        question:q.question, sign:q.sign, options:q.options, correct:q.correct,
        savedAt:Date.now()
      }]);
      addToast(T.bookmarkAdded,"success");
    }
  };

  const handleAnswer=(optIdx)=>{
    if(answered) return;
    setSelected(optIdx);
    setAnswered(true);
    setAnswers({...answers,[current]:optIdx});
    // Kunlik hisoblagichni oshirish (faqat birinchi marta javob berganda)
    incDailyCount('tests');
  };

  const goNext=()=>{
    if(current+1<total){setCurrent(current+1);setSelected(answers[current+1]??null);setAnswered(answers[current+1]!==undefined);}
    else{const na={...answers};const c=Object.values(na).filter((v,i)=>v===ticket.questions[i]?.correct).length;setLastResult({ticket,correct:c,total,wrong:total-c});setScreen("ticket-result");}
  };

  const goBack=()=>{
    if(current>0){setCurrent(current-1);setSelected(answers[current-1]??null);setAnswered(answers[current-1]!==undefined);}
  };

  const explanation = q.explanation;

  return <div style={{minHeight:"100vh",background:C.white,paddingBottom:90}}>
    <div style={{...SC.header(C),padding:"50px 20px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <button onClick={()=>setScreen("tickets")} style={{background:"rgba(255,255,255,0.2)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><IC.ArrowLeft size={18} color="white"/></button>
        <div style={{color:"white",fontWeight:700,fontSize:16}}>{T.ticket} {ticket.id}</div>
        <button onClick={toggleBookmark} style={{width:36,height:36,background:isSaved?"rgba(255,215,0,0.3)":"rgba(255,255,255,0.2)",borderRadius:10,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.2s"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved?"#FFD700":"none"} stroke={isSaved?"#FFD700":"white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
      <div style={{color:"rgba(255,255,255,0.8)",fontSize:13,marginBottom:8}}>{T.questionOf} {current+1} / {total}</div>
      <div style={{display:"flex",gap:3}}>{Array.from({length:total}).map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:100,background:answers[i]!==undefined?"white":i===current?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.25)"}}/>)}</div>
    </div>
    <div style={{padding:20}}>
      <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:20,lineHeight:1.5}}>{getQ(q.question,lang)}</div>
      {q.sign!==null&&<div style={{textAlign:"center",marginBottom:20,background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",borderRadius:20,padding:20}}><SignSVG type={SIGNS[q.sign%8]}/></div>}
      <OptionsList options={getOpts(q.options,lang)} correct={q.correct} selected={selected} onSelect={handleAnswer} C={C}/>
      {answered&&(
        <div style={{marginTop:16,borderRadius:14,padding:"14px 16px",
          background:selected===q.correct?`${C.success}10`:`${C.danger}10`,
          borderLeft:`4px solid ${selected===q.correct?C.success:C.danger}`}}>
          {/* To'g'ri/noto'g'ri banner */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:explanation?10:0}}>
            {selected===q.correct
              ? <IC.CheckCircle size={16} color={C.success}/>
              : <IC.XCircle size={16} color={C.danger}/>}
            <span style={{fontSize:13,fontWeight:700,color:selected===q.correct?C.success:C.danger}}>
              {selected===q.correct?(T.correct||"To'g'ri!"):(T.wrong||"Noto'g'ri!")}
            </span>
            {selected!==q.correct&&(
              <span style={{fontSize:12,color:C.subtext,marginLeft:"auto"}}>
                {T.correct||"To'g'ri"}: {String.fromCharCode(65+q.correct)}
              </span>
            )}
          </div>
          {/* Izoh qismi */}
          <div style={{borderTop:explanation?`1px solid ${selected===q.correct?C.success+"30":C.danger+"30"}`:"none",
            paddingTop:explanation?10:0}}>
            {explanation?(
              <>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                  <IC.Info size={13} color={C.primary}/>
                  <span style={{fontSize:11,fontWeight:700,color:C.primary,textTransform:"uppercase",letterSpacing:"0.5px"}}>
                    {T.explanationTitle||"Izoh"}
                  </span>
                </div>
                <p style={{margin:0,fontSize:13,color:C.text,lineHeight:1.6}}>
                  {typeof explanation==="object"?(explanation[lang]||explanation.uz):explanation}
                </p>
              </>
            ):(
              <p style={{margin:0,fontSize:12,color:C.subtext,fontStyle:"italic"}}>
                {T.noExplanation||"Bu savol uchun izoh qo'shilmagan."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
    {/* Fixed bottom nav */}
    <div style={{position:"fixed",bottom:70,left:16,right:16,width:"calc(100% - 32px)",display:"flex",gap:12,padding:"0 0 8px",zIndex:50}}>
      <button onClick={goBack} disabled={current===0} style={{flex:1,padding:"14px",borderRadius:14,border:`2px solid ${current===0?C.gray200:C.primary}`,background:C.card,color:current===0?C.gray400:C.primary,fontSize:14,fontWeight:700,cursor:current===0?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,opacity:current===0?0.5:1}}>
        <IC.ArrowLeft size={16} color={current===0?C.gray400:C.primary}/>{T.back}
      </button>
      <button onClick={goNext} disabled={!answered} style={{flex:1,padding:"14px",borderRadius:14,border:"none",background:answered?`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`:C.gray200,color:answered?"white":C.gray400,fontSize:14,fontWeight:700,cursor:answered?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
        {current+1===total?(T.finish||"Tugatish"):(T.next)}<IC.ArrowRight size={16} color={answered?"white":C.gray400}/>
      </button>
    </div>
  </div>;
}

function ResultScreen({icon,title,subtitle,correct,wrong,percent,stats,actions,T,C}) {
  return <div style={{minHeight:"100vh",background:C.white,padding:20}}>
    <div style={{textAlign:"center",padding:"40px 0 28px"}}>
      <div style={{width:96,height:96,borderRadius:"50%",margin:"0 auto 16px",background:icon==="pass"?"#DCFCE7":"#FEE2E2",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {icon==="pass"?<IC.CheckCircle size={52} color={C.success}/>:<IC.XCircle size={52} color={C.danger}/>}
      </div>
      <div style={{fontSize:46,fontWeight:900,color:icon==="pass"?C.success:C.danger}}>{percent}%</div>
      <div style={{fontSize:22,fontWeight:800,color:C.text,marginTop:4}}>{title}</div>
      {subtitle&&<div style={{fontSize:14,color:C.subtext,marginTop:4}}>{subtitle}</div>}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
      {[{lk:"correct",val:correct,color:C.success,bg:"#DCFCE7",Icon:IC.CheckCircle},{lk:"wrong",val:wrong,color:C.danger,bg:"#FEE2E2",Icon:IC.XCircle},{lk:"result",val:`${percent}%`,color:C.primary,bg:C.primary+"22",Icon:IC.BarChart}].map(s=>(
        <Card key={s.lk} C={C} style={{textAlign:"center",background:s.bg,padding:"14px 8px"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:4}}><s.Icon size={20} color={s.color}/></div>
          <div style={{fontSize:20,fontWeight:800,color:s.color}}>{s.val}</div>
          <div style={{fontSize:10,color:C.subtext}}>{T[s.lk]}</div>
        </Card>
      ))}
    </div>
    {stats&&<Card C={C} style={{marginBottom:20}}>{stats.map(s=><div key={s.label} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.gray100}`}}><span style={{fontSize:14,color:C.subtext}}>{s.label}</span><span style={{fontSize:14,fontWeight:700,color:s.color||C.text}}>{s.value}</span></div>)}</Card>}
    <div style={{display:"flex",flexDirection:"column",gap:10}}>{actions.map((a,i)=><Btn key={i} C={C} variant={i===0?"primary":"outline"} onClick={a.onClick}>{a.label}</Btn>)}</div>
  </div>;
}

function TicketResultScreen({setScreen,result,T,C}) {
  if(!result){setScreen("tickets");return null;}
  const {correct,total,wrong}=result,percent=Math.round((correct/total)*100);
  return <ResultScreen T={T} C={C} icon={wrong<=2?"pass":"fail"} title={wrong<=2?T.greatResult:T.failed} subtitle={`Bilet ${result.ticket?.id} ${T.ticketDone}`} correct={correct} wrong={wrong} total={total} percent={percent} actions={[{label:T.otherTicket,onClick:()=>setScreen("tickets")},{label:T.goHome,onClick:()=>setScreen("home")}]}/>;
}

function TestsScreen({setScreen,T,C,user}) {
  const isPro = user?.pro || false;
  const usedToday = getDailyCount('tests');
  const remaining = Math.max(0, LIMITS.dailyTestLimit - usedToday);
  const limitReached = !isPro && remaining === 0;
  return <div style={{paddingBottom:80}}>
    <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,padding:"52px 20px 24px"}}>
      <h2 style={{color:"white",fontSize:22,fontWeight:800,margin:0}}>{T.tests}</h2>
      <p style={{color:"rgba(255,255,255,0.7)",fontSize:13,margin:"4px 0 0"}}>{T.testsSub}</p>
    </div>
    <div style={{padding:16}}>
      <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,borderRadius:20,padding:20,marginBottom:16,display:"flex",alignItems:"center",gap:16}}>
        <div style={{width:56,height:56,background:"rgba(255,255,255,0.2)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center"}}><IC.Infinity size={28} color="white"/></div>
        <div><div style={{color:"white",fontWeight:800,fontSize:18}}>{T.infiniteTest}</div><div style={{color:"rgba(255,255,255,0.7)",fontSize:13}}>{T.infiniteSub}</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        {[{lk:"currentSeries",val:"12",Icon:IC.Flame,ic:C.danger},{lk:"bestSeries",val:"27",Icon:IC.Star,ic:C.warning}].map(s=>(
          <Card key={s.lk} C={C} style={{textAlign:"center"}}><div style={{display:"flex",justifyContent:"center",marginBottom:4}}><s.Icon size={28} color={s.ic}/></div><div style={{fontSize:24,fontWeight:800,color:C.primary}}>{s.val}</div><div style={{fontSize:11,color:C.subtext}}>{T[s.lk]}</div><div style={{fontSize:10,color:C.gray400}}>{T.rightAnswer}</div></Card>
        ))}
      </div>
      {[{lk:"lastResults",Icon:IC.BarChart,ic:C.primary,sc:null},{lk:"byTopic",Icon:IC.BookOpen,ic:C.success,sc:null},{lk:"hardQ",Icon:IC.Bookmark,ic:"#FFD700",sc:"saved"}].map(item=>(
        <Card key={item.lk} C={C} style={{marginBottom:10,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>item.sc&&setScreen(item.sc)}>
          <div style={{display:"flex",alignItems:"center",gap:12}}><item.Icon size={20} color={item.ic}/><span style={{fontWeight:600,fontSize:14,color:C.text}}>{item.lk==="hardQ"?T.savedQ:T[item.lk]}</span></div>
          <IC.ChevronRight size={16} color={C.gray400}/>
        </Card>
      ))}
    </div>
    {/* Sticky bottom button */}
    <div style={{position:"fixed",bottom:70,left:16,right:16,width:"calc(100% - 32px)",padding:"0 0 8px",zIndex:50}}>
      {!isPro && <div style={{textAlign:"center",marginBottom:8,fontSize:12,color:remaining<20?C.danger:C.subtext}}>
        Bugun qolgan: <strong style={{color:remaining<20?C.danger:C.primary}}>{remaining}/{LIMITS.dailyTestLimit}</strong> ta bepul test
      </div>}
      <button onClick={()=>{ if(limitReached){setScreen("test-limit-gate");return;} setScreen("test-quiz"); }}
        style={{width:"100%",padding:"16px",borderRadius:16,border:"none",background:limitReached?"#E2E8F0":`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:limitReached?C.muted:"white",fontSize:16,fontWeight:800,cursor:"pointer",boxShadow:limitReached?"none":`0 6px 20px ${C.primary}50`}}>
        {limitReached ? <span style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}><IC.Lock size={16} color={C.muted}/>Kunlik limit tugadi</span> : T.startTest}
      </button>
    </div>
  </div>;
}

function TestQuizScreen({setScreen,setLastTestResult,T,C,lang,savedQuestions,setSavedQuestions}) {
  const allQs=tickets.slice(0,5).flatMap(t=>t.questions.slice(0,5));
  const [questions]=useState(()=>allQs.sort(()=>Math.random()-0.5).slice(0,12));
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState({});
  const [selected,setSelected]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [timeLeft,setTimeLeft]=useState(600);
  useEffect(()=>{const t=setInterval(()=>setTimeLeft(p=>p>0?p-1:0),1000);return()=>clearInterval(t);},[]);
  const mins=Math.floor(timeLeft/60).toString().padStart(2,"0"),secs=(timeLeft%60).toString().padStart(2,"0"),q=questions[current];
  const qKey=`test-${current}`;
  const isSaved=savedQuestions.some(s=>s.key===qKey);
  const toggleBookmark=()=>{if(isSaved){setSavedQuestions(savedQuestions.filter(s=>s.key!==qKey));}else{setSavedQuestions([...savedQuestions,{key:qKey,question:q?.question,options:q?.options,correct:q?.correct,ticketId:"test"}]);}};
  const handleAnswer=(optIdx)=>{
    if(answered) return;
    setSelected(optIdx);
    setAnswered(true);
    setAnswers({...answers,[current]:optIdx});
  };
  const goNext=()=>{
    if(current+1<questions.length){setCurrent(current+1);setSelected(answers[current+1]??null);setAnswered(answers[current+1]!==undefined);}
    else{const na={...answers};const c=Object.values(na).filter((v,i)=>v===questions[i]?.correct).length;setLastTestResult({correct:c,total:questions.length,wrong:questions.length-c});setScreen("test-result");}
  };
  const goBack=()=>{if(current>0){setCurrent(current-1);setSelected(answers[current-1]??null);setAnswered(answers[current-1]!==undefined);}};
  const explanation=q?.explanation;
  return <div style={{minHeight:"100vh",background:C.white,paddingBottom:90}}>
    <div style={{...SC.header(C),padding:"50px 20px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <button onClick={()=>setScreen("tests")} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,width:36,height:36,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><IC.ArrowLeft size={18} color="white"/></button>
        <div style={{textAlign:"center"}}><div style={{color:"rgba(255,255,255,0.7)",fontSize:12}}>{T.question}</div><div style={{color:"white",fontWeight:800,fontSize:18}}>{current+1}/{questions.length}</div></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={toggleBookmark} style={{width:36,height:36,background:isSaved?"rgba(255,215,0,0.3)":"rgba(255,255,255,0.2)",borderRadius:10,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><IC.Bookmark size={18} color={isSaved?"#FFD700":"white"}/></button>
          <div style={{background:"rgba(255,255,255,0.2)",borderRadius:12,padding:"8px 14px",display:"flex",alignItems:"center",gap:6}}><IC.Clock size={14} color="white"/><span style={{color:"white",fontWeight:700,fontSize:16}}>{mins}:{secs}</span></div>
        </div>
      </div>
      <div style={{display:"flex",gap:4}}>{questions.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:100,background:answers[i]!==undefined?"white":i===current?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.2)"}}/>)}</div>
    </div>
    <div style={{padding:20}}>
      <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:20,lineHeight:1.5}}>{getQ(q?.question,lang)}</div>
      <OptionsList options={getOpts(q?.options,lang)} correct={q?.correct||0} selected={selected} onSelect={handleAnswer} C={C}/>
      {answered&&(
        <div style={{marginTop:16,borderRadius:14,padding:"14px 16px",
          background:selected===q.correct?`${C.success}10`:`${C.danger}10`,
          borderLeft:`4px solid ${selected===q.correct?C.success:C.danger}`}}>
          {/* To'g'ri/noto'g'ri banner */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:explanation?10:0}}>
            {selected===q.correct
              ? <IC.CheckCircle size={16} color={C.success}/>
              : <IC.XCircle size={16} color={C.danger}/>}
            <span style={{fontSize:13,fontWeight:700,color:selected===q.correct?C.success:C.danger}}>
              {selected===q.correct?(T.correct||"To'g'ri!"):(T.wrong||"Noto'g'ri!")}
            </span>
            {selected!==q.correct&&(
              <span style={{fontSize:12,color:C.subtext,marginLeft:"auto"}}>
                {T.correct||"To'g'ri"}: {String.fromCharCode(65+q.correct)}
              </span>
            )}
          </div>
          {/* Izoh qismi */}
          <div style={{borderTop:explanation?`1px solid ${selected===q.correct?C.success+"30":C.danger+"30"}`:"none",
            paddingTop:explanation?10:0}}>
            {explanation?(
              <>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                  <IC.Info size={13} color={C.primary}/>
                  <span style={{fontSize:11,fontWeight:700,color:C.primary,textTransform:"uppercase",letterSpacing:"0.5px"}}>
                    {T.explanationTitle||"Izoh"}
                  </span>
                </div>
                <p style={{margin:0,fontSize:13,color:C.text,lineHeight:1.6}}>
                  {typeof explanation==="object"?(explanation[lang]||explanation.uz):explanation}
                </p>
              </>
            ):(
              <p style={{margin:0,fontSize:12,color:C.subtext,fontStyle:"italic"}}>
                {T.noExplanation||"Bu savol uchun izoh qo'shilmagan."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
    <div style={{position:"fixed",bottom:70,left:16,right:16,width:"calc(100% - 32px)",display:"flex",gap:12,padding:"0 0 8px",zIndex:50}}>
      <button onClick={goBack} disabled={current===0} style={{flex:1,padding:"14px",borderRadius:14,border:`2px solid ${current===0?C.gray200:C.primary}`,background:C.card,color:current===0?C.gray400:C.primary,fontSize:14,fontWeight:700,cursor:current===0?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,opacity:current===0?0.5:1}}>
        <IC.ArrowLeft size={16} color={current===0?C.gray400:C.primary}/>{T.back}
      </button>
      <button onClick={goNext} disabled={!answered} style={{flex:1,padding:"14px",borderRadius:14,border:"none",background:answered?`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`:C.gray200,color:answered?"white":C.gray400,fontSize:14,fontWeight:700,cursor:answered?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
        {current+1===questions.length?(T.finish||"Tugatish"):T.next}<IC.ArrowRight size={16} color={answered?"white":C.gray400}/>
      </button>
    </div>
  </div>;
}

function ExamScreen({setScreen,T,C,user}) {
  const isPro = user?.pro || false;
  const usedExams = getDailyCount('exams');
  const examRemaining = Math.max(0, LIMITS.freeExamCount - usedExams);
  const examLimitReached = !isPro && examRemaining === 0;
  return <div style={SC.screen(C)}>
    <div style={{...SC.header(C),padding:"52px 20px 32px",textAlign:"center"}}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><IC.GraduationCap size={56} color="white"/></div>
      <h2 style={{color:"white",fontSize:24,fontWeight:800,margin:0}}>{T.examTitle}</h2>
      <p style={{color:"rgba(255,255,255,0.8)",fontSize:14,margin:"4px 0 0"}}>{T.examReady}</p>
    </div>
    <div style={{padding:20}}>
      <Card C={C} style={{marginBottom:20}}>
        <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:14}}>{T.examRules}</div>
        {[T.rule1,T.rule2,T.rule3,T.rule4].map((r,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:10,alignItems:"flex-start"}}><div style={{width:6,height:6,borderRadius:"50%",background:C.primary,marginTop:6,flexShrink:0}}/><span style={{fontSize:14,color:C.subtext,lineHeight:1.5}}>{r}</span></div>)}
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {[{lk:"questionCount",val:"20",Icon:IC.FileText,c:C.primary},{lk:"time",val:"20:00",Icon:IC.Clock,c:C.success},{lk:"errorLimit",val:"2",Icon:IC.AlertTriangle,c:C.danger}].map(s=>(
          <Card key={s.lk} C={C} style={{textAlign:"center",padding:"16px 8px"}}><div style={{display:"flex",justifyContent:"center",marginBottom:6}}><s.Icon size={22} color={s.c}/></div><div style={{fontSize:18,fontWeight:800,color:s.c}}>{s.val}</div><div style={{fontSize:11,color:C.subtext}}>{T[s.lk]}</div></Card>
        ))}
      </div>
    </div>
    {/* Sticky bottom button */}
    <div style={{position:"fixed",bottom:70,left:16,right:16,width:"calc(100% - 32px)",padding:"0 0 8px",zIndex:50}}>
      {!isPro && <div style={{textAlign:"center",marginBottom:8,fontSize:12,color:examLimitReached?C.danger:C.subtext}}>
        Bugun qolgan: <strong style={{color:examLimitReached?C.danger:C.primary}}>{examRemaining}/{LIMITS.freeExamCount}</strong> ta bepul imtihon
      </div>}
      <button onClick={()=>{ if(examLimitReached){setScreen("exam-limit-gate");return;} setScreen("exam-quiz"); }}
        style={{width:"100%",padding:"16px",borderRadius:16,border:"none",background:examLimitReached?"#E2E8F0":`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:examLimitReached?C.muted:"white",fontSize:16,fontWeight:800,cursor:"pointer",boxShadow:examLimitReached?"none":`0 6px 20px ${C.primary}50`}}>
        {examLimitReached ? <span style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}><IC.Lock size={16} color={C.muted}/>Kunlik limit tugadi</span> : T.startExam}
      </button>
    </div>
  </div>;
}

function ExamQuizScreen({setScreen,setExamResult,T,C,lang,user}) {
  const isPro = user?.pro || false;
  // Faqat Pro bo'lgan biletlar savollarini imtihonga kiritmaylik
  const allQs = tickets
    .filter(t => !t.isPro || isPro)
    .slice(0,10)
    .flatMap(t=>t.questions.slice(0,5));
  const [questions]=useState(()=>allQs.sort(()=>Math.random()-0.5).slice(0,20));
  const [current,setCurrent]=useState(0);const [answers,setAnswers]=useState({});const [selected,setSelected]=useState(null);const [timeLeft,setTimeLeft]=useState(1200);const [wrongCount,setWrongCount]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTimeLeft(p=>{if(p<=1){const c=Object.values(answers).filter((v,i)=>v===questions[i]?.correct).length;setExamResult({correct:c,total:questions.length,wrong:questions.length-c,passed:(questions.length-c)<=2});setScreen("exam-result");return 0;}return p-1;}),1000);return()=>clearInterval(t);},[]);
  const mins=Math.floor(timeLeft/60).toString().padStart(2,"0"),secs=(timeLeft%60).toString().padStart(2,"0"),q=questions[current];
  const handleAnswer=(optIdx)=>{setSelected(optIdx);const nw=wrongCount+(optIdx!==q.correct?1:0);if(nw>2){const na={...answers,[current]:optIdx};const c=Object.values(na).filter((v,i)=>v===questions[i]?.correct).length;setTimeout(()=>{setExamResult({correct:c,total:questions.length,wrong:nw,passed:false});setScreen("exam-fail");},800);return;}setWrongCount(nw);setTimeout(()=>{const na={...answers,[current]:optIdx};setAnswers(na);if(current+1<questions.length){setCurrent(current+1);setSelected(null);}else{const c=Object.values(na).filter((v,i)=>v===questions[i]?.correct).length;const w=questions.length-c;incDailyCount('exams');setExamResult({correct:c,total:questions.length,wrong:w,passed:w<=2,percent:Math.round((c/questions.length)*100)});setScreen("exam-result");}},600);};
  return <div style={{minHeight:"100vh",background:C.white}}>
    <div style={{...SC.header(C),padding:"50px 20px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{background:"rgba(255,255,255,0.2)",borderRadius:12,padding:"6px 14px"}}><div style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>{T.question}</div><div style={{color:"white",fontWeight:800,fontSize:16}}>{current+1}/{questions.length}</div></div>
        <div style={{background:"rgba(255,255,255,0.2)",borderRadius:12,padding:"6px 14px",display:"flex",alignItems:"center",gap:6}}><IC.Clock size={14} color="white"/><div><div style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>{T.time}</div><div style={{color:"white",fontWeight:800,fontSize:16}}>{mins}:{secs}</div></div></div>
        <div style={{background:wrongCount>0?"rgba(239,68,68,0.3)":"rgba(255,255,255,0.2)",borderRadius:12,padding:"6px 14px",display:"flex",alignItems:"center",gap:6}}><IC.AlertTriangle size={14} color={wrongCount>1?C.danger:"white"}/><div><div style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>{T.errors}</div><div style={{color:wrongCount>1?C.danger:"white",fontWeight:800,fontSize:16}}>{wrongCount}/2</div></div></div>
      </div>
      <div style={{display:"flex",gap:3}}>{questions.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:100,background:i<current?"white":"rgba(255,255,255,0.3)"}}/>)}</div>
    </div>
    <div style={{padding:20}}>
      <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:20,lineHeight:1.5}}>{getQ(q?.question,lang)}</div>
      <OptionsList options={getOpts(q?.options,lang)} correct={q?.correct||0} selected={selected} onSelect={handleAnswer} C={C}/>
    </div>
  </div>;
}

function ExamResultScreen({setScreen,result,T,C}) {
  if(!result){setScreen("exam");return null;}
  const {correct,total,wrong,passed}=result,percent=result.percent??Math.round((correct/total)*100);
  const statsRows=passed?[{label:T.avgResult,value:"87%",color:C.success},{label:T.examCount,value:"8"},{label:T.passedExams,value:"5",color:C.success},{label:T.failedExams,value:"3",color:C.danger}]:null;
  return <ResultScreen T={T} C={C} icon={passed?"pass":"fail"} title={passed?T.congrats:T.examFailed} subtitle={passed?T.examPassed:`${wrong} ${T.tooManyErrors}`} correct={correct} wrong={wrong} total={total} percent={percent} stats={statsRows} actions={passed?[{label:T.goHome,onClick:()=>setScreen("home")}]:[{label:T.retryExam,onClick:()=>setScreen("exam-quiz")},{label:T.goHome,onClick:()=>setScreen("home")}]}/>;
}

function StatsScreen({T,C}) {
  const graph=[60,70,55,75,80,72,85];
  const months=["01.05","02.05","03.05","04.05","05.05","06.05","07.05"];
  const tabs=[T.general,T.weekly,T.monthly,T.yearly];
  const [tab,setTab]=useState(0);
  const sCards=[{lk:"totalQ",val:"2450",c:C.primary,bg:C.primary+"22",Icon:IC.FileText},{lk:"correctA",val:"1980",c:C.success,bg:"#DCFCE7",Icon:IC.CheckCircle},{lk:"wrongA",val:"470",c:C.danger,bg:"#FEE2E2",Icon:IC.XCircle},{lk:"correctPct",val:"81%",c:C.warning,bg:C.warning+"22",Icon:IC.TrendingUp}];
  return <div style={{paddingBottom:16}}>
    <div style={{padding:"52px 20px 20px"}}><h2 style={{fontSize:22,fontWeight:800,color:C.text,margin:0}}>{T.statistics}</h2></div>
    <div style={{padding:"0 16px"}}>
      <div style={{display:"flex",gap:8,marginBottom:16}}>{tabs.map((t,i)=><button key={t} onClick={()=>setTab(i)} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",background:tab===i?C.primary:C.gray200,color:tab===i?"white":C.subtext,fontSize:13,fontWeight:600}}>{t}</button>)}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        {sCards.map(s=><Card key={s.lk} C={C} style={{background:s.bg,padding:16}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><s.Icon size={18} color={s.c}/></div><div style={{fontSize:24,fontWeight:900,color:s.c}}>{s.val}</div><div style={{fontSize:12,color:C.subtext}}>{T[s.lk]}</div></Card>)}
      </div>
      <Card C={C}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:16,color:C.text,display:"flex",alignItems:"center",gap:8}}><IC.TrendingUp size={18} color={C.primary}/>{T.resultsGraph}</div>
        <svg width="100%" height="120" viewBox="0 0 320 120">
          <defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.primary} stopOpacity="0.25"/><stop offset="100%" stopColor={C.primary} stopOpacity="0"/></linearGradient></defs>
          {[0,25,50,75,100].map(v=><line key={v} x1="0" y1={100-v} x2="320" y2={100-v} stroke={C.gray200} strokeWidth="1" strokeDasharray="4,4"/>)}
          <polyline points={graph.map((v,i)=>`${i*53},${110-v}`).join(" ")} fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinejoin="round"/>
          <polygon points={`0,110 ${graph.map((v,i)=>`${i*53},${110-v}`).join(" ")} ${6*53},110`} fill="url(#gg)"/>
          {graph.map((v,i)=><circle key={i} cx={i*53} cy={110-v} r="5" fill={C.primary} stroke={C.card} strokeWidth="2"/>)}
        </svg>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>{months.map(m=><span key={m} style={{fontSize:10,color:C.gray400}}>{m}</span>)}</div>
      </Card>
    </div>
  </div>;
}

function RatingScreen({T,C}) {
  const [tab,setTab]=useState(1);const gold=["#C0C0C0","#FFD700","#CD7F32"];const po=[0,1,2];const hs=[85,110,70];
  return <div style={{paddingBottom:16}}>
    <div style={{padding:"52px 20px 16px"}}><h2 style={{fontSize:22,fontWeight:800,color:C.text,margin:0,display:"flex",alignItems:"center",gap:8}}><IC.Medal size={24} color={C.warning}/>{T.ratingTitle}</h2></div>
    <div style={{padding:"0 16px"}}>
      <div style={{display:"flex",gap:8,marginBottom:20}}>{[T.daily,T.weekly,T.monthly,T.allTab].map((t,i)=><button key={t} onClick={()=>setTab(i)} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",background:tab===i?C.primary:C.gray200,color:tab===i?"white":C.subtext,fontSize:13,fontWeight:600}}>{t}</button>)}</div>
      <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:10,marginBottom:24}}>
        {po.map((pi,i)=>{const u=leaderboard[pi];return <div key={i} style={{textAlign:"center",flex:1}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:u.me?`linear-gradient(135deg,${C.primary},#5B9FFF)`:`linear-gradient(135deg,${gold[i]},rgba(255,255,255,0.5))`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 6px",fontWeight:800,fontSize:18,color:"white",boxShadow:u.me?`0 4px 16px ${C.primary}66`:"0 2px 8px rgba(0,0,0,0.1)"}}>{u.av}</div>
          <div style={{fontSize:13,fontWeight:700,color:C.text}}>{u.name}</div>
          <div style={{fontSize:12,color:C.primary,fontWeight:600}}>{u.xp} xp</div>
          <div style={{height:hs[i],background:gold[i],borderRadius:"10px 10px 0 0",marginTop:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:900,color:"white"}}>{pi+1}</div>
        </div>;})}
      </div>
      {leaderboard.slice(3).map(u=><Card key={u.rank} C={C} style={{marginBottom:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,...(u.me?{border:`2px solid ${C.primary}`}:{})}}>
        <div style={{fontSize:16,fontWeight:700,color:C.gray400,width:24,textAlign:"center"}}>{u.rank}</div>
        <div style={{width:40,height:40,borderRadius:"50%",background:u.me?`linear-gradient(135deg,${C.primary},#5B9FFF)`:C.gray200,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:u.me?"white":C.gray600}}>{u.av}</div>
        <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:C.text}}>{u.name}</div></div>
        <div style={{fontWeight:700,color:C.primary}}>{u.xp} xp</div>
      </Card>)}
    </div>
  </div>;
}



// ─── ABOUT SCREEN ───
function AboutScreen({setScreen, T, C, lang}) {
  return (
    <div style={{minHeight:"100vh", background:C.bg, paddingBottom:80}}>
      <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`, padding:"52px 20px 32px", position:"relative", overflow:"hidden", textAlign:"center"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <button onClick={()=>setScreen("profile")} style={{background:"rgba(255,255,255,0.15)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,position:"relative"}}>
          <IC.ArrowLeft size={18} color="white"/>
        </button>
        <div style={{width:76,height:76,borderRadius:22,background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>
          <span style={{color:"white",fontSize:38,fontWeight:900,fontFamily:"serif"}}>N</span>
        </div>
        <h2 style={{color:"white",fontSize:24,fontWeight:900,margin:"0 0 6px"}}>Nazariy</h2>
        <p style={{color:"rgba(255,255,255,0.7)",fontSize:13,margin:"0 0 4px"}}>Avtotest Ilovasi</p>
        <p style={{color:"rgba(255,255,255,0.5)",fontSize:12,margin:0}}>v{APP_CONFIG.version}</p>
      </div>

      <div style={{padding:"20px 16px"}}>
        {/* Biz haqimizda */}
        <div style={{background:C.card,borderRadius:16,padding:18,marginBottom:14,border:`1px solid ${C.cardBorder}`}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
            <IC.Info size={16} color={C.primary}/> {T.about}
          </div>
          <p style={{margin:0,fontSize:13,color:C.subtext,lineHeight:1.7}}>
            {typeof APP_CONFIG.aboutText === "object"
              ? (APP_CONFIG.aboutText[lang] || APP_CONFIG.aboutText.uz)
              : APP_CONFIG.aboutText}
          </p>
        </div>

        {/* Aloqa */}
        <div style={{background:C.card,borderRadius:16,padding:18,marginBottom:14,border:`1px solid ${C.cardBorder}`}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
            <IC.Headphones size={16} color="#22C55E"/> {T.support}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:C.bg,borderRadius:12,cursor:"pointer"}}
            onClick={()=>{
              const url=`https://t.me/${APP_CONFIG.supportUsername}`;
              if(window.Telegram?.WebApp?.openTelegramLink) window.Telegram.WebApp.openTelegramLink(url);
              else window.open(url,'_blank');
            }}>
            <div style={{width:38,height:38,borderRadius:10,background:"#DCFCE7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <IC.Headphones size={18} color="#22C55E"/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13,color:C.text}}>Telegram Support</div>
              <div style={{fontSize:12,color:"#22C55E",marginTop:1}}>@{APP_CONFIG.supportUsername}</div>
            </div>
            <IC.ChevronRight size={16} color={C.muted}/>
          </div>
        </div>

        {/* Yangiliklar kanali */}
        <div style={{background:C.card,borderRadius:16,padding:18,marginBottom:14,border:`1px solid ${C.cardBorder}`}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
            <IC.Bell size={16} color={C.primary}/> {T.news || "Yangiliklar"}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:C.bg,borderRadius:12,cursor:"pointer"}}
            onClick={()=>{
              const url=`https://t.me/${APP_CONFIG.newsChannel}`;
              if(window.Telegram?.WebApp?.openTelegramLink) window.Telegram.WebApp.openTelegramLink(url);
              else window.open(url,'_blank');
            }}>
            <div style={{width:38,height:38,borderRadius:10,background:C.primary+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <IC.Bell size={18} color={C.primary}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13,color:C.text}}>Telegram Kanal</div>
              <div style={{fontSize:12,color:C.primary,marginTop:1}}>@{APP_CONFIG.newsChannel}</div>
            </div>
            <IC.ChevronRight size={16} color={C.muted}/>
          </div>
        </div>

        {/* Versiya va huquq */}
        <div style={{textAlign:"center",padding:"12px 0",color:C.muted,fontSize:12}}>
          <div style={{marginBottom:4}}>Nazariy v{APP_CONFIG.version}</div>
          <div>© 2025 Nazariy Avtotest. Barcha huquqlar himoyalangan.</div>
        </div>
      </div>
    </div>
  );
}

// ─── REFERRAL SCREEN ───
function ReferralScreen({setScreen, T, C, user, addToast}) {
  const refCode = genReferralCode(user);
  // Demo ma'lumotlar (real da backenddan keladi)
  const [invitedCount] = useState(4);
  const [history] = useState([
    {name:"Alisher T.", date:"10.06.2025", status:"active"},
    {name:"Bobur M.",   date:"09.06.2025", status:"active"},
    {name:"Sardor K.",  date:"08.06.2025", status:"active"},
    {name:"Zulfiya N.", date:"07.06.2025", status:"active"},
  ]);

  const milestones = REFERRAL_CONFIG.milestones;
  const earned = milestones.filter(m => invitedCount >= m.count);
  const next = nextMilestone(invitedCount);
  const progressPct = next ? Math.min(100, Math.round(invitedCount / next.count * 100)) : 100;

  const copyCode = () => {
    try { navigator.clipboard.writeText(refCode); } catch {}
    addToast(T.referralCopied || "Nusxalandi!", "success");
  };

  const shareRef = () => {
    const text = `Nazariy avtotestga qo'shiling! Mening referal kodim: ${refCode}
https://t.me/NazariyBot?start=${refCode}`;
    if(window.Telegram?.WebApp?.switchInlineQuery) {
      window.Telegram.WebApp.switchInlineQuery(text);
    } else {
      try { navigator.clipboard.writeText(text); } catch {}
      addToast("Havola nusxalandi!", "success");
    }
  };

  return (
    <div style={{minHeight:"100vh", background:C.bg, paddingBottom:80}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`, padding:"52px 20px 28px", position:"relative", overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <button onClick={()=>setScreen("profile")} style={{background:"rgba(255,255,255,0.15)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
          <IC.ArrowLeft size={18} color="white"/>
        </button>
        <div style={{textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><IC.Gift size={44} color="white"/></div>
          <h2 style={{color:"white",fontSize:22,fontWeight:900,margin:"0 0 6px"}}>{T.referralTitle}</h2>
          <p style={{color:"rgba(255,255,255,0.8)",fontSize:13,margin:0,lineHeight:1.6}}>{T.referralSub}</p>
        </div>
      </div>

      <div style={{padding:"20px 16px"}}>

        {/* Referal kod */}
        <div style={{background:C.card,borderRadius:18,padding:18,marginBottom:16,border:`1px solid ${C.cardBorder}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.subtext,textTransform:"uppercase",letterSpacing:0.5,marginBottom:10}}>
            {T.referralCode}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,background:C.bg,borderRadius:12,padding:"12px 16px",marginBottom:12}}>
            <div style={{flex:1,fontFamily:"monospace",fontSize:20,fontWeight:900,color:C.primary,letterSpacing:3}}>
              {refCode}
            </div>
            <button onClick={copyCode} style={{background:C.primary,border:"none",borderRadius:10,padding:"8px 14px",color:"white",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              <IC.FileText size={14} color="white"/>
              {T.referralCopy}
            </button>
          </div>
          <button onClick={shareRef} style={{width:"100%",padding:"13px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <IC.ArrowRight size={16} color="white"/>
            {T.referralShare}
          </button>
        </div>

        {/* Statistika */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          <div style={{background:C.card,borderRadius:16,padding:16,border:`1px solid ${C.cardBorder}`,textAlign:"center"}}>
            <div style={{fontSize:32,fontWeight:900,color:C.primary}}>{invitedCount}</div>
            <div style={{fontSize:12,color:C.subtext,marginTop:4}}>{T.referralInvited}</div>
          </div>
          <div style={{background:C.card,borderRadius:16,padding:16,border:`1px solid ${C.cardBorder}`,textAlign:"center"}}>
            <div style={{fontSize:32,fontWeight:900,color:"#22C55E"}}>{earned.length}</div>
            <div style={{fontSize:12,color:C.subtext,marginTop:4}}>{T.referralEarned}</div>
          </div>
        </div>

        {/* Keyingi mukofotga progress */}
        {next && (
          <div style={{background:C.card,borderRadius:16,padding:16,marginBottom:16,border:`1px solid ${C.cardBorder}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:700,color:C.text}}>{T.referralProgress}</div>
              <div style={{fontSize:12,color:C.primary,fontWeight:700}}>{invitedCount}/{next.count} ta</div>
            </div>
            <div style={{background:C.gray200,borderRadius:100,height:10,overflow:"hidden",marginBottom:8}}>
              <div style={{height:"100%",width:`${progressPct}%`,background:`linear-gradient(90deg,${C.gradStart},${C.gradEnd})`,borderRadius:100,transition:"width 0.5s"}}/>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <IC.Diamond size={14} color="#8B5CF6"/>
              <span style={{fontSize:12,color:C.subtext}}>
                {next.count - invitedCount} ta taklif qilsangiz <strong style={{color:C.text}}>{next.label}</strong> olasiz
              </span>
            </div>
          </div>
        )}

        {/* Mukofot darajalari */}
        <div style={{background:C.card,borderRadius:16,padding:16,marginBottom:16,border:`1px solid ${C.cardBorder}`}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:12}}>{T.referralRewards}</div>
          {milestones.map(m => {
            const done = invitedCount >= m.count;
            return (
              <div key={m.count} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${C.gray100}`}}>
                <div style={{width:40,height:40,borderRadius:12,background:done?"linear-gradient(135deg,#8B5CF6,#6366F1)":C.gray100,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {done
                    ? <IC.CheckCircle size={20} color="white"/>
                    : <span style={{fontSize:14,fontWeight:900,color:C.muted}}>{m.count}</span>
                  }
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13,color:done?C.text:C.subtext}}>{m.count} ta do'st → {m.label}</div>
                  <div style={{fontSize:11,color:C.subtext,marginTop:2}}>{m.days} kunlik Pro obuna sovg'a</div>
                </div>
                {done
                  ? <span style={{fontSize:10,fontWeight:800,background:"#DCFCE7",color:"#16A34A",borderRadius:8,padding:"3px 8px",display:"flex",alignItems:"center",gap:3}}><IC.CheckCircle size={11} color="#16A34A"/>Olindi</span>
                  : <span style={{fontSize:10,fontWeight:700,color:C.muted}}>{m.count - Math.min(invitedCount, m.count)} ta qoldi</span>
                }
              </div>
            );
          })}
        </div>

        {/* Qanday ishlaydi */}
        <div style={{background:C.card,borderRadius:16,padding:16,marginBottom:16,border:`1px solid ${C.cardBorder}`}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:12}}>{T.referralHowTitle}</div>
          {[
            {num:"1", text:T.referralStep1, color:C.primary},
            {num:"2", text:T.referralStep2, color:"#8B5CF6"},
            {num:"3", text:T.referralStep3, color:"#22C55E"},
          ].map(s => (
            <div key={s.num} style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"white",fontWeight:800,fontSize:13}}>
                {s.num}
              </div>
              <p style={{margin:0,fontSize:13,color:C.subtext,lineHeight:1.5,paddingTop:4}}>{s.text}</p>
            </div>
          ))}
        </div>

        {/* Taklif tarixi */}
        {history.length > 0 && (
          <div style={{background:C.card,borderRadius:16,padding:16,border:`1px solid ${C.cardBorder}`}}>
            <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:12}}>{T.referralHistory}</div>
            {history.map((h,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:i<history.length-1?`1px solid ${C.gray100}`:"none"}}>
                <div style={{width:34,height:34,borderRadius:10,background:C.primary+"18",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:C.primary,fontSize:13}}>
                  {h.name[0]}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13,color:C.text}}>{h.name}</div>
                  <div style={{fontSize:11,color:C.subtext}}>{h.date}</div>
                </div>
                <span style={{fontSize:10,fontWeight:700,background:"#DCFCE7",color:"#16A34A",borderRadius:6,padding:"2px 8px"}}>Faol</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileScreen({setScreen,user,setUser,T,C,dark,setDark,lang,setLang,savedQuestions,setShowLangModal,tgUser}) {
  const [editing,setEditing]=useState(false);
  const [form,setForm]=useState({name:user?.name||"",surname:user?.surname||"",phone:user?.phone||""});

  const saveProfile=()=>{
    setUser({...user,...form});
    setEditing(false);
  };

  const openTg = (username) => {
    const url = `https://t.me/${username}`;
    if(window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const menuItems=[
    {lk:"pro",      Icon:IC.Diamond,    ic:"#F59E0B", bg:"#FEF3C7", action:()=>setScreen("pro")},
    {lk:"referral", Icon:IC.Trophy,     ic:"#EF4444", bg:"#FEE2E2", action:()=>setScreen("referral")},
    {lk:"lang",     Icon:IC.Globe,      ic:C.primary, bg:"#EBF2FF", right:LANGS[lang].label, action:()=>setShowLangModal(true)},
    {lk:"support",  Icon:IC.Headphones, ic:"#22C55E", bg:"#DCFCE7", right:"@"+APP_CONFIG.supportUsername, action:()=>openTg(APP_CONFIG.supportUsername)},
    {lk:"news",     Icon:IC.TelegramIcon, ic:"#229ED9", bg:"#E3F2FD", right:"@"+APP_CONFIG.newsChannel, action:()=>openTg(APP_CONFIG.newsChannel)},
    {lk:"about",    Icon:IC.Info,       ic:C.primary, bg:"#EBF2FF", action:()=>setScreen("about")},
  ];

  // Edit modal
  const EditModal=()=>(
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={()=>setEditing(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)"}}/>
      <div style={{position:"relative",width:"100%",maxWidth:390,background:C.card,borderRadius:"24px 24px 0 0",padding:"24px 20px 40px",zIndex:1}}>
        {/* Handle */}
        <div style={{width:40,height:4,borderRadius:2,background:C.gray300,margin:"0 auto 20px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{fontWeight:800,fontSize:17,color:C.text}}>Profilni tahrirlash</span>
          <button onClick={()=>setEditing(false)} style={{background:C.gray100,border:"none",borderRadius:10,width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <IC.XCircle size={18} color={C.gray400}/>
          </button>
        </div>

        {/* Avatar big */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
          <div style={{position:"relative"}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#F59E0B,#EF4444)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:800,color:"white"}}>
              {(form.name||"A")[0]}
            </div>
            <div style={{position:"absolute",bottom:0,right:0,width:24,height:24,borderRadius:"50%",background:C.primary,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 6px rgba(0,0,0,0.2)"}}>
              <IC.Edit size={12} color="white"/>
            </div>
          </div>
        </div>

        {/* Fields */}
        {[
          {label:"Ism",key:"name",icon:<IC.User size={16} color={C.gray400}/>},
          {label:"Familiya",key:"surname",icon:<IC.User size={16} color={C.gray400}/>},
          {label:"Telefon",key:"phone",icon:<IC.Phone size={16} color={C.gray400}/>},
        ].map(f=>(
          <div key={f.key} style={{marginBottom:14}}>
            <label style={{fontSize:12,color:C.subtext,fontWeight:600,display:"block",marginBottom:6}}>{f.label}</label>
            <div style={{display:"flex",alignItems:"center",gap:10,background:C.inputBg,borderRadius:12,padding:"12px 14px",border:`1.5px solid ${C.gray200}`}}>
              {f.icon}
              <input
                value={form[f.key]}
                onChange={e=>setForm({...form,[f.key]:e.target.value})}
                style={{flex:1,border:"none",background:"transparent",fontSize:14,outline:"none",color:C.text}}
              />
            </div>
          </div>
        ))}

        <button onClick={saveProfile}
          style={{width:"100%",padding:"15px",borderRadius:16,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontSize:15,fontWeight:800,cursor:"pointer",marginTop:4,boxShadow:"0 4px 16px rgba(26,107,255,0.3)"}}>
          Saqlash
        </button>
      </div>
    </div>
  );

  return <div style={{paddingBottom:16}}>
    {editing&&<EditModal/>}
    <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,padding:"52px 20px 32px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          {tgUser?.photo_url
            ? <img src={tgUser.photo_url} style={{width:64,height:64,borderRadius:"50%",objectFit:"cover",boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}} alt="avatar"/>
            : <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#F59E0B,#EF4444)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800,color:"white",boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}}>{(user?.name||"A")[0]}</div>
          }
          <div><div style={{color:"white",fontWeight:800,fontSize:18}}>{user?.name} {user?.surname}</div><div style={{color:"rgba(255,255,255,0.75)",fontSize:13}}>{user?.phone}</div></div>
        </div>
        <div onClick={()=>{setForm({name:user?.name||"",surname:user?.surname||"",phone:user?.phone||""});setEditing(true);}} style={{width:36,height:36,background:"rgba(255,255,255,0.2)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><IC.Edit size={16} color="white"/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:20}}>
        {[{lk:"exams",val:"8"},{lk:"passed",val:"5"},{lk:"notPassed",val:"3"},{lk:"rating",val:"#24"}].map(s=><div key={s.lk} style={{background:"rgba(255,255,255,0.2)",borderRadius:12,padding:"10px 4px",textAlign:"center"}}><div style={{color:"white",fontWeight:800,fontSize:18}}>{s.val}</div><div style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>{T[s.lk]}</div></div>)}
      </div>
    </div>
    <div style={{padding:16}}>
      {menuItems.map(item=>(
        <div key={item.lk}>
          <Card C={C} style={{marginBottom:10,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",...(item.danger?{background:dark?"#2D1515":"#FEF2F2"}:{})}} onClick={item.action||(()=>{})}>
            <div style={{width:38,height:38,borderRadius:12,background:item.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <item.Icon size={18} color={item.ic}/>
            </div>
            <span style={{flex:1,fontWeight:600,fontSize:14,color:item.danger?C.danger:C.text}}>{T[item.lk]}</span>
            {item.badge&&<div style={{minWidth:22,height:22,borderRadius:11,background:"#F59E0B",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"white",padding:"0 6px"}}>{item.badge}</div>}
            {item.right&&<span style={{fontSize:12,color:C.subtext}}>{item.right}</span>}
            {!item.right&&!item.badge&&<IC.ChevronRight size={16} color={C.gray400}/>}
            {item.badge&&<IC.ChevronRight size={16} color={C.gray400}/>}
          </Card>
          {item.lk==="lang"&&(
            <Card C={C} style={{marginBottom:10,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:38,height:38,borderRadius:12,background:dark?"#1E3A5F":"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {dark?<IC.Moon size={18} color={C.primary}/>:<IC.Sun size={18} color={C.warning}/>}
                </div>
                <span style={{fontWeight:600,fontSize:14,color:C.text}}>{dark?T.darkMode:T.lightMode}</span>
              </div>
              <div onClick={()=>setDark(!dark)} style={{width:48,height:26,borderRadius:13,background:dark?C.primary:C.gray300,cursor:"pointer",position:"relative",transition:"background 0.2s"}}>
                <div style={{position:"absolute",top:3,left:dark?22:3,width:20,height:20,borderRadius:"50%",background:"white",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
              </div>
            </Card>
          )}
          {item.lk==="lang"&&(
            <Card C={C} style={{marginBottom:10,padding:"14px 16px",cursor:"pointer"}} onClick={()=>setScreen("saved")}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:savedQuestions.length>0?12:0}}>
                <div style={{width:38,height:38,borderRadius:12,background:"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <IC.Bookmark size={18} color="#F59E0B"/>
                </div>
                <span style={{flex:1,fontWeight:600,fontSize:14,color:C.text}}>{T.savedQ}</span>
                {savedQuestions.length>0&&<div style={{minWidth:22,height:22,borderRadius:11,background:"#F59E0B",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"white",padding:"0 6px"}}>{savedQuestions.length}</div>}
                <IC.ChevronRight size={16} color={C.gray400} onClick={()=>setScreen("saved")} style={{cursor:"pointer"}}/>
              </div>
              {savedQuestions.length>0&&savedQuestions.slice(0,3).map((q,i)=>(
                <div key={q.key} onClick={()=>setScreen("saved")} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderTop:`1px solid ${C.gray200}`,cursor:"pointer"}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"#F59E0B",flexShrink:0}}/>
                  <span style={{fontSize:12,color:C.subtext,flex:1,lineHeight:1.4,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
                    {typeof q.question==="object"?q.question.uz||q.question:q.question}
                  </span>
                </div>
              ))}
              {savedQuestions.length>3&&(
                <div onClick={()=>setScreen("saved")} style={{textAlign:"center",paddingTop:8,borderTop:`1px solid ${C.gray200}`,fontSize:12,color:C.primary,fontWeight:600,cursor:"pointer"}}>
                  {T.allBtn} ({savedQuestions.length-3} {T.savedCount})
                </div>
              )}
            </Card>
          )}
        </div>
      ))}
    </div>
  </div>;
}

// ─── PRO SCREEN ───
function ProScreen({T,C,setScreen,addToast,setNotifs,notifSettings}) {
  const [plan,setPlan]=useState("month1");

  // step: "plans" | "payment" | "pending"
  const [step,setStep]=useState("plans");

  // To'lov uchun
  const [receipt,setReceipt]=useState(null);      // yuklangan fayl/rasm
  const [receiptPreview,setReceiptPreview]=useState(null); // preview URL
  const fileInputRef=useRef();

  // Chegirmali narxlar
  const rawPrices = {week:9900, month1:29900, month2:49900};
  const plans = [
    {id:"week",   labelKey:"proWeekly",  days:7,  badge:null,          ...calcDiscounted(rawPrices.week)},
    {id:"month1", labelKey:"proMonth1",  days:30, badge:T.proPopular,  ...calcDiscounted(rawPrices.month1)},
    {id:"month2", labelKey:"proMonth2",  days:60, badge:T.proBest,     ...calcDiscounted(rawPrices.month2)},
  ];
  const daysLeft = discountDaysLeft();

  const features=[
    {Icon:IC.Bell,      color:"#fff", bg:C.primary,   lk:"proNoAds"},
    {Icon:IC.Clipboard, color:"#fff", bg:"#0EA5E9",   lk:"proUnlimited"},
    {Icon:IC.BarChart,  color:"#fff", bg:"#6366F1",   lk:"proStats"},
  ];

  const selectedPlan=plans.find(p=>p.id===plan);

  // Karta raqami (admin o'zgartiradi)
  const CARD_NUMBER = "8600 1234 5678 9012";
  const CARD_OWNER  = "NAZARIY AVTOTEST";

  const copyCard=()=>{
    try{ navigator.clipboard.writeText(CARD_NUMBER.replace(/\s/g,"")); }catch{}
    addToast("Karta raqami nusxalandi!", "success");
  };

  const handleFileChange=(e)=>{
    const file=e.target.files[0];
    if(!file) return;
    setReceipt(file);
    const url=URL.createObjectURL(file);
    setReceiptPreview(url);
  };

  const handleSubmit=()=>{
    if(!receipt){ addToast("Avval to\'lov chekini yuklang","error"); return; }

    // Kutish rejimiga o'tish
    setStep("pending");

    // Bildirishnoma: "To'lov tekshirilmoqda"
    const pendingMsg={
      uz:"To'lov chekingiz yuborildi. Tekshirilmoqda ⏳",
      ru:"Чек оплаты отправлен. Проверяется ⏳",
      kril:"To'lov chekingiz yuborildi. Tekshirilmoqda ⏳",
    };
    setNotifs(p=>[{
      id:Date.now(), type:"result", read:false, time:0,
      titleKey:"notifResult",
      body:pendingMsg,
    },...p]);
    addToast(pendingMsg.uz, "info");

    // Demo: 8 soniyadan so'ng admin tasdiqladi (real da bu backend orqali keladi)
    setTimeout(()=>{
      const approvedMsg={
        uz:"🎉 Pro obuna faollashtirildi! Endi barcha imkoniyatlar ochiq.",
        ru:"🎉 Pro подписка активирована! Все возможности открыты.",
        kril:"🎉 Pro obuna faollashtirildi! Endi barcha imkoniyatlar ochiq.",
      };
      setNotifs(p=>[{
        id:Date.now()+1, type:"result", read:false, time:0,
        titleKey:"notifResult",
        body:approvedMsg,
      },...p]);
      addToast(approvedMsg.uz, "success");
    }, 8000);
  };

  // ── PENDING ekrani ──
  if(step==="pending") return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}}>
      <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,padding:"52px 20px 36px",position:"relative",overflow:"hidden",textAlign:"center"}}>
        <div style={{position:"absolute",top:-50,right:-50,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <div style={{position:"absolute",bottom:-40,left:-30,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        {/* Animatsiyali soat */}
        <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 8px 24px rgba(0,0,0,0.2)",position:"relative"}}>
          <IC.Clock size={40} color="white"/>
          <div style={{position:"absolute",inset:-4,borderRadius:"50%",border:"3px solid rgba(255,255,255,0.3)",borderTopColor:"white",animation:"spin 1.5s linear infinite"}}/>
        </div>
        <div style={{color:"white",fontWeight:900,fontSize:22,marginBottom:8}}>Tekshirilmoqda...</div>
        <div style={{color:"rgba(255,255,255,0.8)",fontSize:13,lineHeight:1.6,maxWidth:280,margin:"0 auto"}}>
          To'lov chekingiz adminga yuborildi.<br/>Tasdiqlangach bildirishnoma keladi.
        </div>
      </div>

      <div style={{padding:"24px 16px",flex:1}}>
        {/* To'lov ma'lumotlari */}
        <div style={{background:C.card,borderRadius:18,padding:18,marginBottom:16,border:`1px solid ${C.cardBorder}`}}>
          <div style={{fontSize:12,color:C.subtext,fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:0.5}}>To'lov tafsilotlari</div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:13,color:C.subtext}}>Tarif</span>
            <span style={{fontSize:13,fontWeight:700,color:C.text}}>{T[selectedPlan.labelKey]} — {selectedPlan.final.toLocaleString()} so'm</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:13,color:C.subtext}}>Holat</span>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#F59E0B",animation:"pulse 1.5s ease infinite"}}/>
              <span style={{fontSize:13,fontWeight:700,color:"#F59E0B"}}>Kutilmoqda</span>
            </div>
          </div>
          {receiptPreview&&(
            <div style={{marginTop:12,borderTop:`1px solid ${C.gray200}`,paddingTop:12}}>
              <div style={{fontSize:12,color:C.subtext,marginBottom:8}}>Yuklangan chek:</div>
              {receipt?.type?.startsWith("image/")
                ? <img src={receiptPreview} style={{width:"100%",borderRadius:12,maxHeight:160,objectFit:"cover"}} alt="receipt"/>
                : <div style={{display:"flex",alignItems:"center",gap:10,background:C.gray100,borderRadius:12,padding:"10px 14px"}}>
                    <IC.FileText size={20} color={C.primary}/>
                    <span style={{fontSize:13,color:C.text,fontWeight:500}}>{receipt?.name}</span>
                  </div>
              }
            </div>
          )}
        </div>

        {/* Kutish animatsiyasi */}
        <div style={{background:C.primary+"10",borderRadius:16,padding:"16px",display:"flex",alignItems:"flex-start",gap:12,border:`1px solid ${C.primary}22`}}>
          <IC.Bell size={18} color={C.primary} style={{flexShrink:0,marginTop:2}}/>
          <div style={{fontSize:13,color:C.subtext,lineHeight:1.6}}>
            Admin to'lovni tekshirib, bildirishnoma orqali xabardor qiladi. Odatda <span style={{fontWeight:700,color:C.text}}>10-30 daqiqa</span> ichida tasdiqlanadi.
          </div>
        </div>

        <button onClick={()=>setScreen("home")}
          style={{width:"100%",marginTop:20,padding:"15px",borderRadius:16,border:`2px solid ${C.gray200}`,background:"transparent",color:C.text,fontSize:14,fontWeight:700,cursor:"pointer"}}>
          Bosh sahifaga qaytish
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );

  // ── PAYMENT ekrani ──
  if(step==="payment") return (
    <div style={{minHeight:"100vh",background:C.bg,paddingBottom:24}}>
      {/* Header */}
      <div style={{...SC.header(C),padding:"52px 20px 28px"}}>
        <button onClick={()=>setStep("plans")}
          style={{background:"rgba(255,255,255,0.15)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
          <IC.ArrowLeft size={18} color="white"/>
        </button>
        <div style={{color:"white",fontWeight:900,fontSize:20,marginBottom:4}}>To'lovni amalga oshiring</div>
        <div style={{color:"rgba(255,255,255,0.8)",fontSize:13,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span>{T[selectedPlan.labelKey]}</span>
          {selectedPlan.saved > 0 && (
            <span style={{textDecoration:"line-through",opacity:0.6}}>{selectedPlan.original.toLocaleString()} so'm</span>
          )}
          <span style={{fontWeight:800,color:"white"}}>{selectedPlan.final.toLocaleString()} so'm</span>
          {selectedPlan.saved > 0 && (
            <span style={{background:"rgba(255,255,255,0.25)",borderRadius:8,padding:"2px 8px",fontSize:11,fontWeight:700}}>
              -{DISCOUNT.percent}% tejaydingiz
            </span>
          )}
        </div>
      </div>

      <div style={{padding:"20px 16px"}}>

        {/* Karta raqami */}
        <div style={{background:C.card,borderRadius:20,padding:20,marginBottom:16,border:`1px solid ${C.cardBorder}`,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          <div style={{fontSize:12,color:C.subtext,fontWeight:700,marginBottom:14,textTransform:"uppercase",letterSpacing:0.5}}>
            Quyidagi kartaga o'tkazing
          </div>

          {/* Karta dizayni */}
          <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,borderRadius:16,padding:"20px 20px 16px",marginBottom:14,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
            <div style={{position:"absolute",bottom:-30,left:10,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",fontWeight:600,marginBottom:12,letterSpacing:1}}>HUMO / UZCARD</div>
            <div style={{color:"white",fontSize:20,fontWeight:800,letterSpacing:3,marginBottom:16,fontFamily:"monospace"}}>
              {CARD_NUMBER}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
              <div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",marginBottom:2}}>KARTA EGASI</div>
                <div style={{color:"white",fontWeight:700,fontSize:13}}>{CARD_OWNER}</div>
              </div>
              <div style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 10px",fontSize:12,color:"white",fontWeight:700}}>
                {selectedPlan.final.toLocaleString()} so'm
              </div>
            </div>
          </div>

          {/* Nusxalash tugmasi */}
          <button onClick={copyCard}
            style={{width:"100%",padding:"13px",borderRadius:14,border:`1.5px solid ${C.primary}`,background:C.primary+"10",color:C.primary,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <IC.FileText size={16} color={C.primary}/>
            Karta raqamini nusxalash
          </button>
        </div>

        {/* Chek yuklash */}
        <div style={{background:C.card,borderRadius:20,padding:20,marginBottom:20,border:`1px solid ${C.cardBorder}`}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:4}}>To'lov chekini yuboring</div>
          <div style={{fontSize:12,color:C.subtext,marginBottom:16,lineHeight:1.5}}>
            Pul o'tkazgandan so'ng screenshot yoki chek faylini yuklang
          </div>

          {/* Yuklash maydoni */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            style={{display:"none"}}
          />

          {!receiptPreview ? (
            <div onClick={()=>fileInputRef.current?.click()}
              style={{border:`2px dashed ${C.gray300}`,borderRadius:16,padding:"32px 20px",textAlign:"center",cursor:"pointer",background:C.gray100,transition:"all 0.2s"}}>
              <div style={{width:52,height:52,borderRadius:16,background:C.primary+"18",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
                <IC.FileText size={24} color={C.primary}/>
              </div>
              <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:4}}>Fayl yuklash</div>
              <div style={{fontSize:12,color:C.subtext}}>Screenshot yoki PDF • JPG, PNG, PDF</div>
            </div>
          ) : (
            <div style={{position:"relative"}}>
              {receipt?.type?.startsWith("image/")
                ? <img src={receiptPreview} style={{width:"100%",borderRadius:14,maxHeight:200,objectFit:"cover"}} alt="receipt"/>
                : <div style={{display:"flex",alignItems:"center",gap:12,background:C.gray100,borderRadius:14,padding:"14px 16px"}}>
                    <div style={{width:44,height:44,borderRadius:12,background:C.primary+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <IC.FileText size={22} color={C.primary}/>
                    </div>
                    <div>
                      <div style={{fontWeight:600,fontSize:13,color:C.text}}>{receipt?.name}</div>
                      <div style={{fontSize:11,color:C.subtext}}>{(receipt?.size/1024).toFixed(0)} KB</div>
                    </div>
                  </div>
              }
              {/* O'chirish */}
              <button onClick={()=>{setReceipt(null);setReceiptPreview(null);}}
                style={{position:"absolute",top:8,right:8,width:28,height:28,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <IC.XCircle size={16} color="white"/>
              </button>
              {/* Qayta yuklash */}
              <button onClick={()=>fileInputRef.current?.click()}
                style={{width:"100%",marginTop:10,padding:"10px",borderRadius:12,border:`1.5px solid ${C.gray200}`,background:"transparent",color:C.subtext,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                Boshqa fayl tanlash
              </button>
            </div>
          )}
        </div>

        {/* Yuborish tugmasi */}
        <button onClick={handleSubmit}
          style={{width:"100%",padding:"16px",borderRadius:18,border:"none",background:receipt?`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`:C.gray200,color:receipt?"white":C.gray400,fontSize:15,fontWeight:800,cursor:receipt?"pointer":"not-allowed",boxShadow:receipt?`0 6px 20px ${C.primary}50`:"none",transition:"all 0.3s"}}>
          <span style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}><IC.Send size={16} color="white"/>Chekni yuborish</span>
        </button>

        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:12}}>
          <IC.ShieldCheck size={14} color={C.success}/>
          <span style={{fontSize:11,color:C.subtext}}>Ma'lumotlaringiz xavfsiz</span>
        </div>
      </div>
    </div>
  );

  // ── PLANS ekrani (asosiy) ──
  return (
    <div style={{minHeight:"100vh",background:C.bg,paddingBottom:24}}>
      {/* Header */}
      <div style={{...SC.header(C),padding:"52px 20px 36px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,right:-50,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <div style={{position:"absolute",bottom:-70,left:-40,width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <button onClick={()=>setScreen("profile")}
          style={{background:"rgba(255,255,255,0.15)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24}}>
          <IC.ArrowLeft size={18} color="white"/>
        </button>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,position:"relative"}}>
          <div style={{width:76,height:76,borderRadius:24,background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>
            <IC.Diamond size={38} color="white"/>
          </div>
          <div style={{color:"white",fontWeight:900,fontSize:24,textAlign:"center",letterSpacing:-0.5}}>{T.proTitle}</div>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:13,textAlign:"center",maxWidth:260,lineHeight:1.5}}>{T.proSubtitle}</div>
        </div>
      </div>

      <div style={{padding:"20px 16px"}}>
        {/* Chegirma banneri */}
        {DISCOUNT.active && DISCOUNT.percent > 0 && (
          <div style={{background:"linear-gradient(135deg,#EF4444,#F59E0B)",borderRadius:16,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
            <IC.Celebrate size={24} color="white"/>
            <div style={{flex:1}}>
              <div style={{color:"white",fontWeight:800,fontSize:14}}>{DISCOUNT.label} — -{DISCOUNT.percent}%</div>
              {daysLeft !== null && daysLeft > 0 && (
                <div style={{color:"rgba(255,255,255,0.85)",fontSize:12,marginTop:2}}>
                  {daysLeft} kun qoldi • Ulguring!
                </div>
              )}
              {daysLeft === 0 && (
                <div style={{color:"rgba(255,255,255,0.85)",fontSize:12,marginTop:2}}>Bugun tugaydi!</div>
              )}
            </div>
            <div style={{background:"rgba(255,255,255,0.25)",borderRadius:10,padding:"6px 10px",textAlign:"center"}}>
              <div style={{color:"white",fontWeight:900,fontSize:20,lineHeight:1}}>-{DISCOUNT.percent}%</div>
              <div style={{color:"rgba(255,255,255,0.8)",fontSize:9,fontWeight:700}}>CHEGIRMA</div>
            </div>
          </div>
        )}

        {/* Tariflar */}
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          {plans.map(p=>{
            const sel=plan===p.id;
            return (
              <div key={p.id} onClick={()=>setPlan(p.id)}
                style={{flex:1,borderRadius:18,border:`2px solid ${sel?C.primary:C.gray200}`,background:sel?`linear-gradient(135deg,${C.primary}18,${C.primary}30)`:C.card,padding:"14px 6px",cursor:"pointer",textAlign:"center",position:"relative",transition:"all 0.2s",boxShadow:sel?`0 4px 16px ${C.primary}40`:"none"}}>
                {p.badge&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:sel?C.primary:"#94A3B8",color:"white",fontSize:9,fontWeight:800,borderRadius:20,padding:"2px 8px",whiteSpace:"nowrap"}}>{p.badge}</div>}
                {/* Chegirmali narx ko'rsatish */}
                {p.saved > 0 && (
                  <div style={{fontSize:8,fontWeight:800,color:"#EF4444",textDecoration:"line-through",lineHeight:1,marginBottom:1}}>
                    {p.original.toLocaleString()}
                  </div>
                )}
                <div style={{fontWeight:900,fontSize:16,color:sel?C.primary:C.text,marginBottom:2,lineHeight:1}}>
                  {p.final.toLocaleString()}
                </div>
                <div style={{fontSize:9,color:sel?C.primary:C.subtext,fontWeight:700,marginBottom:4}}>so'm</div>
                {p.saved > 0 && (
                  <div style={{fontSize:8,fontWeight:800,background:"#EF4444",color:"white",borderRadius:4,padding:"1px 4px",marginBottom:3}}>
                    -{DISCOUNT.percent}%
                  </div>
                )}
                <div style={{fontSize:10,color:sel?C.primary:C.subtext,fontWeight:700}}>{T[p.labelKey]}</div>
              </div>
            );
          })}
        </div>

        {/* Imkoniyatlar */}
        <div style={{marginBottom:20}}>
          {features.map(f=>(
            <div key={f.lk} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 16px",background:C.card,borderRadius:16,marginBottom:8,border:`1px solid ${C.cardBorder}`,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
              <div style={{width:44,height:44,borderRadius:14,background:f.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 4px 12px ${f.bg}55`}}>
                <f.Icon size={20} color={f.color}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13,color:C.text}}>{T[f.lk]}</div>
                <div style={{fontSize:11,color:C.subtext,marginTop:2}}>{T[f.lk+"Sub"]}</div>
              </div>
              <IC.CheckCircle size={20} color="#22C55E"/>
            </div>
          ))}
        </div>

        {/* Obuna tugmasi */}
        <button onClick={()=>setStep("payment")}
          style={{width:"100%",padding:"16px",borderRadius:18,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:`0 6px 20px ${C.primary}50`,letterSpacing:0.3}}>
          {T.proSubscribe} — {selectedPlan.final.toLocaleString()} so'm
          {selectedPlan.saved > 0 && ` (−${selectedPlan.saved.toLocaleString()})`}
        </button>

        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:12}}>
          <IC.ShieldCheck size={14} color={C.success}/>
          <span style={{fontSize:11,color:C.subtext}}>{T.proCancel}</span>
        </div>
      </div>
    </div>
  );
}
// ─── NOTIFICATIONS DATA ───
const INIT_NOTIFS = [
  {id:1, type:"exam",   read:false, time:2,  titleKey:"notifExam",  body:{uz:"Bugun imtihon rejalashtirgan edingiz!",             ru:"Сегодня вы планировали сдать экзамен!",          kril:"Бугун имтиҳон режалаштирган эдингиз!"}},
  {id:2, type:"result", read:false, time:15, titleKey:"notifResult", body:{uz:"Bilet 5 dan 90% natija oldingiz 🎉",                ru:"Вы набрали 90% за Билет 5 🎉",                   kril:"Билет 5 дан 90% натижа олдингиз 🎉"}},
  {id:3, type:"new",    read:false, time:60, titleKey:"notifNew",   body:{uz:"Bilet 23 yangilandi. Ko'rib chiqing!",               ru:"Билет 23 обновлён. Проверьте!",                  kril:"Билет 23 янгиланди. Кўриб чиқинг!"}},
  {id:4, type:"daily",  read:true,  time:120,titleKey:"notifDaily", body:{uz:"Kunlik maqsadingiz: 150 savol. Hali 80 ta qoldi.",   ru:"Ваша дневная цель: 150 вопросов. Осталось 80.", kril:"Кунлик мақсадингиз: 150 савол. Яна 80 та қолди."}},
  {id:5, type:"result", read:true,  time:180,titleKey:"notifResult",body:{uz:"Test seriyangiz 12 ga yetdi. Zo'r!",                 ru:"Ваша серия достигла 12. Отлично!",               kril:"Тест серияngиз 12 га етди. Зўр!"}},
  {id:6, type:"new",    read:true,  time:300,titleKey:"notifNew",   body:{uz:"5 ta yangi bilet qo'shildi. Sinab ko'ring!",         ru:"Добавлено 5 новых билетов. Попробуйте!",         kril:"5 та янги билет қўшилди. Синаб кўринг!"}},
  {id:7, type:"daily",  read:true,  time:1440,titleKey:"notifDaily",body:{uz:"Kecha 3 ta bilet yakundingiz. Bugun davom eting!",   ru:"Вчера вы завершили 3 билета. Продолжайте!",      kril:"Кеча 3 та билет якундингиз. Бугун давом этинг!"}},
];

const NOTIF_ICONS = {
  exam:   { Icon: IC.Clock,         bg:"#EBF2FF", color:"#1A6BFF" },
  result: { Icon: IC.CheckCircle,   bg:"#DCFCE7", color:"#22C55E" },
  new:    { Icon: IC.Ticket,        bg:"#FEF3C7", color:"#F59E0B" },
  daily:  { Icon: IC.Bell,          bg:"#F5F3FF", color:"#8B5CF6" },
};

// ─── TOAST ───
function Toast({toasts}) {
  return (
    <div style={{position:"fixed",top:16,left:16,right:16,width:"calc(100% - 32px)",zIndex:999,pointerEvents:"none",display:"flex",flexDirection:"column",gap:8}}>
      {toasts.map(t=>(
        <div key={t.id} style={{background:t.type==="success"?"#22C55E":t.type==="error"?"#EF4444":"#1A6BFF",color:"white",borderRadius:14,padding:"13px 16px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 24px rgba(0,0,0,0.25)",animation:"slideDown 0.3s ease"}}>
          {t.type==="success"&&<IC.CheckCircle size={18} color="white"/>}
          {t.type==="error"&&<IC.XCircle size={18} color="white"/>}
          {t.type==="info"&&<IC.Bell size={18} color="white"/>}
          <span style={{fontWeight:600,fontSize:14}}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

// ─── SEARCH SCREEN ───
function SearchScreen({setScreen,setActiveTicket,T,C,lang,savedQuestions}) {
  const [query,setQuery]=useState("");
  const [filter,setFilter]=useState("all");
  const inputRef=useRef();

  const highlight=(text,q)=>{
    if(!q||!text) return text;
    const str=String(text);
    const idx=str.toLowerCase().indexOf(q.toLowerCase());
    if(idx===-1) return str;
    return <span>{str.slice(0,idx)}<mark style={{background:C.primary+"33",color:C.primary,borderRadius:3,padding:"0 1px",fontWeight:700}}>{str.slice(idx,idx+q.length)}</mark>{str.slice(idx+q.length)}</span>;
  };

  // Build all searchable data
  const allTickets=tickets.slice(0,20).map((t,i)=>({
    type:"ticket", id:t.id,
    title:`Bilet ${t.id}`,
    sub:`20 ${T.questions}`,
    progress:[95,90,80,100,75,null,null,null,null,null,88,null,null,null,null,null,null,null,null,null][i],
  }));

  const allQuestions=tickets.slice(0,10).flatMap(t=>
    t.questions.slice(0,5).map(q=>({
      type:"question", ticketId:t.id, questionId:q.id,
      title:getQ(q.question,lang),
      sub:`${T.ticket} ${t.id} · #${q.id}`,
      question:q.question, sign:q.sign, options:q.options, correct:q.correct,
      key:`${t.id}-${q.id}`
    }))
  );

  const allSigns=SIGNS_CATEGORIES.flatMap((cat,ci)=>
    cat.items.map((item,ji)=>({
      type:"sign", key:`rules-${ci}-${ji}`,
      title:item[lang]||item.uz,
      sub:cat.title[lang]||cat.title.uz,
      catColor:cat.color, catBg:cat.bg, catIcon:cat.icon,
    }))
  );

  const savedItems=savedQuestions.map(s=>({
    type:"saved", key:s.key,
    title:typeof s.question==="object"?(s.question[lang]||s.question.uz):s.question,
    sub:s.ticketId==="rules"?"🚦 Yo'l qoidasi":`${T.ticket} ${s.ticketId}`,
    isRule:s.ticketId==="rules",
  }));

  const q=query.trim().toLowerCase();

  const match=(item)=> q.length<2 ? false :
    (item.title||"").toLowerCase().includes(q)||
    (item.sub||"").toLowerCase().includes(q)||
    (item.type==="ticket"&&`bilet ${item.id}`.includes(q))||
    (item.type==="ticket"&&String(item.id)===q);

  const ticketResults  = (filter==="all"||filter==="tickets")   ? allTickets.filter(match)   : [];
  const questionResults= (filter==="all"||filter==="questions") ? allQuestions.filter(match) : [];
  const signResults    = (filter==="all"||filter==="signs")     ? allSigns.filter(match)     : [];
  const savedResults   = (filter==="all"||filter==="saved")     ? savedItems.filter(match)   : [];
  const total=ticketResults.length+questionResults.length+signResults.length+savedResults.length;

  const popular=[
    {label:"Piyoda yo'li",  q:"piyoda"},
    {label:"60 km/s",       q:"60"},
    {label:"To'xtash",      q:"to'xtash"},
    {label:"Signal",        q:"signal"},
    {label:"Bilet 1",       q:"bilet 1"},
  ];

  const filters=[
    ["all",T.filterAll],
    ["tickets",T.filterTickets],
    ["questions",T.filterQuestions],
    ["signs","Belgilar"],
    ["saved",T.savedQ],
  ];

  const ResultCard=({children,onClick})=>(
    <div onClick={onClick} style={{background:C.card,borderRadius:14,padding:"13px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12,border:`1px solid ${C.cardBorder}`,cursor:"pointer",transition:"box-shadow 0.15s"}}>
      {children}
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:C.bg}}>
      {/* Header */}
      <div style={{background:C.card,padding:"52px 16px 12px",borderBottom:`1px solid ${C.gray200}`,boxShadow:`0 2px 12px rgba(0,0,0,0.06)`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setScreen("home")} style={{width:36,height:36,borderRadius:12,background:C.gray100,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <IC.ArrowLeft size={16} color={C.text}/>
          </button>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:10,background:C.inputBg,borderRadius:14,padding:"10px 14px",border:`1.5px solid ${query?C.primary:C.gray200}`,transition:"border 0.2s"}}>
            <IC.Search size={16} color={query?C.primary:C.gray400}/>
            <input ref={inputRef} autoFocus value={query} onChange={e=>setQuery(e.target.value)}
              placeholder={T.searchPlaceholder}
              style={{flex:1,border:"none",background:"transparent",fontSize:14,outline:"none",color:C.text}}/>
            {query&&<button onClick={()=>setQuery("")} style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex"}}>
              <IC.XCircle size={16} color={C.gray400}/>
            </button>}
          </div>
        </div>
        {/* Filter chips */}
        <div style={{display:"flex",gap:6,marginTop:12,overflowX:"auto",paddingBottom:2}}>
          {filters.map(([id,label])=>(
            <button key={id} onClick={()=>setFilter(id)}
              style={{padding:"6px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:filter===id?C.primary:C.gray100,color:filter===id?"white":C.subtext,whiteSpace:"nowrap",transition:"all 0.2s",flexShrink:0}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:16}}>
        {/* Empty — show popular */}
        {q.length<2&&(
          <>
            <div style={{fontSize:11,fontWeight:700,color:C.subtext,marginBottom:10,letterSpacing:"0.5px",textTransform:"uppercase"}}>{T.searchHint||"Tez qidiruv"}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
              {popular.map(p=>(
                <button key={p.q} onClick={()=>setQuery(p.q)}
                  style={{padding:"7px 14px",borderRadius:20,border:`1.5px solid ${C.gray200}`,background:C.card,color:C.text,fontSize:13,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                  <IC.Search size={12} color={C.gray400}/>{p.label}
                </button>
              ))}
            </div>
            {savedQuestions.length>0&&(
              <>
                <div style={{fontSize:11,fontWeight:700,color:C.subtext,marginBottom:10,letterSpacing:"0.5px",textTransform:"uppercase"}}>{T.savedQ}</div>
                {savedQuestions.slice(0,3).map(s=>{
                  const title=typeof s.question==="object"?(s.question[lang]||s.question.uz):s.question;
                  return (
                  <ResultCard key={s.key} onClick={()=>setScreen("saved")}>
                    <div style={{width:36,height:36,borderRadius:11,background:"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <IC.Bookmark size={16} color="#F59E0B"/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{title}</div>
                      <div style={{fontSize:11,color:C.subtext}}>{s.ticketId==="rules"?<span style={{display:"flex",alignItems:"center",gap:4}}><IC.Traffic size={11} color={C.subtext}/>Yo'l qoidasi</span>:`${T.ticket} ${s.ticketId}`}</div>
                    </div>
                    <IC.ChevronRight size={14} color={C.gray400}/>
                  </ResultCard>
                );})}
              </>
            )}
          </>
        )}

        {/* Results */}
        {q.length>=2&&(
          <>
            {total===0?(
              <div style={{textAlign:"center",padding:"50px 20px"}}>
                <div style={{width:64,height:64,borderRadius:"50%",background:C.gray200,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
                  <IC.Search size={28} color={C.gray400}/>
                </div>
                <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:6}}>{T.noResults}</div>
                <div style={{fontSize:13,color:C.subtext}}>«{query}»</div>
              </div>
            ):(
              <>
                <div style={{fontSize:12,color:C.subtext,marginBottom:14,fontWeight:500}}>{total} {T.searchResults||"natija"}</div>

                {/* Tickets */}
                {ticketResults.length>0&&(
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.subtext,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px"}}>{T.filterTickets}</div>
                    {ticketResults.map(item=>(
                      <ResultCard key={item.id} onClick={()=>{const t=tickets.find(x=>x.id===item.id);setActiveTicket(t);setScreen("ticket-quiz");}}>
                        <div style={{width:38,height:38,borderRadius:12,background:C.primary+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontWeight:800,fontSize:13,color:C.primary}}>B{item.id}</div>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:700,fontSize:14,color:C.text}}>{highlight(item.title,query)}</div>
                          <div style={{fontSize:11,color:C.subtext}}>{item.sub}</div>
                        </div>
                        {item.progress!=null
                          ?<div style={{background:item.progress>=80?C.success+"18":C.warning+"18",borderRadius:20,padding:"3px 8px",fontSize:11,fontWeight:700,color:item.progress>=80?C.success:C.warning}}>{item.progress}%</div>
                          :<IC.ChevronRight size={14} color={C.gray400}/>}
                      </ResultCard>
                    ))}
                  </div>
                )}

                {/* Questions */}
                {questionResults.length>0&&(
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.subtext,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px"}}>{T.filterQuestions}</div>
                    {questionResults.map((item,i)=>(
                      <ResultCard key={item.key||i}>
                        <div style={{width:36,height:36,borderRadius:11,background:C.primary+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <IC.FileText size={16} color={C.primary}/>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:600,color:C.text,lineHeight:1.4,marginBottom:2}}>{highlight(item.title,query)}</div>
                          <div style={{fontSize:11,color:C.subtext}}>{item.sub}</div>
                        </div>
                      </ResultCard>
                    ))}
                  </div>
                )}

                {/* Road signs */}
                {signResults.length>0&&(
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.subtext,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px"}}>Yo'l belgilari</div>
                    {signResults.map((item,i)=>(
                      <ResultCard key={item.key||i} onClick={()=>setScreen("rules")}>
                        <div style={{width:36,height:36,borderRadius:11,background:item.catBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>{item.catIcon}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:600,color:C.text,lineHeight:1.4,marginBottom:2}}>{highlight(item.title,query)}</div>
                          <div style={{fontSize:11,color:C.subtext}}>{item.sub}</div>
                        </div>
                        <IC.ChevronRight size={14} color={C.gray400}/>
                      </ResultCard>
                    ))}
                  </div>
                )}

                {/* Saved */}
                {savedResults.length>0&&(
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.subtext,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px"}}>{T.savedQ}</div>
                    {savedResults.map((item,i)=>(
                      <ResultCard key={item.key||i} onClick={()=>setScreen("saved")}>
                        <div style={{width:36,height:36,borderRadius:11,background:"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <IC.Bookmark size={16} color="#F59E0B"/>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:600,color:C.text,lineHeight:1.4,marginBottom:2}}>{highlight(item.title,query)}</div>
                          <div style={{fontSize:11,color:C.subtext}}>{item.sub}</div>
                        </div>
                        <IC.ChevronRight size={14} color={C.gray400}/>
                      </ResultCard>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── SAVED QUESTIONS SCREEN ───
function SavedQuestionsScreen({setScreen,savedQuestions,setSavedQuestions,T,C,lang,addToast,setActiveTicket,prevScreen}) {
  const [practiceMode,setPracticeMode]=useState(false);
  const [current,setCurrent]=useState(0);
  const [selected,setSelected]=useState(null);
  const [results,setResults]=useState({});

  const removeOne=(key)=>{
    setSavedQuestions(savedQuestions.filter(s=>s.key!==key));
    addToast(T.bookmarkRemoved,"info");
  };

  const clearAll=()=>{
    setSavedQuestions([]);
    addToast(T.bookmarkRemoved,"info");
  };

  // Practice mode
  if(practiceMode && savedQuestions.length>0){
    const q=savedQuestions[current];
    const isSel=selected!==null;
    const handleAns=(i)=>{
      setSelected(i);
      setResults({...results,[current]:i});
    };
    return <div style={{minHeight:"100vh",background:C.white}}>
      <div style={{...SC.header(C),padding:"50px 20px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <button onClick={()=>{setPracticeMode(false);setCurrent(0);setSelected(null);setResults({});}} style={{background:"rgba(255,255,255,0.2)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><IC.ArrowLeft size={18} color="white"/></button>
          <div style={{color:"white",fontWeight:700,fontSize:15}}>{T.savedQ}</div>
          <div style={{background:"rgba(255,255,255,0.2)",borderRadius:10,padding:"6px 12px"}}>
            <span style={{color:"white",fontWeight:700,fontSize:14}}>{current+1}/{savedQuestions.length}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:3}}>{savedQuestions.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:100,background:results[i]!==undefined?"white":i===current?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.25)"}}/>)}</div>
      </div>
      <div style={{padding:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <div style={{background:q.ticketId==="rules"?"#DCFCE7":C.primary+"22",borderRadius:8,padding:"4px 10px"}}>
            <span style={{fontSize:11,fontWeight:700,color:q.ticketId==="rules"?"#22C55E":C.primary}}>
              {q.ticketId==="rules"?<span style={{display:"flex",alignItems:"center",gap:4}}><IC.Traffic size={11} color={C.subtext}/>Yo'l qoidasi</span>:`${T.ticket} ${q.ticketId} · #${q.questionId}`}
            </span>
          </div>
          <IC.Bookmark size={16} color="#FFD700"/>
        </div>
        <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:20,lineHeight:1.5}}>
          {typeof q.question==="object"?(q.question[lang]||q.question.uz):getQ(q.question,lang)}
        </div>
        {q.sign!=null&&<div style={{textAlign:"center",marginBottom:20,background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",borderRadius:20,padding:16}}><SignSVG type={SIGNS[q.sign%8]}/></div>}
        {q.ticketId!=="rules"&&q.options&&<OptionsList options={getOpts(q.options,lang)} correct={q.correct} selected={selected} onSelect={handleAns} C={C}/>}
        {isSel&&(
          <div style={{background:selected===q.correct?"#DCFCE7":"#FEE2E2",borderRadius:14,padding:"12px 16px",marginTop:4,display:"flex",alignItems:"center",gap:10}}>
            {selected===q.correct?<IC.CheckCircle size={18} color="#22C55E"/>:<IC.XCircle size={18} color="#EF4444"/>}
            <span style={{fontWeight:600,fontSize:14,color:selected===q.correct?"#22C55E":"#EF4444"}}>{selected===q.correct?T.correct:T.wrong}</span>
          </div>
        )}
        <div style={{display:"flex",gap:12,marginTop:20}}>
          <Btn C={C} variant="outline" onClick={()=>{if(current>0){setCurrent(current-1);setSelected(results[current-1]??null);}}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}} disabled={current===0}><IC.ArrowLeft size={16} color={C.primary}/>{T.back}</Btn>
          {current<savedQuestions.length-1
            ? <Btn C={C} onClick={()=>{setCurrent(current+1);setSelected(results[current+1]??null);}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>{T.next}<IC.ArrowRight size={16} color="white"/></Btn>
            : <Btn C={C} onClick={()=>{setPracticeMode(false);setCurrent(0);setSelected(null);setResults({});}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><IC.CheckCircle size={15} color="white"/>Tugatish</Btn>
          }
        </div>
      </div>
    </div>;
  }

  return <div style={{minHeight:"100vh",background:C.bg}}>
    {/* Header */}
    <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,padding:"52px 20px 24px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
        <button onClick={()=>setScreen(prevScreen||"profile")} style={{background:"rgba(255,255,255,0.2)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><IC.ArrowLeft size={18} color="white"/></button>
        <div>
          <h2 style={{color:"white",fontSize:20,fontWeight:800,margin:0}}>{T.savedQ}</h2>
        </div>
      </div>
    </div>

    <div style={{padding:16}}>
      {savedQuestions.length===0 ? (
        <div style={{textAlign:"center",padding:"60px 20px"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:C.gray200,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
            <IC.Bookmark size={36} color={C.gray400}/>
          </div>
          <div style={{fontWeight:700,fontSize:18,color:C.text,marginBottom:8}}>{T.savedEmpty}</div>
        </div>
      ) : (
        <>
          {/* Practice & Clear buttons */}
          <div style={{display:"flex",gap:10,marginBottom:16}}>
            <button onClick={()=>setPracticeMode(true)} style={{flex:1,background:C.primary,color:"white",border:"none",borderRadius:14,padding:"13px",fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <IC.Clipboard size={16} color="white"/>{T.practiceAll}
            </button>
            <button onClick={clearAll} style={{background:C.danger+"22",color:C.danger,border:`1.5px solid ${C.danger}33`,borderRadius:14,padding:"13px 16px",fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              <IC.XCircle size={16} color={C.danger}/>
            </button>
          </div>

          {/* Question/Sign cards */}
          {savedQuestions.map((q,idx)=>{
            const isRule=q.ticketId==="rules";
            const questionText=typeof q.question==="object"?(q.question[lang]||q.question.uz):q.question;
            return (
            <div key={q.key} style={{background:C.card,borderRadius:16,padding:"14px 16px",marginBottom:12,boxShadow:"0 2px 10px rgba(0,0,0,0.07)",border:`1px solid ${C.cardBorder}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{background:isRule?"#DCFCE7":"#FEF3C7",borderRadius:8,padding:"4px 10px"}}>
                    <span style={{fontSize:11,fontWeight:700,color:isRule?"#22C55E":"#F59E0B"}}>
                      {isRule?<span style={{display:"flex",alignItems:"center",gap:4}}><IC.Traffic size={11} color={C.subtext}/>Yo'l qoidasi</span>:`${T.ticket} ${q.ticketId}`}
                    </span>
                  </div>
                  {!isRule&&<span style={{fontSize:11,color:C.subtext}}>#{q.questionId}</span>}
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <IC.Bookmark size={16} color="#F59E0B"/>
                  <button onClick={()=>removeOne(q.key)} style={{background:C.danger+"18",border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <IC.XCircle size={14} color={C.danger}/>
                  </button>
                </div>
              </div>
              <p style={{margin:"0 0 12px",fontSize:14,fontWeight:600,color:C.text,lineHeight:1.5}}>{questionText}</p>
              {q.sign!=null&&<div style={{background:"#FEF3C7",borderRadius:12,padding:"10px",marginBottom:10,display:"flex",justifyContent:"center"}}><SignSVG type={SIGNS[q.sign%8]}/></div>}
              {!isRule&&q.options&&(
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {getOpts(q.options,lang).map((opt,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:10,background:i===q.correct?C.success+"18":C.gray100,border:`1.5px solid ${i===q.correct?C.success+"44":"transparent"}`}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:i===q.correct?C.success:C.gray300,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"white",flexShrink:0}}>{String.fromCharCode(65+i)}</div>
                      <span style={{fontSize:13,color:i===q.correct?C.success:C.subtext,fontWeight:i===q.correct?600:400}}>{opt}</span>
                      {i===q.correct&&<IC.CheckCircle size={14} color={C.success} style={{marginLeft:"auto"}}/>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );})}

        </>
      )}
    </div>
  </div>;
}

// ─── NOTIFICATIONS SCREEN ───
function NotificationsScreen({setScreen,notifs,setNotifs,notifSettings,setNotifSettings,T,C,lang}) {
  const [tab,setTab]=useState("all");
  const [showSettings,setShowSettings]=useState(false);

  // Filter notifs by both tab AND settings
  const visibleNotifs=notifs.filter(n=>{
    if(!notifSettings[n.type]) return false;
    if(tab==="unread") return !n.read;
    return true;
  });
  const unreadCount=notifs.filter(n=>!n.read&&notifSettings[n.type]).length;

  const markAll=()=>setNotifs(notifs.map(n=>({...n,read:true})));
  const markOne=(id)=>setNotifs(notifs.map(n=>n.id===id?{...n,read:true}:n));
  const deleteOne=(id)=>setNotifs(notifs.filter(n=>n.id!==id));

  const timeLabel=(mins)=>{
    if(mins<1) return T.justNow;
    if(mins<60) return `${mins} ${T.minsAgo}`;
    if(mins<1440) return `${Math.floor(mins/60)} ${T.hoursAgo}`;
    return `${Math.floor(mins/1440)} kun oldin`;
  };

  const settingsList=[
    {key:"daily",  lk:"notifDaily",  desc:{uz:"Kunlik maqsad va eslatmalar",ru:"Ежедневные цели и напоминания",kril:"Кунлик мақсад ва эслатмалар"}},
    {key:"result", lk:"notifResult", desc:{uz:"Test va bilet natijalari",ru:"Результаты тестов и билетов",kril:"Тест ва билет натижалари"}},
    {key:"new",    lk:"notifNew",    desc:{uz:"Yangi biletlar va savollar",ru:"Новые билеты и вопросы",kril:"Янги билетлар ва саволлар"}},
    {key:"exam",   lk:"notifExam",   desc:{uz:"Imtihon eslatmalari",ru:"Напоминания об экзамене",kril:"Имтиҳон эслатмалари"}},
  ];

  const enabledCount=Object.values(notifSettings).filter(Boolean).length;

  // Settings panel
  if(showSettings) return (
    <div style={{minHeight:"100vh",background:C.bg}}>
      <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,padding:"52px 20px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setShowSettings(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <IC.ArrowLeft size={18} color="white"/>
          </button>
          <div>
            <h2 style={{color:"white",fontSize:20,fontWeight:800,margin:0}}>{T.notifSettings}</h2>
            <p style={{color:"rgba(255,255,255,0.75)",fontSize:12,margin:0}}>{enabledCount}/4 {T.notifOn||"yoqilgan"}</p>
          </div>
        </div>
      </div>
      <div style={{padding:16}}>
        {/* Master toggle */}
        <Card C={C} style={{marginBottom:16,padding:"16px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:42,height:42,borderRadius:14,background:enabledCount>0?C.primary+"18":C.gray100,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <IC.Bell size={20} color={enabledCount>0?C.primary:C.gray400}/>
              </div>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:C.text}}>Barcha bildirishnomalar</div>
                <div style={{fontSize:12,color:C.subtext}}>{enabledCount>0?`${enabledCount} ta yoqilgan`:"Hammasi o'chirilgan"}</div>
              </div>
            </div>
            <div onClick={()=>{
              const allOn=enabledCount===4;
              const newS={daily:!allOn,result:!allOn,new:!allOn,exam:!allOn};
              setNotifSettings(newS);
            }} style={{width:48,height:26,borderRadius:13,background:enabledCount>0?C.primary:C.gray300,cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
              <div style={{position:"absolute",top:3,left:enabledCount>0?22:3,width:20,height:20,borderRadius:"50%",background:"white",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
            </div>
          </div>
        </Card>

        <div style={{fontSize:11,fontWeight:700,color:C.subtext,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.5px"}}>Bildirishnoma turlari</div>
        {settingsList.map(s=>(
          <Card key={s.key} C={C} style={{marginBottom:10,padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:12,background:notifSettings[s.key]?(NOTIF_ICONS[s.key]?.bg||"#EEE"):C.gray100,display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.2s"}}>
                  {s.key==="daily"&&<IC.Bell size={18} color={notifSettings[s.key]?"#8B5CF6":C.gray400}/>}
                  {s.key==="result"&&<IC.CheckCircle size={18} color={notifSettings[s.key]?"#22C55E":C.gray400}/>}
                  {s.key==="new"&&<IC.Ticket size={18} color={notifSettings[s.key]?"#F59E0B":C.gray400}/>}
                  {s.key==="exam"&&<IC.Clock size={18} color={notifSettings[s.key]?"#1A6BFF":C.gray400}/>}
                </div>
                <div>
                  <div style={{fontWeight:600,fontSize:14,color:notifSettings[s.key]?C.text:C.gray400,transition:"color 0.2s"}}>{T[s.lk]}</div>
                  <div style={{fontSize:11,color:C.subtext,marginTop:1}}>{s.desc[lang]||s.desc.uz}</div>
                </div>
              </div>
              <div onClick={()=>setNotifSettings({...notifSettings,[s.key]:!notifSettings[s.key]})}
                style={{width:48,height:26,borderRadius:13,background:notifSettings[s.key]?C.success:C.gray300,cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
                <div style={{position:"absolute",top:3,left:notifSettings[s.key]?22:3,width:20,height:20,borderRadius:"50%",background:"white",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
              </div>
            </div>
          </Card>
        ))}

        {/* Info */}
        <div style={{marginTop:8,background:C.primary+"10",borderRadius:14,padding:"12px 16px",display:"flex",gap:10,alignItems:"flex-start"}}>
          <IC.Info size={16} color={C.primary} style={{flexShrink:0,marginTop:1}}/>
          <p style={{margin:0,fontSize:12,color:C.subtext,lineHeight:1.6}}>
            O'chirilgan tur bildirishnomalari ro'yxatda ko'rinmaydi va yangilari ham qo'shilmaydi.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:C.bg}}>
      {/* Header */}
      <div style={SC.header(C)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={()=>setScreen("home")} style={{background:"rgba(255,255,255,0.2)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <IC.ArrowLeft size={18} color="white"/>
            </button>
            <div>
              <h2 style={{color:"white",fontSize:20,fontWeight:800,margin:0}}>{T.notifications}</h2>
              {unreadCount>0&&<p style={{color:"rgba(255,255,255,0.75)",fontSize:12,margin:0}}>{unreadCount} {T.notifUnread}</p>}
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {unreadCount>0&&(
              <button onClick={markAll} style={{background:"transparent",border:"none",padding:"8px 4px",cursor:"pointer",display:"flex",alignItems:"center"}}>
                <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
                  <polyline points="1,9 6,14 14,4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="8,9 13,14 27,4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            <button onClick={()=>setShowSettings(true)} style={{background:"rgba(255,255,255,0.2)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <IC.Settings size={18} color="white"/>
              {enabledCount<4&&<div style={{position:"absolute",top:6,right:6,width:8,height:8,borderRadius:"50%",background:"#F59E0B",border:"1.5px solid white"}}/>}
            </button>
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:16}}>
          {[["all",T.notifAll],["unread",T.notifUnread]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"7px 16px",borderRadius:20,border:"none",cursor:"pointer",background:tab===id?"white":"rgba(255,255,255,0.2)",color:tab===id?C.primary:"white",fontSize:13,fontWeight:600}}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{padding:16}}>
        {/* O'chirilgan turlar haqida xabar */}
        {enabledCount<4&&(
          <div onClick={()=>setShowSettings(true)} style={{background:C.warning+"18",borderRadius:14,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10,cursor:"pointer",border:`1px solid ${C.warning}33`}}>
            <IC.Bell size={16} color={C.warning}/>
            <span style={{fontSize:12,color:C.text,flex:1}}>{4-enabledCount} turdagi bildirishnoma o'chirilgan</span>
            <IC.ChevronRight size={14} color={C.warning}/>
          </div>
        )}

        {visibleNotifs.length===0 ? (
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:C.gray200,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
              <IC.Bell size={32} color={C.gray400}/>
            </div>
            <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:6}}>{T.notifEmpty}</div>
          </div>
        ) : (
          visibleNotifs.map(n=>{
            const ni=NOTIF_ICONS[n.type]||NOTIF_ICONS.daily;
            return (
              <div key={n.id} onClick={()=>markOne(n.id)} style={{background:n.read?C.card:C.primary+"0D",borderRadius:16,padding:"14px 14px",marginBottom:10,display:"flex",alignItems:"flex-start",gap:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",cursor:"pointer",border:`1px solid ${n.read?C.cardBorder:C.primary+"33"}`,position:"relative"}}>
                <div style={{width:44,height:44,borderRadius:14,background:ni.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <ni.Icon size={20} color={ni.color}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                    <span style={{fontWeight:700,fontSize:13,color:C.text}}>{T[n.titleKey]}</span>
                    <span style={{fontSize:11,color:C.subtext,flexShrink:0,marginLeft:8}}>{timeLabel(n.time)}</span>
                  </div>
                  <p style={{margin:0,fontSize:13,color:C.subtext,lineHeight:1.5}}>{n.body[lang]||n.body.uz}</p>
                </div>
                {!n.read&&<div style={{position:"absolute",top:14,right:14,width:8,height:8,borderRadius:"50%",background:C.primary}}/>}
                <button onClick={e=>{e.stopPropagation();deleteOne(n.id);}} style={{position:"absolute",bottom:10,right:12,background:"none",border:"none",cursor:"pointer",padding:2,display:"flex",alignItems:"center"}}>
                  <IC.XCircle size={14} color={C.gray400}/>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── TOPICS SCREEN ───
const TOPICS_DATA = [
  { icon:"traffic", title:{uz:"Svetoforlar",ru:"Светофоры",kril:"Светофорлар"}, count:12, color:"#1A6BFF", bg:"#EBF2FF" },
  { icon:"roadsign", title:{uz:"Yo'l belgilari",ru:"Дорожные знаки",kril:"Йўл белгилари"}, count:28, color:"#22C55E", bg:"#DCFCE7" },
  { icon:"↔️", title:{uz:"Harakatlanish tartibi",ru:"Порядок движения",kril:"Ҳаракатланиш тартиби"}, count:20, color:"#F59E0B", bg:"#FEF3C7" },
  { icon:"refresh", title:{uz:"Kesishmalar",ru:"Перекрёстки",kril:"Кесишмалар"}, count:15, color:"#8B5CF6", bg:"#F5F3FF" },
  { icon:"walk", title:{uz:"Piyodalar",ru:"Пешеходы",kril:"Пиёдалар"}, count:10, color:"#EC4899", bg:"#FCE7F3" },
  { icon:"weather", title:{uz:"Ob-havo sharoiti",ru:"Погодные условия",kril:"Об-ҳаво шароити"}, count:8, color:"#0EA5E9", bg:"#E0F2FE" },
  { icon:"speed", title:{uz:"Tezlik chegarasi",ru:"Скорость",kril:"Тезлик чегараси"}, count:9, color:"#EF4444", bg:"#FEE2E2" },
  { icon:"🅿️", title:{uz:"To'xtash va turish",ru:"Остановка и стоянка",kril:"Тўхташ ва туриш"}, count:11, color:"#F97316", bg:"#FFEDD5" },
  { icon:"ambulance", title:{uz:"Maxsus transport",ru:"Спецтранспорт",kril:"Махсус транспорт"}, count:6, color:"#14B8A6", bg:"#CCFBF1" },
  { icon:"wrench", title:{uz:"Texnik holat",ru:"Техническое состояние",kril:"Техник ҳолат"}, count:7, color:"#6366F1", bg:"#EEF2FF" },
];

function TopicsScreen({setScreen,T,C,lang}) {
  return (
    <div style={{minHeight:"100vh",background:C.bg}}>
      <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,padding:"52px 20px 24px"}}>
        <h2 style={{color:"white",fontSize:22,fontWeight:800,margin:0}}>{T.topicsTitle}</h2>
        <p style={{color:"rgba(255,255,255,0.7)",fontSize:13,margin:"4px 0 0"}}>{T.topicsSub}</p>
      </div>
      <div style={{padding:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {TOPICS_DATA.map((topic,i)=>(
          <div key={i} style={{background:C.card,borderRadius:18,padding:16,cursor:"pointer",border:`1px solid ${C.cardBorder}`,boxShadow:"0 1px 6px rgba(0,0,0,0.05)",transition:"transform 0.15s"}}>
            <div style={{width:44,height:44,borderRadius:14,background:topic.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:10}}>
              {topic.icon}
            </div>
            <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:4,lineHeight:1.3}}>
              {topic.title[lang]||topic.title.uz}
            </div>
            <div style={{fontSize:11,color:topic.color,fontWeight:600}}>
              {topic.count} {T.questions}
            </div>
            <div style={{marginTop:8,height:4,background:C.gray200,borderRadius:100}}>
              <div style={{height:"100%",width:`${[65,40,0,80,55,0,30,70,0,45][i]||0}%`,background:topic.color,borderRadius:100}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RULES SCREEN ───
const SIGNS_CATEGORIES = [
  {
    id:"info",
    icon:"ℹ️",
    color:"#0EA5E9", bg:"#E0F2FE",
    title:{uz:"Axborot belgilari",ru:"Информационные знаки",kril:"Ахборот белгилари"},
    desc:{uz:"Yo'l sharoiti va harakat tartibi haqida ma'lumot beruvchi belgilar",ru:"Знаки, информирующие об условиях движения",kril:"Йўл шароити ва ҳаракат тартиби ҳақида маълумот берувчи белгилар"},
    count:34,
    items:[
      {uz:"5.1 — Avtomobil yo'li boshlanishi",ru:"5.1 — Начало автомобильной дороги",kril:"5.1 — Автомобил йўли бошланиши"},
      {uz:"5.3 — Bir tomonlama harakat boshlanishi",ru:"5.3 — Начало одностороннего движения",kril:"5.3 — Бир томонлама ҳаракат бошланиши"},
      {uz:"5.5 — Piyodalar yo'lkasi",ru:"5.5 — Пешеходная дорожка",kril:"5.5 — Пиёдалар йўлкаси"},
      {uz:"5.7 — Velosiped yo'lkasi",ru:"5.7 — Велосипедная дорожка",kril:"5.7 — Велосипед йўлкаси"},
      {uz:"5.11 — Aholi punkti boshlanishi",ru:"5.11 — Начало населённого пункта",kril:"5.11 — Аҳоли пункти бошланиши"},
      {uz:"5.15 — To'g'ri va chapga harakat yo'nalishi",ru:"5.15 — Направление движения прямо и налево",kril:"5.15 — Тўғри ва чапга ҳаракат йўналиши"},
    ]
  },
  {
    id:"order",
    icon:"mandatory",
    color:"#1A6BFF", bg:"#EBF2FF",
    title:{uz:"Buyuruvchi belgilar",ru:"Предписывающие знаки",kril:"Буйрувчи белгилар"},
    desc:{uz:"Haydovchilar bajarishi majburiy bo'lgan harakatlarni ko'rsatuvchi belgilar",ru:"Знаки, указывающие обязательные для выполнения действия",kril:"Ҳайдовчилар бажариши мажбурий бўлган ҳаракатларни кўрсатувчи белгилар"},
    count:21,
    items:[
      {uz:"4.1 — To'g'ri harakat",ru:"4.1 — Движение прямо",kril:"4.1 — Тўғри ҳаракат"},
      {uz:"4.2 — O'ngga harakat",ru:"4.2 — Движение направо",kril:"4.2 — Ўнгга ҳаракат"},
      {uz:"4.3 — Chapga harakat",ru:"4.3 — Движение налево",kril:"4.3 — Чапга ҳаракат"},
      {uz:"4.5 — To'g'ri yoki o'ngga harakat",ru:"4.5 — Движение прямо или направо",kril:"4.5 — Тўғри ёки ўнгга ҳаракат"},
      {uz:"4.7 — O'ngdan aylanib o'tish",ru:"4.7 — Объезд препятствия справа",kril:"4.7 — Ўнгдан айланиб ўтиш"},
      {uz:"4.9 — Aylana bo'ylab harakat",ru:"4.9 — Движение по кольцу",kril:"4.9 — Айлана бўйлаб ҳаракат"},
    ]
  },
  {
    id:"priority",
    icon:"⭐",
    color:"#F59E0B", bg:"#FEF3C7",
    title:{uz:"Imtiyoz belgilari",ru:"Знаки приоритета",kril:"Имтиёз белгилари"},
    desc:{uz:"Kesishmalardagi va tor yo'llardagi harakatlanish tartibini belgilovchi belgilar",ru:"Знаки, устанавливающие порядок проезда перекрёстков и узких участков",kril:"Кесишмалардаги ва тор йўллардаги ҳаракатланиш тартибини белгиловчи белгилар"},
    count:8,
    items:[
      {uz:"2.1 — Asosiy yo'l",ru:"2.1 — Главная дорога",kril:"2.1 — Асосий йўл"},
      {uz:"2.2 — Asosiy yo'l tugashi",ru:"2.2 — Конец главной дороги",kril:"2.2 — Асосий йўл тугаши"},
      {uz:"2.3 — Ikkilamchi yo'lga chiqish",ru:"2.3 — Пересечение со второстепенной дорогой",kril:"2.3 — Иккиламчи йўлга чиқиш"},
      {uz:"2.4 — Yo'l bering",ru:"2.4 — Уступите дорогу",kril:"2.4 — Йўл беринг"},
      {uz:"2.5 — To'xtamay o'tish taqiqlanadi",ru:"2.5 — Движение без остановки запрещено",kril:"2.5 — Тўхтамай ўтиш тақиқланади"},
      {uz:"2.7 — Imtiyozli yo'l harakati",ru:"2.7 — Преимущество перед встречным движением",kril:"2.7 — Имтиёзли йўл ҳаракати"},
    ]
  },
  {
    id:"prohibit",
    icon:"prohibit",
    color:"#EF4444", bg:"#FEE2E2",
    title:{uz:"Taqiqlovchi belgilar",ru:"Запрещающие знаки",kril:"Тақиқловчи белгилар"},
    desc:{uz:"Muayyan harakatlarni taqiqlovchi yoki cheklovchi belgilar",ru:"Знаки, вводящие или отменяющие ограничения движения",kril:"Муайян ҳаракатларни тақиқловчи ёки чекловчи белгилар"},
    count:42,
    items:[
      {uz:"3.1 — Kirish taqiqlanadi",ru:"3.1 — Въезд запрещён",kril:"3.1 — Кириш тақиқланади"},
      {uz:"3.2 — Harakatlanish taqiqlanadi",ru:"3.2 — Движение запрещено",kril:"3.2 — Ҳаракатланиш тақиқланади"},
      {uz:"3.17 — To'xtash taqiqlanadi",ru:"3.17 — Остановка запрещена",kril:"3.17 — Тўхташ тақиқланади"},
      {uz:"3.18 — Turish taqiqlanadi",ru:"3.18 — Стоянка запрещена",kril:"3.18 — Туриш тақиқланади"},
      {uz:"3.20 — O'tib ketish taqiqlanadi",ru:"3.20 — Обгон запрещён",kril:"3.20 — Ўтиб кетиш тақиқланади"},
      {uz:"3.24 — Maksimal tezlik chegarasi",ru:"3.24 — Ограничение максимальной скорости",kril:"3.24 — Максимал тезлик чегараси"},
    ]
  },
  {
    id:"warning",
    icon:"warning",
    color:"#F97316", bg:"#FFEDD5",
    title:{uz:"Ogohlantiruvchi belgilar",ru:"Предупреждающие знаки",kril:"Огоҳлантирувчи белгилар"},
    desc:{uz:"Xavfli yo'l uchastkasi va sharoitlari haqida oldindan ogohlantiruvchi belgilar",ru:"Знаки, предупреждающие об опасных участках дороги",kril:"Хавфли йўл участкаси ва шароитлари ҳақида олдиндан огоҳлантирувчи белгилар"},
    count:29,
    items:[
      {uz:"1.1 — Xavfli burilish (o'ngga)",ru:"1.1 — Опасный поворот (направо)",kril:"1.1 — Хавфли бурилиш (ўнгга)"},
      {uz:"1.3 — Ko'p burilishlar",ru:"1.3 — Опасные повороты",kril:"1.3 — Кўп бурилишлар"},
      {uz:"1.5 — Tekis bo'lmagan yo'l",ru:"1.5 — Неровная дорога",kril:"1.5 — Текис бўлмаган йўл"},
      {uz:"1.11 — Temir yo'l kesishmasi (shlagbaum bilan)",ru:"1.11 — Ж/д переезд со шлагбаумом",kril:"1.11 — Темир йўл кесишмаси (шлагбаум билан)"},
      {uz:"1.21 — Piyodalar o'tish joyi",ru:"1.21 — Пешеходный переход",kril:"1.21 — Пиёдалар ўтиш жойи"},
      {uz:"1.23 — Bolalar",ru:"1.23 — Дети",kril:"1.23 — Болалар"},
    ]
  },
  {
    id:"additional",
    icon:"info",
    color:"#8B5CF6", bg:"#F5F3FF",
    title:{uz:"Qo'shimcha axborot belgilari",ru:"Знаки дополнительной информации",kril:"Қўшимча ахборот белгилари"},
    desc:{uz:"Boshqa belgilar ta'sirini aniqlashtiruvchi yoki cheklovchi jadvallar",ru:"Таблички, уточняющие или ограничивающие действие других знаков",kril:"Бошқа белгилар таъсирини аниқлаштирувчи ёки чекловчи жадваллар"},
    count:18,
    items:[
      {uz:"7.1 — Ta'sir masofasi",ru:"7.1 — Расстояние до объекта",kril:"7.1 — Таъсир масофаси"},
      {uz:"7.2 — Zona uzunligi",ru:"7.2 — Протяжённость зоны",kril:"7.2 — Зона узунлиги"},
      {uz:"7.3 — Yo'nalish va masofa",ru:"7.3 — Направление и расстояние",kril:"7.3 — Йўналиш ва масофа"},
      {uz:"7.4 — Transport vositasi turi",ru:"7.4 — Вид транспортного средства",kril:"7.4 — Транспорт воситаси тури"},
      {uz:"7.5 — Harakat vaqti",ru:"7.5 — Время действия",kril:"7.5 — Ҳаракат вақти"},
      {uz:"7.6 — Dam olish kunlari",ru:"7.6 — Дни недели",kril:"7.6 — Дам олиш кунлари"},
    ]
  },
  {
    id:"temporary",
    icon:"warning2",
    color:"#F59E0B", bg:"#FEF3C7",
    title:{uz:"Vaqtinchalik belgilar",ru:"Временные знаки",kril:"Вақтинчалик белгилар"},
    desc:{uz:"Sariq fonda joylashtirilgan, muvaqqat harakatlanish tartibini belgilovchi belgilar",ru:"Знаки на жёлтом фоне, временно изменяющие порядок движения",kril:"Сариқ фонда жойлаштирилган, муваққат ҳаракатланиш тартибини белгиловчи белгилар"},
    count:12,
    items:[
      {uz:"Sariq fon — vaqtinchalik belgi ekanligini bildiradi",ru:"Жёлтый фон указывает на временный характер знака",kril:"Сариқ фон — вақтинчалик белги эканлигини билдиради"},
      {uz:"Yo'l ta'miri ishlari paytida qo'llaniladi",ru:"Применяются при дорожных работах",kril:"Йўл таъмири ишлари пайтида қўлланилади"},
      {uz:"Doimiy belgilar bilan zid bo'lsa, vaqtinchalik belgiga rioya qilish kerak",ru:"При противоречии с постоянными — выполнять временный знак",kril:"Доимий белгилар билан зид бўлса, вақтинчалик белгига риоя қилиш керак"},
      {uz:"Portativ svetofor doimiy svetofor bilan zid bo'lsa — portativga bo'ysiniladi",ru:"Переносной светофор имеет приоритет над стационарным",kril:"Портатив светофор доимий светофор билан зид бўлса — портативга бўйсинилади"},
    ]
  },
  {
    id:"service",
    icon:"hospital",
    color:"#22C55E", bg:"#DCFCE7",
    title:{uz:"Xizmat ko'rsatish belgilari",ru:"Знаки сервиса",kril:"Хизмат кўрсатиш белгилари"},
    desc:{uz:"Xizmat ko'rsatish ob'ektlari joylashgan joyni ko'rsatuvchi belgilar",ru:"Знаки, указывающие расположение объектов сервиса",kril:"Хизмат кўрсатиш объектлари жойлашган жойни кўрсатувчи белгилар"},
    count:16,
    items:[
      {uz:"6.1 — Tibbiy yordam punkti",ru:"6.1 — Пункт медицинской помощи",kril:"6.1 — Тиббий ёрдам пункти"},
      {uz:"6.3 — Telefon",ru:"6.3 — Телефон",kril:"6.3 — Телефон"},
      {uz:"6.5 — Yoqilg'i quyish shohobchasi",ru:"6.5 — Автозаправочная станция",kril:"6.5 — Ёқилғи қуйиш шоҳобчаси"},
      {uz:"6.7 — Texnik xizmat ko'rsatish",ru:"6.7 — Техническое обслуживание",kril:"6.7 — Техник хизмат кўрсатиш"},
      {uz:"6.9 — Avtomoychma",ru:"6.9 — Мойка автомобилей",kril:"6.9 — Автомойча"},
      {uz:"6.11 — Oshxona",ru:"6.11 — Пункт питания",kril:"6.11 — Ошхона"},
    ]
  },
];

function RulesScreen({setScreen,T,C,lang,savedQuestions,setSavedQuestions}) {
  const [selected,setSelected]=useState(null);
  const [expanded,setExpanded]=useState(null);

  const toggleBookmark=(key,item)=>{
    if(savedQuestions.some(s=>s.key===key)){
      setSavedQuestions(savedQuestions.filter(s=>s.key!==key));
    } else {
      setSavedQuestions([...savedQuestions,{key,question:{uz:item.uz,ru:item.ru||item.uz,kril:item.kril||item.uz},options:{uz:[],ru:[],kril:[]},correct:0,ticketId:"rules"}]);
    }
  };

  if(selected!==null){
    const cat=SIGNS_CATEGORIES[selected];
    return (
      <div style={{minHeight:"100vh",background:C.bg}}>
        {/* Header */}
        <div style={{background:`linear-gradient(135deg,${cat.color},${cat.color}bb)`,padding:"52px 20px 24px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <button onClick={()=>{setSelected(null);setExpanded(null);}}
              style={{width:36,height:36,borderRadius:12,background:"rgba(255,255,255,0.2)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <IC.ArrowLeft size={18} color="white"/>
            </button>
            <div style={{fontSize:28}}>{cat.icon}</div>
            <h2 style={{color:"white",fontSize:18,fontWeight:800,margin:0,flex:1}}>
              {cat.title[lang]||cat.title.uz}
            </h2>
          </div>
          <p style={{color:"rgba(255,255,255,0.8)",fontSize:13,margin:0,lineHeight:1.5}}>
            {cat.desc[lang]||cat.desc.uz}
          </p>
          <div style={{marginTop:12,display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"5px 12px"}}>
            <span style={{color:"white",fontSize:12,fontWeight:700}}>{cat.count} ta belgi</span>
          </div>
        </div>
        {/* Items accordion */}
        <div style={{padding:16,display:"flex",flexDirection:"column",gap:10}}>
          {cat.items.map((item,j)=>{
            const bKey=`rules-${selected}-${j}`;
            const isSaved=savedQuestions.some(s=>s.key===bKey);
            return (
            <div key={j} style={{background:C.card,borderRadius:16,overflow:"hidden",border:`1px solid ${C.cardBorder}`,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
              <div onClick={()=>setExpanded(expanded===j?null:j)}
                style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
                <div style={{width:34,height:34,borderRadius:10,background:cat.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:13,fontWeight:800,color:cat.color}}>{j+1}</span>
                </div>
                <span style={{flex:1,fontSize:13,fontWeight:600,color:C.text,lineHeight:1.4}}>
                  {item[lang]||item.uz}
                </span>
                <button onClick={e=>{e.stopPropagation();toggleBookmark(bKey,item);}} style={{width:30,height:30,borderRadius:8,border:"none",background:isSaved?"#FEF3C7":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <IC.Bookmark size={16} color={isSaved?"#F59E0B":C.gray400}/>
                </button>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{transform:expanded===j?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s",flexShrink:0}}>
                  <polyline points="6 9 12 15 18 9" stroke={C.gray400} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {expanded===j&&(
                <div style={{borderTop:`1px solid ${C.gray200}`,padding:"12px 16px",background:cat.bg+"44"}}>
                  <p style={{margin:0,fontSize:12,color:C.subtext,lineHeight:1.6}}>
                    {item[lang]||item.uz} — ushbu belgi yo'l harakati ishtirokchilarini tegishli sharoit yoki cheklov haqida xabardor qiladi.
                  </p>
                </div>
              )}
            </div>
          );})}
        </div>
      </div>
    );
  }

  // Main categories list
  return (
    <div style={{minHeight:"100vh",background:C.bg}}>
      <div style={{background:`linear-gradient(135deg,#EC4899,#8B5CF6)`,padding:"52px 20px 24px"}}>
        <h2 style={{color:"white",fontSize:22,fontWeight:800,margin:0}}>{T.rulesTitle}</h2>
        <p style={{color:"rgba(255,255,255,0.7)",fontSize:13,margin:"4px 0 0"}}>{T.rulesSub}</p>
        <div style={{marginTop:12,display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.15)",borderRadius:20,padding:"5px 14px"}}>
          <span style={{color:"white",fontSize:12,fontWeight:700}}>8 bo'lim • 180 ta belgi</span>
        </div>
      </div>
      <div style={{padding:16,display:"flex",flexDirection:"column",gap:10}}>
        {SIGNS_CATEGORIES.map((cat,i)=>(
          <div key={i} onClick={()=>setSelected(i)}
            style={{background:C.card,borderRadius:18,padding:"16px 18px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",border:`1px solid ${C.cardBorder}`,boxShadow:"0 1px 6px rgba(0,0,0,0.05)",transition:"transform 0.15s"}}>
            <div style={{width:50,height:50,borderRadius:16,background:cat.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>
              {cat.icon}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:3}}>
                {cat.title[lang]||cat.title.uz}
              </div>
              <div style={{fontSize:11,color:C.subtext,lineHeight:1.4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                {cat.count} ta belgi
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
              <div style={{background:cat.bg,borderRadius:20,padding:"4px 10px"}}>
                <span style={{fontSize:11,fontWeight:700,color:cat.color}}>{cat.count}</span>
              </div>
              <IC.ChevronRight size={16} color={C.gray400}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TELEGRAM MINI APP HOOK ───
// window.Telegram.WebApp orqali Telegram bilan muloqot
function useTelegram() {
  const tg = typeof window !== "undefined" ? window?.Telegram?.WebApp : null;

  useEffect(() => {
    if (!tg) return;
    tg.expand();
    tg.ready();
  }, []);

  // Telegram theme ranglarini header ga qo'llash
  useEffect(() => {
    if (!tg) return;
    const params = tg?.themeParams || {};
    const btnColor = params.button_color;
    const bgColor  = params.bg_color;
    try { tg.setHeaderColor(btnColor || (tg?.colorScheme === "dark" ? "#1E3A5F" : "#1A6BFF")); } catch {}
    try { tg.setBackgroundColor(bgColor || (tg?.colorScheme === "dark" ? "#0F172A" : "#F8FAFC")); } catch {}
  }, [tg?.colorScheme, tg?.themeParams]);

  // Telegram foydalanuvchi ma'lumotlari
  const tgUser = tg?.initDataUnsafe?.user || null;

  // Telegram Back button boshqaruvi
  const showBackButton = (onBack) => {
    if (!tg) return;
    tg.BackButton.show();
    tg.BackButton.onClick(onBack);
  };

  const hideBackButton = () => {
    if (!tg) return;
    tg.BackButton.hide();
    tg.BackButton.offClick();
  };

  // Telegram Main button boshqaruvi
  const showMainButton = (text, onClick, color = "#1A6BFF") => {
    if (!tg) return;
    tg.MainButton.setText(text);
    tg.MainButton.color = color;
    tg.MainButton.show();
    tg.MainButton.onClick(onClick);
  };

  const hideMainButton = () => {
    if (!tg) return;
    tg.MainButton.hide();
    tg.MainButton.offClick();
  };

  // Telegram mavzusi (qorong'i yoki yorug')
  const isDark = tg?.colorScheme === "dark";

  // Haptic feedback
  const haptic = {
    light: () => tg?.HapticFeedback?.impactOccurred("light"),
    medium: () => tg?.HapticFeedback?.impactOccurred("medium"),
    success: () => tg?.HapticFeedback?.notificationOccurred("success"),
    error: () => tg?.HapticFeedback?.notificationOccurred("error"),
  };

  // Telegram safe area (ekranning xavfsiz hududi - notch, status bar)
  const safeTop = tg?.safeAreaInset?.top || 0;

  // Backend ga login
  const loginToBackend = async () => {
    const initData = tg?.initData;
    if (!initData) return null;
    try {
      const res = await apiPost('/auth/telegram', { initData });
      return res;
    } catch (err) {
      console.error('Backend login xatosi:', err);
      return null;
    }
  };

  return { tg, tgUser, isDark, showBackButton, hideBackButton, showMainButton, hideMainButton, haptic, safeTop, loginToBackend };
}

// ─── APP ───
export default function App() {
  const { tg, tgUser, isDark, showBackButton, hideBackButton, haptic, safeTop, loginToBackend } = useTelegram();

  const [screen, setScreenRaw] = useState("home");
  const [prevScreen, setPrevScreen] = useState("home");

  // JWT token saqlash
  const [token, setToken] = useState(() => {
    try { return sessionStorage.getItem('auth_token') || null; } catch { return null; }
  });

  // Telegram foydalanuvchi avtomatik login
  const defaultUser = tgUser
    ? {
        name: tgUser.first_name || "Foydalanuvchi",
        surname: tgUser.last_name || "",
        phone: "",
        tgId: tgUser.id,
        username: tgUser.username || "",
        photo: tgUser.photo_url || null,
        isPro: false,
      }
    : { name: "Alisher", surname: "Karimov", phone: "+998 90 123 45 67", isPro: false };

  const [user, setUser] = useState(defaultUser);

  // Backend login — ilova ochilganda
  useEffect(() => {
    if (!loginToBackend) return;
    loginToBackend().then(res => {
      if (!res) return;
      try { sessionStorage.setItem('auth_token', res.token); } catch {}
      setToken(res.token);
      if (res.user) {
        setUser(prev => ({
          ...prev,
          id: res.user.id,
          tgId: res.user.tgId,
          name: res.user.firstName || prev.name,
          surname: res.user.lastName || prev.surname,
          username: res.user.username || prev.username,
          isPro: res.user.isPro || false,
          proExpiresAt: res.user.proExpiresAt,
          referralCode: res.user.referralCode,
        }));
      }
      // Backend dan sozlamalarni olamiz
      if (res.settings) {
        if (res.settings.daily_test_limit) LIMITS.dailyTestLimit = res.settings.daily_test_limit.value;
        if (res.settings.free_exam_count) LIMITS.freeExamCount = res.settings.free_exam_count.value;
        if (res.settings.free_ticket_count) LIMITS.freeTicketCount = res.settings.free_ticket_count.value;
        if (res.settings.discount) Object.assign(DISCOUNT, res.settings.discount);
      }
    }).catch(err => console.warn('Backend login failed, using offline mode:', err));
  }, [tgUser?.id]);

  // Onboardingni faqat birinchi marta ko'rsatish
  // localStorage ishlatish mumkin emas (Telegram Mini App da cheklov bor)
  // Shuning uchun sessionStorage ishlatamiz
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return !sessionStorage.getItem("ob_done"); } catch { return true; }
  });

  const [activeTicket, setActiveTicket] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [lastTestResult, setLastTestResult] = useState(null);
  const [examResult, setExamResult] = useState(null);

  // Telegram mavzusiga mos holda dark mode
  const [dark, setDark] = useState(isDark);
  const [lang, setLang] = useState("uz");
  const [notifs, setNotifs] = useState(INIT_NOTIFS);
  const [notifSettings, setNotifSettings] = useState({ daily: true, result: true, new: true, exam: true });
  const [toasts, setToasts] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [showLangModal, setShowLangModal] = useState(false);

  // Ekran o'zgarganda Telegram Back button boshqaruvi
  const setScreen = (s) => {
    setPrevScreen(screen);
    setScreenRaw(s);
  };

  // Qaysi ekranlarda Telegram Back button ko'rsatiladi
  const rootScreens = ["home", "tickets", "tests", "exam", "stats", "rating", "profile"];

  useEffect(() => {
    if (rootScreens.includes(screen)) {
      hideBackButton();
    } else {
      showBackButton(() => {
        // Telegram back button bosilganda oldingi ekranga qaytish
        if (screen === "ticket-quiz") setScreen("tickets");
        else if (screen === "test-quiz") setScreen("tests");
        else if (screen === "exam-quiz") setScreen("exam");
        else if (screen === "ticket-result") setScreen("tickets");
        else if (screen === "exam-result" || screen === "exam-fail") setScreen("exam");
        else if (screen === "test-result") setScreen("tests");
        else if (screen === "pro") setScreen("profile");
        else if (screen === "notifications") setScreen("home");
        else if (screen === "saved") setScreen(prevScreen || "profile");
        else if (screen === "search") setScreen("home");
        else if (screen === "topics") setScreen("home");
        else if (screen === "rules") setScreen("home");
        else setScreen("home");
      });
    }
  }, [screen]);

  const T = LANGS[lang];
  const C = getTheme(dark);
  const noNav = ["ticket-quiz", "test-quiz", "exam-quiz", "notifications", "saved", "search", "pro"];
  const showNav = !noNav.includes(screen);

  const unreadCount = notifs.filter(n => !n.read).length;

  const addToast = (msg, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
    // Telegram haptic feedback
    if (type === "success") haptic.success();
    else if (type === "error") haptic.error();
    else haptic.light();
  };

  // Onboarding tugaganda sessionStorage ga yozish
  const finishOnboarding = () => {
    try { sessionStorage.setItem("ob_done", "1"); } catch {}
    setShowOnboarding(false);
  };

  // Simulate incoming notification every 30s
  useEffect(() => {
    if (!user) return;
    const t = setInterval(() => {
      const msgs = {
        uz: "Yangi bildirishnoma keldi!",
        ru: "Новое уведомление!",
        kril: "Янги билдиришнома келди!",
      };
      setNotifs(p => [{ id: Date.now(), type: "daily", read: false, time: 0, titleKey: "notifDaily", body: { uz: msgs.uz, ru: msgs.ru, kril: msgs.kril } }, ...p]);
      addToast(msgs[lang], "info");
    }, 30000);
    return () => clearInterval(t);
  }, [user, lang]);

  const handleExamResult = (result) => {
    setExamResult(result);
    const msg = {
      uz: result.passed ? "Imtihondan o'tdingiz! 🎉" : "Imtihondan o'ta olmadingiz",
      ru: result.passed ? "Экзамен сдан! 🎉" : "Экзамен не сдан",
      kril: result.passed ? "Имтиҳондан ўтдингиз! 🎉" : "Имтиҳондан ўта олмадингиз",
    };
    addToast(msg[lang], result.passed ? "success" : "error");
    if (notifSettings.result) {
      setNotifs(p => [{ id: Date.now(), type: "result", read: false, time: 0, titleKey: "notifResult", body: msg }, ...p]);
    }
  };

  const props = { T, C, dark, setDark, lang, setLang, notifs, setNotifs, notifSettings, setNotifSettings, unreadCount, addToast, savedQuestions, setSavedQuestions, setShowLangModal };

  const render = () => {
    switch (screen) {
      // Login/Register ekranlarini olib tashladik — Telegram avtomatik login
      case "home": return <HomeScreen {...props} setScreen={setScreen} user={user} />;
      case "tickets": return <TicketsScreen {...props} setScreen={setScreen} setActiveTicket={setActiveTicket} user={user} />;
      case "ticket-quiz": return <TicketQuizScreen {...props} setScreen={setScreen} ticket={activeTicket} setLastResult={setLastResult} />;
      case "ticket-pro-gate": return <ProGate T={T} C={C} setScreen={setScreen} reason="ticket" onBack={()=>setScreen("tickets")}/>;
      case "ticket-result": return <TicketResultScreen {...props} setScreen={setScreen} result={lastResult} />;
      case "tests": return <TestsScreen {...props} setScreen={setScreen} user={user} />;
      case "test-quiz": return <TestQuizScreen {...props} setScreen={setScreen} setLastTestResult={setLastTestResult} />;
      case "test-limit-gate": return <ProGate T={T} C={C} setScreen={setScreen} reason="testLimit" onBack={()=>setScreen("tests")}/>;
      case "test-result": return <ExamResultScreen {...props} setScreen={setScreen} result={lastTestResult ?? { correct: 9, total: 12, wrong: 3, passed: true, percent: 75 }} />;
      case "exam": return <ExamScreen {...props} setScreen={setScreen} user={user} />;
      case "exam-quiz": return <ExamQuizScreen {...props} setScreen={setScreen} setExamResult={handleExamResult} user={user} />;
      case "exam-limit-gate": return <ProGate T={T} C={C} setScreen={setScreen} reason="examLimit" onBack={()=>setScreen("exam")}/>;
      case "exam-result": return <ExamResultScreen {...props} setScreen={setScreen} result={examResult ?? { correct: 19, total: 20, wrong: 1, passed: true, percent: 95 }} />;
      case "exam-fail": return <ExamResultScreen {...props} setScreen={setScreen} result={examResult ?? { correct: 16, total: 20, wrong: 4, passed: false, percent: 80 }} />;
      case "stats": return <StatsScreen {...props} />;
      case "rating": return <RatingScreen {...props} />;
      case "profile": return <ProfileScreen {...props} setScreen={setScreen} user={user} setUser={setUser} tgUser={tgUser} />;
      case "pro": return <ProScreen {...props} setScreen={setScreen} />;
      case "referral": return <ReferralScreen T={T} C={C} setScreen={setScreen} user={user} addToast={addToast}/>;
      case "about": return <AboutScreen T={T} C={C} setScreen={setScreen} lang={lang}/>;
      case "topics": return <TopicsScreen {...props} setScreen={setScreen} />;
      case "rules": return <RulesScreen {...props} setScreen={setScreen} />;
      case "notifications": return <NotificationsScreen {...props} setScreen={setScreen} />;
      case "saved": return <SavedQuestionsScreen {...props} setScreen={setScreen} setActiveTicket={setActiveTicket} prevScreen={prevScreen} />;
      case "search": return <SearchScreen {...props} setScreen={setScreen} setActiveTicket={setActiveTicket} />;
      default: return <HomeScreen {...props} setScreen={setScreen} user={user} />;
    }
  };

  // Telegram Mini App da wrapper kengligi 100% bo'lishi kerak (telefon ekrani)
  // safeTop — Telegram status bar balandligi (notch uchun)
  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      // Telegram safe area — status bar va pastki navigatsiya uchun joy qoldirish
      paddingTop: safeTop,
    }}>
      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { margin: 0; padding: 0; overflow-x: hidden; }
        input, button { font-family: 'DM Sans','Segoe UI',sans-serif; }
      `}</style>

      <LangModal visible={showLangModal} onClose={() => setShowLangModal(false)} lang={lang} setLang={setLang} C={C} />

      {showOnboarding ? (
        <OnboardingScreen onFinish={finishOnboarding} T={T} C={C} lang={lang} setLang={setLang} />
      ) : (
        <PhoneWrapper {...props} showNav={showNav} screen={screen} setScreen={setScreen}>
          <Toast toasts={toasts} />
          <div style={{ overflowY: "auto", height: showNav ? "calc(100vh - 70px)" : "100vh" }}>
            {render()}
          </div>
        </PhoneWrapper>
      )}
    </div>
  );
}
