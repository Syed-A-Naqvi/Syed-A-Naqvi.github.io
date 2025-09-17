/**
 * theme.js - Handles theme switching functionality
 * Implements dark/light mode toggle
 */

// Initialize theme toggle
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    const themeText = themeToggleBtn.querySelector('span');
    
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
    });
    
    // Function to enable dark mode
    function enableDarkMode() {
        document.body.classList.add('dark-theme');
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    }
    
    // Function to enable light mode
    function enableLightMode() {
        document.body.classList.remove('dark-theme');
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    }
}