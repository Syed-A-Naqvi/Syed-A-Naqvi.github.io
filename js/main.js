/**
 * main.js - Main JavaScript file for the portfolio website
 * Contains initialization and common functions
 */

// Document Ready Function
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('Portfolio site loaded successfully');
    
    
    // Initialize the theme toggle
    initThemeToggle();
    // Send initial theme broadcast
    window.dispatchEvent(new CustomEvent('themeUpdated'));

});