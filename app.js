// =====================================================
// Shafi Accounting Pro - Client-Side Application
// =====================================================

(function() {
    'use strict';

    // چک کردن آماده بودن DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }

    function initApp() {
        console.log('🚀 Shafi Accounting Pro - Starting Application...');

        // بررسی وجود index.html
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            loadMainApplication();
        } else {
            // هدایت به صفحه اصلی
            window.location.href = '/index.html';
        }
    }

    function loadMainApplication() {
        console.log('📄 Loading main application...');

        // چک کردن وجود فایل‌های ضروری
        checkRequiredFiles();

        // بارگذاری ماژول‌های اصلی
        loadModules();

        // تنظیم routing سمت کلاینت
        setupClientRouting();

        console.log('✅ Application loaded successfully!');
    }

    function checkRequiredFiles() {
        const requiredFiles = [
            './css/index.css',
            './js/common.js',
            './js/Product Management.js',
            './js/Customer Management.js',
            './js/Invoice Management.js',
            './js/Accounting Module.js',
            './js/Reports & Dashboard.js'
        ];

        requiredFiles.forEach(file => {
            fetch(file)
                .then(response => {
                    if (!response.ok) {
                        console.warn(`⚠️ File not found: ${file}`);
                    }
                })
                .catch(error => {
                    console.error(`❌ Error loading: ${file}`, error);
                });
        });
    }

    function loadModules() {
        // بارگذاری ماژول‌های JavaScript
        const modules = [
            './js/common.js',
            './js/Product Management.js',
            './js/Customer Management.js', 
            './js/Invoice Management.js',
            './js/Accounting Module.js',
            './js/Reports & Dashboard.js'
        ];

        modules.forEach(module => {
            const script = document.createElement('script');
            script.src = module;
            script.async = false;
            document.head.appendChild(script);
        });
    }

    function setupClientRouting() {
        // Simple client-side routing
        window.addEventListener('hashchange', handleRouteChange);
        handleRouteChange(); // Handle initial route
    }

    function handleRouteChange() {
        const hash = window.location.hash.slice(1) || 'dashboard';
        
        // مخفی کردن همه صفحات
        document.querySelectorAll('.page-content').forEach(page => {
            page.style.display = 'none';
        });

        // نمایش صفحه مورد نظر
        const targetPage = document.getElementById(hash + 'Page');
        if (targetPage) {
            targetPage.style.display = 'block';
        } else {
            // بازگشت به dashboard
            window.location.hash = 'dashboard';
        }
    }

    // Export برای استفاده در سایر فایل‌ها
    window.ShafiApp = {
        init: initApp,
        loadModule: loadModules,
        navigate: (page) => {
            window.location.hash = page;
        }
    };

})();

// =====================================================
// تنظیمات کلی اپلیکیشن
// =====================================================

const APP_CONFIG = {
    name: 'Shafi Accounting Pro',
    version: '1.0.0',
    description: 'سیستم حسابداری جامع شافی',
    baseUrl: window.location.origin,
    apiUrl: window.location.origin + '/api',
    modules: [
        'Product Management',
        'Customer Management',
        'Invoice Management', 
        'Accounting Module',
        'Reports & Dashboard'
    ]
};

// در دسترس قرار دادن تنظیمات
window.APP_CONFIG = APP_CONFIG;

console.log('📱 App Configuration:', APP_CONFIG);
