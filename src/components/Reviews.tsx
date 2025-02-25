import React, { useRef, useState } from 'react';
import { Star, MessageSquare, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  image?: string;
  source: string;
  date: string;
}

const reviews: Review[] = [
  {
    id: 1,
    author: "Антон",
    rating: 5,
    text: "Достоинства: Надёжность, порядочность, постоянно на связи, быстро \n\n Комментарий: Хотел бы сказать спасибо Грише и его компании SGV Auto за помощь и покупку моей новой машины Subaru Levorg! Обратился по рекомендации друга, хотел Субару Леворг, Гриша рассказал все нюансы по модели, на что стоит обратить внимание, какие лоты доступны в наш бюджет, был постоянно на связи и ни разу ни дал усомниться в том что может что-то пойти не так. Поторговав пару недель разные машины на аукционе, удалось купить нужный нам автомобиль, даже дешевле изначального бюджета, что не могло не радовать Могу с уверенностью сказать, что компания порядочная знает свое дело, буду рекомендовать друзьям!",
    source: "VL.ru",
    date: "16.01.2025"
  },
  {
    id: 2,
    author: "Тигран",
    rating: 5,
    text: "Достоинства: Отношение к клиенту. Низкая комиссия, в сравнение с конкурентами Помощь в покупке тех.жидкостей для машины и первом Т.О. на территории России. \n\n Недостатки: Не обнаружил \n\n Комментарий: Выражаю свою благодарность Григорию за профессионализм и любовь к своему делу. В кратчайшие сроки мы с ним сумели подобрать автомобиль моей мечты, при этом по минимальной стоимости за такой пробег, комплектацию и состояние. Машина во владение уже более 2-х месяцев и дарит только положительные эмоции. Надеюсь так будет и дальше",
    source: "VL.ru",
    date: "17.12.2024"
  }
];

interface ReviewModalProps {
  review: Review;
  onClose: () => void;
}

function ReviewModal({ review, onClose }: ReviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{review.author}</h3>
            <div className="flex items-center">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line">
            {review.text}
          </p>
          {review.image && (
            <img src={review.image} alt="Review" className="w-full rounded-lg mb-4" />
          )}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{review.date}</span>
            <a href="#" className="text-red-500 hover:text-red-600 flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              {review.source}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Reviews() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

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

  return (
    <section id="reviews" className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Отзывы клиентов
        </h2>
        
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-4">
            <button
              onClick={() => scroll('left')}
              className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-4 md:gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="flex-none w-[280px] md:w-[400px]">
                  <div 
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 border border-gray-200 dark:border-gray-700 h-full cursor-pointer hover:shadow-lg transition"
                    onClick={() => setSelectedReview(review)}
                  >
                    <div className="flex items-center mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{review.author}</h3>
                        <div className="flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <a href="#" className="text-red-500 hover:text-red-600 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {review.source}
                      </a>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line line-clamp-4">
                      {review.text}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{review.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-4">
            <button
              onClick={() => scroll('right')}
              className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {selectedReview && (
        <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />
      )}
    </section>
  );
}