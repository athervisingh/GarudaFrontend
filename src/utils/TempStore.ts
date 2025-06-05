// utils/TempStore.ts
import { Project } from '../models/Project'
import { User } from '../models/Users'

export const TempStore = {
  currentProject: null as Project | null,
  currentUser: null as User | null,

  // Project-related methods
  createNewProject(userId: string) {
    this.currentProject = new Project(userId)
  },

  getProject(): Project {
    if (!this.currentProject) throw new Error('Project not initialized')
    return this.currentProject
  },

  // User-related methods
  setUser(userData: any) {
    this.currentUser = new User(userData)
  },

  getUser(): User {
    if (!this.currentUser) throw new Error('User not initialized')
    return this.currentUser
  },

  setUserRole(role: 'owner' | 'viewer' | 'analyst') {
    if (!this.currentUser) throw new Error('User not initialized')
    this.currentUser.setRole(role)
  }
}
