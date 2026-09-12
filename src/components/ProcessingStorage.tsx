import React from 'react'
import { useGame } from '../context/GameContext'
import { CROPS_MAP } from '../data/crops'
import {
  Layers,
  Sparkles,
  Package,
  TrendingUp,
  Flame,
  Droplets,
  SunMedium,
  CheckCircle2,
  Info
} from 'lucide-react'

export const ProcessingStorage: React.FC = () => {
  const { inventory, processCrop, upgrades } = useGame()

  // 수확물 및 가공품 필터링
  const rawCrops = inventory.filter(i => i.type === 'crop' && i.count > 0)
  const processedGoods = inventory.filter(i => i.type === 'processed' && i.count > 0)

  // 가공 가능한 작물 목록 (인벤토리에 있는 것 + 가공 가능한 정의)
  const processableCrops = Array.from(CROPS_MAP.values()).filter(c => c.canProcess)

  const hasJuicer = upgrades.find(u => u.id === 'up_juicer')?.level || 0
  const hasDehydrator = upgrades.find(u => u.id === 'up_dehydrator')?.level || 0

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
      {/* 1. 상단 배너 */}
      <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-700/40 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-2xl shadow-md shadow-purple-500/30">
            🍯
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">현대식 저온창고 & 농식품 가공실</h2>
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-700 px-2 py-0.5 rounded-full font-bold">
                고부가가치 6차 산업
              </span>
            </div>
            <p className="text-xs text-slate-300">
              신선한 원물을 착즙하거나 저온 건조하여 수제청, 사과즙, 말랭이 등 프리미엄 가공식품으로 2~3배의 부가가치를 창출하세요.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-900/60 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center space-x-2">
            <Package className="w-4 h-4 text-purple-400" />
            <div>
              <div className="text-[10px] text-slate-400">보관 중인 가공품</div>
              <div className="font-bold text-purple-300 font-mono">
                {processedGoods.reduce((acc, i) => acc + i.count, 0)}개
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 메인 2단 레이아웃: 저온창고 보관 현황 (좌) / 가공실 설비 (우) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 좌측: 저온창고 보관 작물 현황 */}
        <div className="bg-farm-card border border-farm-border rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-farm-border">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>저온창고 보관 현황</span>
            </h3>
            <span className="text-xs text-slate-400">신선도 안심 보관</span>
          </div>

          {/* 원물 목록 */}
          <div>
            <div className="text-xs font-bold text-slate-400 mb-2">신선 원물 ({rawCrops.length}종)</div>
            {rawCrops.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs bg-farm-surface/40 rounded-xl border border-dashed border-farm-border">
                보관 중인 신선 농작물이 없습니다. 텃밭에서 작물을 수확하세요!
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {rawCrops.map(item => {
                  const crop = CROPS_MAP.get(item.targetId)
                  return (
                    <div
                      key={item.id}
                      className="bg-farm-surface border border-farm-border p-3 rounded-xl flex items-center space-x-3 shadow-sm"
                    >
                      <span className="text-2xl">{crop?.icon || '📦'}</span>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-slate-200 truncate">{item.name}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">수량: {item.count}개</div>
                        <div className="text-[10px] text-amber-300/80 font-mono">개당 ₩{item.unitPrice.toLocaleString()}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 완성된 가공식품 목록 */}
          <div className="pt-3 border-t border-farm-border">
            <div className="text-xs font-bold text-slate-400 mb-2">완제품 가공식품 ({processedGoods.length}종)</div>
            {processedGoods.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs bg-farm-surface/40 rounded-xl border border-dashed border-farm-border">
                아직 생산된 가공품이 없습니다. 우측 가공 설비에서 제조해보세요!
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {processedGoods.map(item => (
                  <div
                    key={item.id}
                    className="bg-purple-950/40 border border-purple-700/50 p-3 rounded-xl flex items-center space-x-3 shadow-sm"
                  >
                    <span className="text-2xl">🍯</span>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-purple-200 truncate">{item.name}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">재고: {item.count}개</div>
                      <div className="text-[10px] text-amber-300 font-mono font-bold">
                        개당 ₩{item.unitPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 우측: 가공 제조 레시피 및 생산 설비 */}
        <div className="bg-farm-card border border-farm-border rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-farm-border">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>농식품 가공 레시피 (착즙 & 건조)</span>
            </h3>
            <span className="text-xs text-purple-300 font-bold">부가가치 UP</span>
          </div>

          <div className="space-y-3">
            {processableCrops.map(crop => {
              const ownedCount =
                inventory.find(i => i.type === 'crop' && i.targetId === crop.id)?.count || 0
              const canMake = ownedCount >= 2 // 2개 소모하여 1개 가공품 제작

              return (
                <div
                  key={crop.id}
                  className={`bg-farm-surface border rounded-xl p-3.5 flex items-center justify-between gap-3 transition-all ${
                    canMake ? 'border-purple-500/60 shadow-md shadow-purple-950/20' : 'border-farm-border opacity-75'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 border border-farm-border flex items-center justify-center text-2xl">
                      {crop.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{crop.processedName}</span>
                        <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded border border-purple-700">
                          {crop.category === 'fruit' ? '착즙 음료' : '건조 가공'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        재료: {crop.nameKr} 2개 소모 → 1병 생산
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] font-mono mt-0.5">
                        <span className="text-slate-400 line-through">
                          ₩{(crop.basePrice * 2).toLocaleString()}
                        </span>
                        <span className="text-amber-300 font-bold">
                          ➔ ₩{crop.processedPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
                    <div className="text-[10px] font-mono text-slate-300">
                      보유 원물: <strong className={ownedCount >= 2 ? 'text-emerald-400' : 'text-rose-400'}>{ownedCount}</strong>/2개
                    </div>
                    <button
                      disabled={!canMake}
                      onClick={() => processCrop(crop.id, 2)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shadow ${
                        canMake
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-700/40 active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>가공 생산</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-farm-bg/60 p-3 rounded-xl border border-farm-border text-[11px] text-slate-400 flex items-center space-x-2">
            <Info className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>
              <strong>가공품 판매 전략</strong>: 가공된 제품은 로컬푸드 마트 매대에 진열하면 관광객과 미식가 손님들에게 매우 높은 가격에 날개 돋친 듯 팔려나갑니다!
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
