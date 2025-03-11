import React, { useState } from 'react';
import { Search, Calendar, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface NewsFilters {
  search: string;
  category: string;
  dateFrom: string;
  dateTo: string;
}

const categories = [
  'Все новости',
  'Компания',
  'Законодательство',
  'Автомобили',
  'Мероприятия'
];

export default function NewsPage() {
  const [filters, setFilters] = useState<NewsFilters>({
    search: '',
    category: '',
    dateFrom: '',
    dateTo: ''
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Новости
          </h1>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по новостям"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'Все новости' ? '' : category}>
                    {category}
                  </option>
                ))}
              </select>

              <div>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* News Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Example News Card */}
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img
                src="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800"
                alt="News"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  15 февраля 2024
                  <span className="mx-2">•</span>
                  Компания
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Открытие нового офиса во Владивостоке
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Мы расширяем нашу сеть представительств для удобства клиентов
                </p>
                <button className="text-red-500 hover:text-red-600 transition-colors flex items-center">
                  Читать далее
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </article>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Предыдущая
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg">1</button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">2</button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">3</button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Следующая
              </button>
            </nav>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}