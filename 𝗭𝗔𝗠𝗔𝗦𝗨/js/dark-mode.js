document.addEventListener('DOMContentLoaded', () => {
    // Get the theme switch checkbox with correct ID
    const themeSwitch = document.getElementById('theme-switch-checkbox');
    const root = document.documentElement;

    // Check if theme switch exists
    if (!themeSwitch) {
        console.warn('Theme switch not found');
        return;
    }

    // Define theme variables
    const themes = {
        light: {
            '--color-primary': '#4a90e2',
            '--color-secondary': '#764ba2',
            '--color-accent': '#f093fb',
            '--color-background': '#ffffff',
            '--color-surface': '#f5f7fa',
            '--color-surface-light': '#e9ecef',
            '--color-text': '#333333',
            '--color-text-light': '#6c757d',
            '--color-text-dark': '#1a1a1a',
            '--gradient-primary': 'linear-gradient(135deg, #4a90e2 0%, #764ba2 100%)',
            '--gradient-accent': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        dark: {
            '--color-primary': '#6ab0ff',
            '--color-secondary': '#9b59b6',
            '--color-accent': '#ff79c6',
            '--color-background': '#121212',
            '--color-surface': '#1e1e1e',
            '--color-surface-light': '#2d2d2d',
            '--color-text': '#e0e0e0',
            '--color-text-light': '#a0a0a0',
            '--color-text-dark': '#ffffff',
            '--gradient-primary': 'linear-gradient(135deg, #6ab0ff 0%, #9b59b6 100%)',
            '--gradient-accent': 'linear-gradient(135deg, #ff79c6 0%, #ff5555 100%)'
        }
    };

    // Function to apply theme
    function applyTheme(theme) {
        const themeVars = themes[theme];
        
        // Remove any existing theme classes
        document.body.classList.remove('light-theme', 'dark-theme');
        
        // Add the current theme class
        document.body.classList.add(`${theme}-theme`);
        
        // Apply CSS custom properties to root
        for (const [key, value] of Object.entries(themeVars)) {
            root.style.setProperty(key, value);
        }

        // Additional dynamic styling for better dark mode support
        if (theme === 'dark') {
            // Update meta theme-color for mobile browsers
            let metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (!metaThemeColor) {
                metaThemeColor = document.createElement('meta');
                metaThemeColor.name = 'theme-color';
                document.head.appendChild(metaThemeColor);
            }
            metaThemeColor.content = '#121212';

            // Ensure form elements have proper colors
            const formElements = document.querySelectorAll('input, textarea, select');
            formElements.forEach(element => {
                if (!element.style.backgroundColor || element.style.backgroundColor === '') {
                    element.style.backgroundColor = 'var(--color-surface)';
                }
                if (!element.style.color || element.style.color === '') {
                    element.style.color = 'var(--color-text)';
                }
                if (!element.style.borderColor || element.style.borderColor === '') {
                    element.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
            });

            // Ensure cards have proper background
            const cards = document.querySelectorAll('.service-card, .contact-form-container, .audio-demo-card, .audio-tabs');
            cards.forEach(card => {
                if (!card.style.backgroundColor || card.style.backgroundColor === '') {
                    card.style.backgroundColor = 'var(--color-surface)';
                }
                if (!card.style.color || card.style.color === '') {
                    card.style.color = 'var(--color-text)';
                }
            });

            // Fix header background in dark mode
            const header = document.querySelector('header');
            if (header) {
                header.style.background = 'rgba(30, 30, 30, 0.95)';
                header.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
            }

            // Fix footer background
            const footer = document.querySelector('.footer');
            if (footer) {
                footer.style.backgroundColor = 'var(--color-surface)';
                footer.style.borderTopColor = 'rgba(255, 255, 255, 0.1)';
            }

            // Fix navigation menu for mobile
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                navMenu.style.background = 'rgba(30, 30, 30, 0.98)';
                navMenu.style.borderTopColor = 'rgba(255, 255, 255, 0.1)';
            }

        } else {
            // Light mode - reset to defaults
            let metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) {
                metaThemeColor.content = '#ffffff';
            }

            // Reset form elements
            const formElements = document.querySelectorAll('input, textarea, select');
            formElements.forEach(element => {
                element.style.removeProperty('background-color');
                element.style.removeProperty('color');
                element.style.removeProperty('border-color');
            });

            // Reset cards
            const cards = document.querySelectorAll('.service-card, .contact-form-container, .audio-demo-card, .audio-tabs');
            cards.forEach(card => {
                card.style.removeProperty('background-color');
                card.style.removeProperty('color');
            });

            // Reset header
            const header = document.querySelector('header');
            if (header) {
                header.style.removeProperty('background');
                header.style.removeProperty('border-bottom-color');
            }

            // Reset footer
            const footer = document.querySelector('.footer');
            if (footer) {
                footer.style.removeProperty('background-color');
                footer.style.removeProperty('border-top-color');
            }

            // Reset navigation menu
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                navMenu.style.removeProperty('background');
                navMenu.style.removeProperty('border-top-color');
            }
        }

        // Trigger a custom event for other scripts that might need to know about theme changes
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: theme } 
        }));
    }

    // Function to get system theme preference
    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Initialize theme
    function initializeTheme() {
        // Check for saved theme preference first
        const savedTheme = localStorage.getItem('theme');
        let initialTheme;

        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            initialTheme = savedTheme;
        } else {
            // Fall back to system preference
            initialTheme = getSystemTheme();
        }

        // Apply the theme
        applyTheme(initialTheme);
        themeSwitch.checked = initialTheme === 'dark';
    }

    // Theme switch event listener
    themeSwitch.addEventListener('change', (e) => {
        const newTheme = e.target.checked ? 'dark' : 'light';
        applyTheme(newTheme);
        
        // Save preference
        try {
            localStorage.setItem('theme', newTheme);
        } catch (error) {
            console.warn('Could not save theme preference:', error);
        }
    });

    // Listen for system theme changes (only if user hasn't set a preference)
    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemThemeQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme(newTheme);
            themeSwitch.checked = e.matches;
        }
    });

    // Handle page visibility changes to ensure theme persists
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // Re-apply theme when page becomes visible (helps with some edge cases)
            const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            applyTheme(currentTheme);
        }
    });

    // Initialize the theme
    initializeTheme();

    // Add smooth transition class after initial load to prevent flash
    setTimeout(() => {
        document.body.classList.add('theme-transitions-enabled');
    }, 100);
});