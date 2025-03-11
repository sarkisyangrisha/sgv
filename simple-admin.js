// Упрощенный скрипт для создания учетной записи администратора в Supabase
import { createClient } from '@supabase/supabase-js';

// Используем значения напрямую из .env файла
const supabaseUrl = 'https://htiuxmqpvvwjochqgzuh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0aXV4bXFwdnZ3am9jaHFnenVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NTEzNDUsImV4cCI6MjA1NjMyNzM0NX0.DqnrHehOunB8blohZefwJjpqFr05xj8RLPJRIU4hUpM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const email = 'admin@sgvauto.ru';
const password = 'Admin123!';

async function createAdminUser() {
  try {
    console.log('Создание пользователя...');
    
    // Регистрация нового пользователя
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    console.log('Пользователь успешно создан!');
    console.log('Учетные данные для входа:');
    console.log(`Email: ${email}`);
    console.log(`Пароль: ${password}`);
    
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
  }
}

createAdminUser();