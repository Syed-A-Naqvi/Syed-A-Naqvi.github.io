/**
 * navigation.js - Handles navigation functionality
 * Implements Single Page Application (SPA) behavior
 */

// Initialize navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentViews = document.querySelectorAll('.content-view');
    
    // Set initial view (first one is active by default)
    let currentView = 'project-gallery';
    
    // Update URL with hash if it doesn't exist
    if (!window.location.hash) {
        window.location.hash = '#project-gallery';
    } else {
        // Get view from hash (remove the # symbol)
        const hashView = window.location.hash.substring(1);
        
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
            
            // Update the hash in the URL
            window.location.hash = `#${targetView}`;
            
            // Update active view
            updateActiveView(targetView);
        });
    });
    
    // Listen for hash changes (browser back/forward navigation)
    window.addEventListener('hashchange', () => {
        // Get view from hash (remove the # symbol)
        const hashView = window.location.hash.substring(1);
        
        // Check if this is a valid view
        if (document.getElementById(hashView)) {
            updateActiveView(hashView);
        }
    });
    
    // Function to update the active view
    function updateActiveView(viewId) {
        // Remove active class from all nav links
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
}

// initializing project iframe view
function initProjectView() {
    
    // project gallery reference
    const projectGallery = document.getElementById('project-gallery');

    // extracting all project cards
    const projectGrid = projectGallery.querySelector('.project-grid');
    const projectCards = Array.from(projectGrid.children);

    // extracting project view pane
    const projectView = document.getElementById('project-view');

    // adding click event listeners to each project card
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const projectURL = card.id;
            const projectIframe = projectView.querySelector('iframe');
            projectIframe.src = projectURL;
            // switching views
            projectGallery.classList.remove('active');
            projectView.classList.add('active');
        });
    });

}