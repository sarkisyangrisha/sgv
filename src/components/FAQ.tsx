import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';

const faqs = [
  {
    question: "Как происходит процесс покупки автомобиля?",
    answer: "Процесс включает несколько этапов: консультация и определение требований, поиск подходящих вариантов, проверка автомобиля, оформление документов, доставка и передача клиенту."
  },
  {
    question: "Какие гарантии вы предоставляете?",
    answer: "Мы предлагаем широкий ассортимент моделей, включая редкие и популярные автомобили из Японии, Китая и Кореи."
  },
  {
    question: "Какие автомобили доступны для заказа?",
    answer: "Мы проводим полную проверку технического состояния автомобиля и его юридическую чистоту перед покупкой, предоставляем все документы и историю."
  },
  {
    question: "Можно ли сэкономить, заказывая автомобиль из-за границы?",
    answer: "Да, прямой импорт снижает конечную цену автомобиля за счет отсутствия посредников и отсутсвия коммерческого утилизационного сбора."
  },
  {
    question: "Как происходит оформление документов?",
    answer: "Мы берем на себя все документальные процедуры — от таможенного оформления до регистрации автомобиля на территории РФ."
  },
  {
    question: "Сколько времени занимает доставка?",
    answer: "Доставка автомобиля занимает от 2 до 8 недель, в зависимости от страны и логистики."
  }
];

const extendedFaqs = [
  ...faqs,
  {
    question: "Какие документы нужны для покупки автомобиля?",
    answer: "Для покупки автомобиля необходим паспорт гражданина РФ. При оформлении в кредит потребуются дополнительные документы, которые определяет банк."
  },
  {
    question: "Возможна ли покупка автомобиля в кредит?",
    answer: "Да, мы сотрудничаем с ведущими банками и можем помочь в оформлении автокредита на выгодных условиях."
  },
  {
    question: "Как проверяется техническое состояние автомобиля?",
    answer: "Мы проводим полную диагностику автомобиля перед покупкой, включая проверку двигателя, трансмиссии, ходовой части и электроники."
  },
  {
    question: "Предоставляете ли вы услуги по страхованию?",
    answer: "Да, мы помогаем в оформлении всех видов страхования: ОСАГО, КАСКО и дополнительных программ защиты."
  }
];

export default function FAQ() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const displayFaqs = isMobile ? faqs : extendedFaqs;

  return (
    <section id="faq" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Часто задаваемые вопросы
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {displayFaqs.map((faq, index) => (
            <details key={index} className="group bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
              <summary className="flex items-center justify-between p-4 md:p-6 cursor-pointer">
                <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base">{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 transform group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-4 md:px-6 pb-4 md:pb-6">
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}