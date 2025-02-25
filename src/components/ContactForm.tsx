import React from 'react';
import { Send, Clock, Mail, MapPin, Phone } from 'lucide-react';

export default function ContactForm() {
  return (
    <section id="contact" className="py-8 md:py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="bg-white/90 dark:bg-gray-800/90 p-4 md:p-8 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="space-y-4 md:space-y-8">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">Наши менеджеры</h3>
                <div className="flex items-start space-x-3 text-gray-600 dark:text-gray-300">
                  <Clock className="w-5 h-5 mt-1 text-red-500" />
                  <div>
                    <p>Пн-вс 09:00 - 17:00</p>
                    <p>+7 (914) 330-97-36</p>
                    <p>+7 (914) 660-54-82</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">Связаться с нами</h3>
                <div className="flex items-start space-x-3 text-gray-600 dark:text-gray-300">
                  <Mail className="w-5 h-5 mt-1 text-red-500" />
                  <div>
                    <p>Наши специалисты помогут вам :)</p>
                    <p>info@sgvauto.ru</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">Заходите к нам</h3>
                <div className="flex items-start space-x-3 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-5 h-5 mt-1 text-red-500" />
                  <div>
                    <p>г. Владивосток, ул. Русская 99</p>
                    <p className="text-sm">(Встреча в офисе по предварительной записи)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/90 dark:bg-gray-800/90 p-4 md:p-8 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Задумались об авто? Давайте поможем выбрать →
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Ваше имя"
                className="w-full px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              />
              <input
                type="tel"
                placeholder="Номер телефона"
                className="w-full px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              />
              <input
                type="email"
                placeholder="Электронная почта"
                className="w-full px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              />
              <input
                type="text"
                placeholder="Ваш бюджет"
                className="w-full px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              />
              <input
                type="text"
                placeholder="Ваш город"
                className="w-full px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              />

              <div className="grid grid-cols-3 gap-2 md:gap-4">
                <label className="relative flex cursor-pointer">
                  <input type="radio" name="contact_method" value="whatsapp" className="peer sr-only" />
                  <div className="flex items-center justify-center w-full p-2 md:p-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg peer-checked:border-red-500 peer-checked:bg-red-50 dark:peer-checked:bg-red-900/20 peer-checked:text-red-500">
                    <span className="text-sm">WhatsApp</span>
                  </div>
                </label>
                <label className="relative flex cursor-pointer">
                  <input type="radio" name="contact_method" value="telegram" className="peer sr-only" />
                  <div className="flex items-center justify-center w-full p-2 md:p-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg peer-checked:border-red-500 peer-checked:bg-red-50 dark:peer-checked:bg-red-900/20 peer-checked:text-red-500">
                    <span className="text-sm">Telegram</span>
                  </div>
                </label>
                <label className="relative flex cursor-pointer">
                  <input type="radio" name="contact_method" value="phone" className="peer sr-only" />
                  <div className="flex items-center justify-center w-full p-2 md:p-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg peer-checked:border-red-500 peer-checked:bg-red-50 dark:peer-checked:bg-red-900/20 peer-checked:text-red-500">
                    <span className="text-sm">Звонок</span>
                  </div>
                </label>
              </div>

              <button type="submit" className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition flex items-center justify-center space-x-2">
                <span>Отправить</span>
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}