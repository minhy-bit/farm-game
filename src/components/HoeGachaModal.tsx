import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import {
  HOE_SKINS,
  HOE_SKINS_MAP,
  HOE_GACHA_SINGLE_COST,
  HOE_GACHA_MULTI_COST,
  HOE_DUPLICATE_GOLD_REFUND
} from '../data/hoeSkins'
import { HoeSkin } from '../types/game'
import {
  Sparkles,
  Award,
  Check,
  RotateCw,
  Gift,
  MousePointer,
  HelpCircle,
  X
} from 'lucide-react'

interface HoeGachaModalProps {
  isOpen: boolean
  onClose: () => void
}

export const HoeGachaModal: React.FC<HoeGachaModalProps> = ({ isOpen, onClose }) => {
  const {
    player,
    hoeGacha,
    drawHoeGacha,
    equipHoeSkin,
    toggleFloatingCursor
  } = useGame()

  const [activeTab, setActiveTab] = useState<'draw' | 'collection'>('draw')
  const [isDrawing, setIsDrawing] = useState(false)
  const [gachaResults, setGachaResults] = useState<{ skin: HoeSkin; isNew: boolean }[] | null>(null)

  if (!isOpen) return null

  const handleDraw = (count: number) => {
    const cost = count === 1 ? HOE_GACHA_SINGLE_COST : HOE_GACHA_MULTI_COST
    if (player.reputation < cost) return

    setIsDrawing(true)
    setGachaResults(null)

    setTimeout(() => {
      const drawn = drawHoeGacha(count)
      setIsDrawing(false)
      if (drawn && drawn.length > 0) {
        // 중복 여부 판정 (현재 unlockedSkinIds에 이미 있었는지 여부 파악)
        setGachaResults(
          drawn.map(s => ({
            skin: s,
            isNew: !hoeGacha.unlockedSkinIds.includes(s.id)
          }))
        )
      }
    }, 900)
  }

  const canAffordSingle = player.reputation >= HOE_GACHA_SINGLE_COST
  const canAffordMulti = player.reputation >= HOE_GACHA_MULTI_COST

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-farm-card border border-amber-500/50 rounded-3xl p-5 md:p-6 max-w-xl w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between pb-3 border-b border-farm-border">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
              🎁
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>늘봄마을 명성 호미 뽑기</span>
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-700 px-2 py-0.5 rounded-full font-bold">
                  명성 럭키 드로우
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                마을에서 쌓은 명성(평판)으로 마우스를 따라다니는 스페셜 호미 스킨을 수집하세요!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 내 명성 잔액 & 마우스 호미 토글 바 */}
        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">내 보유 명성:</span>
            <span className="font-mono font-bold text-amber-300 text-sm">
              ⭐ {player.reputation}P
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleFloatingCursor}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                hoeGacha.isFloatingCursorEnabled
                  ? 'bg-teal-900/60 border-teal-500 text-teal-200'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <MousePointer className="w-3.5 h-3.5" />
              <span>마우스 호미: {hoeGacha.isFloatingCursorEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* 탭 버튼 */}
        <div className="flex space-x-2 border-b border-farm-border pb-1">
          <button
            onClick={() => {
              setActiveTab('draw')
              setGachaResults(null)
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'draw'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-farm-surface'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>호미 뽑기</span>
          </button>
          <button
            onClick={() => setActiveTab('collection')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'collection'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-farm-surface'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>호미 보관함 ({hoeGacha.unlockedSkinIds.length}/{HOE_SKINS.length})</span>
          </button>
        </div>

        {/* 탭 1: 호미 뽑기 */}
        {activeTab === 'draw' && (
          <div className="space-y-4">
            {/* 뽑기 메인 비주얼 */}
            <div className="relative rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-yellow-950/40 border border-amber-600/40 p-6 text-center overflow-hidden shadow-inner">
              <div className="relative z-10 space-y-2">
                <div className="text-6xl my-2 animate-bounce-slow">
                  {isDrawing ? '🌀' : '✨🌾✨'}
                </div>
                <h3 className="text-sm font-bold text-amber-200">
                  {isDrawing ? '신비로운 호미를 추첨하는 중...' : '행운의 명성 호미 가챠 머신'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  명성을 소모하여 전설의 황금 신농 호미와 환상 오로라 무지개 호미를 뽑아보세요!
                </p>
                <div className="pt-1 text-[11px] text-amber-400/80">
                  💡 이미 보유한 호미가 중복으로 나오면 <strong>보상금 ₩{HOE_DUPLICATE_GOLD_REFUND.toLocaleString()}</strong> 지급!
                </div>
              </div>
            </div>

            {/* 뽑기 결과 노출 구역 */}
            {gachaResults && (
              <div className="bg-slate-900/90 border border-amber-500/50 rounded-2xl p-4 space-y-3 animate-fade-in shadow-xl">
                <div className="text-xs font-bold text-amber-300 flex items-center justify-between">
                  <span>🎉 뽑기 결과:</span>
                  <span className="text-[11px] text-slate-400">보관함에서 언제든 장착 가능합니다</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {gachaResults.map((res, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2.5 p-2 rounded-xl bg-farm-surface border border-slate-700"
                    >
                      <span className="text-2xl">{res.skin.icon}</span>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-white truncate">{res.skin.name}</span>
                          <span
                            className="text-[9px] px-1 py-0.2 rounded font-bold"
                            style={{ backgroundColor: `${res.skin.color}25`, color: res.skin.color }}
                          >
                            {res.skin.gradeName}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {res.isNew ? (
                            <span className="text-emerald-400 font-bold">✨ NEW 신규 획득!</span>
                          ) : (
                            <span className="text-amber-300 font-bold">중복: ₩{HOE_DUPLICATE_GOLD_REFUND.toLocaleString()} 환급</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 뽑기 실행 버튼들 */}
            <div className="flex space-x-3 pt-2">
              <button
                disabled={!canAffordSingle || isDrawing}
                onClick={() => handleDraw(1)}
                className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-0.5 shadow-lg ${
                  canAffordSingle && !isDrawing
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-700/40 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <span>1회 뽑기</span>
                <span className="text-[11px] font-mono text-amber-200">명성 {HOE_GACHA_SINGLE_COST}P</span>
              </button>

              <button
                disabled={!canAffordMulti || isDrawing}
                onClick={() => handleDraw(5)}
                className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-0.5 shadow-lg ${
                  canAffordMulti && !isDrawing
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-orange-700/40 active:scale-95 ring-1 ring-amber-400'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>5회 연속 뽑기</span>
                  <span className="text-[9px] bg-red-600 text-white px-1 py-0.2 rounded font-bold">할인</span>
                </div>
                <span className="text-[11px] font-mono text-amber-200">명성 {HOE_GACHA_MULTI_COST}P</span>
              </button>
            </div>
          </div>
        )}

        {/* 탭 2: 호미 보관함 & 도감 */}
        {activeTab === 'collection' && (
          <div className="space-y-3">
            <div className="text-[11px] text-slate-400">
              보유한 호미 스킨을 선택하여 즉시 장착할 수 있습니다. 마우스 커서 옆에 착용된 호미가 표시됩니다.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {HOE_SKINS.map(skin => {
                const isUnlocked = hoeGacha.unlockedSkinIds.includes(skin.id)
                const isEquipped = hoeGacha.equippedSkinId === skin.id

                return (
                  <div
                    key={skin.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      isEquipped
                        ? 'bg-teal-950/70 border-teal-400 shadow-md shadow-teal-950/40'
                        : isUnlocked
                        ? 'bg-farm-surface border-farm-border'
                        : 'bg-slate-950/60 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{
                          backgroundColor: `${skin.color}20`,
                          border: `1px solid ${skin.color}50`
                        }}
                      >
                        {isUnlocked ? skin.icon : '🔒'}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-white truncate">{skin.name}</span>
                          <span
                            className="text-[9px] px-1.5 py-0.2 rounded font-bold"
                            style={{ backgroundColor: `${skin.color}30`, color: skin.color }}
                          >
                            {skin.gradeName}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {isUnlocked ? skin.description : '명성 뽑기로 획득 가능'}
                        </p>
                      </div>
                    </div>

                    <div className="ml-2 flex-shrink-0">
                      {isEquipped ? (
                        <span className="text-[10px] bg-teal-600 text-white font-bold px-2 py-1 rounded-lg flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>착용중</span>
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => equipHoeSkin(skin.id)}
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-2.5 py-1 rounded-lg border border-slate-600 transition-colors"
                        >
                          장착
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">미보유</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
