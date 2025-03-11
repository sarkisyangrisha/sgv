import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { supabase } from '../lib/supabase';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_number: number;
}

export default function FAQ() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  async function fetchFAQs() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order_number', { ascending: true });
      
      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  }

  // Limit the number of FAQs shown on mobile
  const displayFaqs = isMobile && faqs.length > 6 ? faqs.slice(0, 6) : faqs;

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Часто задаваемые вопросы
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : displayFaqs.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {displayFaqs.map((faq) => (
              <div 
                key={faq.id} 
                className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm"
              >
                <div 
                  className="flex items-center justify-between p-4 md:p-6 cursor-pointer"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform ${
                      openFaqId === faq.id ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
                {openFaqId === faq.id && (
                  <div className="px-4 md:px-6 pb-4 md:pb-6">
                    <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            FAQ пока не добавлены
          </div>
        )}
      </div>
    </section>
  );
}