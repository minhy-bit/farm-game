import { CookingUtensil } from '../types/game'

export const COOKING_UTENSILS: CookingUtensil[] = [
  {
    id: 'pot',
    name: '무쇠 가마솥 & 뚝배기',
    icon: '🍲',
    price: 0, // 기본 제공
    description: '은은하고 깊은 맛을 우려내는 무쇠 가마솥. 영양밥, 찌개, 탕, 죽 요리가 가능합니다.',
    unlocked: true
  },
  {
    id: 'pan',
    name: '동판 프라이팬 & 무쇠 그릴',
    icon: '🍳',
    price: 12000,
    description: '고화력으로 겉바속촉 굽고 볶아내는 전통 무쇠 팬. 전, 구이, 볶음 요리가 가능합니다.',
    unlocked: false
  },
  {
    id: 'steamer',
    name: '황동 스팀 찜기',
    icon: '🥟',
    price: 20000,
    description: '수확물의 본연의 영양과 단맛을 고스란히 쪄내는 고급 찜기. 쌈밥, 떡, 찜 요리가 가능합니다.',
    unlocked: false
  },
  {
    id: 'blender',
    name: '초고속 진공 블렌더',
    icon: '🍹',
    price: 28000,
    description: '신선한 생과일과 채소를 영양 손실 없이 갈아내는 카페급 블렌더. 주스, 스무디가 가능합니다.',
    unlocked: false
  },
  {
    id: 'oven',
    name: '전통 황토 벽돌 화덕',
    icon: '🍕',
    price: 38000,
    description: '참나무 장작 열기로 바삭하게 구워내는 화덕 오븐. 피자, 그라탕, 파이 요리가 가능합니다.',
    unlocked: false
  }
]

export const UTENSILS_MAP = new Map<string, CookingUtensil>(
  COOKING_UTENSILS.map(u => [u.id, u])
)
