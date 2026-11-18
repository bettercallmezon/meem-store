/**
 * Meem Electronics Store - Central Configuration & Engine (100% Offline)
 * Features:
 * - Fixed Currency: ريال سعودي (ر.س / SAR)
 * - Dynamic Product Catalog CRUD (Base + Custom Products in localStorage)
 * - Admin Authentication Password System (Default: admin123)
 * - Customer WhatsApp Redirection Settings
 * - Anti-tamper AES & Checksum Encryption Engine
 */

const MEEM_CONFIG = {
    storeNameAr: "متجر ميم للإلكترونيات",
    storeSubAr: "القطع والمتحكمات الإلكترونية وحلول إنترنت الأشياء",
    storeNameEn: "Meem Electronics Store",
    
    // Default Store WhatsApp number (with country code, no + or spaces)
    defaultWhatsAppNumber: "966500000000",
    
    // Default Admin Authentication Password
    defaultAdminPassword: "admin123",
    
    // Shared secret key for encrypting and decrypting QR orders
    defaultSecretKey: "MEEM_ELECTRONICS_SECRET_2026",
    
    // Strictly Single Currency: ريال سعودي (SAR)
    currency: "ر.س",
    currencyName: "ريال سعودي"
};

// In-memory fallback if localStorage is unavailable
const _memoryStorage = {};

function storageGet(key) {
    if (typeof localStorage !== 'undefined') {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.warn('[MeemStore] localStorage read error:', e);
        }
    }
    return _memoryStorage[key] || null;
}

function storageSet(key, value) {
    const strVal = String(value);
    _memoryStorage[key] = strVal;
    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem(key, strVal);
            return { success: true };
        } catch (err) {
            console.warn(`[MeemStore] localStorage quota exceeded or write failed for key "${key}":`, err);
            return { success: false, error: 'تم تجاوز مساحة التخزين المتاحة في المتصفح. تم الاحتفاظ بالبيانات في الجلسة الحالية.' };
        }
    }
    return { success: true };
}

function storageRemove(key) {
    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('[MeemStore] localStorage remove error:', e);
        }
    }
    delete _memoryStorage[key];
}
/* ============================================================================
 * WhatsApp Store Settings
 * ============================================================================ */
function getStoreWhatsAppNumber() {
    return storageGet('MEEM_WHATSAPP_NUMBER') || MEEM_CONFIG.defaultWhatsAppNumber;
}

function setStoreWhatsAppNumber(number) {
    const cleaned = String(number).trim().replace(/[^0-9]/g, '');
    storageSet('MEEM_WHATSAPP_NUMBER', cleaned);
    return cleaned;
}

/* ============================================================================
 * Admin Authentication Password Management
 * ============================================================================ */
function getAdminPassword() {
    return storageGet('MEEM_ADMIN_PASSWORD') || MEEM_CONFIG.defaultAdminPassword;
}

function setAdminPassword(newPassword) {
    if (!newPassword || newPassword.trim().length < 4) {
        return { success: false, error: 'كلمة المرور يجب ألا تقل عن 4 أحرف' };
    }
    storageSet('MEEM_ADMIN_PASSWORD', newPassword.trim());
    return { success: true };
}

function verifyAdminPassword(enteredPassword) {
    return String(enteredPassword).trim() === getAdminPassword();
}

function isAdminAuthenticated() {
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('MEEM_ADMIN_LOGGED_IN') === 'true') {
        return true;
    }
    if (storageGet('MEEM_ADMIN_REMEMBERED') === 'true') {
        return true;
    }
    return false;
}

function setAdminSession(rememberMe = false) {
    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('MEEM_ADMIN_LOGGED_IN', 'true');
    }
    if (rememberMe) {
        storageSet('MEEM_ADMIN_REMEMBERED', 'true');
    }
}

function clearAdminSession() {
    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('MEEM_ADMIN_LOGGED_IN');
    }
    storageRemove('MEEM_ADMIN_REMEMBERED');
}

