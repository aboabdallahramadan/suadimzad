'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const banners = [
  {
    id: 1,
    image: 'https://ext.same-assets.com/2145698040/824171687.jpeg',
    alt: 'Banner 1'
  },
  {
    id: 2,
    image: 'https://ext.same-assets.com/2145698040/2469764631.jpeg',
    alt: 'Banner 2'
  },
  {
    id: 3,
    image: 'https://ext.same-assets.com/2145698040/2818581605.webp',
    alt: 'Banner 3'
  },
  {
    id: 4,
    image: 'https://ext.same-assets.com/2145698040/126359893.jpeg',
    alt: 'Banner 4'
  },
  {
    id: 5,
    image: 'https://ext.same-assets.com/2145698040/3844658193.jpeg',
    alt: 'Banner 5'
  }
];

export function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden flex justify-center items-center pt-8 pb-4 pl-6 pr-6">
      {/* Banner Images */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={banner.image}
              alt={banner.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {/* <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button> */}

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? 'bg-gray-400 scale-110'
                : 'bg-gray-200 bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
