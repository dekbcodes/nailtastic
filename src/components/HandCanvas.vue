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
        
        <!-- Skin Tone Selector -->
        <v-row class="mb-4" justify="center">
          <v-col cols="auto">
            <div class="text-subtitle-2 mb-2 text-center">Skin Tone</div>
            <v-btn-group density="compact">
              <v-btn
                v-for="(tone, index) in skinTones"
                :key="`tone-${index}`"
                @click="selectedSkinTone = index"
                :color="tone.color"
                :variant="selectedSkinTone === index ? 'elevated' : 'flat'"
                size="small"
                class="skin-tone-btn"
              >
                <span class="skin-tone-preview" :style="{ backgroundColor: tone.color }"></span>
              </v-btn>
            </v-btn-group>
          </v-col>
        </v-row>
        
        <div class="hands-container" :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }">
          <!-- Left Hand -->
          <div class="hand-section">
            <h3 class="mb-4">Left Hand</h3>
            <div class="hand-display">
              <div class="hand-container">
                <div class="hand-emoji-wrapper" :style="{ filter: `hue-rotate(-20deg) saturate(0.7) ${skinTones[selectedSkinTone].filter}` }">
                  <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f91a.svg" 
                       alt="Left Hand" class="hand-emoji left-hand">
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
          </div>

          <!-- Right Hand -->
          <div class="hand-section">
            <h3 class="mb-4">Right Hand</h3>
            <div class="hand-display">
              <div class="hand-container">
                <div class="hand-emoji-wrapper" :style="{ filter: `hue-rotate(-20deg) saturate(0.7) ${skinTones[selectedSkinTone].filter}` }">
                  <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f91a.svg" 
                       alt="Right Hand" class="hand-emoji right-hand">
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
const selectedSkinTone = ref(2) // Default to middle tone

