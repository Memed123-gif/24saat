// DOM Elements
const messageInput = document.getElementById('messageInput');
const charCount = document.getElementById('charCount');
const submitBtn = document.getElementById('submitBtn');
const messagesContainer = document.getElementById('messagesContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const successModal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');
const filterBtns = document.querySelectorAll('.filter-btn');

// Theme Elements
const themeToggle = document.getElementById('themeToggle');

// Search Elements
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');

// Stats Elements
const totalMessages = document.getElementById('totalMessages');
const totalLikes = document.getElementById('totalLikes');
const activeUsers = document.getElementById('activeUsers');
const topLiked = document.getElementById('topLiked');

// Login Elements
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const closeLoginModal = document.getElementById('closeLoginModal');
const loginTabs = document.querySelectorAll('.login-tab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const userSection = document.getElementById('userSection');
const userName = document.getElementById('userName');
const userAvatar = document.getElementById('userAvatar');
const logoutBtn = document.getElementById('logoutBtn');

// CAPTCHA Elements
const captchaText = document.getElementById('captchaText');
const captchaInput = document.getElementById('captchaInput');
const refreshCaptcha = document.getElementById('refreshCaptcha');

// Language Elements
const languageSelect = document.getElementById('languageSelect');

// Variables
let currentCaptcha = '';
let currentTheme = localStorage.getItem('theme') || 'dark';
let searchQuery = '';
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Data
let messages = JSON.parse(localStorage.getItem('lastMessages')) || [];
let currentFilter = 'all';

// Advanced Security Variables
let typingSpeed = [];
let mouseMovements = [];
let keyboardPatterns = [];
let userBehavior = {
    typingStartTime: 0,
    typingEndTime: 0,
    mousePositions: [],
    keyPressTimes: [],
    lastActivity: Date.now()
};

// Geographic Security
let allowedCountries = ['TR', 'DE', 'AT', 'CH', 'NL', 'BE', 'FR', 'GB', 'US', 'CA', 'RU', 'BY', 'KZ', 'UA']; // Türkiye, Avrupa, Rusya ve yakın ülkeler
let blockedIPs = new Set();
let vpnDetected = false;
let proxyDetected = false;

// IP Analysis Variables
let ipActivityMap = new Map(); // IP -> { users: [], requests: [], lastActivity: timestamp }
let maxAccountsPerIP = 3; // Maksimum IP başına hesap sayısı
let maxRequestsPerIP = 20; // Maksimum IP başına istek sayısı (dakikada)
let suspiciousIPs = new Set(); // Şüpheli IP'ler
let ipBlocklist = new Set(); // Engellenen IP'ler

// Multi-language Support
let currentLanguage = 'tr'; // Default: Turkish
const languages = {
    tr: {
        title: 'Son Cümlen Ne Olurdu?',
        subtitle: 'Eğer sadece 24 saatin kalsa, son cümlen ne olurdu?',
        placeholder: 'Son cümlenizi buraya yazın...',
        submit: 'Gönder',
        captchaPlaceholder: 'Yukarıdaki kodu yazın',
        login: 'Giriş Yap',
        register: 'Kayıt Ol',
        logout: 'Çıkış',
        anonymous: 'Anonim',
        share: 'Paylaş',
        like: 'Beğen',
        search: 'Ara...',
        clear: 'Temizle',
        stats: 'İstatistikler',
        totalMessages: 'Toplam Mesaj',
        totalLikes: 'Toplam Beğeni',
        activeUsers: 'Aktif Kullanıcı',
        topLiked: 'En Beğenilen',
        filters: {
            all: 'Tümü',
            recent: 'Yeni',
            popular: 'Popüler',
            trending: 'Trend'
        },
        errors: {
            captchaWrong: 'CAPTCHA kodu yanlış! Lütfen tekrar deneyin.',
            messageTooLong: 'Mesaj çok uzun! Maksimum 500 karakter.',
            spamDetected: 'Spam içerik tespit edildi!',
            tooManyRequests: 'Çok fazla istek gönderdiniz. Lütfen bekleyin.',
            accessBlocked: 'Güvenlik nedeniyle erişiminiz engellendi.',
            vpnDetected: 'VPN kullanımı tespit edildi.',
            proxyDetected: 'Proxy kullanımı tespit edildi.',
            countryBlocked: 'Ülkenizden erişim kısıtlanmıştır.',
            multipleAccounts: 'Çok fazla hesap açılıyor. Lütfen bekleyin.',
            rapidAccountCreation: 'Hızlı hesap açılımı tespit edildi. Lütfen bekleyin.',
            simultaneousActivity: 'Simultan aktivite tespit edildi. Lütfen bekleyin.'
        },
        // Additional Turkish translations
        mainTitle: 'Senin Son Cümlen',
        inputDescription: 'Bu cümle umut veren, düşündüren ya da ders veren bir anlam taşımalı. Toplumsal duyarlılık içeren, duygusal ve özgün bir mesaj yaz.',
        anonymousNote: '💡 Giriş yapmadan da anonim olarak mesaj gönderebilirsiniz!',
        otherMessages: 'Diğer İnsanların Son Cümleleri',
        messagesCount: 'mesaj',
        loadingMessages: 'Mesajlar yükleniyor...',
        successTitle: 'Mesajın Gönderildi!',
        successMessage: 'Son cümlen başarıyla paylaşıldı. Diğer insanların da senin mesajını görebilmesi için biraz bekle.',
        okButton: 'Tamam',
        themeToggle: 'Tema Değiştir',
        loginTitle: 'Giriş Yap',
        registerTitle: 'Kayıt Ol',
        emailLabel: 'E-posta',
        passwordLabel: 'Şifre',
        usernameLabel: 'Kullanıcı Adı',
        passwordConfirmLabel: 'Şifre Tekrar',
        loginSuccess: 'Başarıyla giriş yaptınız!',
        registerSuccess: 'Hesabınız başarıyla oluşturuldu!',
        logoutSuccess: 'Çıkış yaptınız!',
        loginError: 'E-posta veya şifre hatalı!',
        emailExists: 'Bu e-posta adresi zaten kullanılıyor!',
        usernameExists: 'Bu kullanıcı adı zaten kullanılıyor!',
        passwordMismatch: 'Şifreler eşleşmiyor!',
        youLabel: 'Sen',
        timeAgo: {
            now: 'şimdi',
            minute: 'dakika önce',
            minutes: 'dakika önce',
            hour: 'saat önce',
            hours: 'saat önce',
            day: 'gün önce',
            days: 'gün önce'
        },
        emptyState: {
            title: 'Henüz mesaj yok',
            message: 'İlk mesajı sen gönder ve diğer insanlara ilham ver!'
        }
    },
    en: {
        title: 'What Would Be Your Last Sentence?',
        subtitle: 'If you only had 24 hours left, what would be your last sentence?',
        placeholder: 'Write your last sentence here...',
        submit: 'Send',
        captchaPlaceholder: 'Enter the code above',
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        anonymous: 'Anonymous',
        share: 'Share',
        like: 'Like',
        search: 'Search...',
        clear: 'Clear',
        stats: 'Statistics',
        totalMessages: 'Total Messages',
        totalLikes: 'Total Likes',
        activeUsers: 'Active Users',
        topLiked: 'Most Liked',
        filters: {
            all: 'All',
            recent: 'Recent',
            popular: 'Popular',
            trending: 'Trending'
        },
        errors: {
            captchaWrong: 'CAPTCHA code is wrong! Please try again.',
            messageTooLong: 'Message is too long! Maximum 500 characters.',
            spamDetected: 'Spam content detected!',
            tooManyRequests: 'Too many requests sent. Please wait.',
            accessBlocked: 'Your access is blocked for security reasons.',
            vpnDetected: 'VPN usage detected.',
            proxyDetected: 'Proxy usage detected.',
            countryBlocked: 'Access from your country is restricted.',
            multipleAccounts: 'Too many accounts being created. Please wait.',
            rapidAccountCreation: 'Rapid account creation detected. Please wait.',
            simultaneousActivity: 'Simultaneous activity detected. Please wait.'
        },
        // Additional English translations
        mainTitle: 'Your Last Sentence',
        inputDescription: 'This sentence should carry hope, make people think, or give a lesson. Write an emotional, socially conscious, and original message.',
        anonymousNote: '💡 You can send messages anonymously without logging in!',
        otherMessages: 'Other People\'s Last Sentences',
        messagesCount: 'messages',
        loadingMessages: 'Loading messages...',
        successTitle: 'Message Sent!',
        successMessage: 'Your last sentence has been successfully shared. Wait a bit for others to see your message.',
        okButton: 'OK',
        themeToggle: 'Toggle Theme',
        loginTitle: 'Login',
        registerTitle: 'Register',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        usernameLabel: 'Username',
        passwordConfirmLabel: 'Confirm Password',
        loginSuccess: 'Successfully logged in!',
        registerSuccess: 'Your account has been successfully created!',
        logoutSuccess: 'You have logged out!',
        loginError: 'Email or password is incorrect!',
        emailExists: 'This email address is already in use!',
        usernameExists: 'This username is already in use!',
        passwordMismatch: 'Passwords do not match!',
        youLabel: 'You',
        timeAgo: {
            now: 'now',
            minute: 'minute ago',
            minutes: 'minutes ago',
            hour: 'hour ago',
            hours: 'hours ago',
            day: 'day ago',
            days: 'days ago'
        },
        emptyState: {
            title: 'No messages yet',
            message: 'Send the first message and inspire others!'
        }
    },
    de: {
        title: 'Was wäre dein letzter Satz?',
        subtitle: 'Wenn du nur noch 24 Stunden hättest, was wäre dein letzter Satz?',
        placeholder: 'Schreibe deinen letzten Satz hier...',
        submit: 'Senden',
        captchaPlaceholder: 'Gib den Code oben ein',
        login: 'Anmelden',
        register: 'Registrieren',
        logout: 'Abmelden',
        anonymous: 'Anonym',
        share: 'Teilen',
        like: 'Gefällt mir',
        search: 'Suchen...',
        clear: 'Löschen',
        stats: 'Statistiken',
        totalMessages: 'Gesamt Nachrichten',
        totalLikes: 'Gesamt Likes',
        activeUsers: 'Aktive Benutzer',
        topLiked: 'Am meisten gemocht',
        filters: {
            all: 'Alle',
            recent: 'Neueste',
            popular: 'Beliebt',
            trending: 'Trending'
        },
        errors: {
            captchaWrong: 'CAPTCHA-Code ist falsch! Bitte versuche es erneut.',
            messageTooLong: 'Nachricht ist zu lang! Maximum 500 Zeichen.',
            spamDetected: 'Spam-Inhalt erkannt!',
            tooManyRequests: 'Zu viele Anfragen gesendet. Bitte warten.',
            accessBlocked: 'Dein Zugang ist aus Sicherheitsgründen blockiert.',
            vpnDetected: 'VPN-Nutzung erkannt.',
            proxyDetected: 'Proxy-Nutzung erkannt.',
            countryBlocked: 'Zugang aus deinem Land ist eingeschränkt.',
            multipleAccounts: 'Zu viele Konten werden erstellt. Bitte warten.',
            rapidAccountCreation: 'Schnelles Konto erstellt erkannt. Bitte warten.',
            simultaneousActivity: 'Simultane Aktivität erkannt. Bitte warten.'
        },
        // Additional German translations
        mainTitle: 'Dein letzter Satz',
        inputDescription: 'Dieser Satz sollte Hoffnung vermitteln, zum Nachdenken anregen oder eine Lektion erteilen. Schreibe eine emotionale, sozial bewusste und originelle Nachricht.',
        anonymousNote: '💡 Du kannst Nachrichten anonym senden, ohne dich anzumelden!',
        otherMessages: 'Die letzten Sätze anderer Menschen',
        messagesCount: 'Nachrichten',
        loadingMessages: 'Nachrichten werden geladen...',
        successTitle: 'Nachricht gesendet!',
        successMessage: 'Dein letzter Satz wurde erfolgreich geteilt. Warte ein wenig, damit andere deine Nachricht sehen können.',
        okButton: 'OK',
        themeToggle: 'Theme wechseln',
        loginTitle: 'Anmelden',
        registerTitle: 'Registrieren',
        emailLabel: 'E-Mail',
        passwordLabel: 'Passwort',
        usernameLabel: 'Benutzername',
        passwordConfirmLabel: 'Passwort bestätigen',
        loginSuccess: 'Erfolgreich angemeldet!',
        registerSuccess: 'Dein Konto wurde erfolgreich erstellt!',
        logoutSuccess: 'Du hast dich abgemeldet!',
        loginError: 'E-Mail oder Passwort ist falsch!',
        emailExists: 'Diese E-Mail-Adresse wird bereits verwendet!',
        usernameExists: 'Dieser Benutzername wird bereits verwendet!',
        passwordMismatch: 'Passwörter stimmen nicht überein!',
        youLabel: 'Du',
        timeAgo: {
            now: 'jetzt',
            minute: 'Minute her',
            minutes: 'Minuten her',
            hour: 'Stunde her',
            hours: 'Stunden her',
            day: 'Tag her',
            days: 'Tage her'
        },
        emptyState: {
            title: 'Noch keine Nachrichten',
            message: 'Sende die erste Nachricht und inspiriere andere!'
        }
    },
    ru: {
        title: 'Каким было бы твое последнее предложение?',
        subtitle: 'Если бы у тебя осталось только 24 часа, каким было бы твое последнее предложение?',
        placeholder: 'Напиши свое последнее предложение здесь...',
        submit: 'Отправить',
        captchaPlaceholder: 'Введите код выше',
        login: 'Войти',
        register: 'Регистрация',
        logout: 'Выйти',
        anonymous: 'Аноним',
        share: 'Поделиться',
        like: 'Нравится',
        search: 'Поиск...',
        clear: 'Очистить',
        stats: 'Статистика',
        totalMessages: 'Всего сообщений',
        totalLikes: 'Всего лайков',
        activeUsers: 'Активные пользователи',
        topLiked: 'Самые популярные',
        filters: {
            all: 'Все',
            recent: 'Недавние',
            popular: 'Популярные',
            trending: 'В тренде'
        },
        errors: {
            captchaWrong: 'Код CAPTCHA неверный! Пожалуйста, попробуйте еще раз.',
            messageTooLong: 'Сообщение слишком длинное! Максимум 500 символов.',
            spamDetected: 'Обнаружен спам!',
            tooManyRequests: 'Слишком много запросов. Пожалуйста, подождите.',
            accessBlocked: 'Ваш доступ заблокирован по соображениям безопасности.',
            vpnDetected: 'Обнаружено использование VPN.',
            proxyDetected: 'Обнаружено использование прокси.',
            countryBlocked: 'Доступ из вашей страны ограничен.',
            multipleAccounts: 'Слишком много аккаунтов создается. Пожалуйста, подождите.',
            rapidAccountCreation: 'Обнаружено быстрое создание аккаунта. Пожалуйста, подождите.',
            simultaneousActivity: 'Обнаружена одновременная активность. Пожалуйста, подождите.'
        },
        // Additional Russian translations
        mainTitle: 'Твое последнее предложение',
        inputDescription: 'Это предложение должно нести надежду, заставлять задуматься или давать урок. Напиши эмоциональное, социально значимое и оригинальное сообщение.',
        anonymousNote: '💡 Вы можете отправлять сообщения анонимно без входа в систему!',
        otherMessages: 'Последние предложения других людей',
        messagesCount: 'сообщений',
        loadingMessages: 'Загрузка сообщений...',
        successTitle: 'Сообщение отправлено!',
        successMessage: 'Твое последнее предложение успешно опубликовано. Подожди немного, чтобы другие люди могли увидеть твое сообщение.',
        okButton: 'Хорошо',
        themeToggle: 'Сменить тему',
        loginTitle: 'Войти в систему',
        registerTitle: 'Регистрация',
        emailLabel: 'Электронная почта',
        passwordLabel: 'Пароль',
        usernameLabel: 'Имя пользователя',
        passwordConfirmLabel: 'Подтвердите пароль',
        loginSuccess: 'Успешный вход в систему!',
        registerSuccess: 'Ваш аккаунт успешно создан!',
        logoutSuccess: 'Вы вышли из системы!',
        loginError: 'Неверная электронная почта или пароль!',
        emailExists: 'Этот адрес электронной почты уже используется!',
        usernameExists: 'Это имя пользователя уже используется!',
        passwordMismatch: 'Пароли не совпадают!',
        youLabel: 'Вы',
        timeAgo: {
            now: 'сейчас',
            minute: 'минуту назад',
            minutes: 'минут назад',
            hour: 'час назад',
            hours: 'часов назад',
            day: 'день назад',
            days: 'дней назад'
        },
        emptyState: {
            title: 'Пока нет сообщений',
            message: 'Отправь первое сообщение и вдохнови других!'
        }
    }
};

// Sample messages for demo - REMOVED
const sampleMessages = [];

// Sample users for demo
const sampleUsers = [
    {
        id: "demo_user_1",
        username: "memeddmis",
        email: "demo@example.com",
        password: "demo123",
        avatar: "https://via.placeholder.com/40/60a5fa/ffffff?text=M",
        createdAt: Date.now() - 86400000
    }
];

// Initialize app
function init() {
    // Clear any existing demo messages and start fresh
    messages = [];
    saveMessages();
    
    // Clear localStorage to remove any old demo messages
    localStorage.removeItem('lastMessages');
    
    // Initialize users if not exists
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.length === 0) {
        users = sampleUsers;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    setupEventListeners();
    applyTheme();
    updateUserInterface();
    updateCharCount();
    generateCaptcha();
    displayMessages();
    updateStats();
    initializeBackgroundSecurity();
    initializeIPAnalysis();
    
    // Load saved language
    const savedLanguage = localStorage.getItem('language') || 'tr';
    currentLanguage = savedLanguage;
    languageSelect.value = savedLanguage;
    updateUILanguage();
}

// Event Listeners
function setupEventListeners() {
    messageInput.addEventListener('input', updateCharCount);
    submitBtn.addEventListener('click', submitMessage);
    closeModal.addEventListener('click', closeSuccessModal);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Search events
    searchInput.addEventListener('input', handleSearch);
    clearSearch.addEventListener('click', clearSearchInput);
    
    // Login events
    loginBtn.addEventListener('click', showLoginModal);
    closeLoginModal.addEventListener('click', hideLoginModal);
    logoutBtn.addEventListener('click', logout);
    
    // Login tabs
    loginTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            loginTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            if (tab.dataset.tab === 'login') {
                loginForm.classList.add('active');
                registerForm.classList.remove('active');
            } else {
                registerForm.classList.add('active');
                loginForm.classList.remove('active');
            }
        });
    });
    
    // Login forms
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    
    // Close login modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            hideLoginModal();
        }
    });
    
    // CAPTCHA events
    refreshCaptcha.addEventListener('click', generateCaptcha);
    captchaInput.addEventListener('input', validateCaptcha);
    captchaInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            submitMessage();
        }
    });
    
    // Language events
    languageSelect.addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });
    
    // Behavior tracking events
    messageInput.addEventListener('focus', startTypingAnalysis);
    messageInput.addEventListener('keydown', trackKeyPress);
    document.addEventListener('mousemove', trackMouseMovement);
    
    // Geographic security check on page load
    detectUserLocation();
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            displayMessages();
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeSuccessModal();
        }
    });
    
    // Enter key to submit
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            submitMessage();
        }
    });
}

