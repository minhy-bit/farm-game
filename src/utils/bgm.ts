// Web Audio API Procedural Background Music Synthesizer
// 외부 음원 파일 없이 100% 무손실 실시간 합성되는 잔잔한 힐링 농장 BGM 시스템

export interface BgmTrackInfo {
  id: string
  title: string
  subtitle: string
  description: string
  tempo: number
  mood: string
}

export const BGM_TRACKS: BgmTrackInfo[] = [
  {
    id: 'morning',
    title: '늘봄마을의 아침',
    subtitle: 'Spring Meadow Breeze',
    description: '새벽 안개가 걷히고 텃밭에 따스한 아침 햇살이 비치는 맑고 청량한 칼림바 멜로디',
    tempo: 70,
    mood: '산뜻하고 평화로운 아침'
  },
  {
    id: 'breeze',
    title: '오후의 살랑바람',
    subtitle: 'Sunny Breeze',
    description: '작물이 자라나는 푸른 들판 위로 부드러운 바람이 스치는 여유로운 어쿠스틱 화음',
    tempo: 72,
    mood: '따스하고 한가로운 오후'
  },
  {
    id: 'night',
    title: '별빛 고요한 밤',
    subtitle: 'Starry Night Reverie',
    description: '하루 일과를 마치고 달빛 아래 은은하게 울려 퍼지는 몽환적인 힐링 오르골 자장가',
    tempo: 62,
    mood: '아늑하고 편안한 밤'
  },
  {
    id: 'rainy',
    title: '처마 끝의 단비',
    subtitle: 'Gentle Raindrop Chill',
    description: '텃밭을 촉촉하게 적시는 빗소리처럼 차분하고 서정적인 로파이 앰비언트 피아노',
    tempo: 65,
    mood: '서정적이고 포근한 비'
  }
]

