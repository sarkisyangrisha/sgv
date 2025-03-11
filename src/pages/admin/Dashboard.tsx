import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  cars: number;
  news: number;
  reviews: number;
  faqs: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    cars: 0,
    news: 0,
    reviews: 0,
    faqs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        // Fetch cars count
        const { count: carsCount, error: carsError } = await supabase
          .from('cars')
          .select('*', { count: 'exact', head: true });
        
        // Fetch reviews count
        const { count: reviewsCount, error: reviewsError } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true });
        
        // Fetch faqs count
        const { count: faqsCount, error: faqsError } = await supabase
          .from('faqs')
          .select('*', { count: 'exact', head: true });
        
        if (carsError) console.error('Error fetching cars:', carsError);
        if (reviewsError) console.error('Error fetching reviews:', reviewsError);
        if (faqsError) console.error('Error fetching faqs:', faqsError);

        setStats({
          cars: carsCount || 0,
          news: 0, // Placeholder for news count
          reviews: reviewsCount || 0,
          faqs: faqsCount || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Панель управления
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Автомобили</h3>
            <p className="text-3xl font-bold text-red-500">{stats.cars}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Новости</h3>
            <p className="text-3xl font-bold text-red-500">{stats.news}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Отзывы</h3>
            <p className="text-3xl font-bold text-red-500">{stats.reviews}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">FAQ</h3>
            <p className="text-3xl font-bold text-red-500">{stats.faqs}</p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Последние действия</h2>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium">Добавлен новый автомобиль</p>
              <p className="text-xs text-gray-500">Toyota Camry</p>
            </div>
            <span className="text-xs text-gray-500">Сегодня, 14:32</span>
          </div>
          <div className="py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium">Обновлен отзыв</p>
              <p className="text-xs text-gray-500">ID: 45</p>
            </div>
            <span className="text-xs text-gray-500">Вчера, 18:15</span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Добавлен новый FAQ</p>
              <p className="text-xs text-gray-500">О гарантии</p>
            </div>
            <span className="text-xs text-gray-500">23.05.2025, 10:45</span>
          </div>
        </div>
      </div>
    </div>
  );
}