import { Client } from 'minio';

// Создаем клиент Minio
export const minioClient = new Client({
  endPoint: import.meta.env.VITE_MINIO_ENDPOINT || 'localhost',
  port: parseInt(import.meta.env.VITE_MINIO_PORT || '9000'),
  useSSL: import.meta.env.VITE_MINIO_USE_SSL === 'true',
  accessKey: import.meta.env.VITE_MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: import.meta.env.VITE_MINIO_SECRET_KEY || 'minioadmin'
});

const BUCKET_NAME = 'sgvauto';

// Функция для загрузки файла
export const uploadFile = async (file: File, folder: string): Promise<string> => {
  try {
    // Генерируем уникальное имя файла
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Загружаем файл
    await minioClient.putObject(BUCKET_NAME, fileName, file);
    
    // Формируем публичный URL
    const baseUrl = import.meta.env.VITE_MINIO_PUBLIC_URL || `http://localhost:9000/${BUCKET_NAME}`;
    return `${baseUrl}/${fileName}`;
  } catch (error) {
    console.error('Error uploading file to Minio:', error);
    throw error;
  }
};

// Функция для удаления файла
export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    // Извлекаем имя файла из URL
    const fileName = fileUrl.split('/').pop();
    if (!fileName) throw new Error('Invalid file URL');
    
    await minioClient.removeObject(BUCKET_NAME, fileName);
  } catch (error) {
    console.error('Error deleting file from Minio:', error);
    throw error;
  }
};

// Функция для инициализации бакета при старте приложения
export const initializeBucket = async (): Promise<void> => {
  try {
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_NAME);
      // Устанавливаем публичный доступ на чтение
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
          }
        ]
      };
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    }
  } catch (error) {
    console.error('Error initializing Minio bucket:', error);
    throw error;
  }
};