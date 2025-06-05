// models/Project.ts
import { generateProjectId } from '../utils/idGenerator'
import type { AOI } from '../models/AOI'
import type { AOIWatchConfig } from '../models/AOIWatchConfig'
import type { AssignedUsers } from '../models/AssignedUsers'

export class Project {
  projectId: string
  title: string = ''
  createdBy: string = ''
  createdAt: string
  basicInfo: {
    description: string
    location: string
    startDate: string
    endDate: string
  } = {
    description: '',
    location: '',
    startDate: '',
    endDate: ''
  }
  aois: AOI[] = []
  aoiWatchConfig: AOIWatchConfig = {
    ridam: null,
    geoES: null,
    sangrahi: null
  }
  assignUser: AssignedUsers = {}

  constructor(createdBy: string) {
    this.projectId = generateProjectId()
    this.createdBy = createdBy
    this.createdAt = new Date().toISOString()
  }

  setTitle(title: string) {
    this.title = title
  }

  setBasicInfo(info: { description: string; location: string; startDate: string; endDate: string }) {
    this.basicInfo = info
  }

  setAOIs(aois: AOI[]) {
    this.aois = aois
  }

  setAOIWatchConfig(config: AOIWatchConfig) {
    this.aoiWatchConfig = config
  }

  setAssignedUsers(users: AssignedUsers) {
    this.assignUser = users
  }

  toJSON(): object {
    return {
      projectId: this.projectId,
      title: this.title,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      basicInfo: this.basicInfo,
      aois: this.aois,
      aoiWatchConfig: this.aoiWatchConfig,
      assignUser: this.assignUser
    }
  }
}
