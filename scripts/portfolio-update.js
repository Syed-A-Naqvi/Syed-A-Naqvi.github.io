import {JSDOM} from 'jsdom';

if (process.argv.length < 3) {
    console.log("No project metadata payload provided.");
    console.log("Usage: node portfolio-update.js '<project-metadata-json>'");
    process.exit(1);
}

const projectMetadataJson = process.argv[2];

let projectMetadata;
try {
    projectMetadata = JSON.parse(projectMetadataJson);
} catch (error) {
    console.error("Invalid JSON payload:", error);
    process.exit(1);
}

console.log("Project metadata (raw payload):", projectMetadataJson);
console.log("Project metadata (parsed JSON):", projectMetadata);