/* ============================================================================
 * Secret Key Configuration
 * ============================================================================ */
function getStoreSecretKey() {
    return storageGet('MEEM_SECRET_KEY') || MEEM_CONFIG.defaultSecretKey;
}

/* ============================================================================
 * Theme Management (Light / Dark Switcher)
 * ============================================================================ */
function getStoredTheme() {
    return storageGet('MEEM_THEME') || 'light';
}

function applyTheme(theme) {
    const isDark = theme === 'dark';
    storageSet('MEEM_THEME', theme);
    if (typeof document === 'undefined') {
        return theme;
    }
    const html = document.documentElement;
    const body = document.body;

    if (isDark) {
        html.classList.add('dark');
        html.classList.remove('light');
        if (body) {
            body.classList.add('dark');
            body.classList.remove('theme-light');
        }
    } else {
        html.classList.remove('dark');
        html.classList.add('light');
        if (body) {
            body.classList.remove('dark');
            body.classList.add('theme-light');
        }
    }

    // Update any theme toggles in the DOM
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        const iconContainer = btn.querySelector('.theme-toggle-icon');
        const textContainer = btn.querySelector('.theme-toggle-text');
        if (iconContainer) {
            iconContainer.innerHTML = isDark ? getIcon('sun', 16) : getIcon('moon', 16);
        }
        if (textContainer) {
            textContainer.textContent = isDark ? 'الوضع النهاري' : 'الوضع الليلي';
        }
    });
}

function toggleTheme() {
    const current = getStoredTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    return next;
}

/* ============================================================================
 * Hero Carousel Management (Auto-slider & Admin Configurable)
 * ============================================================================ */
const DEFAULT_CAROUSEL_SLIDES = [
    {
        id: 'SLIDE-1',
        badge: 'متحكمات ذكية 2026',
        badgeColor: '#00B574',
        title: 'شريحة ESP32 & أردوينو الأصلية',
        subtitle: 'لوحات التطوير الرائدة لمشاريع إنترنت الأشياء IoT والروبوتات بدعم كامل لمختلف الحساسات البرمجية.',
        buttonText: 'تصفح المتحكمات',
        buttonCategory: 'microcontrollers',
        image: './assets/images/esp32.svg',
        bgImage: './assets/images/bg-circuit.svg'
    },
    {
        id: 'SLIDE-2',
        badge: 'دقة واحترافية',
        badgeColor: '#1DA1B9',
        title: 'حساسات التوازن والمسافة والغازات',
        subtitle: 'تشكيلة متكاملة من حساسات HC-SR04 و DHT22 و MPU-6050 لمشاريع التخرج والأنظمة الذكية.',
        buttonText: 'استعرض الحساسات',
        buttonCategory: 'sensors',
        image: './assets/images/sensors.svg',
        bgImage: './assets/images/bg-iot-grid.svg'
    },
    {
        id: 'SLIDE-3',
        badge: 'نظام شراء ذكي',
        badgeColor: '#7C3AED',
        title: 'باركود مشفر خاص بطلبك عبر واتساب',
        subtitle: 'أضف القطع للسلة وحدد موقعك بدقة، وسيقوم المتجر بإنشاء تذكرة باركود مشفرة لإرسالها وتأكيد الدفع فوراً.',
        buttonText: 'ابدأ التسوق الآن',
        buttonCategory: 'all',
        image: './assets/images/tools.svg',
        bgImage: './assets/images/bg-lab.svg'
    }
];

function getCarouselSlides() {
    try {
        const stored = storageGet('MEEM_CAROUSEL_SLIDES');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.error('Error reading carousel slides:', e);
    }
    return DEFAULT_CAROUSEL_SLIDES;
}

