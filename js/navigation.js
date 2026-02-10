/**
 * navigation.js - Handles navigation functionality
 * Implements Single Page Application (SPA) behavior
 */

// Initialize navigation
( function () {

    // --------------------------------VARIABLES/CONSTANTS--------------------------------

    // navigation links
    const navLinks = document.querySelectorAll('.nav-link');

    // content views
    const contentViews = document.querySelectorAll('.content-view');
    
    // Set initial view (first one is active by default)
    let currentView = 'project-view';


    // --------------------------------FUNCTIONS--------------------------------

    // Function to update the active view
    function updateActiveView(viewId) {

        // Ensuring correct nav link is active and all others are inactive
        navLinks.forEach(link => {
            if (link.getAttribute('data-view') === viewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Hide all content views
        contentViews.forEach(view => {
            view.classList.remove('active');
        });
        
        // Show the target view
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
            
            // Scroll to top of the view
            const main = document.querySelector('.main-content');
            if (main) {
                main.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }
    }

    
    // --------------------------------INITIALIZATION--------------------------------
    
    // Update URL with hash if it doesn't exist
    if (!window.location.hash) {
        window.location.hash = '#project-view';
    } else {
        // Get view from hash (remove the # symbol)
        const hashView = window.location.hash.substring(1).split('/')[0];
        
        // Check if this is a valid view
        if (document.getElementById(hashView)) {
            currentView = hashView;
            updateActiveView(currentView);
        }
    }
    
    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the data-view attribute value
            const targetView = link.getAttribute('data-view');
            
            // getting currently active content view
            currentView = window.location.hash.split('/')[0];

            // do not update active view if current link already active
            if (!(currentView === `#${targetView}`)) {
                
                // Update the hash in the URL
                window.location.hash = `#${targetView}`;

                // Update active view
                updateActiveView(targetView);
            }
            
        });
    });
    
    // Listen for hash changes (browser back/forward navigation)
    window.addEventListener('hashchange', () => {

        // Get view from hash (remove the # symbol)
        const hashView = window.location.hash.substring(1).split('/')[0];

        // Check if this is a valid view
        if (document.getElementById(hashView)) {
            updateActiveView(hashView);
        }
        
    });

}) ();