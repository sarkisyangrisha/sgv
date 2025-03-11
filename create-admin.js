// Скрипт для создания учетной записи администратора в Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Чтение переменных из .env файла
function getEnvVariables() {
  try {
    const envFile = fs.readFileSync('.env', 'utf8');
    const envVars = {};
    
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        envVars[key] = value;
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Ошибка при чтении .env файла:', error);
    return {};
  }
}

const envVars = getEnvVariables();
const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Ошибка: Не удалось получить VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY из .env файла');
  console.log('Доступные переменные:', Object.keys(envVars));
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const email = 'admin@sgvauto.ru';
const password = 'Admin123!';

async function createAdminUser() {
  try {
    console.log('Подключение к Supabase:', supabaseUrl);
    
    // Регистрация нового пользователя
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    console.log('Пользователь успешно создан:', data);
    console.log('Учетные данные для входа:');
    console.log(`Email: ${email}`);
    console.log(`Пароль: ${password}`);
    
    // Примечание: В реальном проекте вы бы также добавили этого пользователя в таблицу администраторов
    // и настроили соответствующие политики доступа в Supabase
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
  }
}

createAdminUser();