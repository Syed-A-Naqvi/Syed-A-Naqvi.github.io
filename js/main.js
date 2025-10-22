/**
 * main.js - Main JavaScript file for the portfolio website
 * Contains initialization and common functions
 */

// Document Ready Function
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio site loaded successfully');
    
    // Initialize the navigation
    initNavigation();
    
    // Initialize the theme toggle
    initThemeToggle();
    
    // Initialize project filters
    // initProjectFilters();

    // Initialize horizontal scroll for project gallery filters
    horizontalFilterContainerScroll();
    
});