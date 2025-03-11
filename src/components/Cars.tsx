import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CarModal from './CarModal';
import CarCard from './CarCard';
import { supabase } from '../lib/supabase';

interface CarData {
  id: string;
  name: string;
  price: number;
  year: number;
  engine: string;
  power: string;
  transmission: string;
  drivetrain: string;
  mileage: string;
  description: string;
  main_image: string;
  status: 'in_stock' | 'on_order' | 'in_transit';
  images?: { id: string; image_url: string }[];
}

export default function Cars() {
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*, car_images(id, image_url)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const carsWithImages = (data || []).map(car => ({
        ...car,
        images: car.car_images || []
      }));
      
      setCars(carsWithImages);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  }

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

  const formatCarForDisplay = (car: CarData) => {
    return {
      brand: car.name.split(' ')[0] || '',
      model: car.name.split(' ').slice(1).join(' ') || '',
      year: car.year.toString(),
      price: `${car.price.toLocaleString()} ₽`,
      description: car.description,
      images: [
        { url: car.main_image, alt: car.name },
        ...(car.images || []).map(img => ({ url: img.image_url, alt: car.name }))
      ],
      specs: {
        engine: car.engine,
        power: car.power || '',
        transmission: car.transmission,
        drivetrain: car.drivetrain || '',
        mileage: car.mileage
      },
      status: car.status
    };
  };

  const formatCarForModal = (car: CarData) => {
    const nameParts = car.name.split(' ');
    const brand = nameParts[0] || '';
    const model = nameParts.slice(1).join(' ') || '';
    
    return {
      id: car.id,
      brand: { name: brand, id: 1 },
      model: { name: model, id: 1 },
      generation: {
        name: "",
        years: car.year.toString(),
        specs: [{
          engine: car.engine,
          power: car.power || '',
          transmission: car.transmission,
          drivetrain: car.drivetrain || '',
          acceleration: "",
          fuelConsumption: ""
        }]
      },
      price: `${car.price.toLocaleString()} ₽`,
      description: car.description,
      images: [
        { url: car.main_image, alt: car.name },
        ...(car.images || []).map(img => ({ url: img.image_url, alt: car.name }))
      ],
      status: car.status
    };
  };

  return (
    <section id="cars" className="py-8 md:py-16 bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-900 dark:text-white">
          Автомобили в наличии
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : cars.length > 0 ? (
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
                {cars.map((car) => (
                  <div key={car.id} className="flex-none w-[260px] md:w-[350px]">
                    <CarCard
                      {...formatCarForDisplay(car)}
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
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            Автомобили пока не добавлены
          </div>
        )}
      </div>
      
      {selectedCar && (
        <CarModal 
          car={formatCarForModal(selectedCar)} 
          onClose={() => setSelectedCar(null)} 
        />
      )}
    </section>
  );
}