// Character count update
function updateCharCount() {
    const count = messageInput.value.length;
    charCount.textContent = count;
    
    if (count > 450) {
        charCount.style.color = '#ef4444';
    } else if (count > 400) {
        charCount.style.color = '#f97316';
    } else {
        charCount.style.color = '#9ca3af';
    }
    
    updateSubmitButton();
}

// Update submit button state
function updateSubmitButton() {
    const messageLength = messageInput.value.length;
    const captchaValid = captchaInput.value.toLowerCase() === currentCaptcha.toLowerCase();
    
    submitBtn.disabled = messageLength === 0 || messageLength > 500 || !captchaValid;
}

// Generate CAPTCHA
function generateCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let captcha = '';
    
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    currentCaptcha = captcha;
    captchaText.textContent = captcha;
    captchaInput.value = '';
    captchaInput.classList.remove('captcha-error', 'captcha-success');
    updateSubmitButton();
}

// Validate CAPTCHA
function validateCaptcha() {
    const userInput = captchaInput.value.toLowerCase();
    const correctCaptcha = currentCaptcha.toLowerCase();
    
    captchaInput.classList.remove('captcha-error', 'captcha-success');
    
    if (userInput.length > 0) {
        if (userInput === correctCaptcha) {
            captchaInput.classList.add('captcha-success');
        } else if (userInput.length === correctCaptcha.length) {
            captchaInput.classList.add('captcha-error');
        }
    }
    
    updateSubmitButton();
}

