import { HoeSkin } from '../types/game'

export const DEFAULT_HOE_SKIN_ID = 'hoe_wood'
export const HOE_GACHA_SINGLE_COST = 500 // 명성 500P (1회 뽑기)
export const HOE_GACHA_MULTI_COST = 2300 // 명성 2,300P (5회 뽑기, 200P 할인)
export const HOE_DUPLICATE_GOLD_REFUND = 2000 // 중복 뽑기 시 보상금 ₩2,000

export const HOE_SKINS: HoeSkin[] = [
  {
    id: 'hoe_wood',
    name: '정겨운 촌부의 나무 호미',
    grade: 'normal',
    gradeName: '일반',
    icon: '🪵',
    color: '#d97706',
    glowColor: '#92400e',
    trailEffect: 'none',
    description: '손때 묻어 반질반질 윤이 나는 시골 농부의 기본 나무 호미입니다.',
    weight: 0 // 기본 소유
  },
  {
    id: 'hoe_iron',
    name: '단단한 대장간 무쇠 호미',
    grade: 'normal',
    gradeName: '일반',
    icon: '⛏️',
    color: '#94a3b8',
    glowColor: '#64748b',
    trailEffect: 'sparkle',
    description: '마을 대장간의 명장이 담금질하여 단단하고 묵직한 실전용 무쇠 호미입니다.',
    weight: 35
  },
  {
    id: 'hoe_jade',
    name: '청록빛 지리산 비취 호미',
    grade: 'rare',
    gradeName: '희귀',
    icon: '🍃',
    color: '#10b981',
    glowColor: '#059669',
    trailEffect: 'leaf',
    description: '맑은 지리산 비취석을 깎아 만들어 싱그러운 봄바람 잎사귀 기운을 흩날립니다.',
    weight: 25
  },
  {
    id: 'hoe_ruby',
    name: '열정의 태양초 루비 호미',
    grade: 'rare',
    gradeName: '희귀',
    icon: '🔥',
    color: '#ef4444',
    glowColor: '#b91c1c',
    trailEffect: 'sparkle',
    description: '이글거리는 붉은 루비 보석이 박혀 밭을 일굴 때마다 훈훈한 열기가 피어오릅니다.',
    weight: 20
  },
  {
    id: 'hoe_sapphire',
    name: '은하수 별빛 사파이어 호미',
    grade: 'epic',
    gradeName: '영웅',
    icon: '🌌',
    color: '#3b82f6',
    glowColor: '#1d4ed8',
    trailEffect: 'sparkle',
    description: '밤하늘 은하수의 찬란한 별빛을 담아 영롱한 푸른 오라가 뿜어져 나옵니다.',
    weight: 12
  },
  {
    id: 'hoe_gold',
    name: '전설의 황금 신농(神農) 호미',
    grade: 'legendary',
    gradeName: '전설',
    icon: '👑',
    color: '#f59e0b',
    glowColor: '#d97706',
    trailEffect: 'gold',
    description: '농사의 신 신농이 하사했다고 전해지는 국보급 황금 호미. 눈부신 금빛 가루가 휘날립니다.',
    weight: 5
  },
  {
    id: 'hoe_rainbow',
    name: '환상 오로라 무지개 호미',
    grade: 'legendary',
    gradeName: '전설',
    icon: '🌈',
    color: '#ec4899',
    glowColor: '#8b5cf6',
    trailEffect: 'rainbow',
    description: '천상의 일곱 빛깔 오로라가 일렁이는 기적의 궁극 호미. 무지개 파티클 잔상이 남습니다.',
    weight: 3
  }
]

export const HOE_SKINS_MAP = new Map<string, HoeSkin>(
  HOE_SKINS.map(s => [s.id, s])
)
