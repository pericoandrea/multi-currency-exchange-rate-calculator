import axios from 'axios';

const API_KEY = '531a58795830bc1a232e9e39'; // Replace with your actual API key
const BASE_URL = 'https://api.exchangerate-api.com/v4/latest/';

export const fetchExchangeRates = async (baseCurrency: string) => {
  const response = await axios.get(`${BASE_URL}${baseCurrency}`);
  return response.data.rates;
};

export const fetchHistoricalRates = async (baseCurrency: string, targetCurrency: string, days: string) => {
  // Note: This is a mock implementation. You'll need to use a different API or endpoint for historical data
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const response = await axios.get(`${BASE_URL}${baseCurrency}`);
  const rate = response.data.rates[targetCurrency];

  // Generate mock historical data
  const historicalData = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    historicalData.push({
      date: d.toISOString().split('T')[0],
      rate: rate * (0.95 + Math.random() * 0.1) // Add some random variation
    });
  }

  return historicalData;
};