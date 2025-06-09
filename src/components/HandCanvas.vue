<template>
  <v-row justify="center" class="hand-canvas">
    <v-col cols="12" class="text-center">
      <v-card class="pa-8 mx-auto" max-width="800" elevation="2">
        <v-card-title class="text-h5 mb-4">
          Canvas {{ canvasIndex + 1 }}
          <v-spacer></v-spacer>
          <v-btn-group class="mr-2">
            <v-btn 
              @click="zoomOut"
              :disabled="zoomLevel <= 0.5"
              size="small"
              variant="outlined"
            >
              <v-icon>mdi-magnify-minus</v-icon>
            </v-btn>
            <v-btn 
              @click="resetZoom"
              size="small"
              variant="outlined"
            >
              {{ Math.round(zoomLevel * 100) }}%
            </v-btn>
            <v-btn 
              @click="zoomIn"
              :disabled="zoomLevel >= 3"
              size="small"
              variant="outlined"
            >
              <v-icon>mdi-magnify-plus</v-icon>
            </v-btn>
          </v-btn-group>
          <v-btn 
            @click="saveCanvas" 
            color="primary" 
            variant="outlined" 
            size="small"
          >
            <v-icon class="mr-1">mdi-content-save</v-icon>
            Save This Canvas
          </v-btn>
        </v-card-title>
        
        <div class="hands-container" :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }">
          <!-- Left Hand -->
          <div class="hand-section">
            <h3 class="mb-4">Left Hand</h3>
            <div class="hand-display">
              <!-- Hand Base -->
              <div class="hand-base">
                <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f91a.svg" 
                     alt="Left Hand" class="hand-image" style="transform: scaleX(-1);">
              </div>
              
              <!-- Nails positioned over hand -->
              <div class="nails-overlay">
                <div 
                  v-for="(nail, index) in leftHand" 
                  :key="`left-${index}`"
                  class="nail-spot"
                  :style="getNailStyle('left', index, nail)"
                  @click="onNailClick('left', index)"
                >
                  <!-- Decorations -->
                  <div 
                    v-for="(decoration, decIndex) in nail.decorations" 
                    :key="`left-${index}-dec-${decIndex}`"
                    class="decoration-dot"
                    :style="{ backgroundColor: decoration.color || getDecorationColor(decoration.type || decoration) }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Hand -->
          <div class="hand-section">
            <h3 class="mb-4">Right Hand</h3>
            <div class="hand-display">
              <!-- Hand Base -->
              <div class="hand-base">
                <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f91a.svg" 
                     alt="Right Hand" class="hand-image">
              </div>
              
              <!-- Nails positioned over hand -->
              <div class="nails-overlay">
                <div 
                  v-for="(nail, index) in rightHand" 
                  :key="`right-${index}`"
                  class="nail-spot"
                  :style="getNailStyle('right', index, nail)"
                  @click="onNailClick('right', index)"
                >
                  <!-- Decorations -->
                  <div 
                    v-for="(decoration, decIndex) in nail.decorations" 
                    :key="`right-${index}-dec-${decIndex}`"
                    class="decoration-dot"
                    :style="{ backgroundColor: decoration.color || getDecorationColor(decoration.type || decoration) }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <v-row class="mt-6" justify="center">
          <v-col cols="auto">
            <v-btn @click="applyToAll" color="primary" variant="elevated" class="mr-2">
              Apply to All Nails
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn @click="applyToHand('left')" color="secondary" variant="outlined" class="mr-2">
              Apply to Left Hand
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn @click="applyToHand('right')" color="secondary" variant="outlined">
              Apply to Right Hand
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNailStore } from '../stores/nailStore'

const props = defineProps({
  canvasId: {
    type: Number,
    required: true
  },
  canvasIndex: {
    type: Number,
    required: true
  }
})

const nailStore = useNailStore()
const zoomLevel = ref(1)

const leftHand = computed(() => {
  const canvas = nailStore.canvases[props.canvasId]
  return canvas ? canvas.leftHand : []
})

const rightHand = computed(() => {
  const canvas = nailStore.canvases[props.canvasId]
  return canvas ? canvas.rightHand : []
})

