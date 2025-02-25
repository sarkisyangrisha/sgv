import React, { useState } from 'react';
import { X, Calendar, Fuel, Settings, Car as CarIcon, Gauge, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

interface CarModalProps {
  car: any;
  onClose: () => void;
}

export default function CarModal({ car, onClose }: CarModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  
  if (!car) return null;

  const { brand, model, generation, description, images } = car;
  const spec = generation.specs[0];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setShowGallery(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {brand.name} {model.name} {generation.name}
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div 
                className="aspect-video rounded-lg overflow-hidden mb-4 cursor-pointer"
                onClick={() => openGallery(0)}
              >
                <img
                  src={images[0].url}
                  alt={images[0].alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1).map((image, index) => (
                  <div 
                    key={index + 1}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => openGallery(index + 1)}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Calendar className="w-5 h-5 mr-3 text-red-500" />
                  <span>Годы выпуска: {generation.years}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Fuel className="w-5 h-5 mr-3 text-red-500" />
                  <span>Двигатель: {spec.engine}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Zap className="w-5 h-5 mr-3 text-red-500" />
                  <span>Мощность: {spec.power}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Settings className="w-5 h-5 mr-3 text-red-500" />
                  <span>Трансмиссия: {spec.transmission}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <CarIcon className="w-5 h-5 mr-3 text-red-500" />
                  <span>Привод: {spec.drivetrain}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Gauge className="w-5 h-5 mr-3 text-red-500" />
                  <span>Разгон до 100 км/ч: {spec.acceleration}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Описание</h4>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {description}
                </p>
              </div>
              
              <div className="flex gap-4 mt-6">
                <a 
                  href="https://wa.me/your_number" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366] text-white py-3 rounded-lg hover:bg-[#128C7E] transition flex items-center justify-center"
                >
                  WhatsApp
                </a>
                <a 
                  href="https://t.me/your_username" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#0088cc] text-white py-3 rounded-lg hover:bg-[#0077b5] transition flex items-center justify-center"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Gallery */}
      {showGallery && (
        <div className="fixed inset-0 bg-black z-[60] flex items-center justify-center">
          <button 
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img
            src={images[currentImageIndex].url}
            alt={images[currentImageIndex].alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}