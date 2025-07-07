'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { ChevronLeft, ChevronRight, MessageCircle, Heart } from 'lucide-react';
import { AdSmall } from '@/types/adSmall';
import { useTranslations } from 'next-intl';
import WatermarkedImgTag from '../WatermarkedImgTag';

interface SimilarAdsProps {
  ads: AdSmall[];
}

const SimilarAds = ({ ads }: SimilarAdsProps) => {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  // Handle responsive slides
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSlidesToShow(3);
      } else if (window.innerWidth >= 768) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + slidesToShow >= ads.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, ads.length - slidesToShow) : prev - 1
    );
  };

  const canGoNext = currentIndex + slidesToShow < ads.length;
  const canGoPrev = currentIndex > 0;

  if (!ads || ads.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-primary-color">{t("ads.similarAds")}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            disabled={!canGoPrev}
            className={`p-2 rounded-full border ${
              canGoPrev 
                ? 'text-primary-accent border-primary-accent hover:bg-light-blue' 
                : 'text-gray-300 border-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            disabled={!canGoNext}
            className={`p-2 rounded-full border ${
              canGoNext 
                ? 'text-primary-accent border-primary-accent hover:bg-light-blue' 
                : 'text-gray-300 border-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
            width: `${(ads.length / slidesToShow) * 100}%`
          }}
        >
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / ads.length}%` }}
            >
              <Link href={`/ad/${ad.id}`} className="block group">
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200">
                    <WatermarkedImgTag
                      src={ad.image}
                      alt={ad.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      watermarkPosition="center"
                      watermarkSize="medium"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-medium text-primary-color mb-2 line-clamp-2 group-hover:text-primary-accent transition-colors">
                      {ad.title}
                    </h3>
                    <div className="text-lg font-bold text-primary-accent mb-3">
                      {ad.price.toLocaleString()} QAR
                    </div>
                    
                    {/* Engagement stats */}
                    <div className="flex items-center justify-between text-sm text-secondary-gray">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{ad.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{ad.likes}</span>
                      </div>
                    </div>

                    {/* Optional category and location */}
                    {(ad.category || ad.location) && (
                      <div className="mt-2 text-xs text-secondary-gray">
                        {ad.category && <span>{ad.category}</span>}
                        {ad.category && ad.location && <span> • </span>}
                        {ad.location && <span>{ad.location}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SimilarAds;