function saveCarouselSlide(slide) {
    if (!slide || !slide.title) {
        return { success: false, error: 'عنوان الشريحة مطلوب' };
    }
    if (!slide.id) {
        slide.id = 'SLIDE-' + Math.floor(100 + Math.random() * 900);
    }

    const slides = [...getCarouselSlides()];
    const index = slides.findIndex(s => s.id === slide.id);
    if (index !== -1) {
        slides[index] = { ...slides[index], ...slide };
    } else {
        slides.push(slide);
    }

    storageSet('MEEM_CAROUSEL_SLIDES', JSON.stringify(slides));
    return { success: true, slide };
}

function deleteCarouselSlide(slideId) {
    let slides = getCarouselSlides().filter(s => s.id !== slideId);
    if (slides.length === 0) {
        slides = DEFAULT_CAROUSEL_SLIDES;
    }
    storageSet('MEEM_CAROUSEL_SLIDES', JSON.stringify(slides));
    return { success: true };
}

function resetCarouselSlides() {
    storageRemove('MEEM_CAROUSEL_SLIDES');
    return DEFAULT_CAROUSEL_SLIDES;
}

/* ============================================================================
 * Categories Definition
 * ============================================================================ */
const MEEM_CATEGORIES = [
    { id: 'all', name: 'جميع القطع', icon: 'layers' },
    { id: 'microcontrollers', name: 'المتحكمات ولوحات التطوير', icon: 'microchip' },
    { id: 'sensors', name: 'الحساسات والمستشعرات', icon: 'sensor' },
    { id: 'actuators_power', name: 'المحركات والمشغلات ومغذيات الطاقة', icon: 'bolt' },
    { id: 'tools_prototyping', name: 'معدات القياس واللحام والتجميع', icon: 'tools' }
];

/* ============================================================================
 * Base Electronics Inventory (100% Local Vector Graphics)
 * ============================================================================ */
