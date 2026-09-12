import { Contract, CropDef, Season } from '../types/game'
import { CROPS } from './crops'

const SEASON_LABELS: Record<Season, string> = {
  spring: '봄',
  summer: '여름',
  autumn: '가을',
  winter: '겨울'
}

export const getRequiredCount = (crop: CropDef): number => {
  if (crop.basePrice >= 5000) return 4
  if (crop.basePrice >= 3000) return 6
  return 8
}

export const getRewardGold = (crop: CropDef, requiredCount: number): number =>
  Math.ceil((crop.basePrice * requiredCount * 1.45) / 500) * 500

export interface ClientPreset {
  name: string
  badge: string
  descTemplate: (cropName: string, count: number, seasonName: string) => string
}

export const CLIENT_PRESETS: ClientPreset[] = [
  {
    name: '늘봄마을 농협 로컬푸드',
    badge: '🌾 농협 공식',
    descTemplate: (crop, count) => `군내 로컬푸드 직판장에 납품할 신선한 ${crop} ${count}상자를 긴급 수매합니다.`
  },
  {
    name: '초록마켓 새벽프레시',
    badge: '🚚 수도권 새벽배송',
    descTemplate: (crop, count) => `서울 강남권 프리미엄 새벽배송 고객용 특등 ${crop} ${count}상자 정기 발주.`
  },
  {
    name: '햇살초등학교 급식지원센터',
    badge: '🏫 친환경 급식',
    descTemplate: (crop, count) => `아이들의 균형 잡힌 건강 점심 식단용 친환경 ${crop} ${count}개를 발주합니다.`
  },
  {
    name: '달빛펜션 바비큐 타운',
    badge: '⛺ 캠핑 단체',
    descTemplate: (crop, count) => `주말 관광객 바비큐 파티용 신선한 ${crop} ${count}개를 긴급 요청합니다.`
  },
  {
    name: '미슐랭 스타 오뜨 퀴진',
    badge: '⭐ 파인다이닝',
    descTemplate: (crop, count) => `최고급 디너 코스에 올릴 산지 직송 프리미엄 ${crop} ${count}개를 계약 구매합니다.`
  },
  {
    name: '늘봄 전통 발효연구소',
    badge: '🍶 전통식품가공',
    descTemplate: (crop, count) => `지역 특산 전통식품 및 명품 장류 개발을 위해 잘 자란 ${crop} ${count}개를 찾습니다.`
  },
  {
    name: '청년 웰빙 샐러드박스',
    badge: '🥗 헬스&뷰티',
    descTemplate: (crop, count) => `직장인 정기구독 샐러드 도시락 재료용 고품질 ${crop} ${count}개를 공급받습니다.`
  },
  {
    name: '도심 백화점 명품관',
    badge: '🏬 백화점 납품',
    descTemplate: (crop, count) => `명품관 신선식품 코너에 진열할 최상급 ${crop} ${count}상자 정기 계약 납품.`
  }
]

/**
 * 출하 완료 시 즉시 대체할 새로운 발주 계약을 생성합니다.
 */
