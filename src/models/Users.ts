export class User {
  userId: string
  name: string
  email: string
  createdAt: string
  profilePicture: string
  role: 'owner' | 'viewer' | 'analyst' | null

  constructor(data: {
    userId: string
    name: string
    email: string
    createdAt: string
    profilePicture: string
    role?: 'owner' | 'viewer' | 'analyst' | null
  }) {
    this.userId = data.userId
    this.name = data.name
    this.email = data.email
    this.createdAt = data.createdAt
    this.profilePicture = data.profilePicture
    this.role = data.role ?? null
  }

  setRole(newRole: 'owner' | 'viewer' | 'analyst') {
    this.role = newRole
  }

  getUserId(): string {
    return this.userId
  }

  getRole(): 'owner' | 'viewer' | 'analyst' | null {
    return this.role
  }
}
