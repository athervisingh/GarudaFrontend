import { BasicInfo } from "../models/BasicInfo";
import { AOI } from "../models/AOI";
import { Project } from "../models/Poject";

export class ProjectBuilder {
  _basicInfo?: BasicInfo;
  _aois: AOI[] = [];

  setBasicInfo(projectName: string, ssoUserId: string): this {
    this._basicInfo = new BasicInfo(projectName, ssoUserId);
    return this;
  }

  addAuxField(key: string, value: any): this {
    if (this._basicInfo) {
      this._basicInfo.addAuxField(key, value);
    }
    return this;
  }

  // 👇 Add new AOI to list instead of overwriting
  addAOI(geoentitySourceId: string, featureName: string, geom: string): this {
    const aoi = new AOI(geoentitySourceId, featureName, geom);
    this._aois.push(aoi);
    return this;
  }

  addAOIAuxFieldToLastAOI(key: string, value: any): this {
    if (this._aois.length > 0) {
      this._aois[this._aois.length - 1].addAuxField(key, value);
    }
    return this;
  }

  build(): Project {
    return new Project(this);
  }
}
