export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export const DAYS_PER_SEASON = 20
export const DAYS_PER_CYCLE = DAYS_PER_SEASON * 4 // 80일 (사계절 1사이클)

// 자연재해 및 부패 발생 확률
export const SOIL_DECAY_RATE = 0.001 // 하루 경과 시 0.1% 확률로 밭이 무너져 호미질 다시 필요
export const CROP_ROT_RATE = 0.002 // 하루 경과 시 매우 낮은 확률(0.2%)로 병충해/과습으로 작물이 썩어 사라짐

export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'rainbow'

export type ToolType = 'hand' | 'hoe' | 'wateringCan' | 'sickle' | 'fertilizer'

export type CropQuality = 'normal' | 'high' | 'supreme'

export interface CropDef {
  id: string
  nameKr: string
  category: 'vegetable' | 'fruit' | 'grain' | 'special'
  season: Season[]
  seedPrice: number
  basePrice: number
  growthDays: number // 수확까지 필요한 일수
  stages: number // 성장 단계 (예: 4단계)
  yieldCount?: number // 수확 시 획득량 (기본 작물 2, 고급 작물 3~4)
  unlockCycle?: number // 해금되는 사이클 (1 = 1년차, 2 = 2년차+)
  isMasterCrop?: boolean // 고부가가치 마스터 작물 여부
  description: string
  icon: string // 이모지 또는 그래픽
  color: string
  canProcess: boolean
  processedName?: string
  processedPrice?: number
}

export interface FarmTile {
  id: string
  x: number
  y: number
  isTilled: boolean
  isWatered: boolean
  cropId: string | null
  currentStage: number // 0: 씨앗, 1: 새싹, 2: 성장, 3: 완숙(수확가능)
  daysGrown?: number // 누적 생육 일수
  quality: CropQuality
  fertilized: boolean
}

export interface InventoryItem {
  id: string
  type: 'seed' | 'crop' | 'processed'
  targetId: string // cropId
  name: string
  count: number
  quality?: CropQuality
  unitPrice: number
}

export interface MartShelf {
  id: string
  name: string
  shelfType: 'produce' | 'fruit' | 'cold' | 'special'
  cropId: string | null
  quality: CropQuality
  stock: number
  maxStock: number
  price: number // 플레이어가 지정한 판매가
  basePrice: number
  freshness: number // 0 ~ 100%
}

export interface Customer {
  id: string
  name: string
  role: '늘봄 주민' | '캠핑 관광객' | '셰프 미식가' | '알뜰 주부' | '새내기 귀농인'
  avatar: string
  preferredCategories: ('vegetable' | 'fruit' | 'grain' | 'special')[]
  budget: number
  state: 'browsing' | 'queued' | 'paying' | 'leaving'
  bubble?: string
  cart: {
    cropId: string
    name: string
    count: number
    unitPrice: number
  }[]
  shelfTargetIndex?: number
}

export interface Contract {
  id: string
  clientName: string
  clientBadge: string
  cropId: string
  cropName: string
  requiredCount: number
  rewardGold: number
  rewardReputation: number
  deadlineDay: number
  isCompleted: boolean
  description: string
}

export interface UpgradeItem {
  id: string
  category: 'farm' | 'mart' | 'processing'
  name: string
  desc: string
  cost: number
  level: number
  maxLevel: number
  icon: string
  bonusText: string
}

export interface PlayerStats {
  name: string
  gold: number
  totalEarned: number
  stamina: number
  maxStamina: number
  reputation: number // 명성/신뢰도
  day: number
  hour: number // 6 ~ 22 (오전 6시 ~ 밤 10시)
  season: Season
  weather: Weather
  martCustomersServed: number
  contractsFulfilled: number
}

export type TabType = 'farm' | 'mart' | 'wholesale' | 'processing' | 'shop' | 'restaurant'

export type CookingUtensilType = 'pot' | 'pan' | 'steamer' | 'blender' | 'oven'

export interface CookingUtensil {
  id: CookingUtensilType
  name: string
  icon: string
  price: number
  description: string
  unlocked: boolean
}

export interface DishIngredient {
  cropId: string
  count: number
}

export interface Recipe {
  id: string
  name: string
  category: 'korean' | 'western' | 'dessert' | 'beverage'
  icon: string
  utensilId: CookingUtensilType
  ingredients: DishIngredient[]
  sellPrice: number
  staminaRecovery: number
  reputationReward: number
  description: string
}

export interface CookedDishItem {
  id: string
  recipeId: string
  name: string
  icon: string
  count: number
  sellPrice: number
  staminaRecovery: number
  reputationReward: number
}

export interface RestaurantState {
  isOwned: boolean
  totalDishesServed: number
  unlockedUtensils: CookingUtensilType[]
  cookedInventory: CookedDishItem[]
}
