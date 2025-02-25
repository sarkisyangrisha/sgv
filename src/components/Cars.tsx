import React, { useState, useRef } from 'react';
import { Calendar, Fuel, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import CarModal from './CarModal';
import CarCard from './CarCard';

// Sample car data
const carData = [
  {
    id: 1,
    brand: {
      name: "Toyota",
      id: 1
    },
    model: {
      name: "Camry",
      id: 1
    },
    generation: {
      name: "XV70",
      years: "2021-2024",
      specs: [{
        engine: "2.5L Hybrid",
        power: "218 л.с.",
        transmission: "e-CVT",
        drivetrain: "Передний",
        acceleration: "7.7 сек",
        fuelConsumption: "4.5 л/100км"
      }]
    },
    price: "от 2 500 000 ₽",
    description: "Полная комплектация, отличное состояние, без пробега по РФ",
    images: [
      {
        url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800",
        alt: "Toyota Camry"
      },
      {
        url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800",
        alt: "Toyota Camry Interior"
      }
    ],
    specs: {
      engine: "2.5L Hybrid",
      transmission: "e-CVT",
      mileage: "0 км"
    },
    inStock: true
  },
  {
    id: 2,
    brand: {
      name: "Honda",
      id: 2
    },
    model: {
      name: "Accord",
      id: 2
    },
    generation: {
      name: "10th Gen",
      years: "2020-2024",
      specs: [{
        engine: "2.0L Turbo",
        power: "252 л.с.",
        transmission: "10-ст. АКПП",
        drivetrain: "Передний",
        acceleration: "6.5 сек",
        fuelConsumption: "7.1 л/100км"
      }]
    },
    price: "от 2 800 000 ₽",
    description: "Максимальная комплектация, панорамная крыша, адаптивный круиз-контроль",
    images: [
      {
        url: "https://images.unsplash.com/photo-1566473965997-3de9c817e938?auto=format&fit=crop&w=800",
        alt: "Honda Accord"
      }
    ],
    specs: {
      engine: "2.0L Turbo",
      transmission: "АКПП",
      mileage: "0 км"
    },
    inStock: true
  }
];

export default function Cars() {
  const [selectedCar, setSelectedCar] = useState<any | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="cars" className="py-8 md:py-16 bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-900 dark:text-white">
          Автомобили в наличии
        </h2>

        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-4">
            <button
              onClick={() => scroll('left')}
              className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-4 md:gap-6">
              {carData.map((car) => (
                <div key={car.id} className="flex-none w-[260px] md:w-[350px]">
                  <CarCard
                    brand={car.brand.name}
                    model={car.model.name}
                    year={car.generation.years.split('-')[0]}
                    price={car.price}
                    description={car.description}
                    images={car.images}
                    specs={car.specs}
                    inStock={car.inStock}
                    onClick={() => setSelectedCar(car)}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-4">
            <button
              onClick={() => scroll('right')}
              className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
      
      {selectedCar && (
        <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </section>
  );
}