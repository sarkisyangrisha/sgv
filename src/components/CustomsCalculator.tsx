import React, { useState, useEffect } from 'react';
import { Calculator, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface ExchangeRates {
  [key: string]: number;
}

interface CountryInfo {
  currency: string;
  name: string;
  commission: number;
  sanctioned?: boolean;
  shippingCosts: {
    amount: number;
    currency: string;
  };
}

interface EngineType {
  id: string;
  label: string;
  sanctioned: boolean;
}

const ENGINE_TYPES: EngineType[] = [
  { id: 'petrol', label: 'бензиновый', sanctioned: false },
  { id: 'diesel', label: 'дизельный', sanctioned: false },
  { id: 'hybrid_petrol', label: 'бензиновый и электрический', sanctioned: true },
  { id: 'hybrid_diesel', label: 'дизельный и электрический', sanctioned: true },
  { id: 'electric', label: 'электрический', sanctioned: true }
];

const COUNTRIES: { [key: string]: CountryInfo } = {
  JP: { 
    currency: 'JPY',
    name: 'Япония',
    commission: 50000,
    sanctioned: false,
    shippingCosts: {
      amount: 200000,
      currency: 'JPY'
    }
  },
  JP_SANCTIONED: { 
    currency: 'JPY',
    name: 'Япония (санкционная)',
    commission: 100000,
    sanctioned: true,
    shippingCosts: {
      amount: 0,
      currency: 'USD'
    }
  },
  KR: { 
    currency: 'KRW',
    name: 'Корея',
    commission: 75000,
    shippingCosts: {
      amount: 2000000,
      currency: 'KRW'
    }
  },
  CN: { 
    currency: 'CNY',
    name: 'Китай',
    commission: 75000,
    shippingCosts: {
      amount: 17000,
      currency: 'CNY'
    }
  }
};

const SANCTIONED_JP_SHIPPING = [
  { priceRange: [0, 999999], fob: 800, freight: 1500 },
  { priceRange: [1000000, 1999999], fob: 900, freight: 1500 },
  { priceRange: [2000000, 2999999], fob: 1000, freight: 1500 },
  { priceRange: [3000000, 3999999], fob: 1100, freight: 1500 },
  { priceRange: [4000000, 4999999], fob: 1200, freight: 1500 },
  { priceRange: [5000000, 5999999], fob: 1300, freight: 1500 },
  { priceRange: [6000000, 6999999], fob: 1500, freight: 1500 },
  { priceRange: [7000000, 7999999], fob: 1600, freight: 1500 },
  { priceRange: [8000000, 8999999], fob: 1800, freight: 1500 },
  { priceRange: [9000000, 9999999], fob: 2000, freight: 1500 },
];

const BROKER_FEE = 100000;

interface CalculationResult {
  carCostRub: number;
  carCostOriginal: number;
  shippingCostRub: number;
  shippingCostOriginal: {
    amount: number;
    currency: string;
  };
  customsDuty: number;
  customsFee: number;
  brokerFee: number;
  commission: number;
  recyclingFee: number;
  commercialRecyclingFee: number;
  total: number;
  totalWithCommercial: number;
}

const getRecyclingFee = (engineVolume: number, age: 'new' | 'medium' | 'old', isPersonal: boolean = true): number => {
  if (engineVolume > 3000) {
    if (engineVolume <= 3500) {
      return age === 'new' ? 2153000 : 3297000;
    } else {
      return age === 'new' ? 2742000 : 3605000;
    }
  }

  if (isPersonal) {
    return age === 'new' ? 3400 : 5200;
  }

  if (engineVolume <= 1000) {
    return age === 'new' ? 180200 : 460000;
  } else if (engineVolume <= 2000) {
    return age === 'new' ? 667400 : 1174000;
  } else {
    return age === 'new' ? 1875000 : 2839000;
  }
};

export default function CustomsCalculator() {
  const [country, setCountry] = useState<string>('JP');
  const [price, setPrice] = useState<string>('');
  const [engineVolume, setEngineVolume] = useState<string>('');
  const [engineType, setEngineType] = useState<string>('petrol');
  const [carAge, setCarAge] = useState<'new' | 'medium' | 'old'>('new');
  const [rates, setRates] = useState<ExchangeRates>({});
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showSanctionedWarning, setShowSanctionedWarning] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get('https://www.cbr-xml-daily.ru/daily_json.js');
        const { EUR, JPY, KRW, CNY, USD } = response.data.Valute;
        setRates({
          EUR: EUR.Value,
          JPY: JPY.Value / JPY.Nominal,
          KRW: KRW.Value / KRW.Nominal,
          CNY: CNY.Value,
          USD: USD.Value
        });
      } catch (error) {
        console.error('Error fetching rates:', error);
      }
    };

    fetchRates();
  }, []);

  const calculateSanctionedJPShipping = (priceJPY: number): { fob: number; freight: number } => {
    const entry = SANCTIONED_JP_SHIPPING.find(
      ({ priceRange }) => priceJPY >= priceRange[0] && priceJPY <= priceRange[1]
    );

    if (entry) {
      return { fob: entry.fob + 300, freight: entry.freight };
    }

    const fob = (priceJPY * 0.03) + 300;
    return { fob, freight: 2500 };
  };

  const calculateShippingCost = (countryInfo: CountryInfo, priceInCurrency: number): { 
    costRub: number;
    originalCost: { amount: number; currency: string; }
  } => {
    if (countryInfo.sanctioned) {
      const { fob, freight } = calculateSanctionedJPShipping(priceInCurrency);
      const totalUSD = fob + freight;
      return {
        costRub: totalUSD * rates.USD,
        originalCost: { amount: totalUSD, currency: 'USD' }
      };
    }

    const { amount, currency } = countryInfo.shippingCosts;
    return {
      costRub: amount * rates[currency],
      originalCost: { amount, currency }
    };
  };

  const calculateCustomsDuty = (priceEur: number, volumeCc: number, age: 'new' | 'medium' | 'old'): number => {
    if (age === 'new') {
      if (priceEur <= 8500) {
        return Math.max(volumeCc * 2.5, priceEur * 0.54);
      } else if (priceEur <= 16700) {
        return Math.max(volumeCc * 3.5, priceEur * 0.48);
      } else if (priceEur <= 42300) {
        return Math.max(volumeCc * 5.5, priceEur * 0.48);
      } else if (priceEur <= 84500) {
        return Math.max(volumeCc * 7.5, priceEur * 0.48);
      } else if (priceEur <= 169000) {
        return Math.max(volumeCc * 15, priceEur * 0.48);
      } else {
        return Math.max(volumeCc * 20, priceEur * 0.48);
      }
    } else if (age === 'medium') {
      if (volumeCc <= 1000) {
        return volumeCc * 1.5;
      } else if (volumeCc <= 1500) {
        return volumeCc * 1.7;
      } else if (volumeCc <= 1800) {
        return volumeCc * 2.5;
      } else if (volumeCc <= 2300) {
        return volumeCc * 2.7;
      } else if (volumeCc <= 3000) {
        return volumeCc * 3;
      } else {
        return volumeCc * 3.6;
      }
    } else {
      if (volumeCc <= 1000) {
        return volumeCc * 3;
      } else if (volumeCc <= 1500) {
        return volumeCc * 3.2;
      } else if (volumeCc <= 1800) {
        return volumeCc * 3.5;
      } else if (volumeCc <= 2300) {
        return volumeCc * 4.8;
      } else if (volumeCc <= 3000) {
        return volumeCc * 5;
      } else {
        return volumeCc * 5.7;
      }
    }
  };

  const getCustomsFee = (customsValue: number): number => {
    if (customsValue <= 200000) return 775;
    if (customsValue <= 450000) return 1550;
    if (customsValue <= 1200000) return 3100;
    if (customsValue <= 2700000) return 8530;
    if (customsValue <= 4200000) return 12000;
    if (customsValue <= 5500000) return 15500;
    if (customsValue <= 7000000) return 20000;
    if (customsValue <= 8000000) return 23000;
    if (customsValue <= 9000000) return 25000;
    if (customsValue <= 10000000) return 27000;
    return 30000;
  };

  const calculateCustoms = () => {
    const priceNum = parseFloat(price);
    const volumeNum = parseFloat(engineVolume);
    
    if (!priceNum || !volumeNum || !rates.EUR) return;

    const carCostRub = priceNum * rates[COUNTRIES[country].currency];
    const carCostEur = carCostRub / rates.EUR;

    const shipping = calculateShippingCost(COUNTRIES[country], priceNum);

    const customsDutyEur = calculateCustomsDuty(carCostEur, volumeNum, carAge);
    const customsDutyRub = customsDutyEur * rates.EUR;

    const customsFee = getCustomsFee(carCostRub);

    const commission = COUNTRIES[country].commission;

    const recyclingFee = getRecyclingFee(volumeNum, carAge);
    const commercialRecyclingFee = getRecyclingFee(volumeNum, carAge, false);

    const total = carCostRub + shipping.costRub + customsDutyRub + customsFee + BROKER_FEE + commission + recyclingFee;
    const totalWithCommercial = carCostRub + shipping.costRub + customsDutyRub + customsFee + BROKER_FEE + commission + commercialRecyclingFee;

    setResult({
      carCostRub,
      carCostOriginal: priceNum,
      shippingCostRub: shipping.costRub,
      shippingCostOriginal: shipping.originalCost,
      customsDuty: customsDutyRub,
      customsFee,
      brokerFee: BROKER_FEE,
      commission,
      recyclingFee,
      commercialRecyclingFee,
      total,
      totalWithCommercial
    });
  };

  const checkSanctioned = (volume: number, type: string) => {
    const selectedEngineType = ENGINE_TYPES.find(t => t.id === type);
    
    if (country === 'JP') {
      if (volume > 1900 || (selectedEngineType && selectedEngineType.sanctioned)) {
        setCountry('JP_SANCTIONED');
        setShowSanctionedWarning(true);
        return true;
      }
    } else if (country === 'JP_SANCTIONED') {
      if (volume <= 1900 && (!selectedEngineType || !selectedEngineType.sanctioned)) {
        setCountry('JP');
        setShowSanctionedWarning(false);
        return false;
      }
    }
    return false;
  };

  const handleEngineVolumeChange = ( value: string) => {
    setEngineVolume(value);
    const volume = parseFloat(value);
    if (!isNaN(volume)) {
      checkSanctioned(volume, engineType);
    }
  };

  const handleEngineTypeChange = (value: string) => {
    setEngineType(value);
    const volume = parseFloat(engineVolume);
    if (!isNaN(volume)) {
      checkSanctioned(volume, value);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      setPrice(value);
    }
  };

  const scrollToContactForm = () => {
    const contactForm = document.getElementById('contact');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="w-6 h-6 text-red-500" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Калькулятор стоимости автомобиля
        </h3>
      </div>

      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          Расчет является приблизительным и основан на текущем курсе ЦБ РФ. 
          Для получения точной стоимости и актуальных условий доставки, пожалуйста, 
          свяжитесь с нашими менеджерами.
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Страна
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {Object.entries(COUNTRIES).map(([code, info]) => (
              <option key={code} value={code}>{info.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Стоимость автомобиля ({COUNTRIES[country].currency})
          </label>
          <input
            type="number"
            value={price}
            onChange={handlePriceChange}
            min="0"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Введите стоимость"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Тип двигателя
          </label>
          <div className="space-y-2">
            {ENGINE_TYPES.map((type) => (
              <label key={type.id} className="flex items-center">
                <input
                  type="radio"
                  name="engineType"
                  value={type.id}
                  checked={engineType === type.id}
                  onChange={(e) => handleEngineTypeChange(e.target.value)}
                  className="form-radio h-4 w-4 text-red-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Объем двигателя (куб. см)
          </label>
          <input
            type="number"
            value={engineVolume}
            onChange={(e) => handleEngineVolumeChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Например: 2000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Возраст автомобиля
          </label>
          <select
            value={carAge}
            onChange={(e) => setCarAge(e.target.value as typeof carAge)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="new">Младше 3 лет</option>
            <option value="medium">3-5 лет</option>
            <option value="old">Старше 5 лет</option>
          </select>
        </div>

        <button
          onClick={calculateCustoms}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Рассчитать
        </button>

        {showSanctionedWarning && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-700 dark:text-yellow-300">
              Данный автомобиль попадает под санкционные ограничения. 
              Расчёт будет произведён по тарифам для санкционных автомобилей.
            </div>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Расчет полной стоимости:
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600 dark:text-gray-300">Стоимость автомобиля:</span>
                <span className="font-medium text-gray-900 dark:text-white text-right">
                  {result.carCostOriginal.toLocaleString()} {COUNTRIES[country].currency} ({result.carCostRub.toLocaleString()} ₽)
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600 dark:text-gray-300">Стоимость доставки (приблизительная):</span>
                <span className="font-medium text-gray-900 dark:text-white text-right">
                  {result.shippingCostOriginal.amount.toLocaleString()} {result.shippingCostOriginal.currency} ({result.shippingCostRub.toLocaleString()} ₽)
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600 dark:text-gray-300">Таможенная пошлина:</span>
                <span className="font-medium text-gray-900 dark:text-white text-right">
                  {result.customsDuty.toLocaleString()} ₽
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600 dark:text-gray-300">Утилизационный сбор:</span>
                <span className="font-medium text-gray-900 dark:text-white text-right">
                  {result.recyclingFee.toLocaleString()} ₽
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600 dark:text-gray-300">Таможенный сбор:</span>
                <span className="font-medium text-gray-900 dark:text-white text-right">
                  {result.customsFee.toLocaleString()} ₽
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600 dark:text-gray-300">
                  Брокерские услуги (приблизительная):
                </span>
                <span className="font-medium text-gray-900 dark:text-white text-right">
                  {result.brokerFee.toLocaleString()} ₽
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600 dark:text-gray-300">Комиссия компании:</span>
                <span className="font-medium text-gray-900 dark:text-white text-right">
                  {result.commission.toLocaleString()} ₽
                </span>
              </div>
              <div className="flex justify-between items-baseline text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 p-2 rounded">
                <span>Утилизационный сбор (перепродажа):</span>
                <span className="font-medium text-right">
                  {result.commercialRecyclingFee.toLocaleString()} ₽
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-baseline font-semibold">
                  <span className="text-gray-900 dark:text-white">Итого с утилизационным сбором:</span>
                  <span className="text-red-500 text-right">
                    {result.total.toLocaleString()} ₽
                  </span>
                </div>
                <div className="flex justify-between items-baseline font-semibold text-gray-500 dark:text-gray-400">
                  <span>Итого с утилизационным сбором (перепродажа):</span>
                  <span className="text-right">
                    {result.totalWithCommercial.toLocaleString()} ₽
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={scrollToContactForm}
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Получить точный расчет у менеджера
            </button>
          </div>
        )}
      </div>
    </div>
  );
}