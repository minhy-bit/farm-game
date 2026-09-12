import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import { SoundSystem } from '../utils/audio'
import { DAYS_PER_SEASON } from '../types/game'
import {
  Sun,
  CloudRain,
  Cloud,
  Sparkles,
  Volume2,
  VolumeX,
  Moon,
  Coins,
  Zap,
  Award,
  Sprout,
  Store,
  Truck,
  Layers,
  ShoppingBag,
  UtensilsCrossed,
  Save,
  LogIn,
  LogOut,
  User
} from 'lucide-react'

export const Header: React.FC = () => {
  const {
    player,
    activeTab,
    setActiveTab,
    sleepNextDay,
    customers,
    toasts,
    currentYear,
    currentSeasonDay,
    currentUser,
    setIsAuthModalOpen,
    saveCurrentGame,
    logoutUser
  } = useGame()
  const [muted, setMuted] = useState(SoundSystem.isMuted())

  const handleSoundToggle = () => {
    const isNowMuted = SoundSystem.toggleSound()
    setMuted(isNowMuted)
  }

  // 계절 라벨 및 스타일
  const seasonLabels = {
    spring: { text: '봄', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50' },
    summer: { text: '여름', color: 'text-amber-400 bg-amber-950/60 border-amber-700/50' },
    autumn: { text: '가을', color: 'text-orange-400 bg-orange-950/60 border-orange-700/50' },
    winter: { text: '겨울', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-700/50' }
  }

  // 날씨 아이콘
  const weatherIcons = {
    sunny: <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />,
    rainy: <CloudRain className="w-4 h-4 text-blue-400" />,
    cloudy: <Cloud className="w-4 h-4 text-slate-300" />,
    rainbow: <Sparkles className="w-4 h-4 text-purple-400" />
  }

  const queuedCustomersCount = customers.filter(c => c.state === 'queued').length

  return (
    <header className="w-full bg-farm-surface/95 pixel-wood border-b-4 border-[#3c261a] sticky top-0 z-30 shadow-[0_4px_0_rgba(60,38,26,.7)]">
      {/* 1. 상단 글로벌 바 */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* 타이틀 및 브랜드 */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-md bg-[#78a947] border-2 border-[#cce579] flex items-center justify-center shadow-[2px_2px_0_#2f541f]">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-[#fff1c9] tracking-tight">늘봄마을 농장일지</h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-sm bg-[#2e2019] text-amber-200 border border-[#966536]">
                농장 일지
              </span>
            </div>
            <p className="text-xs text-amber-100/70 hidden sm:block">
              손으로 가꾸고, 이웃과 나누는 작은 농장
            </p>
          </div>
        </div>

        {/* 플레이어 실시간 스탯 (년차, 계절, 일차, 날씨, 기력, 자금) */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-wrap">
          {/* 년차, 일차 & 계절 */}
          <div className="flex items-center space-x-2 bg-[#2e2019]/80 px-3 py-1.5 rounded-md border-2 border-[#725034] text-xs">
            <span className="font-bold text-amber-300 font-mono flex items-center gap-1">
              <span>{currentYear}년차</span>
              {currentYear >= 2 && (
                <span className="text-[9px] bg-amber-500 text-slate-950 font-extrabold px-1 py-0.2 rounded">
                  마스터
                </span>
              )}
            </span>
            <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${seasonLabels[player.season].color}`}>
              {seasonLabels[player.season].text} {currentSeasonDay}/{DAYS_PER_SEASON}일
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">(Day {player.day})</span>
            <div className="flex items-center space-x-1 pl-1 border-l border-farm-border">
              {weatherIcons[player.weather]}
              <span className="text-slate-300">
                {player.weather === 'sunny' ? '맑음' : player.weather === 'rainy' ? '단비' : '흐림'}
              </span>
            </div>
          </div>

          {/* 기력 게이지 */}
          <div className="flex items-center space-x-2 bg-[#2e2019]/80 px-3 py-1.5 rounded-md border-2 border-[#725034]">
            <Zap className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>기력</span>
                <span className="text-emerald-400 font-bold">{player.stamina} / {player.maxStamina}</span>
              </div>
              <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${(player.stamina / player.maxStamina) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 소지금 */}
          <div className="flex items-center space-x-1.5 bg-[#2e2019]/90 px-3 py-1.5 rounded-md border-2 border-[#b67b36] text-amber-200 font-mono font-bold text-sm shadow-sm">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>₩{player.gold.toLocaleString()}</span>
          </div>

          {/* 명성 / 평판 */}
          <div className="flex items-center space-x-1 bg-[#2e2019]/80 px-2.5 py-1.5 rounded-md border-2 border-[#725034] text-xs text-sky-300">
            <Award className="w-4 h-4 text-sky-400" />
            <span className="font-semibold">{player.reputation}P</span>
          </div>

          {/* 다음 날 취침 버튼 */}
          <button
            onClick={sleepNextDay}
            className="pixel-button flex items-center space-x-1.5 bg-[#5964a8] hover:bg-[#6e79c2] active:translate-x-px active:translate-y-px active:shadow-none text-white text-xs font-bold px-3 py-1.5 transition-all"
            title="하루를 마무리하고 내일 아침으로 이동합니다 (기력 완전 회복)"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>취침 (내일로)</span>
          </button>

          {/* 계정 & 저장 시스템 */}
          {currentUser ? (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => saveCurrentGame(false)}
                className="pixel-button flex items-center space-x-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-2.5 py-1.5 transition-all"
                title="현재 진행 상태를 즉시 저장합니다"
              >
                <Save className="w-3.5 h-3.5" />
                <span>저장</span>
              </button>
              <div 
                className="flex items-center space-x-1 px-2 py-1 bg-[#2e2019] border border-[#8d6238] rounded text-xs text-amber-200"
                title={`로그인된 농부: ${currentUser}`}
              >
                <User className="w-3 h-3 text-amber-400" />
                <span className="font-bold max-w-[80px] truncate">{currentUser}</span>
              </div>
              <button
                onClick={logoutUser}
                className="pixel-button p-1.5 bg-[#3d2417] hover:bg-red-800 text-amber-200 hover:text-white transition-colors"
                title="로그아웃"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="pixel-button flex items-center space-x-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 transition-all animate-pulse"
              title="계정을 만들어 진행상황을 영구 저장하세요"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>로그인/저장</span>
            </button>
          )}

          {/* 사운드 온오프 */}
          <button
            onClick={handleSoundToggle}
            className="pixel-button p-1.5 bg-[#2e2019] hover:bg-[#5a3c29] text-slate-300 hover:text-white transition-colors"
            title={muted ? '음향 켜기' : '음향 끄기'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* 2. 내비게이션 탭 바 (스타듀밸리 + 마트 하이브리드) */}
      <div className="border-t-2 border-[#8d6238] bg-[#2e2019]/45">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-1 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('farm')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'farm'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/40'
                : 'text-slate-300 hover:bg-farm-surfaceHover hover:text-white'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>늘봄 텃밭</span>
          </button>

          <button
            onClick={() => setActiveTab('mart')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all relative ${
              activeTab === 'mart'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-700/40'
                : 'text-slate-300 hover:bg-farm-surfaceHover hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>로컬푸드 마트</span>
            {queuedCustomersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-900 text-xs font-bold flex items-center justify-center animate-bounce">
                {queuedCustomersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('wholesale')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'wholesale'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-700/40'
                : 'text-slate-300 hover:bg-farm-surfaceHover hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>B2B 납품 센터</span>
          </button>

          <button
            onClick={() => setActiveTab('processing')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'processing'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-700/40'
                : 'text-slate-300 hover:bg-farm-surfaceHover hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>저온창고 & 가공실</span>
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'shop'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-700/40'
                : 'text-slate-300 hover:bg-farm-surfaceHover hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>종묘상 & 시설 확충</span>
          </button>

          {/* 6. 요리 및 식당: B2B 납품 3회 이상 달성 시 해금되어 버튼 노출 */}
          {player.contractsFulfilled >= 3 && (
            <button
              onClick={() => setActiveTab('restaurant')}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all relative ${
                activeTab === 'restaurant'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-700/40'
                  : 'text-amber-200 hover:bg-amber-950/40 hover:text-white border border-amber-500/40 bg-amber-950/20'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-400" />
              <span>늘봄 식당</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                NEW
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 실시간 알림 토스트 (우측 상단 오버레이) */}
      <div className="fixed top-20 right-5 z-50 flex flex-col space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-2.5 rounded-xl shadow-lg border text-xs font-medium max-w-sm pointer-events-auto flex items-center space-x-2 animate-fade-in ${
              toast.type === 'success'
                ? 'bg-emerald-900/95 border-emerald-500 text-emerald-100'
                : toast.type === 'warning'
                ? 'bg-amber-900/95 border-amber-500 text-amber-100'
                : 'bg-slate-900/95 border-slate-700 text-slate-200'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </header>
  )
}
