import type { BasicInfo } from "../models/BasicInfo";
import type { AOI } from "../models/AOI";
import { ProjectBuilder } from "../builder/ProjectBuilder";

export class Project {
  basicInfo?: BasicInfo;
  aois: AOI[];
  private projectUsers: { userId: string; userName: string; role: string }[] =
    [];

  constructor(builder: ProjectBuilder) {
    this.basicInfo = builder._basicInfo;
    this.aois = builder._aois;
  }
  setProjectUsers(userId: string, userName: string, role: string): void {
    this.projectUsers.push({ userId, userName, role });
  }
  getProjectID(): string {
    return this.basicInfo?.getProjectID() || "";
  }
  getProjectName(): string {
    return this.basicInfo?.getProjectName() || "";
  }
  toJSON(): Record<string, any> {
    return {
      basicInfo: this.basicInfo?.toJSON(),
      aois: this.aois.map((aoi) => aoi.toJSON()),
    };
  }
}
