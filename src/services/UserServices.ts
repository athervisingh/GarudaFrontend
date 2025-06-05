// services/UserService.ts
import { User } from '../models/Users'

export class UserService {
  static async fetchCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch('http://localhost:3000/api/get-user')
      if (!response.ok) throw new Error('Failed to fetch user')

      const data = await response.json()
      const user = new User(data)
      return user
    } catch (error) {
      console.error('❌ Error fetching user:', error)
      return null
    }
  }
}
