'use client'
import { useState } from 'react'
import Image from 'next/image'

interface WatermarkedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  sizes?: string
  style?: React.CSSProperties
  onClick?: () => void
  watermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  watermarkSize?: 'small' | 'medium' | 'large'
  showWatermark?: boolean
}

const WatermarkedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  fill = false,
  priority = false,
  sizes,
  style,
  onClick,
  watermarkPosition = 'bottom-right',
  watermarkSize = 'medium',
  showWatermark = true,
  ...props
}: WatermarkedImageProps) => {
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
        return 'w-8 h-8'
      case 'medium':
        return 'w-12 h-12'
      case 'large':
        return 'w-16 h-16'
      default:
        return 'w-12 h-12'
    }
  }

  return (
    <div className="relative" style={style} onClick={onClick}>
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          priority={priority}
          sizes={sizes}
          onLoad={() => setImageLoaded(true)}
          {...props}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          priority={priority}
          sizes={sizes}
          onLoad={() => setImageLoaded(true)}
          {...props}
        />
      )}
      
      {/* Watermark overlay */}
      {showWatermark && imageLoaded && (
        <div 
          className={`absolute ${getWatermarkPositionClass()} z-10 opacity-60 hover:opacity-80 transition-opacity duration-200`}
        >
          <div className={`${getWatermarkSizeClass()} bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg`}>
            <Image
              src="/logo.png"
              alt="Mzad Qatar"
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default WatermarkedImage 