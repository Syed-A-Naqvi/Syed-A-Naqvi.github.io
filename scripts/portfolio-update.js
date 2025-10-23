import {JSDOM} from 'jsdom';
import { readFile, writeFile } from 'node:fs/promises';
import crypto from 'node:crypto';


// Command line argument processing --------------------------------
// Ensure correct number of arguments
if (process.argv.length !== 3) {
    console.log("Error: Invalid number of arguments.");
    console.log("Usage: node portfolio-update.js '<project-metadata-json>'");
    process.exit(1);
}
// extracting project metadata from command line argument
const rawProjectMetadata = process.argv[2];


// Input validation ------------------------------------------------
// parsing JSON payload
let projectMetadata;
try {
    projectMetadata = JSON.parse(rawProjectMetadata);
} catch (error) {
    console.error("Invalid JSON payload:", error);
    process.exit(1);
}
// Ensuring all fields present and valid
const requiredFields = ['title', 'description','author', 'tags', 'url', 'logo_path', 'updated'];
for (const field of requiredFields) {
    
    if (!projectMetadata[field]) {
        console.error(`Missing required field: ${field}`);
        process.exit(1);
    }
    else if (field === 'tags') {

        if (!Array.isArray(projectMetadata[field])) {
            console.error(`Field 'tags' must be an array.`);
            process.exit(1);
        }
        else {
            // removing duplicate tags
            // sorting tags alphabetically
            // ensuring space-separated words with first letter capitalized
            projectMetadata.tags = Array.from(new Set(projectMetadata.tags)).sort().map(tag => {
                return tag.trim().replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
            });
        }
        
    }
    else if (field === 'updated' && isNaN(Date.parse(projectMetadata[field]))) {
        console.error(`Field 'updated' must be a valid date string.`);
        process.exit(1);
    }
}


// Extracting main index.html file content ---------------------------------
let htmlContent;
try {
    htmlContent = await readFile('index.html', 'utf8');
} catch (error) {
    console.error("Error reading index.html:", error);
    process.exit(1);
}

// constructing virtual DOM for file manipulation
const DOM = new JSDOM(htmlContent);
const document = DOM.window.document;

// filter button group
const filterGroup = document.querySelector(".filter-group");
let filterButtons = Array.from(filterGroup.children);

// project grid
const projectGrid = document.querySelector(".project-grid");

// initializing filter button tally
const filterButtonTally = {};
filterButtons.forEach(btn => {
    filterButtonTally[btn.id] = 0;
});

/**
 * Builds a project card element based on the provided metadata.
 * @param {string} url - The project URL.
 * @returns {string} The URL hash to be used as a unique identifier.
*/
function hashUrl(url) {
    return crypto.createHash('md5').update(url).digest('hex');
}

/**
 * @typedef {object} ProjectMetadata
 * @property {string}   title - The title of the project
 * @property {string}   description - A brief description of the project
 * @property {string}   author - The author of the project
 * @property {string[]} tags - An array of tags associated with the project
 * @property {string}   url - The URL to the project
 * @property {string}   logo_path - The URL to the project's logo image
 * @property {Date}     updated - The date when the project was last updated
 */

