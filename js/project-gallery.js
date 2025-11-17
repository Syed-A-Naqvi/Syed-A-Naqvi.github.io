( function () {

    // --------------------------------VARIABLES/CONSTANTS--------------------------------
    
    // project gallery container
    const projectGallery = document.querySelector('.project-gallery');
    // main filtration container
    const projectFiltering = projectGallery.querySelector('.project-filtering');
    // tag search box
    const tagSearchBox = document.getElementById('filter-search-box');
    // clear all filters button
    const clearFilterButton = projectFiltering.querySelector('.filter-btn.clear');
    // filter group container
    const filterContainer = projectFiltering.querySelector('.filter-container');
    // main filter buttons container
    const filterGroup = filterContainer.querySelector('.filter-group');
    // individual filter buttons
    const filterButtons = filterGroup.querySelectorAll('.filter-btn');
    // project card container
    const projectGrid = projectGallery.querySelector('.project-grid');
    // individual project cards
    const allProjectCards = projectGrid.querySelectorAll('.project-card');

    // unapplied filter set (initially all filters unapplied)
    const unappliedFilters = new Set(filterButtons);
    // applied filters set (initially no filters applied)
    const appliedFilters = new Set();

    // displayed project cards (initially all cards displayed)
    const displayedProjectCards = new Set(allProjectCards);
    // hidden project cards (initially no cards hidden)
    const hiddenProjectCards = new Set();

    // inactive <-> active filter button mapping
    const filterFilterMap = new Map();
    // [filter button] -> [card] mapping
    const filterCardMap = new Map();

    // --------------------------------UTILITY SET OPERATIONS--------------------------------

    // Union of two sets (A u B)
    function union(A, B) {
        return new Set([...A, ...B]);
    }
    // Intersection of two sets (A n B)
    function intersection(A, B) {
        return new Set([...A].filter(x => B.has(x)));
        
    }
    // Difference of two sets (A - B)
    function difference(A, B) {
        return new Set([...A].filter(x => !B.has(x)));
    }


    // --------------------------------FUNCTIONS--------------------------------

    // clear search box
    function clearSearch() {
        
        // removing search box text
        tagSearchBox.value = "";

        // removing all search box filtering effects
        displayedProjectCards.forEach(card => {
            card.style.display = "";
        });
        unappliedFilters.forEach(filter => {
            filter.style.display = "";
        });
        appliedFilters.forEach(filter => {
            filterFilterMap.get(filter).style.display = "";
        });        

    }

    // apply card filter
    function applyFilter(filter) {
        // the set of displayed cards constitutes the intersection of all applied filters
        // when applying an additional filter, we must determine which cards if any need to be hidden
        // thus we return all cards in the displayed set not also in the new filter's card set (i.e. not in the new intersection)
        // this describes the difference between the displayed set and the new filter's card set
        const cardsToHide = difference(displayedProjectCards, filterCardMap.get(filter));
        // updating displayed and hidden sets
        cardsToHide.forEach(card => {
            displayedProjectCards.delete(card);
            hiddenProjectCards.add(card);
            card.style.display = 'none';
        });
        // adding filter to applied filters set and removing from unapplied set
        appliedFilters.add(filter);
        unappliedFilters.delete(filter);
        
        // now we hide the inactive version of this filter button and insert the active version at the start of the filter group
        const activeBtn = filterFilterMap.get(filter);
        filterGroup.insertBefore(activeBtn, filterGroup.firstChild);
        filter.style.display = 'none';
    }

    // remove card filter
    function removeFilter(filter) {

        // we begin by removing the filter from the applied filters list
        appliedFilters.delete(filter);
        // and adding it back to the unapplied filters list
        unappliedFilters.add(filter);

        if (appliedFilters.size === 0) {
            
            // if no filters remain, we simply display all cards
            hiddenProjectCards.forEach(card => {
                displayedProjectCards.add(card);
                card.style.display = "";
            });
            hiddenProjectCards.clear();

        } else {

            // we must now find and display all cards part of the intersection of the remaining filters' card sets
            // some of these cards may have been hidden due to the application of the filter currently being removed
            // to find these cards, we get the difference between the intersection of all remaining filters' card sets and the currently removed filter's card set
            let cardsToDisplay = new Set(allProjectCards); // start with all cards
            appliedFilters.forEach(f => {
                cardsToDisplay = intersection(cardsToDisplay, filterCardMap.get(f));
            });
            cardsToDisplay = difference(cardsToDisplay, filterCardMap.get(filter));
            // updating displayed and hidden sets
            cardsToDisplay.forEach(card => {
                displayedProjectCards.add(card);
                hiddenProjectCards.delete(card);
                card.style.display = "";
            });

        }
        
        // we now remove the active version of this filter button and display the inactive version
        const activeBtn = filterFilterMap.get(filter);
        filterGroup.removeChild(activeBtn);
        filter.style.display = "";
    }

    // Horizontal scroll for project gallery filters
    function horizontalFilterContainerScroll() {
        filterContainer.addEventListener('wheel', (e) => {

            // Prevent default vertical scroll signals
            e.preventDefault();

            filterContainer.scrollLeft += 1.2 * e.deltaY;
        });
    }

    // Initialize filter button functionality
    function initFilterButtons() {

        // Adding button event listeners
        filterButtons.forEach(filter => {

            filter.addEventListener('click', () => {

                // applying filter
                applyFilter(filter);

                // move scroll position to start to show newly added active filter
                filterContainer.scrollLeft = 0;
                    
            });
                
            const activeBtn = filterFilterMap.get(filter);
            activeBtn.addEventListener('click', () => {

                // filter removal logic
                removeFilter(filter);
            });

        });
    
        // 'clear' filter button functionality
        clearFilterButton.addEventListener('click', () => {

            // button click feedback animation
            clearFilterButton.classList.add('button-flash');
            setTimeout(() => {
                clearFilterButton.classList.remove('button-flash');
            }, 100);
            
            // Remove all applied filters and display all project cards
            while(appliedFilters.size > 0) {
                removeFilter(appliedFilters.values().next().value);
            }

            // Clearing search box and ensuring all displayed project cards and unapplied filters are visible
            clearSearch();

            // Reset scroll position to start
            filterContainer.scrollLeft = 0;

        });
    }

    // Initialize search box functionality
    function initSearchBox() {

        // clear search box whenever click is registered outside search box
        document.addEventListener('click', function(event) {
            clearSearch();
        });

        // adding text input event listener to search box to immediately return matching tags and project cards
        tagSearchBox.addEventListener('input', function(event) {
                
            // Retrieving current search box string
            const currentValue = event.target.value.toLowerCase();

            if (currentValue === "") {
                // if search box is empty, show all filters
                unappliedFilters.forEach(filter => {
                    filter.style.display = "";
                });
                // appliedFilters.forEach(filter => {
                //     filterFilterMap.get(filter).style.display = "";
                // });
                // show all displayed project cards
                displayedProjectCards.forEach(card => {
                    card.style.display = "";
                });
            } else {
                // hide applied filters while search box has input text
                // appliedFilters.forEach(filter => {
                //     filterFilterMap.get(filter).style.display = "none";
                // });
                // filtering unapplied filters based on search box string
                unappliedFilters.forEach(filter => {
                    if (filter.textContent.toLowerCase().includes(currentValue)) {
                        filter.style.display = "";
                    } else {
                        filter.style.display = "none";
                    }
                });
                // filtering displayed project cards based on search box string
                displayedProjectCards.forEach(card => {
                    if (card.dataset.tags.toLowerCase().replace(/-/g," ").includes(currentValue)) {
                        card.style.display = "";
                    } else {
                        card.style.display = "none";
                    }
                });
            } 

        });
    }

    // project gallery scroll effects
    function initProjectGalleryScrollEffects() {

        // back to top button
        const backToTopButton = document.querySelector('.back-to-top');
        // project gallery header
        const galleryHeader = projectGallery.querySelector('header');
        // project tabs container (for mobile view effects)
        const projectTabsListContainer = document.querySelector('.project-tabs-container');

        // observed element visibility states
        let galleryVisible = false;
        let galleryHeaderVisible = false;
        let galleryHeaderCutoff = false;
        
        // effect states
        let projectFilteringShadow = false;
        let tabsContainerShadow = false;
        let backToTopButtonVisible = false;

        /**
         * setup desktop view filter container shadow effects
        */
        function projectFilteringShadowEffect() {
            if (window.innerWidth > 800 && galleryVisible && !galleryHeaderVisible) {
                projectFilteringShadow ? null : projectFiltering.classList.add("is-stuck");
                projectFilteringShadow = true;
            }
            else {
                projectFiltering.classList.remove("is-stuck");
                projectFilteringShadow = false;
            }
        }
        
        /**
         * setup mobile view tabs container shadow effects
        */
        function tabsContainerShadowEffect() {
            if (window.innerWidth <= 800 && galleryVisible && galleryHeaderCutoff) {
                tabsContainerShadow ? null : projectTabsListContainer.classList.add("is-stuck");
                tabsContainerShadow = true;
            }
            else {
                projectTabsListContainer.classList.remove("is-stuck");
                tabsContainerShadow = false;
            }
        }
        
        /**
         * setup mobile view back to top button functionality
        */
        function backToTopButtonFunctionality() {

            // initially hide back to top button
            backToTopButton.classList.add('hidden');
                        
            // back to top button click event
            backToTopButton.addEventListener('click', () => {
                projectGallery.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // scroll event handling
            let previousScrollTop = projectGallery.scrollTop;
            // button appears when scrolling up (unless at top), disappears when scrolling down
            projectGallery.addEventListener('scroll', (e) => {
                
                if (!galleryVisible) { return; }

                if (projectGallery.scrollTop >= previousScrollTop) {
                    // scrolling down
                    backToTopButton.classList.add('hidden');
                    backToTopButtonVisible = false;
                } else {
                    // scrolling up
                    backToTopButton.classList.remove('hidden');
                    backToTopButtonVisible = true;
                    if (projectGallery.scrollTop === 0) {
                        backToTopButton.classList.add('hidden');
                        backToTopButtonVisible = false;
                    }
                }
                
                previousScrollTop = projectGallery.scrollTop;

            });

        }

        
        // setting up main project gallery observer
        const galleryObserver = new IntersectionObserver( (entries) => {

                entries.forEach(entry => {

                    if (entry.target === projectGallery) {
                        
                        if (entry.isIntersecting) {
                            galleryVisible = true;
                        }
                        else {
                            galleryVisible = false;
                            galleryHeaderCutoff = true;
                            galleryHeaderVisible = false;
                        }

                    }

                    if (entry.target === galleryHeader && galleryVisible) {
                        
                        if (entry.isIntersecting) {

                            galleryHeaderVisible = true;

                            if (entry.intersectionRatio < 1) {
                                galleryHeaderCutoff = true;
                            } else {
                                galleryHeaderCutoff = false;
                            }

                        }
                        else {
                            galleryHeaderVisible = false;
                            galleryHeaderCutoff = true;
                        }

                    }

                });

                // applying shadow effects based on visibility states
                projectFilteringShadowEffect();
                tabsContainerShadowEffect();
                
                if (!galleryVisible){
                    backToTopButton.classList.add('hidden');
                }
                else if (backToTopButtonVisible) {
                    backToTopButton.classList.remove('hidden');
                }

                console.log(`Gallery visible: ${galleryVisible}, Header visible: ${galleryHeaderVisible}, Header cutoff: ${galleryHeaderCutoff}`)

            },
            // fires when element goes from >0% to 0%, or 0% to >0%
            {   
                root: null,
                threshold: [0, 1]
            }
        );

        galleryObserver.observe(projectGallery);
        galleryObserver.observe(galleryHeader);
        backToTopButtonFunctionality();

    }
    
    // --------------------------------INITIALIZATION--------------------------------
    
    filterButtons.forEach(btn => {
        // creating active button clone
        const activeBtn = btn.cloneNode(true);
        activeBtn.removeAttribute('id');
        activeBtn.classList.add('active');
        filterFilterMap.set(btn, activeBtn);
        filterFilterMap.set(activeBtn, btn);
    });

    // building [filter button] -> [card] mapping
    allProjectCards.forEach(card => {
        const tags = card.dataset.tags ? card.dataset.tags.split(" ") : [];
        tags.forEach(tag => {
            const filterBtn = document.getElementById(tag);
            if (!filterCardMap.has(filterBtn)) {
                filterCardMap.set(filterBtn, new Set());
            }
            filterCardMap.get(filterBtn).add(card);
        });
    });

    horizontalFilterContainerScroll();
    initFilterButtons();
    initSearchBox();
    initProjectGalleryScrollEffects();

})();