import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNailStore = defineStore('nail', () => {
  // Multiple canvases - each canvas has left and right hands
  const canvases = ref({
    1: {
      leftHand: Array(5).fill(null).map(() => ({ baseColor: null, pattern: null, decorations: [] })),
      rightHand: Array(5).fill(null).map(() => ({ baseColor: null, pattern: null, decorations: [] }))
    }
  })
  
  const activeCanvasId = ref(1)
  
  // Current active hands (computed from active canvas)
  const leftHand = computed(() => canvases.value[activeCanvasId.value]?.leftHand || [])
  const rightHand = computed(() => canvases.value[activeCanvasId.value]?.rightHand || [])
  
  // Currently selected design elements
  const selectedCategory = ref('colors')
  const selectedDesign = ref(null)
  const patternColor = ref('#ffffff')
  const decorationColor = ref('#ffffff')
  
  // Archive of saved designs
  const archive = ref([])
  
  // Design categories
  const designCategories = computed(() => ({
    colors: {
      solids: ['#ff69b4', '#ffb6c1', '#ff1493', '#dc143c', '#b22222', '#8b0000', '#ffa500', '#ffd700', '#ffff00', '#adff2f', '#00ff00', '#00fa9a', '#00ffff', '#1e90ff', '#0000ff', '#8a2be2', '#9400d3', '#ff00ff', '#000000', '#696969', '#ffffff'],
      pastels: ['#ffd1dc', '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#c9c9ff', '#e1baff'],
      brights: ['#ff0080', '#ff8000', '#ffff00', '#80ff00', '#00ff80', '#0080ff', '#8000ff', '#ff0040']
    },
    patterns: {
      stripes: ['vertical', 'horizontal', 'diagonal'],
      dots: ['polka', 'confetti', 'gradient-dots'],
      florals: ['roses', 'daisies', 'cherry-blossoms', 'abstract-flowers', 'scatter'],
      artistic: ['swirls', 'petals', 'abstract', 'crossing-lines', 'four-ovals', 'eight-petals']
    },
    seasonal: {
      summer: ['tropical', 'beach', 'sunset'],
      winter: ['snowflake', 'ice', 'winter-blue'],
      holidays: ['christmas', 'halloween', 'valentine']
    },
    decorations: {
      gems: ['diamond', 'ruby', 'emerald', 'sapphire', 'crystal'],
      pearls: ['white-pearl', 'cream-pearl', 'colored-pearl'],
      studs: ['gold-stud', 'silver-stud', 'rhinestone']
    }
  }))
  
  // Add new canvas
  const addCanvas = (canvasId) => {
    canvases.value[canvasId] = {
      leftHand: Array(5).fill(null).map(() => ({ baseColor: null, pattern: null, decorations: [] })),
      rightHand: Array(5).fill(null).map(() => ({ baseColor: null, pattern: null, decorations: [] }))
    }
  }
  
  // Set active canvas
  const setActiveCanvas = (canvasId) => {
    if (!canvases.value[canvasId]) {
      addCanvas(canvasId)
    }
    activeCanvasId.value = canvasId
  }
  
  // Apply design to specific nail
  const applyToNail = (hand, nailIndex, designType, design, canvasId = null) => {
    const targetCanvasId = canvasId || activeCanvasId.value
    if (!canvases.value[targetCanvasId]) {
      addCanvas(targetCanvasId)
    }
    
    const targetHand = hand === 'left' ? 
      canvases.value[targetCanvasId].leftHand : 
      canvases.value[targetCanvasId].rightHand
    
    if (designType === 'colors') {
      targetHand[nailIndex].baseColor = design
    } else if (designType === 'patterns') {
      targetHand[nailIndex].pattern = design
      targetHand[nailIndex].patternColor = patternColor.value
    } else if (designType === 'seasonal') {
      // Apply seasonal themes with actual designs
      const seasonalDesigns = {
        'tropical': { baseColor: '#ff6347', pattern: 'polka', patternColor: '#ffff00' },
        'beach': { baseColor: '#87ceeb', pattern: 'horizontal', patternColor: '#ffffff' },
        'sunset': { baseColor: '#ff4500', pattern: 'diagonal', patternColor: '#ffd700' },
        'snowflake': { baseColor: '#e6f3ff', pattern: 'polka', patternColor: '#ffffff' },
        'ice': { baseColor: '#b0e0e6', pattern: 'vertical', patternColor: '#ffffff' },
        'winter-blue': { baseColor: '#4169e1', pattern: 'diagonal', patternColor: '#e0f6ff' },
        'christmas': { baseColor: '#dc143c', pattern: 'polka', patternColor: '#228b22' },
        'halloween': { baseColor: '#ff8c00', pattern: 'vertical', patternColor: '#000000' },
        'valentine': { baseColor: '#ff1493', pattern: 'polka', patternColor: '#ffffff' }
      }
      
      const seasonalDesign = seasonalDesigns[design]
      if (seasonalDesign) {
        targetHand[nailIndex].baseColor = seasonalDesign.baseColor
        targetHand[nailIndex].pattern = seasonalDesign.pattern
        targetHand[nailIndex].patternColor = seasonalDesign.patternColor
        
        // Add seasonal decorations
        if (design === 'snowflake' || design === 'ice') {
          targetHand[nailIndex].decorations.push({ type: 'crystal', color: '#ffffff' })
        } else if (design === 'christmas') {
          targetHand[nailIndex].decorations.push({ type: 'gold-stud', color: '#ffd700' })
        } else if (design === 'valentine') {
          targetHand[nailIndex].decorations.push({ type: 'white-pearl', color: '#ffb6c1' })
        }
      }
    } else if (designType === 'decorations') {
      const decorationWithColor = {
        type: design,
        color: decorationColor.value
      }
      targetHand[nailIndex].decorations.push(decorationWithColor)
    }
  }
  
  // Apply design to all nails
  const applyToAll = (designType, design, canvasId = null) => {
    const targetCanvasId = canvasId || activeCanvasId.value
    for (let i = 0; i < 5; i++) {
      applyToNail('left', i, designType, design, targetCanvasId)
      applyToNail('right', i, designType, design, targetCanvasId)
    }
  }
  
  // Apply design to one hand
  const applyToHand = (hand, designType, design, canvasId = null) => {
    const targetCanvasId = canvasId || activeCanvasId.value
    for (let i = 0; i < 5; i++) {
      applyToNail(hand, i, designType, design, targetCanvasId)
    }
  }
  
  // Reset hands
  const resetHands = (canvasId = null) => {
    const targetCanvasId = canvasId || activeCanvasId.value
    if (!canvases.value[targetCanvasId]) {
      addCanvas(targetCanvasId)
    } else {
      canvases.value[targetCanvasId].leftHand = Array(5).fill(null).map(() => ({ baseColor: null, pattern: null, decorations: [] }))
      canvases.value[targetCanvasId].rightHand = Array(5).fill(null).map(() => ({ baseColor: null, pattern: null, decorations: [] }))
    }
  }
  
  // Save current design to archive
  const saveToArchive = (canvasId = null) => {
    const targetCanvasId = canvasId || activeCanvasId.value
    const targetCanvas = canvases.value[targetCanvasId]
    
    if (!targetCanvas) return
    
    const design = {
      id: Date.now().toString(),
      timestamp: new Date(),
      leftHand: JSON.parse(JSON.stringify(targetCanvas.leftHand)),
      rightHand: JSON.parse(JSON.stringify(targetCanvas.rightHand))
    }
    
    archive.value.unshift(design)
    localStorage.setItem('nailtastic-archive', JSON.stringify(archive.value))
  }
  
  // Load archive from localStorage
  const loadArchive = () => {
    const saved = localStorage.getItem('nailtastic-archive')
    if (saved) {
      archive.value = JSON.parse(saved)
    }
  }
  
  // Copy design from archive
  const copyFromArchive = (designId, canvasId = null) => {
    const design = archive.value.find(d => d.id === designId)
    const targetCanvasId = canvasId || activeCanvasId.value
    
    if (design) {
      if (!canvases.value[targetCanvasId]) {
        addCanvas(targetCanvasId)
      }
      canvases.value[targetCanvasId].leftHand = JSON.parse(JSON.stringify(design.leftHand))
      canvases.value[targetCanvasId].rightHand = JSON.parse(JSON.stringify(design.rightHand))
    }
  }
  
  return {
    leftHand,
    rightHand,
    canvases,
    activeCanvasId,
    selectedCategory,
    selectedDesign,
    patternColor,
    decorationColor,
    archive,
    designCategories,
    addCanvas,
    setActiveCanvas,
    applyToNail,
    applyToAll,
    applyToHand,
    resetHands,
    saveToArchive,
    loadArchive,
    copyFromArchive
  }
})