const zoomIn = () => {
  if (zoomLevel.value < 3) {
    zoomLevel.value += 0.25
  }
}

const zoomOut = () => {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value -= 0.25
  }
}

const resetZoom = () => {
  zoomLevel.value = 1
}

const getNailStyle = (hand, index, nail) => {
  // Updated positions for proper hand emojis
  const leftPositions = [
    { top: '25%', left: '18%' },   // thumb
    { top: '12%', left: '30%' },   // index
    { top: '8%', left: '42%' },    // middle
    { top: '12%', left: '54%' },   // ring
    { top: '20%', left: '65%' }    // pinky
  ]
  
  const rightPositions = [
    { top: '25%', left: '82%' },   // thumb
    { top: '12%', left: '70%' },   // index
    { top: '8%', left: '58%' },    // middle
    { top: '12%', left: '46%' },   // ring
    { top: '20%', left: '35%' }    // pinky
  ]
  
  const positions = hand === 'left' ? leftPositions[index] : rightPositions[index]
  const baseColor = nail.baseColor || '#ffc0cb'
  
  let background = baseColor
  if (nail.pattern) {
    const patternColorToUse = nail.patternColor || '#ffffff'
    // Add proper pattern overlays
    switch (nail.pattern) {
      case 'vertical':
        background = `repeating-linear-gradient(90deg, ${baseColor}, ${baseColor} 2px, ${patternColorToUse} 2px, ${patternColorToUse} 4px)`
        break
      case 'horizontal':
        background = `repeating-linear-gradient(0deg, ${baseColor}, ${baseColor} 2px, ${patternColorToUse} 2px, ${patternColorToUse} 4px)`
        break
      case 'diagonal':
        background = `repeating-linear-gradient(45deg, ${baseColor}, ${baseColor} 3px, ${patternColorToUse} 3px, ${patternColorToUse} 6px)`
        break
      case 'polka':
        background = `radial-gradient(circle at 25% 25%, ${patternColorToUse} 2px, transparent 2px), radial-gradient(circle at 75% 75%, ${patternColorToUse} 2px, transparent 2px), ${baseColor}`
        break
      case 'roses':
        background = `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='18'%3E🌹%3C/text%3E%3C/svg%3E") center/16px no-repeat,
          ${baseColor}
        `
        break
      case 'cherry-blossoms':
        background = `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='18'%3E🌸%3C/text%3E%3C/svg%3E") center/16px no-repeat,
          ${baseColor}
        `
        break
      case 'daisies':
        background = `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='18'%3E🌼%3C/text%3E%3C/svg%3E") center/16px no-repeat,
          ${baseColor}
        `
        break
      case 'abstract-flowers':
        background = `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='10'%3E💐%3C/text%3E%3C/svg%3E") 0% 0%/8px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='8'%3E💐%3C/text%3E%3C/svg%3E") 25% 15%/6px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='12'%3E💐%3C/text%3E%3C/svg%3E") 50% 10%/10px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='9'%3E💐%3C/text%3E%3C/svg%3E") 75% 25%/7px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='11'%3E💐%3C/text%3E%3C/svg%3E") 100% 0%/9px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='8'%3E💐%3C/text%3E%3C/svg%3E") 15% 40%/6px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='10'%3E💐%3C/text%3E%3C/svg%3E") 40% 50%/8px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='12'%3E💐%3C/text%3E%3C/svg%3E") 65% 45%/10px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='9'%3E💐%3C/text%3E%3C/svg%3E") 90% 55%/7px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='11'%3E💐%3C/text%3E%3C/svg%3E") 10% 75%/9px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='8'%3E💐%3C/text%3E%3C/svg%3E") 35% 80%/6px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='10'%3E💐%3C/text%3E%3C/svg%3E") 60% 75%/8px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='12'%3E💐%3C/text%3E%3C/svg%3E") 85% 90%/10px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='9'%3E💐%3C/text%3E%3C/svg%3E") 0% 100%/7px no-repeat,
          ${baseColor}
        `
        break
      case 'swirls':
        background = `
          conic-gradient(from 0deg at 30% 30%, #ff1493 0deg, #ff69b4 60deg, #ffb6c1 120deg, #ff1493 180deg, #ff69b4 240deg, #ffb6c1 300deg, #ff1493 360deg),
          conic-gradient(from 45deg at 70% 20%, #ff69b4 0deg, #ff1493 90deg, #ffb6c1 180deg, #ff69b4 270deg, #ff1493 360deg),
          ${baseColor}
        `
        break
      case 'scatter':
        background = `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='8'%3E🌸%3C/text%3E%3C/svg%3E") 20% 20%/6px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='6'%3E🌸%3C/text%3E%3C/svg%3E") 70% 30%/4px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='10'%3E🌸%3C/text%3E%3C/svg%3E") 40% 70%/8px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='7'%3E🌸%3C/text%3E%3C/svg%3E") 80% 80%/5px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='9'%3E🌸%3C/text%3E%3C/svg%3E") 15% 70%/7px no-repeat,
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='5'%3E🌸%3C/text%3E%3C/svg%3E") 60% 15%/3px no-repeat,
          ${baseColor}
        `
        break
      case 'petals':
        background = `
          radial-gradient(circle at 50% 30%, ${patternColorToUse} 3px, transparent 4px),
          radial-gradient(circle at 70% 50%, ${patternColorToUse} 3px, transparent 4px),
          radial-gradient(circle at 50% 70%, ${patternColorToUse} 3px, transparent 4px),
          radial-gradient(circle at 30% 50%, ${patternColorToUse} 3px, transparent 4px),
          radial-gradient(circle at 50% 50%, ${patternColorToUse} 2px, transparent 3px),
          ${baseColor}
        `
        break
      case 'eight-petals':
        background = `
          radial-gradient(ellipse 8px 3px at 50% 25%, ${patternColorToUse} 80%, transparent 100%),
          radial-gradient(ellipse 8px 3px at 75% 50%, ${patternColorToUse} 80%, transparent 100%) 90deg,
          radial-gradient(ellipse 8px 3px at 50% 75%, ${patternColorToUse} 80%, transparent 100%) 180deg,
          radial-gradient(ellipse 8px 3px at 25% 50%, ${patternColorToUse} 80%, transparent 100%) 270deg,
          radial-gradient(ellipse 6px 3px at 62% 38%, ${patternColorToUse} 70%, transparent 100%) 45deg,
          radial-gradient(ellipse 6px 3px at 62% 62%, ${patternColorToUse} 70%, transparent 100%) 135deg,
          radial-gradient(ellipse 6px 3px at 38% 62%, ${patternColorToUse} 70%, transparent 100%) 225deg,
          radial-gradient(ellipse 6px 3px at 38% 38%, ${patternColorToUse} 70%, transparent 100%) 315deg,
          radial-gradient(circle 4px at 50% 50%, ${patternColorToUse} 100%, transparent 100%),
          ${baseColor}
        `
        break
      case 'four-ovals':
        background = `
          radial-gradient(ellipse 10px 4px at 50% 30%, ${patternColorToUse} 70%, transparent 100%),
          radial-gradient(ellipse 10px 4px at 50% 70%, ${patternColorToUse} 70%, transparent 100%),
          radial-gradient(ellipse 4px 10px at 30% 50%, ${patternColorToUse} 70%, transparent 100%),
          radial-gradient(ellipse 4px 10px at 70% 50%, ${patternColorToUse} 70%, transparent 100%),
          radial-gradient(circle 3px at 50% 50%, ${patternColorToUse} 100%, transparent 100%),
          ${baseColor}
        `
        break
      case 'crossing-lines':
        background = `
          linear-gradient(45deg, transparent 45%, ${patternColorToUse} 48%, ${patternColorToUse} 52%, transparent 55%),
          linear-gradient(-45deg, transparent 45%, ${patternColorToUse} 48%, ${patternColorToUse} 52%, transparent 55%),
          linear-gradient(0deg, transparent 45%, ${patternColorToUse} 48%, ${patternColorToUse} 52%, transparent 55%),
          linear-gradient(90deg, transparent 45%, ${patternColorToUse} 48%, ${patternColorToUse} 52%, transparent 55%),
          ${baseColor}
        `
        break
      case 'abstract':
        background = `
          radial-gradient(ellipse 5px 3px at 30% 30%, ${patternColorToUse} 60%, transparent 70%),
          radial-gradient(ellipse 3px 5px at 30% 30%, ${patternColorToUse} 50%, transparent 60%),
          radial-gradient(ellipse 4px 2px at 70% 70%, ${patternColorToUse} 60%, transparent 70%),
          radial-gradient(ellipse 2px 4px at 70% 70%, ${patternColorToUse} 50%, transparent 60%),
          ${baseColor}
        `
        break
      case 'confetti':
        background = `radial-gradient(circle at 20% 20%, #ff69b4 1px, transparent 1px), radial-gradient(circle at 60% 30%, #00ffff 1px, transparent 1px), radial-gradient(circle at 40% 70%, #ffff00 1px, transparent 1px), radial-gradient(circle at 80% 80%, #ff1493 1px, transparent 1px), ${baseColor}`
        break
      case 'gradient-dots':
        background = `
          radial-gradient(circle at 20% 20%, ${patternColorToUse} 1px, rgba(255,255,255,0.6) 2px, transparent 3px),
          radial-gradient(circle at 50% 30%, rgba(255,255,255,0.8) 1px, ${patternColorToUse} 2px, transparent 3px),
          radial-gradient(circle at 80% 50%, ${patternColorToUse} 1px, rgba(255,255,255,0.4) 2px, transparent 3px),
          radial-gradient(circle at 30% 70%, rgba(255,255,255,0.9) 1px, ${patternColorToUse} 2px, transparent 3px),
          radial-gradient(circle at 70% 80%, ${patternColorToUse} 1px, rgba(255,255,255,0.5) 2px, transparent 3px),
          ${baseColor}
        `
        break
      default:
        background = `linear-gradient(45deg, ${baseColor} 50%, ${patternColorToUse} 50%)`
    }
  }
  
  return {
    position: 'absolute',
    top: positions.top,
    left: positions.left,
    width: '24px',  // Made bigger
    height: '30px', // Made bigger
    backgroundColor: baseColor,
    background: background,
    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
    border: '2px solid #d4a574',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  }
}

