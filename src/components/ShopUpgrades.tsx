import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import { CROPS } from '../data/crops'
import {
  ShoppingBag,
  Sprout,
  Wrench,
  Coins,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpCircle,
  Lock
} from 'lucide-react'

export const ShopUpgrades: React.FC = () => {
  const { player, buySeeds, buyUpgrade, upgrades, currentYear } = useGame()
  const [subTab, setSubTab] = useState<'seeds' | 'upgrades'>('seeds')
  const [seasonFilter, setSeasonFilter] = useState<'all' | 'spring' | 'summer' | 'autumn' | 'winter'>('all')

  const filteredCrops = CROPS.filter(crop => {
    // 마스터 작물은 3사이클이 지나야만 (currentYear >= 3) 상점에 나타남
    if (crop.isMasterCrop && currentYear < 3) return false
    if (seasonFilter === 'all') return true
    return crop.season.includes(seasonFilter)
  })

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
      {/* 1. 상단 내비게이션 & 배너 */}
      <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 border border-amber-700/40 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-2xl shadow-md shadow-amber-500/30">
            🌱
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">늘봄 농기구 & 종묘 농협 상점</h2>
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-700 px-2 py-0.5 rounded-full font-bold">
                정품 종자 보증
              </span>
            </div>
            <p className="text-xs text-slate-300">
              우수한 사계절 종자를 구입하고 스마트팜 자동화 및 마트 현대화 시설을 확장하세요.
            </p>
          </div>
        </div>

        {/* 서브 탭 전환 버튼 */}
        <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setSubTab('seeds')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subTab === 'seeds'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>사계절 종묘상</span>
          </button>
          <button
            onClick={() => setSubTab('upgrades')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subTab === 'upgrades'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>시설 및 장비 확충</span>
          </button>
        </div>
      </div>

      {/* 2. 사계절 종묘상 탭 */}
      {subTab === 'seeds' && (
        <div className="space-y-4">
          {/* 계절 필터 바 */}
          <div className="flex items-center space-x-2 overflow-x-auto py-1">
            <span className="text-xs font-bold text-slate-400 mr-2 flex-shrink-0">계절별 보기:</span>
            {[
              { id: 'all', name: '전체 작물' },
              { id: 'spring', name: '봄 🌸' },
              { id: 'summer', name: '여름 ☀️' },
              { id: 'autumn', name: '가을 🍁' },
              { id: 'winter', name: '겨울 ❄️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSeasonFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  seasonFilter === tab.id
                    ? 'bg-amber-700 text-white border border-amber-400'
                    : 'bg-farm-card border border-farm-border text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* 사이클 & 마스터 작물 안내 배너 */}
          <div className="bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-600/40 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2.5">
              <span className="text-xl">🌟</span>
              <div>
                <span className="font-bold text-amber-200">
                  현재 진행: {currentYear}년차 사이클 (1계절 = 20일 / 4계절 1사이클 = 80일)
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {currentYear >= 3
                    ? '🎉 3사이클을 완주하여 전설적인 [마스터 작물]이 전면 개방되었습니다! 최고의 수확량과 높은 수익을 누려보세요.'
                    : `사계절 3사이클을 완주하여 3년차에 돌입하면, 숨겨져 있던 명품 [마스터 작물]들이 상점에 모습을 드러냅니다! (현재 진행도: ${currentYear}/3 사이클)`}
                </p>
              </div>
            </div>
          </div>

          {/* 작물 씨앗 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCrops.map(crop => {
              const isLockedByCycle = (crop.unlockCycle || 1) > currentYear
              const canAfford1 = player.gold >= crop.seedPrice && !isLockedByCycle
              const canAfford5 = player.gold >= crop.seedPrice * 5 && !isLockedByCycle
              const isCurrentSeason = crop.season.includes(player.season)
              const yieldCount = crop.yieldCount || 2

              return (
                <div
                  key={crop.id}
                  className={`bg-farm-card border rounded-2xl p-4 shadow-md flex flex-col justify-between space-y-3 transition-all ${
                    isLockedByCycle
                      ? 'border-slate-800 opacity-75 bg-slate-950/60'
                      : crop.isMasterCrop
                      ? 'border-amber-500/60 shadow-amber-950/30'
                      : 'border-farm-border hover:border-slate-600'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-3xl">{crop.icon}</span>
                        <div>
                          <div className="text-sm font-bold text-white flex items-center space-x-1.5">
                            <span>{crop.nameKr}</span>
                            {crop.isMasterCrop && (
                              <span className="text-[9px] bg-amber-500 text-slate-950 font-extrabold px-1.5 py-0.5 rounded shadow">
                                마스터
                              </span>
                            )}
                            {isCurrentSeason && !isLockedByCycle && (
                              <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-1.5 py-0.5 rounded font-bold">
                                제철
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 flex-wrap">
                            <span>생육: <strong className={crop.growthDays >= 5 ? 'text-amber-300 font-bold' : 'text-slate-300'}>{crop.growthDays}일</strong></span>
                            <span>·</span>
                            <span>수확량: <strong className={yieldCount > 2 ? 'text-emerald-300 font-bold' : 'text-slate-300'}>{yieldCount}개</strong></span>
                            <span>·</span>
                            <span>개당 ₩{crop.basePrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-amber-300 font-mono font-bold">
                          ₩{crop.seedPrice.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">씨앗 1포</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 bg-farm-surface/50 p-2.5 rounded-xl border border-farm-border/50">
                      {crop.description}
                    </p>
                  </div>

                  {/* 구매 버튼 또는 해금 조건 */}
                  {isLockedByCycle ? (
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700 text-center flex items-center justify-center space-x-2 text-xs text-amber-300">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>{crop.unlockCycle}년차 사이클 해금 (사계절 1사이클 완주 필요)</span>
                    </div>
                  ) : (
                    <div className="flex space-x-2 pt-1 border-t border-farm-border">
                      <button
                        disabled={!canAfford1}
                        onClick={() => buySeeds(crop.id, 1)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all shadow ${
                          canAfford1
                            ? 'bg-amber-600 hover:bg-amber-500 text-white active:scale-95'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        }`}
                      >
                        1포 구매
                      </button>
                      <button
                        disabled={!canAfford5}
                        onClick={() => buySeeds(crop.id, 5)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all shadow ${
                          canAfford5
                            ? 'bg-amber-700 hover:bg-amber-600 text-white active:scale-95'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        }`}
                      >
                        5포 대량구매
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 3. 시설 및 장비 확충 탭 */}
      {subTab === 'upgrades' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            농장 자동화 기기, 로컬푸드 마트 확장 매대 및 가공실 설비를 업그레이드하세요.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upgrades.map(up => {
              const isMax = up.level >= up.maxLevel
              const canAfford = player.gold >= up.cost && !isMax
              const autoPlanterRange = up.id === 'up_auto_planter' && up.level > 0 ? `${up.level + 1}×${up.level + 1}` : null
              const autoHarvesterRange = up.id === 'up_auto_harvester' && up.level > 0 ? `${up.level + 1}×${up.level + 1}` : null

              return (
                <div
                  key={up.id}
                  className={`bg-farm-card border rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all ${
                    isMax
                      ? 'border-emerald-700/50 bg-emerald-950/10'
                      : canAfford
                      ? 'border-amber-600/70 shadow-amber-950/20'
                      : 'border-farm-border'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-farm-surface border border-farm-border flex items-center justify-center text-2xl shadow-inner">
                      {up.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-white flex items-center space-x-2">
                          <span>{up.name}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                            Lv.{up.level}/{up.maxLevel}
                          </span>
                        </div>
                        {isMax && (
                          <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>최고 등급</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{up.desc}</p>
                      {autoPlanterRange && (
                        <div className="text-[11px] text-cyan-300 font-bold mt-1">
                          현재 자동 파종 범위: {autoPlanterRange}
                        </div>
                      )}
                      {autoHarvesterRange && (
                        <div className="text-[11px] text-amber-300 font-bold mt-1">
                          현재 일괄 수확 범위: {autoHarvesterRange}
                        </div>
                      )}
                      <div className="text-[11px] text-amber-300 font-bold mt-1.5 flex items-center space-x-1">
                        <ArrowUpCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>효과: {up.bonusText}</span>
                      </div>
                    </div>
                  </div>

                  {/* 업그레이드 구매 버튼 */}
                  <div className="pt-2 border-t border-farm-border flex items-center justify-between">
                    <div className="text-xs font-mono font-bold text-amber-300">
                      {!isMax ? `₩${up.cost.toLocaleString()}` : '시공 완료'}
                    </div>

                    <button
                      disabled={!canAfford}
                      onClick={() => buyUpgrade(up.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow ${
                        isMax
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : canAfford
                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/40 active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>{isMax ? '최고 레벨 달성' : '시설 확충하기'}</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
