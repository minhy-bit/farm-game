import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import { COOKING_UTENSILS } from '../data/cookingUtensils'
import { RECIPES } from '../data/recipes'
import { CROPS_MAP } from '../data/crops'
import { FISHING_CATCHES_MAP } from '../data/fishing'
import { CookingUtensilType } from '../types/game'
import {
  UtensilsCrossed,
  ChefHat,
  Flame,
  CheckCircle2,
  Lock,
  Sparkles,
  Coins,
  Zap,
  Award,
  Store,
  Heart,
  Soup,
  Coffee,
  PieChart,
  ShoppingBag,
  ArrowRight
} from 'lucide-react'

export const RestaurantView: React.FC = () => {
  const {
    restaurant,
    player,
    inventory,
    buyRestaurant,
    buyUtensil,
    cookDish,
    serveDish,
    eatDish,
    shipDishToMart
  } = useGame()

  const [selectedUtensilFilter, setSelectedUtensilFilter] = useState<CookingUtensilType | 'all'>('all')

  // 식당 미인수 상태 화면
  if (!restaurant.isOwned) {
    const RESTAURANT_COST = 45000
    const canAfford = player.gold >= RESTAURANT_COST

    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
        {/* 인허가 배너 */}
        <div className="bg-gradient-to-r from-amber-900/60 via-amber-800/40 to-orange-950/60 border-2 border-amber-600/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-600 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-lg shadow-amber-950/50 flex-shrink-0">
                🏡
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-600">
                    B2B 납품 실적 달성 해금!
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700">
                    직영 식당 부지 매물
                  </span>
                </div>
                <h2 className="text-xl font-bold text-amber-100">
                  늘봄 한옥 전통 식당 인수 프로젝트
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  직접 가꾼 늘봄 텃밭의 신선한 채소와 과일을 그대로 식탁에 올리는 <strong>팜투테이블(Farm-to-Table) 레스토랑</strong>을 열어보세요!
                  가마솥, 프라이팬, 찜기, 블렌더, 화덕 등 다양한 조리기구를 구비하고 고부가가치 요리를 손님들에게 대접할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-amber-500/40 w-full md:w-auto min-w-[240px] text-center space-y-3 shadow-lg">
              <div className="text-xs text-slate-400">부지 인수 및 리모델링 비용</div>
              <div className="text-2xl font-bold font-mono text-amber-300 flex items-center justify-center space-x-1">
                <Coins className="w-6 h-6 text-amber-400" />
                <span>₩{RESTAURANT_COST.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                현재 보유금: <span className="font-bold text-slate-200">₩{player.gold.toLocaleString()}</span>
              </div>

              <button
                disabled={!canAfford}
                onClick={buyRestaurant}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 ${
                  canAfford
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/40 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <ChefHat className="w-4 h-4" />
                <span>{canAfford ? '늘봄 식당 인수하고 개업하기!' : `자금 부족 (₩${(RESTAURANT_COST - player.gold).toLocaleString()} 부족)`}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 식당 특징 안내 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-farm-card border border-farm-border rounded-xl p-4 space-y-2">
            <div className="text-2xl">🍲</div>
            <h3 className="text-sm font-bold text-amber-200">다양한 전통·현대 조리기구</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              무쇠 가마솥, 동판 팬, 황동 찜기, 초고속 블렌더, 황토 벽돌 화덕을 하나씩 장만하여 주방을 업그레이드하세요.
            </p>
          </div>

          <div className="bg-farm-card border border-farm-border rounded-xl p-4 space-y-2">
            <div className="text-2xl">🍽️</div>
            <h3 className="text-sm font-bold text-amber-200">고부가가치 직영 서빙</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              수확물을 원물 그대로 파는 것보다 정성 들여 요리해 서빙하면 훨씬 높은 골드와 마을 평판을 획득합니다.
            </p>
          </div>

          <div className="bg-farm-card border border-farm-border rounded-xl p-4 space-y-2">
            <div className="text-2xl">⚡</div>
            <h3 className="text-sm font-bold text-amber-200">농부의 꿀맛 원기 회복</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              지친 농사일 중 직접 만든 따뜻한 영양밥이나 스무디를 먹고 기력을 즉시 대폭 회복할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // 필터링된 레시피
  const filteredRecipes = selectedUtensilFilter === 'all'
    ? RECIPES
    : RECIPES.filter(r => r.utensilId === selectedUtensilFilter)

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
      {/* 1. 상단 식당 운영 배너 */}
      <div className="bg-gradient-to-r from-amber-900/50 via-orange-900/40 to-amber-950/60 border border-amber-600/40 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-2xl shadow-md shadow-amber-500/30">
            🍽️
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-amber-100">늘봄 팜투테이블 전통 식당</h2>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full font-bold">
                성황리 영업 중
              </span>
            </div>
            <p className="text-xs text-slate-300">
              오늘 밭에서 갓 수확한 신선한 농작물로 향긋한 요리를 짓고, 미식가 손님들에게 대접하세요.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className="bg-slate-900/70 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center space-x-2">
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400">서빙한 총 요리</div>
              <div className="font-bold text-slate-100 font-mono">{restaurant.totalDishesServed}접시</div>
            </div>
          </div>

          <div className="bg-slate-900/70 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center space-x-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <div>
              <div className="text-[10px] text-slate-400">보유 조리기구</div>
              <div className="font-bold text-amber-300 font-mono">
                {restaurant.unlockedUtensils.length} / {COOKING_UTENSILS.length}종
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 주방 조리기구 구매 & 현황 코너 */}
      <div className="bg-farm-card border border-farm-border rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-amber-200 flex items-center space-x-2">
            <ChefHat className="w-4 h-4 text-amber-400" />
            <span>주방 조리기구 코너 ({restaurant.unlockedUtensils.length}/{COOKING_UTENSILS.length} 구비)</span>
          </h3>
          <span className="text-xs text-slate-400">
            새로운 조리기구를 구비하면 더 많은 프리미엄 레시피가 개방됩니다.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {COOKING_UTENSILS.map(utensil => {
            const isOwned = restaurant.unlockedUtensils.includes(utensil.id)
            const canAfford = player.gold >= utensil.price

            return (
              <div
                key={utensil.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2.5 transition-all ${
                  isOwned
                    ? 'bg-amber-950/20 border-amber-600/40 shadow-sm'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{utensil.icon}</span>
                    {isOwned ? (
                      <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-700">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>보유중</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                        <Lock className="w-3 h-3" />
                        <span>미보유</span>
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-200">{utensil.name}</div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {utensil.description}
                  </p>
                </div>

                <div>
                  {isOwned ? (
                    <div className="text-[11px] text-amber-300/80 font-medium text-center py-1">
                      언제든 조리 가능 ✅
                    </div>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => buyUtensil(utensil.id)}
                      className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                        canAfford
                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow shadow-amber-600/30 active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>₩{utensil.price.toLocaleString()} 구매</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. 완성된 요리 보관함 및 다이닝 홀 서빙 코너 */}
      <div className="bg-gradient-to-b from-farm-card to-slate-900 border border-amber-700/30 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🛎️</span>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                완성 요리 보관함 & 다이닝 홀 서빙대
                <span className="text-xs bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded-full border border-amber-600 font-mono">
                  {restaurant.cookedInventory.reduce((acc, d) => acc + d.count, 0)}접시 준비됨
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                정성껏 만든 요리를 식당 손님에게 판매하거나, 농부가 직접 먹어 기력을 회복하세요.
              </p>
            </div>
          </div>
        </div>

        {restaurant.cookedInventory.length === 0 ? (
          <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-xl p-8 text-center space-y-2">
            <span className="text-3xl">🍲</span>
            <div className="text-xs font-bold text-slate-300">현재 보관 중인 완성 요리가 없습니다.</div>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              아래 레시피 목록에서 농장에서 수확한 작물로 맛있는 요리를 지어보세요! 손님 서빙 시 큰 수익을 안겨줍니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {restaurant.cookedInventory.map(dish => (
              <div
                key={dish.id}
                className="bg-slate-900/80 border border-amber-600/30 rounded-xl p-4 shadow-md flex flex-col justify-between space-y-3 hover:border-amber-500 transition-all"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{dish.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-100">{dish.name}</div>
                      <div className="text-[11px] text-amber-300 font-mono font-bold">
                        보유: {dish.count}접시
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-[11px]">
                    <div className="text-amber-300 font-bold font-mono">₩{dish.sellPrice.toLocaleString()}</div>
                    <div className="text-sky-400 font-medium">평판 +{dish.reputationReward}P</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {/* 손님 서빙 */}
                  <button
                    onClick={() => serveDish(dish.recipeId)}
                    className="bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold py-2 rounded-lg flex flex-col items-center justify-center space-y-0.5 shadow transition-all active:scale-95"
                    title="식당 손님에게 판매하여 골드와 평판을 획득합니다"
                  >
                    <Coins className="w-3.5 h-3.5 text-amber-200" />
                    <span>손님 서빙</span>
                  </button>

                  {/* 농부 시식 */}
                  <button
                    onClick={() => eatDish(dish.recipeId)}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold py-2 rounded-lg flex flex-col items-center justify-center space-y-0.5 shadow transition-all active:scale-95"
                    title={`맛있게 먹고 기력을 +${dish.staminaRecovery} 회복합니다`}
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-200" />
                    <span>시식(+{dish.staminaRecovery})</span>
                  </button>

                  {/* 마트 출하 */}
                  <button
                    onClick={() => shipDishToMart(dish.recipeId)}
                    className="bg-teal-700 hover:bg-teal-600 text-white text-[11px] font-bold py-2 rounded-lg flex flex-col items-center justify-center space-y-0.5 shadow transition-all active:scale-95"
                    title="로컬푸드 마트 매대에 진열해 판매할 수 있도록 출하합니다"
                  >
                    <Store className="w-3.5 h-3.5 text-teal-200" />
                    <span>마트 출하</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. 레시피 북 & 조리대 코너 */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>늘봄 전용 레시피 북 & 조리대 ({filteredRecipes.length}종)</span>
            </h3>
            <p className="text-xs text-slate-400">
              필요한 재료와 조리기구를 갖추고 요리를 완성하세요. (조리 1회당 기력 5 소모)
            </p>
          </div>

          {/* 조리기구 필터 탭 */}
          <div className="flex items-center space-x-1 overflow-x-auto py-1">
            <button
              onClick={() => setSelectedUtensilFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedUtensilFilter === 'all'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              전체 보기
            </button>
            {COOKING_UTENSILS.map(u => (
              <button
                key={u.id}
                onClick={() => setSelectedUtensilFilter(u.id)}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                  selectedUtensilFilter === u.id
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{u.icon}</span>
                <span>{u.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 레시피 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map(recipe => {
            const utensil = COOKING_UTENSILS.find(u => u.id === recipe.utensilId)
            const hasUtensil = restaurant.unlockedUtensils.includes(recipe.utensilId)

            // 재료 충족 여부 계산
            let hasAllIngredients = true
            const ingredientStatuses = recipe.ingredients.map(ing => {
              const crop = CROPS_MAP.get(ing.cropId)
              const catchItem = FISHING_CATCHES_MAP.get(ing.cropId)
              const owned = inventory
                .filter(i => i.type === 'crop' && i.targetId === ing.cropId)
                .reduce((sum, i) => sum + i.count, 0)
              const enough = owned >= ing.count
              if (!enough) hasAllIngredients = false
              return {
                cropName: crop?.nameKr || catchItem?.name || '작물',
                cropIcon: crop?.icon || catchItem?.icon || '🌱',
                required: ing.count,
                owned,
                enough
              }
            })

            const canCook = hasUtensil && hasAllIngredients && player.stamina >= 5

            return (
              <div
                key={recipe.id}
                className={`bg-farm-card border rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-4 transition-all ${
                  canCook
                    ? 'border-amber-500/60 shadow-amber-950/30'
                    : hasUtensil
                    ? 'border-farm-border'
                    : 'border-slate-800 opacity-75'
                }`}
              >
                {/* 레시피 상단 헤더 */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-3xl">{recipe.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
                          <span>{recipe.name}</span>
                        </div>
                        <div className="text-[10px] text-amber-300 flex items-center space-x-1 mt-0.5">
                          <span>{utensil?.icon}</span>
                          <span>{utensil?.name}</span>
                        </div>
                      </div>
                    </div>

                    {hasUtensil ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-700 px-2 py-0.5 rounded-full font-bold">
                        기구 구비됨
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>기구 필요</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                    "{recipe.description}"
                  </p>
                </div>

                {/* 필요 식재료 목록 */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-300">필요 농작물:</div>
                  <div className="space-y-1.5">
                    {ingredientStatuses.map((st, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800"
                      >
                        <div className="flex items-center space-x-1.5">
                          <span>{st.cropIcon}</span>
                          <span className="text-slate-200">{st.cropName}</span>
                        </div>
                        <div className="font-mono text-[11px]">
                          <span className={st.enough ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {st.owned}
                          </span>
                          <span className="text-slate-500"> / {st.required}개</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 완성 혜택 요약 */}
                  <div className="flex items-center justify-between text-xs pt-1 px-1">
                    <div className="flex items-center space-x-1 text-amber-300 font-bold font-mono">
                      <Coins className="w-3.5 h-3.5" />
                      <span>₩{recipe.sellPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px]">
                      <span className="text-emerald-400 flex items-center space-x-0.5">
                        <Zap className="w-3 h-3" />
                        <span>+{recipe.staminaRecovery}</span>
                      </span>
                      <span className="text-sky-400 flex items-center space-x-0.5">
                        <Award className="w-3 h-3" />
                        <span>+{recipe.reputationReward}P</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 조리하기 버튼 */}
                <button
                  disabled={!canCook}
                  onClick={() => cookDish(recipe.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-md ${
                    canCook
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 active:scale-95'
                      : !hasUtensil
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : !hasAllIngredients
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                      : 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-200" />
                  <span>
                    {!hasUtensil
                      ? `${utensil?.name.split(' ')[0]} 기구 필요`
                      : !hasAllIngredients
                      ? '작물 재료 부족 (수확 필요)'
                      : player.stamina < 5
                      ? '기력 부족 (휴식 필요)'
                      : '지글지글 요리하기 (기력 -5)'}
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