export const generateRandomContract = (
  season: Season,
  currentDay: number,
  excludeCropIds: string[] = []
): Contract => {
  const currentCycle = Math.floor((currentDay - 1) / 80) + 1
  let candidates = CROPS.filter(
    c => c.season.includes(season) && (c.unlockCycle || 1) <= currentCycle && !excludeCropIds.includes(c.id)
  )
  if (candidates.length === 0) {
    candidates = CROPS.filter(c => c.season.includes(season) && (c.unlockCycle || 1) <= currentCycle)
  }
  if (candidates.length === 0) {
    candidates = CROPS.filter(c => (c.unlockCycle || 1) <= currentCycle)
  }
  if (candidates.length === 0) {
    candidates = CROPS
  }

  const crop = candidates[Math.floor(Math.random() * candidates.length)]
  const client = CLIENT_PRESETS[Math.floor(Math.random() * CLIENT_PRESETS.length)]
  const requiredCount = getRequiredCount(crop)
  const rewardGold = getRewardGold(crop, requiredCount)
  const rewardReputation = Math.floor(Math.random() * 16) + 15 // 15 ~ 30P
  const deadlineDay = currentDay + Math.floor(Math.random() * 4) + 4 // 4~7일 후 마감

  return {
    id: `ct_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    clientName: client.name,
    clientBadge: client.badge,
    cropId: crop.id,
    cropName: crop.nameKr,
    requiredCount,
    rewardGold,
    rewardReputation,
    deadlineDay,
    isCompleted: false,
    description: client.descTemplate(crop.nameKr, requiredCount, SEASON_LABELS[season])
  }
}

/**
 * 새 계절이 시작될 때 아직 출하하지 않은 계약을 제철 품목으로 갱신한다.
 */
export const refreshContractsForSeason = (
  contracts: Contract[],
  season: Season,
  currentDay: number
): Contract[] => {
  const currentCycle = Math.floor((currentDay - 1) / 80) + 1
  const seasonalCrops = CROPS.filter(crop => crop.season.includes(season) && (crop.unlockCycle || 1) <= currentCycle)
  if (seasonalCrops.length === 0) return contracts

  return contracts.map((contract, index) => {
    if (contract.isCompleted) return contract

    const crop = seasonalCrops[index % seasonalCrops.length]
    const requiredCount = getRequiredCount(crop)

    return {
      ...contract,
      cropId: crop.id,
      cropName: crop.nameKr,
      requiredCount,
      rewardGold: getRewardGold(crop, requiredCount),
      rewardReputation: 15 + index * 5,
      deadlineDay: currentDay + 5 + index,
      description: `${SEASON_LABELS[season]} 제철 ${crop.nameKr} ${requiredCount}상자를 요청합니다. 신선한 수확물을 기한 안에 출하해 주세요.`
    }
  })
}

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'ct_01',
    clientName: '늘봄마을 농협 로컬푸드',
    clientBadge: '🌾 농협 공식',
    cropId: 'crop_potato',
    cropName: '포슬알감자',
    requiredCount: 8,
    rewardGold: 14000,
    rewardReputation: 15,
    deadlineDay: 5,
    isCompleted: false,
    description: '군내 식자재 직판장 개점 행사용 햇감자 8박스를 급히 구합니다. 신선도 보너스 지급!'
  },
  {
    id: 'ct_02',
    clientName: '초록마켓 새벽프레시',
    clientBadge: '🚚 수도권 새벽배송',
    cropId: 'crop_strawberry',
    cropName: '설향딸기',
    requiredCount: 6,
    rewardGold: 21000,
    rewardReputation: 25,
    deadlineDay: 6,
    isCompleted: false,
    description: '서울 강남권 프리미엄 새벽배송 고객용 특등 당도 설향딸기 6상자 정기 발주.'
  },
  {
    id: 'ct_03',
    clientName: '햇살초등학교 급식지원센터',
    clientBadge: '🏫 친환경 급식',
    cropId: 'crop_cabbage',
    cropName: '아삭양배추',
    requiredCount: 10,
    rewardGold: 23000,
    rewardReputation: 30,
    deadlineDay: 7,
    isCompleted: false,
    description: '아이들의 건강한 점심 샐러드 식재료로 무농약 양배추 10통을 계약 납품받습니다.'
  },
  {
    id: 'ct_04',
    clientName: '달빛펜션 바비큐 타운',
    clientBadge: '⛺ 캠핑 단체',
    cropId: 'crop_scallion',
    cropName: '조선대파',
    requiredCount: 12,
    rewardGold: 18500,
    rewardReputation: 20,
    deadlineDay: 8,
    isCompleted: false,
    description: '주말 펜션 바비큐 파티용 쌈·구이 대파 12단을 발주합니다. 빠른 납품 환영!'
  }
]
