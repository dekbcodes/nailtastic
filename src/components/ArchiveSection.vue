<template>
  <v-card class="archive-section" elevation="2">
    <v-card-title class="text-h6">
      <v-icon class="mr-2">mdi-archive</v-icon>
      Saved Designs
      <v-spacer></v-spacer>
      <v-chip color="primary" variant="outlined" size="small">
        {{ archive.length }} designs
      </v-chip>
    </v-card-title>

    <v-card-text v-if="archive.length === 0" class="text-center text-grey">
      <v-icon size="64" class="mb-2">mdi-archive-outline</v-icon>
      <p>No saved designs yet. Create a design and click the save button!</p>
    </v-card-text>

    <v-card-text v-else>
      <div class="archive-grid">
        <v-card
          v-for="design in archive"
          :key="design.id"
          class="archive-item"
          elevation="1"
          @click="showFullscreen(design)"
        >
          <div class="archive-preview">
            <div class="mini-hands">
              <!-- Mini Left Hand -->
              <div class="mini-hand">
                <div class="mini-hand-display">
                  <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f91a.svg" 
                       alt="Left Hand" class="mini-hand-image" style="transform: scaleX(-1);">
                  <div class="mini-nails-overlay">
                    <div 
                      v-for="(nail, index) in design.leftHand" 
                      :key="`archive-left-${index}`"
                      class="mini-nail-spot"
                      :style="getMiniNailStyle('left', index, nail)"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Mini Right Hand -->
              <div class="mini-hand">
                <div class="mini-hand-display">
                  <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f91a.svg" 
                       alt="Right Hand" class="mini-hand-image">
                  <div class="mini-nails-overlay">
                    <div 
                      v-for="(nail, index) in design.rightHand" 
                      :key="`archive-right-${index}`"
                      class="mini-nail-spot"
                      :style="getMiniNailStyle('right', index, nail)"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <v-card-subtitle class="text-center pa-2">
            <small>{{ formatDate(design.timestamp) }}</small>
          </v-card-subtitle>

          <v-card-actions class="pa-2">
            <v-btn 
              size="small" 
              color="error" 
              variant="text"
              @click.stop="deleteDesign(design.id)"
            >
              <v-icon size="small">mdi-delete</v-icon>
              Delete
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn 
              size="small" 
              color="primary" 
              variant="text"
              @click.stop="copyDesign(design.id)"
            >
              <v-icon size="small">mdi-content-copy</v-icon>
              Copy
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-card-text>
  </v-card>

  <!-- Fullscreen Preview Modal -->
  <v-dialog v-model="showFullscreenModal" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card class="fullscreen-preview">
      <v-btn
        icon
        class="exit-button"
        @click="closeFullscreen"
        color="white"
        variant="elevated"
        size="large"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <div class="fullscreen-content">
        <v-card-title class="text-h4 text-center mb-6 text-white">
          Saved Design Preview
        </v-card-title>
        
        <div class="fullscreen-hands" v-if="selectedDesign">
          <!-- Fullscreen Left Hand -->
          <div class="fullscreen-hand">
            <h2 class="text-white text-center mb-4">Left Hand</h2>
            <div class="fullscreen-hand-display">
              <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f91a.svg" 
                   alt="Left Hand" class="fullscreen-hand-image" style="transform: scaleX(-1);">
              <div class="fullscreen-nails-overlay">
                <div 
                  v-for="(nail, index) in selectedDesign.leftHand" 
                  :key="`fullscreen-left-${index}`"
                  class="fullscreen-nail-spot"
                  :style="getFullscreenNailStyle('left', index, nail)"
                ></div>
              </div>
            </div>
          </div>

          <!-- Fullscreen Right Hand -->
          <div class="fullscreen-hand">
            <h2 class="text-white text-center mb-4">Right Hand</h2>
            <div class="fullscreen-hand-display">
              <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f91a.svg" 
                   alt="Right Hand" class="fullscreen-hand-image">
              <div class="fullscreen-nails-overlay">
                <div 
                  v-for="(nail, index) in selectedDesign.rightHand" 
                  :key="`fullscreen-right-${index}`"
                  class="fullscreen-nail-spot"
                  :style="getFullscreenNailStyle('right', index, nail)"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="fullscreen-actions">
          <v-btn 
            @click="copyDesign(selectedDesign.id)" 
            color="primary" 
            variant="elevated" 
            size="large"
            class="mr-4"
          >
            <v-icon class="mr-2">mdi-content-copy</v-icon>
            Copy Design
          </v-btn>
          <v-btn 
            @click="deleteDesign(selectedDesign.id); closeFullscreen()" 
            color="error" 
            variant="elevated" 
            size="large"
          >
            <v-icon class="mr-2">mdi-delete</v-icon>
            Delete Design
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useNailStore } from '../stores/nailStore'

const nailStore = useNailStore()

const archive = computed(() => nailStore.archive)
const showFullscreenModal = ref(false)
const selectedDesign = ref(null)

const copyDesign = (designId) => {
  nailStore.copyFromArchive(designId)
}

const deleteDesign = (designId) => {
  if (confirm('Are you sure you want to delete this design? This action cannot be undone.')) {
    nailStore.deleteFromArchive(designId)
  }
}

const showFullscreen = (design) => {
  selectedDesign.value = design
  showFullscreenModal.value = true
}

