# adSemble

A modern banner ad development and preview framework for creating and testing responsive digital advertisements.

## Overview

adSemble is a comprehensive toolkit for developing, previewing, and testing digital banner advertisements. It provides a streamlined workflow for creating responsive ads with support for multiple languages and dimensions.

## Features

- **Responsive Banner Preview**: Live preview of banner ads in various dimensions
- **Multi-language Support**: Built-in support for English and French banners
- **Development Environment**: Integrated development tools for banner creation
- **Template System**: Handlebars-based templating for consistent ad structures
- **SCSS Support**: Modular SCSS architecture for styling banners
- **Interactive Testing**: Real-time banner testing and replay functionality

## Project Structure

```
adSemble/
├── dev/                    # Development tools and utilities
│   ├── index.js           # Core preview functionality
│   ├── utils.js           # Banner attribute utilities
│   └── index.css          # Preview interface styles
├── handlebars/            # Template system
│   ├── layouts/          # Main layout templates
│   ├── partials/         # Reusable template components
│   └── helpers/          # Custom Handlebars helpers
└── scss/                  # Styling system
    ├── global.scss       # Global banner styles
    ├── koodo.scss        # Brand-specific styles for Koodo Mobile
    └── porsche.scss      # Brand-specific styles for Porsche Canada
```

## Getting Started

1. Clone the repository
2. Install dependencies
3. Run the development server
4. Access the preview interface at `http://localhost:3000`

## Banner Development

Banners are automatically detected based on their file names, which should follow the format:

```
[brand]_[dimensions]_[language].html
```

Example: `koodo_300x250_en.html`

## Preview Interface

The preview interface provides:

- Banner selection via dropdown or buttons
- Real-time banner reloading
- Dimension display
- Language switching
- Interactive testing environment

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