const getDecorationColor = (decoration) => {
  const decorations = {
    'diamond': '#e6e6fa',
    'ruby': '#e0115f',
    'emerald': '#50c878',
    'sapphire': '#0f52ba',
    'crystal': '#ffffff',
    'white-pearl': '#f8f8ff',
    'cream-pearl': '#fffdd0',
    'colored-pearl': '#ff69b4',
    'gold-stud': '#ffd700',
    'silver-stud': '#c0c0c0',
    'rhinestone': '#e6e6fa'
  }
  return decorations[decoration] || '#ffffff'
}

const onNailClick = (hand, index) => {
  if (nailStore.selectedDesign && nailStore.selectedCategory) {
    nailStore.applyToNail(hand, index, nailStore.selectedCategory, nailStore.selectedDesign, props.canvasId)
  }
}

const applyToAll = () => {
  if (nailStore.selectedDesign && nailStore.selectedCategory) {
    nailStore.applyToAll(nailStore.selectedCategory, nailStore.selectedDesign, props.canvasId)
  }
}

const applyToHand = (hand) => {
  if (nailStore.selectedDesign && nailStore.selectedCategory) {
    nailStore.applyToHand(hand, nailStore.selectedCategory, nailStore.selectedDesign, props.canvasId)
  }
}

const saveCanvas = () => {
  nailStore.saveToArchive(props.canvasId)
}
</script>

<style scoped>
.hands-container {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  transition: transform 0.3s ease;
  overflow: visible;
}

.hand-section {
  text-align: center;
}

.hand-display {
  position: relative;
  display: inline-block;
}

.hand-base {
  position: relative;
}

.hand-image {
  width: 200px;
  height: 200px;
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.1));
}


.nails-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.nail-spot {
  pointer-events: all;
}

.nail-spot:hover {
  filter: brightness(1.1);
  transform: translate(-50%, -50%) scale(1.1);
  z-index: 10;
}

.decoration-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.3));
}

@media (max-width: 768px) {
  .hands-container {
    flex-direction: column;
    gap: 2rem;
  }
  
  .hand-image {
    width: 150px;
    height: 150px;
  }
}
</style>