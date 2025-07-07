'use client'
import { useState } from 'react'

interface WatermarkedImgTagProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  watermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  watermarkSize?: 'small' | 'medium' | 'large'
  showWatermark?: boolean
}

const WatermarkedImgTag = ({
  src,
  alt,
  className = '',
  style,
  onClick,
  watermarkPosition = 'bottom-right',
  watermarkSize = 'medium',
  showWatermark = true,
  ...props
}: WatermarkedImgTagProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const getWatermarkPositionClass = () => {
    switch (watermarkPosition) {
      case 'top-left':
        return 'top-2 left-2'
      case 'top-right':
        return 'top-2 right-2'
      case 'bottom-left':
        return 'bottom-2 left-2'
      case 'bottom-right':
        return 'bottom-2 right-2'
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      default:
        return 'bottom-2 right-2'
    }
  }

  const getWatermarkSizeClass = () => {
    switch (watermarkSize) {
      case 'small':
        return 'w-6 h-6'
      case 'medium':
        return 'w-8 h-8'
      case 'large':
        return 'w-12 h-12'
      default:
        return 'w-8 h-8'
    }
  }

  return (
    <div className="relative" style={style} onClick={onClick}>
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setImageLoaded(true)}
        {...props}
      />
      
      {/* Watermark overlay */}
      {showWatermark && imageLoaded && (
        <div 
          className={`absolute ${getWatermarkPositionClass()} z-10 opacity-60 hover:opacity-80 transition-opacity duration-200`}
        >
          <div className={`${getWatermarkSizeClass()} bg-white/90 backdrop-blur-sm rounded-md p-0.5 shadow-lg`}>
            <img
              src="/logo.png"
              alt="Sahel"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default WatermarkedImgTag 