const BASE_PRODUCTS = [
    {
        id: 'ESP-32S',
        name: 'شريحة ESP32 WROOM-32 Wi-Fi & Bluetooth مزدوجة النواة',
        category: 'microcontrollers',
        price: 38,
        stock: 45,
        badge: 'الأكثر طلباً',
        badgeColor: 'emerald',
        images: ['./assets/images/esp32.svg'],
        shortDesc: 'لوحة التطوير الرائدة لمشاريع إنترنت الأشياء IoT مع واي فاي وبلوتوث مدمجين.',
        fullDesc: 'تتميز بمعالج Xtensa® Dual-Core 32-bit بتردد يصل حتى 240MHz مع دعم Wi-Fi 802.11 b/g/n و Bluetooth v4.2 BLE.',
        specs: {
            'جهد التشغيل': '3.3V DC (منفذ Micro-USB 5V)',
            'المعالج': 'Xtensa Dual-Core 32-bit LX6',
            'التردد': '240 MHz',
            'الذاكرة': '520 KB SRAM / 4 MB Flash',
            'المنافذ': '36 منفذ GPIO متكامل'
        },
        pinoutSummary: 'يدعم منافذ I2C, SPI, UART, PWM, ADC, DAC'
    },
    {
        id: 'ARD-UNO3',
        name: 'لوحة أردوينو أونو الرسمية Arduino Uno R3 الأصلي + كابل USB',
        category: 'microcontrollers',
        price: 49,
        stock: 30,
        badge: 'أساسي للمبتدئين',
        badgeColor: 'blue',
        images: ['./assets/images/arduino.svg'],
        shortDesc: 'اللوحة التعليمية والمهنية الأشهر لتعلم الإلكترونيات والبرمجة بالـ C++.',
        fullDesc: 'مبنية على شريحة ATmega328P، وتتضمن 14 منفذ رقمي (منها 6 PWM) و 6 مداخل تشابهية Analog ومقبس تغذية خارجي 7-12V.',
        specs: {
            'جهد التشغيل': '5V DC',
            'المعالج': 'ATmega328P 8-bit AVR',
            'التردد': '16 MHz',
            'المنافذ الرقمية': '14 منفذ (6 PWM)',
            'المداخل التشابهية': '6 قنوات 10-bit'
        },
        pinoutSummary: 'متوافق مع منصات Arduino IDE, PlatformIO, MATLAB'
    },
    {
        id: 'RPI-5-8G',
        name: 'كمبيوتر مصغر رازبيري باي Raspberry Pi 5 - 8GB RAM',
        category: 'microcontrollers',
        price: 375,
        stock: 12,
        badge: 'أعلى أداء AI',
        badgeColor: 'purple',
        images: ['./assets/images/rpi5.svg'],
        shortDesc: 'كمبيوتر بطاقة واحدة متكامل بسرعة معالجة فائقة 2.4GHz وشاشتين 4K.',
        fullDesc: 'معالج Broadcom BCM2712 رباعي النواة Arm Cortex-A76، معالج رسوميات VideoCore VII، ذاكرة 8GB LPDDR4X، ومنفذ PCIe 2.0.',
        specs: {
            'المعالج': 'Quad-core Arm Cortex-A76 @ 2.4GHz',
            'الذاكرة': '8GB LPDDR4X SDRAM',
            'منافذ الشاشة': 'منفذا Micro-HDMI بدقة 4K@60Hz HDR',
            'الشبكة': 'Gigabit Ethernet, Dual-band Wi-Fi, BT 5.0'
        },
        pinoutSummary: '40-pin GPIO القياسي مع شيلدات التوسعة'
    },
    {
        id: 'SNS-US04',
        name: 'حساس المسافة بالموجات فوق الصوتية HC-SR04 دقيق المدى',
        category: 'sensors',
        price: 14,
        stock: 80,
        badge: 'حساس كلاسيكي',
        badgeColor: 'teal',
        images: ['./assets/images/sensors.svg'],
        shortDesc: 'لقياس المسافات واكتشاف العوائق من 2 سم حتى 400 سم بدقة 3 مم.',
        fullDesc: 'يعمل بإرسال نبضات موجات فوق صوتية بتردد 40kHz وقياس زمن الارتداد لحساب المسافة بدقة عالية.',
        specs: {
            'جهد التشغيل': '5V DC',
            'تيار العمل': '15 mA',
            'نطاق القياس': '2 cm – 400 cm',
            'زاوية القياس': '15 درجة'
        },
        pinoutSummary: 'أطراف التوصيل: VCC, TRIG, ECHO, GND'
    },
    {
        id: 'TOL-DMM1',
        name: 'جهاز أفوميتر رقمي ذكي True RMS Auto-Ranging Multimeter',
        category: 'tools_prototyping',
        price: 110,
        stock: 25,
        badge: 'أساسي للمختبر',
        badgeColor: 'purple',
        images: ['./assets/images/tools.svg'],
        shortDesc: 'لقياس الجهد، التيار، المقاومة، المكثفات، وفحص التوصيل مع شاشة مضيئة.',
        fullDesc: 'ملتيميتر احترافي ذكي يحدد النطاق تلقائياً Auto-Ranging بدقة تامة بفضل تقنية True RMS.',
        specs: {
            'نطاق الجهد DC/AC': 'حتى 600V بدقة 0.5%',
            'نطاق التيار': 'حتى 10A',
            'فحص الاستمرارية': 'جرس تنبيه وصمام ضوئي',
            'الأمان': 'CAT III 600V'
        },
        pinoutSummary: 'يأتي مع مجسات فحص دقيقة وحافظة صدمات'
    }
];

/* ============================================================================
 * Dynamic Product CRUD System (Base + Custom Products in localStorage)
 * ============================================================================ */
function getCustomProducts() {
    try {
        const stored = storageGet('MEEM_CUSTOM_PRODUCTS');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Error loading custom products:', e);
        return [];
    }
}

