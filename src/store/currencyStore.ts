import create from 'zustand';

interface CurrencyState {
  baseCurrency: string;
  targetCurrency1: string;
  targetCurrency2: string;
  timeRange: string;
  setBaseCurrency: (currency: string) => void;
  setTargetCurrency1: (currency: string) => void;
  setTargetCurrency2: (currency: string) => void;
  setTimeRange: (range: string) => void;
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  baseCurrency: 'USD',
  targetCurrency1: 'EUR',
  targetCurrency2: 'GBP',
  timeRange: '30',
  setBaseCurrency: (currency) => set({ baseCurrency: currency }),
  setTargetCurrency1: (currency) => set({ targetCurrency1: currency }),
  setTargetCurrency2: (currency) => set({ targetCurrency2: currency }),
  setTimeRange: (range) => set({ timeRange: range }),
}));