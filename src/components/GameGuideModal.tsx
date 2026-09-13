import React, { useState } from 'react'
import { BookOpen, X, Sprout, Utensils, Store, Fish, Sparkles, HelpCircle } from 'lucide-react'

interface GameGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

export const GameGuideModal: React.FC<GameGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'crops' | 'cooking' | 'business' | 'fishing'>('basics')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="bg-[#231710] border-2 border-[#8e6339] rounded-3xl p-4 md:p-6 max-w-4xl w-full shadow-2xl space-y-4 relative max-h-[90vh] flex flex-col text-slate-200">
        {/* 헤더 */}
        <div className="flex items-center justify-between pb-3 border-b border-[#5a3c29]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner">
              📖
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-amber-200 font-pixel">늘봄마을 귀농 공략 가이드북</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-medium">
                  공식 농장 가이드
                </span>
              </div>
              <p className="text-xs text-amber-100/60">
                작물 재배 사이클, 사계절 도감, 요리 레시피, 마트 및 납품 전략의 모든 것
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 border-b border-[#432918] pb-2">
          <button
            onClick={() => setActiveTab('basics')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'basics'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-[#1a110a]'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>기본 농사법</span>
          </button>
          <button
            onClick={() => setActiveTab('crops')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'crops'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-[#1a110a]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>사계절 작물도감</span>
          </button>
          <button
            onClick={() => setActiveTab('cooking')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'cooking'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-[#1a110a]'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>늘봄 식당&요리</span>
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'business'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-[#1a110a]'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>마트 & B2B 납품</span>
          </button>
          <button
            onClick={() => setActiveTab('fishing')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 col-span-2 sm:col-span-1 ${
              activeTab === 'fishing'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-[#1a110a]'
            }`}
          >
            <Fish className="w-3.5 h-3.5" />
            <span>늘봄 낚시터</span>
          </button>
        </div>

        {/* 본문 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs leading-relaxed text-slate-300">
          {/* 1. 기본 농사법 */}
          {activeTab === 'basics' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#19100a] border border-[#5a3c29] rounded-2xl">
                <h3 className="text-sm font-bold text-amber-300 mb-2 flex items-center space-x-1.5">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  <span>농사의 4단계 기본 사이클</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 text-slate-300">
                  <div className="p-2.5 bg-black/30 rounded-xl border border-white/5 space-y-1">
                    <span className="font-bold text-amber-200 block text-xs">1단계: 밭 갈기 ⛏️</span>
                    <p className="text-[11px] text-slate-400">
                      황무지나 비어있는 땅을 호미로 클릭하여 경작지로 만듭니다.
                    </p>
                  </div>
                  <div className="p-2.5 bg-black/30 rounded-xl border border-white/5 space-y-1">
                    <span className="font-bold text-amber-200 block text-xs">2단계: 씨앗 뿌리기 🌱</span>
                    <p className="text-[11px] text-slate-400">
                      상점에서 구매한 현재 계절에 맞는 씨앗을 갈아둔 밭에 심습니다.
                    </p>
                  </div>
                  <div className="p-2.5 bg-black/30 rounded-xl border border-white/5 space-y-1">
                    <span className="font-bold text-amber-200 block text-xs">3단계: 물주기 💧</span>
                    <p className="text-[11px] text-slate-400">
                      매일 물을 주어야 작물이 정상적으로 자라납니다. 스프링클러나 자동 관수를 활용할 수 있습니다.
                    </p>
                  </div>
                  <div className="p-2.5 bg-black/30 rounded-xl border border-white/5 space-y-1">
                    <span className="font-bold text-amber-200 block text-xs">4단계: 수확하기 🧺</span>
                    <p className="text-[11px] text-slate-400">
                      성장이 100% 완료된 작물은 클릭하여 수확하고 인벤토리에 보관합니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-950/30 border border-amber-600/40 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-amber-200 flex items-center space-x-1.5">
                  <span>💡 사계절(봄·여름·가을·겨울)과 시들음 방지</span>
                </h4>
                <p className="text-[11px] text-slate-300">
                  늘봄마을은 봄, 여름, 가을, 겨울 4개의 계절로 순환합니다. 각 계절에 맞지 않는 작물은 계절이 바뀔 때 시들 수 있으므로
                  계절 말기에는 재배 기간(일수)을 미리 계산하여 파종하는 전략이 중요합니다.
                </p>
              </div>

              <div className="p-3.5 bg-[#19100a] border border-[#5a3c29] rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-amber-200">✨ 마우스 호미 스킨 & 명성 뽑기</h4>
                <p className="text-[11px] text-slate-300">
                  마트 운영과 B2B 대량 납품을 성실히 이행하면 마을 <strong className="text-amber-300">명성 포인트(Reputation)</strong>를 획득합니다.
                  명성 500점을 사용하여 전설의 호미 뽑기를 진행할 수 있으며, 획득한 호미는 마우스 커서를 따라다니며 아름다운 파티클을 뽐냅니다.
                </p>
              </div>
            </div>
          )}

          {/* 2. 사계절 작물도감 */}
          {activeTab === 'crops' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* 봄 작물 */}
                <div className="p-3 bg-[#19100a] border border-pink-900/40 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-pink-300 font-bold text-xs border-b border-pink-900/30 pb-1">
                    <span>🌸 봄 (Spring)</span>
                    <span className="text-[10px] font-normal text-slate-400">설향딸기, 포슬알감자, 조선대파, 아삭양배추</span>
                  </div>
                  <ul className="text-[11px] space-y-1 text-slate-300">
                    <li>· <strong className="text-pink-300">설향딸기</strong>: 재배 3일, 씨앗 400G / 판매 650G (수제 딸기청 가공 가능)</li>
                    <li>· <strong className="text-amber-300">포슬알감자</strong>: 재배 2일, 씨앗 200G / 판매 325G (초보 농부의 든든한 주력)</li>
                    <li>· <strong className="text-emerald-300">조선대파</strong>: 재배 2일, 씨앗 180G / 판매 290G (봄/가을 겸용)</li>
                    <li>· <strong className="text-green-300">아삭양배추</strong>: 재배 3일, 씨앗 250G / 판매 425G (식당 샐러드 주재료)</li>
                  </ul>
                </div>

                {/* 여름 작물 */}
                <div className="p-3 bg-[#19100a] border border-amber-900/40 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs border-b border-amber-900/30 pb-1">
                    <span>☀️ 여름 (Summer)</span>
                    <span className="text-[10px] font-normal text-slate-400">완숙토마토, 찰옥수수, 꿀수박, 청양고추</span>
                  </div>
                  <ul className="text-[11px] space-y-1 text-slate-300">
                    <li>· <strong className="text-red-400">완숙토마토</strong>: 재배 3일, 씨앗 330G / 판매 550G (토마토 퓨레 가공)</li>
                    <li>· <strong className="text-yellow-400">찰옥수수</strong>: 재배 2일, 씨앗 300G / 판매 490G (식당 구이 인기 메뉴)</li>
                    <li>· <strong className="text-emerald-400">꿀수박</strong>: 재배 4일, 씨앗 450G / 판매 780G (여름철 고수익 과일)</li>
                    <li>· <strong className="text-red-300">청양고추</strong>: 재배 2일, 씨앗 220G / 판매 360G (각종 찌개 필수)</li>
                  </ul>
                </div>

                {/* 가을 작물 */}
                <div className="p-3 bg-[#19100a] border border-orange-900/40 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-orange-300 font-bold text-xs border-b border-orange-900/30 pb-1">
                    <span>🍁 가을 (Autumn)</span>
                    <span className="text-[10px] font-normal text-slate-400">꿀고구마, 단호박, 황금배, 영양햅쌀</span>
                  </div>
                  <ul className="text-[11px] space-y-1 text-slate-300">
                    <li>· <strong className="text-amber-400">꿀고구마</strong>: 재배 3일, 씨앗 260G / 판매 440G (군고구마 가공 가능)</li>
                    <li>· <strong className="text-orange-400">단호박</strong>: 재배 3일, 씨앗 340G / 판매 580G (단호박죽 대표 재료)</li>
                    <li>· <strong className="text-yellow-300">황금배</strong>: 재배 4일, 씨앗 500G / 판매 850G (선물용 고단가 과수)</li>
                    <li>· <strong className="text-amber-200">영양햅쌀</strong>: 재배 3일, 씨앗 380G / 판매 620G (식당 밥 요리 필수)</li>
                  </ul>
                </div>

                {/* 겨울 작물 */}
                <div className="p-3 bg-[#19100a] border border-cyan-900/40 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs border-b border-cyan-900/30 pb-1">
                    <span>❄️ 겨울 (Winter)</span>
                    <span className="text-[10px] font-normal text-slate-400">서리태콩, 대관령무, 가을시금치, 하우스딸기</span>
                  </div>
                  <ul className="text-[11px] space-y-1 text-slate-300">
                    <li>· <strong className="text-slate-300">서리태콩</strong>: 재배 3일, 씨앗 310G / 판매 520G (고단백 웰빙 작물)</li>
                    <li>· <strong className="text-cyan-200">대관령무</strong>: 재배 2일, 씨앗 240G / 판매 390G (겨울 김장 주재료)</li>
                    <li>· <strong className="text-emerald-300">겨울시금치</strong>: 재배 2일, 씨앗 200G / 판매 330G (추위를 견딘 단맛)</li>
                  </ul>
                </div>
              </div>

              {/* 3사이클 마스터 작물 해금 안내 */}
              <div className="p-3.5 bg-gradient-to-r from-purple-950/40 to-amber-950/40 border border-purple-500/50 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-purple-200 font-bold text-xs">
                  <span>👑 3사이클 마스터 전설 작물 해금 안내</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  사계절을 3회 이상 순환(총 12계절 이상 경과)하고 농가 명성을 충분히 축적한 진정한 마스터 농부에게만
                  전설의 특수 작물(산삼, 황금사과, 눈꽃송이 등)의 씨앗이 비밀 상점에 모습을 드러냅니다.
                </p>
              </div>
            </div>
          )}

          {/* 3. 늘봄 식당&요리 */}
          {activeTab === 'cooking' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#19100a] border border-[#5a3c29] rounded-2xl space-y-2">
                <h3 className="text-sm font-bold text-amber-300 flex items-center space-x-1.5">
                  <Utensils className="w-4 h-4 text-amber-400" />
                  <span>늘봄 식당 운영 및 요리 레시피 (18종)</span>
                </h3>
                <p className="text-[11px] text-slate-300">
                  수확한 신선한 작물과 낚시로 얻은 생선을 조리 도구(냄비, 프라이팬, 오븐, 믹서)를 통해 가치 높은 요리로 변환할 수 있습니다.
                  요리는 직접 섭취하여 기력을 회복하거나 손님에게 서빙하여 높은 수익을 창출합니다.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                  <div className="p-2 bg-black/40 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-amber-300 block">🥣 단호박 영양죽</span>
                    <span className="text-[10px] text-slate-400">단호박 + 햅쌀 (냄비)</span>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-1">골드 850G | 명성 +15</p>
                  </div>
                  <div className="p-2 bg-black/40 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-amber-300 block">🥔 바삭 감자전</span>
                    <span className="text-[10px] text-slate-400">포슬알감자 + 대파 (프라이팬)</span>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-1">골드 540G | 명성 +10</p>
                  </div>
                  <div className="p-2 bg-black/40 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-amber-300 block">🍓 생딸기 스무디</span>
                    <span className="text-[10px] text-slate-400">설향딸기 (믹서)</span>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-1">골드 720G | 명성 +12</p>
                  </div>
                  <div className="p-2 bg-black/40 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-amber-300 block">🌽 버터 옥수수구이</span>
                    <span className="text-[10px] text-slate-400">찰옥수수 (오븐)</span>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-1">골드 620G | 명성 +10</p>
                  </div>
                  <div className="p-2 bg-black/40 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-amber-300 block">🐟 얼큰 붕어매운탕</span>
                    <span className="text-[10px] text-slate-400">토종붕어 + 대파 + 고추 (냄비)</span>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-1">골드 1,200G | 명성 +25</p>
                  </div>
                  <div className="p-2 bg-black/40 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-amber-300 block">🥗 건강 오리엔탈 샐러드</span>
                    <span className="text-[10px] text-slate-400">양배추 + 토마토 (도마)</span>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-1">골드 680G | 명성 +12</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. 마트 & B2B 납품 */}
          {activeTab === 'business' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#19100a] border border-[#5a3c29] rounded-2xl space-y-2">
                <h3 className="text-sm font-bold text-amber-300 flex items-center space-x-1.5">
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>로컬푸드 직매장 매대 운영 전략</span>
                </h3>
                <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1.5">
                  <li>
                    <strong className="text-amber-200">5칸 매대 슬롯 제한</strong>: 한번에 진열할 수 있는 품목은 최대 5종으로 엄선하여 진열해야 합니다.
                  </li>
                  <li>
                    <strong className="text-amber-200">3단계 가격 책정 (-10%, 정가, +10%)</strong>:
                    <ul className="list-none pl-4 pt-1 space-y-1 text-slate-400">
                      <li>· <span className="text-blue-300 font-bold">-10% 할인</span>: 손님 구매 확률 극대화, 빠른 재고 회전 및 단골 유치.</li>
                      <li>· <span className="text-slate-200 font-bold">정가 판매</span>: 안정적인 이익과 신뢰도 유지.</li>
                      <li>· <span className="text-orange-300 font-bold">+10% 인상</span>: 수익률은 높으나 손님이 구매를 망설이며 명성 하락 리스크 존재.</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="p-3.5 bg-amber-950/30 border border-amber-600/40 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-amber-200 flex items-center space-x-1.5">
                  <span>⚠️ 폭리 주의 및 명성 페널티 경고</span>
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  가격을 높여 판매할 경우 깐깐한 마을 주민들의 원성을 사게 되어, 판매 시 획득하는 명성이 절반으로 줄어들거나
                  일정 확률로 축적된 농장 명성이 크게 하락할 수 있으므로 상도의를 지키는 균형 있는 가격 책정이 요구됩니다.
                </p>
              </div>

              <div className="p-3.5 bg-[#19100a] border border-[#5a3c29] rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-amber-200">📦 농협 & 대형마트 B2B 정기 납품</h4>
                <p className="text-[11px] text-slate-300">
                  매일 아침 새로운 납품 계약이 등록됩니다. 대량의 규격 작물을 납품하면 일반 매대 판매보다 훨씬 높은 프리미엄 단가와
                  대량의 농가 명성을 보장받을 수 있습니다. 납품을 완수한 계약은 다음 날 아침 새로운 계약으로 자동 갱신됩니다.
                </p>
              </div>
            </div>
          )}

          {/* 5. 늘봄 낚시터 */}
          {activeTab === 'fishing' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#19100a] border border-[#5a3c29] rounded-2xl space-y-2">
                <h3 className="text-sm font-bold text-amber-300 flex items-center space-x-1.5">
                  <Fish className="w-4 h-4 text-cyan-400" />
                  <span>늘봄 낚시터 어종 및 낚시 팁</span>
                </h3>
                <p className="text-[11px] text-slate-300">
                  작물이 자라는 여유 시간 동안 늘봄 낚시터에서 낚시를 즐기며 식당 요리 식재료를 수급할 수 있습니다.
                  늘봄 낚시터는 전용 상점에서 낚싯대와 미끼를 구비한 후 입장할 수 있습니다.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  <div className="p-2.5 bg-black/40 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-cyan-300 block">🐟 토종 붕어</span>
                    <p className="text-[10px] text-slate-400 mt-1">맑은 저수지 어디서나 흔히 볼 수 있는 민물고기. 얼큰 매운탕의 훌륭한 재료.</p>
                  </div>
                  <div className="p-2.5 bg-black/40 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-cyan-300 block">🌿 힘찬 잉어</span>
                    <p className="text-[10px] text-slate-400 mt-1">힘이 세고 묵직한 대형 어종. 체력 보양식 잉어 찜 요리에 사용됩니다.</p>
                  </div>
                  <div className="p-2.5 bg-black/40 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-yellow-300 block">✨ 황금 쏘가리</span>
                    <p className="text-[10px] text-slate-400 mt-1">극히 희귀한 전설의 민물 어종. 귀한 손님용 궁중 어선 요리에 최고가로 납품.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 풋터 닫기 버튼 */}
        <div className="pt-2 border-t border-[#5a3c29] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  )
}
