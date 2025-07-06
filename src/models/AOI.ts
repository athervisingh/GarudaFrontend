export class AOI {
  private _aoiID: string = ''
  private _projectID: string
  private _featureName: string
  private _geom: string
  private _auxData: Record<string, any> = {}

  constructor(projectID: string, featureName: string, geom: string) {
    this._projectID = projectID
    this._featureName = featureName
    this._geom = geom
  }

  get aoiID(): string {
    return this._aoiID
  }

  get projectID(): string {
    return this._projectID
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

  setAOIID(id: string) {
    this._aoiID = id
  }

  set projectID(sourceId: string) {
    this._projectID = sourceId
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

  setAuxField(key: string, value: any) {
    this._auxData[key] = value
  }

  toJSON(): object {
    return {
      aoiId: this._aoiID,
      projectID: this._projectID,
      featureName: this._featureName,
      geom: this._geom,
      auxData: this._auxData
    }
  }
}
