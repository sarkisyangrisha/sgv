import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarImage {
  url: string;
  alt: string;
}

interface CarCardProps {
  brand: string;
  model: string;
  year: string;
  price: string;
  description: string;
  images: CarImage[];
  specs: {
    engine: string;
    power: string;
    transmission: string;
    drivetrain: string;
    mileage: string;
  };
  status: 'in_stock' | 'on_order' | 'in_transit';
  onClick: () => void;
}

export default function CarCard({
  brand,
  model,
  year,
  price,
  description,
  images,
  specs,
  status,
  onClick
}: CarCardProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-500 text-white';
      case 'on_order':
        return 'bg-yellow-500 text-white';
      case 'in_transit':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'В наличии';
      case 'on_order':
        return 'Под заказ';
      case 'in_transit':
        return 'В пути';
      default:
        return 'В наличии';
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-200 cursor-pointer hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] md:aspect-video">
        <img
          src={images[currentImage].url}
          alt={images[currentImage].alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(status)}`}>
          {getStatusText(status)}
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    index === currentImage ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
            {brand} {model}
          </h3>
          <span className="text-base md:text-lg font-bold text-red-500">{price}</span>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 md:mb-4">
          {year} год
        </p>
        
        <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Двигатель:</span> {specs.engine}
            {specs.power && ` (${specs.power})`}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Коробка:</span> {specs.transmission}
          </div>
          {specs.drivetrain && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Привод:</span> {specs.drivetrain}
            </div>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Пробег:</span> {specs.mileage}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 md:line-clamp-3">
          {description}
        </p>
        
        <button className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition text-sm md:text-base">
          Подробнее
        </button>
      </div>
    </div>
  );
}