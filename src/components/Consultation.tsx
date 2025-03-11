import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function Consultation() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000"
              alt="Luxury car"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Бесплатная консультация по подбору автомобиля
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Наши специалисты помогут выбрать идеальный автомобиль, учитывая ваши предпочтения и бюджет. 
              Расскажем о текущих трендах рынка, особенностях различных моделей и поможем с оформлением документов.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Записаться на консультацию
              </button>
              <a 
                href="https://wa.me/79140744300" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-6 py-3 rounded-lg hover:bg-[#128C7E] transition-colors"
              >
                Написать в WhatsApp
              </a>
              <a 
                href="https://t.me/SGVAutoImport" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#0088cc] text-white px-6 py-3 rounded-lg hover:bg-[#0077b5] transition-colors"
              >
                Написать в Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}