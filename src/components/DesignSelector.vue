<template>
  <v-card class="design-selector pa-4" elevation="0">
    <v-card-title class="text-h6 mb-4">
      <v-icon class="mr-2">mdi-palette</v-icon>
      Design Tools
    </v-card-title>

    <!-- Category Tabs -->
    <v-tabs v-model="selectedCategory" color="primary" class="mb-4">
      <v-tab value="colors">
        <v-icon class="mr-1">mdi-palette</v-icon>
        Colors
      </v-tab>
      <v-tab value="patterns">
        <v-icon class="mr-1">mdi-texture</v-icon>
        Patterns
      </v-tab>
      <v-tab value="seasonal">
        <v-icon class="mr-1">mdi-weather-snowy</v-icon>
        Seasonal
      </v-tab>
      <v-tab value="decorations">
        <v-icon class="mr-1">mdi-diamond-stone</v-icon>
        Decorations
      </v-tab>
    </v-tabs>

    <!-- Colors Tab -->
    <v-window v-model="selectedCategory">
      <v-window-item value="colors">
        <v-expansion-panels v-model="colorPanel" multiple>
          <v-expansion-panel
            v-for="(colorGroup, groupName) in designCategories.colors"
            :key="groupName"
            :value="groupName"
          >
            <v-expansion-panel-title>
              {{ groupName.charAt(0).toUpperCase() + groupName.slice(1) }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="color-grid">
                <div
                  v-for="color in colorGroup"
                  :key="color"
                  class="color-swatch"
                  :style="{ backgroundColor: color }"
                  :class="{ active: selectedDesign === color }"
                  @click="selectDesign('colors', color)"
                  :title="color"
                ></div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-window-item>

      <!-- Patterns Tab -->
      <v-window-item value="patterns">
        <v-expansion-panels v-model="patternPanel" multiple>
          <v-expansion-panel
            v-for="(patternGroup, groupName) in designCategories.patterns"
            :key="groupName"
            :value="groupName"
          >
            <v-expansion-panel-title>
              {{ groupName.charAt(0).toUpperCase() + groupName.slice(1) }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list>
                <v-list-item
                  v-for="pattern in patternGroup"
                  :key="pattern"
                  @click="selectDesign('patterns', pattern)"
                  :class="{ 'v-list-item--active': selectedDesign === pattern }"
                >
                  <v-list-item-title>
                    <v-icon class="mr-2">mdi-texture</v-icon>
                    {{ pattern.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-window-item>

      <!-- Seasonal Tab -->
      <v-window-item value="seasonal">
        <v-expansion-panels v-model="seasonalPanel" multiple>
          <v-expansion-panel
            v-for="(seasonGroup, groupName) in designCategories.seasonal"
            :key="groupName"
            :value="groupName"
          >
            <v-expansion-panel-title>
              <v-icon class="mr-2">{{ getSeasonIcon(groupName) }}</v-icon>
              {{ groupName.charAt(0).toUpperCase() + groupName.slice(1) }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list>
                <v-list-item
                  v-for="theme in seasonGroup"
                  :key="theme"
                  @click="selectDesign('seasonal', theme)"
                  :class="{ 'v-list-item--active': selectedDesign === theme }"
                >
                  <v-list-item-title>
                    <v-icon class="mr-2">{{ getThemeIcon(theme) }}</v-icon>
                    {{ theme.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-window-item>

      <!-- Decorations Tab -->
      <v-window-item value="decorations">
        <v-expansion-panels v-model="decorationPanel" multiple>
          <v-expansion-panel
            v-for="(decorationGroup, groupName) in designCategories.decorations"
            :key="groupName"
            :value="groupName"
          >
            <v-expansion-panel-title>
              <v-icon class="mr-2">{{ getDecorationIcon(groupName) }}</v-icon>
              {{ groupName.charAt(0).toUpperCase() + groupName.slice(1) }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list>
                <v-list-item
                  v-for="decoration in decorationGroup"
                  :key="decoration"
                  @click="selectDesign('decorations', decoration)"
                  :class="{ 'v-list-item--active': selectedDesign === decoration }"
                >
                  <v-list-item-title>
                    <v-icon class="mr-2" :color="getDecorationColor(decoration)">mdi-circle</v-icon>
                    {{ decoration.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-window-item>
    </v-window>

    <!-- Selected Design Display -->
    <v-divider class="my-4"></v-divider>
    <v-card-subtitle v-if="selectedDesign" class="text-center">
      <v-chip color="primary" variant="elevated">
        Selected: {{ selectedDesign.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
      </v-chip>
    </v-card-subtitle>
    <v-card-subtitle v-else class="text-center text-grey">
      Select a design to apply to nails
    </v-card-subtitle>

    <!-- Pattern Color Picker -->
    <v-card v-if="selectedCategory === 'patterns' && selectedDesign" class="mt-4 pa-3">
      <v-card-title class="text-subtitle-1">Pattern Color</v-card-title>
      <div class="color-grid">
        <div
          v-for="color in designCategories.colors.solids"
          :key="color"
          class="color-swatch"
          :style="{ backgroundColor: color }"
          :class="{ active: patternColor === color }"
          @click="setPatternColor(color)"
          :title="color"
        ></div>
      </div>
    </v-card>

    <!-- Decoration Color Picker -->
    <v-card v-if="selectedCategory === 'decorations' && selectedDesign" class="mt-4 pa-3">
      <v-card-title class="text-subtitle-1">Decoration Color</v-card-title>
      <div class="color-grid">
        <div
          v-for="color in getDecorationColors()"
          :key="color"
          class="color-swatch"
          :style="{ backgroundColor: color }"
          :class="{ active: decorationColor === color }"
          @click="setDecorationColor(color)"
          :title="color"
        ></div>
      </div>
    </v-card>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useNailStore } from '../stores/nailStore'

const nailStore = useNailStore()

const selectedCategory = ref('colors')
const colorPanel = ref(['solids'])
const patternPanel = ref(['stripes'])
const seasonalPanel = ref(['summer'])
const decorationPanel = ref(['gems'])
const patternColor = ref('#ffffff')
const decorationColor = ref('#ffffff')

const designCategories = computed(() => nailStore.designCategories)
const selectedDesign = computed(() => nailStore.selectedDesign)

const selectDesign = (category, design) => {
  nailStore.selectedCategory = category
  nailStore.selectedDesign = design
}

const setPatternColor = (color) => {
  patternColor.value = color
  nailStore.patternColor = color
}

const setDecorationColor = (color) => {
  decorationColor.value = color
  nailStore.decorationColor = color
}

const getDecorationColors = () => {
  return [
    '#e6e6fa', '#ffffff', '#ffd700', '#c0c0c0', // diamond, crystal, gold, silver
    '#e0115f', '#50c878', '#0f52ba', '#ff69b4', // ruby, emerald, sapphire, pink
    '#ffb6c1', '#fffdd0', '#dda0dd', '#f0e68c'  // pearl colors
  ]
}

const getSeasonIcon = (season) => {
  const icons = {
    summer: 'mdi-weather-sunny',
    winter: 'mdi-snowflake',
    holidays: 'mdi-gift'
  }
  return icons[season] || 'mdi-calendar'
}

const getThemeIcon = (theme) => {
  const icons = {
    tropical: 'mdi-palm-tree',
    beach: 'mdi-beach',
    sunset: 'mdi-weather-sunset',
    snowflake: 'mdi-snowflake',
    ice: 'mdi-ice-cream',
    'winter-blue': 'mdi-weather-snowy',
    christmas: 'mdi-pine-tree',
    halloween: 'mdi-halloween',
    valentine: 'mdi-heart'
  }
  return icons[theme] || 'mdi-star'
}

const getDecorationIcon = (type) => {
  const icons = {
    gems: 'mdi-diamond',
    pearls: 'mdi-circle',
    studs: 'mdi-circle-outline'
  }
  return icons[type] || 'mdi-circle'
}

const getDecorationColor = (decoration) => {
  const colors = {
    'diamond': 'blue-lighten-2',
    'ruby': 'red',
    'emerald': 'green',
    'sapphire': 'blue',
    'crystal': 'grey-lighten-1',
    'white-pearl': 'grey-lighten-3',
    'cream-pearl': 'amber-lighten-4',
    'colored-pearl': 'pink',
    'gold-stud': 'yellow-darken-2',
    'silver-stud': 'grey',
    'rhinestone': 'purple-lighten-2'
  }
  return colors[decoration] || 'grey'
}

// Watch category changes to update store
watch(selectedCategory, (newCategory) => {
  nailStore.selectedCategory = newCategory
  nailStore.selectedDesign = null
})
</script>

<style scoped>
.design-selector {
  height: 100vh;
  overflow-y: auto;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 8px 0;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  position: relative;
}

.color-swatch:hover {
  transform: scale(1.1);
  border-color: #1976d2;
}

.color-swatch.active {
  border-color: #1976d2;
  border-width: 3px;
  transform: scale(1.05);
}

.color-swatch.active::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
}

.v-list-item--active {
  background-color: rgba(25, 118, 210, 0.1) !important;
}

.v-expansion-panels {
  margin-bottom: 1rem;
}
</style>