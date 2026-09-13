import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import { CROPS_MAP } from '../data/crops'
import { MartShelf } from '../types/game'
import {
  Store,
  PlusCircle,
  RotateCcw,
  Sparkles,
  Heart,
  TrendingUp,
  UserCheck,
  ShoppingBag,
  DollarSign,
  Info,
  Check
} from 'lucide-react'

export const LocalMart: React.FC = () => {
  const {
    shelves,
    stockShelf,
    clearShelf,
    inventory,
    customers,
    checkoutCustomer,
    player,
    upgrades
  } = useGame()

  // 모달 상태: 진열할 매대 선택
  const [selectedShelf, setSelectedShelf] = useState<MartShelf | null>(null)
  const [selectedItemTargetId, setSelectedItemTargetId] = useState<string>('')
  const [stockCount, setStockCount] = useState<number>(5)
  const [priceTier, setPriceTier] = useState<'-10' | '0' | '+10'>('0')
  const [customPrice, setCustomPrice] = useState<number>(2500)

  // 진열 가능한 인벤토리 (농작물 + 가공품)
  const sellableItems = inventory.filter(
    i => (i.type === 'crop' || i.type === 'processed') && i.count > 0
  )

  const hasSmartPos = upgrades.find(u => u.id === 'up_smart_pos')?.level || 0
  const hasColdShowcase = upgrades.find(u => u.id === 'up_cold_showcase')?.level || 0
  const selectedItem = sellableItems.find(item => item.targetId === selectedItemTargetId)
  const selectedBasePrice = selectedItem?.unitPrice || CROPS_MAP.get(selectedItemTargetId)?.basePrice || 0

  const getCalculatedPrice = (basePrice: number, tier: '-10' | '0' | '+10') => {
    if (tier === '-10') return Math.round(basePrice * 0.9)
    if (tier === '+10') return Math.round(basePrice * 1.1)
    return basePrice
  }

  // 진열 모달 열기
  const handleOpenStockModal = (shelf: MartShelf) => {
    setSelectedShelf(shelf)
    if (sellableItems.length > 0) {
      const first = sellableItems[0]
      const cropDef = CROPS_MAP.get(first.targetId)
      const basePrice = first.unitPrice || cropDef?.basePrice || 2000
      setSelectedItemTargetId(first.targetId)
      setStockCount(Math.min(first.count, 5))
      setPriceTier('0')
      setCustomPrice(basePrice)
    }
  }

  // 상품 선택 시
  const handleSelectItem = (targetId: string) => {
    setSelectedItemTargetId(targetId)
    const item = sellableItems.find(i => i.targetId === targetId)
    const available = inventory
      .filter(i => i.targetId === targetId)
      .reduce((sum, i) => sum + i.count, 0)
    const cropDef = CROPS_MAP.get(targetId)
    const basePrice = item?.unitPrice || cropDef?.basePrice || 2000
    setStockCount(Math.min(Math.max(1, available), 5))
    setCustomPrice(getCalculatedPrice(basePrice, priceTier))
  }

  // 가격 티어(-10%, 정가, +10%) 변경 시
  const handleSelectPriceTier = (tier: '-10' | '0' | '+10') => {
    setPriceTier(tier)
    setCustomPrice(getCalculatedPrice(selectedBasePrice, tier))
  }

  // 진열 확정
  const handleConfirmStock = () => {
    if (!selectedShelf || !selectedItemTargetId) return
    const finalCount = Math.min(stockCount, 5)
    stockShelf(selectedShelf.id, selectedItemTargetId, finalCount, customPrice)
    setSelectedShelf(null)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
      {/* 1. 마트 현황 및 통계 대시보드 */}
      <div className="bg-gradient-to-r from-teal-900/50 to-emerald-900/50 border border-teal-700/40 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-2xl shadow-md shadow-teal-500/30">
            🏪
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">늘봄 로컬푸드 직판장</h2>
              <span className="text-[10px] bg-teal-950 text-teal-300 border border-teal-700 px-2 py-0.5 rounded-full font-bold">
                산지직송 100%
              </span>
            </div>
            <p className="text-xs text-slate-300">
              직접 땀 흘려 기른 친환경 농작물과 가공식품을 진열하여 이웃 주민과 관광객에게 판매합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className="bg-slate-900/60 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-teal-400" />
            <div>
              <div className="text-[10px] text-slate-400">누적 방문 손님</div>
              <div className="font-bold text-slate-100 font-mono">{player.martCustomersServed}명</div>
            </div>
          </div>

          <div className="bg-slate-900/60 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400">마트 평판도</div>
              <div className="font-bold text-amber-300 font-mono">⭐ {player.reputation}P</div>
            </div>
          </div>

          {hasSmartPos > 0 && (
            <div className="bg-teal-950/80 text-teal-300 border border-teal-700 px-3 py-2 rounded-xl font-bold flex items-center space-x-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>자동 POS 가동중</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. 메인 매장 구역 (진열대 + 계산대 & 실시간 손님) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 좌측: 매대 진열대 그리드 (2칸 차지) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>매장 진열대 ({shelves.length}개 운영 중)</span>
            </h3>
            <span className="text-xs text-slate-400">
              {hasColdShowcase > 0 ? '❄️ 냉장 쇼케이스로 신선도 100% 유지' : '💡 신선한 상태일수록 손님이 더 빨리 구매합니다'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shelves.map(shelf => {
              const crop = shelf.cropId ? CROPS_MAP.get(shelf.cropId) : null
              const hasStock = shelf.cropId && shelf.stock > 0

              return (
                <div
                  key={shelf.id}
                  className={`bg-farm-card border rounded-2xl p-4 transition-all relative shadow-md flex flex-col justify-between ${
                    hasStock ? 'border-teal-700/60 shadow-teal-950/20' : 'border-farm-border border-dashed'
                  }`}
                >
                  {/* 상단 매대 헤더 */}
                  <div className="flex items-center justify-between pb-2 border-b border-farm-border">
                    <span className="text-xs font-bold text-slate-300">{shelf.name}</span>
                    {hasStock && (
                      <button
                        onClick={() => clearShelf(shelf.id)}
                        className="text-[10px] text-slate-400 hover:text-rose-300 flex items-center space-x-1 transition-colors"
                        title="진열 상품을 창고로 다시 회수합니다"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>회수</span>
                      </button>
                    )}
                  </div>

                  {/* 매대 중앙 콘텐츠 */}
                  <div className="py-4 flex items-center space-x-4">
                    {hasStock && crop ? (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-teal-950/70 border border-teal-700/50 flex items-center justify-center text-3xl shadow-inner">
                          {crop.icon}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-sm font-bold text-white">{crop.nameKr}</span>
                            {shelf.quality === 'supreme' && (
                              <span className="text-[9px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-600 font-bold">
                                특등
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-amber-300 font-mono font-bold">
                            ₩{shelf.price.toLocaleString()}
                            <span className="text-[10px] text-slate-400 font-normal ml-1">/ 개</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            남은 재고: <strong className="text-teal-300 font-mono">{shelf.stock}개</strong>
                          </div>
                          <div className={`text-[10px] font-bold ${
                            shelf.price > Math.round(shelf.basePrice * 1.101)
                              ? 'text-rose-400'
                              : shelf.price < shelf.basePrice
                              ? 'text-emerald-400'
                              : shelf.price > shelf.basePrice
                              ? 'text-amber-300'
                              : 'text-teal-300'
                          }`}>
                            {shelf.price > Math.round(shelf.basePrice * 1.101)
                              ? '가격이 기준가보다 10%를 초과하여 판매되지 않습니다'
                              : shelf.price < shelf.basePrice
                              ? '할인 특가(-10%): 손님이 더 빠르게 구매합니다'
                              : shelf.price > shelf.basePrice
                              ? '프리미엄(+10%): 고수익 (주의: 거래 평판 감소 또는 보유 명성 실추 위험)'
                              : '정가 판매: 표준 속도로 구매합니다'}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full py-6 flex flex-col items-center justify-center text-slate-400 space-y-2">
                        <span className="text-2xl opacity-40">🧺</span>
                        <span className="text-xs">매대가 비어 있습니다.</span>
                        <button
                          onClick={() => handleOpenStockModal(shelf)}
                          className="mt-1 flex items-center space-x-1.5 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow transition-all active:scale-95"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>상품 진열하기</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 매대 하단 신선도 바 */}
                  {hasStock && (
                    <div className="pt-2 border-t border-farm-border flex items-center justify-between text-[11px] text-slate-400">
                      <span>신선도</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${shelf.freshness}%` }}
                          />
                        </div>
                        <span className="font-mono text-emerald-400 font-bold">{shelf.freshness}%</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 우측: 계산 카운터 & 실시간 손님 동선 (1칸 차지) */}
        <div className="bg-farm-card border border-farm-border rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-farm-border">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Store className="w-4 h-4 text-amber-400" />
                <span>카운터 & 방문 손님 ({customers.length}명)</span>
              </h3>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                실시간 영업중
              </span>
            </div>

            {/* 방문 손님 목록 */}
            <div className="mt-4 space-y-3">
              {customers.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs text-center space-y-2">
                  <span className="text-3xl opacity-50">🚶‍♂️</span>
                  <span>아직 매장을 둘러보는 손님이 없습니다.</span>
                  <span className="text-[11px] text-slate-500">매대에 신선한 작물을 진열하면 손님이 찾아옵니다!</span>
                </div>
              ) : (
                customers.map(cust => (
                  <div
                    key={cust.id}
                    className="bg-farm-surface border border-farm-border rounded-xl p-3 shadow-sm space-y-2 transition-all hover:border-slate-600"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{cust.avatar}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-200">{cust.name}</div>
                          <div className="text-[10px] text-slate-400">{cust.role}</div>
                        </div>
                      </div>

                      {/* 상태 뱃지 */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          cust.state === 'queued'
                            ? 'bg-amber-950 text-amber-300 border border-amber-700 animate-pulse'
                            : cust.state === 'leaving'
                            ? 'bg-emerald-950 text-emerald-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {cust.state === 'queued' ? '계산 대기' : cust.state === 'leaving' ? '구매 완료' : '쇼핑중'}
                      </span>
                    </div>

                    {/* 말풍선 */}
                    {cust.bubble && (
                      <div className="bg-slate-900/80 text-[11px] text-teal-200 px-2.5 py-1.5 rounded-lg border border-slate-800">
                        "{cust.bubble}"
                      </div>
                    )}

                    {/* 장바구니 품목 & 계산 버튼 */}
                    {cust.state === 'queued' && cust.cart.length > 0 && (
                      <div className="pt-2 border-t border-farm-border flex items-center justify-between">
                        <div className="text-xs">
                          <span className="text-slate-400">장바구니: </span>
                          <span className="text-white font-bold">
                            {cust.cart.map(c => `${c.name} ${c.count}개`).join(', ')}
                          </span>
                          <div className="text-amber-300 font-mono font-bold mt-0.5">
                            총 ₩{cust.cart.reduce((s, i) => s + i.unitPrice * i.count, 0).toLocaleString()}
                          </div>
                        </div>

                        <button
                          onClick={() => checkoutCustomer(cust.id)}
                          className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md transition-all shadow-emerald-700/40"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>계산하기</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-farm-bg/60 p-3 rounded-xl border border-farm-border text-[11px] text-slate-400 flex items-center space-x-2">
            <Info className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span>
              <strong>마트 운영 팁</strong>: 정가보다 살짝 저렴하게 가격을 책정하면 손님들의 만족도와 평판이 빠르게 올라갑니다!
            </span>
          </div>
        </div>
      </div>

      {/* 3. 진열 모달 */}
      {selectedShelf && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-farm-card border border-farm-border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-farm-border">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>🧺</span>
                <span>{selectedShelf.name} 상품 진열</span>
              </h3>
              <button
                onClick={() => setSelectedShelf(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {sellableItems.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs space-y-2">
                <span className="text-3xl">🌾</span>
                <p>인벤토리에 진열할 수확물이나 가공품이 없습니다.</p>
                <p className="text-[11px] text-slate-500">텃밭에서 작물을 먼저 수확해주세요!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 1. 상품 선택 */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">진열할 품목 선택:</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                    {sellableItems.map(item => {
                      const crop = CROPS_MAP.get(item.targetId)
                      const isSelected = selectedItemTargetId === item.targetId
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectItem(item.targetId)}
                          className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left text-xs transition-all ${
                            isSelected
                              ? 'bg-teal-900/70 border-teal-400 text-white font-bold ring-1 ring-teal-400'
                              : 'bg-farm-surface border-farm-border text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <span className="text-xl">{crop?.icon || '📦'}</span>
                          <div className="overflow-hidden">
                            <div className="truncate">{item.name}</div>
                            <div className="text-[10px] text-teal-300 font-mono">보유: {item.count}개</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 2. 진열 수량 조절 (최대 5개 제한) */}
                <div>
                  {(() => {
                    const availableCount = inventory
                      .filter(i => i.targetId === selectedItemTargetId)
                      .reduce((sum, i) => sum + i.count, 0)
                    const maxStockLimit = Math.min(5, availableCount || 1)

                    return (
                      <>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                            <span>진열 수량:</span>
                            <span className="text-teal-300 font-mono font-bold text-sm">{stockCount}개</span>
                            <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">1회 최대 5개</span>
                          </label>
                          <span className="text-[11px] text-slate-400">
                            보유: <strong className="text-slate-200 font-mono">{availableCount}개</strong>
                          </span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <input
                            type="range"
                            min="1"
                            max={maxStockLimit}
                            value={Math.min(stockCount, maxStockLimit)}
                            onChange={e => setStockCount(Math.min(5, parseInt(e.target.value) || 1))}
                            className="flex-1 accent-teal-500 cursor-pointer"
                          />
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map(cnt => (
                              <button
                                key={cnt}
                                type="button"
                                disabled={cnt > availableCount}
                                onClick={() => setStockCount(cnt)}
                                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                                  stockCount === cnt
                                    ? 'bg-teal-600 text-white shadow-sm ring-1 ring-teal-400'
                                    : cnt > availableCount
                                    ? 'bg-slate-900/40 text-slate-600 border border-slate-800 cursor-not-allowed'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                                }`}
                              >
                                {cnt}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>

                {/* 3. 판매 가격 책정 (-10%, 정가, +10%) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      판매 가격 (기준가: <span className="font-mono text-slate-200">₩{selectedBasePrice.toLocaleString()}</span>)
                    </label>
                    <span className="text-sm font-bold text-amber-300 font-mono">
                      개당 ₩{customPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {/* -10% 할인 */}
                    <button
                      type="button"
                      onClick={() => handleSelectPriceTier('-10')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                        priceTier === '-10'
                          ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-md shadow-emerald-950/50 ring-2 ring-emerald-500/50'
                          : 'bg-farm-surface border-farm-border text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                        <span>-10%</span>
                        <span className="text-[9px] bg-emerald-900/80 px-1 py-0.5 rounded text-emerald-300 font-normal">할인</span>
                      </span>
                      <span className="text-xs font-mono font-bold">
                        ₩{Math.round(selectedBasePrice * 0.9).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400">⚡ 빠른 회전</span>
                    </button>

                    {/* 정가 */}
                    <button
                      type="button"
                      onClick={() => handleSelectPriceTier('0')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                        priceTier === '0'
                          ? 'bg-teal-950/80 border-teal-400 text-white shadow-md shadow-teal-950/50 ring-2 ring-teal-500/50'
                          : 'bg-farm-surface border-farm-border text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-[11px] font-bold text-teal-300 flex items-center space-x-1">
                        <span>정가</span>
                        <span className="text-[9px] bg-teal-900/80 px-1 py-0.5 rounded text-teal-300 font-normal">표준</span>
                      </span>
                      <span className="text-xs font-mono font-bold">
                        ₩{selectedBasePrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400">⚖️ 표준 속도</span>
                    </button>

                    {/* +10% 할증 */}
                    <button
                      type="button"
                      onClick={() => handleSelectPriceTier('+10')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                        priceTier === '+10'
                          ? 'bg-amber-950/80 border-amber-400 text-white shadow-md shadow-amber-950/50 ring-2 ring-amber-500/50'
                          : 'bg-farm-surface border-farm-border text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-[11px] font-bold text-amber-400 flex items-center space-x-1">
                        <span>+10%</span>
                        <span className="text-[9px] bg-amber-900/80 px-1 py-0.5 rounded text-amber-300 font-normal">고마진</span>
                      </span>
                      <span className="text-xs font-mono font-bold">
                        ₩{Math.round(selectedBasePrice * 1.1).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400">💎 고수익</span>
                    </button>
                  </div>

                  {/* 완판 시 예상 수익 */}
                  <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      총 {Math.min(stockCount, 5)}개 완판 시 예상 수익:
                    </span>
                    <span className="font-mono font-bold text-amber-300">
                      ₩{(customPrice * Math.min(stockCount, 5)).toLocaleString()}
                    </span>
                  </div>

                  {/* 바가지 요금 주의 경고문 (확률 수치는 생략) */}
                  {priceTier === '+10' && (
                    <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-600/70 text-rose-200 flex items-start space-x-2 animate-fade-in shadow-inner">
                      <span className="text-sm flex-shrink-0 mt-0.5">⚠️</span>
                      <div className="space-y-0.5 text-left">
                        <div className="text-[11px] font-bold text-rose-300">바가지 요금 주의 경고</div>
                        <p className="text-[10px] text-rose-200/90 leading-tight">
                          정가보다 높은 가격으로 판매할 경우, 손님들의 불만으로 인해 결제 시 얻는 평판이 감소하거나 마을에서 쌓은 명성이 급격히 실추될 수 있습니다.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 버튼 */}
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setSelectedShelf(null)}
                    className="flex-1 py-2.5 rounded-xl border border-farm-border text-slate-300 text-xs font-bold hover:bg-farm-surface"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleConfirmStock}
                    className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-700/40 flex items-center justify-center space-x-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>진열 완료</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
