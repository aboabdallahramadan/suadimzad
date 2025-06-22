"use client"
import React, { useState } from 'react'

interface ImagesProps {
  images: string[]
}

const Images = ({ images }: ImagesProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const selectImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
      <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
            {/* Image Carousel */}
            <div className="relative">
              <img 
                src={images[currentImageIndex]} 
                alt="ad image"
                className="w-full h-96 object-cover"
              />
              
              {/* Navigation arrows - only show if there are multiple images */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary-color bg-opacity-50 text-primary-accent p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary-color bg-opacity-50 text-primary-accent p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail strip - only show if there are multiple images */}
            {images.length > 1 && (
              <div className="flex p-4 space-x-4 overflow-x-auto">
                {images.map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt={`ad image ${index}`}
                    onClick={() => selectImage(index)}
                    className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer transition-all ${
                      index === currentImageIndex 
                        ? 'border-primary-accent opacity-100' 
                        : 'border-transparent opacity-70 hover:opacity-100 hover:border-primary-accent'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
  )
}

export default Images