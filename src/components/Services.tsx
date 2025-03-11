import React from 'react';
import { Car, Truck, Tractor, Settings } from 'lucide-react';

export default function Services() {
  return (
    <section id="services" className="py-6 md:py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-900 dark:text-white">
          Наши услуги
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 md:p-4 hover:shadow-lg transition">
            <Car className="w-8 h-8 md:w-10 md:h-10 text-red-500 mb-2 md:mb-3" />
            <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 text-gray-900 dark:text-white">
              Автомобили из Китая
            </h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
              Подбор и доставка автомобилей из Китая
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 md:p-4 hover:shadow-lg transition">
            <Car className="w-8 h-8 md:w-10 md:h-10 text-red-500 mb-2 md:mb-3" />
            <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 text-gray-900 dark:text-white">
              Автомобили из Кореи
            </h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
              Импорт автомобилей из Южной Кореи
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 md:p-4 hover:shadow-lg transition">
            <Car className="w-8 h-8 md:w-10 md:h-10 text-red-500 mb-2 md:mb-3" />
            <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 text-gray-900 dark:text-white">
              Автомобили из Японии
            </h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
              Доставка санкционных и несанкционных авто
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 md:p-4 hover:shadow-lg transition">
            <Truck className="w-8 h-8 md:w-10 md:h-10 text-red-500 mb-2 md:mb-3" />
            <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 text-gray-900 dark:text-white">
              Грузовые автомобили
            </h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
              Импорт грузовиков из Азии
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 md:p-4 hover:shadow-lg transition">
            <Tractor className="w-8 h-8 md:w-10 md:h-10 text-red-500 mb-2 md:mb-3" />
            <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 text-gray-900 dark:text-white">
              Спецтехника
            </h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
              Поставка строительной техники
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 md:p-4 hover:shadow-lg transition">
            <Settings className="w-8 h-8 md:w-10 md:h-10 text-red-500 mb-2 md:mb-3" />
            <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 text-gray-900 dark:text-white">
              Запчасти из Азии
            </h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
              Подбор и доставка запчастей
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <a 
            href="https://wa.me/79140744300" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-6 py-2 rounded-lg hover:bg-[#128C7E] transition-colors text-center text-sm"
          >
            WhatsApp
          </a>
          <a 
            href="https://t.me/SGVAutoImport" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#0088cc] text-white px-6 py-2 rounded-lg hover:bg-[#0077b5] transition-colors text-center text-sm"
          >
            Telegram
          </a>
        </div>
      </div>
    </section>
  );
}