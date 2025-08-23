'use client';

import { useState, useEffect } from 'react';

interface Banner {
  name: string;
  imageUrl: string;
}

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('http://alaamohamad-001-site1.qtempurl.com/api/customer/sliders', {
          headers: {
            'Accept-Language': 'en'
          }
        });
        const data = await response.json();
        console.log(data);
        if (data.success && Array.isArray(data.data)) {
          setBanners(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden flex justify-center items-center pt-8 pb-4 pl-6 pr-6">
        <div className="w-full h-full bg-gray-200 animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden flex justify-center items-center pt-8 pb-4 pl-6 pr-6">
      <div className="relative w-full h-full rounded-2xl overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={`http://alaamohamad-001-site1.qtempurl.com/uploads/${banner.imageUrl}`}
              alt={banner.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {banners.length > 1 && (
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
      )}
    </div>
  );
}
