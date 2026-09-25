import { useState, useEffect, useRef, useMemo } from "react";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { AppLauncher } from "@capacitor/app-launcher";

// ─── PLATFORMA ───
// IS_NATIVE — Android ilova (Capacitor). Telegram Mini App va brauzerda false.
const IS_NATIVE = Capacitor.isNativePlatform();
// Android'da sessionStorage ilova yopilganda o'chadi — token va sozlamalar localStorage'da saqlanadi
const persist = {
  get: (k) => { try { return (IS_NATIVE ? localStorage : sessionStorage).getItem(k); } catch { return null; } },
  set: (k, v) => { try { (IS_NATIVE ? localStorage : sessionStorage).setItem(k, v); } catch { /* storage yo'q */ } },
  del: (k) => { try { (IS_NATIVE ? localStorage : sessionStorage).removeItem(k); } catch { /* storage yo'q */ } },
};

// ─── TRANSLATIONS ───
const LANGS = {
  uz: {
    code:"uz", label:"O'zbekcha", flag:"🇺🇿",
    proNativeSoon:"Pro obunani ilova ichida sotib olish tez orada qo'shiladi.",
    keepPracticing:"Yaxshi urinish!",
    services:"Xizmatlar", tipHint:"Bu strategiyani keyingi mashqda qo'llab ko'ring.", sectionsWord:"bo'lim",
    login:"Kirish", register:"Ro'yxatdan o'tish", phone:"Telefon raqam", password:"Parol",
    confirmPass:"Parolni tasdiqlang", forgotPass:"Parolni unutdingiz?",
    orWith:"yoki", googleLogin:"Google orqali kirish",
    noAccount:"Hisobingiz yo'qmi?", haveAccount:"Hisobingiz bormi?",
    name:"Ism", surname:"Familiya", createAccount:"Hisob yarating va o'rganishni boshlang",
    hello:"Assalomu alaykum,", home:"Bosh sahifa", todayResult:"Bugungi natija", allBtn:"Barchasi →",
    active:"Faollar", tests:"Testlar", rating:"Reyting",
    tickets:"To'plamlar", ticketsSub:"100 ta to'plam", testsSub:"Cheksiz jumboq",
    exam:"IQ test", examSub:"15 daqiqalik test", stats:"Statistika", statsSub:"Natijalaringiz",
    ratingSub:"Top Natijalar", profile:"Profil", profileSub:"Sozlamalar",
    todayGoal:"Bugungi maqsad", lastActivity:"Oxirgi faoliyat",
    allTickets:"100 ta to'plam mavjud", bookmarked:"Saqlangan",
    allTab:"Barchasi", done:"Yakunlangan", undone:"Yakunlanmagan",
    questions:"ta savol", questionOf:"Savol",
    back:"Orqaga", next:"Keyingi", finish:"Tugatish", explanation:"Izoh", explanationTitle:"To'g'ri javob izohi", noExplanation:"Bu savol uchun izoh qo'shilmagan.",
    greatResult:"Zo'r natija!", failed:"Muvaffaqiyatsiz",
    ticketDone:"yakunlandi", otherTicket:"Boshqa to'plam tanlash", goHome:"Bosh sahifaga qaytish",
    infiniteTest:"Cheksiz mashq", infiniteSub:"Barcha turdagi jumboqlar aralash holda keladi", startTest:"Mashqni boshlash",
    currentSeries:"Joriy seriya", bestSeries:"Eng yaxshi seriya", rightAnswer:"to'g'ri javob",
    lastResults:"So'nggi natijalar", byTopic:"Mavzular bo'yicha", hardQ:"Qiyin savollar",
    examTitle:"IQ test", examReady:"Mantiqiy fikrlashingizni o'lchang",
    examRules:"Test qoidalari",
    rule1:"20 ta savol: sonlar, naqshlar, so'zlar va mantiq", rule2:"Umumiy vaqt — 15 daqiqa",
    rule3:"Test davomida to'g'ri javoblar ko'rsatilmaydi",
    rule4:"Yakunda taxminiy IQ oralig'ingiz ko'rsatiladi",
    questionCount:"Savollar", time:"Vaqt", errorLimit:"Natija",
    startExam:"Testni boshlash", question:"Savol", errors:"Javob berildi",
    congrats:"Tabriklaymiz! 🎉", examPassed:"Test yakunlandi. Natijangiz tayyor.",
    examFailed:"Vaqt tugadi", tooManyErrors:"ta savolga javob berilmadi.",
    correct:"To'g'ri javob", wrong:"Noto'g'ri javob", result:"Natija",
    avgResult:"O'rtacha natija", examCount:"Topshirilgan testlar",
    passedExams:"Eng yuqori natija", failedExams:"Oxirgi natija",
    retryExam:"Qayta topshirish",
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
    proTitle:"IQuest PRO", proSubtitle:"Aqlingizni har kuni charxlang",
    proNoAds:"Reklama yo'q", proNoAdsSub:"Hech qanday reklama ko'rmaysiz",
    proUnlimited:"Cheksiz testlar", proUnlimitedSub:"Barcha to'plam va testlarga to'liq kirish",
    proStats:"Batafsil statistika", proStatsSub:"Kuchli va zaif tomonlaringizni biling",
    proMonthly:"Oylik obuna", proCancel:"Istalgan vaqt bekor qilish mumkin",
    proSubscribe:"Obuna bo'lish", proSecure:"To'lov xavfsiz va himoyalangan", proChoosePay:"To'lov usulini tanlang",
    proWeekly:"Haftalik", proMonth1:"1 oylik", proMonth2:"2 oylik",
    proPopular:"Mashhur", proBest:"Tejamli",
    exams:"IQ testlar", passed:"To'plamlar", notPassed:"Jumboqlar",
    darkMode:"Tungi rejim", lightMode:"Kunduzgi rejim",
    notifications:"Bildirishnomalar", notifEmpty:"Bildirishnomalar yo'q",
    notifAll:"Barchasi", notifUnread:"O'qilmagan",
    markAllRead:"Barchasini o'qilgan deb belgilash",
    notifSettings:"Bildirishnoma sozlamalari",
    notifDaily:"Kunlik eslatma", notifResult:"Natija haqida",
    notifNew:"Yangi to'plam", notifExam:"Test eslatmasi",
    notifPayment:"To'lov tasdiqlandi", paymentRejected:"To'lov rad etildi",
    notifOn:"Yoqilgan", notifOff:"O'chirilgan",
    justNow:"Hozir", minsAgo:"daqiqa oldin", hoursAgo:"soat oldin",
    savedQ:"Saqlanganlar", savedEmpty:"Hali saqlanganlar yo'q",
    savedSub:"Savollarni bookmark qilib saqlang",
    savedCount:"ta saqlangan savol", removeBookmark:"Olib tashlash",
    practiceAll:"Hammasini mashq qilish", ticket:"To'plam",
    bookmarkAdded:"Savol saqlandi!", bookmarkRemoved:"Savol o'chirildi",
    skip:"O'tkazib yuborish", getStarted:"Boshlash", continue:"Davom etish",
    ob1Title:"IQuest bilan aqlingizni sinang!",   ob1Sub:"Minglab mantiqiy jumboqlar orqali fikrlash qobiliyatingizni rivojlantiring.",
    ob2Title:"To'plam va mashqlar",           ob2Sub:"Har bir to'plamda 20 ta jumboq. Cheksiz mashq rejimida o'zingizni sinab ko'ring.",
    ob3Title:"IQ test",             ob3Sub:"15 daqiqalik testni topshiring va taxminiy IQ oralig'ingizni bilib oling.",
    ob4Title:"Natija va reyting",          ob4Sub:"O'sishingizni kuzating, reyting jadvalida o'z o'rningizni toping!",
    search:"Qidirish", searchPlaceholder:"To'plam, savol yoki bo'lim...",
    searchResults:"Natijalar", noResults:"Hech narsa topilmadi",
    filterAll:"Barchasi", filterTickets:"To'plamlar", filterQuestions:"Savollar",
    searchHint:"To'plam raqami yoki kalit so'z kiriting",
    topics:"Bo'limlar", topicsSub:"Jumboq turlari bo'yicha mashq",
    rules:"Qo'llanma", rulesSub:"Yechish strategiyalari",
    topicsTitle:"Bo'limlar bo'yicha mashq",
    rulesTitle:"Jumboq yechish qo'llanmasi",
    iqBand:"Taxminiy IQ oralig'i", iqPercentile:"Har 100 kishidan taxminan {p} nafaridan yuqori", iqProvisional:"Dastlabki me'yorlar", free:"Bepul", answered:"Javob berildi", strategies:"ta strategiya",
  },
  ru: {
    code:"ru", label:"Русский", flag:"🇷🇺",
    proNativeSoon:"Покупка Pro в приложении скоро появится.",
    keepPracticing:"Хорошая попытка!",
    services:"Сервисы", tipHint:"Попробуйте применить эту стратегию в следующей практике.", sectionsWord:"разделов",
    login:"Войти", register:"Регистрация", phone:"Номер телефона", password:"Пароль",
    confirmPass:"Подтвердите пароль", forgotPass:"Забыли пароль?",
    orWith:"или", googleLogin:"Войти через Google",
    noAccount:"Нет аккаунта?", haveAccount:"Уже есть аккаунт?",
    name:"Имя", surname:"Фамилия", createAccount:"Создайте аккаунт и начните обучение",
    hello:"Здравствуйте,", home:"Главная", todayResult:"Сегодняшний результат", allBtn:"Все →",
    active:"Активность", tests:"Тесты", rating:"Рейтинг",
    tickets:"Наборы", ticketsSub:"100 наборов", testsSub:"Без ограничений",
    exam:"IQ-тест", examSub:"Тест на 15 минут", stats:"Статистика", statsSub:"Ваши результаты",
    ratingSub:"Топ результаты", profile:"Профиль", profileSub:"Настройки",
    todayGoal:"Цель на сегодня", lastActivity:"Последняя активность",
    allTickets:"Доступно 100 наборов", bookmarked:"Сохранённые",
    allTab:"Все", done:"Завершённые", undone:"Незавершённые",
    questions:"вопросов", questionOf:"Вопрос",
    back:"Назад", next:"Далее", finish:"Завершить", explanation:"Пояснение", explanationTitle:"Пояснение к правильному ответу", noExplanation:"Пояснение не добавлено.",
    greatResult:"Отличный результат!", failed:"Не сдано",
    ticketDone:"завершён", otherTicket:"Выбрать другой набор", goHome:"На главную",
    infiniteTest:"Бесконечная практика", infiniteSub:"Задачи всех типов в случайном порядке", startTest:"Начать практику",
    currentSeries:"Текущая серия", bestSeries:"Лучшая серия", rightAnswer:"правильных",
    lastResults:"Последние результаты", byTopic:"По темам", hardQ:"Сложные вопросы",
    examTitle:"IQ-тест", examReady:"Измерьте своё логическое мышление",
    examRules:"Правила теста",
    rule1:"20 вопросов: числа, закономерности, слова и логика", rule2:"Общее время — 15 минут",
    rule3:"Во время теста правильные ответы не показываются",
    rule4:"В конце показывается примерный диапазон IQ",
    questionCount:"Вопросы", time:"Время", errorLimit:"Результат",
    startExam:"Начать тест", question:"Вопрос", errors:"Отвечено",
    congrats:"Поздравляем! 🎉", examPassed:"Тест завершён. Ваш результат готов.",
    examFailed:"Время вышло", tooManyErrors:"вопросов без ответа.",
    correct:"Правильных", wrong:"Неправильных", result:"Результат",
    avgResult:"Средний результат", examCount:"Пройдено тестов",
    passedExams:"Лучший результат", failedExams:"Последний результат",
    retryExam:"Пройти снова",
    statistics:"Статистика", general:"Общий", weekly:"Недельный", monthly:"Месячный", yearly:"Годовой",
    totalQ:"Всего вопросов", correctA:"Правильных ответов", wrongA:"Неправильных ответов", correctPct:"Процент правильных",
    resultsGraph:"График результатов",
    ratingTitle:"Рейтинг", daily:"Ежедневный",
    certs:"Мои сертификаты", settings:"Настройки", lang:"Язык", about:"О нас", news:"Новости", logout:"Выйти",
    pro:"Pro подписка", support:"Поддержка", share:"Поделиться",
    proTitle:"IQuest PRO", proSubtitle:"Тренируйте ум каждый день",
    proNoAds:"Без рекламы", proNoAdsSub:"Никакой рекламы",
    proUnlimited:"Безлимитные тесты", proUnlimitedSub:"Полный доступ ко всем наборам и тестам",
    proStats:"Подробная статистика", proStatsSub:"Узнайте свои сильные и слабые стороны",
    proMonthly:"Ежемесячная подписка", proCancel:"Отмена в любое время",
    proSubscribe:"Подписаться", proSecure:"Безопасная оплата", proChoosePay:"Выберите способ оплаты",
    proWeekly:"Недельный", proMonth1:"1 месяц", proMonth2:"2 месяца",
    proPopular:"Популярный", proBest:"Выгодный",
    exams:"IQ-тесты", passed:"Наборы", notPassed:"Задачи",
    darkMode:"Тёмный режим", lightMode:"Светлый режим",
    notifications:"Уведомления", notifEmpty:"Нет уведомлений",
    notifAll:"Все", notifUnread:"Непрочитанные",
    markAllRead:"Отметить все прочитанными",
    notifSettings:"Настройки уведомлений",
    notifDaily:"Ежедневное напоминание", notifResult:"О результатах",
    notifNew:"Новый набор", notifExam:"Напоминание о тесте",
    notifPayment:"Оплата подтверждена", paymentRejected:"Оплата отклонена", referral:"Рефералы",
    notifOn:"Включено", notifOff:"Выключено",
    justNow:"Только что", minsAgo:"мин. назад", hoursAgo:"ч. назад",
    savedQ:"Сохранённые", savedEmpty:"Нет сохранённых вопросов",
    savedSub:"Сохраняйте вопросы с помощью закладок",
    savedCount:"сохранённых вопросов", removeBookmark:"Удалить",
    practiceAll:"Практиковать все", ticket:"Набор",
    bookmarkAdded:"Вопрос сохранён!", bookmarkRemoved:"Вопрос удалён",
    skip:"Пропустить", getStarted:"Начать", continue:"Продолжить",
    ob1Title:"Проверьте свой ум с IQuest!",        ob1Sub:"Развивайте мышление с помощью тысяч логических задач.",
    ob2Title:"Наборы и практика",             ob2Sub:"20 задач в каждом наборе. Проверьте себя в режиме бесконечной практики.",
    ob3Title:"IQ-тест",             ob3Sub:"Пройдите 15-минутный тест и узнайте свой примерный диапазон IQ.",
    ob4Title:"Результаты и рейтинг",       ob4Sub:"Следите за своим ростом и найдите своё место в таблице лидеров!",
    search:"Поиск", searchPlaceholder:"Набор, вопрос или раздел...",
    searchResults:"Результаты", noResults:"Ничего не найдено",
    filterAll:"Все", filterTickets:"Наборы", filterQuestions:"Вопросы",
    searchHint:"Введите номер набора или ключевое слово",
    topics:"Разделы", topicsSub:"Практика по типам задач",
    rules:"Руководство", rulesSub:"Стратегии решения",
    topicsTitle:"Практика по разделам",
    rulesTitle:"Как решать задачи",
    iqBand:"Примерный диапазон IQ", iqPercentile:"Выше, чем примерно у {p} из 100 человек", iqProvisional:"Предварительные нормы", free:"Бесплатно", answered:"Отвечено", strategies:"стратегий",
  },
  kril: {
    code:"kril", label:"Ўзбекча", flag:"🇺🇿",
    proNativeSoon:"Pro обунани илова ичида сотиб олиш тез орада қўшилади.",
    keepPracticing:"Яхши уриниш!",
    services:"Хизматлар", tipHint:"Бу стратегияни кейинги машқда қўллаб кўринг.", sectionsWord:"бўлим",
    login:"Кириш", register:"Рўйхатдан ўтиш", phone:"Телефон рақам", password:"Парол",
    confirmPass:"Паролни тасдиқланг", forgotPass:"Паролни унутдингизми?",
    orWith:"ёки", googleLogin:"Google орқали кириш",
    noAccount:"Ҳисобингиз йўқми?", haveAccount:"Ҳисобингиз борми?",
    name:"Исм", surname:"Фамилия", createAccount:"Ҳисоб яратинг ва ўрганишни бошланг",
    hello:"Ассалому алайкум,", home:"Бош саҳифа", todayResult:"Бугунги натижа", allBtn:"Барчаси →",
    active:"Фаоллар", tests:"Тестлар", rating:"Рейтинг",
    tickets:"Тўпламлар", ticketsSub:"100 та тўплам", testsSub:"Чексиз жумбоқ",
    exam:"IQ тест", examSub:"15 дақиқалик тест", stats:"Статистика", statsSub:"Натижаларингиз",
    ratingSub:"Топ Натижалар", profile:"Профил", profileSub:"Созламалар",
    todayGoal:"Бугунги мақсад", lastActivity:"Охирги фаолият",
    allTickets:"100 та тўплам мавжуд", bookmarked:"Сақланган",
    allTab:"Барчаси", done:"Якунланган", undone:"Якунланмаган",
    questions:"та савол", questionOf:"Савол",
    back:"Орқага", next:"Кейинги", finish:"Тугатиш", explanation:"Изоҳ", explanationTitle:"Тўғри жавоб изоҳи", noExplanation:"Бу савол учун изоҳ қўшилмаган.",
    greatResult:"Зўр натижа!", failed:"Муваффақиятсиз",
    ticketDone:"якунланди", otherTicket:"Бошқа тўплам танлаш", goHome:"Бош саҳифага қайтиш",
    infiniteTest:"Чексиз машқ", infiniteSub:"Барча турдаги жумбоқлар аралаш ҳолда келади", startTest:"Машқни бошлаш",
    currentSeries:"Жорий серия", bestSeries:"Энг яхши серия", rightAnswer:"тўғри жавоб",
    lastResults:"Сўнгги натижалар", byTopic:"Мавзулар бўйича", hardQ:"Қийин саволлар",
    examTitle:"IQ тест", examReady:"Мантиқий фикрлашингизни ўлчанг",
    examRules:"Тест қоидалари",
    rule1:"20 та савол: сонлар, нақшлар, сўзлар ва мантиқ", rule2:"Умумий вақт — 15 дақиқа",
    rule3:"Тест давомида тўғри жавоблар кўрсатилмайди",
    rule4:"Якунда тахминий IQ оралиғингиз кўрсатилади",
    questionCount:"Саволлар", time:"Вақт", errorLimit:"Натижа",
    startExam:"Тестни бошлаш", question:"Савол", errors:"Жавоб берилди",
    congrats:"Табрикlaймиз! 🎉", examPassed:"Тест якунланди. Натижангиз тайёр.",
    examFailed:"Вақт тугади", tooManyErrors:"та саволга жавоб берилмади.",
    correct:"Тўғри жавоб", wrong:"Нотўғри жавоб", result:"Натижа",
    avgResult:"Ўртача натижа", examCount:"Топширилган тестлар",
    passedExams:"Энг юқори натижа", failedExams:"Охирги натижа",
    retryExam:"Қайта топшириш",
    statistics:"Статистика", general:"Умумий", weekly:"Ҳафталик", monthly:"Ойлик", yearly:"Йиллик",
    totalQ:"Жами саволлар", correctA:"Тўғри жавоблар", wrongA:"Нотўғри жавоблар", correctPct:"Тўғри фоизи",
    resultsGraph:"Натижалар графиги",
    ratingTitle:"Рейтинг", daily:"Кунлик",
    certs:"Сертификатларим", settings:"Созламалар", lang:"Тил", about:"Биз ҳақимизда", news:"Янгиликлар", logout:"Чиқиш",
    pro:"Pro обуна", support:"Қўллаб-қувватлаш", share:"Улашиш",
    proTitle:"IQuest PRO", proSubtitle:"Ақлингизни ҳар куни чархланг",
    proNoAds:"Реклама йўқ", proNoAdsSub:"Ҳеч қандай реклама кўрмайсиз",
    proUnlimited:"Чексиз тестлар", proUnlimitedSub:"Барча тўплам ва тестларга тўлиқ кириш",
    proStats:"Батафсил статистика", proStatsSub:"Кучли ва заиф томонларингизни билинг",
    proMonthly:"Ойлик обуна", proCancel:"Истаган вақт бекор қилиш мумкин",
    proSubscribe:"Обуна бўлиш", proSecure:"Тўлов хавфсиз ва ҳимояланган", proChoosePay:"Тўлов усулини танланг",
    proWeekly:"Ҳафталик", proMonth1:"1 ойлик", proMonth2:"2 ойлик",
    proPopular:"Машҳур", proBest:"Тежамли",
    exams:"IQ тестлар", passed:"Тўпламлар", notPassed:"Жумбоқлар",
    darkMode:"Тунги режим", lightMode:"Кундузги режим",
    notifications:"Билдиришномалар", notifEmpty:"Билдиришномалар йўқ",
    notifAll:"Барчаси", notifUnread:"Ўқилмаган",
    markAllRead:"Барчасини ўқилган деб белгилаш",
    notifSettings:"Билдиришнома созламалари",
    notifDaily:"Кунлик эслатма", notifResult:"Натижа ҳақида",
    notifNew:"Янги тўплам", notifExam:"Тест эслатмаси",
    notifPayment:"Тўлов тасдиқланди", paymentRejected:"Тўлов рад этилди", referral:"Реферал",
    notifOn:"Ёқилган", notifOff:"Ўчирилган",
    justNow:"Ҳозир", minsAgo:"дақиқа олдин", hoursAgo:"соат олдин",
    savedQ:"Сақланганлар", savedEmpty:"Ҳали сақланган савол йўқ",
    savedSub:"Саволларни bookmark қилиб сақланг",
    savedCount:"та сақланган савол", removeBookmark:"Олиб ташлаш",
    practiceAll:"Ҳамасини машқ қилиш", ticket:"Тўплам",
    bookmarkAdded:"Савол сақланди!", bookmarkRemoved:"Савол ўчирилди",
    skip:"Ўтказиб юбориш", getStarted:"Бошлаш", continue:"Давом этиш",
    ob1Title:"IQuest билан ақлингизни синанг!",   ob1Sub:"Минглаб мантиқий жумбоқлар орқали фикрлаш қобилиятингизни ривожлантиринг.",
    ob2Title:"Тўплам ва машқлар",           ob2Sub:"Ҳар бир тўпламда 20 та жумбоқ. Чексиз машқ режимида ўзингизни синаб кўринг.",
    ob3Title:"IQ тест",             ob3Sub:"15 дақиқалик тестни топширинг ва тахминий IQ оралиғингизни билиб олинг.",
    ob4Title:"Натижа ва рейтинг",          ob4Sub:"Ўсишингизни кузатинг, рейтинг жадвалида ўз ўрнингизни топинг!",
    search:"Қидириш", searchPlaceholder:"Тўплам, савол ёки бўлим...",
    searchResults:"Натижалар", noResults:"Ҳеч нарса топилмади",
    filterAll:"Барчаси", filterTickets:"Тўпламлар", filterQuestions:"Саволлар",
    searchHint:"Тўплам рақами ёки калит сўз киритинг",
    topics:"Бўлимлар", topicsSub:"Жумбоқ турлари бўйича машқ",
    rules:"Қўлланма", rulesSub:"Ечиш стратегиялари",
    topicsTitle:"Бўлимлар бўйича машқ",
    rulesTitle:"Жумбоқ ечиш қўлланмаси",
    iqBand:"Тахминий IQ оралиғи", iqPercentile:"Ҳар 100 кишидан тахминан {p} нафаридан юқори", iqProvisional:"Дастлабки меъёрлар", free:"Бепул", answered:"Жавоб берилди", strategies:"та стратегия",
  }
};

