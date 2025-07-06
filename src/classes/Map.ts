// src/classes/Map.ts
import MapOL from 'ol/Map'
// import View from 'ol/View'
import Draw from 'ol/interaction/Draw'
import { Vector as VectorLayer } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import { Polygon } from 'ol/geom'
// import { Fill, Stroke, Style } from 'ol/style'
import WKT from 'ol/format/WKT'

export class Map {
  private map!: MapOL
  private drawLayer!: VectorLayer<VectorSource>
  private drawSource!: VectorSource
  private draw!: Draw | null

  public featureName: string = ''
  public auxData: Record<string, any> = {}
  public isPopupOpen: boolean = false
  public wkt: string = ''
  public isDraw: boolean = false

  init(map: MapOL, drawLayer: VectorLayer<VectorSource>, drawSource: VectorSource) {
    this.map = map
    this.drawLayer = drawLayer
    this.drawSource = drawSource
  }

  openPopup() { this.isPopupOpen = true }
  removePopup() { this.isPopupOpen = false }

  clearAOI() {
    this.drawSource.clear()
    this.isDraw = false
  }
  getDrawLayer() {
    return this.drawLayer
  }

  enableDraw(onDrawEnd: (wkt: string) => void) {
    this.draw = new Draw({ source: this.drawSource, type: 'Polygon' })
    this.draw.on('drawend', (event) => {
      const geometry = event.feature.getGeometry() as Polygon
      const format = new WKT()
      this.wkt = format.writeGeometry(geometry)
      this.isDraw = true
      onDrawEnd(this.wkt)
    })
    this.map.addInteraction(this.draw)
  }

  disableDraw() {
    if (this.draw) {
      this.map.removeInteraction(this.draw)
      this.draw = null
    }
    this.isDraw = false
  }

  setCenter(center: [number, number]) {
    this.map.getView().setCenter(center)
  }

  setZoom(zoom: number) {
    this.map.getView().setZoom(zoom)
  }

  getMap() {
    return this.map
  }
}