function getAllProducts() {
    const custom = getCustomProducts();
    const customIds = new Set(custom.map(p => p.id));
    const merged = BASE_PRODUCTS.filter(p => !customIds.has(p.id)).concat(custom);
    return merged;
}

function saveCustomProduct(product) {
    if (!product || !product.name || !product.price) {
        return { success: false, error: 'الاسم والسعر مطلوبان' };
    }

    if (!product.id) {
        product.id = 'M-' + Math.floor(100 + Math.random() * 900);
    }

    product.price = Number(product.price);
    product.stock = Number(product.stock || 10);
    if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
        product.images = product.image ? [product.image] : ['./assets/images/placeholder.svg'];
    }
    if (!product.image) {
        product.image = product.images[0];
    }

    const currentCustom = getCustomProducts();
    const existingIndex = currentCustom.findIndex(p => p.id === product.id);

    if (existingIndex !== -1) {
        currentCustom[existingIndex] = { ...currentCustom[existingIndex], ...product };
    } else {
        currentCustom.unshift(product);
    }

    try {
        const setRes = storageSet('MEEM_CUSTOM_PRODUCTS', JSON.stringify(currentCustom));
        if (setRes && setRes.success === false) {
            return { 
                success: true, 
                product, 
                warning: 'تم حفظ المنتج في ذاكرة الجلسة (تم تجاوز مساحة التخزين الدائم للمتصفح).' 
            };
        }
        return { success: true, product };
    } catch (err) {
        console.error('saveCustomProduct storage error:', err);
        return { success: false, error: 'حدث خطأ أثناء حفظ المنتج: ' + err.message };
    }
}

function deleteCustomProduct(productId) {
    let currentCustom = getCustomProducts();
    currentCustom = currentCustom.filter(p => p.id !== productId);
    storageSet('MEEM_CUSTOM_PRODUCTS', JSON.stringify(currentCustom));
    return { success: true };
}

/* ============================================================================
 * Cryptographic Engine (AES-like Anti-Tamper Checksum)
 * ============================================================================ */
function computeChecksum(str) {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = (hash * 16777619) >>> 0;
    }
    return hash.toString(36).toUpperCase();
}

function encryptOrder(orderObj, secretKey = getStoreSecretKey()) {
    const compactOrder = {
        oid: String(orderObj.orderId || '').trim(),
        ts: String(orderObj.timestamp || '').trim(),
        cust: {
            n: String(orderObj.customer?.name || '').trim().slice(0, 40),
            p: String(orderObj.customer?.phone || '').trim().slice(0, 20),
            a: String(orderObj.customer?.address || '').trim().slice(0, 80),
            gps: String(orderObj.customer?.gps || '').trim().slice(0, 40),
            note: String(orderObj.customer?.notes || '').trim().slice(0, 60)
        },
        cart: (orderObj.items || []).map(item => ({
            id: String(item.id || '').trim().slice(0, 15),
            n: String(item.name || '').trim().slice(0, 30),
            q: Number(item.qty || 1),
            p: Number(item.price || 0)
        })),
        tot: Number(orderObj.total || 0),
        cur: MEEM_CONFIG.currency // Fixed SAR: ريال سعودي
    };

    const jsonString = JSON.stringify(compactOrder);
    const checksum = computeChecksum(jsonString + '::' + secretKey);
    const packageToEncrypt = JSON.stringify({ d: compactOrder, chk: checksum });

    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(packageToEncrypt);
    const keyBytes = encoder.encode(secretKey + '::MEEM::2026');

    const encryptedBytes = new Uint8Array(dataBytes.length);
    for (let i = 0; i < dataBytes.length; i++) {
        const k = keyBytes[i % keyBytes.length];
        encryptedBytes[i] = ((dataBytes[i] ^ k) + (i % 7)) & 0xFF;
    }

    let binary = '';
    for (let i = 0; i < encryptedBytes.length; i++) {
        binary += String.fromCharCode(encryptedBytes[i]);
    }

    const base64 = btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return `MEEM-ENC::${orderObj.orderId}::${base64}`;
}

