import type { BasicInfo } from '../models/BasicInfo'
// import type { Project } from '../models/Poject'
import type { AOI } from '../models/AOI'

export class ProjectApi {
  // static async saveProject(project: Project): Promise<Response> {
  //   return await fetch('http://localhost:3000/api/projects', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(project)
  //   })
  // }

  static async sendBasicInfoAndGetGeoentitySourceId(basicInfo: BasicInfo): Promise<{ geoentitySourceId: string }> {
    console.log('Sending basic info to backend:', basicInfo.toJSON())
    const response = await fetch('http://localhost:3000/api/basic-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(basicInfo.toJSON())
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`GeoID fetch failed: ${error}`)
    }
      const data = await response.json()

    return data;
  }

  static async sendAOIs(aois: AOI[]): Promise<Response> {
  const payload = aois.map(aoi => aoi.toJSON())
  return await fetch('http://localhost:3000/api/aois', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}
}
