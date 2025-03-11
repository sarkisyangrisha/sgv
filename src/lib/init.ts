import { initializeStorage } from './storage';

export async function initializeServices() {
  try {
    console.log('Initializing services...');
    await initializeStorage();
    console.log('All services initialized successfully');
  } catch (error) {
    console.error('Error initializing services:', error);
    throw error;
  }
}