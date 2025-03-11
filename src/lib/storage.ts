import localforage from 'localforage';
import imageCompression from 'browser-image-compression';

// Initialize storage
localforage.config({
  name: 'sgvauto',
  storeName: 'files',
  version: 1.0,
  description: 'Storage for uploaded files'
});

const compressionOptions = {
  maxSizeMB: 0.2, // Reduce max file size to 200KB
  maxWidthOrHeight: 1200, // Limit resolution
  useWebWorker: true,
  quality: 0.8,
  fileType: 'image/jpeg',
  alwaysKeepResolution: false,
  initialQuality: 0.8,
  maxIteration: 10,
  exifOrientation: true
};

const compressImage = async (file: File, onProgress?: (progress: number) => void): Promise<File> => {
  try {
    const options = {
      ...compressionOptions,
      onProgress
    };
    
    const compressedFile = await imageCompression(file, options);
    
    // Double-check size and compress again if needed
    if (compressedFile.size > 200 * 1024) {
      const furtherOptions = {
        ...options,
        maxSizeMB: 0.15,
        quality: 0.7
      };
      return await imageCompression(compressedFile, furtherOptions);
    }
    
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    return file;
  }
};

export const uploadFile = async (
  file: File, 
  folder: string, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const fileExt = file.type.startsWith('image/') ? 'jpg' : file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Compress image if it's an image file
    const processedFile = file.type.startsWith('image/') 
      ? await compressImage(file, onProgress)
      : file;
    
    // Convert file to base64 for storage
    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(processedFile);
    });

    // Store file data with metadata
    const metadata = {
      fileName: processedFile.name,
      fileType: processedFile.type,
      fileSize: processedFile.size,
      uploadDate: new Date().toISOString(),
      compressed: file.type.startsWith('image/')
    };

    await localforage.setItem(`${fileName}_metadata`, metadata);
    await localforage.setItem(fileName, base64);
    
    return fileName;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const getFileUrl = async (fileName: string): Promise<string> => {
  try {
    const data = await localforage.getItem<string>(fileName);
    const metadata = await localforage.getItem<any>(`${fileName}_metadata`);
    
    if (!data) {
      throw new Error(`File not found: ${fileName}`);
    }

    // Validate data URL format
    if (!data.startsWith('data:')) {
      throw new Error('Invalid file data format');
    }

    // For images, verify the data URL is complete
    if (metadata?.fileType?.startsWith('image/')) {
      const [header, content] = data.split(',');
      if (!header.includes('base64') || !content) {
        throw new Error('Invalid image data format');
      }
    }

    return data;
  } catch (error) {
    console.error('Error getting file:', error);
    throw error;
  }
};

export const deleteFile = async (fileName: string): Promise<void> => {
  try {
    await localforage.removeItem(fileName);
    await localforage.removeItem(`${fileName}_metadata`);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

export const initializeStorage = async (): Promise<void> => {
  try {
    await localforage.ready();
    console.log('Local storage initialized successfully');
    
    // Clean up old files (older than 24 hours)
    const keys = await localforage.keys();
    const now = new Date();
    
    for (const key of keys) {
      if (key.endsWith('_metadata')) {
        const metadata = await localforage.getItem<any>(key);
        if (metadata?.uploadDate) {
          const uploadDate = new Date(metadata.uploadDate);
          if (now.getTime() - uploadDate.getTime() > 24 * 60 * 60 * 1000) {
            const fileName = key.replace('_metadata', '');
            await deleteFile(fileName);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
    throw error;
  }
};

// Helper function to clear storage
export const clearStorage = async (): Promise<void> => {
  try {
    await localforage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

// Helper function to get storage size
export const getStorageSize = async (): Promise<number> => {
  try {
    let size = 0;
    await localforage.iterate((value) => {
      if (typeof value === 'string') {
        size += value.length;
      }
    });
    return size;
  } catch (error) {
    console.error('Error getting storage size:', error);
    return 0;
  }
};