// ─── THEMES ───
function getTheme(dark) {
  // IQuest "Siyoh" mavzusi — DESIGN.md §3 qiymatlari
  return dark ? {
    primary:"#9C90FF", primaryDark:"#B3A9FF",
    success:"#5FD3A6", danger:"#FF8A8F", warning:"#F2C46B",
    bg:"#121120", white:"#1B1A2B", card:"#1B1A2B", cardBorder:"#34324A",
    gray100:"#242338", gray200:"#34324A", gray300:"#45425E",
    gray400:"#7A7696", gray600:"#A4A1BA", gray800:"#F1F0FA",
    text:"#F1F0FA", subtext:"#A4A1BA", muted:"#7A7696",
    navBg:"#1B1A2B", inputBg:"#121120",
    gradStart:"#26224A", gradEnd:"#6B5CF0",
    primary_light:"#9C90FF22",
  } : {
    primary:"#4F3FD0", primaryDark:"#3F31B0",
    success:"#077350", danger:"#B42F35", warning:"#8A5A00",
    bg:"#F5F4FB", white:"#FFFFFF", card:"#FFFFFF", cardBorder:"transparent",
    gray100:"#EEECF7", gray200:"#DEDBEA", gray300:"#CFCBE0",
    gray400:"#7F7B96", gray600:"#5E5B72", gray800:"#1D1B2E",
    text:"#1D1B2E", subtext:"#5E5B72", muted:"#7F7B96",
    navBg:"#FFFFFF", inputBg:"#F5F4FB",
    gradStart:"#4F3FD0", gradEnd:"#6B5CF0",
    primary_light:"#4F3FD018",
  };
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
  Brain: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M9.5 3A2.5 2.5 0 0 0 7 5.5v.1A3 3 0 0 0 4.5 10a3 3 0 0 0 .6 4.9A3 3 0 0 0 9 19.5a2.5 2.5 0 0 0 3 .4V4.1A2.5 2.5 0 0 0 9.5 3zM14.5 3A2.5 2.5 0 0 1 17 5.5v.1a3 3 0 0 1 2.5 4.4 3 3 0 0 1-.6 4.9 3 3 0 0 1-3.9 4.6 2.5 2.5 0 0 1-3-.4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Hash: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Grid: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="2" strokeDasharray="3 2"/></svg>,
  Words: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M4 7V5h16v2M9 19h6M12 5v14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Logic: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="6" cy="6" r="2.5" stroke={color} strokeWidth="2"/><circle cx="6" cy="18" r="2.5" stroke={color} strokeWidth="2"/><circle cx="18" cy="12" r="2.5" stroke={color} strokeWidth="2"/><path d="M8.5 6h2a3 3 0 0 1 3 3v0a3 3 0 0 0 2 2.8M8.5 18h2a3 3 0 0 0 3-3v0a3 3 0 0 1 2-2.8" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Cube: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" stroke={color} strokeWidth="2" strokeLinejoin="round"/><path d="M3 7l9 5 9-5M12 12v10" stroke={color} strokeWidth="2" strokeLinejoin="round"/></svg>,
  Target: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/><circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2"/><circle cx="12" cy="12" r="1.5" fill={color}/></svg>,
  Zap: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke={color} strokeWidth="2" strokeLinejoin="round"/></svg>,
  Lightbulb: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
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
// IQuest backend manzili .env orqali beriladi (VITE_API_URL). Bo'sh bo'lsa — offline rejim.
const API_URL = import.meta.env.VITE_API_URL || "";

// API helper funksiyalar — xato bo'lsa Error (err.status, err.code = backend `error` kodi)
async function apiRequest(method, endpoint, data, token, isForm = false) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (data !== undefined && !isForm) headers['Content-Type'] = 'application/json';
  const res = await fetch(API_URL + endpoint, {
    method, headers,
    body: data === undefined ? undefined : isForm ? data : JSON.stringify(data),
  });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch { json = null; }
  if (!res.ok) {
    const err = new Error(json?.message || json?.error || text || `HTTP ${res.status}`);
    err.status = res.status; err.code = json?.error;
    throw err;
  }
  return json;
}
const apiGet    = (endpoint, token)       => apiRequest('GET', endpoint, undefined, token);
const apiPost   = (endpoint, data, token) => apiRequest('POST', endpoint, data ?? {}, token);
const apiPut    = (endpoint, data, token) => apiRequest('PUT', endpoint, data ?? {}, token);
const apiPatch  = (endpoint, data, token) => apiRequest('PATCH', endpoint, data ?? {}, token);
const apiDelete = (endpoint, token)       => apiRequest('DELETE', endpoint, undefined, token);
// multipart (FormData) yuklash — Content-Type ni brauzer o'zi qo'yadi (boundary bilan)
const apiUpload = (endpoint, formData, token) => apiRequest('POST', endpoint, formData, token, true);

// Token bilan bog'langan API obyekt. Offline (API_URL yo'q yoki token yo'q) bo'lsa — null.
// Ekranlar: `api ? real ma'lumot : mock` — shu bilan offline (demo) rejim buzilmaydi.
function makeApi(token) {
  if (!API_URL || !token) return null;
  return {
    get:    (e)    => apiGet(e, token),
    post:   (e, d) => apiPost(e, d, token),
    put:    (e, d) => apiPut(e, d, token),
    patch:  (e, d) => apiPatch(e, d, token),
    del:    (e)    => apiDelete(e, token),
    upload: (e, f) => apiUpload(e, f, token),
  };
}

// Backend user DTO → frontend user obyekti (mavjud maydonlar saqlanadi)
function mapApiUser(u, prev = {}) {
  if (!u) return prev;
  return {
    ...prev,
    id: u.id,
    tgId: u.tgId,
    name: u.firstName || prev.name,
    surname: u.lastName ?? prev.surname,
    phone: u.phone ?? prev.phone ?? "",
    username: u.username || prev.username,
    photo: u.photoUrl || prev.photo || null,
    isPro: !!u.isPro,
    proExpiresAt: u.proExpiresAt,
    referralCode: u.referralCode,
    xp: u.xp,
  };
}

// Backend sozlamalari (toPublicSettings shakli) → LIMITS / DISCOUNT / REFERRAL_CONFIG
function applyApiSettings(s) {
  if (!s) return;
  if (s.daily_test_limit) LIMITS.dailyTestLimit = s.daily_test_limit.value;
  if (s.free_exam_count) LIMITS.freeExamCount = s.free_exam_count.value;
  if (s.free_ticket_count) LIMITS.freeTicketCount = s.free_ticket_count.value;
  if (s.discount) Object.assign(DISCOUNT, s.discount);
  if (Array.isArray(s.referral_milestones) && s.referral_milestones.length) {
    REFERRAL_CONFIG.milestones = s.referral_milestones.map(m => ({ count: m.count, days: m.days, label: proDaysLabel(m.days) }));
  }
}
function proDaysLabel(days) {
  return days === 7 ? "Haftalik Pro" : days === 30 ? "1 oylik Pro" : days === 60 ? "2 oylik Pro" : `${days} kunlik Pro`;
}

