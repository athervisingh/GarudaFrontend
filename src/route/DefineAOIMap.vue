<template>
  <div class="relative w-full h-screen bg-gray-900 overflow-hidden">
    <!-- Map Container -->
    <div ref="mapContainer" class="absolute inset-0">
      <!-- Bottom Submit Bar -->
      <div class="absolute bottom-7 left-0 right-0 z-30">
        <div class="bg-slate-800 shadow-lg border-t border-slate-600">
          <div class="px-6 py-4 flex justify-center">
            <!-- Simple Green Submit Button -->
            <button
              @click="handleSubmit"
              :disabled="(drawSource?.getFeatures().length || 0) === 0"
              class="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-semibold shadow"
            >
              Submit AOI{{
                (drawSource?.getFeatures().length || 0) > 1 ? "s" : ""
              }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Drawing Controls Panel -->
    <div class="absolute top-28 right-4 z-40">
      <div
        class="bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-2xl border border-white/20"
      >
        <div class="space-y-2 space-x-2">
          <!-- Draw Button -->
          <button
            @click="openPopup"
            :disabled="isDrawing"
            class="group relative w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            title="Draw AOI"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 mx-auto"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M17.414 2.586a2 2 0 010 2.828l-1.121 1.121-2.828-2.828 1.121-1.121a2 2 0 012.828 0zM2 13.586V17h3.414l9.9-9.9-2.828-2.828L2 13.586z"
              />
        </svg>
          </button>

          <!-- Clear Button -->
          <button
            @click="clearDrawings"
            :disabled="drawSource?.getFeatures().length === 0"
            class="group relative w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:from-red-600 hover:to-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            title="Clear All"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 mx-auto"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- AOI Counter -->
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
      <DefineAOIPopup
        v-if="showPopup"
        @next="onPopupSubmit"
        @cancel="showPopup = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Draw } from "ol/interaction";
import { Fill, Stroke, Style, Circle as CircleStyle } from "ol/style";
import Polygon from "ol/geom/Polygon";
import controller from "../classes/Controller";
import WKT from "ol/format/WKT";
import { stepTrackerService } from "../services/stepTrackerService"; 
// Import Popup
import DefineAOIPopup from "../components/steps/DefineAOIPopup.vue";

const emit = defineEmits(['next'])

const router = useRouter();

const mapContainer = ref<HTMLDivElement | null>(null);
const showPopup = ref(false);
const featureName = ref("");
const auxData = ref<Record<string, any>>({});
const isDrawing = ref(false);
const isSubmitting = ref(false);

let draw: Draw | null = null;
let map: Map | null = null;
let drawSource: VectorSource;

onMounted(async () => {
  await nextTick();

  drawSource = new VectorSource();
  const drawLayer = new VectorLayer({
    source: drawSource,
    style: new Style({
      fill: new Fill({ color: "rgba(0, 255, 255, 0.15)" }),
      stroke: new Stroke({ color: "#00FFFF", width: 3, lineDash: [8, 4] }),
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color: "#00FFFF" }),
        stroke: new Stroke({ color: "#FFFFFF", width: 2 }),
      }),
    }),
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
    layers: [new TileLayer({ source: new OSM() }), ridamLayer, drawLayer],
    view: new View({
      projection: "EPSG:4326",
      center: [82.0, 22.0],
      zoom: 4,
    }),
  });

  const indiaExtent = [68.0, 6.0, 97.5, 37.0];
  map.getView().fit(indiaExtent, {
    size: map.getSize(),
    duration: 1000,
  });

  draw = new Draw({
    source: drawSource,
    type: "Polygon",
  });

  draw.on("drawend", (event) => {
    const geometry = event.feature.getGeometry() as Polygon;

    const wktFormat = new WKT();
    const wkt = wktFormat.writeGeometry(geometry);

    const name = featureName.value;
    const aux = auxData.value;

    console.log("New AOI (WKT):", name, wkt);
    if (Object.keys(aux).length > 0) {
      console.log("AuxData:", aux);
    }

    // ✅ Service calls
    try {
      controller.setAOI(name, wkt);

      if (Object.keys(aux).length > 0) {
        for (const [key, value] of Object.entries(aux)) {
          controller.setAOIAuxField(key, value);
        }
      }
    } catch (error) {
      console.error("Error while setting AOI:", error);
    }

    map?.removeInteraction(draw!);
    isDrawing.value = false;
  });
});

function openPopup() {
  showPopup.value = true;
}

function onPopupSubmit(data: {
  featureName: string;
  auxData: Record<string, any>;
}) {
  featureName.value = data.featureName;
  auxData.value = data.auxData;
  showPopup.value = false;

  if (map && draw) {
    map.addInteraction(draw);
    isDrawing.value = true;
  }
}

function clearDrawings() {
  if (drawSource) {
    drawSource.clear();
  }
  if (map && draw) {
    map.removeInteraction(draw);
  }
  isDrawing.value = false;
}

async function handleSubmit() {
  const features = drawSource.getFeatures();

  if (features.length === 0) {
    alert("⚠️ Please draw at least one AOI before submitting.");
    return;
  }

  isSubmitting.value = true;

  try {
    await controller.submitAOIsAndGetAOIIDs();

    stepTrackerService.completeStep(1); // ✅ Directly mark step as completed

    router.push("/add-project"); // ✅ clean redirect, no query
  } catch (error) {
    console.error("Error submitting AOIs:", error);
    alert("❌ Failed to submit AOIs. Check console for details.");
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
/* Custom OpenLayers zoom controls positioning */
::v-deep .ol-zoom {
  bottom: 20px !important;
  left: 10px !important;
  top: auto !important;
  right: auto !important;
  position: absolute !important;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
}

::v-deep .ol-zoom button {
  background: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  border: none !important;
  transition: all 0.2s ease !important;
}

::v-deep .ol-zoom button:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: scale(1.05) !important;
}

/* Custom attribution styling */
::v-deep .ol-attribution {
  background: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(10px) !important;
  border-radius: 8px !important;
  margin: 10px !important;
}

::v-deep .ol-attribution ul {
  color: rgba(255, 255, 255, 0.8) !important;
}

/* Scrollbar styling for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
