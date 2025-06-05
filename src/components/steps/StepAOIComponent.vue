<template>
  <div class="relative w-full h-screen">
    <!-- Map Container -->
    <div ref="mapContainer" class="w-full h-full"></div>

    <!-- Submit Button -->
    <button
      @click="handleSubmit"
      class="absolute bottom-6 right-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 z-10"
    >
      Save & Continue
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import ImageLayer from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'
import OSM from 'ol/source/OSM'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Draw } from 'ol/interaction'
import { Fill, Stroke, Style, Circle as CircleStyle } from 'ol/style'
import { v4 as uuidv4 } from 'uuid'
import Polygon from 'ol/geom/Polygon'
import { TempStore } from '../../utils/TempStore'

const emit = defineEmits(['completed']) // for stepper navigation
const mapContainer = ref<HTMLDivElement | null>(null)
const drawnAOIs = ref<any[]>([]) // Track drawn AOIs

onMounted(async () => {
  await nextTick()

  const drawSource = new VectorSource()
  const drawLayer = new VectorLayer({
    source: drawSource,
    style: new Style({
      fill: new Fill({ color: 'rgba(255, 0, 0, 0.2)' }),
      stroke: new Stroke({ color: '#ff0000', width: 2 }),
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({ color: '#ff0000' })
      })
    })
  })

  const ridamLayer = new ImageLayer({
    source: new ImageWMS({
      url: 'https://vedas.sac.gov.in/ridam_server3/wms/',
      params: {
        SERVICE: 'WMS',
        VERSION: '1.3.0',
        REQUEST: 'GetMap',
        FORMAT: 'image/png',
        TRANSPARENT: true,
        name: 'RIDAM_RGB',
        layers: 'T0S0M1',
        CRS: 'EPSG:4326',
        PROJECTION: 'EPSG:4326',
        STYLES: '',
        ARGS:
          'r_dataset_id:T0S1P1;g_dataset_id:T0S1P1;b_dataset_id:T0S1P1;' +
          'r_from_time:20250601;r_to_time:20250605;' +
          'g_from_time:20250601;g_to_time:20250605;' +
          'b_from_time:20250601;b_to_time:20250605;' +
          'r_index:3;g_index:2;b_index:1;' +
          'r_max:0.35;g_max:0.3;b_max:0.3;' +
          'r_min:0.001;g_min:0.001;b_min:0.001'
      },
      ratio: 1,
      serverType: 'geoserver',
      crossOrigin: 'anonymous'
    }),
    opacity: 1
  })

  const map = new Map({
    target: mapContainer.value!,
    layers: [
      new TileLayer({ source: new OSM() }),
      ridamLayer,
      drawLayer
    ],
    view: new View({
      projection: 'EPSG:4326',
      center: [82.0, 22.0],
      zoom: 4
    })
  })

  // Fit to India's bounding box
  const indiaExtent = [68.0, 6.0, 97.5, 37.0]
  map.getView().fit(indiaExtent, {
    size: map.getSize(),
    duration: 1000
  })

  const draw = new Draw({
    source: drawSource,
    type: 'Polygon'
  })

  draw.on('drawend', (event) => {
    const geometry = event.feature.getGeometry() as Polygon
    const coordinates = geometry.getCoordinates()[0]

    const aoiId = uuidv4()
    const newAOI = {
      aoiId,
      name: aoiId,
      coordinate: coordinates,
      threshold: 10,
      createdAt: new Date().toISOString()
    }

    drawnAOIs.value.push(newAOI)
  })

  map.addInteraction(draw)
})

// === Submit Handler ===
function handleSubmit() {
  const project = TempStore.getProject()
  if (!project.aois) project.aois = []

  project.aois.push(...drawnAOIs.value)
  emit('completed') // go to next step
}
</script>

<style scoped>
/* Optional custom styles */
</style>
