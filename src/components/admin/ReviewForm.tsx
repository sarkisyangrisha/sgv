import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, X, Image as ImageIcon } from 'lucide-react';
import { uploadFile, getFileUrl } from '../../lib/storage';
import { format } from 'date-fns';

const reviewSchema = z.object({
  author: z.string().min(2, 'Имя автора должно содержать минимум 2 символа'),
  rating: z.number().min(1, 'Выберите рейтинг').max(5),
  text: z.string().min(10, 'Текст отзыва должен содержать минимум 10 символов'),
  source: z.string().min(1, 'Укажите источник'),
  source_url: z.string().optional(),
  created_at: z.string().min(1, 'Выберите дату')
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  editMode?: boolean;
}

export default function ReviewForm({ onSubmit, initialData, editMode = false }: ReviewFormProps) {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formRating, setFormRating] = useState(initialData?.rating || 5);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      ...initialData,
      created_at: initialData?.created_at 
        ? format(new Date(initialData.created_at), "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm")
    }
  });

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

  const handleRatingClick = (rating: number) => {
    setFormRating(rating);
    setValue('rating', rating);
  };

  const onSubmitForm = async (data: ReviewFormData) => {
    setLoading(true);
    setFormError(null);
    
    try {
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
      
      const formData = {
        ...data,
        image_url: mainImageUrl,
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : null
      };

      await onSubmit(formData);
    } catch (error: any) {
      console.error('Error saving review:', error);
      setFormError(error.message || 'Ошибка при сохранении отзыва');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {formError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          {formError}
        </div>
      )}

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
          Дата публикации
        </label>
        <input
          type="datetime-local"
          {...register('created_at')}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        {errors.created_at && (
          <p className="mt-1 text-sm text-red-500">{errors.created_at.message}</p>
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
        <textarea
          {...register('text')}
          rows={6}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition flex items-center"
        >
          {loading ? (
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
  );
}