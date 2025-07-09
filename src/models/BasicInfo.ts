export class BasicInfo {
  private _projectName: string;
  private _userId: string;
  private _auxData: Record<string, any> = {};
  private _projectID: string = "";

  constructor(projectName: string, userId: string) {
    this._projectName = projectName;
    this._userId = userId;
  }

  setProjectID(id: string) {
    this._projectID = id;
    console.log(`Project ID set to: ${id}`);
  }

  getProjectID(): string {
    return this._projectID;
  }

  getProjectName(): string {
    return this._projectName;
  }

  setAuxField(key: string, value: any) {
    this._auxData[key] = value;
  }

  toJSON(): object {
    return {
      projectName: this._projectName,
      userId: this._userId,
      auxData: this._auxData,
      projectID: this._projectID,
    };
  }
}
