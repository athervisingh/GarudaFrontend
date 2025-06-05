// services/ProjectService.ts
import { Project } from '../models/Project'

export class ProjectService {
  static async saveProjectToFile(project: Project): Promise<void> {
    try {
      console.log(project.toJSON());
      const response = await fetch('http://localhost:3000/api/save-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project.toJSON())
      })

      if (!response.ok) {
        throw new Error('Failed to save project')
      }

      console.log('✅ Project saved successfully')
    } catch (error) {
      console.error('❌ Error saving project:', error)
    }
  }
}
