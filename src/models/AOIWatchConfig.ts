export interface WatchConfig {
  frequency: string
  alterenable: boolean
  sensitivity: number
  temperature: string
}

export interface AOIWatchConfig {
  ridam: WatchConfig | null
  geoES: WatchConfig | null
  sangrahi: WatchConfig | null
}
