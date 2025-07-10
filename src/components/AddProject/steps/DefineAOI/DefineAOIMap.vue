<template>
  <div class="relative w-full h-screen bg-gray-900 overflow-hidden">
    <!-- Map Container -->
    <div ref="mapContainer" class="absolute inset-0">
      <!-- Bottom Submit Bar -->
      <div class="absolute bottom-7 left-0 right-0 z-30">
        <div class="bg-slate-800 shadow-lg border-t border-slate-600">
          <div class="px-6 py-4 flex justify-center">
            <button
              @click="handleSubmit"
              :disabled="aois.length === 0"
              class="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-semibold shadow"
            >
              Submit AOI{{ aois.length > 1 ? "s" : "" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Drawing Controls -->
    <div class="absolute top-28 right-4 z-40">
      <div class="bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-2xl border border-white/20">
        <div class="space-y-2 space-x-2 flex items-center">
          <button
            @click="startDrawing"
            :disabled="isDrawing"
            class="w-10 h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg transition-all flex items-center justify-center"
            title="Draw AOI"
          >
            <Pencil class="w-5 h-5" />
          </button>
          <button
            @click="clearAllAOIs"
            :disabled="aois.length === 0"
            class="w-10 h-10 bg-red-600 mb-2 hover:bg-red-700 text-white rounded-xl shadow-lg transition-all flex items-center justify-center"
            title="Delete All"
          >
            <Trash2 class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- AOI Banner -->
    <div class="absolute top-10 w-screen h-[7vh] bg-[#314157] z-40">
      <div class="flex items-center justify-center h-full">
        <h1 class="text-white text-2xl font-bold">Define AOI</h1>
      </div>
    </div>

    <!-- AOI Details Popup -->
    <div
      v-if="showPopup"
      class="absolute inset-0 flex justify-center items-center z-[1000] bg-black/60 backdrop-blur-sm"
    >
      <DefineAOIPopup @next="onPopupSubmit" @cancel="showPopup = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Draw, Modify } from "ol/interaction";
import { Fill, Stroke, Style, Text } from "ol/style";
import Polygon from "ol/geom/Polygon";
import Feature from "ol/Feature";
import WKT from "ol/format/WKT";
import Overlay from "ol/Overlay";
import DefineAOIPopup from "./AOIDetails/DefineAOIPopup.vue";
import controller from "../../../../classes/Controller";
import navigationService from "../../../../services/navigationService";
import { stepTrackerService } from "../../../../services/stepTrackerService";
import { Pencil, Trash2 } from "lucide-vue-next";

const mapContainer = ref<HTMLDivElement | null>(null);
const showPopup = ref(false);
const isDrawing = ref(false);
const isSubmitting = ref(false);
const aois = ref<AOIEntry[]>([]);
const editingFeature = ref<Feature<Polygon> | null>(null);

const drawSource = new VectorSource<Feature<Polygon>>();
let drawLayer: VectorLayer<VectorSource<Feature<Polygon>>>;
let draw: Draw;
let map: Map;
let modify: Modify;
let latestFeature = ref<Feature<Polygon> | null>(null);
let latestGeometry = ref<string | null>(null);
const aoiOverlays: Overlay[] = [];

interface AOIEntry {
  feature: Feature<Polygon>;
  wkt: string;
  name: string;
  aux: Record<string, any>;
}

onMounted(async () => {
  await nextTick();

  drawLayer = new VectorLayer({
    source: drawSource,
    style: (feature) => {
      const isEditing = (feature as Feature<Polygon>) === editingFeature.value;
      return new Style({
        fill: new Fill({ color: isEditing ? "rgba(255, 165, 0, 0.3)" : "rgba(0, 255, 255, 0.15)" }),
        stroke: new Stroke({ color: isEditing ? "orange" : "#00FFFF", width: 3, lineDash: [8, 4] }),
        text: new Text({
          text: feature.get("featureName") || "AOI",
          font: "bold 12px sans-serif",
          fill: new Fill({ color: "#fff" }),
          stroke: new Stroke({ color: "#000", width: 3 }),
        }),
      });
    },
  });

  const ridamLayer = new ImageLayer({
    source: new ImageWMS({
      url: "https://vedas.sac.gov.in/ridam_server3/wms/",
      params: {
        SERVICE: "WMS",
        VERSION: "1.3.0",
        REQUEST: "GetMap",
        FORMAT: "image/png",
        TRANSPARENT: true,
        layers: "T0S0M1",
        STYLES: "",
        CRS: "EPSG:4326",
        ARGS:
          "r_dataset_id:T0S1P1;g_dataset_id:T0S1P1;b_dataset_id:T0S1P1;" +
          "r_from_time:20250601;r_to_time:20250605;" +
          "g_from_time:20250601;g_to_time:20250605;" +
          "b_from_time:20250601;b_to_time:20250605;" +
          "r_index:3;g_index:2;b_index:1;" +
          "r_max:0.35;g_max:0.3;b_max:0.3;" +
          "r_min:0.001;g_min:0.001;b_min:0.001",
      },
      ratio: 1,
      serverType: "geoserver",
      crossOrigin: "anonymous",
    }),
    opacity: 1,
  });

  map = new Map({
    target: mapContainer.value!,
    layers: [new TileLayer({ source: new OSM({ attributions: '' }) }), ridamLayer, drawLayer],
    view: new View({ projection: "EPSG:4326", center: [82.0, 22.0], zoom: 4 }),
  });

  map.getView().fit([68.0, 6.0, 97.5, 37.0], {
    size: map.getSize(),
    duration: 1000,
  });

  modify = new Modify({ source: drawSource });
  modify.setActive(false);
  map.addInteraction(modify);

  // Add map click listener to exit edit mode when clicking outside polygon
  map.on('click', (event) => {
    if (editingFeature.value) {
      const clickedFeature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature as Feature<Polygon> | undefined);
      
      // If clicked outside of any polygon or on a different polygon, exit edit mode
      if (!clickedFeature || clickedFeature !== editingFeature.value) {
        exitEditMode();
      }
    }
  });
});

function startDrawing() {
  // Exit edit mode if currently editing
  if (editingFeature.value) {
    exitEditMode();
  }

  draw = new Draw({ source: drawSource, type: "Polygon" });
  map.addInteraction(draw);
  isDrawing.value = true;

  draw.on("drawend", (event) => {
    const geometry = event.feature.getGeometry() as Polygon;
    const wkt = new WKT().writeGeometry(geometry);
    latestFeature.value = event.feature as Feature<Polygon>;
    latestGeometry.value = wkt;
    map.removeInteraction(draw);
    isDrawing.value = false;
    showPopup.value = true;
  });
}

function enterEditMode(aoi: AOIEntry) {
  // Exit current edit mode if any
  if (editingFeature.value) {
    exitEditMode();
  }

  // Set the new feature as editing
  editingFeature.value = aoi.feature;
  
  // Create a temporary source with only the selected feature
  const tempSource = new VectorSource<Feature<Polygon>>();
  tempSource.addFeature(aoi.feature);
  
  // Remove the old modify interaction
  map.removeInteraction(modify);
  
  // Create new modify interaction with only the selected feature
  modify = new Modify({ source: tempSource });
  modify.setActive(true);
  map.addInteraction(modify);
  
  // Add event listeners to the new modify interaction
  modify.on('modifystart', () => {
    updateOverlayPositions();
  });

  modify.on('modifyend', (event) => {
    if (editingFeature.value) {
      const modifiedFeature = event.features.getArray()[0] as Feature<Polygon>;
      const geometry = modifiedFeature.getGeometry() as Polygon;
      const wkt = new WKT().writeGeometry(geometry);
      
      // Update the AOI entry with new WKT
      const aoiIndex = aois.value.findIndex(aoi => aoi.feature === modifiedFeature);
      if (aoiIndex !== -1) {
        aois.value[aoiIndex].wkt = wkt;
      }
      
      // Update overlay position after modification
      updateOverlayPositions();
    }
  });

  modify.on('modifystart', () => {
    updateOverlayPositions();
  });
  modify.on('modifyend', () => {
    updateOverlayPositions();
  });
  
  // Refresh the layer to update styling
  drawLayer.changed();
}

function exitEditMode() {
  editingFeature.value = null;
  
  // Remove the current modify interaction
  map.removeInteraction(modify);
  
  // Create new modify interaction with the original source (but keep it inactive)
  modify = new Modify({ source: drawSource });
  modify.setActive(false);
  map.addInteraction(modify);
  
  // Refresh the layer to update styling
  drawLayer.changed();
}

function onPopupSubmit(data: { featureName: string; auxData: Record<string, any> }) {
  showPopup.value = false;

  if (latestFeature.value && latestGeometry.value) {
    latestFeature.value.setProperties({ featureName: data.featureName, auxData: data.auxData });

    const aoi: AOIEntry = {
      feature: latestFeature.value as Feature<Polygon>,
      wkt: latestGeometry.value,
      name: data.featureName,
      aux: data.auxData,
    };

    aois.value.push(aoi);
    createAOIOverlay(aoi);
  }

  latestFeature.value = null;
  latestGeometry.value = null;
}

function getRightTopCoordinate(geometry: Polygon): number[] {
  const flatCoords = geometry.getCoordinates()[0];
  // Find the rightmost point
  const rightmost = flatCoords.reduce((rightmost, coord) => coord[0] > rightmost[0] ? coord : rightmost, flatCoords[0]);
  // Find the topmost point (highest latitude)
  const topmost = flatCoords.reduce((topmost, coord) => coord[1] > topmost[1] ? coord : topmost, flatCoords[0]);
  
  // Return the coordinate that's closest to top-right corner
  return flatCoords.reduce((topRight, coord) => {
    const currentDistance = Math.sqrt(Math.pow(coord[0] - rightmost[0], 2) + Math.pow(coord[1] - topmost[1], 2));
    const bestDistance = Math.sqrt(Math.pow(topRight[0] - rightmost[0], 2) + Math.pow(topRight[1] - topmost[1], 2));
    return currentDistance < bestDistance ? coord : topRight;
  }, flatCoords[0]);
}

function updateOverlayPositions() {
  aois.value.forEach((aoi, index) => {
    if (aoiOverlays[index]) {
      const coords = getRightTopCoordinate(aoi.feature.getGeometry() as Polygon);
      aoiOverlays[index].setPosition(coords);
    }
  });
}

function createAOIOverlay(aoi: AOIEntry) {
  const container = document.createElement("div");
  container.className = "aoi-overlay-controls";

  const editBtn = document.createElement("button");
  editBtn.className = "aoi-icon-btn";
  editBtn.style.cursor = "pointer";
  editBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 20h9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  editBtn.onclick = (event) => {
    event.stopPropagation(); // Prevent map click event
    enterEditMode(aoi);
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "aoi-icon-btn";
  deleteBtn.style.cursor = "pointer";
  deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><polyline points="3 6 5 6 21 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="10" y1="11" x2="10" y2="17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="14" y1="11" x2="14" y2="17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  deleteBtn.onclick = (event) => {
    event.stopPropagation(); // Prevent map click event
    
    // Exit edit mode if this feature is being edited
    if (editingFeature.value === aoi.feature) {
      exitEditMode();
    }
    
    drawSource.removeFeature(aoi.feature);
    const aoiIndex = aois.value.findIndex(x => x.feature === aoi.feature);
    aois.value = aois.value.filter((x) => x.feature !== aoi.feature);
    
    // Remove the corresponding overlay
    if (aoiIndex !== -1 && aoiOverlays[aoiIndex]) {
      map.removeOverlay(aoiOverlays[aoiIndex]);
      aoiOverlays.splice(aoiIndex, 1);
    }
  };

  container.appendChild(editBtn);
  container.appendChild(deleteBtn);

  const coords = getRightTopCoordinate(aoi.feature.getGeometry() as Polygon);
  const overlay = new Overlay({ 
    element: container, 
    positioning: "top-left", 
    stopEvent: true,
    offset: [10, -10] // Offset to position it at top-right corner
  });
  overlay.setPosition(coords);
  map.addOverlay(overlay);
  aoiOverlays.push(overlay);
}

function clearAllAOIs() {
  // Exit edit mode if any
  if (editingFeature.value) {
    exitEditMode();
  }
  
  drawSource.clear();
  aois.value = [];
  aoiOverlays.forEach((ov) => map.removeOverlay(ov));
  aoiOverlays.splice(0, aoiOverlays.length); // Clear the array properly
}

async function handleSubmit() {
  if (aois.value.length === 0) return alert("⚠️ Please draw at least one AOI before submitting.");

  // Exit edit mode before submitting
  if (editingFeature.value) {
    exitEditMode();
  }

  isSubmitting.value = true;
  try {
    for (const aoi of aois.value) {
      controller.setAOI(aoi.name, aoi.wkt);
      for (const [key, value] of Object.entries(aoi.aux)) {
        controller.setAOIAuxField(key, value);
      }
    }
    await controller.submitAOIsAndGetAOIIDs();
    stepTrackerService.completeStep(1);
    navigationService.goTo("add-project");
  } catch (error) {
    console.error("❌ Error submitting AOIs:", error);
    alert("❌ Failed to submit AOIs.");
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.ol-attribution {
  display: none !important;
}

.aoi-overlay-controls {
  display: flex;
  gap: 6px;
  background-color: rgba(20, 20, 20, 0.8);
  border-radius: 10px;
  padding: 6px;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  backdrop-filter: blur(4px);
}

.aoi-icon-btn {
  background-color: #1f2937;
  border: 1px solid #374151;
  color: white;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  transition: 0.2s ease;
}

.aoi-icon-btn:hover {
  background-color: #4b5563;
  transform: scale(1.05);
  box-shadow: 0 0 8px cyan;
}
</style>