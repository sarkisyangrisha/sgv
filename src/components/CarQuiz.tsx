import React, { useState } from 'react';
import { CheckCircle2, Calculator, MessageSquare } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  multiSelect?: boolean;
}

const questions: Question[] = [
  {
    id: 1,
    text: "Какой тип автомобиля вас интересует?",
    options: ["Седан", "Кроссовер", "Минивэн", "Спорткар", "Хэтчбек", "Универсал"]
  },
  {
    id: 2,
    text: "Какой бюджет вы рассматриваете?",
    options: ["До 1 млн ₽", "1-2 млн ₽", "2-3 млн ₽", "3-4 млн ₽", "4-5 млн ₽", "Более 5 млн ₽"]
  },
  {
    id: 3,
    text: "Какой объем двигателя предпочтительнее?",
    options: ["До 1.5л", "1.5-2.0л", "2.0-2.5л", "2.5-3.0л", "Более 3.0л", "Не имеет значения"]
  },
  {
    id: 4,
    text: "Какой тип топлива вас интересует?",
    options: ["Бензин", "Дизель", "Гибрид", "Электро"]
  },
  {
    id: 5,
    text: "Какой привод предпочтительнее?",
    options: ["Передний", "Задний", "Полный", "Не имеет значения"]
  },
  {
    id: 6,
    text: "Как часто планируете использовать автомобиль?",
    options: ["Ежедневно в городе", "Для дальних поездок", "Для бизнеса", "Как второй автомобиль"]
  },
  {
    id: 7,
    text: "Какие опции обязательны?",
    options: ["Климат-контроль", "Кожаный салон", "Панорамная крыша", "Премиум аудио", "Автопилот", "Парктроники", "Камеры кругового обзора", "Подогрев сидений"],
    multiSelect: true
  }
];

interface CarSuggestion {
  name: string;
  description: string;
  features: string[];
}

const getCarSuggestions = (answers: (string | string[])[]): CarSuggestion[] => {
  const [type, budget, engine, fuel, drive, usage, options] = answers;
  
  // Логика подбора автомобилей на основе ответов
  if (type === "Седан") {
    if (budget === "До 1 млн ₽") {
      if (fuel === "Бензин") {
        return [
          {
            name: "Toyota Corolla",
            description: "Надежный седан с экономичным расходом топлива",
            features: ["Экономичный двигатель", "Надежность", "Доступное обслуживание"]
          },
          {
            name: "Hyundai Elantra",
            description: "Современный седан с богатым оснащением",
            features: ["Современный дизайн", "Богатая комплектация", "Гарантия 5 лет"]
          }
        ];
      }
    } else if (budget === "2-3 млн ₽") {
      if (drive === "Полный") {
        return [
          {
            name: "Toyota Camry",
            description: "Бизнес-седан с комфортным салоном",
            features: ["Просторный салон", "Премиальные материалы", "Мощный двигатель"]
          }
        ];
      }
    }
  } else if (type === "Кроссовер") {
    if (budget === "3-4 млн ₽") {
      if (drive === "Полный") {
        return [
          {
            name: "BMW X3",
            description: "Премиальный кроссовер с отличной управляемостью",
            features: ["Полный привод", "Премиум интерьер", "Спортивный характер"]
          },
          {
            name: "Mercedes-Benz GLC",
            description: "Роскошный кроссовер с передовыми технологиями",
            features: ["Комфортная подвеска", "Передовые системы безопасности", "Качественные материалы"]
          }
        ];
      }
    }
  }

  // Дефолтные предложения, если нет точных совпадений
  return [
    {
      name: "Toyota Camry",
      description: "Надежный бизнес-седан с отличным соотношением цена/качество",
      features: ["Комфорт", "Надежность", "Престиж"]
    },
    {
      name: "Kia K5",
      description: "Современный седан с прогрессивным дизайном",
      features: ["Стильный дизайн", "Богатое оснащение", "Гарантия"]
    }
  ];
};

export default function CarQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | string[])[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [suggestions, setSuggestions] = useState<CarSuggestion[]>([]);

  const handleAnswer = (answer: string) => {
    if (questions[currentQuestion].multiSelect) {
      const newSelectedOptions = selectedOptions.includes(answer)
        ? selectedOptions.filter(option => option !== answer)
        : [...selectedOptions, answer];
      setSelectedOptions(newSelectedOptions);
    } else {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = answer;
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        if (questions[currentQuestion + 1].multiSelect) {
          setSelectedOptions([]);
        }
      } else {
        setSuggestions(getCarSuggestions(newAnswers));
        setShowResult(true);
      }
    }
  };

  const handleNextWithMultiSelect = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedOptions;
    setAnswers(newAnswers);
    setSuggestions(getCarSuggestions(newAnswers));
    setShowResult(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOptions([]);
    setShowResult(false);
    setSuggestions([]);
  };

  if (showResult) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Мы подобрали для вас варианты!
          </h3>
          <div className="space-y-6 mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              На основе ваших ответов, мы рекомендуем рассмотреть следующие модели:
            </p>
            <div className="space-y-4">
              {suggestions.map((car, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-left">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {car.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {car.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((feature, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={resetQuiz}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Пройти тест заново
              </button>
              <button
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition flex items-center"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Получить консультацию менеджера
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Хотите узнать больше об этих моделях? Наш менеджер поможет выбрать оптимальный вариант и ответит на все вопросы.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isMultiSelect = questions[currentQuestion].multiSelect;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="w-6 h-6 text-red-500" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Подбор автомобиля
        </h3>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Вопрос {currentQuestion + 1} из {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {questions[currentQuestion].text}
        </h4>
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`w-full text-left px-4 py-3 rounded-lg border ${
                isMultiSelect && selectedOptions.includes(option)
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              } transition-colors text-gray-900 dark:text-white`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {isMultiSelect && (
        <button
          onClick={handleNextWithMultiSelect}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Продолжить
        </button>
      )}
    </div>
  );
}