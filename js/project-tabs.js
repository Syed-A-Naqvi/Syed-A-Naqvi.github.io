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

    // tab to iframe map
    const tabIframeMap = new Map();


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
     */
    function displayProject(tab) {

        if (!openedTabs.has(tab)) {
            
            // insert tab into active tabs set
            openedTabs.add(tab);

            // append tab element to the DOM
            projectTabsList.appendChild(tab);

            // show project tabs container
            if (openedTabs.size > 1) {
                projectTabsListContainer.classList.remove('hidden');
                projectGallery.querySelector('header h1').style.marginTop = 'calc(1.1 * var(--spacing-xl))';
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

    // --------------------------------INITIALIZATION--------------------------------

    // manually add project gallery tab to tab -> iframe map
    const galleryTab = projectTabsList.querySelector('[data-projectid="all"]');
    tabIframeMap.set(galleryTab, projectGallery);

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

        // creating tab
        const tab = createProjectTab(card);

        // creating iframe
        const iframe = createProjectIframe(card);

        // link tab to iframe
        tabIframeMap.set(tab, iframe);
        
        // append iframe to project view
        projectViewSection.appendChild(iframe);

        // enable tab creation and activation on card click
        card.addEventListener( 'click', () => {

            // display project
            displayProject(tab);

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


})();