import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import {
  PlayerStats,
  FarmTile,
  InventoryItem,
  MartShelf,
  Customer,
  Contract,
  UpgradeItem,
  ToolType,
  CropQuality,
  Season,
  Weather,
  TabType,
  CookingUtensilType,
  RestaurantState,
  DAYS_PER_SEASON,
  DAYS_PER_CYCLE,
  SOIL_DECAY_RATE,
  CROP_ROT_RATE,
  MAX_WATER_PER_DAY
} from '../types/game'
import { CROPS, CROPS_MAP } from '../data/crops'
import { INITIAL_CONTRACTS, refreshContractsForSeason, generateRandomContract } from '../data/contracts'
import { UPGRADES } from '../data/upgrades'
import { CUSTOMER_PRESETS, CUSTOMER_BUBBLES } from '../data/customers'
import { UTENSILS_MAP } from '../data/cookingUtensils'
import { RECIPES_MAP } from '../data/recipes'
import { SoundSystem } from '../utils/audio'
import { UserProfile, SaveGamePayload } from '../types/auth'
import {
  getStoredUsers,
  saveStoredUsers,
  getStoredSave,
  writeStoredSave,
  removeStoredSave,
  getLastActiveUser,
  setLastActiveUser,
  hashPassword
} from '../utils/storage'

interface NotificationToast {
  id: string
  message: string
  type: 'info' | 'success' | 'warning'
}

interface GameContextType {
  player: PlayerStats
  tiles: FarmTile[]
  inventory: InventoryItem[]
  shelves: MartShelf[]
  customers: Customer[]
  contracts: Contract[]
  upgrades: UpgradeItem[]
  activeTab: TabType
  selectedTool: ToolType
  selectedSeed: string | null
  toasts: NotificationToast[]
  gridSize: number // 3, 4, or 5
  restaurant: RestaurantState
  currentYear: number
  currentSeasonDay: number
  
  // Tab & Tools
  setActiveTab: (tab: TabType) => void
  setSelectedTool: (tool: ToolType) => void
  setSelectedSeed: (seedId: string | null) => void
  
  // Farm Actions
  handleTileClick: (tileId: string) => void
  tillTile: (tileId: string) => boolean
  waterTile: (tileId: string) => boolean
  plantSeed: (tileId: string, cropId: string) => boolean
  harvestCrop: (tileId: string) => boolean
  waterAllTiles: () => void
  
  // Day & Time
  sleepNextDay: () => void
  fastForwardHour: () => void
  fastForwardDays: (days: number) => void
  
  // Mart Actions
  stockShelf: (shelfId: string, targetId: string, count: number, price: number) => boolean
  clearShelf: (shelfId: string) => void
  checkoutCustomer: (customerId: string) => void
  
  // Wholesale Actions
  fulfillContract: (contractId: string) => boolean
  renewContract: (contractId: string) => boolean
  refreshExpiredContracts: () => number
  
  // Restaurant & Cooking Actions
  buyRestaurant: () => boolean
  buyUtensil: (utensilId: CookingUtensilType) => boolean
  cookDish: (recipeId: string) => boolean
  serveDish: (recipeId: string) => boolean
  eatDish: (recipeId: string) => boolean
  shipDishToMart: (recipeId: string) => boolean

  // Shop & Upgrades
  buySeeds: (cropId: string, count: number) => boolean
  buyUpgrade: (upgradeId: string) => boolean
  
  // Processing
  processCrop: (cropId: string, count: number) => boolean

  // Debug/Cheat for agent verification
  addFunds: (amount: number) => void
  giveSeeds: (cropId: string, count: number) => void
  giveCrops: (cropId: string, count: number) => void
  forceDecayTile: (tileIndex?: number) => boolean
  forceRotCrop: (tileIndex?: number) => boolean
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void

  // Auth & Save System
  currentUser: string | null
  isAuthModalOpen: boolean
  setIsAuthModalOpen: (open: boolean) => void
  loginUser: (username: string, password?: string) => { success: boolean; message: string }
  registerUser: (username: string, password?: string) => { success: boolean; message: string }
  logoutUser: () => void
  saveCurrentGame: (quiet?: boolean) => boolean
  deleteUser: (username: string) => void
  getUserProfiles: () => UserProfile[]
}

const GameContext = createContext<GameContextType | null>(null)

