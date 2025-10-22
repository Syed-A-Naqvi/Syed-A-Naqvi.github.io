// Horizontal scroll for project gallery filters
function horizontalFilterContainerScroll() {

    const filterContainer = document.querySelector('.filter-container');

    filterContainer.addEventListener('wheel', (e) => {

        // Prevent default vertical scroll signals
        e.preventDefault();

        filterContainer.scrollLeft += 1.2 * e.deltaY;

    });

};

// Initialize filter button functionality
// function initFilterButtons() {

//     // main filtration container
//     const projectFiltering = document.querySelector('.project-filtering');

//     // toggles every filter button on or off
//     const allFilterButton = projectFiltering.querySelector('.filter-btn.all');

//     // container for individual filter buttons
//     const filterGroup = document.querySelector('.filter-group');
//     // individual filter buttons
//     const filterButtons = filterGroup.querySelectorAll('.filter-btn');

//     // container for project cards
//     const projectCardContainer = document.querySelector('.projects-grid');
//     // individual project cards
//     const projectCards = document.querySelectorAll('.project-card');
    
    
//     // 'all' filter button functionality
//     if (allFilterButton) {
//         allFilterButton.addEventListener('click', () => {

//             if (!allFilterButton.classList.contains('active')) {
//                 // Remove active class from all buttons
//                 filterButtons.forEach(btn => btn.classList.remove('active'));

    
//     filterButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             // Remove active class from all buttons
//             filterButtons.forEach(btn => btn.classList.remove('active'));
            
//             // Add active class to clicked button
//             button.classList.add('active');
            
//             // Get filter value
//             const filter = button.getAttribute('data-filter');
            
//             // Filter projects
//             projectCards.forEach(card => {
//                 if (filter === 'all') {
//                     card.style.display = 'block';
//                 } else {
//                     const tags = card.getAttribute('data-tags');
//                     if (tags && tags.includes(filter)) {
//                         card.style.display = 'block';
//                     } else {
//                         card.style.display = 'none';
//                     }
//                 }
//             });
//         });
//     });
// }

// Initialize project filtration system
// function initProjectFiltration() {
    
//     // Set horizontal scroll behavior for filter container
//     horizontalFilterContainerScroll();

    

// }