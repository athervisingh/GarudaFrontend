import type { BasicInfo } from './BasicInfo'
import type { AOI } from './AOI'
import { ProjectBuilder } from '../builder/ProjectBuilder'

export class Project {
  basicInfo?: BasicInfo
  aois: AOI[]

  constructor(builder: ProjectBuilder) {
    this.basicInfo = builder._basicInfo
    this.aois = builder._aois
  }

  toJSON(): Record<string, any> {
    return {
      basicInfo: this.basicInfo?.toJSON(),
      aois: this.aois.map(aoi => aoi.toJSON())
    }
  }
}
