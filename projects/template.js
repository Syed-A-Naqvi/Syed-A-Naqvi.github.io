/**
 * template.js - Minimal functionality for table of contents
 * Only includes essential TOC toggle and smooth scrolling
 */

(function() {
    'use strict';

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Get the template container
        const templateContainer = document.getElementById('template-container');
        if (!templateContainer) {
            console.warn('Template container not found');
            return;
        }

        // TOC functionality
        const tocToggle = templateContainer.querySelector('#toc-toggle');
        const tocClose = templateContainer.querySelector('#toc-close');
        const tocContainer = templateContainer.querySelector('.toc-container');
        const tocLinks = templateContainer.querySelectorAll('.toc-content a');

        // Toggle TOC visibility
        if (tocToggle && tocContainer) {
            tocToggle.addEventListener('click', function() {
                tocContainer.classList.toggle('active');
            });
        }

        // Close TOC button
        if (tocClose && tocContainer) {
            tocClose.addEventListener('click', function() {
                tocContainer.classList.remove('active');
            });
        }

        // Smooth scrolling for TOC links
        tocLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        // Close TOC if open
                        if (tocContainer) {
                            tocContainer.classList.remove('active');
                        }
                        
                        // Smooth scroll to target
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // Highlight current section in TOC
        const headings = templateContainer.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const id = entry.target.id;
                            const activeLink = templateContainer.querySelector(`.toc-content a[href="#${id}"]`);
                            
                            // Remove active class from all links
                            tocLinks.forEach(link => link.classList.remove('active'));
                            
                            // Add active class to current link
                            if (activeLink) {
                                activeLink.classList.add('active');
                            }
                        }
                    });
                },
                { rootMargin: '-10% 0px -80% 0px' }
            );
            
            headings.forEach(heading => observer.observe(heading));
        }
    });
})();
