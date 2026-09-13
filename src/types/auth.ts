import { FishingState } from './game'

export interface UserProfile {
  username: string
  passwordHash: string
  createdAt: number
  lastSavedAt: number
  farmSummary?: {
    gold: number
    day: number
    year: number
    season: string
    reputation: number
  }
}

export interface SaveGamePayload {
  version: number
  savedAt: number
  username: string
  player: any
  tiles: any[]
  inventory: any[]
  shelves: any[]
  contracts: any[]
  upgrades: any[]
  restaurant: any
  gridSize: number
  fishing?: FishingState
}
