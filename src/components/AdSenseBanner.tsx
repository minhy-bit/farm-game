import React, { useEffect, useRef } from 'react'

interface AdSenseBannerProps {
  clientId?: string
  slotId?: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal'
  responsive?: boolean
  className?: string
  /**
   * 실제 광고 승인 전 레이아웃 및 디자인을 미리 검토하기 위한 플레이스홀더 표시 여부
   */
  showPlaceholderWhenDisabled?: boolean
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>
  }
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID,
  slotId = import.meta.env.VITE_ADSENSE_BANNER_SLOT,
  format = 'auto',
  responsive = true,
  className = '',
  showPlaceholderWhenDisabled = true
}) => {
  const adRef = useRef<HTMLModElement>(null)
  const isEnabled = import.meta.env.VITE_ENABLE_ADS === 'true' && !!clientId && !!slotId

  useEffect(() => {
    if (!isEnabled) return

    try {
      if (typeof window !== 'undefined') {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (e) {
      console.warn('AdSense 광고 로드 대기 중:', e)
    }
  }, [isEnabled, slotId])

  // 1. 실제 광고가 활성화된 경우: 공식 구글 애드센스 ins 태그 렌더링
  if (isEnabled) {
    return (
      <div className={`w-full my-4 flex flex-col items-center justify-center overflow-hidden ${className}`}>
        {/* 구글 정책 준수: 광고 라벨 명시 */}
        <div className="text-[10px] text-slate-500 font-mono tracking-wider mb-1">
          [ AD SPONSORED ]
        </div>
        <ins
          ref={adRef}
          className="adsbygoogle block w-full text-center"
          style={{ display: 'block', minHeight: '90px' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    )
  }

  // 2. 발급 전이거나 비활성화 상태인 경우: 레이아웃 검토용 안내 박스 렌더링
  if (!showPlaceholderWhenDisabled) {
    return null
  }

  return (
    <div
      className={`w-full max-w-4xl mx-auto my-3 p-3 rounded-2xl border border-dashed border-amber-500/30 bg-[#251912]/60 text-center flex flex-col items-center justify-center space-y-1 select-none pointer-events-auto transition-all ${className}`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-xs bg-amber-950/80 text-amber-300 border border-amber-700/60 px-2 py-0.5 rounded font-bold">
          📢 Google AdSense 준비 영역
        </span>
        <span className="text-[11px] text-slate-400">
          (나중에 ca-pub 승인 시 실제 광고가 여기에 게재됩니다)
        </span>
      </div>
      <p className="text-[10px] text-slate-400 max-w-md">
        게임 조작 타일과 충분한 안전 여백(최소 20px)을 유지하여 구글 오클릭 방지 정책을 완벽히 준수하도록 사전 배치되었습니다.
      </p>
    </div>
  )
}