// ─── APP KONFIGURATSIYASI (admin tomonidan boshqariladi) ───
const APP_CONFIG = {
  supportUsername: "iquest_support",    // Telegram support username (@siz)
  newsChannel: "iquest_uz",             // Telegram kanal username
  botUsername: "iquest_bot",            // Telegram bot username
  aboutText: {
    uz: "IQuest — mantiqiy fikrlashni o'lchash va rivojlantirish ilovasi. Sonlar, naqshlar, so'zlar va fazoviy tasavvur bo'yicha jumboqlar, mashq to'plamlari va 15 daqiqalik IQ test.",
    ru: "IQuest — приложение для измерения и развития логического мышления. Задачи на числа, закономерности, слова и пространственное мышление, наборы для практики и 15-минутный IQ-тест.",
    kril: "IQuest — мантиқий фикрлашни ўлчаш ва ривожлантириш иловаси. Сонлар, нақшлар, сўзлар ва фазовий тасаввур бўйича жумбоқлар, машқ тўпламлари ва 15 дақиқалик IQ тест.",
  },
  version: "1.0.0",
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
  return ("IQ" + String(base).slice(-4).toUpperCase() + Math.floor(1000 + (base%9000||1234))).slice(0,10);
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

// ─── IQ JUMBOQLAR BANKI ───
// cat: numbers | pattern | logic | verbal | spatial (TOPICS_DATA bilan bir xil kalitlar)
// opts: bitta massiv (tildan mustaqil) yoki {uz,ru,kril}; fig: FigureSVG turi
const IQ_ITEMS = [
  { cat:"numbers", correct:0, opts:["32","24","20","18"],
    q:{uz:"Qatorni davom ettiring: 2, 4, 8, 16, ?",ru:"Продолжите ряд: 2, 4, 8, 16, ?",kril:"Қаторни давом эттиринг: 2, 4, 8, 16, ?"},
    ex:{uz:"Har bir son oldingisidan 2 barobar katta: 16 × 2 = 32.",ru:"Каждое число вдвое больше предыдущего: 16 × 2 = 32.",kril:"Ҳар бир сон олдингисидан 2 баробар катта: 16 × 2 = 32."} },
  { cat:"numbers", correct:1, opts:["36","38","35","40"],
    q:{uz:"Qatorni davom ettiring: 3, 6, 11, 18, 27, ?",ru:"Продолжите ряд: 3, 6, 11, 18, 27, ?",kril:"Қаторни давом эттиринг: 3, 6, 11, 18, 27, ?"},
    ex:{uz:"Farqlar toq sonlar: +3, +5, +7, +9, keyingisi +11 → 38.",ru:"Разности — нечётные числа: +3, +5, +7, +9, далее +11 → 38.",kril:"Фарқлар тоқ сонлар: +3, +5, +7, +9, кейингиси +11 → 38."} },
  { cat:"verbal", correct:2, opts:{uz:["Olma","Nok","Sabzi","Olcha"],ru:["Яблоко","Груша","Морковь","Вишня"],kril:["Олма","Нок","Сабзи","Олча"]},
    q:{uz:"Qaysi so'z ortiqcha?",ru:"Какое слово лишнее?",kril:"Қайси сўз ортиқча?"},
    ex:{uz:"Sabzi — sabzavot, qolganlari mevalar.",ru:"Морковь — овощ, остальные — фрукты.",kril:"Сабзи — сабзавот, қолганлари мевалар."} },
  { cat:"verbal", correct:1, opts:{uz:["Oshxona","Ovqatlanish","Likopcha","Pishirish"],ru:["Кухня","Еда","Тарелка","Готовка"],kril:["Ошхона","Овқатланиш","Ликопча","Пишириш"]},
    q:{uz:"Kitob : o'qish = Qoshiq : ?",ru:"Книга : чтение = Ложка : ?",kril:"Китоб : ўқиш = Қошиқ : ?"},
    ex:{uz:"Kitob o'qish uchun, qoshiq esa ovqatlanish uchun ishlatiladi.",ru:"Книга нужна для чтения, ложка — для еды.",kril:"Китоб ўқиш учун, қошиқ эса овқатланиш учун ишлатилади."} },
  { cat:"pattern", correct:0, fig:"dots", opts:["5","4","6","3"],
    q:{uz:"Rasmdagi qonuniyatni toping: \"?\" o'rnida nechta nuqta bo'lishi kerak?",ru:"Найдите закономерность: сколько точек должно быть вместо «?»",kril:"Расмдаги қонуниятни топинг: «?» ўрнида нечта нуқта бўлиши керак?"},
    ex:{uz:"Har qatorda nuqtalar soni chapdan o'ngga 1 taga oshadi: 3, 4, 5.",ru:"В каждой строке число точек растёт на 1 слева направо: 3, 4, 5.",kril:"Ҳар қаторда нуқталар сони чапдан ўнгга 1 тага ошади: 3, 4, 5."} },
  { cat:"numbers", correct:1, opts:["11","13","12","15"],
    q:{uz:"Qatorni davom ettiring: 1, 1, 2, 3, 5, 8, ?",ru:"Продолжите ряд: 1, 1, 2, 3, 5, 8, ?",kril:"Қаторни давом эттиринг: 1, 1, 2, 3, 5, 8, ?"},
    ex:{uz:"Har bir son oldingi ikkitasining yig'indisi: 5 + 8 = 13.",ru:"Каждое число — сумма двух предыдущих: 5 + 8 = 13.",kril:"Ҳар бир сон олдинги иккитасининг йиғиндиси: 5 + 8 = 13."} },
  { cat:"logic", correct:1,
    opts:{uz:["Barcha mushuklar oq","Ba'zi mushuklar oq bo'lishi mumkin","Hech bir mushuk oq emas","Barcha oq narsalar mushuk"],ru:["Все кошки белые","Некоторые кошки могут быть белыми","Ни одна кошка не белая","Всё белое — кошки"],kril:["Барча мушуклар оқ","Баъзи мушуклар оқ бўлиши мумкин","Ҳеч бир мушук оқ эмас","Барча оқ нарсалар мушук"]},
    q:{uz:"Barcha mushuklar — hayvon. Ba'zi hayvonlar oq. Qaysi xulosa to'g'ri?",ru:"Все кошки — животные. Некоторые животные белые. Какой вывод верен?",kril:"Барча мушуклар — ҳайвон. Баъзи ҳайвонлар оқ. Қайси хулоса тўғри?"},
    ex:{uz:"Aniq xulosa chiqarib bo'lmaydi, faqat imkoniyat bor: ba'zi mushuklar oq bo'lishi mumkin.",ru:"Точного вывода нет, есть лишь возможность: некоторые кошки могут быть белыми.",kril:"Аниқ хулоса чиқариб бўлмайди, фақат имконият бор: баъзи мушуклар оқ бўлиши мумкин."} },
  { cat:"spatial", correct:0, fig:"shapes", opts:{uz:["Oltiburchak","Doira","Uchburchak","Kvadrat"],ru:["Шестиугольник","Круг","Треугольник","Квадрат"],kril:["Олтибурчак","Доира","Учбурчак","Квадрат"]},
    q:{uz:"Ketma-ketlikda keyingi shakl qaysi?",ru:"Какая фигура следующая в последовательности?",kril:"Кетма-кетликда кейинги шакл қайси?"},
    ex:{uz:"Har bir shaklda burchaklar soni 1 taga oshadi: 3, 4, 5 → 6.",ru:"У каждой следующей фигуры на 1 угол больше: 3, 4, 5 → 6.",kril:"Ҳар бир шаклда бурчаклар сони 1 тага ошади: 3, 4, 5 → 6."} },
  { cat:"spatial", correct:0, opts:["90°","60°","120°","45°"],
    q:{uz:"Soat 3:00 da soat va daqiqa strelkalari orasidagi burchak necha gradus?",ru:"Какой угол между часовой и минутной стрелками в 3:00?",kril:"Соат 3:00 да соат ва дақиқа стрелкалари орасидаги бурчак неча градус?"},
    ex:{uz:"Siferblat 12 bo'lakka bo'lingan, har biri 30°. 3 bo'lak = 90°.",ru:"Циферблат разделён на 12 частей по 30°. 3 части = 90°.",kril:"Циферблат 12 бўлакка бўлинган, ҳар бири 30°. 3 бўлак = 90°."} },
  { cat:"logic", correct:2, opts:["100","20","5","1"],
    q:{uz:"5 ta mashina 5 ta detalni 5 daqiqada yasaydi. 100 ta mashina 100 ta detalni necha daqiqada yasaydi?",ru:"5 станков делают 5 деталей за 5 минут. За сколько минут 100 станков сделают 100 деталей?",kril:"5 та машина 5 та детални 5 дақиқада ясайди. 100 та машина 100 та детални неча дақиқада ясайди?"},
    ex:{uz:"Bitta mashina bitta detalni 5 daqiqada yasaydi, shuning uchun javob ham 5 daqiqa.",ru:"Один станок делает одну деталь за 5 минут, поэтому ответ — тоже 5 минут.",kril:"Битта машина битта детални 5 дақиқада ясайди, шунинг учун жавоб ҳам 5 дақиқа."} },
  { cat:"spatial", correct:3, opts:{uz:["Uchburchak","Kvadrat","Doira","Kub"],ru:["Треугольник","Квадрат","Круг","Куб"],kril:["Учбурчак","Квадрат","Доира","Куб"]},
    q:{uz:"Qaysi biri boshqalariga mos kelmaydi?",ru:"Что не подходит к остальным?",kril:"Қайси бири бошқаларига мос келмайди?"},
    ex:{uz:"Kub — uch o'lchamli jism, qolganlari tekis shakllar.",ru:"Куб — объёмное тело, остальные — плоские фигуры.",kril:"Куб — уч ўлчамли жисм, қолганлари текис шакллар."} },
  { cat:"pattern", correct:0, opts:["O","N","M","P"],
    q:{uz:"Harflar qatorini davom ettiring: A, C, F, J, ?",ru:"Продолжите ряд букв: A, C, F, J, ?",kril:"Ҳарфлар қаторини давом эттиринг: A, C, F, J, ?"},
    ex:{uz:"Oraliqlar 1 taga oshadi: +2, +3, +4, keyingisi +5 → O.",ru:"Шаг растёт на 1: +2, +3, +4, далее +5 → O.",kril:"Оралиқлар 1 тага ошади: +2, +3, +4, кейингиси +5 → O."} },
];

// To'plamlar: 1-10 bepul, 11-100 Pro. Har to'plamda 20 ta jumboq.
// question/options/sign — IQ_ITEMS indeksi (sign: rasm bo'lsa indeks, aks holda null)
const tickets = Array.from({length:100},(_,i)=>({
  id:i+1,
  isPro: i >= 10,  // 11-dan boshlab Pro
  questions:Array.from({length:20},(_,j)=>{
    const k=(i*5+j)%IQ_ITEMS.length, it=IQ_ITEMS[k];
    return { id:j+1, question:k, sign:it.fig?k:null, options:k, correct:it.correct, explanation:it.ex };
  })
}));

// Jumboq rasmi (matritsa yoki shakllar ketma-ketligi)
function SignSVG({item}) {
  const it=IQ_ITEMS[item]; if(!it?.fig) return null;
  const ink="#1D1B2E", acc="#4F3FD0";
  if(it.fig==="dots"){
    const cells=[[1,2,3],[2,3,4],[3,4,null]];
    return <svg width="180" height="180" viewBox="0 0 180 180">
      {cells.map((row,r)=>row.map((n,c)=>{
        const x=c*60+4,y=r*60+4;
        return <g key={`${r}-${c}`}>
          <rect x={x} y={y} width="52" height="52" rx="10" fill={n===null?"#F1EFFD":"white"} stroke={n===null?acc:"#DEDBEA"} strokeWidth="2" strokeDasharray={n===null?"5,4":"0"}/>
          {n===null
            ? <text x={x+26} y={y+35} textAnchor="middle" fontSize="24" fontWeight="800" fill={acc}>?</text>
            : Array.from({length:n},(_,d)=><circle key={d} cx={x+10+(d%3)*16} cy={y+14+Math.floor(d/3)*16} r="5" fill={ink}/>)}
        </g>;
      }))}
    </svg>;
  }
  // shapes: uchburchak, kvadrat, beshburchak, ?
  const poly=(n,cx,cy,r)=>Array.from({length:n},(_,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;}).join(" ");
  return <svg width="240" height="70" viewBox="0 0 240 70">
    {[3,4,5].map((n,i)=><polygon key={n} points={poly(n,30+i*60,36,24)} fill="white" stroke={ink} strokeWidth="2.5" strokeLinejoin="round"/>)}
    <rect x="186" y="10" width="48" height="52" rx="10" fill="#F1EFFD" stroke={acc} strokeWidth="2" strokeDasharray="5,4"/>
    <text x="210" y="45" textAnchor="middle" fontSize="24" fontWeight="800" fill={acc}>?</text>
  </svg>;
}

function getQ(q,lang) {
  const it=IQ_ITEMS[(q??0)%IQ_ITEMS.length];
  return it.q[lang]||it.q.uz;
}
function getOpts(q,lang) {
  const it=IQ_ITEMS[(q??0)%IQ_ITEMS.length];
  return Array.isArray(it.opts)?it.opts:(it.opts[lang]||it.opts.uz);
}

const LEADERBOARD_DEMO=[{rank:1,name:"Jasur",xp:1850,av:"J"},{rank:2,name:"Alisher",xp:2460,av:"A",me:true},{rank:3,name:"Sardor",xp:1750,av:"S"},{rank:4,name:"Behzod",xp:1640,av:"B"},{rank:5,name:"Sanjar",xp:1500,av:"SA"},{rank:6,name:"Bobur",xp:1400,av:"BO"}];

// ─── UI COMPONENTS ───
function BottomNav({screen,setScreen,T,C}) {
  const tabs=[{id:"home",lk:"home",Icon:IC.Home},{id:"tickets",lk:"tickets",Icon:IC.Grid},{id:"tests",lk:"tests",Icon:IC.Clipboard},{id:"exam",lk:"exam",Icon:IC.Brain},{id:"profile",lk:"profile",Icon:IC.User}];
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
    accent:"#4F3FD0",
    gradA:"#4F3FD0", gradB:"#6366F1",
    illustration:(
      <svg viewBox="0 0 280 220" width="280" height="220">
        {/* 3x3 jumboq matritsasi */}
        {[0,1,2].map(r=>[0,1,2].map(c=>{
          const x=77+c*44,y=38+r*44,last=r===2&&c===2;
          return <g key={`${r}${c}`}>
            <rect x={x} y={y} width="38" height="38" rx="10" fill={last?"rgba(255,255,255,0.15)":"white"} stroke={last?"white":"none"} strokeWidth="2" strokeDasharray={last?"5,4":"0"} opacity={last?1:0.95}/>
            {last
              ? <text x={x+19} y={y+26} textAnchor="middle" fontSize="20" fontWeight="900" fill="white">?</text>
              : [<circle key="a" cx={x+19} cy={y+19} r={5+((r+c)%3)*3} fill="#4F3FD0" opacity={0.35+0.2*r}/>]}
          </g>;
        }))}
        {/* Q logo badge */}
        <circle cx="222" cy="176" r="24" fill="white"/>
        <text x="222" y="185" textAnchor="middle" fontSize="24" fontWeight="900" fill="#4F3FD0" fontFamily="serif">Q</text>
        {/* Sparkles */}
        <circle cx="40" cy="55" r="5" fill="rgba(255,255,255,0.5)"/>
        <circle cx="240" cy="40" r="3" fill="rgba(255,255,255,0.4)"/>
        <circle cx="260" cy="75" r="4" fill="rgba(255,255,255,0.3)"/>
        <circle cx="30" cy="150" r="3" fill="rgba(255,255,255,0.35)"/>
        <circle cx="50" cy="185" r="16" fill="rgba(255,255,255,0.08)"/>
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
        <text x="55" y="190" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">20 ?</text>
        <rect x="200" y="175" width="50" height="22" rx="11" fill="rgba(255,255,255,0.3)"/>
        <text x="225" y="190" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">15:00</text>
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
          <div style={{position:"absolute",top:-60,left:-60,width:220,height:220,borderRadius:"50%",background:"rgba(79,63,208,0.12)"}}/>
          <div style={{position:"absolute",top:-30,left:-30,width:140,height:140,borderRadius:"50%",background:"rgba(79,63,208,0.1)"}}/>
          <div style={{position:"absolute",top:40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(99,102,241,0.1)"}}/>
          {/* N Logo */}
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:80,height:80,borderRadius:24,background:"linear-gradient(135deg,#4F3FD0,#6366F1)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 40px rgba(79,63,208,0.5)"}}>
            <span style={{color:"white",fontSize:44,fontWeight:900,fontFamily:"serif",lineHeight:1}}>Q</span>
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
                    background:active?"rgba(79,63,208,0.15)":"rgba(255,255,255,0.05)",
                    border:`2px solid ${active?"#4F3FD0":"rgba(255,255,255,0.08)"}`,
                    transition:"all 0.2s"
                  }}>
                  {/* Left color bar */}
                  <div style={{width:4,height:36,borderRadius:2,background:active?"#4F3FD0":"rgba(255,255,255,0.15)",transition:"background 0.2s"}}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:15,color:active?"white":"rgba(255,255,255,0.7)"}}>
                      {l.label}
                    </div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:2}}>
                      {l.code==="uz"?"Lotin alifbosi":l.code==="ru"?"Кириллица / Русский":"Кирилл алифбоси"}
                    </div>
                  </div>
                  {/* Radio */}
                  <div style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${active?"#4F3FD0":"rgba(255,255,255,0.2)"}`,background:active?"#4F3FD0":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s"}}>
                    {active&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirm button */}
          <button onClick={confirmLang}
            style={{width:"100%",padding:"16px",borderRadius:18,border:"none",background:"linear-gradient(135deg,#4F3FD0,#6366F1)",color:"white",fontSize:16,fontWeight:800,cursor:"pointer",boxShadow:"0 4px 24px rgba(79,63,208,0.4)",letterSpacing:"0.3px"}}>
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
    brain: IC.Brain, numbers: IC.Hash, pattern: IC.Grid, verbal: IC.Words, logic: IC.Logic,
    spatial: IC.Cube, memory: IC.Brain, attention: IC.Target, speedcalc: IC.Zap, tip: IC.Lightbulb,
  };
  const Comp = map[icon] || IC.Info;
  return <Comp size={size} color={color}/>;
}

// ─── PRO GATE KOMPONENTI ───
function ProGate({T, C, setScreen, reason, onBack}) {
  const reasons = {
    ticket: {
      title: "Bu to'plam Pro uchun",
      sub: "Ushbu to'plam faqat Pro obuna foydalanuvchilari uchun ochiq.",
      icon: "pattern",
    },
    testLimit: {
      title: "Kunlik limit tugadi",
      sub: `Bugun ${LIMITS.dailyTestLimit} ta bepul jumboqqa javob berdingiz. Davom etish uchun Pro obuna oling.`,
      icon: "stats",
    },
    examLimit: {
      title: "Bepul IQ test tugadi",
      sub: `Kuniga ${LIMITS.freeExamCount} ta bepul IQ test. Bugungi urinishlaringiz tugadi.`,
      icon: "brain",
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
      {!IS_NATIVE && <button onClick={()=>setScreen("pro")} style={{width:"100%", maxWidth:300, padding:"16px", borderRadius:16, border:"none", background:"linear-gradient(135deg,#8B5CF6,#6366F1)", color:"white", fontSize:16, fontWeight:800, cursor:"pointer", boxShadow:"0 6px 20px rgba(139,92,246,0.4)", marginBottom:12}}>
        <span style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}><IC.Diamond size={18} color="white"/>Pro obuna olish</span>
      </button>}
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
    <div style={{minHeight:"100vh",background:dark?"#0F172A":`linear-gradient(160deg,#ECEAFB,#F5F4FB)`,padding:24,display:"flex",flexDirection:"column"}}>
      <LangModal visible={showLang} onClose={()=>setShowLang(false)} lang={lang} setLang={setLang} C={C}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <button onClick={()=>setShowLang(true)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderRadius:20,border:`1.5px solid ${C.gray200}`,background:C.card,cursor:"pointer"}}>
          <IC.Globe size={14} color={C.gray400}/><span style={{fontSize:12,fontWeight:600,color:C.subtext}}>{LANGS[lang].flag} {LANGS[lang].label}</span>
        </button>
        <DarkToggle dark={dark} setDark={setDark} C={C} T={T}/>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <div style={{width:90,height:90,borderRadius:24,background:"linear-gradient(135deg,#4F3FD0,#9C90FF)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 32px rgba(79,63,208,0.3)",marginBottom:12}}>
          <span style={{color:"white",fontSize:48,fontWeight:900,fontFamily:"serif"}}>Q</span>
        </div>
        <h2 style={{fontSize:26,fontWeight:800,color:C.text,margin:"0 0 4px"}}>IQuest</h2>
        <p style={{color:C.subtext,margin:"0 0 36px",fontSize:14}}>Aql sarguzashti</p>
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

