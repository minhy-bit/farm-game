# 🌾 청년농부의 촌 라이프 (Modern Farm & Mart)

> **"오늘도 천천히, 한 칸씩."**  
> 모던 감성의 사계절 힐링 농사 & 로컬푸드 마트 타이쿤 웹 시뮬레이션 게임입니다.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎮 주요 게임 시스템

### 1. 🌾 사계절 농경 시스템 & 광역 일괄 수확
- **사계절 22종 작물**: 봄(설향딸기, 포슬알감자 등), 여름(완숙토마토, 꿀수박 등), 가을(꿀고구마, 단호박 등), 겨울(서리태콩, 대관령무 등) 계절별 특화 작물 재배.
- **3사이클 마스터 작물 해금**: 사계절을 3회 순환(총 12계절 경과)하고 농가 명성을 축적한 베테랑 농부에게만 열리는 전설의 특수 작물(산삼, 황금사과, 눈꽃송이 등).
- **스마트 농기계 설비**:
  - 스마트 스프링클러(전체 일괄 급수)
  - 스마트 자동 파종기 (2×2 ~ 5×5 자동 씨앗 파종)
  - 스마트 광역 콤바인 수확기 (클릭 시 2×2 ~ 5×5 범위 내 모든 완숙 작물 원클릭 동시 수확)

### 2. 🏪 로컬푸드 직매장 & B2B 납품 계약
- **5슬롯 매대 진열**: 마트 매대에 한 번에 최대 5종의 품목을 전략적으로 엄선하여 진열.
- **3단계 가격 정책**: `-10% 할인`(인기 폭발/단골 유치), `정가 판매`(안정적 마진), `+10% 할증`(고수익, 단 바가지 요금 페널티 주의).
- **상도의 페널티**: 과도한 가격 인상 판매 시 50% 확률로 명성 반감, 0.2% 확률로 보유 명성 절반 실추.
- **B2B 정기 납품 센터**: 농협, 로컬 레스토랑, 대형마트 대량 납품 계약 출하 시 마트 판매가 대비 1.55배 프리미엄 보상 지급. 당일 납품 완료 시 익일 아침 새로운 발주로 자동 갱신.

### 3. 🍳 늘봄 식당 & 18종 레시피
- 수확한 신선 농산물과 낚시로 잡은 생선으로 고품격 요리 제작 (단호박 영양죽, 감자전, 생딸기 스무디, 얼큰 붕어매운탕 등).
- 손님 서빙을 통한 고수익 창출 또는 직접 섭취하여 농사 기력 회복.

### 4. 🎣 늘봄 낚시터
- 전용 낚싯대와 미끼를 구비하여 저수지에서 민물 어종(토종 붕어, 힘찬 잉어, 전설의 황금 쏘가리) 낚시.

### 5. ⛏️ 명성 호미 가챠 & 마우스 플로팅 호미 스킨
- 성실한 농사 및 납품으로 모은 **명성 포인트(1회 500P / 5회 2,300P)**로 7가지 등급의 호미 스킨 뽑기 진행.
- 획득한 호미 스킨을 장착하면 마우스 커서를 따라다니며 아름다운 파티클 트레일 연출 (ON/OFF 토글 가능).

### 6. 🎵 Web Audio 실시간 절차적 합성 BGM
- 외부 음원 파일 없이 Web Audio API 오실레이터로 실시간 합성하는 잔잔한 힐링 배경음악 (아침 햇살 칼림바, 노을빛 어쿠스틱, 별빛 오르골, 비 내리는 날 등 계절 자동 맞춤 지원).

### 7. 📢 Google AdSense & 이용자 권익 보호 완비
- **공식 게시자 식별**: `public/ads.txt` 탑재.
- **광고 정책 준수**: 오클릭 방지 안전 여백 및 `[ AD SPONSORED ]` 라벨을 갖춘 `AdSenseBanner` 컴포넌트.
- **법적 고지 모달**: Google 타사 쿠키 및 맞춤광고 거부 안내가 명시된 개인정보처리방침, 이용약관, 문의하기.
- **공략 가이드북 모달**: 구글 심사 "가치 있는 인벤토리 부족(Low Value Content)" 탈락을 완벽 방어하는 풍부한 텍스트 가이드.

---

## 🛠️ 기술 스택 (Tech Stack)

| 구분 | 기술 스택 |
| :--- | :--- |
| **Frontend Framework** | React 18 (TypeScript) |
| **Build Tool** | Vite 8.x |
| **Styling** | Tailwind CSS 3.x |
| **Icons** | Lucide React |
| **Audio Engine** | Web Audio API (Synthesizer & Sequencer) |
| **State & Persistence** | React Context API + LocalStorage |
| **AI Integration** | `window.farmGame` Headless Controller API |

---

## 🚀 시작하기 (Getting Started)

### 1. 패키지 설치
```bash
npm install
```

### 2. 개발 서버 구동
```bash
npm run dev
```
브라우저에서 `http://localhost:5173` (또는 지정 포트)에 접속합니다.

### 3. 프로덕션 빌드
```bash
npm run build
```

---

## 📁 디렉터리 구조

```text
농사게임/
├── public/
│   └── ads.txt                   # 구글 애드센스 공식 게시자 확인 파일
├── src/
│   ├── agent/                    # AI 에이전트 전역 제어 인터페이스
│   ├── components/
│   │   ├── AdSenseBanner.tsx     # 애드센스 반응형 배너 컴포넌트
│   │   ├── FarmField.tsx         # 밭 타일 및 농작업 뷰
│   │   ├── FloatingHoeCursor.tsx # 마우스 플로팅 호미 스킨
│   │   ├── GameGuideModal.tsx    # 초보 농부 공략 가이드북 모달
│   │   ├── LegalModal.tsx        # 개인정보처리방침/이용약관/문의 모달
│   │   ├── LocalMart.tsx         # 로컬푸드 마트 매대 뷰
│   │   ├── RestaurantView.tsx    # 늘봄 식당 조리 및 서빙 뷰
│   │   ├── FishingView.tsx       # 늘봄 낚시터 뷰
│   │   └── ...
│   ├── data/                     # 작물, 레시피, 업그레이드, 밸런스 데이터
│   ├── utils/                    # BGM 신시사이저 및 오디오 유틸
│   ├── App.tsx                   # 메인 애플리케이션
│   └── main.tsx
├── .env.example                  # 환경변수 설정 예시 (애드센스 연동 키 포함)
├── package.json
└── vite.config.ts
```

---

## 📄 라이선스 (License)

This project is licensed under the MIT License.
