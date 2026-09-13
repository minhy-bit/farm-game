import { UpgradeItem } from '../types/game'

export const UPGRADES: UpgradeItem[] = [
  // --- 농장 시설 업그레이드 ---
  {
    id: 'up_sprinkler',
    category: 'farm',
    name: '스마트 IoT 스프링클러',
    desc: '매일 아침 6시, 밭 전체에 자동으로 물을 분사하여 노동력을 획기적으로 줄입니다.',
    cost: 15000,
    level: 0,
    maxLevel: 1,
    icon: '💦',
    bonusText: '매일 전 타일 자동 급수'
  },
  {
    id: 'up_field_expand',
    category: 'farm',
    name: '텃밭 확장 공사',
    desc: '마을 이장님의 도움으로 텃밭 면적을 대폭 넓힙니다. (3x3 -> 4x4 -> 5x5)',
    cost: 20000,
    level: 0,
    maxLevel: 2,
    icon: '🚜',
    bonusText: '재배 가능 타일 대폭 확장'
  },
  {
    id: 'up_greenhouse',
    category: 'farm',
    name: '유리 스마트 온실 시공',
    desc: '기후와 계절 제약 없이 겨울에도 딸기, 수박 등 사계절 모든 작물을 재배합니다.',
    cost: 35000,
    level: 0,
    maxLevel: 1,
    icon: '🏡',
    bonusText: '사계절 무제한 작물 재배'
  },
  {
    id: 'up_auto_till',
    category: 'farm',
    name: '무경운 자동 직파기 (트랙터)',
    desc: '최첨단 무경운 직파 기술로 수확 후에도 밭의 일궈진 상태를 유지하며, 호미질 없이도 땅에 바로 씨앗을 심습니다.',
    cost: 25000,
    level: 0,
    maxLevel: 1,
    icon: '🚜',
    bonusText: '수확 후 밭 보존 & 호미질 없이 즉시 파종'
  },
  {
    id: 'up_auto_planter',
    category: 'farm',
    name: '스마트 자동 파종기',
    desc: '선택한 씨앗을 지정 범위의 빈 땅에 자동으로 파종합니다. 단계가 오를수록 파종 범위가 넓어집니다. (Lv.1 2×2 → Lv.4 5×5)',
    cost: 18000,
    level: 0,
    maxLevel: 4,
    icon: '🤖',
    bonusText: '자동 파종 범위 2×2 ~ 5×5'
  },
  {
    id: 'up_auto_harvester',
    category: 'farm',
    name: '스마트 광역 콤바인 수확기',
    desc: '완숙 작물을 클릭할 때 주변 범위의 모든 완숙 작물을 한 번에 일괄 수확합니다. 단계가 오를수록 수확 범위가 넓어집니다. (Lv.1 2×2 → Lv.4 5×5)',
    cost: 18000,
    level: 0,
    maxLevel: 4,
    icon: '🌾',
    bonusText: '클릭 시 일괄 수확 범위 2×2 ~ 5×5'
  },
  {
    id: 'up_fertile_soil',
    category: 'farm',
    name: '친환경 유용미생물(EM) 비옥토',
    desc: '토양 미생물을 활성화하여 수확 시 특등·고급 품질 작물이 나올 확률을 높입니다.',
    cost: 12000,
    level: 0,
    maxLevel: 3,
    icon: '🧪',
    bonusText: '고품질 작물 수확률 +25%'
  },

  // --- 마트 시설 업그레이드 ---
  {
    id: 'up_mart_shelves',
    category: 'mart',
    name: '원목 복합 매대 증설',
    desc: '더 많은 작물과 가공식품을 동시에 진열하여 다양한 손님의 취향을 저격합니다.',
    cost: 10000,
    level: 0,
    maxLevel: 3,
    icon: '🪵',
    bonusText: '마트 진열 슬롯 +1개'
  },
  {
    id: 'up_cold_showcase',
    category: 'mart',
    name: '신선 안심 냉장 쇼케이스',
    desc: '진열 작물의 신선도를 완벽하게 보존하고, 신선 프리미엄 판매 마진을 얻습니다.',
    cost: 25000,
    level: 0,
    maxLevel: 1,
    icon: '❄️',
    bonusText: '진열 작물 부패 방지 & 마진 +20%'
  },
  {
    id: 'up_smart_pos',
    category: 'mart',
    name: '스마트 키오스크 & 자동 POS',
    desc: '손님들의 대기 시간을 줄이고 바코드 결제를 자동화하여 회전율을 2배로 올립니다.',
    cost: 18000,
    level: 0,
    maxLevel: 1,
    icon: '💻',
    bonusText: '손님 계산 속도 2배 & 회전율 UP'
  },
  {
    id: 'up_mart_marketing',
    category: 'mart',
    name: '인스타 핫플 촌캉스 마케팅',
    desc: 'SNS와 로컬 여행 가이드에 늘봄마트가 소개되어 도시 관광객 손님이 몰려듭니다.',
    cost: 30000,
    level: 0,
    maxLevel: 2,
    icon: '📸',
    bonusText: '손님 스폰 주기 40% 단축'
  },

  // --- 가공실 업그레이드 ---
  {
    id: 'up_juicer',
    category: 'processing',
    name: 'HPP 저온 고압 착즙기',
    desc: '딸기, 사과, 수박을 착즙하여 원물 대비 3배 이상의 부가가치를 창출합니다.',
    cost: 16000,
    level: 0,
    maxLevel: 1,
    icon: '🧃',
    bonusText: '과일 주스 및 과일청 가공 기능'
  },
  {
    id: 'up_dehydrator',
    category: 'processing',
    name: '스마트 감압 식품 건조기',
    desc: '고구마, 고추, 표고버섯을 위생적으로 건조하여 고급 건조 식재료를 만듭니다.',
    cost: 14000,
    level: 0,
    maxLevel: 1,
    icon: '☀️',
    bonusText: '건조 식품 및 말랭이 가공 기능'
  }
]
