import React from 'react';
import { Phone, Mail, MapPin, GitBranch } from 'lucide-react';

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
              <a href="tel:+79143309736" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <Phone className="w-5 h-5 mr-2" />
                +7 (914) 330-97-36
              </a>
              <a href="mailto:info@sgvauto.ru" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <Mail className="w-5 h-5 mr-2" />
                info@sgvauto.ru
              </a>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 mr-2" />
                Владивосток
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Мы в соцсетях</h3>
            <div className="flex space-x-4">
              <a 
                href="https://t.me/SGVavtoImport" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                <GitBranch className="w-6 h-6" />
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