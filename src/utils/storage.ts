import { UserProfile, SaveGamePayload } from '../types/auth'

const USERS_KEY = 'FARM_GAME_USERS_LIST'
const LAST_USER_KEY = 'FARM_GAME_LAST_ACTIVE_USER'
const SAVE_PREFIX = 'FARM_GAME_SAVE_'

// 간이 해시 (브라우저 로컬 저장용 간단 해싱)
export function hashPassword(password: string): string {
  if (!password) return ''
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return 'h_' + Math.abs(hash).toString(36)
}

export function getStoredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as UserProfile[]
  } catch (err) {
    console.error('Failed to parse users list from localStorage:', err)
    return []
  }
}

export function saveStoredUsers(users: UserProfile[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch (err) {
    console.error('Failed to save users list to localStorage:', err)
  }
}

export function getStoredSave(username: string): SaveGamePayload | null {
  try {
    const raw = localStorage.getItem(SAVE_PREFIX + username)
    if (!raw) return null
    return JSON.parse(raw) as SaveGamePayload
  } catch (err) {
    console.error(`Failed to load save for ${username}:`, err)
    return null
  }
}

export function writeStoredSave(payload: SaveGamePayload): boolean {
  try {
    localStorage.setItem(SAVE_PREFIX + payload.username, JSON.stringify(payload))
    // 유저 메타데이터 업데이트 (마지막 저장 시간 및 스탯 요약)
    const users = getStoredUsers()
    const updatedUsers = users.map(u => {
      if (u.username === payload.username) {
        return {
          ...u,
          lastSavedAt: payload.savedAt,
          farmSummary: {
            gold: payload.player?.gold || 0,
            day: payload.player?.day || 1,
            year: Math.floor(((payload.player?.day || 1) - 1) / 80) + 1,
            season: payload.player?.season || 'spring',
            reputation: payload.player?.reputation || 0
          }
        }
      }
      return u
    })
    saveStoredUsers(updatedUsers)
    return true
  } catch (err) {
    console.error(`Failed to write save for ${payload.username}:`, err)
    return false
  }
}

export function removeStoredSave(username: string): void {
  try {
    localStorage.removeItem(SAVE_PREFIX + username)
    const users = getStoredUsers().filter(u => u.username !== username)
    saveStoredUsers(users)
    if (getLastActiveUser() === username) {
      setLastActiveUser(null)
    }
  } catch (err) {
    console.error(`Failed to delete save for ${username}:`, err)
  }
}

export function getLastActiveUser(): string | null {
  try {
    return localStorage.getItem(LAST_USER_KEY)
  } catch {
    return null
  }
}

export function setLastActiveUser(username: string | null): void {
  try {
    if (username) {
      localStorage.setItem(LAST_USER_KEY, username)
    } else {
      localStorage.removeItem(LAST_USER_KEY)
    }
  } catch (err) {
    console.error('Failed to set last active user:', err)
  }
}
