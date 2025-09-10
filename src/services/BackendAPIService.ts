import type { AOI } from "../models/AOI"

// 🔗 URLs
// const localURL = "http://localhost:3000"
const remoteURL = "http://localhost:3000"

export class BackendAPI {
  static async submitBasicInfoAndFetchProjectID(
    basicInfo: object
  ): Promise<{ projectID: string }> {
    console.log("Sending basic info to backend:", basicInfo)

    const response = await fetch(`${remoteURL}/api/basic-info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(basicInfo),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`ProjectID fetch failed: ${error}`)
    }

    const data = await response.json()
    return data
  }

  static async submitAOIsAndFetchAOIIDs(aois: AOI[]): Promise<Response> {
    const payload = aois.map((aoi) => aoi.toJSON())
    return await fetch(`${remoteURL}/api/aois`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  }

  static async submitProjectUsers(
    users: { userId: string; userName: string; role: string }[],
    projectId: string,
    projectName: string
  ): Promise<void> {
    try {
      const response = await fetch(`${remoteURL}/api/project-users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          projectName,
          users,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to submit users")
      }

      console.log("✅ Users submitted successfully.")
    } catch (err) {
      console.error("❌ Error submitting users:", err)
      throw err
    }
  }

  static async fetchUserManagableProject(
    userId: string
  ): Promise<{ projectID: string; projectName: string; role: string }[]> {
    try {
      const response = await fetch(`${remoteURL}/api/user-projects?userId=${userId}`)

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to fetch user projects: ${error}`)
      }

      const projects = await response.json()
      return projects
    } catch (err) {
      console.error("❌ Error fetching user projects:", err)
      throw err
    }
  }

  static async fetchUserMonitoredProject(
    userId: string
  ): Promise<{ projectID: string; projectName: string; role: string }[]> {
    try {
      const response = await fetch(`${remoteURL}/api/monitored-projects?userId=${userId}`)

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to fetch user projects: ${error}`)
      }

      const projects = await response.json()
      return projects
    } catch (err) {
      console.error("❌ Error fetching user projects:", err)
      throw err
    }
  }
}
