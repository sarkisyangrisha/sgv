import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar, ChevronRight } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Открыли новый офис во Владивостоке",
    excerpt: "Мы расширяем нашу сеть представительств для удобства клиентов",
    content: "Полный текст новости...",
    image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800",
    date: "2024-02-15",
    category: "Компания"
  },
  {
    id: 2,
    title: "Новые правила ввоза автомобилей",
    excerpt: "Изменения в таможенном законодательстве с 2024 года",
    content: "Полный текст новости...",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800",
    date: "2024-02-10",
    category: "Законодательство"
  }
];

export default function News() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Новости компании
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(new Date(item.date), 'd MMMM yyyy', { locale: ru })}
                  <span className="mx-2">•</span>
                  {item.category}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {item.excerpt}
                </p>
                <button className="text-red-500 hover:text-red-600 transition-colors flex items-center">
                  Читать далее
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}