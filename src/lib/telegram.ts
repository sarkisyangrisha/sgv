import { supabase } from './supabase';

const TELEGRAM_BOT_TOKEN = '7848631978:AAHBIdYOTHYiHXpSPdT_9qQXB7ys03v7Eng';
const TELEGRAM_CHAT_ID = '@zayavkisgvbot';

export const sendTelegramMessage = async (message: string) => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Telegram API error: ${errorData.description || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    throw error;
  }
};

export const formatContactMessage = (data: {
  name: string;
  phone: string;
  email: string;
  budget: string;
  city: string;
  contactMethod: string;
}) => {
  const methodMap = {
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    phone: 'Звонок'
  };

  return `
🚗 <b>Новая заявка на подбор авто!</b>

👤 <b>Имя:</b> ${data.name}
📱 <b>Телефон:</b> ${data.phone}
📧 <b>Email:</b> ${data.email}
💰 <b>Бюджет:</b> ${data.budget}
🏙 <b>Город:</b> ${data.city}
✉️ <b>Способ связи:</b> ${methodMap[data.contactMethod as keyof typeof methodMap]}

⏰ Время заявки: ${new Date().toLocaleString('ru-RU', { 
  timeZone: 'Asia/Vladivostok',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})} (по Владивостоку)
`.trim();
};