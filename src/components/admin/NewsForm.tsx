import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Image as ImageIcon } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';
import { uploadFile, getFileUrl } from '../../lib/storage';
import { formatEditorContent } from '../../lib/editor';
import { format } from 'date-fns';

const newsSchema = z.object({
  title: z.string().min(5, 'Заголовок должен содержать минимум 5 символов'),
  excerpt: z.string().min(10, 'Краткое описание должно содержать минимум 10 символов'),
  content: z.string().min(20, 'Содержание должно содержать минимум 20 символов'),
  category: z.string().min(1, 'Выберите категорию'),
  created_at: z.string().min(1, 'Выберите дату'),
  image_url: z.string().optional()
});

type NewsFormData = z.infer<typeof newsSchema>;

const categories = [
  'Компания',
  'Законодательство',
  'Автомобили',
  'Акции',
  'Мероприятия'
];

interface NewsFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  editMode?: boolean;
}

export default function NewsForm({ onSubmit, initialData, editMode = false }: NewsFormProps) {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editorContent, setEditorContent] = useState(initialData?.content || '');

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      ...initialData,
      created_at: initialData?.created_at 
        ? format(new Date(initialData.created_at), "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      image_url: initialData?.image_url || ''
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    if (imagePreview && !initialData?.image_url) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setValue('image_url', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmitForm = async (data: NewsFormData) => {
    setLoading(true);
    setFormError(null);
    
    try {
      let finalImageUrl = imagePreview;
      
      if (image) {
        const fileName = await uploadFile(image, 'news-images');
        finalImageUrl = await getFileUrl(fileName);
      }

      const formattedContent = formatEditorContent(editorContent);
      
      const formData = {
        ...data,
        content: formattedContent,
        image_url: finalImageUrl || data.image_url
      };

      await onSubmit(formData);
    } catch (error: any) {
      console.error('Error saving news:', error);
      setFormError(error.message || 'Ошибка при сохранении новости');
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
          Заголовок
        </label>
        <input
          type="text"
          {...register('title')}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Категория
        </label>
        <select
          {...register('category')}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Выберите категорию</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
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
          Краткое описание
        </label>
        <input
          type="text"
          {...register('excerpt')}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        {errors.excerpt && (
          <p className="mt-1 text-sm text-red-500">{errors.excerpt.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Содержание
        </label>
        <RichTextEditor
          value={editorContent}
          onChange={(content) => {
            setEditorContent(content);
            setValue('content', content);
          }}
          placeholder="Введите содержание новости..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Изображение
        </label>
        <input type="hidden" {...register('image_url')} />
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <label className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <ImageIcon className="w-5 h-5 mr-2 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">Выбрать файл</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
          
          {imagePreview && (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Предпросмотр" 
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Ошибка+загрузки';
                }}
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
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