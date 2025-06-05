<!-- components/DrawToolbar.vue -->
<template>
  <div class="draw-toolbar">
    <button @click="startDrawing" class="draw-btn">Draw Polygon</button>
    <button @click="clearDrawings" class="draw-btn danger">Clear</button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  map: Object,
  drawnItems: Object
})

let polygonDrawer = null

const startDrawing = () => {
  if (!props.map || !props.drawnItems) return

  // If already drawing, stop
  if (polygonDrawer) {
    polygonDrawer.disable()
    polygonDrawer = null
    return
  }

  polygonDrawer = new L.Draw.Polygon(props.map, {
    allowIntersection: false,
    showArea: true,
    drawError: {
      color: '#e74c3c',
      message: 'Oops! invalid polygon!'
    },
    shapeOptions: {
      color: '#007BFF',
      weight: 3
    }
  })

  polygonDrawer.enable()

  props.map.once(L.Draw.Event.CREATED, (e) => {
    const layer = e.layer
    props.drawnItems.addLayer(layer)
    polygonDrawer = null
  })
}

const clearDrawings = () => {
  props.drawnItems?.clearLayers()
}
</script>

<style scoped>
.draw-toolbar {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.draw-btn {
  background: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
}

.draw-btn.danger {
  background: #e74c3c;
}
</style>
