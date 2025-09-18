# Crime Analytics Portfolio Website

A professional portfolio website template for a Data Analyst specializing in Crime Analytics. This project follows JAMstack architecture principles using HTML, CSS, and JavaScript to create a responsive, accessible, and professional online portfolio.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Getting Started](#getting-started)
- [Development](#development)
- [Responsive Design](#responsive-design)
- [Future Enhancements](#future-enhancements)
- [Accessibility](#accessibility)
- [Browser Compatibility](#browser-compatibility)
- [License](#license)

## Features

- **Single Page Application (SPA)** with client-side routing
- **Responsive Design** for mobile, tablet, and desktop
- **Dark Mode Toggle** with persistent user preference
- **Professional Layout** with sidebar navigation
- **Project Showcase** with filtering capabilities
- **Contact Form** with validation (demo only)
- **About Section** with skills matrix and education history
- **Optimized Performance** with minimal HTTP requests

## Project Structure

```text
project-root/
├── index.html              # Main HTML file with all views
├── css/
│   ├── main.css            # Global styles and variables
│   ├── sidebar.css         # Sidebar-specific styles
│   └── components.css      # Reusable component styles
├── js/
│   ├── main.js             # Main JavaScript functionality
│   ├── navigation.js       # SPA navigation system
│   └── theme.js            # Dark/light mode handling
├── assets/
│   ├── images/             # Project and profile images
│   └── icons/              # Favicon and UI icons
└── pages/                  # For future SPA routing
```

## Design System

The portfolio uses a consistent design system with:

### Color Palette

- **Primary**: Dark Grey (#2C3E50) - main text and headers
- **Secondary**: Navy Blue (#1A365D) - accent elements and links
- **Tertiary**: Burgundy (#722F37) - call-to-action buttons
- **Quaternary**: Olive Green (#4A5D23) - subtle accents
- **Background**: Off-white (#FAFAFA) - avoid pure white
- **Surface**: Light Grey (#F5F5F5) - card backgrounds
- **Text**: Charcoal (#333333) - avoid pure black

### Typography

- **Headings**: Inter (sans-serif)
- **Body**: Source Sans Pro (sans-serif)
- **Code/Technical**: Monospace for data displays

## Getting Started

### Prerequisites

- Node.js (for npm)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/crime-analytics-portfolio.git
   cd crime-analytics-portfolio
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Open index.html in your browser or use your preferred development server

## Development

### Available Commands


- **Lint JavaScript files**: `npm run lint`
- **Fix linting issues**: `npm run lint:fix`
- **Run tests**: `npm test`

### Customization

#### Profile Information

Edit the HTML in the sidebar section of `index.html`:

```html
<div class="profile">
    <div class="profile-image">
        <img src="assets/images/your-photo.jpg" alt="Profile Image" class="profile-pic">
    </div>
    <h3 class="profile-name">Your Name</h3>
    <h5 class="profile-title">Your Title | Your Specialization</h5>
    <!-- Social links -->
</div>
```

#### Projects

Add new projects by duplicating the project card structure in the projects section:

```html
<div class="project-card" data-tags="your-tags">
    <div class="project-image">
        <img src="assets/images/your-project.jpg" alt="Project Name">
    </div>
    <div class="project-info">
        <h3>Project Name</h3>
        <p>Project description goes here...</p>
        <div class="project-tags">
            <span class="tag">Tag 1</span>
            <span class="tag">Tag 2</span>
        </div>
        <a href="#" class="project-link">View Details</a>
    </div>
</div>
```

#### Colors & Theme

Modify the CSS variables in `main.css` to adjust the color scheme:

```css
:root {
    --color-primary: #your-color;
    --color-secondary: #your-color;
    /* other colors */
}
```

## Responsive Design

The website is designed to be responsive across all devices:

- **Mobile**: Sidebar collapses to a hamburger menu
- **Tablet**: Adjustments for optimal viewing
- **Desktop**: Full sidebar + main content layout

## Future Enhancements

- **Backend Integration**: Connect the contact form to a serverless function
- **PDF Resume Download**: Add functionality to the resume button
- **Animation Refinements**: Enhance UX with subtle animations
- **Content Management**: Add headless CMS integration
- **Additional Views**: Create detailed project pages
- **SEO Optimization**: Enhance metadata and structured data

## Accessibility

This portfolio follows WCAG guidelines for accessibility:

- **Semantic HTML**: Proper structure with semantic elements
- **ARIA Labels**: Added where necessary
- **Keyboard Navigation**: Fully navigable via keyboard
- **Focus States**: Visible focus indicators
- **Color Contrast**: WCAG 2.0 AA compliant

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Graceful degradation for older browsers

## License

This project is proprietary and unlicensed. No permission is granted to use, copy, modify, merge, publish, distribute, sublicense, or sell any part of this repository or its contents, for private or public use, under any circumstances.

For inquiries, contact the repository owner..
