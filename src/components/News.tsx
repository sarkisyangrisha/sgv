import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  created_at: string;
}

const sampleNewsItems: NewsItem[] = [
  {
    id: '1',
    title: "Открыли новый офис во Владивостоке",
    excerpt: "Мы расширяем нашу сеть представительств для удобства клиентов",
    content: "Мы рады сообщить, что открыли новый офис во Владивостоке для удобства наших клиентов. Теперь вы можете посетить нас по адресу: г. Владивосток, ул. Русская 99.",
    image_url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800",
    category: "Компания",
    created_at: "2024-02-15"
  },
  {
    id: '2',
    title: "Новые правила ввоза автомобилей",
    excerpt: "Изменения в таможенном законодательстве с 2024 года",
    content: "С 2024 года вступают в силу новые правила ввоза автомобилей на территорию РФ. Основные изменения касаются таможенных пошлин, экологических требований и процедуры оформления.",
    image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800",
    category: "Законодательство",
    created_at: "2024-02-10"
  }
];

const renderWordPressContent = (content: string): JSX.Element => {
  if (!content) return <></>;

  // Clean up HTML entities and special characters
  const cleanContent = content
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ');

  // Remove WordPress comments and HTML tags
  const plainText = cleanContent
    .replace(/<!-- wp:paragraph -->/g, '')
    .replace(/<!-- \/wp:paragraph -->/g, '')
    .replace(/<!-- wp:list -->/g, '')
    .replace(/<!-- \/wp:list -->/g, '')
    .replace(/<!-- wp:list-item -->/g, '')
    .replace(/<!-- \/wp:list-item -->/g, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .trim();

  // Split into paragraphs and clean up
  const paragraphs = plainText
    .split('.')
    .filter(p => p.trim())
    .map(p => p.trim() + '.');

  return (
    <div className="prose dark:prose-invert max-w-none">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-4 text-gray-900 dark:text-gray-100">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNewsItem, setSelectedNewsItem] = useState<NewsItem | null>(null);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        if (error.code === '42P01') {
          console.log("News table doesn't exist yet, using sample data");
          setNews(sampleNewsItems);
        } else {
          throw error;
        }
      } else {
        setNews(data || []);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews(sampleNewsItems);
    } finally {
      setLoading(false);
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const openNewsModal = (item: NewsItem) => {
    setSelectedNewsItem(item);
    setShowNewsModal(true);
  };

  return (
    <section className="py-8 md:py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Новости
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : news.length > 0 ? (
          <div className="relative">
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 -ml-4"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>

            <div
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-4 px-4">
                {news.map((item) => (
                  <article
                    key={item.id}
                    className="flex-none w-[300px] bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                    onClick={() => openNewsModal(item)}
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(new Date(item.created_at), 'd MMMM yyyy', { locale: ru })}
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

            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 -mr-4"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            Новости пока не добавлены
          </div>
        )}
      </div>

      {showNewsModal && selectedNewsItem && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowNewsModal(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedNewsItem.title}
              </h3>
              <button 
                onClick={() => setShowNewsModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                {format(new Date(selectedNewsItem.created_at), 'd MMMM yyyy', { locale: ru })}
                <span className="mx-2">•</span>
                {selectedNewsItem.category}
              </div>
              
              <img
                src={selectedNewsItem.image_url}
                alt={selectedNewsItem.title}
                className="w-full h-auto rounded-lg mb-6"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=No+Image';
                }}
              />
              
              {renderWordPressContent(selectedNewsItem.content)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default News;