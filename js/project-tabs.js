// project tab system
( function () {

    // --------------------------------VARIABLES/CONSTANTS--------------------------------
    
    // project view section
    const projectViewSection = document.getElementById( 'project-view' );

    // project tabs container
    const projectTabsListContainer = projectViewSection.querySelector( '.project-tabs-container' );
    
    // project tabs list wrapper
    const projectTabsList = projectTabsListContainer.querySelector( '.project-tabs-list' );
    
    // project gallery
    const projectGallery = projectViewSection.querySelector( '.project-gallery' );
    
    // project cards
    const projectCards = projectGallery.querySelectorAll( '.project-card' );

    // active projects
    let activeTab = null;

    // active tabs
    const openedTabs = new Set();

    // tab -> iframe map
    const tabIframeMap = new Map();

    // repo -> tab map
    const repoTabMap = new Map();

    // tab -> repo map
    const tabRepoMap = new Map();

    // --------------------------------FUNCTIONS--------------------------------

    // Horizontal scroll for project gallery tabs
    function horizontalTabsContainerScroll() {
        projectTabsListContainer.addEventListener('wheel', (e) => {

            // Prevent default vertical scroll signals
            e.preventDefault();

            projectTabsListContainer.scrollLeft += 1.2 * e.deltaY;
        });
    }

    /**
     * Creates a project iframe element
     * @param {HTMLElement} tab - The project tab element
     * @param {Boolean} e - Function invocation originated from window hashchange event
     */
    function displayProject(tab, fromHashchange = false) {

        if (!openedTabs.has(tab)) {
            
            // insert tab into active tabs set
            openedTabs.add(tab);

            // append tab element to the DOM
            projectTabsList.appendChild(tab);

            // show project tabs container
            if (openedTabs.size > 1) {
                projectTabsListContainer.classList.remove('hidden');
                projectGallery.querySelector('header h1').style.marginTop = 'calc(1.5 * var(--spacing-xl))';
            }

        }

        // return if tab is already active
        if (activeTab === tab) {
            return;
        }

        // deactivating current active tab
        activeTab.classList.remove('active');
        tabIframeMap.get(activeTab).style.display = 'none';
        
        // activating new tab
        activeTab = tab;
        activeTab.classList.add('active');
        tabIframeMap.get(activeTab).style.display = '';

        // updating URL with newly activated tab project name unless tab being displayed through back/forward browser navigation
        if (!fromHashchange){
            const currentRoute = window.location.hash.split('/');
            if (currentRoute.length > 1){
                currentRoute[1] = tabRepoMap.get(activeTab);
                window.location.hash = currentRoute.join('/');
            }
            else {
                window.location.hash = `${window.location.hash}/${tabRepoMap.get(activeTab)}`;
            }
        }
    }

    /**
     * Creates a project iframe element
     * @param {HTMLElement} tab - The project tab element
     */
    function removeProject(tab) {
        
        // remove tab from opened tabs set
        openedTabs.delete(tab);
        
        // remove tab element from the DOM
        projectTabsList.removeChild(tab);

        // display last opened tab
        displayProject(projectTabsList.lastElementChild);

        // hide project tabs list if only project gallery tab remains
        if (openedTabs.size < 2) {
            projectTabsListContainer.classList.add('hidden');
            projectGallery.querySelector('header h1').style.marginTop = '';

        }

    }

    /**
     * Creates a project iframe element
     * @param {HTMLElement} projectCard - The project card element
     * @returns {HTMLElement} The constructed iframe element.
     */
    function createProjectIframe(projectCard) {
        const iframe = document.createElement('iframe');
        iframe.classList.add('project-iframe');
        iframe.style.display = 'none';
        iframe.src = projectCard.dataset.url;
        return iframe;
    }

    /**
     * Creates a project tab element
     * @param {HTMLElement} projectCard - The project card element
     * @returns {HTMLElement} The constructed tab element.
     */
    function createProjectTab(projectCard) {

        const tab = document.createElement('li');
        tab.classList.add('tab-item');
        tab.dataset.projectid = projectCard.id;

        const span = document.createElement('span');
        span.textContent = projectCard.querySelector('h3').textContent;
        tab.appendChild(span);

        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('aria-hidden', 'true');
        tab.appendChild(closeIcon);

        return tab;
    }

    /**
     * Sends a theme change post message to an iframe
     * @param {HTMLElement} iframe - The iframe element
     * @param {string} theme - The theme to set ('light' or 'dark')
     */
    function sendThemeChangeMessage() {
        const iframes = projectViewSection.querySelectorAll('.project-iframe');
        iframes.forEach(iframe => {
            iframe.contentWindow.postMessage({ type: 'update-theme', theme: localStorage.getItem('theme') }, '*');
        });
    }

    /**
     * Loads a project tab based on the current url
     */
    function urlTabDisplay() {
        
        // split the current hash section using forward slashes as delimiters
        const hashParts = window.location.hash.split('/');

        if (hashParts.length > 1) {
            
            // if there is a valid project tab specified, load the project
            if (repoTabMap.has(hashParts[1])){
                displayProject(repoTabMap.get(hashParts[1]), true);
            }

        } else {

            // if there is no project specified in the URL, but projects are opened and the #project-view page is specified, display the 'all' tab
            if ( hashParts[0] === '#project-view' && openedTabs.size > 1) {
                displayProject(repoTabMap.get('all'), true)
            }

        }

    }

    // --------------------------------INITIALIZATION--------------------------------

    // manually add project gallery tab to tab -> iframe map
    const galleryTab = projectTabsList.querySelector('[data-projectid="all"]');
    tabIframeMap.set(galleryTab, projectGallery);

    // manually assign gallery tab <-> 'all' string
    repoTabMap.set('all', galleryTab);
    tabRepoMap.set(galleryTab, 'all');

    // insert gallery tab into opened tabs set
    openedTabs.add(galleryTab);

    // update current active tab
    activeTab = galleryTab;

    // add event listener for gallery tab
    galleryTab.addEventListener( 'click', () => {
        // display project
        displayProject(galleryTab);
    });

    // Create tabs and iframes for each project card
    projectCards.forEach( card => {

        // creating project tab
        const tab = createProjectTab(card);

        // creating project iframe
        const iframe = createProjectIframe(card);

        // getting project repo name
        const urlSections = card.dataset.url.split('/')
        const repoName = urlSections[urlSections.length - 2]

        // project repo name <-> project tab maps
        repoTabMap.set(repoName, tab)
        tabRepoMap.set(tab, repoName)

        // project tab -> project iframe
        tabIframeMap.set(tab, iframe);
        
        // append iframe to project view
        projectViewSection.appendChild(iframe);

        // enable tab activation on card click
        card.addEventListener( 'click', () => {

            // display project
            displayProject(tab);

            // move tab scrollbar to right end to show newly added tab
            projectTabsListContainer.scrollLeft = projectTabsList.scrollWidth;

        });

        // enable tab switching on tab click
        tab.addEventListener( 'click', () => {
            // display project
            displayProject(tab);
        });

        // enable tab removal on close icon click
        const closeIcon = tab.querySelector('i');
        closeIcon.addEventListener( 'click', ( e ) => {
            e.stopPropagation(); // prevent triggering tab click event
            removeProject(tab);
        });

    });

    // enable horizontal scroll for project tabs container
    horizontalTabsContainerScroll();

    // listen for theme update events
    window.addEventListener('themeUpdated', () => {
        sendThemeChangeMessage();
    });

    // initialize tabs container shadow effect for mobile view on window resize and dom load
    let shadowResizeTimeout = null;
    window.addEventListener('resize', () => {
        clearTimeout(shadowResizeTimeout);
        shadowResizeTimeout = setTimeout(() => {
            setupTabsShadowEffects();
        }, 500);
    });

    // add window event listener that displays a project tab based on url changes
    window.addEventListener('hashchange', () => {
        urlTabDisplay();   
    });
    
    // automatically opening the correct tab if navigating to website via direct project url link
    document.addEventListener("DOMContentLoaded", () => {
        urlTabDisplay();   
    });


})();