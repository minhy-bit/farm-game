import { Customer } from '../types/game'

export const CUSTOMER_PRESETS: Omit<Customer, 'id' | 'cart' | 'state' | 'bubble'>[] = [
  {
    name: '순이 할머니',
    role: '늘봄 주민',
    avatar: '👵',
    preferredCategories: ['vegetable', 'grain'],
    budget: 8000
  },
  {
    name: '캠퍼 민우',
    role: '캠핑 관광객',
    avatar: '🏕️',
    preferredCategories: ['vegetable', 'fruit'],
    budget: 25000
  },
  {
    name: '셰프 마르코',
    role: '셰프 미식가',
    avatar: '👨‍🍳',
    preferredCategories: ['vegetable', 'fruit', 'special'],
    budget: 45000
  },
  {
    name: '현명한 지은씨',
    role: '알뜰 주부',
    avatar: '👩',
    preferredCategories: ['vegetable', 'grain'],
    budget: 18000
  },
  {
    name: '귀농청년 준호',
    role: '새내기 귀농인',
    avatar: '🧑‍🌾',
    preferredCategories: ['fruit', 'special'],
    budget: 15000
  },
  {
    name: '소풍 나온 유진',
    role: '캠핑 관광객',
    avatar: '👒',
    preferredCategories: ['fruit'],
    budget: 20000
  }
]

export const CUSTOMER_BUBBLES: Record<string, string[]> = {
  browsing: [
    '어디 신선한 거 있나 둘러볼까~',
    '산지 직송이라 향이 정말 좋네!',
    '가격표 한번 볼까?',
    '오늘 뭐 해 먹지 고민이네',
    '유기농 인증 마크가 신뢰가 가네요'
  ],
  queued: [
    '장바구니에 담았다! 계산해야지~',
    '이 정도면 주말 식사 준비 끝!',
    '딸기가 너무 탐스럽게 생겼어',
    '사장님 오늘 장사 잘되시네요!'
  ],
  paying: [
    '계산 부탁드려요!',
    '맛있게 잘 먹겠습니다~',
    '영수증은 안 주셔도 돼요 ㅎㅎ',
    '다음에 또 올게요!'
  ]
}
