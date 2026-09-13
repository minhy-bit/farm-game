import React from 'react'
import { useGame } from '../context/GameContext'
import { CROPS_MAP } from '../data/crops'
import { RESTAURANT_UNLOCK_CONTRACTS } from '../data/gameBalance'
import {
  Truck,
  Building2,
  Calendar,
  CheckCircle2,
  Coins,
  Award,
  PackageCheck,
  AlertCircle,
  Clock,
  RefreshCw
} from 'lucide-react'

export const WholesaleHub: React.FC = () => {
  const {
    contracts,
    fulfillContract,
    renewContract,
    refreshExpiredContracts,
    inventory,
    player
  } = useGame()

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
      {/* 1. 상단 B2B 센터 배너 */}
      <div className="bg-gradient-to-r from-sky-900/50 to-blue-900/50 border border-sky-700/40 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center text-2xl shadow-md shadow-sky-500/30">
            🚚
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">현대식 B2B 대량 납품 물류센터</h2>
              <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-700 px-2 py-0.5 rounded-full font-bold">
                공식 파트너십
              </span>
            </div>
            <p className="text-xs text-slate-300">
              지역 농협, 수도권 새벽배송 플랫폼, 친환경 학교 급식센터와의 정기 발주 계약을 체결하고 대량 현금을 확보하세요.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className="bg-slate-900/60 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center space-x-2">
            <PackageCheck className="w-4 h-4 text-sky-400" />
            <div>
              <div className="text-[10px] text-slate-400">완료한 납품 실적</div>
              <div className="font-bold text-slate-100 font-mono">{player.contractsFulfilled}건</div>
            </div>
          </div>

          <div className="bg-slate-900/60 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400">납품 신뢰도</div>
              <div className="font-bold text-amber-300 font-mono">1급 우수농가</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 늘봄 식당 연계 해금 진행도 배너 */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md ${
        player.contractsFulfilled >= RESTAURANT_UNLOCK_CONTRACTS
          ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
          : 'bg-slate-900/80 border-sky-600/40 text-slate-300'
      }`}>
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{player.contractsFulfilled >= RESTAURANT_UNLOCK_CONTRACTS ? '🍽️' : '🔒'}</span>
          <div>
            <div className="font-bold flex items-center gap-2">
              <span>{player.contractsFulfilled >= RESTAURANT_UNLOCK_CONTRACTS ? '🎉 늘봄 식당 부지 매입 해금 완료!' : '늘봄 식당 & 요리 시스템 해금 과제'}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                player.contractsFulfilled >= RESTAURANT_UNLOCK_CONTRACTS
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                  : 'bg-sky-950 text-sky-300 border border-sky-700'
              }`}>
                {player.contractsFulfilled >= RESTAURANT_UNLOCK_CONTRACTS
                  ? `해금 완료 (${RESTAURANT_UNLOCK_CONTRACTS}/${RESTAURANT_UNLOCK_CONTRACTS})`
                  : `진행도: ${player.contractsFulfilled} / ${RESTAURANT_UNLOCK_CONTRACTS}회`}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {player.contractsFulfilled >= RESTAURANT_UNLOCK_CONTRACTS
                ? '축하합니다! 상단 메뉴의 [늘봄 식당] 탭에서 식당 부지를 인수하고 주방 조리기구를 구비하여 요리를 시작하세요.'
                : `B2B 대량 납품을 총 ${RESTAURANT_UNLOCK_CONTRACTS}회 완료하면 상단 탭에 [늘봄 식당] 버튼이 나타나 식당을 개업하고 요리를 할 수 있습니다. (${Math.max(0, RESTAURANT_UNLOCK_CONTRACTS - player.contractsFulfilled)}회 남음)`}
            </p>
          </div>
        </div>
      </div>

      {/* 2. 발주 계약서 그리드 */}
      {(() => {
        const expiredContractsCount = contracts.filter(c => !c.isCompleted && c.deadlineDay < player.day).length

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-slate-200">
                  진행 중인 정기 발주 계약서 ({contracts.length}건)
                </h3>
                {expiredContractsCount > 0 && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-600 font-bold animate-pulse">
                    기한 만료 {expiredContractsCount}건
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {expiredContractsCount > 0 && (
                  <button
                    onClick={() => refreshExpiredContracts()}
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-amber-600/30 transition-all active:scale-95"
                    title="기한이 지난 계약서를 모두 새로운 제철 품목 계약서로 교체합니다"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>만료 계약 일괄 갱신 ({expiredContractsCount}건)</span>
                  </button>
                )}
                <span className="text-xs text-slate-400 hidden md:inline">
                  납품 기한(Deadline) 내에 수확물을 트럭에 적재하여 출하하세요!
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contracts.map(contract => {
                const crop = CROPS_MAP.get(contract.cropId)
                const currentOwned = inventory
                  .filter(i => i.type === 'crop' && i.targetId === contract.cropId)
                  .reduce((sum, i) => sum + i.count, 0)
                const daysLeft = contract.deadlineDay - player.day
                const isExpired = !contract.isCompleted && daysLeft < 0
                const canFulfill = currentOwned >= contract.requiredCount && !contract.isCompleted && !isExpired

                return (
                  <div
                    key={contract.id}
                    className={`bg-farm-card border rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all ${
                      contract.isCompleted
                        ? 'border-emerald-700/40 opacity-80'
                        : isExpired
                        ? 'border-rose-600/60 bg-rose-950/25 shadow-rose-950/30'
                        : canFulfill
                        ? 'border-sky-500 shadow-sky-950/40'
                        : 'border-farm-border'
                    }`}
                  >
                    {/* 헤더 */}
                    <div className="flex items-center justify-between pb-3 border-b border-farm-border">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{crop?.icon || '📦'}</span>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                            <span>{contract.clientName}</span>
                          </div>
                          <div className="text-[10px] text-sky-300 font-semibold">{contract.clientBadge}</div>
                        </div>
                      </div>

                      {/* 상태 뱃지 */}
                      {contract.isCompleted ? (
                        <span className="flex items-center space-x-1 bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>출하 완료</span>
                        </span>
                      ) : isExpired ? (
                        <span className="flex items-center space-x-1 bg-rose-950 text-rose-300 border border-rose-600 text-xs px-2.5 py-1 rounded-full font-bold">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>기한 만료 ({Math.abs(daysLeft)}일 경과)</span>
                        </span>
                      ) : daysLeft === 0 ? (
                        <span className="flex items-center space-x-1 bg-amber-950 text-amber-300 border border-amber-600 text-xs px-2.5 py-1 rounded-full font-bold animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                          <span>오늘 마감 (D-Day)</span>
                        </span>
                      ) : (
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1 ${
                            daysLeft === 1
                              ? 'bg-amber-950 text-amber-300 border border-amber-700'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{daysLeft === 1 ? '마감 임박 (D-1일)' : `마감까지 D-${daysLeft}일`}</span>
                        </span>
                      )}
                    </div>

                    {/* 본문 내용 & 필요 수량 */}
                    <div className="space-y-3">
                      <p className="text-xs text-slate-300 leading-relaxed bg-farm-surface/60 p-3 rounded-xl border border-farm-border/60">
                        "{contract.description}"
                      </p>

                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{crop?.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-slate-200">{contract.cropName}</div>
                            <div className="text-[10px] text-slate-400">계약 요구 수량</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-mono font-bold">
                            <span className={isExpired ? 'text-slate-400' : currentOwned >= contract.requiredCount ? 'text-emerald-400' : 'text-rose-400'}>
                              {currentOwned}
                            </span>
                            <span className="text-slate-400"> / {contract.requiredCount}개</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {isExpired
                              ? '기한 초과됨'
                              : currentOwned >= contract.requiredCount
                              ? '준비 완료!'
                              : '수확 필요'}
                          </div>
                        </div>
                      </div>

                      {/* 보상 정보 */}
                      <div className="flex items-center justify-between text-xs px-1">
                        <div className="flex items-center space-x-1.5 text-amber-300 font-mono font-bold">
                          <Coins className="w-4 h-4 text-amber-400" />
                          <span>₩{contract.rewardGold.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center space-x-1 text-sky-300 font-semibold text-[11px]">
                          <Award className="w-3.5 h-3.5 text-sky-400" />
                          <span>평판 +{contract.rewardReputation}P</span>
                        </div>
                      </div>
                    </div>

                    {/* 하단 액션 버튼 영역 */}
                    {isExpired ? (
                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => renewContract(contract.id)}
                          className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-md shadow-amber-600/30 transition-all active:scale-98"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>기한 만료 · 새 발주 품목으로 대체하기</span>
                        </button>
                        <p className="text-[11px] text-center text-rose-300/80">
                          납품 기한이 지났습니다. 버튼을 누르면 새로운 제철 품목 계약서가 발급됩니다.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 pt-1">
                        <button
                          disabled={!canFulfill}
                          onClick={() => fulfillContract(contract.id)}
                          className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-md ${
                            contract.isCompleted
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : canFulfill
                              ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/40 active:scale-98'
                              : 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                          }`}
                        >
                          <Truck className="w-4 h-4" />
                          <span>
                            {contract.isCompleted
                              ? '납품 및 정산 완료됨'
                              : canFulfill
                              ? '트럭에 적재하여 즉시 납품 출하!'
                              : `수확물 부족 (${currentOwned}/${contract.requiredCount})`}
                          </span>
                        </button>

                        {!contract.isCompleted && (
                          <div className="flex justify-end">
                            <button
                              onClick={() => renewContract(contract.id)}
                              className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center space-x-1 py-1 px-2 rounded hover:bg-slate-800/60 transition-colors"
                              title="다른 작물의 새로운 발주 계약서로 변경합니다"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>새 품목으로 계약 변경</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
