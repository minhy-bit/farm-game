import { TabType, CookingUtensilType } from '../types/game'

export interface FarmGameControllerAPI {
  getState: () => any
  tillTile: (x: number, y: number) => boolean
  waterTile: (x: number, y: number) => boolean
  plantCrop: (x: number, y: number, cropId: string) => boolean
  harvestCrop: (x: number, y: number) => boolean
  waterAllTiles: () => void
  sleepNextDay: () => void
  fastForwardDays?: (days: number) => void
  stockShelf: (shelfId: string, cropId: string, count: number, price: number) => boolean
  clearShelf: (shelfId: string) => void
  checkoutCustomer: (customerId: string) => void
  fulfillContract: (contractId: string) => boolean
  buyRestaurant?: () => boolean
  buyUtensil?: (utensilId: CookingUtensilType) => boolean
  cookDish?: (recipeId: string) => boolean
  serveDish?: (recipeId: string) => boolean
  eatDish?: (recipeId: string) => boolean
  buySeeds: (cropId: string, count: number) => boolean
  buyUpgrade: (upgradeId: string) => boolean
  processCrop: (cropId: string, count: number) => boolean
  switchTab: (tab: TabType) => void
  addFunds: (amount: number) => void
  giveSeeds: (cropId: string, count: number) => void
  giveCrops: (cropId: string, count: number) => void
  forceDecayTile?: (tileIndex?: number) => boolean
  forceRotCrop?: (tileIndex?: number) => boolean
}

declare global {
  interface Window {
    farmGame?: FarmGameControllerAPI
  }
}

export function registerAgentController(handlers: FarmGameControllerAPI) {
  if (typeof window !== 'undefined') {
    window.farmGame = handlers
  }
}