// Theme Functions
function applyTheme() {
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme();
}

// Search Functions
function handleSearch() {
    searchQuery = searchInput.value.toLowerCase().trim();
    clearSearch.style.display = searchQuery ? 'block' : 'none';
    displayMessages();
}

function clearSearchInput() {
    searchInput.value = '';
    searchQuery = '';
    clearSearch.style.display = 'none';
    displayMessages();
}

// Stats Functions
function updateStats() {
    const totalMsg = messages.length;
    const totalLikesCount = messages.reduce((sum, msg) => sum + msg.likes, 0);
    const maxLikes = Math.max(...messages.map(msg => msg.likes), 0);
    
    totalMessages.textContent = totalMsg;
    totalLikes.textContent = totalLikesCount;
    activeUsers.textContent = currentUser ? '1' : '0';
    topLiked.textContent = maxLikes;
}

// Login Functions
function showLoginModal() {
    loginModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideLoginModal() {
    loginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    // Clear forms
    loginForm.reset();
    registerForm.reset();
}

function updateUserInterface() {
    if (currentUser) {
        loginBtn.style.display = 'none';
        userSection.style.display = 'flex';
        userName.textContent = currentUser.username;
        userAvatar.src = currentUser.avatar;
    } else {
        loginBtn.style.display = 'flex';
        userSection.style.display = 'none';
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Track user IP on login
        trackUserIP(user.id, user.username);
        
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUserInterface();
        hideLoginModal();
        showToast(languages[currentLanguage].loginSuccess);
        displayMessages(); // Refresh to show owner status
    } else {
        showToast(languages[currentLanguage].loginError);
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    
    if (password !== passwordConfirm) {
        showToast(languages[currentLanguage].passwordMismatch);
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showToast(languages[currentLanguage].emailExists);
        return;
    }
    
    // Check if username already exists
    if (users.find(u => u.username === username)) {
        showToast(languages[currentLanguage].usernameExists);
        return;
    }
    
    const newUser = {
        id: 'user_' + Date.now(),
        username: username,
        email: email,
        password: password,
        avatar: `https://via.placeholder.com/40/60a5fa/ffffff?text=${username.charAt(0).toUpperCase()}`,
        createdAt: Date.now()
    };
    
    // Track user IP
    trackUserIP(newUser.id, newUser.username);
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    updateUserInterface();
    hideLoginModal();
    showToast(languages[currentLanguage].registerSuccess);
    displayMessages();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    showToast(languages[currentLanguage].logoutSuccess);
    displayMessages(); // Refresh to remove owner status
}

// Submit message
function submitMessage() {
    const text = messageInput.value.trim();
    
    if (text.length === 0 || text.length > 500) {
        return;
    }
    
    // Validate CAPTCHA
    if (captchaInput.value.toLowerCase() !== currentCaptcha.toLowerCase()) {
        captchaInput.classList.add('captcha-error');
        showToast(languages[currentLanguage].errors.captchaWrong);
        return;
    }
    
    // Check background security silently
    if (!validateRequest()) {
        return;
    }
    
    // Check human behavior
    if (!isHumanBehavior()) {
        showToast(languages[currentLanguage].errors.spamDetected);
        return;
    }
    
    const newMessage = {
        id: Date.now(),
        text: text,
        timestamp: Date.now(),
        likes: 0,
        liked: false,
        author: currentUser ? currentUser.username : 'Anonim',
        authorId: currentUser ? currentUser.id : 'anonymous',
        isOwner: currentUser ? true : false
    };
    
    messages.unshift(newMessage);
    saveMessages();
    
    // Clear inputs
    messageInput.value = '';
    captchaInput.value = '';
    updateCharCount();
    
    // Generate new CAPTCHA
    generateCaptcha();
    
    // Update stats
    updateStats();
    
    // Show success modal
    showSuccessModal();
    
    // Refresh display
    displayMessages();
}

// Display messages
function displayMessages() {
    const filteredMessages = filterMessages();
    
    if (filteredMessages.length === 0) {
        showEmptyState();
        return;
    }
    
    const messagesHTML = filteredMessages.map(message => createMessageHTML(message)).join('');
    messagesContainer.innerHTML = messagesHTML;
    
    // Add event listeners to new buttons
    addMessageEventListeners();
}

// Filter messages
function filterMessages() {
    let filtered = [...messages];
    
    // Apply search filter
    if (searchQuery) {
        filtered = filtered.filter(message => 
            message.text.toLowerCase().includes(searchQuery) ||
            message.author.toLowerCase().includes(searchQuery)
        );
    }
    
    switch (currentFilter) {
        case 'recent':
            filtered.sort((a, b) => b.timestamp - a.timestamp);
            break;
        case 'popular':
            filtered.sort((a, b) => b.likes - a.likes);
            break;
        case 'trending':
            // Messages with high likes in recent time
            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000;
            filtered = filtered.filter(msg => {
                const isRecent = (now - msg.timestamp) < oneDay;
                const hasLikes = msg.likes > 5;
                return isRecent && hasLikes;
            });
            filtered.sort((a, b) => b.likes - a.likes);
            break;
        default:
            // 'all' - keep original order
            break;
    }
    
    return filtered;
}

// Create message HTML
function createMessageHTML(message) {
    const timeAgo = getTimeAgo(message.timestamp);
    const likeIcon = message.liked ? 'fas fa-heart' : 'far fa-heart';
    const likeClass = message.liked ? 'liked' : '';
    const isCurrentUserMessage = currentUser && message.authorId === currentUser.id;
    const isAnonymous = message.author === 'Anonim' || message.author === 'Anonymous' || message.author === 'Anonym' || message.author === 'Аноним';
    const ownerClass = isCurrentUserMessage ? 'owner-message' : '';
    const anonymousClass = isAnonymous ? 'anonymous-message' : '';
    const authorBadge = isCurrentUserMessage ? `<span class="author-badge">👑 ${languages[currentLanguage].youLabel}</span>` : '';
    const anonymousBadge = isAnonymous ? `<span class="anonymous-badge">👤 ${languages[currentLanguage].anonymous}</span>` : '';
    
    return `
        <div class="message-card ${ownerClass} ${anonymousClass}" data-id="${message.id}">
            <div class="message-text">"${message.text}"</div>
            <div class="message-meta">
                <div class="message-info">
                    <span class="message-time">${timeAgo}</span>
                    ${authorBadge}
                    ${anonymousBadge}
                    ${message.author && !isAnonymous ? `<span class="author-name">@${message.author}</span>` : ''}
                </div>
                <div class="message-actions">
                    <button class="action-btn like-btn ${likeClass}" data-id="${message.id}">
                        <i class="${likeIcon}"></i>
                        <span class="like-count">${message.likes}</span>
                    </button>
                    <button class="action-btn share-btn" data-id="${message.id}">
                        <i class="fas fa-share"></i>
                        ${languages[currentLanguage].share}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Add event listeners to message buttons
function addMessageEventListeners() {
    // Like buttons
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const messageId = parseInt(btn.dataset.id);
            toggleLike(messageId);
        });
    });
    
    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const messageId = parseInt(btn.dataset.id);
            shareMessage(messageId);
        });
    });
}

// Toggle like
function toggleLike(messageId) {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;
    
    message.liked = !message.liked;
    message.likes += message.liked ? 1 : -1;
    
    saveMessages();
    updateStats();
    displayMessages();
}

// Share message
function shareMessage(messageId) {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;
    
    const shareText = `"${message.text}" - Son Cümlen Ne Olurdu?`;
    const shareUrl = window.location.href;
    const hashtags = '#SonCümlenNeOlurdu #Hayat #Düşünce #Anlam';
    
    // Create share options
    const shareOptions = [
        {
            name: 'WhatsApp',
            icon: 'fab fa-whatsapp',
            color: '#25D366',
            action: () => {
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + shareUrl + '\n\n' + hashtags)}`;
                window.open(whatsappUrl, '_blank');
            }
        },
        {
            name: 'Telegram',
            icon: 'fab fa-telegram',
            color: '#0088cc',
            action: () => {
                const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText + '\n\n' + hashtags)}`;
                window.open(telegramUrl, '_blank');
            }
        },
        {
            name: 'Twitter/X',
            icon: 'fab fa-twitter',
            color: '#1DA1F2',
            action: () => {
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + '\n\n' + hashtags)}&url=${encodeURIComponent(shareUrl)}`;
                window.open(twitterUrl, '_blank');
            }
        },
        {
            name: 'Instagram',
            icon: 'fab fa-instagram',
            color: '#E4405F',
            action: () => {
                const instagramText = `${shareText}\n\n${shareUrl}\n\n${hashtags}`;
                navigator.clipboard.writeText(instagramText).then(() => {
                    showToast('Instagram için mesaj kopyalandı! Hikayelerde paylaşabilirsin.');
                });
            }
        },
        {
            name: 'Facebook',
            icon: 'fab fa-facebook',
            color: '#1877F2',
            action: () => {
                const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText + '\n\n' + hashtags)}`;
                window.open(facebookUrl, '_blank');
            }
        },
        {
            name: 'LinkedIn',
            icon: 'fab fa-linkedin',
            color: '#0A66C2',
            action: () => {
                const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                window.open(linkedinUrl, '_blank');
            }
        },
        {
            name: 'E-posta',
            icon: 'fas fa-envelope',
            color: '#EA4335',
            action: () => {
                const emailUrl = `mailto:?subject=Son Cümlen Ne Olurdu?&body=${encodeURIComponent(shareText + '\n\n' + shareUrl + '\n\n' + hashtags)}`;
                window.open(emailUrl);
            }
        },
        {
            name: 'Kopyala',
            icon: 'fas fa-copy',
            color: '#6B7280',
            action: () => {
                const fullText = `${shareText}\n\n${shareUrl}\n\n${hashtags}`;
                navigator.clipboard.writeText(fullText).then(() => {
                    showToast('Mesaj panoya kopyalandı!');
                });
            }
        }
    ];
    
    showShareModal(shareOptions, message);
}

// Show empty state
function showEmptyState() {
    const lang = languages[currentLanguage];
    messagesContainer.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-comments"></i>
            <h3>${lang.emptyState?.title || 'Henüz mesaj yok'}</h3>
            <p>${lang.emptyState?.message || 'İlk mesajı sen gönder ve diğer insanlara ilham ver!'}</p>
        </div>
    `;
}

