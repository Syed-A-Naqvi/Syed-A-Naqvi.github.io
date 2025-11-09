/**
 * theme.js - Handles theme switching functionality
 * Implements dark/light mode toggle
 */

// ************************************************************************************************
// IMPORTANT: need to extend by sending theme change post message to custom jupyter book iframe api
// ************************************************************************************************

// Initialize theme toggle
function initThemeToggle() {
    const rootStyles = getComputedStyle(document.documentElement);
    const transitionSpeed = rootStyles.getPropertyValue('--transition-speed').trim();
    const themeToggleBtn = document.querySelector('.theme-toggle-btn');
    const themeToggleIndicator = themeToggleBtn.querySelector('.theme-toggle-indicator');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme based on saved preference or system preference
    if (savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        enableDarkMode();
    } else {
        enableLightMode();
    }

    // Add click event listener to theme toggle button
    themeToggleBtn.addEventListener('click', () => {

        // Toggle theme based on current theme
        if (document.body.classList.contains('dark-theme')) {
            enableLightMode();
        } else {
            enableDarkMode();
        }

        // remove animation class manually before re-adding it
        themeIcon.classList.remove('animate');
        // force reflow
        void themeToggleIndicator.offsetWidth;

        function parseDuration(duration) {
            if(duration.endsWith('ms')) {
                return parseFloat(duration);
            } else if(duration.endsWith('s')) {
                return parseFloat(duration) * 1000;
            }
            return 0; // default fallback
        }

        const timeout = parseDuration(transitionSpeed);

        setTimeout( () => {
            // trigger animation after theme application
            themeIcon.classList.add('animate');
        }, timeout);

        // emit theme change event
        window.dispatchEvent(new CustomEvent('themeUpdated'))

    });
    
    // Function to enable dark mode
    function enableDarkMode() {
        document.body.classList.add('dark-theme');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
    
    // Function to enable light mode
    function enableLightMode() {
        document.body.classList.remove('dark-theme');
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    }
}