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
    initProjectFilters();
    
    // Initialize contact form (placeholder)
    initContactForm();
});

// Initialize project filters functionality
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filter = button.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    const tags = card.getAttribute('data-tags');
                    if (tags && tags.includes(filter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

// Initialize contact form (placeholder functionality)
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Normally, this would send data to a server
            // For now, just log the form submission
            console.log('Form submitted!');
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const organization = document.getElementById('organization').value;
            const message = document.getElementById('message').value;
            
            console.log({
                name,
                email,
                organization,
                message
            });
            
            // Show success message (placeholder)
            alert('Thank you for your message! This is a demo form, so no message was actually sent.');
            
            // Reset the form
            contactForm.reset();
        });
    }
}