function decryptOrder(cipherString, secretKey = getStoreSecretKey()) {
    try {
        if (!cipherString || typeof cipherString !== 'string') {
            return { success: false, error: 'الرمز المشفر فارغ أو غير صالح' };
        }

        const trimmed = cipherString.trim();
        let base64Part = trimmed;

        if (trimmed.includes('MEEM-ENC::')) {
            const parts = trimmed.split('::');
            base64Part = parts[parts.length - 1].trim().split(/\s+/)[0];
        }

        let base64 = base64Part.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) {
            base64 += '=';
        }

        const binary = atob(base64);
        const encryptedBytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            encryptedBytes[i] = binary.charCodeAt(i);
        }

        const encoder = new TextEncoder();
        const keyBytes = encoder.encode(secretKey + '::MEEM::2026');
        const decryptedBytes = new Uint8Array(encryptedBytes.length);

        for (let i = 0; i < encryptedBytes.length; i++) {
            const k = keyBytes[i % keyBytes.length];
            let val = (encryptedBytes[i] - (i % 7)) & 0xFF;
            decryptedBytes[i] = (val ^ k) & 0xFF;
        }

        const decoder = new TextDecoder('utf-8');
        const jsonStr = decoder.decode(decryptedBytes);
        const parsedPackage = JSON.parse(jsonStr);

        if (!parsedPackage.d || !parsedPackage.chk) {
            return { success: false, error: 'هيكل البيانات المشفرة تالف' };
        }

        const reconstructedDataStr = JSON.stringify(parsedPackage.d);
        const expectedChecksum = computeChecksum(reconstructedDataStr + '::' + secretKey);

        if (parsedPackage.chk !== expectedChecksum) {
            return { success: false, error: 'تحذير: فشل التحقق من صحة التوقيع المشفر (بيانات معدلة أو مفتاح غير مطابق)' };
        }

        const d = parsedPackage.d;
        return {
            success: true,
            order: {
                orderId: d.oid,
                timestamp: d.ts,
                customer: {
                    name: d.cust.n,
                    phone: d.cust.p,
                    address: d.cust.a,
                    gps: d.cust.gps,
                    notes: d.cust.note
                },
                items: d.cart.map(i => ({
                    id: i.id,
                    name: i.n,
                    qty: i.q,
                    price: i.p,
                    total: i.q * i.p
                })),
                total: d.tot,
                currency: MEEM_CONFIG.currency
            }
        };
    } catch (err) {
        console.error('Decryption error:', err);
        return { success: false, error: 'تعذر فك التشفير. تأكد من صحة الرمز المنسوخ والمفتاح السري.' };
    }
}

function isGitHubPages() {
    return typeof window !== 'undefined' && 
           window.location && 
           typeof window.location.hostname === 'string' && 
           window.location.hostname.endsWith('github.io');
}

/* ============================================================================
 * MeemAPI - Full-Stack Client for MySQL Database on WAMP Localhost
 * Connects to PHP REST API endpoints with seamless fallback to localStorage
 * ============================================================================ */
