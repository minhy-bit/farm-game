export interface FishingCatch {
  id: string
  name: string
  icon: string
  unitPrice: number
  weight: number
  description: string
}

export const FISHING_ROD_PRICE = 1800
export const BAIT_PRICE = 60
export const FISHING_STAMINA_COST = 5

export const FISHING_CATCHES: FishingCatch[] = [
  { id: 'catch_crucian', name: '은빛 붕어', icon: '🐟', unitPrice: 450, weight: 38, description: '맑은 마을 연못에서 흔히 만나는 담백한 민물고기.' },
  { id: 'catch_bass', name: '통통한 농어', icon: '🐠', unitPrice: 800, weight: 25, description: '힘찬 입질을 자랑하는 살이 꽉 찬 농어.' },
  { id: 'catch_clam', name: '늘봄 바지락', icon: '🦪', unitPrice: 350, weight: 27, description: '국물 맛을 깊게 만드는 신선한 바지락.' },
  { id: 'catch_river_shrimp', name: '민물새우', icon: '🦐', unitPrice: 700, weight: 10, description: '바삭한 전과 감칠맛 나는 찌개에 어울리는 민물새우.' }
]

export const FISHING_CATCHES_MAP = new Map<string, FishingCatch>(
  FISHING_CATCHES.map(catchItem => [catchItem.id, catchItem])
)
