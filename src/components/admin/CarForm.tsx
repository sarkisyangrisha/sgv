import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const carSchema = z.object({
  brand: z.string().min(1, 'Выберите марку'),
  model: z.string().min(1, 'Выберите модель'),
  generation: z.string().min(1, 'Укажите поколение'),
  year: z.string().min(1, 'Укажите год'),
  price: z.string().min(1, 'Укажите цену'),
  engine: z.string().min(1, 'Укажите двигатель'),
  power: z.string().min(1, 'Укажите мощность'),
  transmission: z.string().min(1, 'Укажите трансмиссию'),
  drivetrain: z.string().min(1, 'Укажите привод'),
  mileage: z.string().min(1, 'Укажите пробег'),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
});

type CarFormData = z.infer<typeof carSchema>;

interface CarFormProps {
  onSubmit: () => void;
  initialData?: any;
}

export default function CarForm({ onSubmit, initialData }: CarFormProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: initialData
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
      // Create preview URLs
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => {
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmitForm = async (data: CarFormData) => {
    setLoading(true);

    try {
      // Upload car data
      const { data: car, error: carError } = await supabase
        .from('cars')
        .insert([{
          ...data,
          price: parseFloat(data.price),
          year: parseInt(data.year),
        }])
        .select()
        .single();

      if (carError) throw carError;

      // Upload images
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `car-images/${car.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('cars')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('cars')
          .getPublicUrl(filePath);

        await supabase
          .from('car_images')
          .insert([{ car_id: car.id, url: publicUrl }]);
      }

      onSubmit();
    } catch (error) {
      console.error('Error saving car:', error);
      alert('Ошибка при сохранении автомобиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Марка
          </label>
          <input
            type="text"
            {...register('brand')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
          />
          {errors.brand && (
            <p className="mt-1 text-sm text-red-500">{errors.brand.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Модель
          </label>
          <input
            type="text"
            {...register('model')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
          />
          {errors.model && (
            <p className="mt-1 text-sm text-red-500">{errors.model.message}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Поколение
          </label>
          <input
            type="text"
            {...register('generation')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
          />
          {errors.generation && (
            <p className="mt-1 text-sm text-red-500">{errors.generation.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Год выпуска
          </label>
          <input
            type="number"
            {...register('year')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
          />
          {errors.year && (
            <p className="mt-1 text-sm text-red-500">{errors.year.message}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Двигатель
          </label>
          <input
            type="text"
            {...register('engine')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
          />
          {errors.engine && (
            <p className="mt-1 text-sm text-red-500">{errors.engine.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Мощность
          </label>
          <input
            type="text"
            {...register('power')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
          />
          {errors.power && (
            <p className="mt-1 text-sm text-red-500">{errors.power.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Пробег
          </label>
          <input
            type="text"
            {...register('mileage')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
          />
          {errors.mileage && (
            <p className="mt-1 text-sm text-red-500">{errors.mileage.message}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Трансмиссия
          </label>
          <input
            type="text"
            {...register('transmission')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
          />
          {errors.transmission && (
            <p className="mt-1 text-sm text-red-500">{errors.transmission.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Привод
          </label>
          <input
            type="text"
            {...register('drivetrain')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
          />
          {errors.drivetrain && (
            <p className="mt-1 text-sm text-red-500">{errors.drivetrain.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Описание
        </label>
        <textarea
          {...register('description')}
          rows={6}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Фотографии
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
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
          <label className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors">
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Добавить фото</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center"
        >
          {loading ? (
            <>
              <span className="mr-2">Сохранение...</span>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Сохранить
            </>
          )}
        </button>
      </div>
    </form>
  );
}