/**
 * template.js - Interactive functionality for Pandoc notebook documents
 * Minimal JS for TOC interactions and code copying
 * All selectors scoped to .template-container for dynamic insertion
 * 
 * FUTURE INTEGRATION:
 * To dynamically insert this template into index.html, use:
 * 
 *   const templateContainer = document.getElementById('template-container');
 *   const templateHTML = templateContainer.innerHTML;
 *   // Insert templateHTML into target container in index.html
 *   targetElement.innerHTML = templateHTML;
 *   // Re-initialize template.js functionality on the new container
 */

(function() {
    'use strict';

    // Get the template container
    const templateContainer = document.getElementById('template-container');
    if (!templateContainer) {
        console.warn('Template container not found');
        return;
    }

    // ============================================
    // Table of Contents Management
    // ============================================

    const tocToggle = templateContainer.querySelector('#toc-toggle');
    const tocClose = templateContainer.querySelector('#toc-close');
    const tocContainer = templateContainer.querySelector('.toc-container');
    const tocLinks = templateContainer.querySelectorAll('.toc-content a');

    // Toggle TOC on mobile
    if (tocToggle && tocContainer) {
        tocToggle.addEventListener('click', function() {
            tocContainer.classList.add('active');
        });
    }

    if (tocClose && tocContainer) {
        tocClose.addEventListener('click', function() {
            tocContainer.classList.remove('active');
        });
    }

    // Close TOC when clicking outside (mobile)
    document.addEventListener('click', function(event) {
        if (tocContainer && tocContainer.classList.contains('active')) {
            if (!tocContainer.contains(event.target) && 
                event.target !== tocToggle &&
                !tocToggle.contains(event.target)) {
                tocContainer.classList.remove('active');
            }
        }
    });

    // Close TOC when clicking a link (mobile)
    tocLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992 && tocContainer) {
                tocContainer.classList.remove('active');
            }
        });
    });

    // ============================================
    // Active TOC Link Highlighting
    // ============================================

    // Get all headings in the template container
    const headings = templateContainer.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
    
    // Create a mapping of heading IDs to TOC links
    const headingToLink = new Map();
    tocLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const id = href.substring(1);
            headingToLink.set(id, link);
        }
    });

    // Intersection Observer for active link highlighting
    const observerOptions = {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    let activeLink = null;

    const observerCallback = function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const link = headingToLink.get(id);
                
                if (link) {
                    // Remove active class from previous link
                    if (activeLink) {
                        activeLink.classList.remove('active');
                    }
                    
                    // Add active class to current link
                    link.classList.add('active');
                    activeLink = link;
                    
                    // Scroll TOC to show active link (if needed)
                    const tocContent = templateContainer.querySelector('.toc-content');
                    if (tocContent && window.innerWidth > 992) {
                        const linkTop = link.offsetTop;
                        const tocHeight = tocContent.clientHeight;
                        const linkHeight = link.clientHeight;
                        
                        if (linkTop < tocContent.scrollTop || 
                            linkTop + linkHeight > tocContent.scrollTop + tocHeight) {
                            link.scrollIntoView({ block: 'center', behavior: 'smooth' });
                        }
                    }
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all headings
    headings.forEach(function(heading) {
        observer.observe(heading);
    });

    // ============================================
    // Smooth Scrolling for TOC Links
    // ============================================

    tocLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Calculate offset for fixed elements
                    const offset = 20; // pixels from top
                    const targetPosition = targetElement.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ============================================
    // Handle Window Resize
    // ============================================

    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close TOC on desktop if it's open
            if (window.innerWidth > 992 && tocContainer) {
                tocContainer.classList.remove('active');
            }
        }, 250);
    });

    // ============================================
    // Keyboard Navigation
    // ============================================

    document.addEventListener('keydown', function(event) {
        // Escape key closes TOC on mobile
        if (event.key === 'Escape' && tocContainer && tocContainer.classList.contains('active')) {
            tocContainer.classList.remove('active');
        }
        
        // T key toggles TOC on mobile
        if (event.key === 't' || event.key === 'T') {
            if (window.innerWidth <= 992 && tocContainer && tocToggle) {
                tocContainer.classList.toggle('active');
            }
        }
    });

    // ============================================
    // Copy Code Blocks
    // ============================================

    // Add copy buttons to code blocks within template container
    const codeBlocks = templateContainer.querySelectorAll('pre');
    
    codeBlocks.forEach(function(codeBlock) {
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-btn';
        copyButton.textContent = 'Copy';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        
        // Wrap code block in a container
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        codeBlock.parentNode.insertBefore(wrapper, codeBlock);
        wrapper.appendChild(codeBlock);
        wrapper.appendChild(copyButton);
        
        // Copy functionality
        copyButton.addEventListener('click', function() {
            const code = codeBlock.querySelector('code') || codeBlock;
            const text = code.textContent;
            
            navigator.clipboard.writeText(text).then(function() {
                copyButton.textContent = 'Copied!';
                copyButton.classList.add('copied');
                
                setTimeout(function() {
                    copyButton.textContent = 'Copy';
                    copyButton.classList.remove('copied');
                }, 2000);
            }).catch(function(err) {
                console.error('Failed to copy code: ', err);
                copyButton.textContent = 'Failed';
                
                setTimeout(function() {
                    copyButton.textContent = 'Copy';
                }, 2000);
            });
        });
    });

    console.log('Notebook template initialized');

})();
