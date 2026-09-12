import React, { useState, useEffect } from 'react'
import { useGame } from '../context/GameContext'
import { UserProfile } from '../types/auth'
import {
  User,
  KeyRound,
  Sprout,
  LogIn,
  UserPlus,
  Trash2,
  Calendar,
  Coins,
  X,
  Sparkles,
  Award
} from 'lucide-react'

export const AuthModal: React.FC = () => {
  const {
    currentUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginUser,
    registerUser,
    deleteUser,
    getUserProfiles
  } = useGame()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [userList, setUserList] = useState<UserProfile[]>([])

  useEffect(() => {
    if (isAuthModalOpen) {
      setUserList(getUserProfiles())
      setError(null)
      setUsername('')
      setPassword('')
    }
  }, [isAuthModalOpen, getUserProfiles])

  if (!isAuthModalOpen) return null

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)
    if (!username.trim()) {
      setError('농부 닉네임을 입력해주세요!')
      return
    }
    const res = loginUser(username.trim(), password)
    if (!res.success) {
      setError(res.message)
    } else {
      setIsAuthModalOpen(false)
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!username.trim()) {
      setError('원하시는 농부 닉네임을 입력해주세요!')
      return
    }
    if (username.trim().length < 2 || username.trim().length > 12) {
      setError('닉네임은 2자 이상 12자 이하로 입력해주세요.')
      return
    }
    const res = registerUser(username.trim(), password)
    if (!res.success) {
      setError(res.message)
    } else {
      setIsAuthModalOpen(false)
    }
  }

  const handleQuickSelectUser = (u: UserProfile) => {
    setUsername(u.username)
    setError(null)
    // 비밀번호가 없었던 계정이면 즉시 로그인
    if (!u.passwordHash) {
      const res = loginUser(u.username, '')
      if (res.success) {
        setIsAuthModalOpen(false)
      } else {
        setError(res.message)
      }
    }
  }

  const handleDeleteUser = (e: React.MouseEvent, targetUser: string) => {
    e.stopPropagation()
    if (confirm(`[${targetUser}] 농부의 모든 저장 데이터를 영구히 삭제하시겠습니까?`)) {
      deleteUser(targetUser)
      setUserList(getUserProfiles())
      if (username === targetUser) {
        setUsername('')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#2e2019] border-4 border-[#8d6238] rounded-2xl shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* 상단 닫기 버튼 (이미 로그인된 상태에서 창을 띄웠을 때만 닫기 가능) */}
        {currentUser && (
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#442c1f] hover:bg-[#5a3a29] text-amber-200 transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* 헤더 */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 border-2 border-emerald-400 flex items-center justify-center text-2xl shadow-md">
            🌾
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-200 flex items-center space-x-1.5">
              <span>늘봄마을 농부 출입처</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h2>
            <p className="text-xs text-amber-100/70">
              계정으로 로그인하여 나만의 농장과 마트를 브라우저에 안전하게 저장하세요!
            </p>
          </div>
        </div>

        {/* 탭 전환 (기존 농부 로그인 / 새 농부 등록) */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#1e140f] rounded-xl border border-[#5a3a29] mb-4">
          <button
            type="button"
            onClick={() => {
              setMode('login')
              setError(null)
            }}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              mode === 'login'
                ? 'bg-amber-700 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>기존 농부 로그인</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register')
              setError(null)
            }}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              mode === 'register'
                ? 'bg-emerald-700 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>새 농부 등록 (새 시작)</span>
          </button>
        </div>

        {/* 에러 메시지 알림 */}
        {error && (
          <div className="mb-4 px-3.5 py-2 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-medium flex items-center space-x-2 animate-shake">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* 1. 로그인 탭 내용 */}
        {mode === 'login' && (
          <div className="space-y-4">
            {/* 기존 저장된 계정 목록 (빠른 선택) */}
            {userList.length > 0 && (
              <div>
                <label className="text-xs font-bold text-amber-200 mb-2 block">
                  저장된 농부 계정 선택 ({userList.length}개)
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {userList.map(u => (
                    <div
                      key={u.username}
                      onClick={() => handleQuickSelectUser(u)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                        username === u.username
                          ? 'bg-amber-950/70 border-amber-500 shadow-md'
                          : 'bg-[#3b271c]/70 hover:bg-[#4d3324] border-[#66432b]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-800/80 border border-amber-600/50 flex items-center justify-center text-sm font-bold text-amber-200">
                          {u.username.slice(0, 1)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-amber-100 flex items-center space-x-1.5">
                            <span>{u.username}</span>
                            {u.passwordHash && (
                              <span title="암호 설정됨">
                                <KeyRound className="w-3 h-3 text-amber-400" />
                              </span>
                            )}
                          </div>
                          {u.farmSummary && (
                            <div className="text-[11px] text-slate-300 flex items-center space-x-2 mt-0.5 font-mono">
                              <span className="flex items-center space-x-0.5">
                                <Calendar className="w-3 h-3 text-amber-400" />
                                <span>
                                  {u.farmSummary.year}년차 Day {u.farmSummary.day}
                                </span>
                              </span>
                              <span className="flex items-center space-x-0.5 text-amber-300 font-bold">
                                <Coins className="w-3 h-3 text-amber-400" />
                                <span>₩{u.farmSummary.gold.toLocaleString()}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={e => handleDeleteUser(e, u.username)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors opacity-0 group-hover:opacity-100"
                          title="계정 삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 직접 입력 폼 */}
            <form onSubmit={handleLogin} className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 block">농부 닉네임</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="등록했던 닉네임 입력"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#1a110d] border border-[#5a3a29] rounded-xl text-sm text-amber-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 block">
                  비밀번호 <span className="text-slate-400 text-[10px]">(미설정 시 공란)</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="비밀번호가 있는 경우에만 입력"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#1a110d] border border-[#5a3a29] rounded-xl text-sm text-amber-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-600 active:scale-[0.98] text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center space-x-2 mt-4"
              >
                <LogIn className="w-4 h-4" />
                <span>농장으로 입장하기</span>
              </button>
            </form>
          </div>
        )}

        {/* 2. 신규 계정 등록 탭 내용 */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">
                새 농부 닉네임 <span className="text-amber-400 text-[10px]">(필수, 2~12자)</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="예: 청년농부민혁, 햇살농장주"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#1a110d] border border-[#5a3a29] rounded-xl text-sm text-amber-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">
                비밀번호 <span className="text-slate-400 text-[10px]">(선택 사항)</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="공란으로 두면 비밀번호 없이 즉시 접속"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#1a110d] border border-[#5a3a29] rounded-xl text-sm text-amber-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                혼자 쓰는 컴퓨터라면 비밀번호를 비워두셔도 간편하게 이용하실 수 있습니다.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center space-x-2 mt-4"
            >
              <Sprout className="w-4 h-4" />
              <span>새 농장 개척하고 시작하기</span>
            </button>
          </form>
        )}

        {/* 게스트로 계속하기 버튼 */}
        <div className="mt-4 pt-3 border-t border-[#442c1f] flex items-center justify-between text-xs">
          <span className="text-slate-400">저장 없이 그냥 둘러보고 싶으신가요?</span>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="text-amber-300 hover:text-amber-200 underline font-medium"
          >
            게스트로 계속 플레이
          </button>
        </div>
      </div>
    </div>
  )
}
