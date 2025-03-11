import React from 'react';
import { Shield, Truck, FileCheck } from 'lucide-react';
import CurrencyRates from './CurrencyRates';

export default function Hero() {
  const scrollToContactForm = () => {
    const contactForm = document.getElementById('contact');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-20 relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury car"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 dark:from-black/80 dark:via-black/60 dark:to-black/80" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Импорт автомобилей из Азии
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Профессиональный подбор и доставка автомобилей из Китая, Японии и Южной Кореи
          </p>
          <button 
            onClick={scrollToContactForm}
            className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition"
          >
            Подобрать автомобиль
          </button>
        </div>

        <div className="mt-12 max-w-5xl mx-auto">
          <CurrencyRates />
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-white/20 dark:border-gray-700">
            <Shield className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Опыт и доверие</h3>
            <p className="text-gray-200">Более 5 лет успешной работы и сотни довольных клиентов</p>
          </div>
          <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-white/20 dark:border-gray-700">
            <Truck className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Полный цикл услуг</h3>
            <p className="text-gray-200">От выбора до доставки и оформления документов</p>
          </div>
          <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-white/20 dark:border-gray-700">
            <FileCheck className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Надежность</h3>
            <p className="text-gray-200">Строгая проверка состояния и истории каждого автомобиля</p>
          </div>
        </div>
      </div>
    </div>
  );
}