<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-title>
        <v-icon class="mr-2">mdi-nail</v-icon>
        Nailtastic
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn @click="resetHands" variant="outlined">
        <v-icon>mdi-refresh</v-icon>
        Reset
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer permanent width="300" location="left">
      <DesignSelector />
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-4">
        <div v-for="(canvas, index) in canvases" :key="canvas.id" class="hand-canvas-container mb-12">
          <HandCanvas :canvas-id="canvas.id" :canvas-index="index" />
          <v-divider v-if="index < canvases.length - 1" class="my-8"></v-divider>
        </div>
        <ArchiveSection class="mt-8" />
        
        <!-- Infinite scroll trigger -->
        <div ref="scrollTrigger" class="scroll-trigger">
          <v-btn 
            @click="addNewCanvas" 
            color="secondary" 
            variant="outlined" 
            size="large"
            block
            class="my-4"
          >
            <v-icon class="mr-2">mdi-plus</v-icon>
            Add New Canvas
          </v-btn>
        </div>
      </v-container>
    </v-main>

    <v-fab
      icon="mdi-content-save"
      location="bottom end"
      color="accent"
      @click="saveDesign"
      size="large"
    ></v-fab>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNailStore } from './stores/nailStore'
import HandCanvas from './components/HandCanvas.vue'
import DesignSelector from './components/DesignSelector.vue'
import ArchiveSection from './components/ArchiveSection.vue'

const nailStore = useNailStore()
const canvases = ref([{ id: 1 }])
let canvasIdCounter = 1

const resetHands = () => {
  nailStore.resetHands()
}

const saveDesign = () => {
  nailStore.saveToArchive()
}

const addNewCanvas = () => {
  canvasIdCounter++
  const newCanvasId = canvasIdCounter
  canvases.value.push({ id: newCanvasId })
  nailStore.addCanvas(newCanvasId)
}

onMounted(() => {
  nailStore.loadArchive()
})
</script>

<style>
.hand-canvas-container {
  border-radius: 12px;
  margin-bottom: 2rem;
}

.scroll-trigger {
  text-align: center;
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .hand-canvas-container {
    margin-bottom: 1rem;
  }
}
</style>