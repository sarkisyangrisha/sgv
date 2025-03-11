import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_number: number;
  created_at: string;
}

const faqSchema = z.object({
  question: z.string().min(5, 'Вопрос должен содержать минимум 5 символов'),
  answer: z.string().min(10, 'Ответ должен содержать минимум 10 символов'),
  order_number: z.number().optional(),
});

type FAQFormData = z.infer<typeof faqSchema>;

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: '',
      answer: '',
    }
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    if (selectedFAQ) {
      setValue('question', selectedFAQ.question);
      setValue('answer', selectedFAQ.answer);
      setValue('order_number', selectedFAQ.order_number);
    } else {
      reset();
    }
  }, [selectedFAQ, setValue, reset]);

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

  const handleAddFAQ = () => {
    setSelectedFAQ(null);
    setShowForm(true);
  };

  const handleEditFAQ = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setShowForm(true);
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот вопрос?')) return;
    
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setFaqs(faqs.filter(faq => faq.id !== id));
      
      // Reorder remaining FAQs
      const updatedFaqs = faqs
        .filter(faq => faq.id !== id)
        .sort((a, b) => a.order_number - b.order_number)
        .map((faq, index) => ({ ...faq, order_number: index + 1 }));
      
      for (const faq of updatedFaqs) {
        await supabase
          .from('faqs')
          .update({ order_number: faq.order_number })
          .eq('id', faq.id);
      }
      
      setFaqs(updatedFaqs);
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Ошибка при удалении вопроса');
    }
  };

  const handleMoveUp = async (id: string) => {
    const index = faqs.findIndex(faq => faq.id === id);
    if (index > 0) {
      try {
        const newFaqs = [...faqs];
        const currentFaq = newFaqs[index];
        const prevFaq = newFaqs[index - 1];
        
        // Swap order numbers
        const tempOrder = currentFaq.order_number;
        currentFaq.order_number = prevFaq.order_number;
        prevFaq.order_number = tempOrder;
        
        // Update in database
        await supabase
          .from('faqs')
          .update({ order_number: currentFaq.order_number })
          .eq('id', currentFaq.id);
        
        await supabase
          .from('faqs')
          .update({ order_number: prevFaq.order_number })
          .eq('id', prevFaq.id);
        
        // Update state
        newFaqs.sort((a, b) => a.order_number - b.order_number);
        setFaqs(newFaqs);
      } catch (error) {
        console.error('Error moving FAQ up:', error);
      }
    }
  };

  const handleMoveDown = async (id: string) => {
    const index = faqs.findIndex(faq => faq.id === id);
    if (index < faqs.length - 1) {
      try {
        const newFaqs = [...faqs];
        const currentFaq = newFaqs[index];
        const nextFaq = newFaqs[index + 1];
        
        // Swap order numbers
        const tempOrder = currentFaq.order_number;
        currentFaq.order_number = nextFaq.order_number;
        nextFaq.order_number = tempOrder;
        
        // Update in database
        await supabase
          .from('faqs')
          .update({ order_number: currentFaq.order_number })
          .eq('id', currentFaq.id);
        
        await supabase
          .from('faqs')
          .update({ order_number: nextFaq.order_number })
          .eq('id', nextFaq.id);
        
        // Update state
        newFaqs.sort((a, b) => a.order_number - b.order_number);
        setFaqs(newFaqs);
      } catch (error) {
        console.error('Error moving FAQ down:', error);
      }
    }
  };

  const onSubmitForm = async (data: FAQFormData) => {
    setFormLoading(true);
    setFormError(null);
    
    try {
      if (selectedFAQ) {
        // Update existing FAQ
        const { error } = await supabase
          .from('faqs')
          .update({
            question: data.question,
            answer: data.answer,
          })
          .eq('id', selectedFAQ.id);
        
        if (error) throw error;
      } else {
        // Create new FAQ
        // Get the highest order number and add 1
        const maxOrder = faqs.length > 0 
          ? Math.max(...faqs.map(faq => faq.order_number)) 
          : 0;
        
        const { error } = await supabase
          .from('faqs')
          .insert([{
            question: data.question,
            answer: data.answer,
            order_number: maxOrder + 1,
          }]);
        
        if (error) throw error;
      }
      
      setShowForm(false);
      fetchFAQs();
    } catch (error: any) {
      console.error('Error saving FAQ:', error);
      setFormError(error.message || 'Ошибка при сохранении вопроса');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.order_number - b.order_number);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Управление FAQ
        </h1>
        <button 
          onClick={handleAddFAQ}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить вопрос
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по вопросу или ответу"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {showForm ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {selectedFAQ ? 'Редактировать вопрос' : 'Добавить вопрос'}
            </h2>
            <button 
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Отмена
            </button>
          </div>
          
          {formError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
              {formError}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Вопрос
              </label>
              <input
                type="text"
                {...register('question')}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {errors.question && (
                <p className="mt-1 text-sm text-red-500">{errors.question.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ответ
              </label>
              <textarea
                rows={6}
                {...register('answer')}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {errors.answer && (
                <p className="mt-1 text-sm text-red-500">{errors.answer.message}</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={formLoading}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition flex items-center"
              >
                {formLoading ? (
                  <>
                    <span className="mr-2">Сохранение...</span>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </>
                ) : (
                  'Сохранить'
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : filteredFAQs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Порядок
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Вопрос
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredFAQs.map((faq) => (
                    <tr key={faq.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleMoveUp(faq.id)}
                            disabled={faq.order_number === 1}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(faq.id)}
                            disabled={faq.order_number === faqs.length}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <span>{faq.order_number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">{faq.question}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{faq.answer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditFAQ(faq)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteFAQ(faq.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Вопросы не найдены' : 'Список вопросов пуст'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}