import React, { useEffect } from 'react'
import { Header } from './components/Header'
import { FarmField } from './components/FarmField'
import { LocalMart } from './components/LocalMart'
import { WholesaleHub } from './components/WholesaleHub'
import { ProcessingStorage } from './components/ProcessingStorage'
import { ShopUpgrades } from './components/ShopUpgrades'
import { RestaurantView } from './components/RestaurantView'
import { FishingView } from './components/FishingView'
import { AuthModal } from './components/AuthModal'
import { FloatingHoeCursor } from './components/FloatingHoeCursor'
import { AdSenseBanner } from './components/AdSenseBanner'
import { LegalModal } from './components/LegalModal'
import { GameGuideModal } from './components/GameGuideModal'
import { useGame } from './context/GameContext'
import { registerAgentController } from './agent/agentController'
import { BgmSystem } from './utils/bgm'

export const App: React.FC = () => {
  // 법적 고지 및 게임 가이드 모달 상태
  const [isLegalModalOpen, setIsLegalModalOpen] = React.useState(false)
  const [legalModalTab, setLegalModalTab] = React.useState<'privacy' | 'terms' | 'contact'>('privacy')
  const [isGuideModalOpen, setIsGuideModalOpen] = React.useState(false)

  const openLegalModal = (tab: 'privacy' | 'terms' | 'contact') => {
    setLegalModalTab(tab)
    setIsLegalModalOpen(true)
  }
  const {
    player,
    tiles,
    inventory,
    shelves,
    customers,
    contracts,
    upgrades,
    restaurant,
    fishing,
    hoeGacha,
    activeTab,
    setActiveTab,
    tillTile,
    waterTile,
    plantSeed,
    harvestCrop,
    waterAllTiles,
    sleepNextDay,
    fastForwardDays,
    stockShelf,
    clearShelf,
    checkoutCustomer,
    fulfillContract,
    buyRestaurant,
    buyUtensil,
    cookDish,
    serveDish,
    eatDish,
    buySeeds,
    buyUpgrade,
    autoPlantSeeds,
    buyFishingRod,
    buyBait,
    fish,
    processCrop,
    drawHoeGacha,
    equipHoeSkin,
    toggleFloatingCursor,
    addFunds,
    giveSeeds,
    giveCrops,
    forceDecayTile,
    forceRotCrop
  } = useGame()

  // 최초 사용자 상호작용 시 배경음악 자동 재생 준비
  useEffect(() => {
    BgmSystem.initAutoStartOnInteraction()
  }, [])

  // 에이전트 전역 컨트롤러 바인딩
  useEffect(() => {
    registerAgentController({
      getState: () => ({
        player,
        tiles,
        inventory,
        shelves,
        customers,
        contracts,
        upgrades,
        restaurant,
        fishing,
        hoeGacha,
        activeTab,
        bgm: BgmSystem.getState()
      }),
      tillTile: (x: number, y: number) => {
        const tile = tiles.find(t => t.x === x && t.y === y)
        if (!tile) return false
        return tillTile(tile.id)
      },
      waterTile: (x: number, y: number) => {
        const tile = tiles.find(t => t.x === x && t.y === y)
        if (!tile) return false
        return waterTile(tile.id)
      },
      plantCrop: (x: number, y: number, cropId: string) => {
        const tile = tiles.find(t => t.x === x && t.y === y)
        if (!tile) return false
        return plantSeed(tile.id, cropId)
      },
      harvestCrop: (x: number, y: number) => {
        const tile = tiles.find(t => t.x === x && t.y === y)
        if (!tile) return false
        return harvestCrop(tile.id)
      },
      waterAllTiles,
      sleepNextDay,
      fastForwardDays,
      stockShelf,
      clearShelf,
      checkoutCustomer,
      fulfillContract,
      buyRestaurant,
      buyUtensil,
      cookDish,
      serveDish,
      eatDish,
      buySeeds,
      buyUpgrade,
      autoPlantSeeds,
      buyFishingRod,
      buyBait,
      fish,
      processCrop,
      drawHoeGacha,
      equipHoeSkin,
      toggleFloatingCursor,
      switchTab: (tab) => setActiveTab(tab),
      addFunds,
      giveSeeds,
      giveCrops,
      forceDecayTile,
      forceRotCrop,
      playBgm: (trackId?: string) => BgmSystem.play(trackId),
      stopBgm: () => BgmSystem.stop(),
      toggleBgm: () => BgmSystem.toggle(),
      setBgmVolume: (vol: number) => BgmSystem.setVolume(vol),
      setBgmTrack: (trackId: string) => BgmSystem.setTrack(trackId),
      getBgmState: () => BgmSystem.getState()
    })
  }, [
    player,
    tiles,
    inventory,
    shelves,
    customers,
    contracts,
    upgrades,
    restaurant,
    fishing,
    hoeGacha,
    activeTab,
    tillTile,
    waterTile,
    plantSeed,
    harvestCrop,
    waterAllTiles,
    sleepNextDay,
    fastForwardDays,
    stockShelf,
    clearShelf,
    checkoutCustomer,
    fulfillContract,
    buyRestaurant,
    buyUtensil,
    cookDish,
    serveDish,
    eatDish,
    buySeeds,
    buyUpgrade,
    autoPlantSeeds,
    buyFishingRod,
    buyBait,
    fish,
    processCrop,
    drawHoeGacha,
    equipHoeSkin,
    toggleFloatingCursor,
    setActiveTab,
    addFunds,
    giveSeeds,
    giveCrops,
    forceDecayTile,
    forceRotCrop
  ])

  return (
    <div className="min-h-screen bg-farm-bg text-slate-100 flex flex-col selection:bg-amber-300 selection:text-stone-900">
      {/* 마우스 커서를 따라다니는 호미 스킨 효과 */}
      <FloatingHoeCursor />

      {/* 글로벌 상단 헤더 & 탭 바 */}
      <Header />

      {/* 메인 뷰 컨테이너 */}
      <main className="flex-1 pb-16 relative">
        {activeTab === 'farm' && <FarmField />}
        {activeTab === 'mart' && <LocalMart />}
        {activeTab === 'wholesale' && <WholesaleHub />}
        {activeTab === 'processing' && <ProcessingStorage />}
        {activeTab === 'shop' && <ShopUpgrades />}
        {activeTab === 'fishing' && <FishingView />}
        {activeTab === 'restaurant' && <RestaurantView />}
      </main>

      {/* 구글 애드센스 광고 영역 (충분한 안전 여백 확보) */}
      <section className="container mx-auto px-4 max-w-4xl">
        <AdSenseBanner />
      </section>

      {/* 하단 풋터 */}
      <footer className="border-t-4 border-[#3c261a] bg-farm-surface/95 py-6 px-4 text-center text-xs text-amber-100/70 shadow-[0_-3px_0_rgba(200,149,82,.8)]">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* 가이드 & 정책 네비게이션 */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-medium">
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-amber-900/40 hover:bg-amber-800/60 text-amber-200 border border-amber-600/40 transition-colors flex items-center space-x-1"
            >
              <span>📖 초보 농부 공략 가이드</span>
            </button>
            <span className="text-amber-700/60 hidden sm:inline">|</span>
            <button
              onClick={() => openLegalModal('privacy')}
              className="hover:text-amber-300 hover:underline transition-colors"
            >
              개인정보처리방침
            </button>
            <span className="text-amber-700/60">·</span>
            <button
              onClick={() => openLegalModal('terms')}
              className="hover:text-amber-300 hover:underline transition-colors"
            >
              서비스 이용약관
            </button>
            <span className="text-amber-700/60">·</span>
            <button
              onClick={() => openLegalModal('contact')}
              className="hover:text-amber-300 hover:underline transition-colors"
            >
              문의하기
            </button>
          </div>

          <p className="text-[11px] text-amber-200/50">
            늘봄마을 농장 일지 · 오늘도 천천히, 한 칸씩 · © 2026 Modern Farm & Mart. All rights reserved.
          </p>
        </div>
      </footer>

      {/* 계정 로그인/저장 모달 */}
      <AuthModal />

      {/* 법적 고지 (개인정보처리방침/이용약관/문의) 모달 */}
      <LegalModal
        isOpen={isLegalModalOpen}
        initialTab={legalModalTab}
        onClose={() => setIsLegalModalOpen(false)}
      />

      {/* 귀농 공략 가이드북 모달 */}
      <GameGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  )
}
export default App
