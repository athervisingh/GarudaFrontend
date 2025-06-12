export class BasicInfo {
  private _projectName: string
  private _linkageProject: string = 'NA'
  private _ssoUserId: string
  private _systemTimestamp: string
  private _auxData: Record<string, any> = {}
  private _category: string = 'Garuda'
  private _geoentitySourceId: string = ''

  constructor(projectName: string, ssoUserId: string) {
    this._projectName = projectName
    this._ssoUserId = ssoUserId
    this._systemTimestamp = new Date().toISOString()
  }

  get projectName(): string {
    return this._projectName
  }

  get linkageProject(): string {
    return this._linkageProject
  }

  get ssoUserId(): string {
    return this._ssoUserId
  }

  get systemTimestamp(): string {
    return this._systemTimestamp
  }

  get auxData(): Record<string, any> {
    return this._auxData
  }

  get category(): string {
    return this._category
  }

  get geoentitySourceId(): string {
    return this._geoentitySourceId
  }

  set projectName(name: string) {
    this._projectName = name
  }

  set linkageProject(project: string) {
    this._linkageProject = project
  }

  set category(cat: string) {
    this._category = cat
  }

  set geoentitySourceId(id: string) {
    this._geoentitySourceId = id
  }

  setAuxData(data: Record<string, any>) {
    this._auxData = { ...data }
  }

  addAuxField(key: string, value: any) {
    this._auxData[key] = value
  }

  toJSON(): object {
    return {
      projectName: this._projectName,
      linkageProject: this._linkageProject,
      ssoUserId: this._ssoUserId,
      systemTimestamp: this._systemTimestamp,
      auxData: this._auxData,
      geoentitySourceId: this._geoentitySourceId,
      category: this._category
    }
  }
}
