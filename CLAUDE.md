# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nailtastic is a Vue 3 nail design game that allows users to apply designs to virtual hands. Built with Vite, Vuetify 3 Beta, and Pinia for state management.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Technology Stack
- **Framework**: Vue 3 with Composition API (`<script setup>`)
- **Build Tool**: Vite
- **UI Library**: Vuetify 3 Beta
- **State Management**: Pinia
- **Styling**: Scoped CSS + Material Design Icons

### Component Structure
- `App.vue`: Main app component with navigation drawer, canvas management, and infinite scroll
- `HandCanvas.vue`: Displays hand pairs with zoom controls and nail interaction
- `DesignSelector.vue`: Left sidebar with design tools (colors, patterns, seasonal, decorations)
- `ArchiveSection.vue`: Save/load functionality with localStorage persistence

### State Management (Pinia)
The `nailStore.js` manages:
- Multiple canvases with individual hand states
- Design selection (category, design, colors)
- Archive of saved designs
- Actions for applying designs to individual nails, hands, or all nails

### Key Features Implementation
- **Pattern Rendering**: Complex CSS gradients and SVG patterns generated dynamically
- **Decoration System**: Overlays for gems, pearls, studs with positioning logic
- **Multi-Canvas**: Infinite scroll with dynamic canvas creation
- **Persistence**: localStorage for saving/loading designs

## Important Notes
- Vuetify 3 is in beta - some components may have limited documentation
- Hand graphics use emoji (Twemoji) for cross-platform consistency
- The project includes react-icons as a dependency (appears to be unused)
- All nail indices follow left-to-right order (0-4 for left hand, 5-9 for right hand)