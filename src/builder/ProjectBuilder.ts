import { BasicInfo } from "../models/BasicInfo";
import { AOI } from "../models/AOI";
import { Project } from "../models/Poject";

export class ProjectBuilder {
  _basicInfo?: BasicInfo;
  _aois: AOI[] = [];

  addBasicInfo(projectName: string, ssoUserId: string): this {
    this._basicInfo = new BasicInfo(projectName, ssoUserId);
    return this;
  }

  addProjectAuxField(key: string, value: any): this {
    if (this._basicInfo) {
      this._basicInfo.setAuxField(key, value);
    }
    return this;
  }
  addProjectID(projectId: string): this {
    if (this._basicInfo) {
      this._basicInfo.setProjectID(projectId);
    }
    return this;
  }
  getBasicInfo(): object {
    if (!this._basicInfo) {
      throw new Error("Basic info not set.");
    }
    return this._basicInfo.toJSON();
  }
  getProjectName(): string {
    if (!this._basicInfo) {
      throw new Error("Basic info not set. Call addBasicInfo() first.");
    }
    return this._basicInfo.getProjectName();
  }
  getProjectID(): string {
    if (!this._basicInfo) {
      throw new Error("Basic info not set. Call addBasicInfo() first.");
    }
    return this._basicInfo.getProjectID();
  }

  addAOI(featureName: string, geom: string): this {
    if (!this._basicInfo) {
      throw new Error("Basic info not set. Call addBasicInfo() first.");
    }
    const geoentitySourceId = this._basicInfo.getProjectID();
    const aoi = new AOI(geoentitySourceId, featureName, geom);
    this._aois.push(aoi);
    return this;
  }

  addAOIAuxFieldToLastAOI(key: string, value: any): this {
    if (this._aois.length > 0) {
      this._aois[this._aois.length - 1].setAuxField(key, value);
    }
    return this;
  }
  getAOIs(): AOI[] {
    if (this._aois.length === 0) {
      throw new Error("No AOIs added.");
    }
    return this._aois;
  }

  addAOIIds(aoiIds: string[]): this {
    if (aoiIds.length !== this._aois.length) {
      throw new Error("AOI ID count does not match AOI count.");
    }

    this._aois.forEach((aoi, index) => {
      aoi.setAOIID(aoiIds[index]);
    });

    return this;
  }
  build(): Project {
    return new Project(this);
  }
}
