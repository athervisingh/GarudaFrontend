import { ProjectBuilder } from '../builder/ProjectBuilder'
import { ProjectApi } from '../api/ProjectApi'
import type { Project } from '../models/Poject'

export class ProjectService {
  private static builder = new ProjectBuilder()

  static setBasicInfo(name: string, ssoUserId: string) {
    this.builder.setBasicInfo(name, ssoUserId)
  }

  static addAuxField(key: string, value: any) {
    this.builder.addAuxField(key, value)
  }

  static async submitBasicInfoAndFetchGeoentitySourceId(): Promise<void> {
    const basicInfo = this.builder._basicInfo
    if (!basicInfo) throw new Error('BasicInfo not set')

    const result = await ProjectApi.sendBasicInfoAndGetGeoentitySourceId(basicInfo)
    basicInfo.geoentitySourceId = result.geoentitySourceId
    // console.log('Received geoentitySourceId:', basicInfo.geoentitySourceId)
  }

 static addAOI(name: string, geom: string) {
    const basicInfo = this.builder._basicInfo
    if (!basicInfo?.geoentitySourceId) {
      throw new Error('GeoentitySourceId is missing. Call submitBasicInfoAndFetchGeoentitySourceId() first.')
    }

    this.builder.addAOI(basicInfo.geoentitySourceId, name, geom)
  }

  static addAOIAuxField(key: string, value: any) {
    this.builder.addAOIAuxFieldToLastAOI(key, value)
  }


  static async submitAOIsToBackend(): Promise<void> {
  const aois = this.builder._aois
  const response = await ProjectApi.sendAOIs(aois)

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to submit AOIs: ${error}`)
  }

  const geoIds = await response.json() 
console.log('Received geoIds:', geoIds)

  for (const { name, geoentityId } of geoIds) {
    const aoi = this.builder._aois.find(a => a.featureName === name)
    if (aoi) {
      aoi.geoentityId = geoentityId
    }
  }
}

  static buildFinalProject(): Project {
    return this.builder.build()
  }

  // static async submitProjectToBackend(): Promise<void> {
  //   const project = this.buildFinalProject()
  //   const response = await ProjectApi.saveProject(project)

  //   if (!response.ok) {
  //     const error = await response.text()
  //     throw new Error(`Failed to submit project: ${error}`)
  //   }
  // }


  static getAOIGeoentityIds(): { name: string; geoentityId: string }[] {
  return this.builder._aois.map(aoi => ({
    name: aoi.featureName,
    geoentityId: aoi.geoentityId ?? 'Not Assigned',
  }))
}

}