// 음이름 -> 주파수(Hz) 변환 유틸
function noteToFreq(note: string): number {
  const NOTES: Record<string, number> = {
    C: 0,
    'C#': 1,
    Db: 1,
    D: 2,
    'D#': 3,
    Eb: 3,
    E: 4,
    F: 5,
    'F#': 6,
    Gb: 6,
    G: 7,
    'G#': 8,
    Ab: 8,
    A: 9,
    'A#': 10,
    Bb: 10,
    B: 11
  }
  const match = note.match(/^([A-Ga-g][#b]?)(-?\d+)$/)
  if (!match) return 440
  const name = match[1].toUpperCase()
  const octave = parseInt(match[2], 10)
  const semitonesFromA4 = NOTES[name] - 9 + (octave - 4) * 12
  return 440 * Math.pow(2, semitonesFromA4 / 12)
}

interface NoteEvent {
  beat: number
  note?: string
  notes?: string[]
  dur: number
  vel?: number
  pan?: number
}

interface TrackScore {
  totalBeats: number
  tempo: number
  bass: NoteEvent[]
  pad: NoteEvent[]
  chimes: NoteEvent[]
  melody: NoteEvent[]
}

// 1. 늘봄마을의 아침 (C Major / G Major - 청량하고 잔잔한 아침)
const MORNING_SCORE: TrackScore = {
  totalBeats: 32,
  tempo: 70,
  bass: [
    { beat: 0, note: 'C2', dur: 3.5, vel: 0.35 },
    { beat: 4, note: 'G2', dur: 3.5, vel: 0.32 },
    { beat: 8, note: 'A2', dur: 3.5, vel: 0.32 },
    { beat: 12, note: 'F2', dur: 3.5, vel: 0.35 },
    { beat: 16, note: 'E2', dur: 3.5, vel: 0.3 },
    { beat: 20, note: 'A2', dur: 3.5, vel: 0.32 },
    { beat: 24, note: 'D2', dur: 3.5, vel: 0.32 },
    { beat: 28, note: 'G2', dur: 3.5, vel: 0.35 }
  ],
  pad: [
    { beat: 0, notes: ['C3', 'G3', 'B3', 'E4'], dur: 3.8, vel: 0.08 },
    { beat: 4, notes: ['B2', 'G3', 'D4', 'G4'], dur: 3.8, vel: 0.08 },
    { beat: 8, notes: ['A2', 'E3', 'C4', 'E4'], dur: 3.8, vel: 0.08 },
    { beat: 12, notes: ['F2', 'C3', 'A3', 'C4'], dur: 3.8, vel: 0.08 },
    { beat: 16, notes: ['E2', 'B2', 'G3', 'B3'], dur: 3.8, vel: 0.08 },
    { beat: 20, notes: ['A2', 'E3', 'C4', 'G4'], dur: 3.8, vel: 0.08 },
    { beat: 24, notes: ['D3', 'A3', 'C4', 'F4'], dur: 3.8, vel: 0.08 },
    { beat: 28, notes: ['G2', 'D3', 'B3', 'F4'], dur: 3.8, vel: 0.08 }
  ],
  chimes: [
    { beat: 1, note: 'G4', dur: 1.2, vel: 0.22, pan: -0.25 },
    { beat: 2.5, note: 'E4', dur: 1.0, vel: 0.18, pan: 0.25 },
    { beat: 5, note: 'D4', dur: 1.2, vel: 0.2, pan: -0.2 },
    { beat: 6.5, note: 'G4', dur: 1.0, vel: 0.18, pan: 0.2 },
    { beat: 9, note: 'E4', dur: 1.2, vel: 0.2, pan: -0.3 },
    { beat: 10.5, note: 'C5', dur: 1.0, vel: 0.22, pan: 0.3 },
    { beat: 13, note: 'A4', dur: 1.2, vel: 0.2, pan: -0.2 },
    { beat: 14.5, note: 'C5', dur: 1.0, vel: 0.18, pan: 0.2 },
    { beat: 17, note: 'G4', dur: 1.2, vel: 0.2, pan: -0.25 },
    { beat: 18.5, note: 'B4', dur: 1.0, vel: 0.18, pan: 0.25 },
    { beat: 21, note: 'A4', dur: 1.2, vel: 0.2, pan: -0.2 },
    { beat: 22.5, note: 'E5', dur: 1.0, vel: 0.22, pan: 0.2 },
    { beat: 25, note: 'F4', dur: 1.2, vel: 0.2, pan: -0.3 },
    { beat: 26.5, note: 'A4', dur: 1.0, vel: 0.18, pan: 0.3 },
    { beat: 29, note: 'D5', dur: 1.5, vel: 0.22, pan: 0.0 }
  ],
  melody: [
    { beat: 0, note: 'E5', dur: 2.2, vel: 0.45 },
    { beat: 2, note: 'D5', dur: 1.0, vel: 0.35 },
    { beat: 3, note: 'C5', dur: 1.0, vel: 0.38 },
    { beat: 4, note: 'D5', dur: 2.5, vel: 0.42 },
    { beat: 7, note: 'G4', dur: 1.0, vel: 0.32 },
    { beat: 8, note: 'C5', dur: 2.0, vel: 0.45 },
    { beat: 10, note: 'B4', dur: 1.0, vel: 0.35 },
    { beat: 11, note: 'A4', dur: 1.0, vel: 0.35 },
    { beat: 12, note: 'A4', dur: 2.5, vel: 0.42 },
    { beat: 15, note: 'G4', dur: 1.0, vel: 0.3 },
    { beat: 16, note: 'B4', dur: 2.0, vel: 0.4 },
    { beat: 18, note: 'C5', dur: 1.0, vel: 0.38 },
    { beat: 19, note: 'D5', dur: 1.0, vel: 0.4 },
    { beat: 20, note: 'C5', dur: 2.2, vel: 0.42 },
    { beat: 23, note: 'E5', dur: 1.0, vel: 0.45 },
    { beat: 24, note: 'F5', dur: 2.0, vel: 0.42 },
    { beat: 26, note: 'E5', dur: 1.0, vel: 0.38 },
    { beat: 27, note: 'D5', dur: 1.0, vel: 0.38 },
    { beat: 28, note: 'G5', dur: 3.0, vel: 0.48 }
  ]
}

// 2. 오후의 살랑바람 (G Major - 따스하고 여유로운 오후)
const BREEZE_SCORE: TrackScore = {
  totalBeats: 32,
  tempo: 72,
  bass: [
    { beat: 0, note: 'G2', dur: 3.5, vel: 0.35 },
    { beat: 4, note: 'E2', dur: 3.5, vel: 0.32 },
    { beat: 8, note: 'C2', dur: 3.5, vel: 0.35 },
    { beat: 12, note: 'D2', dur: 3.5, vel: 0.32 },
    { beat: 16, note: 'B2', dur: 3.5, vel: 0.3 },
    { beat: 20, note: 'E2', dur: 3.5, vel: 0.32 },
    { beat: 24, note: 'A2', dur: 3.5, vel: 0.32 },
    { beat: 28, note: 'D2', dur: 3.5, vel: 0.35 }
  ],
  pad: [
    { beat: 0, notes: ['G2', 'D3', 'F#3', 'B3'], dur: 3.8, vel: 0.08 },
    { beat: 4, notes: ['E2', 'B2', 'G3', 'D4'], dur: 3.8, vel: 0.08 },
    { beat: 8, notes: ['C3', 'G3', 'B3', 'E4'], dur: 3.8, vel: 0.08 },
    { beat: 12, notes: ['D3', 'A3', 'F#4', 'C5'], dur: 3.8, vel: 0.08 },
    { beat: 16, notes: ['B2', 'F#3', 'D4', 'A4'], dur: 3.8, vel: 0.08 },
    { beat: 20, notes: ['E2', 'B2', 'G3', 'C4'], dur: 3.8, vel: 0.08 },
    { beat: 24, notes: ['A2', 'E3', 'C4', 'G4'], dur: 3.8, vel: 0.08 },
    { beat: 28, notes: ['D3', 'A3', 'C4', 'F#4'], dur: 3.8, vel: 0.08 }
  ],
  chimes: [
    { beat: 1.5, note: 'B4', dur: 1.0, vel: 0.2, pan: 0.25 },
    { beat: 3.0, note: 'D5', dur: 0.8, vel: 0.18, pan: -0.25 },
    { beat: 5.5, note: 'G4', dur: 1.0, vel: 0.2, pan: 0.2 },
    { beat: 7.0, note: 'B4', dur: 0.8, vel: 0.18, pan: -0.2 },
    { beat: 9.5, note: 'E4', dur: 1.0, vel: 0.2, pan: 0.3 },
    { beat: 11.0, note: 'G4', dur: 0.8, vel: 0.18, pan: -0.3 },
    { beat: 13.5, note: 'F#4', dur: 1.0, vel: 0.2, pan: 0.2 },
    { beat: 15.0, note: 'A4', dur: 0.8, vel: 0.18, pan: -0.2 },
    { beat: 17.5, note: 'D5', dur: 1.0, vel: 0.2, pan: 0.25 },
    { beat: 21.5, note: 'B4', dur: 1.0, vel: 0.2, pan: -0.25 },
    { beat: 25.5, note: 'C5', dur: 1.0, vel: 0.22, pan: 0.2 },
    { beat: 29.5, note: 'F#4', dur: 1.0, vel: 0.2, pan: -0.2 }
  ],
  melody: [
    { beat: 0, note: 'B4', dur: 2.0, vel: 0.42 },
    { beat: 2, note: 'C5', dur: 1.0, vel: 0.38 },
    { beat: 3, note: 'D5', dur: 1.0, vel: 0.45 },
    { beat: 4, note: 'G5', dur: 2.5, vel: 0.46 },
    { beat: 7, note: 'F#5', dur: 1.0, vel: 0.36 },
    { beat: 8, note: 'E5', dur: 2.0, vel: 0.42 },
    { beat: 10, note: 'D5', dur: 1.0, vel: 0.38 },
    { beat: 11, note: 'C5', dur: 1.0, vel: 0.35 },
    { beat: 12, note: 'D5', dur: 3.0, vel: 0.44 },
    { beat: 16, note: 'F#5', dur: 2.0, vel: 0.42 },
    { beat: 18, note: 'G5', dur: 1.0, vel: 0.44 },
    { beat: 19, note: 'A5', dur: 1.0, vel: 0.46 },
    { beat: 20, note: 'G5', dur: 2.2, vel: 0.44 },
    { beat: 23, note: 'E5', dur: 1.0, vel: 0.38 },
    { beat: 24, note: 'C5', dur: 1.5, vel: 0.4 },
    { beat: 26, note: 'D5', dur: 1.5, vel: 0.42 },
    { beat: 28, note: 'G4', dur: 3.5, vel: 0.46 }
  ]
}

// 3. 별빛 고요한 밤 (F Major / D Minor - 몽환적이고 아늑한 밤 자장가)
const NIGHT_SCORE: TrackScore = {
  totalBeats: 32,
  tempo: 62,
  bass: [
    { beat: 0, note: 'F2', dur: 3.5, vel: 0.3 },
    { beat: 4, note: 'G2', dur: 3.5, vel: 0.3 },
    { beat: 8, note: 'E2', dur: 3.5, vel: 0.3 },
    { beat: 12, note: 'A2', dur: 3.5, vel: 0.3 },
    { beat: 16, note: 'D2', dur: 3.5, vel: 0.3 },
    { beat: 20, note: 'G2', dur: 3.5, vel: 0.3 },
    { beat: 24, note: 'C2', dur: 3.5, vel: 0.32 },
    { beat: 28, note: 'C2', dur: 3.5, vel: 0.3 }
  ],
  pad: [
    { beat: 0, notes: ['F2', 'C3', 'A3', 'E4'], dur: 3.8, vel: 0.09 },
    { beat: 4, notes: ['G2', 'D3', 'B3', 'F4'], dur: 3.8, vel: 0.09 },
    { beat: 8, notes: ['E2', 'B2', 'G3', 'D4'], dur: 3.8, vel: 0.09 },
    { beat: 12, notes: ['A2', 'E3', 'C4', 'G4'], dur: 3.8, vel: 0.09 },
    { beat: 16, notes: ['D3', 'A3', 'F4', 'C5'], dur: 3.8, vel: 0.09 },
    { beat: 20, notes: ['G2', 'D3', 'B3', 'F4'], dur: 3.8, vel: 0.09 },
    { beat: 24, notes: ['C3', 'G3', 'B3', 'E4'], dur: 3.8, vel: 0.09 },
    { beat: 28, notes: ['C3', 'G3', 'Bb3', 'E4'], dur: 3.8, vel: 0.09 }
  ],
  chimes: [
    { beat: 2, note: 'C5', dur: 1.5, vel: 0.18, pan: 0.3 },
    { beat: 6, note: 'D5', dur: 1.5, vel: 0.18, pan: -0.3 },
    { beat: 10, note: 'B4', dur: 1.5, vel: 0.18, pan: 0.25 },
    { beat: 14, note: 'C5', dur: 1.5, vel: 0.18, pan: -0.25 },
    { beat: 18, note: 'A4', dur: 1.5, vel: 0.18, pan: 0.3 },
    { beat: 22, note: 'G4', dur: 1.5, vel: 0.18, pan: -0.3 },
    { beat: 26, note: 'E5', dur: 2.0, vel: 0.2, pan: 0.0 }
  ],
  melody: [
    { beat: 0, note: 'A4', dur: 2.5, vel: 0.38 },
    { beat: 3, note: 'C5', dur: 1.0, vel: 0.35 },
    { beat: 4, note: 'B4', dur: 2.5, vel: 0.38 },
    { beat: 7, note: 'G4', dur: 1.0, vel: 0.3 },
    { beat: 8, note: 'G4', dur: 2.5, vel: 0.36 },
    { beat: 11, note: 'E4', dur: 1.0, vel: 0.28 },
    { beat: 12, note: 'A4', dur: 3.0, vel: 0.4 },
    { beat: 16, note: 'F4', dur: 2.0, vel: 0.36 },
    { beat: 18, note: 'A4', dur: 1.0, vel: 0.35 },
    { beat: 19, note: 'C5', dur: 1.0, vel: 0.38 },
    { beat: 20, note: 'B4', dur: 2.5, vel: 0.38 },
    { beat: 23, note: 'G4', dur: 1.0, vel: 0.32 },
    { beat: 24, note: 'C5', dur: 3.5, vel: 0.42 }
  ]
}

// 4. 처마 끝의 단비 (D Minor / F Major - 서정적이고 아늑한 빗방울 로파이)
const RAINY_SCORE: TrackScore = {
  totalBeats: 32,
  tempo: 65,
  bass: [
    { beat: 0, note: 'D2', dur: 3.5, vel: 0.32 },
    { beat: 4, note: 'Bb1', dur: 3.5, vel: 0.32 },
    { beat: 8, note: 'F2', dur: 3.5, vel: 0.32 },
    { beat: 12, note: 'C2', dur: 3.5, vel: 0.32 },
    { beat: 16, note: 'G2', dur: 3.5, vel: 0.3 },
    { beat: 20, note: 'A2', dur: 3.5, vel: 0.3 },
    { beat: 24, note: 'D2', dur: 3.5, vel: 0.32 },
    { beat: 28, note: 'A1', dur: 3.5, vel: 0.3 }
  ],
  pad: [
    { beat: 0, notes: ['D3', 'A3', 'C4', 'F4'], dur: 3.8, vel: 0.08 },
    { beat: 4, notes: ['Bb2', 'F3', 'D4', 'F4'], dur: 3.8, vel: 0.08 },
    { beat: 8, notes: ['F2', 'C3', 'A3', 'E4'], dur: 3.8, vel: 0.08 },
    { beat: 12, notes: ['C3', 'G3', 'E4', 'G4'], dur: 3.8, vel: 0.08 },
    { beat: 16, notes: ['G2', 'D3', 'Bb3', 'F4'], dur: 3.8, vel: 0.08 },
    { beat: 20, notes: ['A2', 'E3', 'C#4', 'G4'], dur: 3.8, vel: 0.08 },
    { beat: 24, notes: ['D3', 'A3', 'F4', 'C5'], dur: 3.8, vel: 0.08 },
    { beat: 28, notes: ['A2', 'E3', 'G3', 'C#4'], dur: 3.8, vel: 0.08 }
  ],
  chimes: [
    { beat: 1, note: 'F5', dur: 0.8, vel: 0.16, pan: -0.3 },
    { beat: 3, note: 'A4', dur: 0.8, vel: 0.14, pan: 0.3 },
    { beat: 5, note: 'D5', dur: 0.8, vel: 0.16, pan: -0.25 },
    { beat: 7, note: 'F4', dur: 0.8, vel: 0.14, pan: 0.25 },
    { beat: 9, note: 'C5', dur: 0.8, vel: 0.16, pan: -0.3 },
    { beat: 11, note: 'E4', dur: 0.8, vel: 0.14, pan: 0.3 },
    { beat: 17, note: 'Bb4', dur: 0.8, vel: 0.16, pan: -0.2 },
    { beat: 21, note: 'A4', dur: 0.8, vel: 0.16, pan: 0.2 },
    { beat: 25, note: 'F5', dur: 1.2, vel: 0.18, pan: 0.0 }
  ],
  melody: [
    { beat: 0, note: 'F4', dur: 1.5, vel: 0.4 },
    { beat: 2, note: 'G4', dur: 1.0, vel: 0.36 },
    { beat: 3, note: 'A4', dur: 1.0, vel: 0.38 },
    { beat: 4, note: 'D5', dur: 2.5, vel: 0.44 },
    { beat: 7, note: 'C5', dur: 1.0, vel: 0.35 },
    { beat: 8, note: 'A4', dur: 2.0, vel: 0.4 },
    { beat: 10, note: 'G4', dur: 1.0, vel: 0.34 },
    { beat: 11, note: 'F4', dur: 1.0, vel: 0.32 },
    { beat: 12, note: 'G4', dur: 3.0, vel: 0.42 },
    { beat: 16, note: 'Bb4', dur: 2.0, vel: 0.4 },
    { beat: 18, note: 'A4', dur: 1.0, vel: 0.36 },
    { beat: 19, note: 'G4', dur: 1.0, vel: 0.36 },
    { beat: 20, note: 'E4', dur: 2.5, vel: 0.38 },
    { beat: 23, note: 'F4', dur: 1.0, vel: 0.34 },
    { beat: 24, note: 'D4', dur: 3.5, vel: 0.44 }
  ]
}

const SCORES: Record<string, TrackScore> = {
  morning: MORNING_SCORE,
  breeze: BREEZE_SCORE,
  night: NIGHT_SCORE,
  rainy: RAINY_SCORE
}

export interface BgmState {
  isPlaying: boolean
  isMuted: boolean
  volume: number // 0.0 ~ 1.0
  currentTrackId: string
  isAutoMode: boolean
  activeTrackInfo: BgmTrackInfo
}

// BGM 관리 클래스
class BackgroundMusicSystem {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private filterNode: BiquadFilterNode | null = null
  private delayNode: DelayNode | null = null
  private delayGain: GainNode | null = null
  private delayFilter: BiquadFilterNode | null = null

  private isPlayingFlag = false
  private isMutedFlag = false
  private volumeLevel = 0.4 // 초기 볼륨 40% (잔잔하고 부드러운 음량)
  private currentTrackId = 'morning'
  private isAutoModeFlag = true
  private activeSeason = 'spring'
  private activeWeather = 'sunny'

  private timerId: number | null = null
  private startTime = 0
  private nextScheduleBeat = 0
  private listeners = new Set<(state: BgmState) => void>()
  private autoStartAttached = false

  constructor() {
    this.loadPersistedSettings()
  }

  private loadPersistedSettings() {
    if (typeof window === 'undefined') return
    try {
      const savedMuted = localStorage.getItem('farm_bgm_muted')
      if (savedMuted !== null) {
        this.isMutedFlag = savedMuted === 'true'
      }
      const savedVol = localStorage.getItem('farm_bgm_volume')
      if (savedVol !== null) {
        const parsed = parseFloat(savedVol)
        if (!isNaN(parsed)) this.volumeLevel = Math.max(0, Math.min(1, parsed))
      }
      const savedTrack = localStorage.getItem('farm_bgm_track')
      if (savedTrack && (savedTrack === 'auto' || SCORES[savedTrack])) {
        if (savedTrack === 'auto') {
          this.isAutoModeFlag = true
        } else {
          this.isAutoModeFlag = false
          this.currentTrackId = savedTrack
        }
      }
    } catch {
      // localStorage 접근 예외 무시
    }
  }

  private saveSettings() {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('farm_bgm_muted', String(this.isMutedFlag))
      localStorage.setItem('farm_bgm_volume', String(this.volumeLevel))
      localStorage.setItem('farm_bgm_track', this.isAutoModeFlag ? 'auto' : this.currentTrackId)
    } catch {
      // 무시
    }
  }

  private notify() {
    const state = this.getState()
    this.listeners.forEach(fn => {
      try {
        fn(state)
      } catch (err) {
        console.error('BGM listener error:', err)
      }
    })
  }

  public subscribe(listener: (state: BgmState) => void): () => void {
    this.listeners.add(listener)
    listener(this.getState())
    return () => {
      this.listeners.delete(listener)
    }
  }

  public getState(): BgmState {
    const activeId = this.getActiveTrackId()
    const activeTrack = BGM_TRACKS.find(t => t.id === activeId) || BGM_TRACKS[0]
    return {
      isPlaying: this.isPlayingFlag,
      isMuted: this.isMutedFlag,
      volume: this.volumeLevel,
      currentTrackId: this.currentTrackId,
      isAutoMode: this.isAutoModeFlag,
      activeTrackInfo: activeTrack
    }
  }

  public getTracks(): BgmTrackInfo[] {
    return BGM_TRACKS
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass()
        this.setupAudioGraph()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  // 따뜻하고 몽환적인 어쿠스틱 오디오 그래프 초기화
  private setupAudioGraph() {
    if (!this.ctx) return

    // 1. 마스터 볼륨 게인
    this.masterGain = this.ctx.createGain()
    this.updateGain()

    // 2. 부드러운 아날로그 로우패스 필터 (2600Hz, 귀의 피로를 완전히 덜어주는 포근한 톤)
    this.filterNode = this.ctx.createBiquadFilter()
    this.filterNode.type = 'lowpass'
    this.filterNode.frequency.setValueAtTime(2600, this.ctx.currentTime)
    this.filterNode.Q.setValueAtTime(0.8, this.ctx.currentTime)

    // 3. 앰비언트 스테레오 딜레이 / 잔향 회로
    this.delayNode = this.ctx.createDelay()
    this.delayNode.delayTime.setValueAtTime(0.32, this.ctx.currentTime) // 320ms 딜레이

    this.delayFilter = this.ctx.createBiquadFilter()
    this.delayFilter.type = 'lowpass'
    this.delayFilter.frequency.setValueAtTime(1400, this.ctx.currentTime)

    this.delayGain = this.ctx.createGain()
    this.delayGain.gain.setValueAtTime(0.24, this.ctx.currentTime) // 24% 피드백 몽환감

    // 딜레이 루프 연결
    this.delayNode.connect(this.delayFilter)
    this.delayFilter.connect(this.delayGain)
    this.delayGain.connect(this.delayNode)

    // 메인 출력 연결
    this.delayGain.connect(this.filterNode)
    this.filterNode.connect(this.masterGain)
    this.masterGain.connect(this.ctx.destination)
  }

  private updateGain() {
    if (!this.masterGain || !this.ctx) return
    const targetGain = this.isMutedFlag || !this.isPlayingFlag ? 0 : this.volumeLevel * 0.55
    const now = this.ctx.currentTime
    this.masterGain.gain.cancelScheduledValues(now)
    this.masterGain.gain.linearRampToValueAtTime(targetGain, now + 0.15)
  }

  private getActiveTrackId(): string {
    if (!this.isAutoModeFlag) {
      return this.currentTrackId
    }
    // 자동 모드일 때 계절 및 날씨에 따라 감성적인 맞춤 선곡
    if (this.activeWeather === 'rainy') return 'rainy'
    if (this.activeSeason === 'winter') return 'night'
    if (this.activeSeason === 'autumn') return 'breeze'
    if (this.activeSeason === 'summer') return 'breeze'
    return 'morning'
  }

  // 계절 및 날씨 변경 시 BGM 분위기 자동 동기화
  public setSeasonWeather(season: string, weather: string) {
    const prevTrack = this.getActiveTrackId()
    this.activeSeason = season
    this.activeWeather = weather
    const newTrack = this.getActiveTrackId()

    if (this.isAutoModeFlag && prevTrack !== newTrack && this.isPlayingFlag) {
      // 부드러운 크로스페이드 재시작
      this.play(undefined, true)
    }
    this.notify()
  }

  // 1. 칼림바 / 맑은 오르골 차임 합성
  private playChime(ctx: AudioContext, freq: number, time: number, dur: number, vel = 0.3, pan = 0) {
    if (vel <= 0.01) return
    const osc = ctx.createOscillator()
    const overtone = ctx.createOscillator()
    const gain = ctx.createGain()
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, time)

    overtone.type = 'triangle'
    overtone.frequency.setValueAtTime(freq * 2.01, time)

    const baseVol = vel * 0.18
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.linearRampToValueAtTime(baseVol, time + 0.012)
    gain.gain.exponentialRampToValueAtTime(baseVol * 0.45, time + 0.18)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur)

    osc.connect(gain)
    overtone.connect(gain)

    if (panner) {
      panner.pan.setValueAtTime(pan, time)
      gain.connect(panner)
      if (this.filterNode) panner.connect(this.filterNode)
      if (this.delayNode) panner.connect(this.delayNode)
    } else {
      if (this.filterNode) gain.connect(this.filterNode)
      if (this.delayNode) gain.connect(this.delayNode)
    }

    osc.start(time)
    overtone.start(time)
    osc.stop(time + dur)
    overtone.stop(time + dur)
  }

  // 2. 포근한 들판 앰비언트 패드 화음 합성 (부드러운 온기)
  private playPadChord(ctx: AudioContext, freqs: number[], time: number, dur: number, vel = 0.08) {
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, time)
      osc.detune.setValueAtTime((idx % 2 === 0 ? 3 : -3), time)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1100, time)

      const padVol = vel * 0.065
      gain.gain.setValueAtTime(0.0001, time)
      gain.gain.linearRampToValueAtTime(padVol, time + 0.6)
      gain.gain.setValueAtTime(padVol, time + dur - 0.7)
      gain.gain.exponentialRampToValueAtTime(0.0001, time + dur)

      osc.connect(filter)
      filter.connect(gain)
      if (this.filterNode) gain.connect(this.filterNode)

      osc.start(time)
      osc.stop(time + dur)
    })
  }

  // 3. 따뜻한 어쿠스틱 서브 베이스 (편안한 저음)
  private playBass(ctx: AudioContext, freq: number, time: number, dur: number, vel = 0.32) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, time)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(260, time)

    const bassVol = vel * 0.28
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.linearRampToValueAtTime(bassVol, time + 0.035)
    gain.gain.exponentialRampToValueAtTime(bassVol * 0.6, time + 0.5)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur)

    osc.connect(filter)
    filter.connect(gain)
    if (this.filterNode) gain.connect(this.filterNode)

    osc.start(time)
    osc.stop(time + dur)
  }

  // 스케줄러: 오디오 컨텍스트 시계에 맞추어 정확한 비트별 음원 렌더링
  private scheduleNotes() {
    if (!this.isPlayingFlag || !this.ctx) return
    const activeId = this.getActiveTrackId()
    const score = SCORES[activeId] || MORNING_SCORE

    const secondsPerBeat = 60 / score.tempo
    const loopDuration = score.totalBeats * secondsPerBeat
    const currentTime = this.ctx.currentTime
    const lookaheadSec = 0.35 // 350ms 전방 예약 스케줄링

    const elapsed = currentTime - this.startTime
    const currentLoopBeat = (elapsed / secondsPerBeat) % score.totalBeats
    const scheduleWindowStart = this.nextScheduleBeat
    const scheduleWindowEnd = currentLoopBeat + lookaheadSec / secondsPerBeat

    // 베이스 스케줄링
    score.bass.forEach(e => {
      if (this.isBeatInWindow(e.beat, scheduleWindowStart, scheduleWindowEnd, score.totalBeats)) {
        const eventTime = this.calculateEventTime(e.beat, currentLoopBeat, currentTime, secondsPerBeat, score.totalBeats)
        if (e.note && eventTime >= currentTime) {
          this.playBass(this.ctx!, noteToFreq(e.note), eventTime, e.dur * secondsPerBeat, e.vel)
        }
      }
    })

    // 패드 스케줄링
    score.pad.forEach(e => {
      if (this.isBeatInWindow(e.beat, scheduleWindowStart, scheduleWindowEnd, score.totalBeats)) {
        const eventTime = this.calculateEventTime(e.beat, currentLoopBeat, currentTime, secondsPerBeat, score.totalBeats)
        if (e.notes && eventTime >= currentTime) {
          const freqs = e.notes.map(noteToFreq)
          this.playPadChord(this.ctx!, freqs, eventTime, e.dur * secondsPerBeat, e.vel)
        }
      }
    })

    // 차임 & 아르페지오 스케줄링
    score.chimes.forEach(e => {
      if (this.isBeatInWindow(e.beat, scheduleWindowStart, scheduleWindowEnd, score.totalBeats)) {
        const eventTime = this.calculateEventTime(e.beat, currentLoopBeat, currentTime, secondsPerBeat, score.totalBeats)
        if (e.note && eventTime >= currentTime) {
          this.playChime(this.ctx!, noteToFreq(e.note), eventTime, e.dur * secondsPerBeat, e.vel, e.pan)
        }
      }
    })

    // 메인 칼림바/어쿠스틱 멜로디 스케줄링
    score.melody.forEach(e => {
      if (this.isBeatInWindow(e.beat, scheduleWindowStart, scheduleWindowEnd, score.totalBeats)) {
        const eventTime = this.calculateEventTime(e.beat, currentLoopBeat, currentTime, secondsPerBeat, score.totalBeats)
        if (e.note && eventTime >= currentTime) {
          this.playChime(this.ctx!, noteToFreq(e.note), eventTime, e.dur * secondsPerBeat, e.vel, 0.0)
        }
      }
    })

    this.nextScheduleBeat = scheduleWindowEnd % score.totalBeats
  }

  private isBeatInWindow(beat: number, start: number, end: number, total: number): boolean {
    if (end > total) {
      return (beat >= start && beat < total) || (beat >= 0 && beat < end % total)
    }
    return beat >= start && beat < end
  }

  private calculateEventTime(
    eventBeat: number,
    currentBeat: number,
    currentTime: number,
    secondsPerBeat: number,
    totalBeats: number
  ): number {
    let diff = eventBeat - currentBeat
    if (diff < -0.1) diff += totalBeats
    return currentTime + diff * secondsPerBeat
  }

  public play(trackId?: string, forceRestart = false) {
    const ctx = this.getAudioContext()
    if (!ctx) return

    if (trackId !== undefined) {
      if (trackId === 'auto') {
        this.isAutoModeFlag = true
      } else if (SCORES[trackId]) {
        this.isAutoModeFlag = false
        this.currentTrackId = trackId
      }
      this.saveSettings()
    }

    if (this.isPlayingFlag && !forceRestart) {
      this.updateGain()
      this.notify()
      return
    }

    this.isPlayingFlag = true
    this.startTime = ctx.currentTime
    this.nextScheduleBeat = 0
    this.updateGain()

    if (this.timerId !== null) {
      clearInterval(this.timerId)
    }

    // 40ms 주기로 매끄러운 룩어헤드 스케줄링 진행
    this.timerId = window.setInterval(() => {
      this.scheduleNotes()
    }, 45)

    // 즉시 첫 음표 렌더
    this.scheduleNotes()
    this.notify()
  }

  public stop() {
    this.isPlayingFlag = false
    this.updateGain()
    if (this.timerId !== null) {
      clearInterval(this.timerId)
      this.timerId = null
    }
    this.notify()
  }

  public toggle(trackId?: string): boolean {
    if (this.isPlayingFlag) {
      this.stop()
      return false
    } else {
      this.play(trackId)
      return true
    }
  }

  public setVolume(volume: number) {
    this.volumeLevel = Math.max(0, Math.min(1, volume))
    this.saveSettings()
    this.updateGain()
    this.notify()
  }

  public setMuted(muted: boolean) {
    this.isMutedFlag = muted
    this.saveSettings()
    this.updateGain()
    this.notify()
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMutedFlag)
    return this.isMutedFlag
  }

  public setTrack(trackId: string) {
    if (trackId === 'auto') {
      this.isAutoModeFlag = true
    } else if (SCORES[trackId]) {
      this.isAutoModeFlag = false
      this.currentTrackId = trackId
    }
    this.saveSettings()
    if (this.isPlayingFlag) {
      this.play(undefined, true)
    } else {
      this.notify()
    }
  }

  // 사용자 첫 클릭 시 브라우저 자동 재생 정책을 준수하며 부드럽게 배경음악 활성화 준비
  public initAutoStartOnInteraction() {
    if (typeof window === 'undefined' || this.autoStartAttached) return
    this.autoStartAttached = true

    const startAudio = () => {
      const ctx = this.getAudioContext()
      if (ctx && ctx.state === 'suspended') {
        ctx.resume()
      }
      // 사용자가 배경음악을 켜둔 상태였거나 기본 활성화 시 자동 부드럽게 시작
      if (this.isPlayingFlag) {
        this.play()
      }
      window.removeEventListener('click', startAudio)
      window.removeEventListener('keydown', startAudio)
      window.removeEventListener('touchstart', startAudio)
    }

    window.addEventListener('click', startAudio, { once: true })
    window.addEventListener('keydown', startAudio, { once: true })
    window.addEventListener('touchstart', startAudio, { once: true })
  }
}

// 싱글톤 전역 BGM 인스턴스
export const BgmSystem = new BackgroundMusicSystem()
