import React from 'react';
import { ParkingMeter as Parking, Award, Shield, Search, Calendar } from 'lucide-react';

export default function Benefits() {
  return (
    <section className="py-8 md:py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-900 dark:text-white">
          Ваши преимущества
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 bg-red-100 dark:bg-red-900/20 rounded-full inline-flex items-center justify-center">
              <Parking className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            </div>
            <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 text-gray-900 dark:text-white">Бонус</h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Месяц стоянки</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 bg-red-100 dark:bg-red-900/20 rounded-full inline-flex items-center justify-center">
              <Award className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            </div>
            <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 text-gray-900 dark:text-white">Гарантия</h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">30 дней</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 bg-red-100 dark:bg-red-900/20 rounded-full inline-flex items-center justify-center">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            </div>
            <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 text-gray-900 dark:text-white">Надежность</h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Гарантийный взнос</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 bg-red-100 dark:bg-red-900/20 rounded-full inline-flex items-center justify-center">
              <Search className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            </div>
            <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 text-gray-900 dark:text-white">Удобство</h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">17 этапов контроля</p>
          </div>

          <div className="text-center col-span-2 md:col-span-1">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 bg-red-100 dark:bg-red-900/20 rounded-full inline-flex items-center justify-center">
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            </div>
            <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 text-gray-900 dark:text-white">Опыт</h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Более 7 лет работы</p>
          </div>
        </div>
      </div>
    </section>
  );
}