import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import CarForm from '../../components/admin/CarForm';

interface Car {
  id: string;
  name: string;
  price: number;
  year: number;
  main_image: string;
  engine: string;
  power: string;
  transmission: string;
  drivetrain: string;
  mileage: string;
  description: string;
  status: 'in_stock' | 'on_order' | 'in_transit';
  created_at: string;
}

export default function Cars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log("Fetched cars:", data);
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddCar = () => {
    setSelectedCar(null);
    setFormData(null);
    setShowForm(true);
  };

  const handleEditCar = async (car: Car) => {
    setSelectedCar(car);
    
    // Parse car name into brand, model, and generation
    const nameParts = car.name.split(' ');
    const brand = nameParts[0] || '';
    const generation = nameParts.length > 2 ? nameParts[nameParts.length - 1] : '';
    const model = nameParts.slice(1, generation ? -1 : undefined).join(' ');
    
    // Prepare form data
    const formattedData = {
      brand: brand,
      model: model,
      generation: generation,
      year: car.year.toString(),
      price: car.price.toString(),
      engine: car.engine,
      power: car.power || '',
      transmission: car.transmission,
      drivetrain: car.drivetrain || '',
      mileage: car.mileage,
      description: car.description,
      status: car.status || 'in_stock'
    };
    
    setFormData(formattedData);
    setShowForm(true);
  };

  const handleDeleteCar = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот автомобиль?')) return;
    
    try {
      // First delete related images
      const { error: imagesError } = await supabase
        .from('car_images')
        .delete()
        .eq('car_id', id);
      
      if (imagesError) {
        console.error('Error deleting car images:', imagesError);
      }
      
      // Then delete the car
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCars(cars.filter(car => car.id !== id));
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Ошибка при удалении автомобиля');
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    fetchCars();
  };

  const filteredCars = cars.filter(car => 
    car.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'В наличии';
      case 'on_order':
        return 'Под заказ';
      case 'in_transit':
        return 'В пути';
      default:
        return 'Неизвестно';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'text-green-500';
      case 'on_order':
        return 'text-yellow-500';
      case 'in_transit':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Управление автомобилями
        </h1>
        <button 
          onClick={handleAddCar}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить автомобиль
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по названию"
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
              {selectedCar ? 'Редактировать автомобиль' : 'Добавить автомобиль'}
            </h2>
            <button 
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Отмена
            </button>
          </div>
          <CarForm 
            onSubmit={handleFormSubmit} 
            initialData={formData}
            editMode={!!selectedCar}
            carId={selectedCar?.id}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Фото
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Название
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Цена
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Год
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Дата добавления
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-12 h-12 rounded overflow-hidden">
                          <img 
                            src={car.main_image} 
                            alt={car.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {car.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {car.price.toLocaleString()} ₽
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {car.year}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${getStatusColor(car.status)}`}>
                          {getStatusText(car.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {new Date(car.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditCar(car)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCar(car.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Автомобили не найдены' : 'Список автомобилей пуст'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}