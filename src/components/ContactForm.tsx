import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';

const contactSchema = z.object({
  name: z.string().min(2, 'Введите ваше имя'),
  phone: z.string()
    .min(10, 'Введите корректный номер телефона')
    .regex(/^[0-9+\s()-]+$/, 'Некорректный формат номера'),
  email: z.string().email('Введите корректный email'),
  budget: z.string().min(1, 'Укажите ваш бюджет'),
  city: z.string().min(2, 'Укажите ваш город'),
  contactMethod: z.enum(['whatsapp', 'telegram', 'phone'], {
    required_error: 'Выберите способ связи'
  })
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: dbError } = await supabase
        .from('contact_form_submissions')
        .insert([{
          name: data.name,
          phone: data.phone,
          email: data.email,
          budget: data.budget,
          city: data.city,
          contact_method: data.contactMethod,
          status: 'new'
        }]);

      if (dbError) throw dbError;
      
      setSuccess(true);
      reset();
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setError('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-8 md:py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="bg-white/90 dark:bg-gray-800/90 p-4 md:p-8 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="space-y-4 md:space-y-8">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">Наши менеджеры</h3>
                <div className="flex items-start space-x-3 text-gray-600 dark:text-gray-300">
                  <div>
                    <p>С 10:00 до 01:00 (по Владивостоку)</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">Связаться с нами</h3>
                <div className="flex items-start space-x-3 text-gray-600 dark:text-gray-300">
                  <div>
                    <p>sgvautoimport@gmail.com</p>
                    <p className="mt-1">+7 (914) 074-43-00</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">Заходите к нам</h3>
                <div className="flex items-start space-x-3 text-gray-600 dark:text-gray-300">
                  <div>
                    <p>г. Владивосток, ул. Русская 99</p>
                    <p className="text-sm">(Встреча в офисе по предварительной записи)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/90 dark:bg-gray-800/90 p-4 md:p-8 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Задумались об авто? Давайте поможем выбрать →
            </h2>

            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
                Спасибо за заявку! Мы свяжемся с вами в ближайшее время.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  {...register('name')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Номер телефона"
                  {...register('phone')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Электронная почта"
                  {...register('email')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Ваш бюджет"
                  {...register('budget')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-500">{errors.budget.message}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Ваш город"
                  {...register('city')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 md:gap-4">
                <label className="relative flex cursor-pointer">
                  <input 
                    type="radio" 
                    value="whatsapp" 
                    {...register('contactMethod')} 
                    className="peer sr-only" 
                  />
                  <div className="flex items-center justify-center w-full p-2 md:p-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg peer-checked:border-red-500 peer-checked:bg-red-50 dark:peer-checked:bg-red-900/20 peer-checked:text-red-500">
                    <span className="text-sm">WhatsApp</span>
                  </div>
                </label>
                <label className="relative flex cursor-pointer">
                  <input 
                    type="radio" 
                    value="telegram" 
                    {...register('contactMethod')} 
                    className="peer sr-only" 
                  />
                  <div className="flex items-center justify-center w-full p-2 md:p-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg peer-checked:border-red-500 peer-checked:bg-red-50 dark:peer-checked:bg-red-900/20 peer-checked:text-red-500">
                    <span className="text-sm">Telegram</span>
                  </div>
                </label>
                <label className="relative flex cursor-pointer">
                  <input 
                    type="radio" 
                    value="phone" 
                    {...register('contactMethod')} 
                    className="peer sr-only" 
                  />
                  <div className="flex items-center justify-center w-full p-2 md:p-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg peer-checked:border-red-500 peer-checked:bg-red-50 dark:peer-checked:bg-red-900/20 peer-checked:text-red-500">
                    <span className="text-sm">Звонок</span>
                  </div>
                </label>
              </div>
              {errors.contactMethod && (
                <p className="mt-1 text-sm text-red-500">{errors.contactMethod.message}</p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span>Отправка...</span>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  <>
                    <span>Отправить</span>
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}