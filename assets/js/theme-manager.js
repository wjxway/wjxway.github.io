/* Theme Manager - Auto-adapt to system theme */
(function() {
    'use strict';
    
    const THEME_STORAGE_KEY = 'preferred-theme';
    const LIGHT_THEME_ID = 'light-theme';
    const DARK_THEME_ID = 'dark-theme';
    
    // Create theme link elements
    function createThemeLinks() {
        const head = document.head;
        
        // Light theme link
        const lightThemeLink = document.createElement('link');
        lightThemeLink.id = LIGHT_THEME_ID;
        lightThemeLink.rel = 'stylesheet';
        lightThemeLink.href = 'assets/css/themes.light.css';
        
        // Dark theme link
        const darkThemeLink = document.createElement('link');
        darkThemeLink.id = DARK_THEME_ID;
        darkThemeLink.rel = 'stylesheet';
        darkThemeLink.href = 'assets/css/themes.dark.css';
        darkThemeLink.disabled = true; // Initially disabled
        
        // Insert after main.css
        const mainCss = document.querySelector('link[href*="main.css"]');
        if (mainCss) {
            mainCss.parentNode.insertBefore(lightThemeLink, mainCss.nextSibling);
            mainCss.parentNode.insertBefore(darkThemeLink, lightThemeLink.nextSibling);
        } else {
            head.appendChild(lightThemeLink);
            head.appendChild(darkThemeLink);
        }
        
        return { lightThemeLink, darkThemeLink };
    }
    
    // Get user's theme preference
    function getThemePreference() {
        // 1. Check if user has manually set a preference (highest priority)
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            return savedTheme;
        }
        
        // 2. Check system preference (recommended approach)
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        // // 3. Fallback: Check time-based preference (optional enhancement)
        // // Auto dark mode during night hours (18:00 - 06:00)
        // const hour = new Date().getHours();
        // if (hour >= 18 || hour < 6) {
        //     return 'dark';
        // }
        
        // 4. Default to light theme
        return 'light';
    }
    
    // Apply theme
    function applyTheme(theme, links) {
        const { lightThemeLink, darkThemeLink } = links;
        
        if (theme === 'dark') {
            lightThemeLink.disabled = true;
            darkThemeLink.disabled = false;
            document.body.setAttribute('data-theme', 'dark');
        } else {
            lightThemeLink.disabled = false;
            darkThemeLink.disabled = true;
            document.body.setAttribute('data-theme', 'light');
        }
        
        console.log('Applied theme:', theme);
    }
    
    // Set theme and save preference
    function setTheme(theme, links) {
        applyTheme(theme, links);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
    
    // Toggle between themes
    function toggleTheme(links) {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme, links);
        return newTheme;
    }
    
    // Listen for system theme changes
    function listenForSystemThemeChange(links) {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', function(e) {
                // Only auto-switch if user hasn't manually set a preference
                const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
                if (!savedTheme) {
                    const systemTheme = e.matches ? 'dark' : 'light';
                    applyTheme(systemTheme, links);
                    console.log('System theme changed to:', systemTheme);
                }
            });
        }
    }
    
    // Initialize theme system
    function initThemeSystem() {
        // Remove any existing theme links that might be hardcoded
        const existingLightTheme = document.querySelector('link[href*="themes.light.css"]');
        const existingDarkTheme = document.querySelector('link[href*="themes.dark.css"]');
        if (existingLightTheme) existingLightTheme.remove();
        if (existingDarkTheme) existingDarkTheme.remove();
        
        // Create new theme links
        const links = createThemeLinks();
        
        // Apply initial theme
        const initialTheme = getThemePreference();
        applyTheme(initialTheme, links);
        
        // Listen for system theme changes
        listenForSystemThemeChange(links);
        
        // Make theme functions globally available
        window.ThemeManager = {
            setTheme: (theme) => setTheme(theme, links),
            toggleTheme: () => toggleTheme(links),
            getCurrentTheme: () => document.body.getAttribute('data-theme') || 'light',
            isSystemDarkMode: () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        };
        
        console.log('Theme system initialized with theme:', initialTheme);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeSystem);
    } else {
        initThemeSystem();
    }
})();