function HomeScreen({setScreen,T,C,unreadCount,savedQuestions,dark,setDark,lang,setLang,api,usage}) {
  const [showLang,setShowLang]=useState(false);
  const [searchQuery,setSearchQuery]=useState("");
  // Online: umumiy statistika (to'g'ri foizi) va reytingdagi o'rin
  const [homeStats,setHomeStats]=useState(null);
  const [myRank,setMyRank]=useState(null);
  useEffect(()=>{
    if(!api) return;
    api.get('/stats/me?period=all').then(setHomeStats).catch(()=>{});
    api.get('/leaderboard?period=all&limit=1').then(r=>setMyRank(r?.me?.rank??null)).catch(()=>{});
  },[api]);

  const menuItems=[
    {lk:"tickets", Icon:IC.Grid,         sc:"tickets", accent:"#4F3FD0", light:"#ECEAFB"},
    {lk:"topics",  Icon:IC.Grid,          sc:"topics",  accent:"#22C55E", light:"#DCFCE7"},
    {lk:"exam",    Icon:IC.Brain,        sc:"exam",    accent:"#F59E0B", light:"#FEF3C7"},
    {lk:"stats",   Icon:IC.BarChart,     sc:"stats",   accent:"#8B5CF6", light:"#F5F3FF"},
    {lk:"rating",  Icon:IC.Medal,        sc:"rating",  accent:"#F59E0B", light:"#FEF3C7"},
    {lk:"rules",   Icon:IC.Lightbulb,       sc:"rules",   accent:"#EC4899", light:"#FCE7F3"},
  ];

  // Bugungi maqsad: online — bugungi mashq savollari / kunlik limit; offline — demo
  const goal=api&&usage?{done:usage.practiceQuestions||0,total:LIMITS.dailyTestLimit}:{done:120,total:150};
  goal.pct=Math.min(100,Math.round(goal.done/Math.max(1,goal.total)*100));

  const activities=[
    {Icon:IC.Ticket,    label:`${T.ticket} 12`, score:"18/20", p:90,  color:"#4F3FD0"},
    {Icon:IC.Clipboard, label:T.tests,     score:"19/25", p:76,  color:"#8B5CF6"},
    {Icon:IC.Brain,     label:T.exam,     score:"IQ 108–120", p:90,  color:"#22C55E"},
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
            {label:T.active,  val:"92%", color:"#4F3FD0", bg:dark?"#26224A22":"#ECEAFB"},
            {label:T.tests,   val:api&&homeStats?`${homeStats.correctPct??0}%`:"85%", color:"#22C55E", bg:dark?"#16653622":"#DCFCE7"},
            {label:T.rating,  val:api&&myRank?`#${myRank}`:api&&homeStats?"—":"#24", color:"#F59E0B", bg:dark?"#78350f22":"#FEF3C7"},
          ].map(s=>(
            <div key={s.label} style={{flex:1,background:s.bg,borderRadius:16,padding:"12px 10px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:900,color:s.color}}>{s.val}</div>
              <div style={{fontSize:10,color:C.subtext,marginTop:2,fontWeight:500}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"18px 20px 0"}}>
        <div style={{background:dark?"linear-gradient(135deg,#26224A,#231F45)":"linear-gradient(135deg,#4F3FD0,#6B5CF0)",borderRadius:22,padding:"18px 20px",position:"relative",overflow:"hidden"}}>
          {/* decorative circle */}
          <div style={{position:"absolute",right:-20,top:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
          <div style={{position:"absolute",right:30,bottom:-30,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative"}}>
            <div>
              <div style={{color:"rgba(255,255,255,0.75)",fontSize:12,fontWeight:500,marginBottom:4}}>{T.todayGoal}</div>
              <div style={{color:"white",fontSize:22,fontWeight:900}}>{goal.done} <span style={{fontSize:14,fontWeight:500,opacity:0.7}}>/ {goal.total} {T.questions}</span></div>
            </div>
            <div style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"6px 12px"}}>
              <span style={{color:"white",fontSize:14,fontWeight:800}}>{goal.pct}%</span>
            </div>
          </div>
          <div style={{marginTop:14,height:6,background:"rgba(255,255,255,0.2)",borderRadius:100}}>
            <div style={{height:"100%",width:`${goal.pct}%`,background:"white",borderRadius:100,boxShadow:"0 0 8px rgba(255,255,255,0.5)"}}/>
          </div>
        </div>
      </div>

      {/* ── QUICK MENU ── */}
      <div style={{padding:"20px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontWeight:700,fontSize:15,color:C.text}}>{T.services}</span>
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

function TicketsScreen({setScreen,setActiveTicket,T,C,user,api}) {
  const [tab,setTab]=useState("all");
  const isPro = user?.isPro || user?.pro || false;
  // Online: GET /results/sets → { setId: best% }; offline — demo progress
  const [setsBest,setSetsBest]=useState(null);
  useEffect(()=>{
    if(!api) return;
    api.get('/results/sets').then(r=>setSetsBest(Object.fromEntries((r?.items||[]).map(it=>[it.setId,it.best])))).catch(()=>{});
  },[api]);
  const pm=[95,90,80,100,75,null,null,null,null,null,88,null,null,null,null,null,null,null,null,null];
  const list=tickets.slice(0,20).map((t,i)=>({...t,isPro:t.id>LIMITS.freeTicketCount,progress:api&&setsBest?(setsBest[t.id]??null):pm[i]}));
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
          <span style={{fontSize:12,color:C.subtext,flex:1}}>{T.ticket} 1-{LIMITS.freeTicketCount} bepul. {LIMITS.freeTicketCount+1}-100 Pro uchun <IC.Diamond size={12} color="#8B5CF6"/></span>
        </div>}
        {filtered.map(ticket=>{
          const isLocked = ticket.isPro && !isPro;
          return (
            <div key={ticket.id} onClick={()=>handleTicketClick(ticket)}
              style={{background:C.card,borderRadius:14,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.08)",cursor:"pointer",border:`1px solid ${isLocked?"#E2E8F0":C.cardBorder}`,opacity:isLocked?0.8:1}}>
              <div style={{width:40,height:40,borderRadius:12,background:isLocked?"#F1F5F9":ticket.progress!==null?C.primary+"22":C.gray100,display:"flex",alignItems:"center",justifyContent:"center",marginRight:12,fontWeight:700,color:isLocked?C.muted:ticket.progress!==null?C.primary:C.gray600,fontSize:13}}>
                {isLocked ? <IC.Lock size={18} color={C.muted}/> : `#${ticket.id}`}
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

// neutral=true — o'lchash rejimi (IQ test): tanlangan variant faqat aksent bilan belgilanadi,
// to'g'ri/noto'g'ri ko'rsatilmaydi (DESIGN.md §2)
function OptionsList({options,correct,selected,onSelect,C,neutral=false}) {
  return <>{options.map((opt,i)=>{
    const letter=String.fromCharCode(65+i),isSel=selected===i,isCorr=!neutral&&i===correct;
    let bg=C.gray100,border="transparent",color=C.text;
    if(neutral){if(isSel){bg=C.primary+"18";border=C.primary;color=C.primary;}}
    else if(selected!==null){if(isCorr){bg=C.success+"18";border=C.success;color=C.success;}else if(isSel){bg=C.danger+"18";border=C.danger;color=C.danger;}}
    return <div key={i} onClick={()=>selected===null&&onSelect(i)} style={{background:bg,borderRadius:14,padding:"14px 16px",marginBottom:10,border:`2px solid ${border}`,cursor:selected!==null?"default":"pointer",display:"flex",alignItems:"center",gap:12}}>
      <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,background:neutral?(isSel?C.primary:C.card):selected!==null&&isCorr?C.success:selected!==null&&isSel?C.danger:C.card,border:`2px solid ${C.gray300}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:selected!==null&&(isCorr||isSel)?"white":C.gray600}}>{letter}</div>
      <span style={{fontWeight:500,fontSize:14,color}}>{opt}</span>
    </div>;
  })}</>;
}

function TicketQuizScreen({setScreen,ticket,setLastResult,T,C,lang,savedQuestions,setSavedQuestions,addToast,postResult}) {
  const [startedAt]=useState(()=>Date.now());
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
    else{const na={...answers};const c=Object.values(na).filter((v,i)=>v===ticket.questions[i]?.correct).length;setLastResult({ticket,correct:c,total,wrong:total-c});postResult?.({kind:'set',setId:ticket.id,correct:c,total,durationSec:Math.round((Date.now()-startedAt)/1000)});setScreen("ticket-result");}
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
      {q.sign!==null&&<div style={{textAlign:"center",marginBottom:20,background:"#F1EFFD",borderRadius:20,padding:20}}><SignSVG item={q.sign}/></div>}
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
  return <ResultScreen T={T} C={C} icon={wrong<=2?"pass":"fail"} title={wrong<=2?T.greatResult:T.keepPracticing} subtitle={`${T.ticket} ${result.ticket?.id} ${T.ticketDone}`} correct={correct} wrong={wrong} total={total} percent={percent} actions={[{label:T.otherTicket,onClick:()=>setScreen("tickets")},{label:T.goHome,onClick:()=>setScreen("home")}]}/>;
}

function PracticeResultScreen({setScreen,result,T,C}) {
  if(!result){setScreen("tests");return null;}
  const {correct,total}=result,wrong=total-correct,percent=Math.round((correct/total)*100);
  return <ResultScreen T={T} C={C} icon={percent>=60?"pass":"fail"} title={percent>=60?T.greatResult:T.keepPracticing} subtitle={T.infiniteTest} correct={correct} wrong={wrong} total={total} percent={percent} actions={[{label:T.startTest,onClick:()=>setScreen("test-quiz")},{label:T.goHome,onClick:()=>setScreen("home")}]}/>;
}

function TestsScreen({setScreen,T,C,user,api,addToast}) {
  // Online: POST /results/practice/check → { allowed, used, limit } (lokal hisoblagich o'rniga)
  const [check,setCheck]=useState(null);
  useEffect(()=>{
    if(!api) return;
    api.post('/results/practice/check').then(setCheck).catch(()=>{});
  },[api]);
  const online = !!(api && check);
  const isPro = online ? check.limit === null : (user?.isPro || user?.pro || false);
  const dailyLimit = online && check.limit !== null ? check.limit : LIMITS.dailyTestLimit;
  const usedToday = online ? check.used : getDailyCount('tests');
  const remaining = Math.max(0, dailyLimit - usedToday);
  const limitReached = online ? !check.allowed : (!isPro && remaining === 0);
  const startPractice = () => {
    if(!api){ if(limitReached){setScreen("test-limit-gate");return;} setScreen("test-quiz"); return; }
    // Boshlashdan oldin serverdan qayta tekshiramiz; tarmoq xatosida lokal hisobga tayanamiz
    api.post('/results/practice/check').then(r=>{ setCheck(r); setScreen(r.allowed?"test-quiz":"test-limit-gate"); })
      .catch(()=>{ addToast?.("Server bilan aloqa yo'q","error"); setScreen(limitReached?"test-limit-gate":"test-quiz"); });
  };
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
        Bugun qolgan: <strong style={{color:remaining<20?C.danger:C.primary}}>{remaining}/{dailyLimit}</strong> ta bepul test
      </div>}
      <button onClick={startPractice}
        style={{width:"100%",padding:"16px",borderRadius:16,border:"none",background:limitReached?"#E2E8F0":`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:limitReached?C.muted:"white",fontSize:16,fontWeight:800,cursor:"pointer",boxShadow:limitReached?"none":`0 6px 20px ${C.primary}50`}}>
        {limitReached ? <span style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}><IC.Lock size={16} color={C.muted}/>Kunlik limit tugadi</span> : T.startTest}
      </button>
    </div>
  </div>;
}

function TestQuizScreen({setScreen,setLastTestResult,T,C,lang,savedQuestions,setSavedQuestions,postResult}) {
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
    else{const na={...answers};const c=Object.values(na).filter((v,i)=>v===questions[i]?.correct).length;setLastTestResult({correct:c,total:questions.length,wrong:questions.length-c});postResult?.({kind:'practice',correct:c,total:questions.length,durationSec:600-timeLeft});setScreen("test-result");}
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
      {q?.sign!=null&&<div style={{textAlign:"center",marginBottom:20,background:"#F1EFFD",borderRadius:20,padding:20}}><SignSVG item={q.sign}/></div>}
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
  const isPro = user?.isPro || user?.pro || false;
  const usedExams = getDailyCount('exams');
  const examRemaining = Math.max(0, LIMITS.freeExamCount - usedExams);
  const examLimitReached = !isPro && examRemaining === 0;
  return <div style={SC.screen(C)}>
    <div style={{...SC.header(C),padding:"52px 20px 32px",textAlign:"center"}}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><IC.Brain size={56} color="white"/></div>
      <h2 style={{color:"white",fontSize:24,fontWeight:800,margin:0}}>{T.examTitle}</h2>
      <p style={{color:"rgba(255,255,255,0.8)",fontSize:14,margin:"4px 0 0"}}>{T.examReady}</p>
    </div>
    <div style={{padding:20}}>
      <Card C={C} style={{marginBottom:20}}>
        <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:14}}>{T.examRules}</div>
        {[T.rule1,T.rule2,T.rule3,T.rule4].map((r,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:10,alignItems:"flex-start"}}><div style={{width:6,height:6,borderRadius:"50%",background:C.primary,marginTop:6,flexShrink:0}}/><span style={{fontSize:14,color:C.subtext,lineHeight:1.5}}>{r}</span></div>)}
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {[{lk:"questionCount",val:"20",Icon:IC.FileText,c:C.primary},{lk:"time",val:"15:00",Icon:IC.Clock,c:C.success},{lk:"errorLimit",val:T.free,Icon:IC.Brain,c:C.primary}].map(s=>(
          <Card key={s.lk} C={C} style={{textAlign:"center",padding:"16px 8px"}}><div style={{display:"flex",justifyContent:"center",marginBottom:6}}><s.Icon size={22} color={s.c}/></div><div style={{fontSize:18,fontWeight:800,color:s.c}}>{s.val}</div><div style={{fontSize:11,color:C.subtext}}>{T[s.lk]}</div></Card>
        ))}
      </div>
    </div>
    {/* Sticky bottom button */}
    <div style={{position:"fixed",bottom:70,left:16,right:16,width:"calc(100% - 32px)",padding:"0 0 8px",zIndex:50}}>
      {!isPro && <div style={{textAlign:"center",marginBottom:8,fontSize:12,color:examLimitReached?C.danger:C.subtext}}>
        Bugun qolgan: <strong style={{color:examLimitReached?C.danger:C.primary}}>{examRemaining}/{LIMITS.freeExamCount}</strong> ta bepul IQ test
      </div>}
      <button onClick={()=>{ if(examLimitReached){setScreen("exam-limit-gate");return;} setScreen("exam-quiz"); }}
        style={{width:"100%",padding:"16px",borderRadius:16,border:"none",background:examLimitReached?"#E2E8F0":`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:examLimitReached?C.muted:"white",fontSize:16,fontWeight:800,cursor:"pointer",boxShadow:examLimitReached?"none":`0 6px 20px ${C.primary}50`}}>
        {examLimitReached ? <span style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}><IC.Lock size={16} color={C.muted}/>Kunlik limit tugadi</span> : T.startExam}
      </button>
    </div>
  </div>;
}

function ExamQuizScreen({setScreen,setExamResult,T,C,lang,user}) {
  // Eslatma: IQ test lokal 20 savollik test — backenddagi /iq/sessions (engine formasi) bilan mos emas,
  // shuning uchun natija serverga yozilmaydi (kontrakt qarori kerak)
  const isPro = user?.isPro || user?.pro || false;
  // Pro to'plamlar jumboqlarini bepul IQ testga kiritmaymiz
  const allQs = tickets
    .filter(t => !t.isPro || isPro)
    .slice(0,10)
    .flatMap(t=>t.questions.slice(0,5));
  const [questions]=useState(()=>allQs.sort(()=>Math.random()-0.5).slice(0,20));
  const [current,setCurrent]=useState(0);const [answers,setAnswers]=useState({});const [selected,setSelected]=useState(null);const [timeLeft,setTimeLeft]=useState(EXAM_SECONDS);
  const answersRef=useRef({});
  const finish=(na)=>{const c=Object.entries(na).filter(([i,v])=>v===questions[i]?.correct).length;incDailyCount('exams');setExamResult(iqResult(c,questions.length,Object.keys(na).length));setScreen("exam-result");};
  useEffect(()=>{const t=setInterval(()=>setTimeLeft(p=>{if(p<=1){clearInterval(t);finish(answersRef.current);return 0;}return p-1;}),1000);return()=>clearInterval(t);},[]);
  const mins=Math.floor(timeLeft/60).toString().padStart(2,"0"),secs=(timeLeft%60).toString().padStart(2,"0"),q=questions[current];
  const answeredCount=Object.keys(answers).length;
  const handleAnswer=(optIdx)=>{setSelected(optIdx);const na={...answers,[current]:optIdx};answersRef.current=na;setTimeout(()=>{setAnswers(na);if(current+1<questions.length){setCurrent(current+1);setSelected(null);}else finish(na);},400);};
  return <div style={{minHeight:"100vh",background:C.white}}>
    <div style={{...SC.header(C),padding:"50px 20px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{background:"rgba(255,255,255,0.2)",borderRadius:12,padding:"6px 14px"}}><div style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>{T.question}</div><div style={{color:"white",fontWeight:800,fontSize:16}}>{current+1}/{questions.length}</div></div>
        <div style={{background:"rgba(255,255,255,0.2)",borderRadius:12,padding:"6px 14px",display:"flex",alignItems:"center",gap:6}}><IC.Clock size={14} color="white"/><div><div style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>{T.time}</div><div style={{color:"white",fontWeight:800,fontSize:16}}>{mins}:{secs}</div></div></div>
        <div style={{background:"rgba(255,255,255,0.2)",borderRadius:12,padding:"6px 14px",display:"flex",alignItems:"center",gap:6}}><IC.CheckCircle size={14} color="white"/><div><div style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>{T.answered}</div><div style={{color:"white",fontWeight:800,fontSize:16}}>{answeredCount}/{questions.length}</div></div></div>
      </div>
      <div style={{display:"flex",gap:3}}>{questions.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:100,background:i<current?"white":"rgba(255,255,255,0.3)"}}/>)}</div>
    </div>
    <div style={{padding:20}}>
      <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:20,lineHeight:1.5}}>{getQ(q?.question,lang)}</div>
      {q?.sign!=null&&<div style={{textAlign:"center",marginBottom:20,background:"#F1EFFD",borderRadius:20,padding:20}}><SignSVG item={q.sign}/></div>}
      <OptionsList neutral options={getOpts(q?.options,lang)} correct={q?.correct||0} selected={selected} onSelect={handleAnswer} C={C}/>
    </div>
  </div>;
}

// ─── IQ NATIJA HISOBI ───
// Taxminiy: to'g'ri javoblar ulushi 70–130 shkalaga o'tkaziladi, ±6 oraliq (μ=100, σ=15).
// Haqiqiy me'yorlar tayyor bo'lgach almashtiriladi — "Dastlabki me'yorlar" belgisi shuning uchun.
const EXAM_SECONDS = 15*60;
function normCdf(z){const t=1/(1+0.2316419*Math.abs(z)),d=0.3989423*Math.exp(-z*z/2),p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return z>0?1-p:p;}
function iqResult(correct,total,answered=total){
  const percent=Math.round((correct/total)*100);
  const mid=Math.round(70+percent*0.6), iqLow=mid-6, iqHigh=mid+6;
  const pLow=Math.round(normCdf((iqLow-100)/15)*100), pHigh=Math.round(normCdf((iqHigh-100)/15)*100);
  return {correct,total,wrong:total-correct,unanswered:total-answered,percent,iqLow,iqHigh,pLow,pHigh,passed:true};
}

function ExamResultScreen({setScreen,result,T,C}) {
  if(!result){setScreen("exam");return null;}
  const r=result.iqLow?result:iqResult(result.correct,result.total);
  const {correct,total,iqLow,iqHigh,pLow,pHigh}=r;
  const W=300,H=90,x=v=>((v-55)/90)*W, y=v=>H-6-Math.exp(-((v-100)**2)/(2*15*15))*(H-16);
  const curve=Array.from({length:61},(_,i)=>{const v=55+i*1.5;return `${x(v).toFixed(1)},${y(v).toFixed(1)}`;}).join(" ");
  const band=Array.from({length:13},(_,i)=>{const v=iqLow+i;return `${x(v).toFixed(1)},${y(v).toFixed(1)}`;}).join(" ");
  const statsRows=[{label:T.avgResult,value:"IQ 108"},{label:T.examCount,value:"8"},{label:T.passedExams,value:"IQ 114–126",color:C.primary},{label:T.failedExams,value:`IQ ${iqLow}–${iqHigh}`}];
  return <div style={{minHeight:"100vh",background:C.white,padding:"20px 20px 96px"}}>
    <div style={{textAlign:"center",padding:"40px 0 20px"}}>
      <div style={{width:88,height:88,borderRadius:"50%",margin:"0 auto 14px",background:C.primary+"18",display:"flex",alignItems:"center",justifyContent:"center"}}><IC.Brain size={46} color={C.primary}/></div>
      <div style={{fontSize:15,fontWeight:600,color:C.subtext,marginBottom:6}}>{T.iqBand}</div>
      <div style={{fontSize:46,lineHeight:1.1,fontWeight:900,color:C.text,fontVariantNumeric:"tabular-nums",letterSpacing:"-1px"}}>{iqLow}–{iqHigh}</div>
      <div style={{fontSize:14,color:C.subtext,marginTop:4}}>{T.iqPercentile.replace("{p}",`${pLow}–${pHigh}`)}</div>
      <div style={{display:"inline-block",marginTop:10,padding:"4px 12px",borderRadius:20,background:"#E3F2F7",color:"#0E6E8C",fontSize:12,fontWeight:700}}>{T.iqProvisional}</div>
    </div>
    <Card C={C} style={{marginBottom:16,padding:"14px 10px"}}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <polyline points={curve} fill="none" stroke={C.gray300} strokeWidth="2"/>
        <polygon points={`${x(iqLow).toFixed(1)},${H-6} ${band} ${x(iqHigh).toFixed(1)},${H-6}`} fill={C.primary} opacity="0.25"/>
        <polyline points={band} fill="none" stroke={C.primary} strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="0" y1={H-6} x2={W} y2={H-6} stroke={C.gray200} strokeWidth="1"/>
        {[70,85,100,115,130].map(v=><text key={v} x={x(v)} y={H} textAnchor="middle" fontSize="9" fill={C.gray400}>{v}</text>)}
      </svg>
    </Card>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <Card C={C} style={{textAlign:"center",padding:"14px 8px"}}><div style={{fontSize:20,fontWeight:800,color:C.text}}>{correct}/{total}</div><div style={{fontSize:11,color:C.subtext}}>{T.correct}</div></Card>
      <Card C={C} style={{textAlign:"center",padding:"14px 8px"}}><div style={{fontSize:20,fontWeight:800,color:C.text}}>{r.percent}%</div><div style={{fontSize:11,color:C.subtext}}>{T.result}</div></Card>
    </div>
    <Card C={C} style={{marginBottom:20}}>{statsRows.map(s=><div key={s.label} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.gray100}`}}><span style={{fontSize:14,color:C.subtext}}>{s.label}</span><span style={{fontSize:14,fontWeight:700,color:s.color||C.text}}>{s.value}</span></div>)}</Card>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <Btn C={C} onClick={()=>setScreen("home")}>{T.goHome}</Btn>
      <Btn C={C} variant="outline" onClick={()=>setScreen("exam")}>{T.retryExam}</Btn>
    </div>
  </div>;
}

const STATS_PERIODS=["all","week","month","year"]; // Umumiy/Haftalik/Oylik/Yillik
function StatsScreen({T,C,api}) {
  const tabs=[T.general,T.weekly,T.monthly,T.yearly];
  const [tab,setTab]=useState(0);
  // Online: GET /stats/me?period=... (tab bo'yicha); offline — demo raqamlar
  const [remote,setRemote]=useState(null);
  useEffect(()=>{
    if(!api) return;
    let alive=true;
    api.get(`/stats/me?period=${STATS_PERIODS[tab]}`).then(r=>{if(alive)setRemote({tab,data:r});}).catch(()=>{if(alive)setRemote(null);});
    return()=>{alive=false;};
  },[api,tab]);
  const st=api&&remote?.tab===tab?remote.data:null;
  const graph=st?(st.graph||[]).map(g=>g.pct):[60,70,55,75,80,72,85];
  const months=st?(st.graph||[]).map(g=>g.date.slice(8,10)+"."+g.date.slice(5,7)):["01.05","02.05","03.05","04.05","05.05","06.05","07.05"];
  const gx=i=>graph.length>1?Math.round(i*318/(graph.length-1)):160;
  const sCards=[{lk:"totalQ",val:st?String(st.totalQuestions):"2450",c:C.primary,bg:C.primary+"22",Icon:IC.FileText},{lk:"correctA",val:st?String(st.correct):"1980",c:C.success,bg:"#DCFCE7",Icon:IC.CheckCircle},{lk:"wrongA",val:st?String(st.wrong):"470",c:C.danger,bg:"#FEE2E2",Icon:IC.XCircle},{lk:"correctPct",val:st?`${st.correctPct}%`:"81%",c:C.warning,bg:C.warning+"22",Icon:IC.TrendingUp}];
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
          {graph.length>1&&<polyline points={graph.map((v,i)=>`${gx(i)},${110-v}`).join(" ")} fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinejoin="round"/>}
          {graph.length>1&&<polygon points={`0,110 ${graph.map((v,i)=>`${gx(i)},${110-v}`).join(" ")} ${gx(graph.length-1)},110`} fill="url(#gg)"/>}
          {graph.map((v,i)=><circle key={i} cx={gx(i)} cy={110-v} r="5" fill={C.primary} stroke={C.card} strokeWidth="2"/>)}
        </svg>
        <div style={{display:"flex",justifyContent:graph.length>1?"space-between":"center",marginTop:4}}>{months.map(m=><span key={m} style={{fontSize:10,color:C.gray400}}>{m}</span>)}</div>
      </Card>
    </div>
  </div>;
}

const RATING_PERIODS=["day","week","month","all"];
function RatingScreen({T,C,api}) {
  const [tab,setTab]=useState(1);const gold=["#C0C0C0","#FFD700","#CD7F32"];const po=[0,1,2];const hs=[85,110,70];
  // Online: GET /leaderboard?period=day|week|month|all; offline — demo ro'yxat
  const [remote,setRemote]=useState(null);
  useEffect(()=>{
    if(!api) return;
    let alive=true;
    api.get(`/leaderboard?period=${RATING_PERIODS[tab]}&limit=50`).then(r=>{if(alive)setRemote({tab,data:r});}).catch(()=>{if(alive)setRemote(null);});
    return()=>{alive=false;};
  },[api,tab]);
  const lb=api&&remote?.tab===tab?remote.data:null;
  const leaderboard=lb?(lb.items||[]).map(u=>({rank:u.rank,name:u.name,xp:u.xp,av:u.avatar,me:u.isMe})):LEADERBOARD_DEMO;
  const meOutside=lb?.me&&!leaderboard.some(u=>u.me)?lb.me:null;
  return <div style={{paddingBottom:16}}>
    <div style={{padding:"52px 20px 16px"}}><h2 style={{fontSize:22,fontWeight:800,color:C.text,margin:0,display:"flex",alignItems:"center",gap:8}}><IC.Medal size={24} color={C.warning}/>{T.ratingTitle}</h2></div>
    <div style={{padding:"0 16px"}}>
      <div style={{display:"flex",gap:8,marginBottom:20}}>{[T.daily,T.weekly,T.monthly,T.allTab].map((t,i)=><button key={t} onClick={()=>setTab(i)} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",background:tab===i?C.primary:C.gray200,color:tab===i?"white":C.subtext,fontSize:13,fontWeight:600}}>{t}</button>)}</div>
      <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:10,marginBottom:24}}>
        {po.map((pi,i)=>{const u=leaderboard[pi];if(!u)return <div key={i} style={{flex:1}}/>;return <div key={i} style={{textAlign:"center",flex:1}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:u.me?`linear-gradient(135deg,${C.primary},#9C90FF)`:`linear-gradient(135deg,${gold[i]},rgba(255,255,255,0.5))`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 6px",fontWeight:800,fontSize:18,color:"white",boxShadow:u.me?`0 4px 16px ${C.primary}66`:"0 2px 8px rgba(0,0,0,0.1)"}}>{u.av}</div>
          <div style={{fontSize:13,fontWeight:700,color:C.text}}>{u.name}</div>
          <div style={{fontSize:12,color:C.primary,fontWeight:600}}>{u.xp} xp</div>
          <div style={{height:hs[i],background:gold[i],borderRadius:"10px 10px 0 0",marginTop:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:900,color:"white"}}>{pi+1}</div>
        </div>;})}
      </div>
      {leaderboard.slice(3).map(u=><Card key={u.rank} C={C} style={{marginBottom:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,...(u.me?{border:`2px solid ${C.primary}`}:{})}}>
        <div style={{fontSize:16,fontWeight:700,color:C.gray400,width:24,textAlign:"center"}}>{u.rank}</div>
        <div style={{width:40,height:40,borderRadius:"50%",background:u.me?`linear-gradient(135deg,${C.primary},#9C90FF)`:C.gray200,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:u.me?"white":C.gray600}}>{u.av}</div>
        <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:C.text}}>{u.name}</div></div>
        <div style={{fontWeight:700,color:C.primary}}>{u.xp} xp</div>
      </Card>)}
      {meOutside&&<Card C={C} style={{marginBottom:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,border:`2px solid ${C.primary}`}}>
        <div style={{fontSize:16,fontWeight:700,color:C.gray400,minWidth:24,textAlign:"center"}}>{meOutside.rank}</div>
        <div style={{flex:1,fontWeight:600,fontSize:14,color:C.text}}>{T.profile}</div>
        <div style={{fontWeight:700,color:C.primary}}>{meOutside.xp} xp</div>
      </Card>}
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
          <span style={{color:"white",fontSize:38,fontWeight:900,fontFamily:"serif"}}>Q</span>
        </div>
        <h2 style={{color:"white",fontSize:24,fontWeight:900,margin:"0 0 6px"}}>IQuest</h2>
        <p style={{color:"rgba(255,255,255,0.7)",fontSize:13,margin:"0 0 4px"}}>Aql sarguzashti</p>
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
          <div style={{marginBottom:4}}>IQuest v{APP_CONFIG.version}</div>
          <div>© {new Date().getFullYear()} IQuest. Barcha huquqlar himoyalangan.</div>
        </div>
      </div>
    </div>
  );
}

// ─── REFERRAL SCREEN ───
function ReferralScreen({setScreen, T, C, user, addToast, api}) {
  // Online: GET /referrals/me → { code, link, invited, rewards, next, history }
  const [remote, setRemote] = useState(null);
  useEffect(() => {
    if (!api) return;
    api.get('/referrals/me').then(setRemote).catch(() => addToast("Referal ma'lumotlari yuklanmadi", "error"));
  }, [api]); // eslint-disable-line react-hooks/exhaustive-deps
  const ref = api ? remote : null;
  const refCode = ref?.code || user?.referralCode || genReferralCode(user);
  const refLink = ref?.link || `https://t.me/${APP_CONFIG.botUsername}?startapp=${refCode}`;
  // Demo ma'lumotlar (offline rejim)
  const [demoInvited] = useState(4);
  const [demoHistory] = useState([
    {name:"Alisher T.", date:"10.06.2025", status:"active"},
    {name:"Bobur M.",   date:"09.06.2025", status:"active"},
    {name:"Sardor K.",  date:"08.06.2025", status:"active"},
    {name:"Zulfiya N.", date:"07.06.2025", status:"active"},
  ]);
  const invitedCount = ref ? ref.invited : demoInvited;
  const history = ref
    ? (ref.history || []).map(h => ({ name: h.firstName || "—", date: new Date(h.createdAt).toLocaleDateString("ru-RU"), status: h.rewarded ? "rewarded" : "active" }))
    : demoHistory;

  const milestones = REFERRAL_CONFIG.milestones;
  const earned = ref ? (ref.rewards || []) : milestones.filter(m => invitedCount >= m.count);
  const next = ref ? (ref.next ? { ...ref.next, label: proDaysLabel(ref.next.days) } : null) : nextMilestone(invitedCount);
  const progressPct = next ? Math.min(100, Math.round(invitedCount / next.count * 100)) : 100;

  const copyCode = () => {
    try { navigator.clipboard.writeText(refCode); } catch {}
    addToast(T.referralCopied || "Nusxalandi!", "success");
  };

  const shareRef = () => {
    const text = `IQuest'da aqlingizni sinang! Mening referal kodim: ${refCode}
${refLink}`;
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
                <span style={{fontSize:10,fontWeight:700,background:"#DCFCE7",color:"#16A34A",borderRadius:6,padding:"2px 8px"}}>{h.status==="rewarded"?T.referralGifted:"Faol"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileScreen({setScreen,user,setUser,T,C,dark,setDark,lang,setLang,savedQuestions,setShowLangModal,tgUser,api,addToast}) {
  const [editing,setEditing]=useState(false);
  const [form,setForm]=useState({name:user?.name||"",surname:user?.surname||"",phone:user?.phone||""});

  const saveProfile=()=>{
    setUser({...user,...form});
    setEditing(false);
    if(!api) return;
    // Online: PATCH /me (telefon: +998XXXXXXXXX yoki bo'sh — bo'sh joy/tirelarni olib tashlaymiz)
    const phone=form.phone.replace(/[\s()-]/g,"");
    api.patch('/me',{firstName:form.name.trim(),lastName:form.surname.trim(),phone})
      .then(res=>{ if(res?.user) setUser(prev=>mapApiUser(res.user,prev)); addToast("Profil saqlandi","success"); })
      .catch(err=>addToast(err.status===400?"Telefon formati: +998XXXXXXXXX":"Profil serverga saqlanmadi","error"));
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
    {lk:"lang",     Icon:IC.Globe,      ic:C.primary, bg:"#ECEAFB", right:LANGS[lang].label, action:()=>setShowLangModal(true)},
    {lk:"support",  Icon:IC.Headphones, ic:"#22C55E", bg:"#DCFCE7", right:"@"+APP_CONFIG.supportUsername, action:()=>openTg(APP_CONFIG.supportUsername)},
    {lk:"news",     Icon:IC.TelegramIcon, ic:"#229ED9", bg:"#E3F2FD", right:"@"+APP_CONFIG.newsChannel, action:()=>openTg(APP_CONFIG.newsChannel)},
    {lk:"about",    Icon:IC.Info,       ic:C.primary, bg:"#ECEAFB", action:()=>setScreen("about")},
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
          style={{width:"100%",padding:"15px",borderRadius:16,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontSize:15,fontWeight:800,cursor:"pointer",marginTop:4,boxShadow:"0 4px 16px rgba(79,63,208,0.3)"}}>
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
                <div style={{width:38,height:38,borderRadius:12,background:dark?"#26224A":"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
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
// ─── ANDROID: TELEGRAM ORQALI KIRISH ───
// POST /auth/app/start → t.me/<bot>?start=login_<nonce> → foydalanuvchi botda Start bosadi → /auth/app/poll token beradi
const LOGIN_TEXTS = {
  uz:   { title:"Hisobingizga kiring", sub:"Natijalaringiz, reyting va Pro obuna Telegram hisobingizga bog'lanadi.", tg:"Telegram orqali kirish", waiting:"Telegram'da botni oching va Start tugmasini bosing…", retry:"Qayta urinish", guest:"Hozircha mehmon sifatida", expired:"Havola eskirdi. Qayta urinib ko'ring.", error:"Serverga ulanib bo'lmadi. Internetni tekshiring." },
  ru:   { title:"Войдите в аккаунт", sub:"Результаты, рейтинг и Pro-подписка привязываются к вашему Telegram.", tg:"Войти через Telegram", waiting:"Откройте бота в Telegram и нажмите Start…", retry:"Повторить", guest:"Пока как гость", expired:"Ссылка устарела. Попробуйте снова.", error:"Не удалось подключиться к серверу. Проверьте интернет." },
  kril: { title:"Ҳисобингизга киринг", sub:"Натижаларингиз, рейтинг ва Pro обуна Telegram ҳисобингизга боғланади.", tg:"Telegram орқали кириш", waiting:"Telegram'да ботни очинг ва Start тугмасини босинг…", retry:"Қайта уриниш", guest:"Ҳозирча меҳмон сифатида", expired:"Ҳавола эскирди. Қайта уриниб кўринг.", error:"Серверга уланиб бўлмади. Интернетни текширинг." },
};

function NativeLoginScreen({C, lang, onLogin, onGuest}) {
  const L = LOGIN_TEXTS[lang] || LOGIN_TEXTS.uz;
  const [state, setState] = useState("idle"); // idle | waiting | expired | error
  const nonceRef = useRef(null);
  const timerRef = useRef(null);

  const stop = () => { clearInterval(timerRef.current); timerRef.current = null; };
  const poll = async () => {
    const nonce = nonceRef.current; if (!nonce) return;
    try {
      const res = await fetch(API_URL + "/auth/app/poll", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ nonce }) });
      if (res.status === 410) { stop(); nonceRef.current = null; setState("expired"); return; }
      const body = await res.json();
      if (body.status === "ok") { stop(); nonceRef.current = null; onLogin(body); }
    } catch { /* tarmoq uzilishi — keyingi urinishda */ }
  };

  // Telegram'dan ilovaga qaytganda darhol tekshiramiz
  useEffect(() => {
    const h = CapApp.addListener("resume", () => { if (nonceRef.current) poll(); });
    return () => { stop(); h.then(x => x.remove()); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const start = async () => {
    setState("waiting");
    try {
      const res = await fetch(API_URL + "/auth/app/start", { method:"POST", headers:{ "Content-Type":"application/json" }, body:"{}" });
      if (!res.ok) throw new Error(String(res.status));
      const { nonce, botLink } = await res.json();
      nonceRef.current = nonce;
      stop(); timerRef.current = setInterval(poll, 2500);
      try { await AppLauncher.openUrl({ url: botLink }); } catch { window.open(botLink, "_blank"); }
    } catch { setState("error"); }
  };

  const msg = state === "waiting" ? L.waiting : state === "expired" ? L.expired : state === "error" ? L.error : null;
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:28,background:`linear-gradient(160deg,${C.gradStart},${C.gradEnd})`}}>
      <div style={{width:88,height:88,borderRadius:26,background:"white",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 22px",boxShadow:"0 10px 30px rgba(0,0,0,0.2)"}}>
        <span style={{color:"#4F3FD0",fontSize:48,fontWeight:900,fontFamily:"serif",lineHeight:1}}>Q</span>
      </div>
      <h2 style={{color:"white",fontSize:26,fontWeight:900,textAlign:"center",margin:"0 0 8px"}}>{L.title}</h2>
      <p style={{color:"rgba(255,255,255,0.8)",fontSize:14,textAlign:"center",lineHeight:1.6,margin:"0 0 32px"}}>{L.sub}</p>
      <button onClick={start} disabled={state==="waiting"} style={{width:"100%",padding:16,borderRadius:16,border:"none",background:"white",color:"#4F3FD0",fontSize:16,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,opacity:state==="waiting"?0.7:1}}>
        <IC.TelegramIcon size={20} color="#229ED9"/>{state==="expired"||state==="error" ? L.retry : L.tg}
      </button>
      {msg && <p style={{color:"white",fontSize:13,textAlign:"center",margin:"16px 0 0",lineHeight:1.5}}>{msg}</p>}
      <button onClick={onGuest} style={{marginTop:18,background:"transparent",border:"none",color:"rgba(255,255,255,0.85)",fontSize:14,fontWeight:600,cursor:"pointer",padding:10}}>{L.guest}</button>
    </div>
  );
}

// ─── ANDROID: PRO (to'lovsiz) ───
// Google Play qoidasi: raqamli kontent faqat Play Billing orqali sotiladi. Hozircha Android'da xarid yo'q —
// faqat Pro holati va imkoniyatlari ko'rsatiladi (tashqi to'lovga yo'naltirish ham yo'q).
function NativeProScreen({T,C,setScreen,user}) {
  const active = !!(user?.isPro || user?.pro);
  const until = user?.proExpiresAt ? new Date(user.proExpiresAt).toLocaleDateString() : null;
  const feats = [[IC.Bell,T.proNoAds,T.proNoAdsSub],[IC.Clipboard,T.proUnlimited,T.proUnlimitedSub],[IC.BarChart,T.proStats,T.proStatsSub]];
  return <div style={{minHeight:"100vh",background:C.bg}}>
    <div style={{...SC.header(C),textAlign:"center",padding:"52px 20px 28px"}}>
      <button onClick={()=>setScreen("profile")} style={{position:"absolute",left:16,top:52,background:"rgba(255,255,255,0.15)",border:"none",width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}><IC.ArrowLeft size={18} color="white"/></button>
      <div style={{display:"flex",justifyContent:"center",marginBottom:10}}><IC.Diamond size={44} color="white"/></div>
      <h2 style={{color:"white",fontSize:24,fontWeight:900,margin:0}}>{T.proTitle}</h2>
      <p style={{color:"rgba(255,255,255,0.8)",fontSize:13,margin:"6px 0 0"}}>{T.proSubtitle}</p>
    </div>
    <div style={{padding:20}}>
      <Card C={C} style={{marginBottom:16,textAlign:"center",padding:20}}>
        <div style={{fontSize:16,fontWeight:800,color:active?C.success:C.text}}>{active ? `Pro ✓${until?` · ${until}`:""}` : T.proNativeSoon}</div>
      </Card>
      {feats.map(([I,t,sub])=><Card key={t} C={C} style={{marginBottom:10,display:"flex",alignItems:"center",gap:14,padding:"14px 16px"}}>
        <div style={{width:40,height:40,borderRadius:12,background:C.primary+"18",display:"flex",alignItems:"center",justifyContent:"center"}}><I size={20} color={C.primary}/></div>
        <div><div style={{fontWeight:700,fontSize:14,color:C.text}}>{t}</div><div style={{fontSize:12,color:C.subtext}}>{sub}</div></div>
      </Card>)}
    </div>
  </div>;
}

function ProScreen({T,C,setScreen,addToast,setNotifs,notifSettings,api,refreshMe}) {
  const [plan,setPlan]=useState("month1");
  // Online: GET /payments/plans → { plans:[{id,days,uzs,uzsFinal,stars}], discount, card }
  const [remote,setRemote]=useState(null);
  const [busy,setBusy]=useState(false);
  useEffect(()=>{
    if(!api) return;
    api.get('/payments/plans').then(setRemote).catch(()=>{});
  },[api]);
  const rp=api?remote:null;

  // step: "plans" | "payment" | "pending"
  const [step,setStep]=useState("plans");

  // To'lov uchun
  const [receipt,setReceipt]=useState(null);      // yuklangan fayl/rasm
  const [receiptPreview,setReceiptPreview]=useState(null); // preview URL
  const fileInputRef=useRef();

  // Chegirmali narxlar
  const rawPrices = {week:9900, month1:29900, month2:49900};
  const planMeta = {week:{labelKey:"proWeekly",badge:null}, month1:{labelKey:"proMonth1",badge:T.proPopular}, month2:{labelKey:"proMonth2",badge:T.proBest}};
  const plans = rp?.plans?.length
    ? rp.plans.map(p=>({id:p.id, labelKey:planMeta[p.id]?.labelKey||"proMonthly", days:p.days, badge:planMeta[p.id]?.badge||null, original:p.uzs, final:p.uzsFinal, saved:p.uzs-p.uzsFinal, stars:p.stars}))
    : [
    {id:"week",   labelKey:"proWeekly",  days:7,  badge:null,          ...calcDiscounted(rawPrices.week)},
    {id:"month1", labelKey:"proMonth1",  days:30, badge:T.proPopular,  ...calcDiscounted(rawPrices.month1)},
    {id:"month2", labelKey:"proMonth2",  days:60, badge:T.proBest,     ...calcDiscounted(rawPrices.month2)},
  ];
  // Chegirma: online — backenddan (applied — hozir amalda), offline — DISCOUNT
  const disc = rp?.discount || DISCOUNT;
  const discOn = rp ? !!(rp.discount?.applied ?? (disc.active && disc.percent > 0)) : (DISCOUNT.active && DISCOUNT.percent > 0);
  const daysLeft = rp ? (disc.endDate ? Math.max(0, Math.ceil((new Date(disc.endDate) - new Date()) / 86400000)) : null) : discountDaysLeft();

  const features=[
    {Icon:IC.Bell,      color:"#fff", bg:C.primary,   lk:"proNoAds"},
    {Icon:IC.Clipboard, color:"#fff", bg:"#0EA5E9",   lk:"proUnlimited"},
    {Icon:IC.BarChart,  color:"#fff", bg:"#6366F1",   lk:"proStats"},
  ];

  const selectedPlan=plans.find(p=>p.id===plan)||plans[0];

  // Karta raqami (admin o'zgartiradi; online — /payments/plans → card)
  const CARD_NUMBER = rp?.card?.number || "8600 1234 5678 9012";
  const CARD_OWNER  = rp?.card?.owner || "IQUEST";

  // Telegram Stars orqali to'lov: invoice → openInvoice → 'paid' bo'lsa /me qayta olinadi
  const payStars=()=>{
    if(!api||busy) return;
    setBusy(true);
    api.post('/payments/stars/invoice',{plan}).then(({invoiceLink})=>{
      setBusy(false);
      const tg=window.Telegram?.WebApp;
      if(!tg?.openInvoice){ window.open(invoiceLink,"_blank"); return; }
      tg.openInvoice(invoiceLink,(status)=>{
        if(status==="paid"){
          // Pro webhook orqali beriladi — biroz kechikish bo'lishi mumkin, shuning uchun ikki marta so'raymiz
          refreshMe?.(); setTimeout(()=>refreshMe?.(),2500);
          addToast("🎉 Pro obuna faollashtirildi!","success");
          setScreen("profile");
        } else if(status==="failed") addToast("To'lov amalga oshmadi","error");
      });
    }).catch(()=>{ setBusy(false); addToast("Stars to'lovini boshlab bo'lmadi","error"); });
  };

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

    // Online: POST /payments/receipt (multipart: plan + file). Tasdiq admin orqali, bildirishnoma serverdan keladi
    if(api){
      if(busy) return;
      setBusy(true);
      const fd=new FormData();
      fd.append("plan",plan);
      fd.append("file",receipt);
      api.upload('/payments/receipt',fd).then(()=>{
        setBusy(false);
        setStep("pending");
        addToast("To'lov chekingiz yuborildi. Tekshirilmoqda ⏳","info");
      }).catch(err=>{
        setBusy(false);
        addToast(err.status===409?"Sizda tekshirilayotgan chek bor":err.status===413?"Fayl juda katta (≤ 5 MB)":err.status===400?"Faqat JPG, PNG, WEBP yoki PDF (≤ 5 MB)":"Chek yuborilmadi","error");
      });
      return;
    }

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
              -{disc.percent}% tejaydingiz
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
        {discOn && (
          <div style={{background:"linear-gradient(135deg,#EF4444,#F59E0B)",borderRadius:16,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
            <IC.Celebrate size={24} color="white"/>
            <div style={{flex:1}}>
              <div style={{color:"white",fontWeight:800,fontSize:14}}>{disc.label} — -{disc.percent}%</div>
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
              <div style={{color:"white",fontWeight:900,fontSize:20,lineHeight:1}}>-{disc.percent}%</div>
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
                    -{disc.percent}%
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

        {/* Telegram Stars — faqat online (invoice backend orqali yaratiladi) */}
        {api && selectedPlan.stars > 0 && (
          <button onClick={payStars} disabled={busy}
            style={{width:"100%",marginTop:10,padding:"15px",borderRadius:18,border:`2px solid #F59E0B`,background:"#F59E0B18",color:"#B45309",fontSize:15,fontWeight:800,cursor:busy?"wait":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:busy?0.7:1}}>
            <IC.Star size={16} color="#F59E0B"/>Telegram Stars — {selectedPlan.stars} ⭐
          </button>
        )}

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
  {id:1, type:"exam",   read:false, time:2,  titleKey:"notifExam",  body:{uz:"Bugun IQ test topshirishni rejalashtirgan edingiz!", ru:"Сегодня вы планировали пройти IQ-тест!",        kril:"Бугун IQ тест топширишни режалаштирган эдингиз!"}},
  {id:2, type:"result", read:false, time:15, titleKey:"notifResult", body:{uz:"5-to'plamdan 90% natija oldingiz 🎉",               ru:"Вы набрали 90% в наборе 5 🎉",                  kril:"5-тўпламдан 90% натижа олдингиз 🎉"}},
  {id:3, type:"new",    read:false, time:60, titleKey:"notifNew",   body:{uz:"23-to'plam yangilandi. Ko'rib chiqing!",             ru:"Набор 23 обновлён. Посмотрите!",                 kril:"23-тўплам янгиланди. Кўриб чиқинг!"}},
  {id:4, type:"daily",  read:true,  time:120,titleKey:"notifDaily", body:{uz:"Kunlik maqsadingiz: 150 jumboq. Hali 80 ta qoldi.",  ru:"Ваша дневная цель: 150 задач. Осталось 80.",     kril:"Кунлик мақсадингиз: 150 жумбоқ. Яна 80 та қолди."}},
  {id:5, type:"result", read:true,  time:180,titleKey:"notifResult",body:{uz:"Mashq seriyangiz 12 ga yetdi. Zo'r!",                ru:"Ваша серия достигла 12. Отлично!",               kril:"Машқ сериянгиз 12 га етди. Зўр!"}},
  {id:6, type:"new",    read:true,  time:300,titleKey:"notifNew",   body:{uz:"5 ta yangi to'plam qo'shildi. Sinab ko'ring!",       ru:"Добавлено 5 новых наборов. Попробуйте!",         kril:"5 та янги тўплам қўшилди. Синаб кўринг!"}},
  {id:7, type:"daily",  read:true,  time:1440,titleKey:"notifDaily",body:{uz:"Kecha 3 ta to'plamni yakunladingiz. Bugun davom eting!", ru:"Вчера вы завершили 3 набора. Продолжайте!",  kril:"Кеча 3 та тўпламни якунладингиз. Бугун давом этинг!"}},
];

const NOTIF_ICONS = {
  exam:   { Icon: IC.Clock,         bg:"#ECEAFB", color:"#4F3FD0" },
  result: { Icon: IC.CheckCircle,   bg:"#DCFCE7", color:"#22C55E" },
  new:    { Icon: IC.Ticket,        bg:"#FEF3C7", color:"#F59E0B" },
  daily:  { Icon: IC.Bell,          bg:"#F5F3FF", color:"#8B5CF6" },
};

// ─── TOAST ───
function Toast({toasts}) {
  return (
    <div style={{position:"fixed",top:16,left:16,right:16,width:"calc(100% - 32px)",zIndex:999,pointerEvents:"none",display:"flex",flexDirection:"column",gap:8}}>
      {toasts.map(t=>(
        <div key={t.id} style={{background:t.type==="success"?"#22C55E":t.type==="error"?"#EF4444":"#4F3FD0",color:"white",borderRadius:14,padding:"13px 16px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 24px rgba(0,0,0,0.25)",animation:"slideDown 0.3s ease"}}>
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
    title:`${T.ticket} ${t.id}`,
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

  const allSigns=GUIDE_CATEGORIES.flatMap((cat,ci)=>
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
    sub:s.ticketId==="rules"?`💡 ${T.rules}`:`${T.ticket} ${s.ticketId}`,
    isRule:s.ticketId==="rules",
  }));

  const q=query.trim().toLowerCase();

  const match=(item)=> q.length<2 ? false :
    (item.title||"").toLowerCase().includes(q)||
    (item.sub||"").toLowerCase().includes(q)||
    (item.type==="ticket"&&`${T.ticket} ${item.id}`.toLowerCase().includes(q))||
    (item.type==="ticket"&&String(item.id)===q);

  const ticketResults  = (filter==="all"||filter==="tickets")   ? allTickets.filter(match)   : [];
  const questionResults= (filter==="all"||filter==="questions") ? allQuestions.filter(match) : [];
  const signResults    = (filter==="all"||filter==="signs")     ? allSigns.filter(match)     : [];
  const savedResults   = (filter==="all"||filter==="saved")     ? savedItems.filter(match)   : [];
  const total=ticketResults.length+questionResults.length+signResults.length+savedResults.length;

  const popular=[
    {label:T.ticket+" 1",   q:(T.ticket+" 1").toLowerCase()},
    {label:"IQ",            q:"iq"},
    {label:"2, 4, 8",       q:"2, 4, 8"},
    {label:"Matritsa",      q:"matritsa"},
    {label:"Analogiya",     q:"analogiya"},
  ];

  const filters=[
    ["all",T.filterAll],
    ["tickets",T.filterTickets],
    ["questions",T.filterQuestions],
    ["signs",T.rules],
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
                      <div style={{fontSize:11,color:C.subtext}}>{s.ticketId==="rules"?<span style={{display:"flex",alignItems:"center",gap:4}}><IC.Lightbulb size={11} color={C.subtext}/>{T.rules}</span>:`${T.ticket} ${s.ticketId}`}</div>
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
                    <div style={{fontSize:11,fontWeight:700,color:C.subtext,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px"}}>{T.rules}</div>
                    {signResults.map((item,i)=>(
                      <ResultCard key={item.key||i} onClick={()=>setScreen("rules")}>
                        <div style={{width:36,height:36,borderRadius:11,background:item.catBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}><TopicIcon icon={item.catIcon} size={18} color={item.catColor}/></div>
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
              {q.ticketId==="rules"?<span style={{display:"flex",alignItems:"center",gap:4}}><IC.Lightbulb size={11} color={C.subtext}/>{T.rules}</span>:`${T.ticket} ${q.ticketId} · #${q.questionId}`}
            </span>
          </div>
          <IC.Bookmark size={16} color="#FFD700"/>
        </div>
        <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:20,lineHeight:1.5}}>
          {typeof q.question==="object"?(q.question[lang]||q.question.uz):getQ(q.question,lang)}
        </div>
        {q.sign!=null&&<div style={{textAlign:"center",marginBottom:20,background:"#F1EFFD",borderRadius:20,padding:16}}><SignSVG item={q.sign}/></div>}
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
                      {isRule?<span style={{display:"flex",alignItems:"center",gap:4}}><IC.Lightbulb size={11} color={C.subtext}/>{T.rules}</span>:`${T.ticket} ${q.ticketId}`}
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
              {q.sign!=null&&<div style={{background:"#F1EFFD",borderRadius:12,padding:"10px",marginBottom:10,display:"flex",justifyContent:"center"}}><SignSVG item={q.sign}/></div>}
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
function NotificationsScreen({setScreen,notifs,setNotifs,notifSettings,setNotifSettings,T,C,lang,api,setNotifUnread,addToast}) {
  const [tab,setTab]=useState("all");
  const [showSettings,setShowSettings]=useState(false);

  // Filter notifs by both tab AND settings (sozlamada yo'q turlar — payment, referral — doim ko'rinadi)
  const typeOn=(type)=>notifSettings[type]!==false;
  const visibleNotifs=notifs.filter(n=>{
    if(!typeOn(n.type)) return false;
    if(tab==="unread") return !n.read;
    return true;
  });
  const unreadCount=notifs.filter(n=>!n.read&&typeOn(n.type)).length;

  // Online: POST /notifications/read-all va /notifications/:id/read (local:true — faqat lokal)
  const markAll=()=>{
    setNotifs(notifs.map(n=>({...n,read:true})));
    if(!api) return;
    setNotifUnread?.(0);
    api.post('/notifications/read-all').catch(()=>addToast?.("Server bilan aloqa yo'q","error"));
  };
  const markOne=(id)=>{
    const n=notifs.find(x=>x.id===id);
    setNotifs(notifs.map(n=>n.id===id?{...n,read:true}:n));
    if(!api||!n||n.read||n.local) return;
    setNotifUnread?.(u=>Math.max(0,(u||0)-1));
    api.post(`/notifications/${id}/read`).catch(()=>{});
  };
  // Backendda o'chirish endpointi yo'q — online'da o'qilgan deb belgilab, lokal ro'yxatdan olib tashlaymiz
  const deleteOne=(id)=>{ markOne(id); setNotifs(p=>p.filter(n=>n.id!==id)); };

  const timeLabel=(mins)=>{
    if(mins<1) return T.justNow;
    if(mins<60) return `${mins} ${T.minsAgo}`;
    if(mins<1440) return `${Math.floor(mins/60)} ${T.hoursAgo}`;
    return `${Math.floor(mins/1440)} kun oldin`;
  };

  const settingsList=[
    {key:"daily",  lk:"notifDaily",  desc:{uz:"Kunlik maqsad va eslatmalar",ru:"Ежедневные цели и напоминания",kril:"Кунлик мақсад ва эслатмалар"}},
    {key:"result", lk:"notifResult", desc:{uz:"Test va to'plam natijalari",ru:"Результаты тестов и наборов",kril:"Тест ва тўплам натижалари"}},
    {key:"new",    lk:"notifNew",    desc:{uz:"Yangi to'plamlar va jumboqlar",ru:"Новые наборы и задачи",kril:"Янги тўпламлар ва жумбоқлар"}},
    {key:"exam",   lk:"notifExam",   desc:{uz:"IQ test eslatmalari",ru:"Напоминания об IQ-тесте",kril:"IQ тест эслатмалари"}},
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
                  {s.key==="exam"&&<IC.Clock size={18} color={notifSettings[s.key]?"#4F3FD0":C.gray400}/>}
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
                    <span style={{fontWeight:700,fontSize:13,color:C.text}}>{T[n.titleKey]||T[n.type]||n.titleKey}</span>
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
  { icon:"numbers",   title:{uz:"Sonlar qatori",ru:"Числовые ряды",kril:"Сонлар қатори"}, count:24, color:"#4F3FD0", bg:"#ECEAFB" },
  { icon:"pattern",   title:{uz:"Naqsh va matritsalar",ru:"Закономерности и матрицы",kril:"Нақш ва матрицалар"}, count:30, color:"#0E6E8C", bg:"#E3F2F7" },
  { icon:"verbal",    title:{uz:"So'z va analogiyalar",ru:"Слова и аналогии",kril:"Сўз ва аналогиялар"}, count:20, color:"#8A5A00", bg:"#FBF1DD" },
  { icon:"logic",     title:{uz:"Mantiqiy xulosa",ru:"Логические выводы",kril:"Мантиқий хулоса"}, count:18, color:"#7C3AED", bg:"#F5F3FF" },
  { icon:"spatial",   title:{uz:"Fazoviy tasavvur",ru:"Пространственное мышление",kril:"Фазовий тасаввур"}, count:22, color:"#EC4899", bg:"#FCE7F3" },
  { icon:"memory",    title:{uz:"Xotira",ru:"Память",kril:"Хотира"}, count:12, color:"#077350", bg:"#E5F3EC" },
  { icon:"attention", title:{uz:"Diqqat",ru:"Внимание",kril:"Диққат"}, count:14, color:"#B42F35", bg:"#FBE9EA" },
  { icon:"speedcalc", title:{uz:"Tezkor hisob",ru:"Быстрый счёт",kril:"Тезкор ҳисоб"}, count:16, color:"#F97316", bg:"#FFEDD5" },
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
              <TopicIcon icon={topic.icon} size={22} color={topic.color}/>
            </div>
            <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:4,lineHeight:1.3}}>
              {topic.title[lang]||topic.title.uz}
            </div>
            <div style={{fontSize:11,color:topic.color,fontWeight:600}}>
              {topic.count} {T.questions}
            </div>
            <div style={{marginTop:8,height:4,background:C.gray200,borderRadius:100}}>
              <div style={{height:"100%",width:`${[65,40,0,80,55,0,30,70][i]||0}%`,background:topic.color,borderRadius:100}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RULES SCREEN ───
const GUIDE_CATEGORIES = [
  {
    id:"numbers",
    icon:"numbers",
    color:"#4F3FD0", bg:"#ECEAFB",
    title:{uz:"Sonlar qatori",ru:"Числовые ряды",kril:"Сонлар қатори"},
    desc:{uz:"Qatordagi qonuniyatni topib, keyingi sonni aniqlash",ru:"Найти закономерность ряда и определить следующее число",kril:"Қатордаги қонуниятни топиб, кейинги сонни аниқлаш"},
    count:5,
    items:[
      {uz:"Avval qo'shni sonlar farqini yozing",ru:"Сначала выпишите разности соседних чисел",kril:"Аввал қўшни сонлар фарқини ёзинг"},
      {uz:"Farq o'zgarmasa — arifmetik, nisbat o'zgarmasa — geometrik qator",ru:"Постоянная разность — арифметический ряд, постоянное отношение — геометрический",kril:"Фарқ ўзгармаса — арифметик, нисбат ўзгармаса — геометрик қатор"},
      {uz:"Farqlarning o'zi ham qator bo'lishi mumkin (+3, +5, +7…)",ru:"Разности тоже могут образовывать ряд (+3, +5, +7…)",kril:"Фарқларнинг ўзи ҳам қатор бўлиши мумкин (+3, +5, +7…)"},
      {uz:"Ikki oldingi sonning yig'indisini tekshiring (Fibonachchi)",ru:"Проверьте сумму двух предыдущих (Фибоначчи)",kril:"Икки олдинги соннинг йиғиндисини текширинг (Фибоначчи)"},
      {uz:"Juft va toq o'rinlarni alohida ko'rib chiqing",ru:"Рассмотрите чётные и нечётные позиции отдельно",kril:"Жуфт ва тоқ ўринларни алоҳида кўриб чиқинг"},
    ]
  },
  {
    id:"pattern",
    icon:"pattern",
    color:"#0E6E8C", bg:"#E3F2F7",
    title:{uz:"Naqsh va matritsalar",ru:"Закономерности и матрицы",kril:"Нақш ва матрицалар"},
    desc:{uz:"3×3 jadvalda yetishmayotgan katakni topish",ru:"Найти недостающую клетку в таблице 3×3",kril:"3×3 жадвалда етишмаётган катакни топиш"},
    count:4,
    items:[
      {uz:"Avval qatorlarni, keyin ustunlarni solishtiring",ru:"Сравните сначала строки, затем столбцы",kril:"Аввал қаторларни, кейин устунларни солиштиринг"},
      {uz:"Soni, shakli, rangi va yo'nalishi — alohida-alohida",ru:"Количество, форма, цвет и направление — по отдельности",kril:"Сони, шакли, ранги ва йўналиши — алоҳида-алоҳида"},
      {uz:"Uchinchi katak ko'pincha birinchi ikkitasining yig'indisi yoki farqi",ru:"Третья клетка часто — сумма или разность первых двух",kril:"Учинчи катак кўпинча биринчи иккитасининг йиғиндиси ёки фарқи"},
      {uz:"Javobni variantlardan emas, qoidadan boshlab toping",ru:"Выводите ответ из правила, а не из вариантов",kril:"Жавобни вариантлардан эмас, қоидадан бошлаб топинг"},
    ]
  },
  {
    id:"verbal",
    icon:"verbal",
    color:"#8A5A00", bg:"#FBF1DD",
    title:{uz:"So'z va analogiyalar",ru:"Слова и аналогии",kril:"Сўз ва аналогиялар"},
    desc:{uz:"So'zlar orasidagi bog'liqlikni topish",ru:"Найти связь между словами",kril:"Сўзлар орасидаги боғлиқликни топиш"},
    count:3,
    items:[
      {uz:"Juftlik orasidagi munosabatni bitta gap bilan ayting",ru:"Сформулируйте связь пары одной фразой",kril:"Жуфтлик орасидаги муносабатни битта гап билан айтинг"},
      {uz:"Munosabat turlari: vosita–vazifa, qism–butun, sabab–oqibat",ru:"Типы связей: предмет–назначение, часть–целое, причина–следствие",kril:"Муносабат турлари: восита–вазифа, қисм–бутун, сабаб–оқибат"},
      {uz:"Ortiqchasini topishda umumiy guruhni aniqlang",ru:"Для поиска лишнего определите общую группу",kril:"Ортиқчасини топишда умумий гуруҳни аниқланг"},
    ]
  },
  {
    id:"logic",
    icon:"logic",
    color:"#7C3AED", bg:"#F5F3FF",
    title:{uz:"Mantiqiy xulosa",ru:"Логические выводы",kril:"Мантиқий хулоса"},
    desc:{uz:"Berilgan shartlardan to'g'ri xulosa chiqarish",ru:"Сделать верный вывод из условий",kril:"Берилган шартлардан тўғри хулоса чиқариш"},
    count:4,
    items:[
      {uz:"Faqat berilgan ma'lumotga tayaning, taxmin qo'shmang",ru:"Опирайтесь только на данные, не добавляйте догадки",kril:"Фақат берилган маълумотга таянинг, тахмин қўшманг"},
      {uz:"\"Barcha\", \"ba'zi\", \"hech bir\" so'zlariga diqqat qiling",ru:"Следите за словами «все», «некоторые», «ни один»",kril:"«Барча», «баъзи», «ҳеч бир» сўзларига диққат қилинг"},
      {uz:"Shartlarni chizma yoki doiralar bilan tasvirlang",ru:"Изобразите условия схемой или кругами",kril:"Шартларни чизма ёки доиралар билан тасвирланг"},
      {uz:"Tuzoq savollarda birlik miqdorini hisoblang (1 mashina — 1 detal)",ru:"В задачах-ловушках считайте на единицу (1 станок — 1 деталь)",kril:"Тузоқ саволларда бирлик миқдорини ҳисобланг (1 машина — 1 детал)"},
    ]
  },
  {
    id:"spatial",
    icon:"spatial",
    color:"#EC4899", bg:"#FCE7F3",
    title:{uz:"Fazoviy tasavvur",ru:"Пространственное мышление",kril:"Фазовий тасаввур"},
    desc:{uz:"Shakllarni xayolda aylantirish va solishtirish",ru:"Мысленно вращать и сравнивать фигуры",kril:"Шаклларни хаёлда айлантириш ва солиштириш"},
    count:3,
    items:[
      {uz:"Shaklning bitta o'ziga xos belgisini tanlab, uni kuzating",ru:"Выберите одну особую деталь фигуры и следите за ней",kril:"Шаклнинг битта ўзига хос белгисини танлаб, уни кузатинг"},
      {uz:"Aylantirish va ko'zgu aksini farqlang",ru:"Отличайте поворот от зеркального отражения",kril:"Айлантириш ва кўзгу аксини фарқланг"},
      {uz:"Burchaklar va tomonlar sonini sanang",ru:"Считайте углы и стороны",kril:"Бурчаклар ва томонлар сонини сананг"},
    ]
  },
  {
    id:"time",
    icon:"tip",
    color:"#077350", bg:"#E5F3EC",
    title:{uz:"Vaqtni boshqarish",ru:"Управление временем",kril:"Вақтни бошқариш"},
    desc:{uz:"15 daqiqalik testda sokin va tekis ishlash",ru:"Спокойная и ровная работа в 15-минутном тесте",kril:"15 дақиқалик тестда сокин ва текис ишлаш"},
    count:3,
    items:[
      {uz:"Bitta savolga 1 daqiqadan ko'p vaqt sarflamang",ru:"Не тратьте больше минуты на один вопрос",kril:"Битта саволга 1 дақиқадан кўп вақт сарфламанг"},
      {uz:"Qiyin savolni o'tkazib, keyin qayting",ru:"Пропустите сложный вопрос и вернитесь позже",kril:"Қийин саволни ўтказиб, кейин қайтинг"},
      {uz:"Juda tez javob berish natijani ishonchsiz qiladi",ru:"Слишком быстрые ответы делают результат ненадёжным",kril:"Жуда тез жавоб бериш натижани ишончсиз қилади"},
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
    const cat=GUIDE_CATEGORIES[selected];
    return (
      <div style={{minHeight:"100vh",background:C.bg}}>
        {/* Header */}
        <div style={{background:`linear-gradient(135deg,${cat.color},${cat.color}bb)`,padding:"52px 20px 24px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <button onClick={()=>{setSelected(null);setExpanded(null);}}
              style={{width:36,height:36,borderRadius:12,background:"rgba(255,255,255,0.2)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <IC.ArrowLeft size={18} color="white"/>
            </button>
            <TopicIcon icon={cat.icon} size={26} color="white"/>
            <h2 style={{color:"white",fontSize:18,fontWeight:800,margin:0,flex:1}}>
              {cat.title[lang]||cat.title.uz}
            </h2>
          </div>
          <p style={{color:"rgba(255,255,255,0.8)",fontSize:13,margin:0,lineHeight:1.5}}>
            {cat.desc[lang]||cat.desc.uz}
          </p>
          <div style={{marginTop:12,display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"5px 12px"}}>
            <span style={{color:"white",fontSize:12,fontWeight:700}}>{cat.count} {T.strategies}</span>
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
                    {T.tipHint}
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
      <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,padding:"52px 20px 24px"}}>
        <h2 style={{color:"white",fontSize:22,fontWeight:800,margin:0}}>{T.rulesTitle}</h2>
        <p style={{color:"rgba(255,255,255,0.7)",fontSize:13,margin:"4px 0 0"}}>{T.rulesSub}</p>
        <div style={{marginTop:12,display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.15)",borderRadius:20,padding:"5px 14px"}}>
          <span style={{color:"white",fontSize:12,fontWeight:700}}>{GUIDE_CATEGORIES.length} {T.sectionsWord} • {GUIDE_CATEGORIES.reduce((n,c)=>n+c.count,0)} {T.strategies}</span>
        </div>
      </div>
      <div style={{padding:16,display:"flex",flexDirection:"column",gap:10}}>
        {GUIDE_CATEGORIES.map((cat,i)=>(
          <div key={i} onClick={()=>setSelected(i)}
            style={{background:C.card,borderRadius:18,padding:"16px 18px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",border:`1px solid ${C.cardBorder}`,boxShadow:"0 1px 6px rgba(0,0,0,0.05)",transition:"transform 0.15s"}}>
            <div style={{width:50,height:50,borderRadius:16,background:cat.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>
              <TopicIcon icon={cat.icon} size={24} color={cat.color}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:3}}>
                {cat.title[lang]||cat.title.uz}
              </div>
              <div style={{fontSize:11,color:C.subtext,lineHeight:1.4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                {cat.desc[lang]||cat.desc.uz}
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
  const dark = tg?.colorScheme === "dark";

  useEffect(() => {
    if (!tg) return;
    tg.expand();
    tg.ready();
  }, []);

  // Header va background rangini dark/light ga qarab sozlash
  useEffect(() => {
    if (!tg) return;
    try { tg.setHeaderColor(dark ? "#26224A" : "#4F3FD0"); } catch {}
    try { tg.setBackgroundColor(dark ? "#0F172A" : "#F8FAFC"); } catch {}
  }, [dark, tg]);

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
  const showMainButton = (text, onClick, color = "#4F3FD0") => {
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
    if (!initData || !API_URL) return null;
    try {
      // Telegram'da referal start_param orqali (initData ichida) keladi; brauzerda — ?ref=CODE
      let ref = null;
      try { ref = new URLSearchParams(window.location.search).get('ref'); } catch { ref = null; }
      const res = await apiPost('/auth/telegram', ref ? { initData, ref: ref.slice(0, 32) } : { initData });
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
    return persist.get('auth_token');
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
      persist.set('auth_token', res.token);
      // Backend dan sozlamalarni olamiz
      applyApiSettings(res.settings);
      if (res.user) setUser(prev => mapApiUser(res.user, prev));
      setToken(res.token);
    }).catch(err => console.warn('Backend login failed, using offline mode:', err));
  }, [tgUser?.id]);

  // Android: bot orqali kirish yoki mehmon rejimi (API_URL bo'lmasa login ekrani ko'rsatilmaydi)
  const [guest, setGuest] = useState(() => persist.get("guest_mode") === "1");
  const needNativeLogin = IS_NATIVE && !!API_URL && !token && !guest;
  const onNativeLogin = (res) => {
    persist.set('auth_token', res.token);
    persist.del("guest_mode");
    applyApiSettings(res.settings);
    if (res.user) setUser(prev => mapApiUser(res.user, prev));
    setToken(res.token);
  };
  const continueAsGuest = () => { persist.set("guest_mode", "1"); setGuest(true); };

  // Token bor va API_URL berilgan bo'lsa — online rejim (aks holda null → mock ma'lumotlar)
  const api = useMemo(() => makeApi(token), [token]);
  // Bugungi sarf (GET /me → usage): { practiceQuestions, iqTests }
  const [usage, setUsage] = useState(null);

  // GET /me — user, limitlar, usage. 401 bo'lsa token eskirgan → offline rejimga qaytamiz
  const refreshMe = () => {
    if (!api) return Promise.resolve(null);
    return api.get('/me').then(res => {
      applyApiSettings(res.settings);
      if (res.limits) Object.assign(LIMITS, res.limits);
      if (res.usage) setUsage(res.usage);
      if (res.user) setUser(prev => mapApiUser(res.user, prev));
      return res;
    }).catch(err => {
      if (err.status === 401) { persist.del('auth_token'); setToken(null); }
      console.warn('GET /me xatosi:', err);
      return null;
    });
  };

  // Onboardingni faqat birinchi marta ko'rsatish
  // localStorage ishlatish mumkin emas (Telegram Mini App da cheklov bor)
  // Shuning uchun sessionStorage ishlatamiz
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !persist.get("ob_done");
  });

  const [activeTicket, setActiveTicket] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [lastTestResult, setLastTestResult] = useState(null);
  const [examResult, setExamResult] = useState(null);

  // Telegram mavzusiga mos holda dark mode
  const [dark, setDark] = useState(isDark);
  const [lang, setLang] = useState("uz");
  const [notifs, setNotifs] = useState(INIT_NOTIFS);
  const [notifUnread, setNotifUnread] = useState(null); // online: backend `unread` soni
  const [notifSettings, setNotifSettingsRaw] = useState({ daily: true, result: true, new: true, exam: true });
  const [toasts, setToasts] = useState([]);
  const [savedQuestions, setSavedQuestionsRaw] = useState([]);
  const [showLangModal, setShowLangModal] = useState(false);

  // Backend bildirishnomasi → ekran formati (time — necha daqiqa oldin)
  const mapNotif = (n) => ({
    id: n.id, type: n.type, read: n.read, titleKey: n.titleKey,
    body: n.body || {}, time: Math.max(0, Math.round((Date.now() - new Date(n.createdAt).getTime()) / 60000)),
  });
  const loadNotifs = () => {
    if (!api) return;
    api.get('/notifications').then(res => {
      // Lokal (masalan IQ test natijasi) bildirishnomalarni saqlab qolamiz
      setNotifs(p => [...p.filter(n => n.local), ...(res.items || []).map(mapNotif)]);
      setNotifUnread(res.unread ?? 0);
    }).catch(err => console.warn('GET /notifications xatosi:', err));
  };

  // Online bo'lganda: /me, saqlanganlar, bildirishnoma sozlamalari va ro'yxati
  useEffect(() => {
    if (!api) return;
    refreshMe();
    api.get('/me/saved').then(res => {
      const remote = (res.items || []).map(i => ({ ...(i.data || {}), key: i.key }));
      setSavedQuestionsRaw(p => [...remote, ...p.filter(s => !remote.some(r => r.key === s.key))]);
    }).catch(err => console.warn('GET /me/saved xatosi:', err));
    api.get('/notifications/prefs').then(p => setNotifSettingsRaw(s => ({ ...s, ...p }))).catch(() => {});
    loadNotifs();
  }, [api]); // eslint-disable-line react-hooks/exhaustive-deps -- faqat login/token o'zgarganda

  // Saqlanganlar: lokal holat — ko'rsatish manbai; backend bilan fon rejimida sinxronlanadi
  const setSavedQuestions = (next) => {
    const prev = savedQuestions;
    setSavedQuestionsRaw(next);
    if (!api) return;
    const nk = new Set(next.map(s => s.key)), pk = new Set(prev.map(s => s.key));
    const reqs = [
      ...prev.filter(s => !nk.has(s.key)).map(s => api.del('/me/saved/' + encodeURIComponent(s.key))),
      ...next.filter(s => !pk.has(s.key)).map(s => api.put('/me/saved/' + encodeURIComponent(s.key), { data: s })),
    ];
    Promise.all(reqs).catch(() => addToast({ uz: "Saqlanganlar sinxronlanmadi", ru: "Не удалось синхронизировать", kril: "Сақланганлар синхронланмади" }[lang], "error"));
  };

  // Bildirishnoma sozlamalari: online bo'lsa PUT /notifications/prefs
  const setNotifSettings = (next) => {
    setNotifSettingsRaw(next);
    if (api) api.put('/notifications/prefs', next).catch(() => addToast("Sozlamalar saqlanmadi", "error"));
  };

  // Natijani backendga yozish (POST /results) — fire-and-forget, user (xp) yangilanadi
  const postResult = (body) => {
    if (!api) return;
    api.post('/results', body).then(res => {
      if (res?.user) setUser(prev => mapApiUser(res.user, prev));
      if (body.kind === 'practice') setUsage(u => u ? { ...u, practiceQuestions: (u.practiceQuestions || 0) + body.total } : u);
    }).catch(err => {
      console.warn('POST /results xatosi:', err);
      addToast(err.status === 403 ? "Natija saqlanmadi: Pro kerak" : "Natija serverga saqlanmadi", "error");
    });
  };

  // Ekran o'zgarganda Telegram Back button boshqaruvi
  const setScreen = (s) => {
    setPrevScreen(screen);
    setScreenRaw(s);
  };

  // Qaysi ekranlarda Telegram Back button ko'rsatiladi
  const rootScreens = ["home", "tickets", "tests", "exam", "stats", "rating", "profile"];
  // Android tizim "orqaga" tugmasi uchun joriy ishlovchi (root ekranda null → ilovadan chiqish)
  const backRef = useRef(null);
  useEffect(() => {
    if (!IS_NATIVE) return;
    const h = CapApp.addListener("backButton", () => {
      if (backRef.current) backRef.current();
      else if (screen !== "home") setScreenRaw("home");
      else CapApp.exitApp();
    });
    return () => { h.then(x => x.remove()); };
  }, [screen]);

  useEffect(() => {
    if (rootScreens.includes(screen)) {
      backRef.current = null;
      hideBackButton();
    } else {
      showBackButton(backRef.current = () => {
        // Telegram back button bosilganda oldingi ekranga qaytish
        if (screen === "ticket-quiz") setScreen("tickets");
        else if (screen === "test-quiz") setScreen("tests");
        else if (screen === "exam-quiz") setScreen("exam");
        else if (screen === "ticket-result") setScreen("tickets");
        else if (screen === "exam-result") setScreen("exam");
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

  // Online: backend `unread` + lokal o'qilmaganlar; offline: ro'yxatdan hisoblanadi
  const unreadCount = api && notifUnread !== null
    ? notifUnread + notifs.filter(n => n.local && !n.read).length
    : notifs.filter(n => !n.read).length;

  // Bildirishnomalar ekrani ochilganda ro'yxatni yangilaymiz
  useEffect(() => {
    if (screen === "notifications") loadNotifs();
  }, [screen]); // eslint-disable-line react-hooks/exhaustive-deps

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
    persist.set("ob_done", "1");
    setShowOnboarding(false);
  };

  // Simulate incoming notification every 30s — faqat offline (demo) rejimda
  useEffect(() => {
    if (!user || api) return;
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
  }, [user, lang, api]);

  const handleExamResult = (result) => {
    setExamResult(result);
    const msg = {
      uz: `IQ test yakunlandi: taxminan ${result.iqLow}–${result.iqHigh}`,
      ru: `IQ-тест завершён: примерно ${result.iqLow}–${result.iqHigh}`,
      kril: `IQ тест якунланди: тахминан ${result.iqLow}–${result.iqHigh}`,
    };
    addToast(msg[lang], "info");
    if (notifSettings.result) {
      // local:true — backendda yo'q (IQ test serverga yozilmaydi), API ga yuborilmaydi
      setNotifs(p => [{ id: Date.now(), local: true, type: "result", read: false, time: 0, titleKey: "notifResult", body: msg }, ...p]);
    }
  };

  const props = { T, C, dark, setDark, lang, setLang, notifs, setNotifs, notifSettings, setNotifSettings, unreadCount, addToast, savedQuestions, setSavedQuestions, setShowLangModal, api, usage, refreshMe, postResult, setNotifUnread };

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
      case "test-result": return <PracticeResultScreen {...props} setScreen={setScreen} result={lastTestResult ?? { correct: 9, total: 12 }} />;
      case "exam": return <ExamScreen {...props} setScreen={setScreen} user={user} />;
      case "exam-quiz": return <ExamQuizScreen {...props} setScreen={setScreen} setExamResult={handleExamResult} user={user} />;
      case "exam-limit-gate": return <ProGate T={T} C={C} setScreen={setScreen} reason="examLimit" onBack={()=>setScreen("exam")}/>;
      case "exam-result": return <ExamResultScreen {...props} setScreen={setScreen} result={examResult ?? iqResult(15, 20)} />;
      case "stats": return <StatsScreen {...props} />;
      case "rating": return <RatingScreen {...props} />;
      case "profile": return <ProfileScreen {...props} setScreen={setScreen} user={user} setUser={setUser} tgUser={tgUser} />;
      case "pro": return IS_NATIVE ? <NativeProScreen {...props} setScreen={setScreen} user={user} /> : <ProScreen {...props} setScreen={setScreen} />;
      case "referral": return <ReferralScreen T={T} C={C} setScreen={setScreen} user={user} addToast={addToast} api={api}/>;
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
      ) : needNativeLogin ? (
        <NativeLoginScreen C={C} lang={lang} onLogin={onNativeLogin} onGuest={continueAsGuest} />
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
