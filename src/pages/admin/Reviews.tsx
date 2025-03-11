import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Search, Star, X, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { uploadFile, getFileUrl, deleteFile } from '../../lib/storage';

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date?: string;
  source: string;
  source_url?: string;
  image_url?: string;
  images?: string[];
  created_at: string;
}

const reviewSchema = z.object({
  author: z.string().min(1, 'Введите имя автора'),
  rating: z.number().min(1, 'Выберите рейтинг').max(5),
  text: z.string().min(10, 'Текст отзыва должен содержать минимум 10 символов'),
  source: z.string().min(1, 'Укажите источник'),
  source_url: z.string().optional(),
  image_url: z.string().optional(),
  images: z.array(z.string()).optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [formRating, setFormRating] = useState(5);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors }, watch } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      author: '',
      rating: 5,
      text: '',
      source: '',
      source_url: '',
      image_url: '',
      images: [],
    }
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (selectedReview) {
      setValue('author', selectedReview.author);
      setValue('rating', selectedReview.rating);
      setValue('text', unformatWordPressContent(selectedReview.text));
      setValue('source', selectedReview.source);
      setValue('source_url', selectedReview.source_url || '');
      setValue('image_url', selectedReview.image_url || '');
      
      const images = selectedReview.images || [];
      if (selectedReview.image_url && !images.includes(selectedReview.image_url)) {
        images.push(selectedReview.image_url);
      }
      setValue('images', images);
      setImageUrls(images);
      setFormRating(selectedReview.rating);
    } else {
      reset();
      setImages([]);
      setImageUrls([]);
      setFormRating(5);
    }
  }, [selectedReview, setValue, reset]);

  async function fetchReviews() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log("Fetched reviews:", data);
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddReview = () => {
    setSelectedReview(null);
    setShowForm(true);
    setImages([]);
    setImageUrls([]);
  };

  const handleEditReview = (review: Review) => {
    setSelectedReview(review);
    setShowForm(true);
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) return;
    
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setReviews(reviews.filter(review => review.id !== id));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Ошибка при удалении отзыва');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    
    const newImages = [...images];
    const newImageUrls = [...imageUrls];
    
    [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    [newImageUrls[index], newImageUrls[index - 1]] = [newImageUrls[index - 1], newImageUrls[index]];
    
    setImages(newImages);
    setImageUrls(newImageUrls);
  };

  const moveImageDown = (index: number) => {
    if (index === imageUrls.length - 1) return;
    
    const newImages = [...images];
    const newImageUrls = [...imageUrls];
    
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    [newImageUrls[index], newImageUrls[index + 1]] = [newImageUrls[index + 1], newImageUrls[index]];
    
    setImages(newImages);
    setImageUrls(newImageUrls);
  };

  const addImageUrl = () => {
    if (newImageUrl && newImageUrl.trim() !== '') {
      const updatedUrls = [...imageUrls, newImageUrl];
      setImageUrls(updatedUrls);
      setValue('images', updatedUrls);
      setNewImageUrl('');
    }
  };

  const formatWordPressContent = (text: string): string => {
    if (!text) return '';
    
    let formatted = text
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<!-- wp:paragraph -->\n<p>${paragraph}</p>\n<!-- /wp:paragraph -->`)
      .join('\n\n');
    
    formatted = formatted.replace(/<!-- wp:paragraph -->\n<p>[-*]\s+(.+?)<\/p>\n<!-- \/wp:paragraph -->/g, '<!-- wp:list-item -->\n<li>$1</li>\n<!-- /wp:list-item -->');
    
    const listItemRegex = /<!-- wp:list-item -->\n<li>(.+?)<\/li>\n<!-- \/wp:list-item -->/g;
    const listItems = [];
    let match;
    
    while ((match = listItemRegex.exec(formatted)) !== null) {
      listItems.push(match[0]);
    }
    
    if (listItems.length > 0) {
      const listContent = listItems.join('\n');
      formatted = formatted.replace(listItemRegex, '');
      formatted += `\n\n<!-- wp:list -->\n<ul>\n${listContent}\n</ul>\n<!-- /wp:list -->`;
    }
    
    return formatted;
  };

  const unformatWordPressContent = (content: string): string => {
    if (!content) return '';
    
    let plainText = content
      .replace(/<!-- wp:paragraph -->\n<p>(.*?)<\/p>\n<!-- \/wp:paragraph -->/g, '$1\n\n')
      .replace(/<!-- wp:list -->\n<ul>\n(.*?)\n<\/ul>\n<!-- \/wp:list -->/g, '$1\n\n')
      .replace(/<!-- wp:list-item -->\n<li>(.*?)<\/li>\n<!-- \/wp:list-item -->/g, '- $1\n');
    
    plainText = plainText.replace(/<[^>]*>/g, '');
    
    return plainText.trim();
  };

  const onSubmitForm = async (data: ReviewFormData) => {
    setFormLoading(true);
    setFormError(null);
    
    try {
      console.log("Submitting review data:", data);
      
      const formattedText = formatWordPressContent(data.text);
      const uploadedImageUrls: string[] = [];
      
      if (images.length > 0) {
        for (const image of images) {
          try {
            const fileName = await uploadFile(image, 'review-images');
            const imageUrl = await getFileUrl(fileName);
            uploadedImageUrls.push(imageUrl);
          } catch (imageError) {
            console.error('Error processing image:', imageError);
          }
        }
      }
      
      const mainImageUrl = uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : null;
      
      if (selectedReview) {
        const { error } = await supabase
          .from('reviews')
          .update({
            author: data.author,
            rating: data.rating,
            text: formattedText,
            source: data.source,
            source_url: data.source_url || null,
            image_url: mainImageUrl || data.image_url || null,
            images: uploadedImageUrls.length > 0 ? uploadedImageUrls : null,
          })
          .eq('id', selectedReview.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('reviews')
          .insert([{
            author: data.author,
            rating: data.rating,
            text: formattedText,
            source: data.source,
            source_url: data.source_url || null,
            image_url: mainImageUrl || null,
            images: uploadedImageUrls.length > 0 ? uploadedImageUrls : null,
          }]);
        
        if (error) throw error;
      }
      
      setShowForm(false);
      fetchReviews();
    } catch (error: any) {
      console.error('Error saving review:', error);
      setFormError(error.message || 'Ошибка при сохранении отзыва');
    } finally {
      setFormLoading(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormRating(rating);
    setValue('rating', rating);
  };

  const filteredReviews = reviews.filter(review => 
    review.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Управление отзывами
        </h1>
        <button 
          onClick={handleAddReview}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить отзыв
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по автору или тексту"
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
              {selectedReview ? 'Редактировать отзыв' : 'Добавить отзыв'}
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
                Автор
              </label>
              <input
                type="text"
                {...register('author')}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-500">{errors.author.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Рейтинг
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingClick(rating)}
                    className={`text-${formRating >= rating ? 'yellow-400' : 'gray-300'}`}
                  >
                    <Star className={`w-6 h-6 ${formRating >= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  </button>
                ))}
                <input type="hidden" {...register('rating')} value={formRating} />
              </div>
              {errors.rating && (
                <p className="mt-1 text-sm text-red-500">{errors.rating.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Текст отзыва
              </label>
              <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                <p>Используйте формат WordPress:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Разделяйте параграфы пустой строкой</li>
                  <li>Начните строку с - для создания списка</li>
                </ul>
              </div>
              <textarea
                rows={6}
                {...register('text')}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
              />
              {errors.text && (
                <p className="mt-1 text-sm text-red-500">{errors.text.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Источник
              </label>
              <input
                type="text"
                {...register('source')}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Например: VL.ru"
              />
              {errors.source && (
                <p className="mt-1 text-sm text-red-500">{errors.source.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ссылка на источник (опционально)
              </label>
              <input
                type="text"
                {...register('source_url')}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://vl.ru/review/123"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Изображения
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <label className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <ImageIcon className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">Выбрать файлы</span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
                
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={url} 
                          alt={`Изображение ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Ошибка+загрузки';
                          }}
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute bottom-2 right-2 flex space-x-1">
                          <button
                            type="button"
                            onClick={() => moveImageUp(index)}
                            disabled={index === 0}
                            className={`p-1 bg-gray-800/70 text-white rounded-full ${index === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImageDown(index)}
                            disabled={index === imageUrls.length - 1}
                            className={`p-1 bg-gray-800/70 text-white rounded-full ${index === imageUrls.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
          ) : filteredReviews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Автор
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Рейтинг
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Текст
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Изображения
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Источник
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {review.author}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs">
                          {unformatWordPressContent(review.text).substring(0, 100)}...
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-1">
                          {review.image_url && (
                            <div className="w-10 h-10 rounded overflow-hidden">
                              <img 
                                src={review.image_url} 
                                alt={`Изображение ${review.author}`} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Ошибка';
                                }}
                              />
                            </div>
                          )}
                          {review.images && review.images.length > 1 && (
                            <div className="bg-gray-200 dark:bg-gray-700 w-10 h-10 rounded flex items-center justify-center text-xs">
                              +{review.images.length - 1}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {review.source_url ? (
                            <a 
                              href={review.source_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {review.source}
                            </a>
                          ) : (
                            review.source
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditReview(review)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Отзывы не найдены' : 'Список отзывов пуст'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}