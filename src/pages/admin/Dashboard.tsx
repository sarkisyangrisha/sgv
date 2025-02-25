import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Панель управления
      </h1>
      
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Автомобили</h3>
          <p className="text-3xl font-bold text-red-500">24</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Новости</h3>
          <p className="text-3xl font-bold text-red-500">12</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Отзывы</h3>
          <p className="text-3xl font-bold text-red-500">45</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">FAQ</h3>
          <p className="text-3xl font-bold text-red-500">8</p>
        </div>
      </div>
    </div>
  );
}