// building new project card element based on metadata
/**
 * Builds a project card element based on the provided metadata.
 * @param {ProjectMetadata} projectMetadata - The metadata for the project.
 * @returns {HTMLElement} The constructed project card element.
*/
function buildProjectCard(projectMetadata) {
    
    // CREATING PROJECT CARD ELEMENT
    const card = document.createElement("article");
    card.id = hashUrl(projectMetadata.url);
    card.className = "project-card";
    card.dataset.url = projectMetadata.url;
    card.dataset.tags = projectMetadata.tags.map(tag => tag.replace(/\S+/g,"-").toLowerCase()).join(" ");
    card.dataset.updated = new Date(projectMetadata.updated).toISOString();

    // CREATING LOGO CONTAINER
    const logoContainer = document.createElement("div");
    logoContainer.className = "project-image";

    // CREATING IMAGE ELEMENT
    const logoImage = document.createElement("img");
    logoImage.src = projectMetadata.logo_path;
    logoImage.alt = projectMetadata.title;
    
    // APPENDING IMAGE ELEMENTS TO CARD TREE
    logoContainer.appendChild(logoImage);
    card.appendChild(logoContainer);

    // CREATING INFO SECTION
    const infoSection = document.createElement("div");
    infoSection.className = "project-info";
    
    // CREATING TITLE ELEMENT
    const title = document.createElement("h3");
    title.textContent = projectMetadata.title;
    infoSection.appendChild(title);

    // CREATING DESCRIPTION ELEMENT
    const desc = document.createElement("p");
    desc.textContent = projectMetadata.description;
    infoSection.appendChild(desc);

    // CREATING TAGS CONTAINER
    const tagsContainer = document.createElement("div");
    tagsContainer.className = "project-tags";
    tags.forEach(tag => {
        const tagSpan = document.createElement("span");
        tagSpan.className = "tag";
        tagSpan.textContent = tag;
        tagsContainer.appendChild(tagSpan);
    });
    infoSection.appendChild(tagsContainer);

    // APPENDING INFO SECTION TO CARD
    card.appendChild(infoSection);

    return card;
}

/**
 * @param {string} tagId - The ID of the new tag button
 * @returns {HTMLElement} The constructed filter button element.
*/
function buildFilterButton(tag) {
    const filterButton = document.createElement("button");
    filterButton.id = tag;
    filterButton.className = 'filter-btn';
    filterButton.textContent = tag.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    return filterButton;
}

// creating new project card
const newProjectCard = buildProjectCard(projectMetadata);

// appending or replacing project card in the grid
const existingCard = document.getElementById(newProjectCard.id);
if (existingCard) {
    projectGrid.replaceChild(newProjectCard, existingCard);
} else {
    projectGrid.appendChild(newProjectCard);
}

// extracting cards list and sorting cards by update time
let projectCards = Array.from(projectGrid.children);
projectCards.sort((a, b) => {
    const dateA = new Date(a.dataset.updated);
    const dateB = new Date(b.dataset.updated);
    return dateB - dateA;
});

// incrementing filter button tally and adding new buttons if necessary
projectCards.forEach(card => {
    const tags = card.dataset.tags ? card.dataset.tags.split(" ") : [];
    tags.forEach(tag => {
        if (filterButtonTally.hasOwnProperty(tag)) {
            filterButtonTally[tag] += 1;
        } else {
            filterButtonTally[tag] = 1;
            // creating and appending new filter button
            const newFilterButton = buildFilterButton(tag);
            filterGroup.appendChild(newFilterButton);
        }
    })
});

// removing filter buttons with zero tally
for (const [tag, tally] of Object.entries(filterButtonTally)) {
    if (tally === 0) {
        const buttonToRemove = document.getElementById(tag);
        if (buttonToRemove) {
            filterGroup.removeChild(buttonToRemove);
        }
    }
}

// refreshing filter button list and sorting filter buttons alphabetically
filterButtons = Array.from(filterGroup.children);
filterButtons.sort((a, b) => a.id.localeCompare(b.id));


// replacing all buttons and cards with updated lists
while (projectGrid.firstChild) {
    projectGrid.removeChild(projectGrid.firstChild);
}
while (filterGroup.firstChild) {
    filterGroup.removeChild(filterGroup.firstChild);
}
projectCards.forEach(card => {
    projectGrid.appendChild(card);
});
filterButtons.forEach(btn => {
    filterGroup.appendChild(btn);
});

// Updating index.html file content
const updatedHTMLContent = DOM.serialize();
try {
    await writeFile('index.html', updatedHTMLContent, 'utf8');
    console.log("index.html updated successfully.");
} catch (error) {
    console.error("Error writing to index.html:", error);
    process.exit(1);
}