// 타일 초기화 헬퍼 (3x3 = 9개)
function createInitialTiles(size: number): FarmTile[] {
  const tiles: FarmTile[] = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      tiles.push({
        id: `tile_${x}_${y}`,
        x,
        y,
        isTilled: false,
        isWatered: false,
        cropId: null,
        currentStage: 0,
        daysGrown: 0,
        waterCount: 0,
        quality: 'normal',
        fertilized: false
      })
    }
  }
  return tiles
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. 플레이어 상태
  const [player, setPlayer] = useState<PlayerStats>({
    name: '청년농부',
    gold: 15000,
    totalEarned: 15000,
    stamina: 100,
    maxStamina: 100,
    reputation: 10,
    day: 1,
    hour: 7,
    season: 'spring',
    weather: 'sunny',
    martCustomersServed: 0,
    contractsFulfilled: 0
  })

  // 2. 밭 타일 & 그리드 크기
  const [gridSize, setGridSize] = useState<number>(3)
  const [tiles, setTiles] = useState<FarmTile[]>(() => createInitialTiles(3))

  // 3. 인벤토리 (기본 감자/딸기 씨앗 지급)
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 'inv_seed_potato',
      type: 'seed',
      targetId: 'crop_potato',
      name: '포슬알감자 씨앗',
      count: 10,
      unitPrice: 400
    },
    {
      id: 'inv_seed_strawberry',
      type: 'seed',
      targetId: 'crop_strawberry',
      name: '설향딸기 씨앗',
      count: 6,
      unitPrice: 800
    }
  ])

  // 4. 로컬푸드 마트 매대 (초기 3개)
  const [shelves, setShelves] = useState<MartShelf[]>([
    {
      id: 'shelf_1',
      name: '1호 신선 채소 매대',
      shelfType: 'produce',
      cropId: null,
      quality: 'normal',
      stock: 0,
      maxStock: 20,
      price: 0,
      basePrice: 0,
      freshness: 100
    },
    {
      id: 'shelf_2',
      name: '2호 제철 과일 매대',
      shelfType: 'fruit',
      cropId: null,
      quality: 'normal',
      stock: 0,
      maxStock: 20,
      price: 0,
      basePrice: 0,
      freshness: 100
    },
    {
      id: 'shelf_3',
      name: '3호 프리미엄 로컬 매대',
      shelfType: 'special',
      cropId: null,
      quality: 'normal',
      stock: 0,
      maxStock: 20,
      price: 0,
      basePrice: 0,
      freshness: 100
    }
  ])

  // 5. 마트 손님 목록
  const [customers, setCustomers] = useState<Customer[]>([])

  // 6. 납품 계약 목록
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS)

  // 7. 업그레이드 현황
  const [upgrades, setUpgrades] = useState<UpgradeItem[]>(UPGRADES)

  // 8. 뷰 및 조작 모드
  const [activeTab, setActiveTab] = useState<TabType>('farm')
  const [selectedTool, setSelectedTool] = useState<ToolType>('hoe')
  const [selectedSeed, setSelectedSeed] = useState<string | null>('crop_potato')
  const [toasts, setToasts] = useState<NotificationToast[]>([])

  // 9. 늘봄 식당 & 요리 현황
  const [restaurant, setRestaurant] = useState<RestaurantState>({
    isOwned: false,
    totalDishesServed: 0,
    unlockedUtensils: ['pot'], // 가마솥/뚝배기 기본 구비
    cookedInventory: []
  })

  // 10. 계정 및 저장 상태
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)

  // 알림 토스트 출력 (최대 4개 유지)
  const showToast = useCallback((message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`
    setToasts(prev => [...prev.slice(-3), { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3500)
  }, [])

  // 업그레이드 보유 여부 확인용 헬퍼
  const hasUpgrade = useCallback((id: string) => {
    const u = upgrades.find(item => item.id === id)
    return u ? u.level > 0 : false
  }, [upgrades])

  // --- 계정 및 저장 시스템 ---
  const getUserProfiles = useCallback((): UserProfile[] => {
    return getStoredUsers()
  }, [])

  const saveCurrentGame = useCallback(
    (quiet = false): boolean => {
      if (!currentUser) {
        if (!quiet) showToast('로그인된 계정이 없습니다. 계정을 등록하여 저장하세요!', 'warning')
        return false
      }

      const payload: SaveGamePayload = {
        version: 1,
        savedAt: Date.now(),
        username: currentUser,
        player,
        tiles,
        inventory,
        shelves,
        contracts,
        upgrades,
        restaurant,
        gridSize
      }

      const ok = writeStoredSave(payload)
      if (ok) {
        if (!quiet) {
          SoundSystem.playRegister()
          showToast(`💾 [${currentUser}] 농부님의 진행 상황이 안전하게 저장되었습니다!`, 'success')
        }
      } else {
        if (!quiet) showToast('저장에 실패했습니다. 로컬 저장 공간을 확인해주세요.', 'warning')
      }
      return ok
    },
    [currentUser, player, tiles, inventory, shelves, contracts, upgrades, restaurant, gridSize, showToast]
  )

  const registerUser = useCallback(
    (username: string, password = ''): { success: boolean; message: string } => {
      const trimmed = username.trim()
      const users = getStoredUsers()
      if (users.some(u => u.username === trimmed)) {
        return { success: false, message: '이미 등록된 농부 닉네임입니다!' }
      }

      const newUser: UserProfile = {
        username: trimmed,
        passwordHash: hashPassword(password),
        createdAt: Date.now(),
        lastSavedAt: Date.now(),
        farmSummary: {
          gold: 15000,
          day: 1,
          year: 1,
          season: 'spring',
          reputation: 0
        }
      }

      saveStoredUsers([...users, newUser])
      setCurrentUser(trimmed)
      setLastActiveUser(trimmed)

      // 초기 상태 리셋
      const initTiles = createInitialTiles(3)
      const initPlayer: PlayerStats = {
        name: trimmed,
        gold: 15000,
        totalEarned: 15000,
        stamina: 100,
        maxStamina: 100,
        day: 1,
        hour: 6,
        season: 'spring',
        weather: 'sunny',
        reputation: 0,
        martCustomersServed: 0,
        contractsFulfilled: 0
      }
      const initInventory: InventoryItem[] = [
        { id: 'inv_seed_potato', type: 'seed', targetId: 'crop_potato', name: '포슬알감자 씨앗', count: 10, unitPrice: 400 },
        { id: 'inv_seed_strawberry', type: 'seed', targetId: 'crop_strawberry', name: '설향딸기 씨앗', count: 6, unitPrice: 800 }
      ]
      const initShelves: MartShelf[] = [
        { id: 'shelf_1', name: '1호 신선 채소 매대', shelfType: 'produce', cropId: null, quality: 'normal', stock: 0, maxStock: 20, price: 0, basePrice: 0, freshness: 100 },
        { id: 'shelf_2', name: '2호 제철 과일 매대', shelfType: 'fruit', cropId: null, quality: 'normal', stock: 0, maxStock: 20, price: 0, basePrice: 0, freshness: 100 },
        { id: 'shelf_3', name: '3호 프리미엄 로컬 매대', shelfType: 'special', cropId: null, quality: 'normal', stock: 0, maxStock: 20, price: 0, basePrice: 0, freshness: 100 }
      ]
      const initContracts = INITIAL_CONTRACTS
      const initUpgrades = UPGRADES
      const initRestaurant: RestaurantState = {
        isOwned: false,
        totalDishesServed: 0,
        unlockedUtensils: ['pot'],
        cookedInventory: []
      }

      setPlayer(initPlayer)
      setTiles(initTiles)
      setInventory(initInventory)
      setShelves(initShelves)
      setContracts(initContracts)
      setUpgrades(initUpgrades)
      setRestaurant(initRestaurant)
      setGridSize(3)

      writeStoredSave({
        version: 1,
        savedAt: Date.now(),
        username: trimmed,
        player: initPlayer,
        tiles: initTiles,
        inventory: initInventory,
        shelves: initShelves,
        contracts: initContracts,
        upgrades: initUpgrades,
        restaurant: initRestaurant,
        gridSize: 3
      })

      SoundSystem.playFanfare()
      showToast(`🌾 환영합니다, [${trimmed}] 농부님! 늘봄마을에서 성공적인 귀농을 응원합니다!`, 'success')
      return { success: true, message: '등록 성공' }
    },
    [showToast]
  )

  const loginUser = useCallback(
    (username: string, password = ''): { success: boolean; message: string } => {
      const trimmed = username.trim()
      const users = getStoredUsers()
      const user = users.find(u => u.username === trimmed)
      if (!user) {
        return { success: false, message: '등록되지 않은 농부 닉네임입니다!' }
      }

      if (user.passwordHash && user.passwordHash !== hashPassword(password)) {
        return { success: false, message: '비밀번호가 일치하지 않습니다!' }
      }

      const save = getStoredSave(trimmed)
      if (!save) {
        return { success: false, message: '저장된 농장 데이터를 찾을 수 없습니다.' }
      }

      setCurrentUser(trimmed)
      setLastActiveUser(trimmed)

      if (save.player) setPlayer(save.player)
      if (save.tiles) setTiles(save.tiles)
      if (save.inventory) setInventory(save.inventory)
      if (save.shelves) setShelves(save.shelves)
      if (save.contracts) setContracts(save.contracts)
      if (save.upgrades) setUpgrades(save.upgrades)
      if (save.restaurant) setRestaurant(save.restaurant)
      if (save.gridSize) setGridSize(save.gridSize)

      SoundSystem.playFanfare()
      showToast(`🌾 [${trimmed}] 농부님, 어서오세요! 저장된 농장으로 복귀했습니다.`, 'success')
      return { success: true, message: '로그인 성공' }
    },
    [showToast]
  )

  const logoutUser = useCallback(() => {
    if (currentUser) {
      saveCurrentGame(true)
    }
    setCurrentUser(null)
    setLastActiveUser(null)
    setIsAuthModalOpen(true)
    showToast('로그아웃되었습니다. 다른 농부로 접속하거나 새로 시작할 수 있습니다.', 'info')
  }, [currentUser, saveCurrentGame, showToast])

  const deleteUser = useCallback((targetUser: string) => {
    removeStoredSave(targetUser)
    if (currentUser === targetUser) {
      setCurrentUser(null)
      setIsAuthModalOpen(true)
    }
    showToast(`[${targetUser}] 농부의 저장 데이터가 삭제되었습니다.`, 'info')
  }, [currentUser, showToast])

  // 초기 실행 시 마지막 로그인 유저 자동 복원
  useEffect(() => {
    const lastUser = getLastActiveUser()
    const users = getStoredUsers()
    if (lastUser && users.some(u => u.username === lastUser)) {
      const save = getStoredSave(lastUser)
      if (save) {
        setCurrentUser(lastUser)
        if (save.player) setPlayer(save.player)
        if (save.tiles) setTiles(save.tiles)
        if (save.inventory) setInventory(save.inventory)
        if (save.shelves) setShelves(save.shelves)
        if (save.contracts) setContracts(save.contracts)
        if (save.upgrades) setUpgrades(save.upgrades)
        if (save.restaurant) setRestaurant(save.restaurant)
        if (save.gridSize) setGridSize(save.gridSize)
        showToast(`🌾 [${lastUser}] 농부님의 저장된 농장을 자동으로 불러왔습니다!`, 'success')
        return
      }
    }

    if (users.length === 0) {
      setIsAuthModalOpen(true)
    }
  }, [showToast])

  // 정기 자동 저장 (60초마다)
  useEffect(() => {
    if (!currentUser) return
    const timer = setInterval(() => {
      saveCurrentGame(true)
    }, 60000)
    return () => clearInterval(timer)
  }, [currentUser, saveCurrentGame])

  // --- 농장 타일 조작 ---
  const tillTile = useCallback((tileId: string): boolean => {
    if (player.stamina < 2) {
      showToast('기력이 부족합니다! 잠을 자거나 휴식하세요.', 'warning')
      return false
    }
    const target = tiles.find(t => t.id === tileId)
    if (!target || target.isTilled || target.cropId) return false

    setTiles(prev =>
      prev.map(tile => (tile.id === tileId ? { ...tile, isTilled: true } : tile))
    )
    setPlayer(p => ({ ...p, stamina: Math.max(0, p.stamina - 2) }))
    SoundSystem.playTill()
    showToast('땅을 기름지게 일구었습니다.', 'info')
    return true
  }, [player.stamina, tiles, showToast])

  const waterTile = useCallback((tileId: string): boolean => {
    if (player.stamina < 2) {
      showToast('기력이 부족합니다! 잠을 자거나 휴식하세요.', 'warning')
      return false
    }
    const target = tiles.find(t => t.id === tileId)
    if (!target || !target.isTilled) return false

    const currentCount = target.waterCount || 0
    const newCount = currentCount + 1

    setPlayer(p => ({ ...p, stamina: Math.max(0, p.stamina - 2) }))

    // 1. 작물이 심겨져 있는 경우: 물 5회 이상 주면 과습으로 작물이 썩어 사라짐!
    if (target.cropId) {
      const cropDef = CROPS_MAP.get(target.cropId)
      const cropName = cropDef?.nameKr || '작물'

      if (newCount >= MAX_WATER_PER_DAY) {
        setTiles(prev =>
          prev.map(tile =>
            tile.id === tileId
              ? {
                  ...tile,
                  cropId: null,
                  currentStage: 0,
                  daysGrown: 0,
                  waterCount: 0,
                  isWatered: true,
                  quality: 'normal'
                }
              : tile
          )
        )
        SoundSystem.playWither()
        showToast(
          `🥀 [과습 피해] 물을 너무 많이 주어(5회) ${cropName}의 뿌리가 썩어 사라졌습니다!`,
          'warning'
        )
        return true
      }

      setTiles(prev =>
        prev.map(tile =>
          tile.id === tileId
            ? { ...tile, isWatered: true, waterCount: newCount }
            : tile
        )
      )
      SoundSystem.playWater()

      if (newCount === 4) {
        showToast(
          `⚠️ [과습 경고] 물이 흥건합니다! 한 번 더 물을 주면 ${cropName}이(가) 썩어버립니다! (4/5회)`,
          'warning'
        )
      } else if (newCount > 1) {
        showToast(
          `💧 ${cropName}에 물을 더 주었습니다. (누적 ${newCount}/5회 - 과습 주의)`,
          'info'
        )
      } else {
        showToast('💧 촉촉하게 물을 주었습니다.', 'info')
      }
      return true
    }

    // 2. 작물이 없는 빈 밭인 경우
    setTiles(prev =>
      prev.map(tile =>
        tile.id === tileId
          ? { ...tile, isWatered: true, waterCount: newCount }
          : tile
      )
    )
    SoundSystem.playWater()
    if (newCount === 1) {
      showToast('💧 촉촉하게 물을 주었습니다.', 'info')
    } else {
      showToast(`💧 이미 젖은 땅에 물을 덧뿌렸습니다. (${newCount}회)`, 'info')
    }
    return true
  }, [player.stamina, tiles, showToast])

  const plantSeed = useCallback((tileId: string, cropId: string): boolean => {
    const seedItem = inventory.find(i => i.type === 'seed' && i.targetId === cropId && i.count > 0)
    if (!seedItem) {
      showToast('보유한 씨앗이 없습니다! 종묘상에서 씨앗을 구입하세요.', 'warning')
      return false
    }

    const cropDef = CROPS_MAP.get(cropId)
    if (!cropDef) return false

    // 온실 업그레이드가 없으면 계절 체크
    const greenhouseUnlocked = hasUpgrade('up_greenhouse')
    if (!greenhouseUnlocked && !cropDef.season.includes(player.season)) {
      showToast(`[${cropDef.nameKr}]은(는) ${player.season} 계절에 노지 재배할 수 없습니다! (온실 필요)`, 'warning')
      return false
    }

    const target = tiles.find(t => t.id === tileId)
    if (!target || target.cropId) return false

    const hasAutoTill = hasUpgrade('up_auto_till')
    // 무경운 직파기가 없으면 반드시 일궈진 밭(isTilled)이어야 함
    if (!target.isTilled && !hasAutoTill) {
      showToast('먼저 호미로 땅을 일궈주세요.', 'warning')
      return false
    }

    setTiles(prev =>
      prev.map(tile =>
        tile.id === tileId
          ? {
              ...tile,
              isTilled: true, // 직파기 보유 시 미개간 땅도 자동으로 일궈짐
              cropId: cropId,
              currentStage: 0,
              daysGrown: 0,
              waterCount: tile.isWatered ? 1 : 0,
              quality: 'normal'
            }
          : tile
      )
    )

    // 씨앗 인벤토리 차감
    setInventory(prev =>
      prev
        .map(i => (i.id === seedItem.id ? { ...i, count: i.count - 1 } : i))
        .filter(i => i.count > 0)
    )

    setPlayer(p => ({ ...p, stamina: Math.max(0, p.stamina - 2) }))
    SoundSystem.playPlant()
    if (!target.isTilled && hasAutoTill) {
      showToast(`🚜 무경운 직파기로 ${cropDef.nameKr} 씨앗을 즉시 파종했습니다!`, 'info')
    } else {
      showToast(`${cropDef.nameKr} 씨앗을 정성껏 심었습니다!`, 'info')
    }
    return true
  }, [inventory, hasUpgrade, player.season, player.stamina, tiles, showToast])

  const harvestCrop = useCallback((tileId: string): boolean => {
    const target = tiles.find(t => t.id === tileId)
    if (!target || !target.cropId || target.currentStage < 3) return false

    const cropId = target.cropId
    const fertileSoilLevel = upgrades.find(u => u.id === 'up_fertile_soil')?.level || 0
    const hasAutoTill = hasUpgrade('up_auto_till')
    const rand = Math.random()
    let quality: CropQuality = 'normal'
    if (rand < 0.15 + fertileSoilLevel * 0.15) {
      quality = 'supreme'
    } else if (rand < 0.45 + fertileSoilLevel * 0.15) {
      quality = 'high'
    }

    setTiles(prev =>
      prev.map(tile =>
        tile.id === tileId
          ? {
              ...tile,
              cropId: null,
              currentStage: 0,
              daysGrown: 0,
              waterCount: 0,
              isWatered: false,
              isTilled: hasAutoTill, // 직파기 보유 시에만 밭 보존, 미보유 시 다시 호미질 필요!
              quality: 'normal'
            }
          : tile
      )
    )

    const cropDef = CROPS_MAP.get(cropId)
    if (cropDef) {
      const count = cropDef.yieldCount || 2
      setInventory(prev => {
        const existing = prev.find(i => i.type === 'crop' && i.targetId === cropId && i.quality === quality)
        if (existing) {
          return prev.map(i => (i.id === existing.id ? { ...i, count: i.count + count } : i))
        }
        return [
          ...prev,
          {
            id: `inv_crop_${cropId}_${quality}_${Date.now()}`,
            type: 'crop',
            targetId: cropId,
            name: `${quality === 'supreme' ? '🌟특등 ' : quality === 'high' ? '✨고급 ' : ''}${cropDef.nameKr}`,
            count,
            quality,
            unitPrice:
              quality === 'supreme'
                ? Math.round(cropDef.basePrice * 1.5)
                : quality === 'high'
                ? Math.round(cropDef.basePrice * 1.25)
                : cropDef.basePrice
          }
        ]
      })

      SoundSystem.playHarvest()
      showToast(
        `수확 성공! ${quality === 'supreme' ? '🌟[특등]' : quality === 'high' ? '✨[고급]' : ''} ${cropDef.nameKr} ${count}개를 풍성하게 수확했습니다!`,
        'success'
      )
    }
    return true
  }, [tiles, upgrades, hasUpgrade, showToast])

  const waterAllTiles = useCallback(() => {
    setTiles(prev =>
      prev.map(t =>
        t.isTilled
          ? {
              ...t,
              isWatered: true,
              waterCount: Math.min(MAX_WATER_PER_DAY - 1, (t.waterCount || 0) + 1)
            }
          : t
      )
    )
    SoundSystem.playWater()
    showToast('스마트 스프링클러가 전체 밭에 물을 분사했습니다!', 'info')
  }, [showToast])

  // 타일 클릭 통합 핸들러
  const handleTileClick = useCallback((tileId: string) => {
    const tile = tiles.find(t => t.id === tileId)
    if (!tile) return

    // 1. 이미 다 자란 작물이면 어떤 도구를 들고 있어도 바로 수확!
    if (tile.cropId && tile.currentStage >= 3) {
      harvestCrop(tileId)
      return
    }

    // 2. 선택된 도구에 따른 동작
    if (selectedTool === 'hoe') {
      if (!tile.isTilled) {
        tillTile(tileId)
      } else {
        showToast('이미 일궈진 밭입니다. 물을 주거나 씨앗을 심으세요.', 'info')
      }
    } else if (selectedTool === 'wateringCan') {
      if (!tile.isTilled) {
        showToast('먼저 호미로 땅을 일궈주세요.', 'warning')
      } else {
        waterTile(tileId)
      }
    } else if (selectedTool === 'hand') {
      const hasAutoTill = hasUpgrade('up_auto_till')
      if (!tile.cropId && (tile.isTilled || hasAutoTill)) {
        if (selectedSeed) {
          plantSeed(tileId, selectedSeed)
        } else {
          showToast('심을 씨앗을 선택해주세요!', 'warning')
        }
      } else if (!tile.isTilled && !hasAutoTill) {
        showToast('먼저 호미로 땅을 일궈주세요. (시설 확충에서 [무경운 자동 직파기] 구매 시 호미 없이 파종 가능)', 'warning')
      }
    } else if (selectedTool === 'sickle') {
      if (tile.cropId && tile.currentStage >= 3) {
        harvestCrop(tileId)
      } else {
        showToast('아직 완전히 영글지 않았습니다. 정성을 들여 키워주세요.', 'info')
      }
    }
  }, [tiles, selectedTool, selectedSeed, hasUpgrade, harvestCrop, tillTile, waterTile, plantSeed, showToast])

  // --- 날짜 및 시간 넘기기 ---
  const sleepNextDay = useCallback(() => {
    const nextDay = player.day + 1
    const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter']
    const seasonIndex = Math.floor(((nextDay - 1) % DAYS_PER_CYCLE) / DAYS_PER_SEASON)
    const nextSeason = seasons[seasonIndex]
    const isSeasonChanged = nextSeason !== player.season

    const prevCycle = Math.floor((player.day - 1) / DAYS_PER_CYCLE) + 1
    const nextCycle = Math.floor((nextDay - 1) / DAYS_PER_CYCLE) + 1
    const isNewCycle = nextCycle > prevCycle

    setPlayer(prev => {
      // 날씨 결정 (봄/가을: 맑음 75%, 비 25% / 여름: 비 35% / 겨울: 눈/비 30%)
      const isRainy = Math.random() < (nextSeason === 'summer' ? 0.35 : 0.25)
      const nextWeather: Weather = isRainy ? 'rainy' : 'sunny'

      return {
        ...prev,
        day: nextDay,
        hour: 6,
        season: nextSeason,
        weather: nextWeather,
        stamina: prev.maxStamina // 기력 완전 회복
      }
    })

    if (isSeasonChanged) {
      setContracts(prev => refreshContractsForSeason(prev, nextSeason, nextDay))
    } else {
      // 계절이 바뀌지 않았더라도, 마감 기한이 지난 미완료 계약(deadlineDay < nextDay)을 새 제철 계약으로 자동 갱신!
      setContracts(prev => {
        let expiredCount = 0
        const activeCropIds: string[] = []
        prev.forEach(c => {
          if (c.isCompleted || c.deadlineDay >= nextDay) {
            activeCropIds.push(c.cropId)
          }
        })

        const updated = prev.map(c => {
          if (!c.isCompleted && c.deadlineDay < nextDay) {
            expiredCount++
            const newCt = generateRandomContract(nextSeason, nextDay, activeCropIds)
            activeCropIds.push(newCt.cropId)
            return newCt
          }
          return c
        })

        if (expiredCount > 0) {
          setTimeout(() => {
            showToast(`📋 기한이 만료된 발주 계약 ${expiredCount}건이 새로운 품목 계약으로 자동 교체되었습니다.`, 'info')
          }, 400)
        }
        return updated
      })
    }

    // 스프링클러 여부 확인
    const hasSprinkler = hasUpgrade('up_sprinkler')

    let collapsedCount = 0
    const rottedCropNames: string[] = []
    const witheredSeasonCropNames: string[] = []

    // 타일 작물 성장, 자연재해(밭 훼손 0.1%, 작물 부패 0.2%), 물 증발 및 계절 변화에 따른 작물 소실
    setTiles(prev =>
      prev.map(tile => {
        // [계절 변화 이벤트] 계절이 바뀌었을 때: 심겨져 있던 모든 작물 시들어 소실!
        if (isSeasonChanged && tile.cropId) {
          const cropDef = CROPS_MAP.get(tile.cropId)
          if (cropDef) {
            witheredSeasonCropNames.push(cropDef.nameKr)
          }
          return {
            ...tile,
            cropId: null,
            daysGrown: 0,
            currentStage: 0,
            waterCount: hasSprinkler ? 1 : 0,
            isWatered: hasSprinkler,
            quality: 'normal'
          }
        }

        // 1. 하루가 지날 때 0.1% 확률로 밭이 망가짐 (호미질을 다시 해야 함)
        if (tile.isTilled && Math.random() < SOIL_DECAY_RATE) {
          collapsedCount++
          return {
            ...tile,
            isTilled: false,
            isWatered: false,
            cropId: null,
            daysGrown: 0,
            currentStage: 0,
            waterCount: 0,
            quality: 'normal'
          }
        }

        // 2. 매우 낮은 확률(0.2%)로 작물이 썩어서 사라짐 (병충해/부패)
        if (tile.cropId && Math.random() < CROP_ROT_RATE) {
          const cropDef = CROPS_MAP.get(tile.cropId)
          if (cropDef) {
            rottedCropNames.push(cropDef.nameKr)
          }
          return {
            ...tile,
            cropId: null,
            daysGrown: 0,
            currentStage: 0,
            waterCount: hasSprinkler ? 1 : 0,
            isWatered: hasSprinkler,
            quality: 'normal'
          }
        }

        let isWatered = tile.isWatered
        let currentStage = tile.currentStage
        let daysGrown = tile.daysGrown || 0

        // 물 준 타일에 심긴 작물은 생육 일수 1일 증가!
        if (tile.cropId && isWatered) {
          daysGrown += 1
          const cropDef = CROPS_MAP.get(tile.cropId)
          const targetDays = cropDef?.growthDays || 3

          if (daysGrown >= targetDays) {
            currentStage = 3 // 완숙 (수확 가능!)
          } else if (daysGrown >= Math.ceil(targetDays * 0.6)) {
            currentStage = 2 // 성장
          } else if (daysGrown >= Math.ceil(targetDays * 0.3)) {
            currentStage = 1 // 새싹
          } else {
            currentStage = 0 // 씨앗
          }
        }

        // 다음 날 물 상태 및 waterCount 초기화 (스프링클러가 있으면 자동 급수 및 1회 부여, 없으면 마름)
        return {
          ...tile,
          daysGrown,
          currentStage,
          isWatered: hasSprinkler,
          waterCount: hasSprinkler ? 1 : 0
        }
      })
    )

    // 마트 매대 신선도 약간 감소 (냉장 쇼케이스 없을 시)
    const hasColdShowcase = hasUpgrade('up_cold_showcase')
    if (!hasColdShowcase) {
      setShelves(prev =>
        prev.map(s => (s.stock > 0 ? { ...s, freshness: Math.max(50, s.freshness - 10) } : s))
      )
    }

    // 계절 변화로 심겨져 있던 작물이 시든 경우 알림
    if (witheredSeasonCropNames.length > 0) {
      SoundSystem.playWither()
      showToast(
        `🍂 [계절 변화] 새로운 계절이 찾아와 밭에 심겨 있던 작물(${witheredSeasonCropNames.join(', ')})이 모두 시들어 사라졌습니다.`,
        'warning'
      )
    }

    // 자연재해 및 작물 부패 알림 & 효과음
    if (collapsedCount > 0) {
      SoundSystem.playWither()
      showToast(
        `⚠️ [밭 훼손] 밤새 풍화와 지반 침하로 밭 ${collapsedCount}곳이 무너져 망가졌습니다! 호미로 다시 일궈주세요.`,
        'warning'
      )
    }
    if (rottedCropNames.length > 0) {
      SoundSystem.playWither()
      showToast(
        `🥀 [작물 부패] 밤새 병충해와 습기로 인해 작물(${rottedCropNames.join(', ')})이 썩어 사라졌습니다...`,
        'warning'
      )
    }

    if (witheredSeasonCropNames.length === 0 && collapsedCount === 0 && rottedCropNames.length === 0) {
      SoundSystem.playFanfare()
    }
    if (isNewCycle) {
      showToast(
        `🎊 축하합니다! 사계절 1사이클을 완주하고 [${nextCycle}년차]에 돌입했습니다! 종묘상에 2년차 전용 [마스터 작물]이 새로 입고되었습니다!`,
        'success'
      )
    } else if (isSeasonChanged) {
      showToast(
        `계절이 바뀌었습니다! 미완료 납품 계약이 ${nextSeason === 'spring' ? '봄 🌸' : nextSeason === 'summer' ? '여름 ☀️' : nextSeason === 'autumn' ? '가을 🍁' : '겨울 ❄️'} 제철 품목으로 갱신되었습니다.`,
        'success'
      )
    } else {
      const seasonDay = ((nextDay - 1) % DAYS_PER_SEASON) + 1
      showToast(
        `새로운 아침이 밝았습니다! (${nextCycle}년차 ${nextSeason === 'spring' ? '봄' : nextSeason === 'summer' ? '여름' : nextSeason === 'autumn' ? '가을' : '겨울'} ${seasonDay}/${DAYS_PER_SEASON}일) 기력이 100% 충전되었습니다.`,
        'success'
      )
    }

    // 취침 시 하루 자동 저장
    saveCurrentGame(true)
  }, [player.day, player.season, hasUpgrade, showToast, saveCurrentGame])

  const fastForwardHour = useCallback(() => {
    setPlayer(prev => {
      const nextHour = prev.hour + 1
      if (nextHour >= 22) {
        showToast('밤 10시가 되었습니다. 집으로 돌아가 잠을 청하세요!', 'info')
      }
      return { ...prev, hour: Math.min(23, nextHour) }
    })
  }, [showToast])

  const fastForwardDays = useCallback((days: number) => {
    for (let i = 0; i < days; i++) {
      sleepNextDay()
    }
  }, [sleepNextDay])

  // --- 로컬푸드 마트 운영 ---
  const stockShelf = useCallback((shelfId: string, targetId: string, count: number, price: number): boolean => {
    // 인벤토리에서 총 보유 수량 계산 (모든 품질 합산)
    const matchingItems = inventory.filter(i => (i.type === 'crop' || i.type === 'processed') && i.targetId === targetId)
    const totalCount = matchingItems.reduce((sum, i) => sum + i.count, 0)
    if (totalCount < count) {
      showToast(`인벤토리에 수량이 부족합니다. (보유: ${totalCount}개, 요청: ${count}개)`, 'warning')
      return false
    }

    const cropDef = CROPS_MAP.get(targetId)
    const basePrice = cropDef ? cropDef.basePrice : 2000
    const primaryQuality = matchingItems[0]?.quality || 'normal'
    const displayName = matchingItems[0]?.name || cropDef?.nameKr || '농산물'

    setShelves(prev =>
      prev.map(shelf => {
        if (shelf.id === shelfId) {
          return {
            ...shelf,
            cropId: targetId,
            quality: primaryQuality,
            stock: shelf.cropId === targetId ? shelf.stock + count : count,
            price: price,
            basePrice: basePrice,
            freshness: 100
          }
        }
        return shelf
      })
    )

    // 인벤토리 차감 (순차적 차감)
    setInventory(prev => {
      let toDeduct = count
      return prev
        .map(i => {
          if (toDeduct > 0 && (i.type === 'crop' || i.type === 'processed') && i.targetId === targetId) {
            const deduct = Math.min(i.count, toDeduct)
            toDeduct -= deduct
            return { ...i, count: i.count - deduct }
          }
          return i
        })
        .filter(i => i.count > 0)
    })

    SoundSystem.playClick()
    showToast(`매대에 [${displayName}] ${count}개를 진열했습니다.`, 'info')
    return true
  }, [inventory, showToast])

  const clearShelf = useCallback((shelfId: string) => {
    const shelf = shelves.find(s => s.id === shelfId)
    if (!shelf || !shelf.cropId || shelf.stock <= 0) return

    const cropDef = CROPS_MAP.get(shelf.cropId)
    if (cropDef) {
      setInventory(prev => [
        ...prev,
        {
          id: `inv_retrieved_${Date.now()}`,
          type: 'crop',
          targetId: shelf.cropId!,
          name: `${shelf.quality === 'supreme' ? '🌟특등 ' : shelf.quality === 'high' ? '✨고급 ' : ''}${cropDef.nameKr}`,
          count: shelf.stock,
          quality: shelf.quality,
          unitPrice: shelf.price
        }
      ])
    }

    setShelves(prev =>
      prev.map(s => (s.id === shelfId ? { ...s, cropId: null, stock: 0, price: 0 } : s))
    )

    SoundSystem.playClick()
    showToast('매대의 상품을 다시 회수하여 보관했습니다.', 'info')
  }, [shelves, showToast])

  // 손님 결제
  const checkoutCustomer = useCallback((customerId: string) => {
    const cust = customers.find(c => c.id === customerId)
    if (!cust || cust.cart.length === 0) return

    const totalBill = cust.cart.reduce((sum, item) => sum + item.unitPrice * item.count, 0)

    setPlayer(prev => ({
      ...prev,
      gold: prev.gold + totalBill,
      totalEarned: prev.totalEarned + totalBill,
      reputation: prev.reputation + 2,
      martCustomersServed: prev.martCustomersServed + 1
    }))

    // 손님 퇴장 상태로 전환 후 제거
    setCustomers(prev =>
      prev.map(c => (c.id === customerId ? { ...c, state: 'leaving', bubble: '맛있게 먹을게요! 감사해요~' } : c))
    )

    SoundSystem.playRegister()
    showToast(`[${cust.name}] 손님 결제 완료! +₩${totalBill.toLocaleString()} 매출 달성!`, 'success')

    setTimeout(() => {
      setCustomers(prev => prev.filter(c => c.id !== customerId))
    }, 1500)
  }, [customers, showToast])

  // 실시간 마트 손님 스폰 & 쇼핑 시뮬레이션 루프
  useEffect(() => {
    const hasMarketing = hasUpgrade('up_mart_marketing')
    const intervalTime = hasMarketing ? 4000 : 6500

    const martTimer = setInterval(() => {
      // 영업 시간 (오전 8시 ~ 밤 9시) 및 재고 확인
      const stockedShelves = shelves.filter(s => s.cropId && s.stock > 0)
      if (stockedShelves.length === 0) return

      // 현재 매장에 손님이 4명 이하일 때만 추가
      setCustomers(prev => {
        if (prev.length >= 4) return prev

        const preset = CUSTOMER_PRESETS[Math.floor(Math.random() * CUSTOMER_PRESETS.length)]
        const newCustId = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`

        // 진열대 중 손님이 선호하거나 아무 재고 있는 매대 선택
        const targetShelf = stockedShelves[Math.floor(Math.random() * stockedShelves.length)]
        const cropDef = CROPS_MAP.get(targetShelf.cropId!)

        // 1~2개 구매
        const buyCount = Math.min(targetShelf.stock, Math.floor(Math.random() * 2) + 1)
        const unitPrice = targetShelf.price > 0 ? targetShelf.price : (cropDef?.basePrice || 2000)

        // 매대 재고 차감
        setShelves(sList =>
          sList.map(s => (s.id === targetShelf.id ? { ...s, stock: Math.max(0, s.stock - buyCount) } : s))
        )

        const newCustomer: Customer = {
          id: newCustId,
          name: preset.name,
          role: preset.role,
          avatar: preset.avatar,
          preferredCategories: preset.preferredCategories,
          budget: preset.budget,
          state: 'queued', // 장바구니 담고 바로 계산 대기로
          bubble: `${cropDef?.nameKr || '작물'} ${buyCount}개 샀어요! 계산해주세요~`,
          cart: [
            {
              cropId: targetShelf.cropId!,
              name: cropDef?.nameKr || '농산물',
              count: buyCount,
              unitPrice: unitPrice
            }
          ]
        }

        return [...prev, newCustomer]
      })
    }, intervalTime)

    return () => clearInterval(martTimer)
  }, [shelves, hasUpgrade])

  // 자동 키오스크 POS 업그레이드 시 자동 결제
  useEffect(() => {
    const hasSmartPos = hasUpgrade('up_smart_pos')
    if (!hasSmartPos) return

    const queuedCust = customers.find(c => c.state === 'queued')
    if (queuedCust) {
      const timer = setTimeout(() => {
        checkoutCustomer(queuedCust.id)
      }, 1800)
      return () => clearTimeout(timer)
    }
  }, [customers, hasUpgrade, checkoutCustomer])

  // --- B2B 납품 계약 체결 및 완료 ---
  const fulfillContract = useCallback((contractId: string): boolean => {
    const ct = contracts.find(c => c.id === contractId)
    if (!ct || ct.isCompleted) return false

    // 인벤토리에서 요구 수량 체크 (모든 품질 합산)
    const totalOwned = inventory
      .filter(i => i.type === 'crop' && i.targetId === ct.cropId)
      .reduce((sum, i) => sum + i.count, 0)

    if (totalOwned < ct.requiredCount) {
      showToast(`납품 수량이 부족합니다! (${ct.cropName} ${ct.requiredCount}개 필요, 현재 보유: ${totalOwned}개)`, 'warning')
      return false
    }

    // 인벤토리 차감 (일반 -> 고급 -> 특등 순차 차감)
    setInventory(prev => {
      let toDeduct = ct.requiredCount
      return prev
        .map(i => {
          if (toDeduct > 0 && i.type === 'crop' && i.targetId === ct.cropId) {
            const deduct = Math.min(i.count, toDeduct)
            toDeduct -= deduct
            return { ...i, count: i.count - deduct }
          }
          return i
        })
        .filter(i => i.count > 0)
    })

    // 보상 지급 및 납품 횟수 증가
    const nextFulfilled = player.contractsFulfilled + 1
    setPlayer(prev => ({
      ...prev,
      gold: prev.gold + ct.rewardGold,
      totalEarned: prev.totalEarned + ct.rewardGold,
      reputation: prev.reputation + ct.rewardReputation,
      contractsFulfilled: nextFulfilled
    }))

    // 계약 완료 처리: 완료된 계약은 즉시 목록에서 제거되고 새로운 발주가 입고됨!
    setContracts(prev => {
      const remaining = prev.filter(c => c.id !== contractId)
      const currentCropIds = remaining.map(c => c.cropId)
      const newContract = generateRandomContract(player.season, player.day, currentCropIds)
      return [...remaining, newContract]
    })

    SoundSystem.playFanfare()
    showToast(
      `대형 계약 납품 완료! [${ct.clientName}]에 출하하여 ₩${ct.rewardGold.toLocaleString()}과 평판 +${ct.rewardReputation} 획득! 새로운 발주가 등록되었습니다.`,
      'success'
    )

    // 3회 달성 시 식당 해금 축하 알림
    if (nextFulfilled === 3) {
      setTimeout(() => {
        SoundSystem.playFanfare()
        showToast('🎉 B2B 납품 3회 달성! [늘봄 식당] 부지 매입 및 요리 시스템이 해금되었습니다! 상단 탭을 확인하세요.', 'success')
      }, 1000)
    }

    return true
  }, [contracts, inventory, player.contractsFulfilled, player.season, player.day, showToast])

  // 계약 단건 갱신 / 대체 (기한이 만료되었거나 새로운 발주서로 교체를 원할 때)
  const renewContract = useCallback((contractId: string): boolean => {
    const ct = contracts.find(c => c.id === contractId)
    if (!ct) return false

    setContracts(prev => {
      const remaining = prev.filter(c => c.id !== contractId)
      const currentCropIds = remaining.map(c => c.cropId)
      const newContract = generateRandomContract(player.season, player.day, currentCropIds)
      return [...remaining, newContract]
    })

    SoundSystem.playRegister()
    showToast(`🔄 [${ct.clientName}] 발주 계약이 새로운 제철 품목으로 갱신되었습니다!`, 'info')
    return true
  }, [contracts, player.season, player.day, showToast])

  // 기한 만료된 모든 계약 일괄 갱신
  const refreshExpiredContracts = useCallback((): number => {
    let replacedCount = 0
    setContracts(prev => {
      const remainingCropIds = prev
        .filter(c => c.isCompleted || c.deadlineDay >= player.day)
        .map(c => c.cropId)

      return prev.map(c => {
        if (!c.isCompleted && c.deadlineDay < player.day) {
          replacedCount++
          const newCt = generateRandomContract(player.season, player.day, remainingCropIds)
          remainingCropIds.push(newCt.cropId)
          return newCt
        }
        return c
      })
    })

    if (replacedCount > 0) {
      SoundSystem.playFanfare()
      showToast(`🔄 기한이 지난 계약 ${replacedCount}건을 모두 새로운 발주 계약으로 갱신했습니다!`, 'success')
    } else {
      showToast('현재 기한이 지난 계약이 없습니다.', 'info')
    }
    return replacedCount
  }, [player.season, player.day, showToast])

  // --- 늘봄 식당 & 요리 시스템 ---
  const buyRestaurant = useCallback((): boolean => {
    const RESTAURANT_PRICE = 45000
    if (restaurant.isOwned) {
      showToast('이미 늘봄 식당을 보유하고 있습니다.', 'info')
      return false
    }
    if (player.gold < RESTAURANT_PRICE) {
      showToast(`식당 인수 자금이 부족합니다! (₩${RESTAURANT_PRICE.toLocaleString()} 필요, 현재 ₩${player.gold.toLocaleString()})`, 'warning')
      return false
    }

    setPlayer(prev => ({ ...prev, gold: prev.gold - RESTAURANT_PRICE }))
    setRestaurant(prev => ({ ...prev, isOwned: true }))
    SoundSystem.playFanfare()
    showToast('🎊 늘봄 식당 인수 완료! 주방 조리기구를 확충하고 요리를 시작해보세요!', 'success')
    return true
  }, [restaurant.isOwned, player.gold, showToast])

  const buyUtensil = useCallback((utensilId: CookingUtensilType): boolean => {
    const utensil = UTENSILS_MAP.get(utensilId)
    if (!utensil) return false
    if (restaurant.unlockedUtensils.includes(utensilId)) {
      showToast('이미 보유한 조리기구입니다.', 'info')
      return false
    }
    if (player.gold < utensil.price) {
      showToast(`골드가 부족합니다! (₩${utensil.price.toLocaleString()} 필요)`, 'warning')
      return false
    }

    setPlayer(prev => ({ ...prev, gold: prev.gold - utensil.price }))
    setRestaurant(prev => ({
      ...prev,
      unlockedUtensils: [...prev.unlockedUtensils, utensilId]
    }))
    SoundSystem.playFanfare()
    showToast(`🍳 [${utensil.name}] 구비 완료! 새로운 레시피들이 해금되었습니다.`, 'success')
    return true
  }, [restaurant.unlockedUtensils, player.gold, showToast])

  const cookDish = useCallback((recipeId: string): boolean => {
    const recipe = RECIPES_MAP.get(recipeId)
    if (!recipe) return false

    if (!restaurant.isOwned) {
      showToast('먼저 늘봄 식당을 인수해야 요리를 할 수 있습니다!', 'warning')
      return false
    }

    if (!restaurant.unlockedUtensils.includes(recipe.utensilId)) {
      const utensil = UTENSILS_MAP.get(recipe.utensilId)
      showToast(`[${utensil?.name || '조리기구'}]가 필요합니다! 조리기구를 먼저 구매하세요.`, 'warning')
      return false
    }

    if (player.stamina < 5) {
      showToast('기력이 부족합니다! (요리당 기력 5 소모) 휴식을 취하세요.', 'warning')
      return false
    }

    // 재료 확인 (모든 품질 합산)
    for (const ing of recipe.ingredients) {
      const totalOwned = inventory
        .filter(i => i.type === 'crop' && i.targetId === ing.cropId)
        .reduce((sum, i) => sum + i.count, 0)
      const cropDef = CROPS_MAP.get(ing.cropId)
      if (totalOwned < ing.count) {
        showToast(`재료가 부족합니다! (${cropDef?.nameKr || '작물'} ${ing.count}개 필요, 보유: ${totalOwned}개)`, 'warning')
        return false
      }
    }

    // 재료 차감 (순차적 차감)
    setInventory(prev => {
      let nextInv = [...prev]
      for (const ing of recipe.ingredients) {
        let toDeduct = ing.count
        nextInv = nextInv.map(item => {
          if (toDeduct > 0 && item.type === 'crop' && item.targetId === ing.cropId) {
            const deduct = Math.min(item.count, toDeduct)
            toDeduct -= deduct
            return { ...item, count: item.count - deduct }
          }
          return item
        })
      }
      return nextInv.filter(item => item.count > 0)
    })

    // 기력 5 소모
    setPlayer(prev => ({ ...prev, stamina: Math.max(0, prev.stamina - 5) }))

    // 완성 요리 추가
    setRestaurant(prev => {
      const existing = prev.cookedInventory.find(d => d.recipeId === recipeId)
      if (existing) {
        return {
          ...prev,
          cookedInventory: prev.cookedInventory.map(d =>
            d.recipeId === recipeId ? { ...d, count: d.count + 1 } : d
          )
        }
      }
      return {
        ...prev,
        cookedInventory: [
          ...prev.cookedInventory,
          {
            id: `dish_${recipeId}_${Date.now()}`,
            recipeId: recipe.id,
            name: recipe.name,
            icon: recipe.icon,
            count: 1,
            sellPrice: recipe.sellPrice,
            staminaRecovery: recipe.staminaRecovery,
            reputationReward: recipe.reputationReward
          }
        ]
      }
    })

    SoundSystem.playFanfare()
    showToast(`👨‍🍳 [${recipe.name}] 조리 완성! (기력 -5 소모)`, 'success')
    return true
  }, [restaurant, player.stamina, inventory, showToast])

  const serveDish = useCallback((recipeId: string): boolean => {
    const dish = restaurant.cookedInventory.find(d => d.recipeId === recipeId)
    if (!dish || dish.count <= 0) {
      showToast('서빙할 요리가 부족합니다!', 'warning')
      return false
    }

    setRestaurant(prev => ({
      ...prev,
      totalDishesServed: prev.totalDishesServed + 1,
      cookedInventory: prev.cookedInventory
        .map(d => (d.recipeId === recipeId ? { ...d, count: d.count - 1 } : d))
        .filter(d => d.count > 0)
    }))

    setPlayer(prev => ({
      ...prev,
      gold: prev.gold + dish.sellPrice,
      totalEarned: prev.totalEarned + dish.sellPrice,
      reputation: prev.reputation + dish.reputationReward
    }))

    SoundSystem.playCoin()
    showToast(`🍽️ 손님에게 [${dish.name}] 서빙 완료! +₩${dish.sellPrice.toLocaleString()} 및 평판 +${dish.reputationReward}P`, 'success')
    return true
  }, [restaurant.cookedInventory, showToast])

  const eatDish = useCallback((recipeId: string): boolean => {
    const dish = restaurant.cookedInventory.find(d => d.recipeId === recipeId)
    if (!dish || dish.count <= 0) {
      showToast('맛볼 요리가 없습니다!', 'warning')
      return false
    }

    if (player.stamina >= player.maxStamina) {
      showToast('이미 기력이 가득 차 있습니다!', 'info')
      return false
    }

    setRestaurant(prev => ({
      ...prev,
      cookedInventory: prev.cookedInventory
        .map(d => (d.recipeId === recipeId ? { ...d, count: d.count - 1 } : d))
        .filter(d => d.count > 0)
    }))

    const recoveryAmount = Math.min(player.maxStamina - player.stamina, dish.staminaRecovery)
    setPlayer(prev => ({
      ...prev,
      stamina: Math.min(prev.maxStamina, prev.stamina + dish.staminaRecovery)
    }))

    SoundSystem.playCoin()
    showToast(`😋 [${dish.name}]을 맛있게 먹고 기력을 +${recoveryAmount} 회복했습니다!`, 'success')
    return true
  }, [restaurant.cookedInventory, player.stamina, player.maxStamina, showToast])

  const shipDishToMart = useCallback((recipeId: string): boolean => {
    const dish = restaurant.cookedInventory.find(d => d.recipeId === recipeId)
    if (!dish || dish.count <= 0) return false

    setRestaurant(prev => ({
      ...prev,
      cookedInventory: prev.cookedInventory
        .map(d => (d.recipeId === recipeId ? { ...d, count: d.count - 1 } : d))
        .filter(d => d.count > 0)
    }))

    setInventory(prev => {
      const existing = prev.find(i => i.type === 'processed' && i.targetId === recipeId)
      if (existing) {
        return prev.map(i => (i.id === existing.id ? { ...i, count: i.count + 1 } : i))
      }
      return [
        ...prev,
        {
          id: `inv_dish_${recipeId}_${Date.now()}`,
          type: 'processed',
          targetId: recipeId,
          name: dish.name,
          count: 1,
          unitPrice: dish.sellPrice
        }
      ]
    })

    showToast(`📦 [${dish.name}]을 로컬푸드 마트 매대 판매용으로 출하했습니다.`, 'info')
    return true
  }, [restaurant.cookedInventory, showToast])


  // --- 종묘상 씨앗 구매 ---
  const buySeeds = useCallback((cropId: string, count: number): boolean => {
    const cropDef = CROPS_MAP.get(cropId)
    if (!cropDef) return false

    const totalCost = cropDef.seedPrice * count
    if (player.gold < totalCost) {
      showToast('소지금이 부족합니다!', 'warning')
      return false
    }

    setPlayer(prev => ({ ...prev, gold: prev.gold - totalCost }))

    setInventory(prev => {
      const existing = prev.find(i => i.type === 'seed' && i.targetId === cropId)
      if (existing) {
        return prev.map(i => (i.id === existing.id ? { ...i, count: i.count + count } : i))
      }
      return [
        ...prev,
        {
          id: `inv_seed_${cropId}_${Date.now()}`,
          type: 'seed',
          targetId: cropId,
          name: `${cropDef.nameKr} 씨앗`,
          count: count,
          unitPrice: cropDef.seedPrice
        }
      ]
    })

    SoundSystem.playCoin()
    showToast(`${cropDef.nameKr} 씨앗 ${count}포 구매 완료 (-₩${totalCost.toLocaleString()})`, 'success')
    return true
  }, [player.gold, showToast])

  // --- 시설 업그레이드 구매 ---
  const buyUpgrade = useCallback((upgradeId: string): boolean => {
    const up = upgrades.find(u => u.id === upgradeId)
    if (!up) return false

    if (up.level >= up.maxLevel) {
      showToast('이미 최고 등급으로 확장된 시설입니다!', 'info')
      return false
    }

    if (player.gold < up.cost) {
      showToast(`자금이 부족합니다! (필요 자금: ₩${up.cost.toLocaleString()})`, 'warning')
      return false
    }

    setPlayer(prev => ({ ...prev, gold: prev.gold - up.cost }))

    setUpgrades(prev =>
      prev.map(u => (u.id === upgradeId ? { ...u, level: u.level + 1, cost: Math.round(u.cost * 1.5) } : u))
    )

    // 특수 업그레이드 효과 처리
    if (upgradeId === 'up_field_expand') {
      const nextGridSize = gridSize === 3 ? 4 : 5
      setGridSize(nextGridSize)
      setTiles(createInitialTiles(nextGridSize))
      showToast(`텃밭이 ${nextGridSize}x${nextGridSize} 크기로 확장되었습니다!`, 'success')
    } else if (upgradeId === 'up_mart_shelves') {
      const newShelfId = `shelf_${shelves.length + 1}`
      setShelves(prev => [
        ...prev,
        {
          id: newShelfId,
          name: `${prev.length + 1}호 확장 진열 매대`,
          shelfType: 'special',
          cropId: null,
          quality: 'normal',
          stock: 0,
          maxStock: 20,
          price: 0,
          basePrice: 0,
          freshness: 100
        }
      ])
      showToast('마트에 새로운 대형 진열 매대가 증설되었습니다!', 'success')
    }

    SoundSystem.playFanfare()
    showToast(`시설 확충 성공: [${up.name}] Level Up!`, 'success')
    return true
  }, [upgrades, player.gold, gridSize, shelves.length, showToast])

  // --- 수확물 가공 ---
  const processCrop = useCallback((cropId: string, count: number): boolean => {
    const cropDef = CROPS_MAP.get(cropId)
    if (!cropDef || !cropDef.canProcess || !cropDef.processedName || !cropDef.processedPrice) {
      showToast('가공할 수 없는 품목입니다.', 'warning')
      return false
    }

    const totalOwned = inventory
      .filter(i => i.type === 'crop' && i.targetId === cropId)
      .reduce((sum, i) => sum + i.count, 0)

    if (totalOwned < count) {
      showToast(`가공할 원물 수량이 부족합니다. (${cropDef.nameKr} ${count}개 필요, 현재 보유: ${totalOwned}개)`, 'warning')
      return false
    }

    // 인벤토리 차감 (순차적 차감)
    setInventory(prev => {
      let toDeduct = count
      return prev
        .map(i => {
          if (toDeduct > 0 && i.type === 'crop' && i.targetId === cropId) {
            const deduct = Math.min(i.count, toDeduct)
            toDeduct -= deduct
            return { ...i, count: i.count - deduct }
          }
          return i
        })
        .filter(i => i.count > 0)
    })

    // 가공품 생성
    setInventory(prev => {
      const existing = prev.find(i => i.type === 'processed' && i.targetId === cropId)
      if (existing) {
        return prev.map(i => (i.id === existing.id ? { ...i, count: i.count + count } : i))
      }
      return [
        ...prev,
        {
          id: `inv_proc_${cropId}_${Date.now()}`,
          type: 'processed',
          targetId: cropId,
          name: `🍯${cropDef.processedName}`,
          count: count,
          quality: 'supreme',
          unitPrice: cropDef.processedPrice!
        }
      ]
    })

    SoundSystem.playHarvest()
    showToast(`가공 성공! 고부가가치 [${cropDef.processedName}] ${count}개를 생산했습니다!`, 'success')
    return true
  }, [inventory, showToast])

  // --- 디버그/치트 (에이전트 검증용) ---
  const addFunds = useCallback((amount: number) => {
    setPlayer(prev => ({
      ...prev,
      gold: prev.gold + amount,
      totalEarned: prev.totalEarned + amount
    }))
    SoundSystem.playCoin()
    showToast(`[테스트] 지원금 +₩${amount.toLocaleString()} 지급 완료`, 'info')
  }, [showToast])

  const giveSeeds = useCallback((cropId: string, count: number) => {
    const cropDef = CROPS_MAP.get(cropId)
    if (!cropDef) return
    setInventory(prev => {
      const existing = prev.find(i => i.type === 'seed' && i.targetId === cropId)
      if (existing) {
        return prev.map(i => (i.id === existing.id ? { ...i, count: i.count + count } : i))
      }
      return [
        ...prev,
        {
          id: `inv_seed_${cropId}_debug`,
          type: 'seed',
          targetId: cropId,
          name: `${cropDef.nameKr} 씨앗`,
          count,
          unitPrice: cropDef.seedPrice
        }
      ]
    })
    showToast(`[테스트] ${cropDef.nameKr} 씨앗 ${count}포 지급 완료`, 'info')
  }, [showToast])

  const giveCrops = useCallback((cropId: string, count: number) => {
    const cropDef = CROPS_MAP.get(cropId)
    if (!cropDef) return
    setInventory(prev => {
      const existing = prev.find(i => i.type === 'crop' && i.targetId === cropId)
      if (existing) {
        return prev.map(i => (i.id === existing.id ? { ...i, count: i.count + count } : i))
      }
      return [
        ...prev,
        {
          id: `inv_crop_${cropId}_debug_${Date.now()}`,
          type: 'crop',
          targetId: cropId,
          name: cropDef.nameKr,
          count,
          quality: 'normal',
          unitPrice: cropDef.basePrice
        }
      ]
    })
    showToast(`[테스트] ${cropDef.nameKr} 수확물 ${count}개 지급 완료`, 'info')
  }, [showToast])

  const forceDecayTile = useCallback((tileIndex?: number): boolean => {
    let decayed = false
    setTiles(prev => {
      const targetIdx =
        tileIndex !== undefined && tileIndex >= 0 && tileIndex < prev.length
          ? tileIndex
          : prev.findIndex(t => t.isTilled)
      if (targetIdx === -1) return prev

      decayed = true
      return prev.map((t, idx) => {
        if (idx === targetIdx) {
          return {
            ...t,
            isTilled: false,
            isWatered: false,
            cropId: null,
            daysGrown: 0,
            currentStage: 0,
            quality: 'normal'
          }
        }
        return t
      })
    })

    if (decayed) {
      SoundSystem.playWither()
      showToast('⚠️ [밭 훼손] 지반 침하와 풍화로 밭이 무너져 망가졌습니다! 호미로 다시 일궈주세요.', 'warning')
    }
    return decayed
  }, [showToast])

  const forceRotCrop = useCallback((tileIndex?: number): boolean => {
    let rotted = false
    let rottedName = '작물'
    setTiles(prev => {
      const targetIdx =
        tileIndex !== undefined && tileIndex >= 0 && tileIndex < prev.length
          ? tileIndex
          : prev.findIndex(t => !!t.cropId)
      if (targetIdx === -1) return prev

      const targetCrop = prev[targetIdx].cropId
      const cropDef = targetCrop ? CROPS_MAP.get(targetCrop) : null
      rottedName = cropDef ? cropDef.nameKr : '작물'
      rotted = true

      return prev.map((t, idx) => {
        if (idx === targetIdx) {
          return {
            ...t,
            cropId: null,
            daysGrown: 0,
            currentStage: 0,
            quality: 'normal'
          }
        }
        return t
      })
    })

    if (rotted) {
      SoundSystem.playWither()
      showToast(`🥀 [작물 부패] 병충해와 습기로 인해 작물(${rottedName})이 썩어 사라졌습니다...`, 'warning')
    }
    return rotted
  }, [showToast])

  const currentYear = Math.floor((player.day - 1) / DAYS_PER_CYCLE) + 1
  const currentSeasonDay = ((player.day - 1) % DAYS_PER_SEASON) + 1

  const value = useMemo(
    () => ({
      player,
      tiles,
      inventory,
      shelves,
      customers,
      contracts,
      upgrades,
      activeTab,
      selectedTool,
      selectedSeed,
      toasts,
      gridSize,
      restaurant,
      currentYear,
      currentSeasonDay,
      setActiveTab,
      setSelectedTool,
      setSelectedSeed,
      handleTileClick,
      tillTile,
      waterTile,
      plantSeed,
      harvestCrop,
      waterAllTiles,
      sleepNextDay,
      fastForwardHour,
      fastForwardDays,
      stockShelf,
      clearShelf,
      checkoutCustomer,
      fulfillContract,
      renewContract,
      refreshExpiredContracts,
      buyRestaurant,
      buyUtensil,
      cookDish,
      serveDish,
      eatDish,
      shipDishToMart,
      buySeeds,
      buyUpgrade,
      processCrop,
      addFunds,
      giveSeeds,
      giveCrops,
      forceDecayTile,
      forceRotCrop,
      showToast,
      currentUser,
      isAuthModalOpen,
      setIsAuthModalOpen,
      loginUser,
      registerUser,
      logoutUser,
      saveCurrentGame,
      deleteUser,
      getUserProfiles
    }),
    [
      player,
      tiles,
      inventory,
      shelves,
      customers,
      contracts,
      upgrades,
      activeTab,
      selectedTool,
      selectedSeed,
      toasts,
      gridSize,
      restaurant,
      currentYear,
      currentSeasonDay,
      handleTileClick,
      tillTile,
      waterTile,
      plantSeed,
      harvestCrop,
      waterAllTiles,
      sleepNextDay,
      fastForwardHour,
      fastForwardDays,
      stockShelf,
      clearShelf,
      checkoutCustomer,
      fulfillContract,
      renewContract,
      refreshExpiredContracts,
      buyRestaurant,
      buyUtensil,
      cookDish,
      serveDish,
      eatDish,
      shipDishToMart,
      buySeeds,
      buyUpgrade,
      processCrop,
      addFunds,
      giveSeeds,
      giveCrops,
      forceDecayTile,
      forceRotCrop,
      showToast,
      currentUser,
      isAuthModalOpen,
      loginUser,
      registerUser,
      logoutUser,
      saveCurrentGame,
      deleteUser,
      getUserProfiles
    ]
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