const closeFullscreen = () => {
  showFullscreenModal.value = false
  selectedDesign.value = null
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const getMiniNailStyle = (hand, index, nail) => {
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
  
  return {
    position: 'absolute',
    top: positions.top,
    left: positions.left,
    width: '8px',
    height: '10px',
    backgroundColor: baseColor,
    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
    border: '0.5px solid #d4a574',
    transform: 'translate(-50%, -50%)'
  }
}

const getFullscreenNailStyle = (hand, index, nail) => {
  // Larger positions for fullscreen view
  const leftPositions = [
    { top: '48%', left: '85%' },   // thumb
    { top: '10%', left: '59%' },   // index
    { top: '5%', left: '45%' },    // middle
    { top: '10%', left: '32%' },   // ring
    { top: '22%', left: '18%' }    // pinky
  ]
  
  const rightPositions = [
    { top: '48%', left: '15%' },   // thumb
    { top: '10%', left: '41%' },   // index
    { top: '5%', left: '55%' },    // middle
    { top: '10%', left: '68%' },   // ring
    { top: '22%', left: '82%' }    // pinky
  ]
  
  const positions = hand === 'left' ? leftPositions[index] : rightPositions[index]
  const baseColor = nail.baseColor || '#ffc0cb'
  
  // Apply patterns if they exist (using same logic as HandCanvas.vue)
  let background = baseColor
  if (nail.pattern) {
    const patternColorToUse = nail.patternColor || '#ffffff'
    
    switch (nail.pattern) {
      case 'vertical':
        background = `repeating-linear-gradient(90deg, ${baseColor}, ${baseColor} 4px, ${patternColorToUse} 4px, ${patternColorToUse} 8px)`
        break
      case 'horizontal':
        background = `repeating-linear-gradient(0deg, ${baseColor}, ${baseColor} 4px, ${patternColorToUse} 4px, ${patternColorToUse} 8px)`
        break
      case 'diagonal':
        background = `repeating-linear-gradient(45deg, ${baseColor}, ${baseColor} 4px, ${patternColorToUse} 4px, ${patternColorToUse} 8px)`
        break
      case 'polka':
        background = `radial-gradient(circle at 30% 30%, ${patternColorToUse} 2px, transparent 3px), radial-gradient(circle at 70% 70%, ${patternColorToUse} 2px, transparent 3px), ${baseColor}`
        break
      case 'roses':
        background = `${baseColor}, url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='52'%3E%3Ctext x='10' y='26' font-size='16'%3E🌹%3C/text%3E%3Ctext x='24' y='40' font-size='12'%3E🌹%3C/text%3E%3C/svg%3E")`
        break
      case 'daisies':
        background = `${baseColor}, url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='52'%3E%3Ctext x='8' y='24' font-size='14'%3E🌼%3C/text%3E%3Ctext x='22' y='40' font-size='12'%3E🌼%3C/text%3E%3C/svg%3E")`
        break
      case 'cherry-blossoms':
        background = `${baseColor}, url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='52'%3E%3Ctext x='6' y='20' font-size='12'%3E🌸%3C/text%3E%3Ctext x='20' y='36' font-size='10'%3E🌸%3C/text%3E%3Ctext x='28' y='16' font-size='10'%3E🌸%3C/text%3E%3C/svg%3E")`
        break
      case 'abstract-flowers':
        background = `${baseColor}, url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='52'%3E%3Ctext x='8' y='24' font-size='14'%3E🌺%3C/text%3E%3Ctext x='22' y='40' font-size='12'%3E🌻%3C/text%3E%3C/svg%3E")`
        break
      case 'scatter':
        background = `${baseColor}, url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='52'%3E%3Ctext x='4' y='16' font-size='8'%3E🌿%3C/text%3E%3Ctext x='16' y='30' font-size='8'%3E🍃%3C/text%3E%3Ctext x='26' y='20' font-size='8'%3E🌿%3C/text%3E%3Ctext x='30' y='40' font-size='8'%3E🍃%3C/text%3E%3C/svg%3E")`
        break
      default:
        background = baseColor
    }
  }
  
  return {
    position: 'absolute',
    top: positions.top,
    left: positions.left,
    width: '40px',
    height: '52px',
    backgroundColor: baseColor,
    background: background,
    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
    border: '4px solid #d4a574',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
  }
}
</script>

<style scoped>
.archive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

.archive-item {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.archive-item:hover {
  transform: translateY(-2px);
  border-color: #1976d2;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

.archive-preview {
  padding: 1rem;
  background: linear-gradient(145deg, #f8f9fa, #ffffff);
}

.mini-hands {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.mini-hand {
  flex: 1;
  text-align: center;
}

.mini-hand-display {
  position: relative;
  display: inline-block;
}

.mini-hand-image {
  width: 120px;
  height: 120px;
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.15));
}

.mini-nails-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.mini-nail-spot {
  pointer-events: none;
}

@media (max-width: 768px) {
  .archive-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
}

/* Fullscreen Modal Styles */
.fullscreen-preview {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 100vh;
  overflow-y: auto;
}

.exit-button {
  position: fixed !important;
  top: 20px;
  right: 20px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
}

.fullscreen-content {
  padding: 80px 40px 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.fullscreen-hands {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.fullscreen-hand {
  text-align: center;
}

.fullscreen-hand-display {
  position: relative;
  display: inline-block;
}

.fullscreen-hand-image {
  width: 400px;
  height: 400px;
  filter: drop-shadow(4px 4px 8px rgba(0,0,0,0.3));
}

.fullscreen-nails-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.fullscreen-nail-spot {
  pointer-events: none;
}

.fullscreen-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .fullscreen-content {
    padding: 60px 20px 20px;
  }
  
  .fullscreen-hands {
    flex-direction: column;
    gap: 2rem;
  }
  
  .fullscreen-hand-image {
    width: 300px;
    height: 300px;
  }
  
  .exit-button {
    top: 10px;
    right: 10px;
  }
}
</style>