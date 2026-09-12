import React, { useEffect } from 'react'
import { Header } from './components/Header'
import { FarmField } from './components/FarmField'
import { LocalMart } from './components/LocalMart'
import { WholesaleHub } from './components/WholesaleHub'
import { ProcessingStorage } from './components/ProcessingStorage'
import { ShopUpgrades } from './components/ShopUpgrades'
import { RestaurantView } from './components/RestaurantView'
import { AuthModal } from './components/AuthModal'
import { useGame } from './context/GameContext'
import { registerAgentController } from './agent/agentController'

export const App: React.FC = () => {
  const {
    player,
    tiles,
    inventory,
    shelves,
    customers,
    contracts,
    upgrades,
    restaurant,
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
    processCrop,
    addFunds,
    giveSeeds,
    giveCrops,
    forceDecayTile,
    forceRotCrop
  } = useGame()

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
        activeTab
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
      processCrop,
      switchTab: (tab) => setActiveTab(tab),
      addFunds,
      giveSeeds,
      giveCrops,
      forceDecayTile,
      forceRotCrop
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
    processCrop,
    setActiveTab,
    addFunds,
    giveSeeds,
    giveCrops,
    forceDecayTile,
    forceRotCrop
  ])

  return (
    <div className="min-h-screen bg-farm-bg text-slate-100 flex flex-col selection:bg-amber-300 selection:text-stone-900">
      {/* 글로벌 상단 헤더 & 탭 바 */}
      <Header />

      {/* 메인 뷰 컨테이너 */}
      <main className="flex-1 pb-16 relative">
        {activeTab === 'farm' && <FarmField />}
        {activeTab === 'mart' && <LocalMart />}
        {activeTab === 'wholesale' && <WholesaleHub />}
        {activeTab === 'processing' && <ProcessingStorage />}
        {activeTab === 'shop' && <ShopUpgrades />}
        {activeTab === 'restaurant' && <RestaurantView />}
      </main>

      {/* 하단 풋터 */}
      <footer className="border-t-4 border-[#3c261a] bg-farm-surface/95 py-4 text-center text-xs text-amber-100/70 shadow-[0_-3px_0_rgba(200,149,82,.8)]">
        <p>늘봄마을 농장 일지 · 오늘도 천천히, 한 칸씩</p>
      </footer>

      {/* 계정 로그인/저장 모달 */}
      <AuthModal />
    </div>
  )
}
export default App
