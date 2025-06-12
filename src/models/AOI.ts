export class AOI {
  private _geoentityId: string = ''
  private _geoentitySourceId: string
  private _featureName: string
  private _geom: string
  private _auxData: Record<string, any> = {}

  constructor(geoentitySourceId: string, featureName: string, geom: string) {
    this._geoentitySourceId = geoentitySourceId
    this._featureName = featureName
    this._geom = geom
  }

  get geoentityId(): string {
    return this._geoentityId
  }

  get geoentitySourceId(): string {
    return this._geoentitySourceId
  }

  get featureName(): string {
    return this._featureName
  }

  get geom(): string {
    return this._geom
  }

  get auxData(): Record<string, any> {
    return this._auxData
  }

  set geoentityId(id: string) {
    this._geoentityId = id
  }

  set geoentitySourceId(sourceId: string) {
    this._geoentitySourceId = sourceId
  }

  set featureName(name: string) {
    this._featureName = name
  }

  set geom(wkt: string) {
    this._geom = wkt
  }

  setAuxData(data: Record<string, any>) {
    this._auxData = { ...data }
  }

  addAuxField(key: string, value: any) {
    this._auxData[key] = value
  }

  toJSON(): object {
    return {
      geoentityId: this._geoentityId,
      geoentitySourceId: this._geoentitySourceId,
      featureName: this._featureName,
      geom: this._geom,
      auxData: this._auxData
    }
  }
}