// Show success modal
function showSuccessModal() {
    successModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close success modal
function closeSuccessModal() {
    successModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Show share modal
function showShareModal(shareOptions, message) {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-modal-content">
            <div class="share-modal-header">
                <h3>Mesajı Paylaş</h3>
                <button class="close-share-modal">×</button>
            </div>
            <div class="share-preview">
                <p class="share-text">"${message.text}"</p>
                <p class="share-source">- Son Cümlen Ne Olurdu?</p>
            </div>
            <div class="share-options">
                ${shareOptions.map(option => `
                    <button class="share-option" style="--option-color: ${option.color}">
                        <i class="${option.icon}"></i>
                        <span>${option.name}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-share-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Add click events to share options
    modal.querySelectorAll('.share-option').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            shareOptions[index].action();
            document.body.removeChild(modal);
        });
    });
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Get time ago
function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    const lang = languages[currentLanguage];
    
    if (days > 0) {
        return days === 1 ? lang.timeAgo.day : `${days} ${lang.timeAgo.days}`;
    } else if (hours > 0) {
        return hours === 1 ? lang.timeAgo.hour : `${hours} ${lang.timeAgo.hours}`;
    } else if (minutes > 0) {
        return minutes === 1 ? lang.timeAgo.minute : `${minutes} ${lang.timeAgo.minutes}`;
    } else {
        return lang.timeAgo.now;
    }
}

// Save messages to localStorage
function saveMessages() {
    localStorage.setItem('lastMessages', JSON.stringify(messages));
}

// Background Security Functions (DDOS protection runs silently)
function checkDDOSProtection() {
    const currentTime = Date.now();
    const clientIP = getClientIP();
    
    // Check if IP is blocked
    if (blockedIPs.has(clientIP)) {
        showToast(languages[currentLanguage].errors.accessBlocked);
        return false;
    }
    
    // Rate limiting per minute
    if (currentTime - lastRequestTime < rateLimitWindow) {
        requestCount++;
        
        if (requestCount > maxRequestsPerMinute) {
            blockIP(clientIP, 'Rate limit exceeded');
            showToast(languages[currentLanguage].errors.tooManyRequests);
            return false;
        }
    } else {
        // Reset counter for new window
        requestCount = 1;
        lastRequestTime = currentTime;
    }
    
    // Track suspicious activity silently
    trackSuspiciousActivity(clientIP, currentTime);
    
    return true;
}

function getClientIP() {
    // In a real application, this would get the actual IP
    // For demo purposes, we'll use a combination of user agent and timestamp
    return navigator.userAgent + '_' + Math.floor(Date.now() / 60000);
}

function blockIP(ip, reason) {
    blockedIPs.add(ip);
    suspiciousActivity.set(ip, {
        reason: reason,
        timestamp: Date.now(),
        count: (suspiciousActivity.get(ip)?.count || 0) + 1
    });
    
    // Auto-unblock after 1 hour
    setTimeout(() => {
        blockedIPs.delete(ip);
    }, 3600000);
    
    console.log(`IP blocked: ${ip}, Reason: ${reason}`);
}

function trackSuspiciousActivity(ip, timestamp) {
    const activity = suspiciousActivity.get(ip) || { count: 0, firstSeen: timestamp };
    activity.count++;
    activity.lastSeen = timestamp;
    
    suspiciousActivity.set(ip, activity);
    
    // If suspicious activity detected, increase monitoring
    if (activity.count > 50) {
        blockIP(ip, 'Suspicious activity detected');
    }
}

function validateRequest() {
    const clientIP = getClientIP();
    
    // Check if IP is blocked
    if (ipBlocklist.has(clientIP)) {
        showToast(languages[currentLanguage].errors.accessBlocked);
        return false;
    }
    
    // Check DDOS protection silently
    if (!checkDDOSProtection()) {
        return false;
    }
    
    // Check IP activity
    if (!analyzeIPActivity(clientIP)) {
        return false;
    }
    
    // Check message length
    const messageLength = messageInput.value.length;
    if (messageLength === 0 || messageLength > 500) {
        showToast(languages[currentLanguage].errors.messageTooLong);
        return false;
    }
    
    // Check for spam patterns silently
    if (detectSpamPatterns(messageInput.value)) {
        showToast(languages[currentLanguage].errors.spamDetected);
        return false;
    }
    
    return true;
}

function detectSpamPatterns(text) {
    const spamPatterns = [
        /(.)\1{10,}/, // Repeated characters
        /(https?:\/\/[^\s]+)/g, // URLs
        /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, // Email addresses
        /(\d{10,})/g, // Long numbers
        /(buy|sell|click|free|money|cash|earn|profit|rich|million|kazan|para|ücretsiz|satılık|alım|satım)/gi, // Spam keywords
        /(viagra|casino|poker|lottery|winner|kumar|bahis|iddaa)/gi, // Common spam words
        /([A-Z]{5,})/g, // ALL CAPS
        /(!{3,})/g, // Multiple exclamation marks
        /(\?{3,})/g, // Multiple question marks
        /(\.{3,})/g // Multiple dots
    ];
    
    const spamScore = spamPatterns.reduce((score, pattern) => {
        const matches = text.match(pattern);
        return score + (matches ? matches.length * 2 : 0);
    }, 0);
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
        /(.)\1{5,}/g, // Repeated characters (less strict)
        /(a{5,}|e{5,}|i{5,}|o{5,}|u{5,})/gi, // Repeated vowels
        /(test|deneme|spam|bot)/gi // Test words
    ];
    
    const suspiciousScore = suspiciousPatterns.reduce((score, pattern) => {
        const matches = text.match(pattern);
        return score + (matches ? matches.length : 0);
    }, 0);
    
    return spamScore > 3 || suspiciousScore > 2;
}

// Behavior Analysis Functions
function startTypingAnalysis() {
    userBehavior.typingStartTime = Date.now();
    userBehavior.keyPressTimes = [];
    userBehavior.mousePositions = [];
}

function trackKeyPress() {
    const currentTime = Date.now();
    userBehavior.keyPressTimes.push(currentTime);
    
    // Analyze typing rhythm
    if (userBehavior.keyPressTimes.length > 5) {
        const intervals = [];
        for (let i = 1; i < userBehavior.keyPressTimes.length; i++) {
            intervals.push(userBehavior.keyPressTimes[i] - userBehavior.keyPressTimes[i-1]);
        }
        
        // Check for bot-like typing (too regular intervals)
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
        
        // If variance is too low, it might be a bot
        if (variance < 1000) { // Less than 1 second variance
            console.log('Bot-like typing detected: Low variance in key press intervals');
            return false;
        }
    }
    
    return true;
}

function trackMouseMovement(e) {
    const position = { x: e.clientX, y: e.clientY, time: Date.now() };
    userBehavior.mousePositions.push(position);
    
    // Keep only last 50 positions
    if (userBehavior.mousePositions.length > 50) {
        userBehavior.mousePositions.shift();
    }
    
    // Analyze mouse movement patterns
    if (userBehavior.mousePositions.length > 10) {
        const movements = [];
        for (let i = 1; i < userBehavior.mousePositions.length; i++) {
            const prev = userBehavior.mousePositions[i-1];
            const curr = userBehavior.mousePositions[i];
            const distance = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
            const timeDiff = curr.time - prev.time;
            movements.push({ distance, timeDiff });
        }
        
        // Check for linear mouse movement (bot-like)
        const linearMovements = movements.filter(m => m.distance > 0 && m.timeDiff > 0);
        if (linearMovements.length > 5) {
            const avgSpeed = linearMovements.reduce((sum, m) => sum + (m.distance / m.timeDiff), 0) / linearMovements.length;
            const speedVariance = linearMovements.reduce((sum, m) => {
                const speed = m.distance / m.timeDiff;
                return sum + Math.pow(speed - avgSpeed, 2);
            }, 0) / linearMovements.length;
            
            // If speed is too consistent, it might be a bot
            if (speedVariance < 1000) {
                console.log('Bot-like mouse movement detected: Too consistent speed');
                return false;
            }
        }
    }
    
    return true;
}

function analyzeTypingSpeed() {
    if (userBehavior.keyPressTimes.length < 10) return true;
    
    const totalTime = userBehavior.keyPressTimes[userBehavior.keyPressTimes.length - 1] - userBehavior.keyPressTimes[0];
    const charactersTyped = userBehavior.keyPressTimes.length;
    const typingSpeed = charactersTyped / (totalTime / 1000); // characters per second
    
    // Normal human typing speed is between 0.5 and 2.5 characters per second
    if (typingSpeed < 0.1 || typingSpeed > 5) {
        console.log('Abnormal typing speed detected:', typingSpeed);
        return false;
    }
    
    return true;
}

function isHumanBehavior() {
    const typingValid = analyzeTypingSpeed();
    const mouseValid = userBehavior.mousePositions.length > 5;
    const activityValid = (Date.now() - userBehavior.lastActivity) < 300000; // 5 minutes
    
    return typingValid && mouseValid && activityValid;
}

// Background security cleanup
function initializeBackgroundSecurity() {
    // Clean up old blocked IPs every hour
    setInterval(() => {
        const currentTime = Date.now();
        blockedIPs.forEach(ip => {
            const activity = suspiciousActivity.get(ip);
            if (activity && (currentTime - activity.timestamp) > 3600000) {
                blockedIPs.delete(ip);
                suspiciousActivity.delete(ip);
            }
        });
    }, 3600000);
}

// Geographic Security Functions
async function detectUserLocation() {
    try {
        // Try to get location from IP
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        const userCountry = data.country_code;
        const userIP = data.ip;
        
        // Check if country is allowed
        if (!allowedCountries.includes(userCountry)) {
            showToast(languages[currentLanguage].errors.countryBlocked);
            return false;
        }
        
        // Check for VPN/Proxy indicators
        const isVPN = await detectVPN(userIP);
        const isProxy = await detectProxy(userIP);
        
        if (isVPN) {
            vpnDetected = true;
            showToast(languages[currentLanguage].errors.vpnDetected);
            return false;
        }
        
        if (isProxy) {
            proxyDetected = true;
            showToast(languages[currentLanguage].errors.proxyDetected);
            return false;
        }
        
        return true;
    } catch (error) {
        console.log('Location detection failed:', error);
        // If location detection fails, allow access but log it
        return true;
    }
}

async function detectVPN(ip) {
    try {
        // Check against known VPN IP ranges
        const vpnRanges = [
            '10.0.0.0/8',
            '172.16.0.0/12',
            '192.168.0.0/16'
        ];
        
        // Simple check - in real app, use a VPN detection service
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        
        // Check for VPN indicators
        const vpnIndicators = [
            data.org && data.org.toLowerCase().includes('vpn'),
            data.org && data.org.toLowerCase().includes('proxy'),
            data.org && data.org.toLowerCase().includes('tunnel'),
            data.asn && data.asn.toLowerCase().includes('vpn')
        ];
        
        return vpnIndicators.some(indicator => indicator);
    } catch (error) {
        return false;
    }
}

async function detectProxy(ip) {
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        
        // Check for proxy indicators
        const proxyIndicators = [
            data.org && data.org.toLowerCase().includes('proxy'),
            data.org && data.org.toLowerCase().includes('tor'),
            data.org && data.org.toLowerCase().includes('anonymizer')
        ];
        
        return proxyIndicators.some(indicator => indicator);
    } catch (error) {
        return false;
    }
}

// Multi-language Functions
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updateUILanguage();
}

function updateUILanguage() {
    const lang = languages[currentLanguage];
    
    // Update page title
    document.title = lang.title;
    
    // Update main elements
    document.querySelector('.main-title').textContent = lang.title;
    document.querySelector('.subtitle').textContent = lang.subtitle;
    messageInput.placeholder = lang.placeholder;
    submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> ${lang.submit}`;
    captchaInput.placeholder = lang.captchaPlaceholder;
    
    // Update input section
    document.querySelector('.input-section h2').textContent = lang.mainTitle;
    document.querySelector('.input-description').innerHTML = `${lang.inputDescription} <span class="anonymous-note">${lang.anonymousNote}</span>`;
    
    // Update messages section
    document.querySelector('.messages-header h2').textContent = lang.otherMessages;
    document.querySelector('.stats-badge span').textContent = `${document.getElementById('totalMessages').textContent} ${lang.messagesCount}`;
    
    // Update search elements
    searchInput.placeholder = lang.search;
    clearSearch.innerHTML = `<i class="fas fa-times"></i>`;
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach((btn, index) => {
        const filterKeys = ['all', 'recent', 'popular', 'trending'];
        btn.textContent = lang.filters[filterKeys[index]];
    });
    
    // Update stats section
    document.querySelectorAll('.stat-label').forEach((label, index) => {
        const statLabels = [lang.totalLikes, lang.activeUsers, lang.topLiked];
        if (statLabels[index]) {
            label.textContent = statLabels[index];
        }
    });
    
    // Update login elements
    document.querySelector('.login-btn-header').innerHTML = `<i class="fas fa-user"></i> ${lang.login}`;
    logoutBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i>`;
    logoutBtn.title = lang.logout;
    
    // Update modal elements
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.querySelector('h3').textContent = lang.successTitle;
        successModal.querySelector('p').textContent = lang.successMessage;
        successModal.querySelector('.modal-btn').textContent = lang.okButton;
    }
    
    // Update login modal
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        // Login form
        loginModal.querySelector('.login-tab').textContent = lang.login;
        loginModal.querySelector('label[for="loginEmail"]').textContent = lang.emailLabel;
        loginModal.querySelector('label[for="loginPassword"]').textContent = lang.passwordLabel;
        loginModal.querySelector('.login-form .login-btn').innerHTML = `<i class="fas fa-sign-in-alt"></i> ${lang.login}`;
        
        // Register form
        loginModal.querySelector('.register-tab').textContent = lang.register;
        loginModal.querySelector('label[for="registerUsername"]').textContent = lang.usernameLabel;
        loginModal.querySelector('label[for="registerEmail"]').textContent = lang.emailLabel;
        loginModal.querySelector('label[for="registerPassword"]').textContent = lang.passwordLabel;
        loginModal.querySelector('label[for="registerPasswordConfirm"]').textContent = lang.passwordConfirmLabel;
        loginModal.querySelector('.register-form .login-btn').innerHTML = `<i class="fas fa-user-plus"></i> ${lang.register}`;
    }
    
    // Update theme toggle
    themeToggle.title = lang.themeToggle;
    
    // Update loading spinner
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) {
        loadingSpinner.querySelector('p').textContent = lang.loadingMessages;
    }
    
    // Update messages
    displayMessages();
}

function getLocalizedText(key) {
    return languages[currentLanguage][key] || key;
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .like-btn.liked {
        color: #e53e3e !important;
    }
    
    .like-btn.liked i {
        color: #e53e3e !important;
    }
`;
document.head.appendChild(style);

// Initialize the app
document.addEventListener('DOMContentLoaded', init); 

// Update IP Analysis Security Status
function updateIPSecurityStatus() {
    const securityStatus = document.getElementById('securityStatus');
    const ipIndicator = document.getElementById('ipAnalysisIndicator');
    
    if (!securityStatus || !ipIndicator) return;
    
    const stats = getIPStatistics();
    const clientIP = getClientIP();
    const ipActivity = ipActivityMap.get(clientIP);
    
    // Show security status if there's activity
    if (stats.totalIPs > 0) {
        securityStatus.style.display = 'block';
    }
    
    // Update indicator based on current IP status
    if (ipBlocklist.has(clientIP)) {
        ipIndicator.className = 'security-indicator error';
        ipIndicator.innerHTML = '<i class="fas fa-ban"></i><span>IP Engellendi</span>';
    } else if (suspiciousIPs.has(clientIP)) {
        ipIndicator.className = 'security-indicator warning';
        ipIndicator.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Şüpheli IP</span>';
    } else if (ipActivity && ipActivity.accountCount > 1) {
        ipIndicator.className = 'security-indicator warning';
        ipIndicator.innerHTML = `<i class="fas fa-users"></i><span>${ipActivity.accountCount} Hesap</span>`;
    } else {
        ipIndicator.className = 'security-indicator success';
        ipIndicator.innerHTML = '<i class="fas fa-shield-check"></i><span>IP Güvenli</span>';
    }
}

// Initialize IP Analysis
function initializeIPAnalysis() {
    // Update security status every 30 seconds
    setInterval(updateIPSecurityStatus, 30000);
    
    // Clean up old IP data every hour
    setInterval(() => {
        const currentTime = Date.now();
        const oneHour = 3600000;
        
        ipActivityMap.forEach((activity, ip) => {
            if (currentTime - activity.lastActivity > oneHour) {
                ipActivityMap.delete(ip);
            }
        });
    }, 3600000);
    
    // Initial status update
    updateIPSecurityStatus();
} 