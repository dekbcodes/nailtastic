# Nailtastic - Nail Design Inspiration Game

## Overview
A simple Vue 3 web application for creating nail design inspiration by applying pre-made designs to virtual hands.

## Core Features

### Hand Display
- Display both left and right hands on screen
- Individual clickable nails (10 nails total per hand pair)
- Clean, realistic hand illustrations

### Design System
**Base Colors:**
- Solid colors: pastels, brights, neutrals
- Special effects: glitter, ombre, marble

**Patterns:**
- Stripes (vertical, horizontal, diagonal)
- Dots (polka dots, confetti)
- Florals (roses, daisies, abstract flowers)

**Seasonal Themes:**
- Summer (tropical, beach, bright colors)
- Winter (snowflakes, cool tones)
- Holidays (Christmas, Halloween, Valentine's)

**Decorative Elements:**
- Gems (diamonds, crystals, colored stones)
- Pearls (white, colored)
- Other embellishments (studs, chains)

### Interaction Methods
1. **Individual Nail Application:**
   - Click on specific nail to apply selected design
   - Layer multiple elements (base color + pattern + gems)

2. **Bulk Application:**
   - "Apply to All" button for same design on all nails
   - "Apply to Hand" button for left/right hand only

### Archive System
- Save completed designs to local archive
- Scroll through saved designs in archive section
- Each save includes thumbnail and timestamp

### Infinite Canvas
- Scroll down to generate new clean hand pairs
- Unlimited design creation without losing previous work

## Technical Requirements

### Framework
- Vue 3 with Composition API
- UI Library: Vuetify 3 or PrimeVue for components
- Tailwind CSS for utility styling

### Styling
- Clean, modern aesthetic
- Responsive design
- Hand illustrations as SVG for scalability

### Data Structure
```javascript
// Design save format
{
  id: string,
  timestamp: Date,
  leftHand: [nail1Design, nail2Design, ...], // 5 nails
  rightHand: [nail1Design, nail2Design, ...], // 5 nails
  thumbnail: string // base64 or canvas data
}

// Individual nail design
{
  baseColor: string,
  pattern: string,
  decorations: [gem1, pearl1, ...]
}
```

### Local Storage
- Use localStorage for archive persistence
- No backend required

## User Flow
1. Page loads with clean left/right hand pair
2. User selects design category from sidebar/toolbar
3. User clicks individual nails or uses bulk application
4. User can layer multiple design elements
5. User saves completed design to archive
6. User scrolls down for new clean hands
7. User can browse archive of saved designs
8. User can copy design from archive for new design, but not edit existing archive items

## UI Layout
- Main canvas area: Hand display
- Side panel: Design categories and tools
- Bottom section: Archive with horizontal scroll
- Floating "Save Design" button
- "Reset Hands" button

## Success Criteria
- Smooth, intuitive nail selection and design application
- All design categories implemented with variety
- Archive system working with local persistence
- Responsive design works on desktop and tablet
- Clean, inspiring visual aesthetic matches nail art community standards