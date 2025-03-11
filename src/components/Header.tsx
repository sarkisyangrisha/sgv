import React, { useState } from 'react';
import { Phone, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../lib/theme';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md fixed w-full top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-2">
            <span 
              style={{ 
                fontFamily: 'SutroW01-BoldExtended, sans-serif',
                fontSize: '24px',
                letterSpacing: '0.02em',
                textTransform: 'uppercase'
              }}
              className="text-gray-900 dark:text-white transition-colors duration-200"
            >
              SGV auto
            </span>
          </div>
          
          <nav className={`
            md:flex md:space-x-8
            ${isMenuOpen ? 'flex' : 'hidden'}
            fixed md:relative
            inset-x-0 top-20 md:top-0
            bg-white dark:bg-gray-900
            md:bg-transparent
            flex-col md:flex-row
            items-center
            py-4 md:py-0
            space-y-4 md:space-y-0
            border-t md:border-t-0
            border-gray-200 dark:border-gray-700
            shadow-lg md:shadow-none
          `}>
            <a href="#services" className="text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Услуги</a>
            <a href="#reviews" className="text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Отзывы</a>
            <a href="#faq" className="text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 transition-colors" onClick={() => setIsMenuOpen(false)}>FAQ</a>
            <a href="#contact" className="text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 transition-colors" onClick={() => { setIsMenuOpen(false); scrollToContact(); }}>Контакты</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={scrollToContact}
              className="hidden md:flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>Связаться с нами</span>
            </button>
            <button 
              className="md:hidden text-gray-700 dark:text-gray-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}