import React from 'react'
import { useGame } from '../context/GameContext'
import { CROPS_MAP } from '../data/crops'
import { ToolType } from '../types/game'
import {
  Shovel,
  Droplets,
  Hand,
  Scissors,
  Sparkles,
  Info,
  Calendar,
  CloudSun
} from 'lucide-react'

export const FarmField: React.FC = () => {
  const {
    tiles,
    gridSize,
    selectedTool,
    setSelectedTool,
    selectedSeed,
    setSelectedSeed,
    inventory,
    handleTileClick,
    waterAllTiles,
    upgrades,
    player
  } = useGame()

  // 씨앗 목록 필터링
  const seedItems = inventory.filter(i => i.type === 'seed' && i.count > 0)

  // 도구 목록
  const tools: { id: ToolType; name: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'hoe', name: '호미', icon: <Shovel className="w-5 h-5 text-amber-500" />, desc: '거친 땅을 일궈 밭고랑을 만듭니다.' },
    { id: 'wateringCan', name: '물뿌리개', icon: <Droplets className="w-5 h-5 text-sky-400" />, desc: '씨앗이 자라도록 촉촉하게 물을 줍니다.' },
    { id: 'hand', name: '씨앗 파종', icon: <Hand className="w-5 h-5 text-emerald-400" />, desc: '일군 밭에 씨앗을 정성껏 심습니다.' },
    { id: 'sickle', name: '수확 낫', icon: <Scissors className="w-5 h-5 text-rose-400" />, desc: '완숙된 영양 만점 작물을 베어 수확합니다.' }
  ]

  const hasSprinkler = upgrades.find(u => u.id === 'up_sprinkler')?.level || 0
  const hasGreenhouse = upgrades.find(u => u.id === 'up_greenhouse')?.level || 0

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
      {/* 1. 상단 컨트롤 패널: 도구 바 & 씨앗 선택 */}
      <div className="pixel-frame pixel-wood p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* 농기구 툴바 */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400 mr-1 hidden sm:inline">도구:</span>
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedTool === tool.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/50 scale-105 border border-emerald-400'
                  : 'bg-farm-surface border border-farm-border text-slate-300 hover:bg-farm-surfaceHover'
              }`}
              title={tool.desc}
            >
              {tool.icon}
              <span>{tool.name}</span>
            </button>
          ))}
        </div>

        {/* 씨앗 선택기 */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto py-1">
          <span className="text-xs font-bold text-slate-400 mr-1 flex-shrink-0">보유 씨앗:</span>
          {seedItems.length === 0 ? (
            <span className="text-xs text-amber-300/80 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-800/40">
              보유한 씨앗이 없습니다. [종묘상] 탭에서 씨앗을 구매하세요!
            </span>
          ) : (
            seedItems.map(seed => {
              const crop = CROPS_MAP.get(seed.targetId)
              const isSelected = selectedSeed === seed.targetId
              return (
                <button
                  key={seed.id}
                  onClick={() => {
                    setSelectedSeed(seed.targetId)
                    setSelectedTool('hand') // 씨앗 클릭 시 자동으로 파종 도구로 전환
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/40 border border-amber-300'
                      : 'bg-farm-surface border border-farm-border text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span className="text-base">{crop?.icon || '🌱'}</span>
                  <span>{crop?.nameKr}</span>
                  <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full font-mono text-amber-200">
                    {seed.count}개
                  </span>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* 2. 농장 밭 타일 영역 (스타듀밸리 러스틱 감성) */}
      <div className="relative bg-gradient-to-b from-[#87bd5d] to-[#5d963f] pixel-frame p-6 md:p-8 overflow-hidden">
        {/* 장식용 배경 요소 (울타리와 팻말) */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-farm-border/50">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🏡</span>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                늘봄 햇살 텃밭
                {hasGreenhouse > 0 && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full">
                    온실 설비 가동중
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                타일을 클릭하여 밭 갈기 → 씨앗 심기 → 물주기 → 완숙 작물 수확을 진행하세요.
              </p>
            </div>
          </div>

          {/* 스프링클러 바로가기 */}
          {hasSprinkler > 0 && (
            <button
              onClick={waterAllTiles}
              className="flex items-center space-x-1.5 bg-sky-700 hover:bg-sky-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow transition-all active:scale-95"
            >
              <Droplets className="w-4 h-4 text-sky-200" />
              <span>스프링클러 즉시 가동</span>
            </button>
          )}
        </div>

        {/* 그리드 밭 렌더링 */}
        <div className="flex justify-center items-center py-4">
          <div
            className="grid gap-3 md:gap-4 p-4 rounded-md bg-[#4c7b38] border-4 border-[#3c602d] shadow-inner"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(80px, 110px))`
            }}
          >
            {tiles.map(tile => {
              const crop = tile.cropId ? CROPS_MAP.get(tile.cropId) : null
              const isMature = tile.cropId && tile.currentStage >= 3

              // 타일 배경 색상 (일궈짐 여부, 물 줌 여부)
              let tileBg = 'bg-[#77ad4c] hover:bg-[#8fc45e] border-dashed border-[#477c34]' // 미개간 잔디흙
              if (tile.isTilled) {
                tileBg = tile.isWatered
                  ? 'bg-[#75452f] border-solid border-[#4f2d20] shadow-inner' // 촉촉한 젖은 흙
                  : 'bg-[#a86640] border-solid border-[#d0925e]' // 마른 흙
              }

              return (
                <div
                  key={tile.id}
                  onClick={() => handleTileClick(tile.id)}
                  className={`relative aspect-square rounded-xl border-2 cursor-pointer transition-all duration-150 flex flex-col items-center justify-center select-none group hover:scale-[1.03] hover:z-30 active:scale-95 ${tileBg}`}
                >
                  {/* 물기 반짝임 효과 및 과습 경고 */}
                  {tile.isWatered && (
                    <div className="absolute top-1 right-1 flex items-center space-x-1 z-10">
                      {tile.cropId && (tile.waterCount || 0) >= 4 ? (
                        <span className="text-[9px] font-extrabold px-1 py-0.5 rounded bg-red-600 text-white animate-pulse shadow">
                          과습 4/5
                        </span>
                      ) : tile.cropId && (tile.waterCount || 0) === 3 ? (
                        <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-amber-600 text-white shadow">
                          3/5
                        </span>
                      ) : null}
                      <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shadow-sm shadow-sky-400" />
                    </div>
                  )}

                  {/* 미개간 상태 작은 풀잎/돌멩이 연출 */}
                  {!tile.isTilled && (
                    <span className="text-xs text-emerald-600/70 font-mono select-none">
                      {tile.x % 2 === 0 ? '🌿' : '🪨'}
                    </span>
                  )}

                  {/* 개간 완료 & 빈 밭 */}
                  {tile.isTilled && !tile.cropId && (
                    <div className="w-full h-full flex items-center justify-center opacity-30 group-hover:opacity-70 transition-opacity">
                      <div className="w-4 h-4 rounded-full border border-amber-300/40" />
                    </div>
                  )}

                  {/* 작물 생육 단계 렌더링 */}
                  {tile.cropId && crop && (
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                      {/* 단계 0: 씨앗 구멍 */}
                      {tile.currentStage === 0 && (
                        <div className="flex flex-col items-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-900 border border-amber-600 animate-pulse" />
                          <span className="text-[10px] text-amber-200/90 font-medium mt-1 bg-black/50 px-1.5 py-0.5 rounded shadow-sm">
                            씨앗 ({tile.daysGrown || 0}/{crop.growthDays}일)
                          </span>
                        </div>
                      )}

                      {/* 단계 1: 새싹 */}
                      {tile.currentStage === 1 && (
                        <div className="flex flex-col items-center">
                          <span className="text-2xl animate-bounce-slow">🌱</span>
                          <span className="text-[10px] text-emerald-300 font-semibold mt-0.5 bg-black/50 px-1.5 py-0.5 rounded shadow-sm">
                            새싹 ({tile.daysGrown || 0}/{crop.growthDays}일)
                          </span>
                        </div>
                      )}

                      {/* 단계 2: 성장 중 줄기 */}
                      {tile.currentStage === 2 && (
                        <div className="flex flex-col items-center">
                          <span className="text-2xl">🌿</span>
                          <span className="text-[10px] text-amber-200 font-semibold mt-0.5 bg-black/50 px-1.5 py-0.5 rounded shadow-sm">
                            {crop.nameKr} ({tile.daysGrown || 0}/{crop.growthDays}일)
                          </span>
                        </div>
                      )}

                      {/* 단계 3: 완숙 (수확 가능!) */}
                      {isMature && (
                        <div className="flex flex-col items-center relative">
                          <div className="absolute -top-3 -right-2 text-amber-300 animate-bounce">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <span className="text-3xl md:text-4xl filter drop-shadow-md animate-wiggle">
                            {crop.icon}
                          </span>
                          <span className="mt-1 text-[11px] font-bold text-white bg-emerald-600/90 px-2 py-0.5 rounded-full shadow border border-emerald-400">
                            수확 ({crop.yieldCount || 2}개)!
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 마우스 호버 툴팁 안내 (상단 띄움 및 z-index 최상위 보장) */}
                  <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none z-50 bg-slate-900/95 text-[11px] font-medium text-slate-100 px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap border border-slate-600/80 drop-shadow-lg flex items-center gap-1">
                    <span>
                      {!tile.isTilled
                        ? '호미로 땅 일구기 (미개간/훼손된 밭)'
                        : !tile.cropId
                        ? tile.isWatered
                          ? '씨앗 심기'
                          : '물주기 또는 씨앗 심기'
                        : isMature
                        ? `✨ 클릭하여 수확! (+${crop?.yieldCount || 2}개 획득)`
                        : (tile.waterCount || 0) >= 4
                        ? `⚠️ ${crop?.nameKr} 과습 위험! (한 번 더 주면 썩음: ${tile.waterCount}/5회)`
                        : (tile.waterCount || 0) >= 2
                        ? `${crop?.nameKr} 성장중 (${tile.daysGrown || 0}/${crop?.growthDays}일) 💧물 ${tile.waterCount}/5회`
                        : `${crop?.nameKr} 성장중 (${tile.daysGrown || 0}/${crop?.growthDays}일)`}
                    </span>
                    {/* 말풍선 꼬리표 */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-slate-900/95" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 3. 하단 귀농 꿀팁 바 */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 bg-farm-surface/80 p-3.5 rounded-xl border border-farm-border">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>농사 기본 수칙</strong>: 땅을 일군 후 물을 주면 씨앗이 밤 사이 쑥쑥 자라납니다. 수확한 작물은 [로컬푸드 마트]에서 직판하거나 [B2B 납품 센터]에 납품해 큰돈을 버세요!
            </span>
          </div>
          <div className="flex items-center space-x-3 text-slate-300">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>현재 계절: {player.season === 'spring' ? '봄 🌸' : player.season === 'summer' ? '여름 ☀️' : player.season === 'autumn' ? '가을 🍁' : '겨울 ❄️'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
