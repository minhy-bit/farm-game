import { Recipe } from '../types/game'

export const RECIPES: Recipe[] = [
  // --- 낚시터 신선 해산물 요리 ---
  {
    id: 'rcp_clam_stew',
    name: '늘봄 바지락 된장국',
    category: 'korean',
    icon: '🦪',
    utensilId: 'pot',
    ingredients: [
      { cropId: 'catch_clam', count: 2 },
      { cropId: 'crop_scallion', count: 1 },
      { cropId: 'crop_chili', count: 1 }
    ],
    sellPrice: 2950,
    staminaRecovery: 45,
    reputationReward: 18,
    description: '연못에서 갓 건진 바지락과 텃밭 채소를 넣어 시원하게 끓인 마을 별미.'
  },
  {
    id: 'rcp_bass_grill',
    name: '농어 감자 허브구이',
    category: 'western',
    icon: '🐠',
    utensilId: 'pan',
    ingredients: [
      { cropId: 'catch_bass', count: 1 },
      { cropId: 'crop_potato', count: 2 },
      { cropId: 'crop_scallion', count: 1 }
    ],
    sellPrice: 3850,
    staminaRecovery: 55,
    reputationReward: 24,
    description: '통통한 농어와 햇감자를 노릇하게 구워낸 든든한 농장식 한 접시.'
  },
  {
    id: 'rcp_shrimp_pancake',
    name: '민물새우 감자전',
    category: 'korean',
    icon: '🦐',
    utensilId: 'pan',
    ingredients: [
      { cropId: 'catch_river_shrimp', count: 2 },
      { cropId: 'crop_potato', count: 2 },
      { cropId: 'crop_scallion', count: 1 }
    ],
    sellPrice: 3550,
    staminaRecovery: 50,
    reputationReward: 22,
    description: '바삭한 감자전에 고소한 민물새우를 듬뿍 올린 비 오는 날의 별미.'
  },
  // --- 1. 무쇠 가마솥 & 뚝배기 (pot) ---
  {
    id: 'rcp_rice_bowl',
    name: '가마솥 햅쌀 표고 영양밥',
    category: 'korean',
    icon: '🍚',
    utensilId: 'pot',
    ingredients: [
      { cropId: 'crop_rice', count: 2 },
      { cropId: 'crop_mushroom', count: 1 }
    ],
    sellPrice: 1900,
    staminaRecovery: 35,
    reputationReward: 12,
    description: '가마솥에서 갓 지어내 윤기가 흐르는 햅쌀에 향긋한 표고버섯을 얹은 영양밥.'
  },
  {
    id: 'rcp_stew',
    name: '시골 감자 대파 된장찌개',
    category: 'korean',
    icon: '🍲',
    utensilId: 'pot',
    ingredients: [
      { cropId: 'crop_potato', count: 2 },
      { cropId: 'crop_scallion', count: 2 },
      { cropId: 'crop_chili', count: 1 }
    ],
    sellPrice: 2250,
    staminaRecovery: 40,
    reputationReward: 15,
    description: '포슬알감자와 싱싱한 대파, 알싸한 청양고추를 넣고 보글보글 끓여낸 정겨운 찌개.'
  },
  {
    id: 'rcp_pumpkin_soup',
    name: '황금 단호박 보양죽',
    category: 'korean',
    icon: '🥣',
    utensilId: 'pot',
    ingredients: [
      { cropId: 'crop_pumpkin', count: 2 },
      { cropId: 'crop_rice', count: 1 }
    ],
    sellPrice: 2500,
    staminaRecovery: 45,
    reputationReward: 16,
    description: '달콤한 단호박을 가마솥에 뭉근히 쑤어내 속을 편안하게 달래주는 힐링 죽.'
  },

  // --- 2. 동판 프라이팬 & 무쇠 그릴 (pan) ---
  {
    id: 'rcp_potato_pancake',
    name: '바삭 노릇 들기름 감자전',
    category: 'korean',
    icon: '🥔',
    utensilId: 'pan',
    ingredients: [
      { cropId: 'crop_potato', count: 3 },
      { cropId: 'crop_scallion', count: 1 }
    ],
    sellPrice: 2100,
    staminaRecovery: 35,
    reputationReward: 12,
    description: '햇감자를 곱게 갈아 팬에 바삭하게 지져낸 시골 잔치 단골 인기 전.'
  },
  {
    id: 'rcp_grilled_corn',
    name: '콘치즈 버터 옥수수구이',
    category: 'western',
    icon: '🌽',
    utensilId: 'pan',
    ingredients: [
      { cropId: 'crop_corn', count: 2 },
      { cropId: 'crop_chili', count: 1 }
    ],
    sellPrice: 2050,
    staminaRecovery: 30,
    reputationReward: 10,
    description: '그릴 팬에 노릇하게 구워 버터와 매콤한 칠리 파우더를 곁들인 별미.'
  },
  {
    id: 'rcp_mushroom_stirfry',
    name: '원목 표고 파프리카 볶음',
    category: 'korean',
    icon: '🍄',
    utensilId: 'pan',
    ingredients: [
      { cropId: 'crop_mushroom', count: 2 },
      { cropId: 'crop_paprika', count: 1 },
      { cropId: 'crop_scallion', count: 1 }
    ],
    sellPrice: 3300,
    staminaRecovery: 50,
    reputationReward: 20,
    description: '쫄깃한 표고버섯과 알록달록 파프리카를 센 불에 빠르게 볶아낸 고급 채소 요리.'
  },

  // --- 3. 황동 스팀 찜기 (steamer) ---
  {
    id: 'rcp_cabbage_roll',
    name: '아삭 양배추 롤 쌈밥',
    category: 'korean',
    icon: '🥬',
    utensilId: 'steamer',
    ingredients: [
      { cropId: 'crop_cabbage', count: 2 },
      { cropId: 'crop_rice', count: 1 },
      { cropId: 'crop_scallion', count: 1 }
    ],
    sellPrice: 2400,
    staminaRecovery: 40,
    reputationReward: 15,
    description: '찜기에 부드럽게 쪄낸 양배추 잎으로 햅쌀밥을 정성스럽게 감싼 웰빙 쌈밥.'
  },
  {
    id: 'rcp_sweet_potato_cake',
    name: '달콤 꿀고구마 찜 떡케이크',
    category: 'dessert',
    icon: '🍠',
    utensilId: 'steamer',
    ingredients: [
      { cropId: 'crop_sweet_potato', count: 2 },
      { cropId: 'crop_rice', count: 1 }
    ],
    sellPrice: 2800,
    staminaRecovery: 45,
    reputationReward: 16,
    description: '꿀고구마의 진한 단맛과 쌀가루가 촉촉한 김을 머금어 폭신하게 쪄진 수제 떡.'
  },
  {
    id: 'rcp_steamed_pumpkin',
    name: '통단호박 표고 버섯찜',
    category: 'korean',
    icon: '🎃',
    utensilId: 'steamer',
    ingredients: [
      { cropId: 'crop_pumpkin', count: 2 },
      { cropId: 'crop_mushroom', count: 2 }
    ],
    sellPrice: 3750,
    staminaRecovery: 55,
    reputationReward: 22,
    description: '황금 단호박 속에 영양 가득한 표고버섯을 채워 넣고 스팀으로 쪄낸 명품 일품요리.'
  },

  // --- 4. 초고속 진공 블렌더 (blender) ---
  {
    id: 'rcp_strawberry_smoothie',
    name: '리얼 생과일 설향딸기 스무디',
    category: 'beverage',
    icon: '🍓',
    utensilId: 'blender',
    ingredients: [
      { cropId: 'crop_strawberry', count: 3 }
    ],
    sellPrice: 2550,
    staminaRecovery: 35,
    reputationReward: 15,
    description: '밭에서 갓 딴 싱싱한 설향딸기를 곱게 갈아 상큼달콤한 향이 가득한 프리미엄 스무디.'
  },
  {
    id: 'rcp_watermelon_juice',
    name: '땡모반 시원 꿀수박 주스',
    category: 'beverage',
    icon: '🍉',
    utensilId: 'blender',
    ingredients: [
      { cropId: 'crop_watermelon', count: 1 },
      { cropId: 'crop_strawberry', count: 1 }
    ],
    sellPrice: 3900,
    staminaRecovery: 50,
    reputationReward: 24,
    description: '당도 높은 꿀수박을 얼음과 함께 블렌딩해 무더위와 피로를 단숨에 날려주는 음료.'
  },
  {
    id: 'rcp_apple_tomato_juice',
    name: '활력충전 사과 토마토 주스',
    category: 'beverage',
    icon: '🧃',
    utensilId: 'blender',
    ingredients: [
      { cropId: 'crop_apple', count: 2 },
      { cropId: 'crop_tomato', count: 2 }
    ],
    sellPrice: 3400,
    staminaRecovery: 45,
    reputationReward: 18,
    description: '비타민 풍부한 완숙 토마토와 가을 황금사과를 착즙해 건강을 선물하는 활력 주스.'
  },

  // --- 5. 전통 황토 벽돌 화덕 (oven) ---
  {
    id: 'rcp_tomato_pizza',
    name: '화덕 마르게리타 텃밭 피자',
    category: 'western',
    icon: '🍕',
    utensilId: 'oven',
    ingredients: [
      { cropId: 'crop_tomato', count: 2 },
      { cropId: 'crop_paprika', count: 2 },
      { cropId: 'crop_rice', count: 1 }
    ],
    sellPrice: 4650,
    staminaRecovery: 60,
    reputationReward: 28,
    description: '쌀 도우 위에 생토마토와 신선한 파프리카를 얹어 400도 장작 화덕에서 구워낸 피자.'
  },
  {
    id: 'rcp_potato_gratin',
    name: '골든 통감자 콘치즈 그라탱',
    category: 'western',
    icon: '🧀',
    utensilId: 'oven',
    ingredients: [
      { cropId: 'crop_potato', count: 3 },
      { cropId: 'crop_corn', count: 2 }
    ],
    sellPrice: 3600,
    staminaRecovery: 50,
    reputationReward: 20,
    description: '포슬포슬한 햇감자와 달콤한 찰옥수수 위에 치즈를 듬뿍 얹어 화덕에 노릇하게 구운 그라탱.'
  },
  {
    id: 'rcp_apple_pie',
    name: '명품 황금사과 시나몬 파이',
    category: 'dessert',
    icon: '🥧',
    utensilId: 'oven',
    ingredients: [
      { cropId: 'crop_apple', count: 3 },
      { cropId: 'crop_sweet_potato', count: 1 }
    ],
    sellPrice: 4200,
    staminaRecovery: 55,
    reputationReward: 25,
    description: '은은한 사과 향과 달콤한 꿀고구마 필링이 어우러진 바삭하고 품격 있는 디저트 파이.'
  }
]

export const RECIPES_MAP = new Map<string, Recipe>(
  RECIPES.map(r => [r.id, r])
)
