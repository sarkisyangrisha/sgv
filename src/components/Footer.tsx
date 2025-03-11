import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">SGV Auto Import</h3>
            <p className="text-gray-300">
              Профессиональный импорт автомобилей из Азии с полным циклом услуг
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Контакты</h3>
            <div className="space-y-2">
              <a href="tel:+79140744300" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <Phone className="w-5 h-5 mr-2" />
                +7 (914) 074-43-00
              </a>
              <a href="mailto:sgvautoimport@gmail.com" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <Mail className="w-5 h-5 mr-2" />
                sgvautoimport@gmail.com
              </a>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 mr-2" />
                Владивосток
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Мы в соцсетях</h3>
            <div className="flex space-x-3">
              <a 
                href="https://t.me/SGVavtoImport" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SGV Auto Import. Все права защищены.</p>
          <a 
            href="https://t.me/SGVavtoImport"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors mt-2 inline-block"
          >
            Подписывайтесь на наш Telegram канал
          </a>
        </div>
      </div>
    </footer>
  );
}