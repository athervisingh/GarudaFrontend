export interface UserConfig {
  frequency: string
  alterenable: boolean
  sensitivity: number
  temperature: string
}

export interface AssignedUser {
  role: string
  config: {
    ridam: UserConfig
    geoES: UserConfig
    sangrahi: UserConfig
  }
}

export interface AssignedUsers {
  [userId: string]: AssignedUser
}
