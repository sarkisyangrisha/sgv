import React from 'react';
import { Plus } from 'lucide-react';
import CarForm from '../../components/admin/CarForm';

export default function Cars() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Управление автомобилями
        </h1>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Добавить автомобиль
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Car list will be added here */}
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          Список автомобилей будет добавлен здесь
        </div>
      </div>
    </div>
  );
}