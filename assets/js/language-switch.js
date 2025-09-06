/* Language Switch JavaScript */
document.addEventListener('DOMContentLoaded', function() {
    const langButtons = document.querySelectorAll('.lang-option');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Function to detect user's preferred language
    function detectUserLanguage() {
        // First check if user has a saved preference
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang) {
            return savedLang;
        }
        
        // Get browser language
        const browserLang = navigator.language || navigator.userLanguage;
        console.log('Browser language:', browserLang);
        
        // Check for Chinese variants
        if (browserLang.startsWith('zh')) {
            return 'zh';
        }
        
        // Check browser languages array for Chinese
        const browserLanguages = navigator.languages || [browserLang];
        for (let lang of browserLanguages) {
            if (lang.startsWith('zh')) {
                return 'zh';
            }
        }
        
        // Try to detect location-based preference (optional)
        // You could also add timezone-based detection
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log('User timezone:', timezone);
        
        // If timezone suggests Chinese-speaking region
        if (timezone.includes('Shanghai') || timezone.includes('Hong_Kong') || 
            timezone.includes('Taipei') || timezone.includes('Macau')) {
            return 'zh';
        }
        
        // Default to English
        return 'en';
    }
    
    // Load user's preferred language (auto-detected or saved)
    const defaultLang = detectUserLanguage();
    console.log('Detected/Selected language:', defaultLang);
    switchLanguage(defaultLang);
    
    langButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
            localStorage.setItem('preferred-language', lang);
        });
    });
    
    function switchLanguage(lang) {
        console.log('Switching to language:', lang);
        // Update body data attribute
        body.setAttribute('data-lang', lang);
        
        // Update active button
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });
        
        // Update HTML lang attribute
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
        console.log('Body data-lang:', body.getAttribute('data-lang'));
    }
    
    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.ThemeManager) {
                const newTheme = window.ThemeManager.toggleTheme();
                updateThemeIcon(newTheme);
                console.log('Switched to theme:', newTheme);
            }
        });
        
        // Update theme icon based on current theme
        function updateThemeIcon(theme) {
            if (theme === 'dark') {
                themeToggle.textContent = '🌙';
                themeToggle.title = 'Switch to light mode';
            } else {
                themeToggle.textContent = '☀️';
                themeToggle.title = 'Switch to dark mode';
            }
        }
        
        // Initial theme icon setup
        setTimeout(() => {
            if (window.ThemeManager) {
                const currentTheme = window.ThemeManager.getCurrentTheme();
                updateThemeIcon(currentTheme);
            }
        }, 100);
    }
});
