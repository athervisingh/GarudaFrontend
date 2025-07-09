import type { AOI } from "../models/AOI";

export class BackendAPI {
  static async submitBasicInfoAndFetchProjectID(
    basicInfo: object
  ): Promise<{ projectID: string }> {
    console.log("Sending basic info to backend:", basicInfo);

    const response = await fetch(
      "http://localhost:3000/api/basic-info",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(basicInfo),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ProjectID fetch failed: ${error}`);
    }

    const data = await response.json();
    return data;
  }

  static async submitAOIsAndFetchAOIIDs(aois: AOI[]): Promise<Response> {
    const payload = aois.map((aoi) => aoi.toJSON());
    return await fetch("http://localhost:3000/api/aois", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  static async submitProjectUsers(
    users: { userId: string; userName: string; role: string }[],
    projectId: string
  ): Promise<void> {
    try {
      const response = await fetch(
        "http://localhost:3000/api/project-users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId,
            users,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit users");
      }

      console.log("✅ Users submitted successfully.");
    } catch (err) {
      console.error("❌ Error submitting users:", err);
      throw err;
    }
  }
}
