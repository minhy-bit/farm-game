import React, { useState } from 'react'
import { Shield, FileText, Mail, X, Check } from 'lucide-react'

interface LegalModalProps {
  isOpen: boolean
  initialTab?: 'privacy' | 'terms' | 'contact'
  onClose: () => void
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'contact'>(initialTab)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#241812] border-2 border-[#8d6238] rounded-3xl p-5 md:p-6 max-w-2xl w-full shadow-2xl space-y-4 relative max-h-[85vh] flex flex-col text-slate-200">
        {/* 헤더 */}
        <div className="flex items-center justify-between pb-3 border-b border-[#5a3c29]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-lg">
              📜
            </div>
            <div>
              <h2 className="text-base font-bold text-amber-200">늘봄마을 농장일지 안내 및 정책</h2>
              <p className="text-[11px] text-amber-100/60">Google AdSense 정책 준수 및 이용자 권익 보호 고지</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex space-x-2 border-b border-[#432918] pb-1">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'privacy'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 bg-[#1c120c]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>개인정보처리방침 (Privacy Policy)</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'terms'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 bg-[#1c120c]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>서비스 이용약관</span>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'contact'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 bg-[#1c120c]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>문의 및 지원</span>
          </button>
        </div>

        {/* 본문 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 text-xs leading-relaxed text-slate-300">
          {/* 탭 1: 개인정보처리방침 (Google AdSense 필수 요건) */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-amber-300 mb-1.5 flex items-center space-x-1">
                  <span>1. 개인정보 수집 및 처리 목적</span>
                </h3>
                <p className="text-slate-300/90">
                  «청년농부의 촌 라이프 (Modern Farm & Mart)»는 이용자의 민감한 개인 식별 정보(주민등록번호, 금융정보 등)를 수집하지 않으며,
                  게임 진행 데이터(골드, 재배 작물, 인벤토리 등)는 전적으로 이용자 본인의 웹 브라우저 로컬 저장소(LocalStorage)에만 안전하게 보관됩니다.
                </p>
              </div>

              <div className="p-3 bg-amber-950/30 border border-amber-600/40 rounded-2xl space-y-1.5">
                <h4 className="text-xs font-bold text-amber-200 flex items-center space-x-1">
                  <span>2. Google AdSense 및 타사 쿠키(Cookie) 사용 고지</span>
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  본 웹사이트는 향후 구글 애드센스(Google AdSense)를 통한 온라인 광고를 게재할 수 있습니다.
                  구글(Google LLC)을 포함한 타사 공급업체는 쿠키를 사용하여 사용자의 본 사이트 및 다른 웹사이트 방문 기록을 바탕으로 맞춤형 광고를 게재합니다.
                </p>
                <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1 pl-1">
                  <li>
                    사용자는 <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">Google 광고 설정</a>에서 맞춤 광고 설정을 자유롭게 해제할 수 있습니다.
                  </li>
                  <li>
                    또한 <a href="https://www.aboutads.info" target="_blank" rel="noreferrer" className="text-amber-400 underline">www.aboutads.info</a>를 방문하여 맞춤형 광고 게재에 사용되는 타사 공급업체의 쿠키 사용을 선택 해제할 수 있습니다.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-amber-300 mb-1.5">3. 브라우저 데이터 보관 및 파기</h3>
                <p className="text-slate-300/90">
                  이용자는 브라우저 캐시 삭제 또는 게임 내 [계정 삭제] 기능을 통해 언제든지 로컬 저장소에 보관된 게임 데이터를 완전히 파기할 수 있습니다.
                </p>
              </div>
            </div>
          )}

          {/* 탭 2: 이용약관 */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-amber-300 mb-1.5">제1조 (목적)</h3>
                <p>
                  본 약관은 «청년농부의 촌 라이프» 웹 애플리케이션 서비스의 이용 조건 및 절차, 이용자와 운영자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-300 mb-1.5">제2조 (서비스의 무상 제공)</h3>
                <p>
                  본 게임은 모든 이용자에게 무료로 제공되는 비상업적 힐링 농사 & 타이쿤 웹 콘텐츠입니다. 게임 내 가상 재화(골드, 명성 등)는 실제 현금 가치를 지니지 않습니다.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-300 mb-1.5">제3조 (저작권 및 면책 조항)</h3>
                <p>
                  게임 내 제공되는 모든 폰트, 그래픽 에셋, 배경음악은 오픈소스 및 프리 라이선스 규정을 준수하여 개발되었습니다. 운영자는 천재지변, 브라우저 캐시 초기화로 인한 데이터 손실에 대해 고의 또는 중과실이 없는 한 책임을 지지 않습니다.
                </p>
              </div>
            </div>
          )}

          {/* 탭 3: 문의 및 지원 */}
          {activeTab === 'contact' && (
            <div className="space-y-3">
              <div className="p-4 bg-[#1c120c] border border-[#5a3c29] rounded-2xl space-y-2">
                <h3 className="text-sm font-bold text-amber-300 flex items-center space-x-1.5">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>개발자 문의 및 피드백 안내</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  게임 이용 중 버그 제보, 밸런스 개선 의견, 제휴 및 광고 문의 사항이 있으시면 아래 채널로 편하게 연락 주시기 바랍니다.
                </p>
                <div className="pt-2 text-xs space-y-1 font-mono text-amber-200">
                  <div>· 프로젝트: 청년농부의 촌 라이프 (Modern Farm & Mart)</div>
                  <div>· 공식 저장소: github.com/minhy-bit/farm-game</div>
                  <div>· 고객 지원: support@farmgame.local (또는 GitHub Issue)</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 풋터 확인 버튼 */}
        <div className="pt-2 border-t border-[#5a3c29] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  )
}
