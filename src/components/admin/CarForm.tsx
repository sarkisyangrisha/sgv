import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Image as ImageIcon, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadFile, getFileUrl } from '../../lib/storage';
import imageCompression from 'browser-image-compression';

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
  status: z.enum(['in_stock', 'on_order', 'in_transit'], {
    required_error: 'Выберите статус'
  })
});

type CarFormData = z.infer<typeof carSchema>;

interface CarFormProps {
  onSubmit: () => void;
  initialData?: any;
  editMode?: boolean;
  carId?: string;
}

const compressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/jpeg',
  quality: 0.8
};

export default function CarForm({ onSubmit, initialData, editMode = false, carId }: CarFormProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{id: string, url: string}[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [compressionProgress, setCompressionProgress] = useState<number>(0);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [draggedExistingImageIndex, setDraggedExistingImageIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: initialData || {}
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (editMode && carId) {
      fetchExistingImages(carId);
    }
  }, [editMode, carId]);

  const fetchExistingImages = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('car_images')
        .select('id, image_url')
        .eq('car_id', id);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setExistingImages(data.map(item => ({ id: item.id, url: item.image_url })));
      }
    } catch (error) {
      console.error('Error fetching existing images:', error);
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    try {
      const options = {
        ...compressionOptions,
        onProgress: (progress: number) => {
          setCompressionProgress(progress);
        }
      };

      return await imageCompression(file, options);
    } catch (error) {
      console.error('Error compressing image:', error);
      return file;
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setCompressionProgress(0);
      
      const compressedFiles = [];
      const urls = [];
      
      for (const file of newFiles) {
        try {
          const compressedFile = await compressImage(file);
          compressedFiles.push(compressedFile);
          urls.push(URL.createObjectURL(compressedFile));
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
      
      setImages(prev => [...prev, ...compressedFiles]);
      setImageUrls(prev => [...prev, ...urls]);
      setCompressionProgress(0);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = async (id: string, index: number) => {
    try {
      const { error } = await supabase
        .from('car_images')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error removing existing image:', error);
      alert('Ошибка при удалении изображения');
    }
  };

  const handleDragStart = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setDraggedExistingImageIndex(index);
    } else {
      setDraggedImageIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedImageIndex(null);
    setDraggedExistingImageIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number, isExisting: boolean) => {
    if (draggedImageIndex !== null && !isExisting) {
      const newImages = [...images];
      const newImageUrls = [...imageUrls];
      
      const [draggedImage] = newImages.splice(draggedImageIndex, 1);
      const [draggedUrl] = newImageUrls.splice(draggedImageIndex, 1);
      
      newImages.splice(dropIndex, 0, draggedImage);
      newImageUrls.splice(dropIndex, 0, draggedUrl);
      
      setImages(newImages);
      setImageUrls(newImageUrls);
    } else if (draggedExistingImageIndex !== null && isExisting) {
      const newExistingImages = [...existingImages];
      const [draggedImage] = newExistingImages.splice(draggedExistingImageIndex, 1);
      newExistingImages.splice(dropIndex, 0, draggedImage);
      setExistingImages(newExistingImages);
    }
    
    handleDragEnd();
  };

  const onSubmitForm = async (data: CarFormData) => {
    setLoading(true);
    setSubmitError(null);

    try {
      const carName = `${data.brand} ${data.model} ${data.generation}`;
      
      let carData;

      if (editMode && carId) {
        const { data: updatedCar, error: updateError } = await supabase
          .from('cars')
          .update({
            name: carName,
            price: parseInt(data.price),
            year: parseInt(data.year),
            mileage: data.mileage,
            engine: data.engine,
            power: data.power,
            transmission: data.transmission,
            drivetrain: data.drivetrain,
            description: data.description,
            status: data.status
          })
          .eq('id', carId)
          .select();
        
        if (updateError) throw updateError;
        carData = updatedCar;
      } else {
        const { data: newCar, error: insertError } = await supabase
          .from('cars')
          .insert([{
            name: carName,
            price: parseInt(data.price),
            year: parseInt(data.year),
            mileage: data.mileage,
            engine: data.engine,
            power: data.power,
            transmission: data.transmission,
            drivetrain: data.drivetrain,
            description: data.description,
            status: data.status,
            main_image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800'
          }])
          .select();
        
        if (insertError) throw insertError;
        carData = newCar;
        carId = newCar?.[0]?.id;
      }

      console.log("Car saved successfully:", carData);

      if (carId && images.length > 0) {
        const uploadedImages = [];
        
        for (const [index, image] of images.entries()) {
          try {
            const fileName = await uploadFile(image, `car-images/${carId}`);
            const imageUrl = await getFileUrl(fileName);
            uploadedImages.push(imageUrl);

            if (index === 0 && existingImages.length === 0) {
              await supabase
                .from('cars')
                .update({ main_image: imageUrl })
                .eq('id', carId);
            }

            const { error: imageInsertError } = await supabase
              .from('car_images')
              .insert([{ 
                car_id: carId, 
                image_url: imageUrl 
              }]);
              
            if (imageInsertError) {
              console.error(`Error inserting image record ${index + 1}:`, imageInsertError);
            }
          } catch (imageError) {
            console.error(`Error processing image ${index + 1}:`, imageError);
          }
        }
      }

      console.log("Form submission completed successfully");
      onSubmit();
    } catch (error: any) {
      console.error('Error saving car:', error);
      setSubmitError(error.message || 'Ошибка при сохранении автомобиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {submitError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          {submitError}
        </div>
      )}
      
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
          Цена
        </label>
        <input
          type="text"
          {...register('price')}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
        )}
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
          Статус
        </label>
        <select
          {...register('status')}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="in_stock">В наличии</option>
          <option value="on_order">Под заказ</option>
          <option value="in_transit">В пути</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Фотографии
        </label>
        
        {existingImages.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Существующие фотографии:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((img, index) => (
                <div 
                  key={img.id} 
                  className={`relative aspect-square cursor-move ${
                    draggedExistingImageIndex === index ? 'opacity-50' : ''
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(index, true)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDrop(index, true);
                  }}
                >
                  <div className="absolute top-2 left-2 cursor-move">
                    <GripVertical className="w-4 h-4 text-white drop-shadow-lg" />
                  </div>
                  <img
                    src={img.url}
                    alt={`Existing ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Ошибка';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id, index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imageUrls.map((url, index) => (
            <div 
              key={index} 
              className={`relative aspect-square cursor-move ${
                draggedImageIndex === index ? 'opacity-50' : ''
              }`}
              draggable
              onDragStart={() => handleDragStart(index, false)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(index, false);
              }}
            >
              <div className="absolute top-2 left-2 cursor-move">
                <GripVertical className="w-4 h-4 text-white drop-shadow-lg" />
              </div>
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
              ref={fileInputRef}
            />
          </label>
        </div>

        {compressionProgress > 0 && compressionProgress < 100 && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-red-500 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${compressionProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Сжатие изображений: {Math.round(compressionProgress)}%
            </p>
          </div>
        )}
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