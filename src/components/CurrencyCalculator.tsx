import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRightLeft, Calendar } from 'lucide-react';
import { fetchExchangeRates, fetchHistoricalRates } from '../api/exchangeRates';
import { useCurrencyStore } from '../store/currencyStore';

const CurrencyCalculator: React.FC = () => {
  const { baseCurrency, targetCurrency1, targetCurrency2, setBaseCurrency, setTargetCurrency1, setTargetCurrency2, timeRange, setTimeRange } = useCurrencyStore();

  const [baseAmount, setBaseAmount] = useState<string>('1');
  const [targetAmount1, setTargetAmount1] = useState<string>('');
  const [targetAmount2, setTargetAmount2] = useState<string>('');

  const { data: currentRates, isLoading: isLoadingCurrent } = useQuery(['currentRates', baseCurrency], () => fetchExchangeRates(baseCurrency));
  const { data: historicalRates1, isLoading: isLoadingHistorical1 } = useQuery(['historicalRates', baseCurrency, targetCurrency1, timeRange], () => fetchHistoricalRates(baseCurrency, targetCurrency1, timeRange));
  const { data: historicalRates2, isLoading: isLoadingHistorical2 } = useQuery(['historicalRates', baseCurrency, targetCurrency2, timeRange], () => fetchHistoricalRates(baseCurrency, targetCurrency2, timeRange));

  useEffect(() => {
    if (currentRates) {
      const rate1 = currentRates[targetCurrency1];
      const rate2 = currentRates[targetCurrency2];
      setTargetAmount1((parseFloat(baseAmount) * rate1).toFixed(2));
      setTargetAmount2((parseFloat(baseAmount) * rate2).toFixed(2));
    }
  }, [baseAmount, currentRates, targetCurrency1, targetCurrency2]);

  const handleAmountChange = (amount: string, currency: 'base' | 'target1' | 'target2') => {
    if (currentRates) {
      const rate1 = currentRates[targetCurrency1];
      const rate2 = currentRates[targetCurrency2];

      switch (currency) {
        case 'base':
          setBaseAmount(amount);
          setTargetAmount1((parseFloat(amount) * rate1).toFixed(2));
          setTargetAmount2((parseFloat(amount) * rate2).toFixed(2));
          break;
        case 'target1':
          setTargetAmount1(amount);
          setBaseAmount((parseFloat(amount) / rate1).toFixed(2));
          setTargetAmount2(((parseFloat(amount) / rate1) * rate2).toFixed(2));
          break;
        case 'target2':
          setTargetAmount2(amount);
          setBaseAmount((parseFloat(amount) / rate2).toFixed(2));
          setTargetAmount1(((parseFloat(amount) / rate2) * rate1).toFixed(2));
          break;
      }
    }
  };

  const handleBaseCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBaseCurrency(e.target.value);
  };

  const handleTargetCurrency1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetCurrency1(e.target.value);
  };

  const handleTargetCurrency2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetCurrency2(e.target.value);
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  };

  if (isLoadingCurrent || isLoadingHistorical1 || isLoadingHistorical2) {
    return <div className="text-center">Loading...</div>;
  }

  const combinedHistoricalRates = historicalRates1?.map((item, index) => ({
    date: item.date,
    [targetCurrency1]: item.rate,
    [targetCurrency2]: historicalRates2[index].rate,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
      <h1 className="text-2xl font-bold mb-4">Currency Exchange Calculator</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Base Currency</label>
          <div className="flex">
            <select
              value={baseCurrency}
              onChange={handleBaseCurrencyChange}
              className="w-1/3 p-2 border rounded-l"
            >
              {Object.keys(currentRates || {}).map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <input
              type="number"
              value={baseAmount}
              onChange={(e) => handleAmountChange(e.target.value, 'base')}
              className="w-2/3 p-2 border rounded-r"
              placeholder="Enter amount"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Currency 1</label>
          <div className="flex">
            <select
              value={targetCurrency1}
              onChange={handleTargetCurrency1Change}
              className="w-1/3 p-2 border rounded-l"
            >
              {Object.keys(currentRates || {}).map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <input
              type="number"
              value={targetAmount1}
              onChange={(e) => handleAmountChange(e.target.value, 'target1')}
              className="w-2/3 p-2 border rounded-r"
              placeholder="Converted amount"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Currency 2</label>
          <div className="flex">
            <select
              value={targetCurrency2}
              onChange={handleTargetCurrency2Change}
              className="w-1/3 p-2 border rounded-l"
            >
              {Object.keys(currentRates || {}).map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <input
              type="number"
              value={targetAmount2}
              onChange={(e) => handleAmountChange(e.target.value, 'target2')}
              className="w-2/3 p-2 border rounded-r"
              placeholder="Converted amount"
            />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
        <div className="flex items-center">
          <Calendar className="mr-2 text-gray-500" />
          <select
            value={timeRange}
            onChange={handleTimeRangeChange}
            className="p-2 border rounded"
          >
            <option value="30">30 days</option>
            <option value="180">6 months</option>
            <option value="365">1 year</option>
          </select>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedHistoricalRates}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={targetCurrency1} stroke="#8884d8" name={targetCurrency1} />
            <Line type="monotone" dataKey={targetCurrency2} stroke="#82ca9d" name={targetCurrency2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CurrencyCalculator;