import React, { useState, useRef, useEffect } from 'react';
import { Star, MessageSquare, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  image_url?: string;
  images?: string[];
  source: string;
  created_at: string;
}

interface ReviewModalProps {
  review: Review;
  onClose: () => void;
}

function ReviewModal({ review, onClose }: ReviewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = review.images || (review.image_url ? [review.image_url] : []);

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const renderWordPressContent = (content: string) => {
    if (!content) return null;
    
    // Extract paragraphs with dark mode support
    const paragraphs = content.match(/<!-- wp:paragraph -->\s*<p>(.*?)<\/p>\n<!-- \/wp:paragraph -->/gs) || [];
    const formattedParagraphs = paragraphs.map((p, index) => {
      const text = p.match(/<p>(.*?)<\/p>/s)?.[1] || '';
      return <p key={`p-${index}`} className="mb-4 text-gray-900 dark:text-gray-100">{text}</p>;
    });
    
    // Extract lists with dark mode support
    const lists = content.match(/<!-- wp:list -->\s*<ul>(.*?)<\/ul>\n<!-- \/wp:list -->/gs) || [];
    const formattedLists = lists.map((list, index) => {
      const items = list.match(/<li>(.*?)<\/li>/g) || [];
      const listItems = items.map((item, i) => {
        const text = item.match(/<li>(.*?)<\/li>/)?.[1] || '';
        return <li key={i} className="ml-5 list-disc text-gray-900 dark:text-gray-100">{text}</li>;
      });
      
      return <ul key={`list-${index}`} className="mb-4">{listItems}</ul>;
    });
    
    // Combine all elements
    const allElements = [...formattedParagraphs, ...formattedLists];
    
    return (
      <div className="review-content text-gray-900 dark:text-gray-100">
        {allElements.length > 0 ? allElements : <p>{content}</p>}
      </div>
    );
  };

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
          <div className="prose dark:prose-invert max-w-none mb-4">
            {renderWordPressContent(review.text)}
          </div>
          
          {images.length > 0 && (
            <div className="relative mb-4">
              <img 
                src={images[currentImageIndex]} 
                alt={`Отзыв от ${review.author}`} 
                className="w-full rounded-lg max-h-[400px] object-contain"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                    {images.map((_, index) => (
                      <div 
                        key={index} 
                        className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{new Date(review.created_at).toLocaleDateString()}</span>
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

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      {/* Author and rating section */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{review.author}</h3>
        <div className="flex">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
          ))}
        </div>
      </div>
      
      {/* Images section */}
      {(review.images?.length > 0 || review.image_url) && (
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            {review.image_url && (
              <img
                src={review.image_url}
                alt={`Review by ${review.author}`}
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x225?text=Error';
                }}
              />
            )}
            {review.images?.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Review image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x225?text=Error';
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Review text */}
      <div className="text-gray-900 dark:text-gray-100">
        {renderWordPressContent(review.text)}
      </div>
      
      {/* Footer section */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>{new Date(review.created_at).toLocaleDateString()}</span>
        <span>{review.source}</span>
      </div>
    </div>
  );
};

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
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

  const getPlainTextFromWordPress = (content: string): string => {
    if (!content) return '';
    
    let plainText = content
      .replace(/<!-- wp:paragraph -->\n<p>(.*?)<\/p>\n<!-- \/wp:paragraph -->/g, '$1 ')
      .replace(/<!-- wp:list -->\n<ul>(.*?)<\/ul>\n<!-- \/wp:list -->/g, '$1 ')
      .replace(/<!-- wp:list-item -->\n<li>(.*?)<\/li>\n<!-- \/wp:list-item -->/g, '• $1 ');
    
    plainText = plainText.replace(/<[^>]*>/g, '');
    
    return plainText.trim();
  };

  return (
    <section id="reviews" className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Отзывы клиентов
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : reviews.length > 0 ? (
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
                      
                      {(review.image_url || (review.images && review.images.length > 0)) && (
                        <div className="mb-4 aspect-video rounded-lg overflow-hidden">
                          <img 
                            src={review.image_url || review.images?.[0]} 
                            alt={`Отзыв от ${review.author}`}
                            className="w-full h-full object-cover"
                          />
                          {review.images && review.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                              +{review.images.length - 1}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-4">
                        {getPlainTextFromWordPress(review.text)}
                      </p>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
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
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            Отзывы пока не добавлены
          </div>
        )}
      </div>

      {selectedReview && (
        <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />
      )}
    </section>
  );
}