// Define skin tone options
const skinTones = [
  { name: 'Light', color: '#fde7d4', filter: 'brightness(1.2) saturate(0.8) hue-rotate(-10deg)' },
  { name: 'Fair', color: '#f8d7c4', filter: 'brightness(1.1) saturate(0.9) hue-rotate(-5deg)' },
  { name: 'Medium', color: '#f4c2a1', filter: 'brightness(1.0) saturate(1.0)' },
  { name: 'Tan', color: '#d4a574', filter: 'brightness(0.9) saturate(1.1) hue-rotate(5deg)' },
  { name: 'Brown', color: '#a67c52', filter: 'brightness(0.7) saturate(0.8) hue-rotate(-25deg) sepia(0.4)' },
  { name: 'Dark', color: '#7c5a41', filter: 'brightness(0.5) saturate(1.1) hue-rotate(-15deg) sepia(0.3)' }
]

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
  // Nail positions for emoji hands
  const leftPositions = [
    { top: '48%', left: '85%' },   // thumb (moved up slightly)
    { top: '10%', left: '59%' },   // index (moved in more)
    { top: '5%', left: '45%' },    // middle (moved in more)
    { top: '10%', left: '32%' },   // ring (moved toward pinky)
    { top: '22%', left: '18%' }    // pinky
  ]
  
  const rightPositions = [
    { top: '48%', left: '15%' },   // thumb (moved up slightly)
    { top: '10%', left: '41%' },   // index (moved in more)
    { top: '5%', left: '55%' },    // middle (moved in more)
    { top: '10%', left: '68%' },   // ring (moved toward pinky)
    { top: '22%', left: '82%' }    // pinky
  ]
  
  const positions = hand === 'left' ? leftPositions[index] : rightPositions[index]
  const baseColor = nail.baseColor || '#ffc0cb'
  
  let background = baseColor
  console.log('Nail data:', nail, 'Base color:', baseColor)
  if (nail.pattern) {
    const patternColorToUse = nail.patternColor || '#ffffff'
    console.log('Applying pattern:', nail.pattern, 'with colors:', baseColor, patternColorToUse)
    
    switch (nail.pattern) {
      case 'vertical':
        background = `repeating-linear-gradient(90deg, ${baseColor}, ${baseColor} 2px, ${patternColorToUse} 2px, ${patternColorToUse} 4px)`
        break
      case 'horizontal':
        background = `repeating-linear-gradient(0deg, ${baseColor}, ${baseColor} 2px, ${patternColorToUse} 2px, ${patternColorToUse} 4px)`
        break
      case 'diagonal':
        background = `repeating-linear-gradient(45deg, ${baseColor}, ${baseColor} 2px, ${patternColorToUse} 2px, ${patternColorToUse} 4px)`
        break
      case 'polka':
        background = `radial-gradient(circle at 30% 30%, ${patternColorToUse} 1px, transparent 1.5px), radial-gradient(circle at 70% 70%, ${patternColorToUse} 1px, transparent 1.5px), ${baseColor}`
        break
      case 'confetti':
        background = `linear-gradient(45deg, ${baseColor} 25%, ${patternColorToUse} 25% 50%, ${baseColor} 50% 75%, ${patternColorToUse} 75%)`
        break
      case 'gradient-dots':
        background = `radial-gradient(circle 2px at 30% 30%, ${patternColorToUse} 30%, transparent 70%), radial-gradient(circle 2px at 70% 70%, ${patternColorToUse} 30%, transparent 70%), ${baseColor}`
        break
      case 'roses':
        background = `${baseColor}, url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='26'%3E%3Ctext x='5' y='13' font-size='8'%3E🌹%3C/text%3E%3Ctext x='12' y='20' font-size='6'%3E🌹%3C/text%3E%3C/svg%3E")`
        break
      case 'daisies':
        background = `${baseColor}, url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='26'%3E%3Ctext x='4' y='12' font-size='7'%3E🌼%3C/text%3E%3Ctext x='11' y='20' font-size='6'%3E🌼%3C/text%3E%3C/svg%3E")`
        break
      case 'cherry-blossoms':
        background = `${baseColor}, url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='26'%3E%3Ctext x='3' y='10' font-size='6'%3E🌸%3C/text%3E%3Ctext x='10' y='18' font-size='5'%3E🌸%3C/text%3E%3Ctext x='14' y='8' font-size='5'%3E🌸%3C/text%3E%3C/svg%3E")`
        break
      case 'abstract-flowers':
        background = `${baseColor}, url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='26'%3E%3Ctext x='4' y='12' font-size='7'%3E🌺%3C/text%3E%3Ctext x='11' y='20' font-size='6'%3E🌻%3C/text%3E%3C/svg%3E")`
        break
      case 'scatter':
        background = `${baseColor}, url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='26'%3E%3Ctext x='2' y='8' font-size='4'%3E🌿%3C/text%3E%3Ctext x='8' y='15' font-size='4'%3E🍃%3C/text%3E%3Ctext x='13' y='10' font-size='4'%3E🌿%3C/text%3E%3Ctext x='15' y='20' font-size='4'%3E🍃%3C/text%3E%3C/svg%3E")`
        break
      case 'swirls':
        background = `repeating-conic-gradient(from 0deg at 50% 50%, ${baseColor} 0deg 45deg, ${patternColorToUse} 45deg 90deg, ${baseColor} 90deg 135deg, ${patternColorToUse} 135deg 180deg)`
        break
      case 'petals':
        background = `radial-gradient(ellipse 4px 2px at 50% 30%, ${patternColorToUse} 50%, transparent 50%), radial-gradient(ellipse 2px 4px at 30% 50%, ${patternColorToUse} 50%, transparent 50%), radial-gradient(ellipse 4px 2px at 50% 70%, ${patternColorToUse} 50%, transparent 50%), radial-gradient(ellipse 2px 4px at 70% 50%, ${patternColorToUse} 50%, transparent 50%), ${baseColor}`
        break
      case 'abstract':
        background = `linear-gradient(45deg, ${baseColor} 25%, ${patternColorToUse} 25% 50%, ${baseColor} 50% 75%, ${patternColorToUse} 75%)`
        break
      case 'crossing-lines':
        background = `repeating-linear-gradient(45deg, ${baseColor} 0px 2px, ${patternColorToUse} 2px 4px), repeating-linear-gradient(-45deg, transparent 0px 2px, ${patternColorToUse} 2px 4px)`
        break
      case 'four-ovals':
        background = `radial-gradient(ellipse 3px 2px at 30% 30%, ${patternColorToUse} 60%, transparent 60%), radial-gradient(ellipse 3px 2px at 70% 30%, ${patternColorToUse} 60%, transparent 60%), radial-gradient(ellipse 3px 2px at 30% 70%, ${patternColorToUse} 60%, transparent 60%), radial-gradient(ellipse 3px 2px at 70% 70%, ${patternColorToUse} 60%, transparent 60%), ${baseColor}`
        break
      case 'eight-petals':
        background = `repeating-conic-gradient(from 0deg at 50% 50%, ${patternColorToUse} 0deg 22.5deg, ${baseColor} 22.5deg 45deg)`
        break
      default:
        // If pattern doesn't match any case, just use base color (no pattern)
        background = baseColor
    }
  }
  
  console.log('Final background:', background)
  
  return {
    position: 'absolute',
    top: positions.top,
    left: positions.left,
    width: '20px',
    height: '26px',
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
  console.log('Nail clicked!', hand, index)
  console.log('Store state:', {
    selectedDesign: nailStore.selectedDesign,
    selectedCategory: nailStore.selectedCategory
  })
  if (nailStore.selectedDesign && nailStore.selectedCategory) {
    console.log('Applying design to nail...')
    nailStore.applyToNail(hand, index, nailStore.selectedCategory, nailStore.selectedDesign, props.canvasId)
  } else {
    console.log('No design or category selected!')
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

.hand-container {
  position: relative;
  display: inline-block;
}

.hand-emoji-wrapper {
  display: inline-block;
}

.hand-emoji {
  width: 200px;
  height: 200px;
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.1));
}

.left-hand {
  transform: scaleX(-1);
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

.skin-tone-btn {
  min-width: 40px !important;
  padding: 4px !important;
}

.skin-tone-preview {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .hands-container {
    flex-direction: column;
    gap: 2rem;
  }
  
  .hand-emoji {
    width: 150px;
    height: 150px;
  }
}
</style>