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
          @click="copyDesign(design.id)"
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
</template>

<script setup>
import { computed } from 'vue'
import { useNailStore } from '../stores/nailStore'

const nailStore = useNailStore()

const archive = computed(() => nailStore.archive)

const copyDesign = (designId) => {
  nailStore.copyFromArchive(designId)
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
</script>

<style scoped>
.archive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
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
  width: 80px;
  height: 80px;
  filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.1));
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
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.5rem;
  }
}
</style>