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
          <!-- Draw Button -->
          <button
            @click="startDrawing"
            :disabled="isDrawing"
            class="w-10 h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg transition-all flex items-center justify-center"
            title="Draw AOI"
          >
            <Pencil class="w-5 h-5" />
          </button>

          <!-- Delete Button -->
          <button
            @click="deleteSelectedOrAll"
            :disabled="aois.length === 0"
            class="w-10 h-10 bg-red-600 mb-2 hover:bg-red-700 text-white rounded-xl shadow-lg transition-all flex items-center justify-center"
            title="Delete Selected / All"
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
import { Draw, Modify, Select } from "ol/interaction";
import { Fill, Stroke, Style, Text } from "ol/style";
import Polygon from "ol/geom/Polygon";
import Feature from "ol/Feature";
import WKT from "ol/format/WKT";

import DefineAOIPopup from "./AOIDetails/DefineAOIPopup.vue";
import controller from "../../../../classes/Controller";
import navigationService from "../../../../services/navigationService";
import { stepTrackerService } from "../../../../services/stepTrackerService";

import { Pencil, Trash2 } from "lucide-vue-next";

type AOIEntry = {
  feature: Feature<Polygon>;
  wkt: string;
  name: string;
  aux: Record<string, any>;
};

const mapContainer = ref<HTMLDivElement | null>(null);
const showPopup = ref(false);
const isDrawing = ref(false);
const isSubmitting = ref(false);
const selectedFeature = ref<Feature<Polygon> | null>(null);
const aois = ref<AOIEntry[]>([]);

const drawSource = new VectorSource<Feature<Polygon>>();
let drawLayer: VectorLayer<VectorSource<Feature<Polygon>>>;
let draw: Draw;
let map: Map;
let modify: Modify;
let select: Select;
let latestFeature = ref<Feature<Polygon> | null>(null);
let latestGeometry = ref<string | null>(null);

onMounted(async () => {
  await nextTick();

  drawLayer = new VectorLayer({
    source: drawSource,
    style: (feature) =>
      new Style({
        fill: new Fill({ color: "rgba(0, 255, 255, 0.15)" }),
        stroke: new Stroke({ color: "#00FFFF", width: 3, lineDash: [8, 4] }),
        text: new Text({
          text: feature.get("featureName") || "AOI",
          font: "bold 12px sans-serif",
          fill: new Fill({ color: "#fff" }),
          stroke: new Stroke({ color: "#000", width: 3 }),
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
    layers: [new TileLayer({ source: new OSM({ attributions: '',}) }), ridamLayer, drawLayer],
    view: new View({ projection: "EPSG:4326", center: [82.0, 22.0], zoom: 4 }),
  });

  map.getView().fit([68.0, 6.0, 97.5, 37.0], {
    size: map.getSize(),
    duration: 1000,
  });

  select = new Select();
  modify = new Modify({ features: select.getFeatures() });
  map.addInteraction(select);
  map.addInteraction(modify);

  select.on("select", (e) => {
    selectedFeature.value = e.selected[0] as Feature<Polygon> || null;
  });
});

function startDrawing() {
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

function onPopupSubmit(data: { featureName: string; auxData: Record<string, any> }) {
  showPopup.value = false;

  if (latestFeature.value && latestGeometry.value) {
    latestFeature.value.setProperties({
      featureName: data.featureName,
      auxData: data.auxData,
    });

    aois.value.push({
      feature: latestFeature.value,
      wkt: latestGeometry.value,
      name: data.featureName,
      aux: data.auxData,
    });
  }

  latestFeature.value = null;
  latestGeometry.value = null;
}

function deleteSelectedOrAll() {
  if (selectedFeature.value instanceof Feature) {
    drawSource.removeFeature(selectedFeature.value as Feature<Polygon>);
    aois.value = aois.value.filter((aoi) => aoi.feature !== selectedFeature.value);
    selectedFeature.value = null;
  } else {
    drawSource.clear();
    aois.value = [];
  }
}

async function handleSubmit() {
  if (aois.value.length === 0) {
    alert("⚠️ Please draw at least one AOI before submitting.");
    return;
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
</style>
