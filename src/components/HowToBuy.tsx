import React from 'react';
import { Phone, FileText, DollarSign, Ship, Car } from 'lucide-react';

export default function HowToBuy() {
  return (
    <section className="py-8 md:py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-900 dark:text-white">
          Как купить автомобиль
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
              <Phone className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            </div>
            <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 text-center text-gray-900 dark:text-white">Оставить заявку</h3>
            <p className="text-xs md:text-sm text-center text-gray-600 dark:text-gray-400">Вам сообщат стоимость</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            </div>
            <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 text-center text-gray-900 dark:text-white">Заключить договор</h3>
            <p className="text-xs md:text-sm text-center text-gray-600 dark:text-gray-400">В офисе или онлайн</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
              <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            </div>
            <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 text-center text-gray-900 dark:text-white">Подбор и покупка</h3>
            <p className="text-xs md:text-sm text-center text-gray-600 dark:text-gray-400">Согласуем все с вами</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
              <Ship className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            </div>
            <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 text-center text-gray-900 dark:text-white">Доставка и таможня</h3>
            <p className="text-xs md:text-sm text-center text-gray-600 dark:text-gray-400">Срок от 3-х недель</p>
          </div>

          <div className="flex flex-col items-center col-span-2 md:col-span-1">
            <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
              <Car className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            </div>
            <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 text-center text-gray-900 dark:text-white">Выдача авто</h3>
            <p className="text-xs md:text-sm text-center text-gray-600 dark:text-gray-400">Доставим до ТК</p>
          </div>
        </div>
      </div>
    </section>
  );
}