const MeemAPI = {
    _apiBase: './api',
    _isBackendActive: null,

    async isConnected() {
        if (typeof window === 'undefined') return false;
        if (window.location.protocol === 'file:') return false;
        // Instant check: On GitHub Pages, hosting is static cloud without PHP/MySQL
        if (isGitHubPages()) {
            this._isBackendActive = false;
            return false;
        }
        if (this._isBackendActive !== null) return this._isBackendActive;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2500);
            const res = await fetch(`${this._apiBase}/settings.php`, {
                method: 'GET',
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.ok) {
                const data = await res.json();
                this._isBackendActive = data && data.database === 'connected';
                return this._isBackendActive;
            }
        } catch (e) {
            this._isBackendActive = false;
        }
        return false;
    },

    async getProducts(category = 'all', search = '') {
        if (await this.isConnected()) {
            try {
                let url = `${this._apiBase}/products.php?category=${encodeURIComponent(category)}`;
                if (search) url += `&search=${encodeURIComponent(search)}`;
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && Array.isArray(data.products)) {
                        // Cache in localStorage for offline resiliency
                        try {
                            storageSet('MEEM_CACHED_MYSQL_PRODUCTS', JSON.stringify(data.products));
                        } catch (err) {}
                        return data.products;
                    }
                }
            } catch (err) {
                console.warn('[MeemAPI] Failed to fetch from MySQL API, falling back to local store:', err);
            }
        }
        // Fallback to local storage
        let products = getAllProducts();
        if (category && category !== 'all') {
            products = products.filter(p => p.category === category);
        }
        if (search) {
            const q = search.toLowerCase();
            products = products.filter(p => 
                (p.name && p.name.toLowerCase().includes(q)) || 
                (p.shortDesc && p.shortDesc.toLowerCase().includes(q)) ||
                (p.id && p.id.toLowerCase().includes(q))
            );
        }
        return products;
    },

    async saveProduct(productData) {
        if (await this.isConnected()) {
            try {
                const res = await fetch(`${this._apiBase}/products.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
                const data = await res.json();
                if (data.success) {
                    // Also update local store for hybrid consistency
                    saveCustomProduct(data.product || productData);
                    return { success: true, product: data.product, mode: 'mysql' };
                } else {
                    return { success: false, error: data.error || 'فشل حفظ المنتج في قاعدة البيانات' };
                }
            } catch (err) {
                console.warn('[MeemAPI] MySQL save failed, using local storage:', err);
            }
        }
        // Fallback
        const localRes = saveCustomProduct(productData);
        return { ...localRes, mode: 'local' };
    },

    async deleteProduct(productId) {
        if (await this.isConnected()) {
            try {
                const res = await fetch(`${this._apiBase}/products.php?id=${encodeURIComponent(productId)}`, {
                    method: 'DELETE'
                });
                const data = await res.json();
                if (data.success) {
                    deleteCustomProduct(productId);
                    return { success: true, mode: 'mysql' };
                }
            } catch (err) {
                console.warn('[MeemAPI] MySQL delete failed, using local storage:', err);
            }
        }
        const localRes = deleteCustomProduct(productId);
        return { ...localRes, mode: 'local' };
    },

    async getCarouselSlides() {
        if (await this.isConnected()) {
            try {
                const res = await fetch(`${this._apiBase}/carousel.php`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && Array.isArray(data.slides) && data.slides.length > 0) {
                        return data.slides;
                    }
                }
            } catch (err) {
                console.warn('[MeemAPI] Failed to fetch carousel from MySQL, falling back to local slides:', err);
            }
        }
        return getCarouselSlides();
    },

    async saveCarouselSlide(slideData) {
        if (await this.isConnected()) {
            try {
                const res = await fetch(`${this._apiBase}/carousel.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(slideData)
                });
                const data = await res.json();
                if (data.success) {
                    saveCarouselSlide(data.slide || slideData);
                    return { success: true, slide: data.slide, mode: 'mysql' };
                }
            } catch (err) {
                console.warn('[MeemAPI] MySQL carousel save failed, using local storage:', err);
            }
        }
        const localRes = saveCarouselSlide(slideData);
        return { ...localRes, mode: 'local' };
    },

    async deleteCarouselSlide(slideId) {
        if (await this.isConnected()) {
            try {
                const res = await fetch(`${this._apiBase}/carousel.php?id=${encodeURIComponent(slideId)}`, {
                    method: 'DELETE'
                });
                const data = await res.json();
                if (data.success) {
                    deleteCarouselSlide(slideId);
                    return { success: true, mode: 'mysql' };
                }
            } catch (err) {
                console.warn('[MeemAPI] MySQL carousel delete failed, using local storage:', err);
            }
        }
        const localRes = deleteCarouselSlide(slideId);
        return { ...localRes, mode: 'local' };
    },

    async verifyAdminPasswordDetailed(password) {
        const isConn = await this.isConnected();
        if (isConn) {
            try {
                const res = await fetch(`${this._apiBase}/settings.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'login', password: String(password) })
                });
                let data = null;
                try {
                    data = await res.json();
                } catch (jsonErr) {
                    data = { success: false, error: 'تعذر قراءة استجابة الخادم كـ JSON' };
                }

                if (res.ok && data && data.success && data.authenticated) {
                    return {
                        valid: true,
                        mode: 'mysql',
                        statusCode: res.status,
                        message: data.message || 'تم التحقق من هوية المسؤول بنجاح عبر قاعدة بيانات MySQL',
                        data
                    };
                } else {
                    return {
                        valid: false,
                        mode: 'mysql',
                        statusCode: res.status,
                        error: (data && data.error) ? data.error : `الخادم رفض كلمة المرور (رمز الحالة: ${res.status})`,
                        data
                    };
                }
            } catch (err) {
                const localValid = verifyAdminPassword(password);
                return {
                    valid: localValid,
                    mode: 'fallback_local',
                    statusCode: 0,
                    error: `تعذر الاتصال بـ API: ${err.message}`,
                    message: localValid ? 'تم التحقق عبر التخزين المحلي الاحتياطي' : 'فشل التحقق في الخادم والمحلي',
                    fallbackUsed: true
                };
            }
        }

        const localValid = verifyAdminPassword(password);
        return {
            valid: localValid,
            mode: 'local_storage',
            statusCode: 200,
            message: localValid ? 'تم التحقق بنجاح من التخزين المحلي للمتصفح' : 'كلمة المرور غير مطابقة للمحفوظ محلياً'
        };
    },

    async verifyAdminPassword(password) {
        const detailed = await this.verifyAdminPasswordDetailed(password);
        return detailed.valid;
    },

    async updateWhatsAppNumber(number) {
        const cleaned = setStoreWhatsAppNumber(number);
        if (await this.isConnected()) {
            try {
                await fetch(`${this._apiBase}/settings.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'update_whatsapp', whatsapp_number: cleaned })
                });
            } catch (err) {}
        }
        return cleaned;
    },

    async changeAdminPassword(newPassword, oldPassword = '') {
        const localRes = setAdminPassword(newPassword);
        if (!localRes.success) return localRes;

        if (await this.isConnected()) {
            try {
                const res = await fetch(`${this._apiBase}/settings.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        action: 'change_password', 
                        new_password: newPassword,
                        old_password: oldPassword 
                    })
                });
                const data = await res.json();
                return data;
            } catch (err) {
                return { success: true, warning: 'تم الحفظ في المتصفح محلياً (الخادم غير متاح)' };
            }
        }
        return localRes;
    }
};

// Export for Node.js test environment if applicable
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MEEM_CONFIG,
        MeemAPI,
        storageGet,
        storageSet,
        storageRemove,
        getStoreWhatsAppNumber,
        setStoreWhatsAppNumber,
        getAdminPassword,
        setAdminPassword,
        verifyAdminPassword,
        isAdminAuthenticated,
        setAdminSession,
        clearAdminSession,
        getStoreSecretKey,
        getStoredTheme,
        applyTheme,
        toggleTheme,
        DEFAULT_CAROUSEL_SLIDES,
        getCarouselSlides,
        saveCarouselSlide,
        deleteCarouselSlide,
        resetCarouselSlides,
        MEEM_CATEGORIES,
        BASE_PRODUCTS,
        getCustomProducts,
        getAllProducts,
        saveCustomProduct,
        deleteCustomProduct,
        computeChecksum,
        encryptOrder,
        decryptOrder,
        isGitHubPages
    };
}

