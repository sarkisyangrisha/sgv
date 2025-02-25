import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Car, Calendar, Fuel, Settings, Gauge } from 'lucide-react';

interface CarFilters {
  brand: string;
  model: string;
  yearFrom: string;
  yearTo: string;
  priceFrom: string;
  priceTo: string;
  transmission: string;
  fuelType: string;
  bodyType: string;
  driveType: string;
}

const CarCatalog: React.FC = () => {
  const [filters, setFilters] = useState<CarFilters>({
    brand: '',
    model: '',
    yearFrom: '',
    yearTo: '',
    priceFrom: '',
    priceTo: '',
    transmission: '',
    fuelType: '',
    bodyType: '',
    driveType: ''
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleFilterChange = (key: keyof CarFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Каталог автомобилей
            </h1>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
            >
              <Filter className="w-5 h-5" />
              <span>Расширенный поиск</span>
              <ChevronDown className={`w-5 h-5 transform transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Basic Search */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по марке или модели"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Марка</option>
              <option value="toyota">Toyota</option>
              <option value="honda">Honda</option>
              <option value="hyundai">Hyundai</option>
              <option value="kia">Kia</option>
            </select>
            <select
              value={filters.model}
              onChange={(e) => handleFilterChange('model', e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Модель</option>
              {filters.brand === 'toyota' && (
                <>
                  <option value="camry">Camry</option>
                  <option value="corolla">Corolla</option>
                  <option value="rav4">RAV4</option>
                </>
              )}
            </select>
            <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition">
              Найти
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid md:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Год выпуска
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="От"
                    value={filters.yearFrom}
                    onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={filters.yearTo}
                    onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Цена (₽)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="От"
                    value={filters.priceFrom}
                    onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={filters.priceTo}
                    onChange={(e) => handleFilterChange('priceTo', e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Коробка передач
                </label>
                <select
                  value={filters.transmission}
                  onChange={(e) => handleFilterChange('transmission', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Все</option>
                  <option value="automatic">Автомат</option>
                  <option value="manual">Механика</option>
                  <option value="robot">Робот</option>
                  <option value="cvt">Вариатор</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Тип топлива
                </label>
                <select
                  value={filters.fuelType}
                  onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Все</option>
                  <option value="petrol">Бензин</option>
                  <option value="diesel">Дизель</option>
                  <option value="hybrid">Гибрид</option>
                  <option value="electric">Электро</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Тип кузова
                </label>
                <select
                  value={filters.bodyType}
                  onChange={(e) => handleFilterChange('bodyType', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Все</option>
                  <option value="sedan">Седан</option>
                  <option value="suv">Кроссовер</option>
                  <option value="hatchback">Хэтчбек</option>
                  <option value="wagon">Универсал</option>
                  <option value="coupe">Купе</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Привод
                </label>
                <select
                  value={filters.driveType}
                  onChange={(e) => handleFilterChange('driveType', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Все</option>
                  <option value="fwd">Передний</option>
                  <option value="rwd">Задний</option>
                  <option value="awd">Полный</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Car Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Example Car Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="relative aspect-video">
              <img
                src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800"
                alt="Toyota Camry"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                В наличии
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Toyota Camry
                </h3>
                <span className="text-lg font-bold text-red-500">2 500 000 ₽</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>2023 год</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Gauge className="w-4 h-4 mr-2" />
                  <span>2.5 л</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Автомат</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Fuel className="w-4 h-4 mr-2" />
                  <span>Бензин</span>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Комплектация:</span> Престиж
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Пробег:</span> 0 км
                </div>
              </div>
              <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
                Подробнее
              </button>
            </div>
          </div>

          {/* Add more car cards here */}
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
    </div>
  );
};

export default CarCatalog;