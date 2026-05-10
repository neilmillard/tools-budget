export const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;
const BASE_URL = 'https://financialmodelingprep.com/stable';

export const FREE_TICKERS = [
  'AAPL', 'TSLA', 'AMZN', 'MSFT', 'NVDA', 'GOOGL', 'META', 'NFLX', 'JPM', 'V', 
  'BAC', 'PYPL', 'DIS', 'T', 'PFE', 'COST', 'INTC', 'KO', 'TGT', 'NKE', 
  'SPY', 'BA', 'BABA', 'XOM', 'WMT', 'GE', 'CSCO', 'VZ', 'JNJ', 'CVX', 
  'PLTR', 'SQ', 'SHOP', 'SBUX', 'SOFI', 'HOOD', 'RBLX', 'SNAP', 'AMD', 'UBER', 
  'FDX', 'ABBV', 'ETSY', 'MRNA', 'LMT', 'GM', 'F', 'LCID', 'CCL', 'DAL', 
  'UAL', 'AAL', 'TSM', 'SONY', 'ET', 'MRO', 'COIN', 'RIVN', 'RIOT', 'CPRX', 
  'VWO', 'SPYG', 'NOK', 'ROKU', 'VIAC', 'ATVI', 'BIDU', 'DOCU', 'ZM', 'PINS', 
  'TLRY', 'WBA', 'MGM', 'NIO', 'C', 'GS', 'WFC', 'ADBE', 'PEP', 'UNH', 
  'CARR', 'HCA', 'TWTR', 'BILI', 'SIRI', 'FUBO', 'RKT'
];

export async function fetchFMP(endpoint: string, params: Record<string, string> = {}) {
  if (!FMP_API_KEY) {
    throw new Error('FMP API key is not configured');
  }
  const query = new URLSearchParams({ ...params, apikey: FMP_API_KEY }).toString();
  const url = `${BASE_URL}/${endpoint}?${query}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`FMP API error: ${response.statusText}`);
  }
  return response.json();
}

export interface FMPIncomeStatement {
  date: string;
  symbol: string;
  revenue: number;
  grossProfit: number;
  grossProfitRatio: number;
  operatingIncome: number;
  operatingIncomeRatio: number;
  netIncome: number;
  eps: number;
}

export interface FMPBalanceSheet {
  date: string;
  totalAssets: number;
  totalCurrentLiabilities: number;
  netDebt: number;
}

export interface FMPCashFlow {
  date: string;
  freeCashFlow: number;
  netIncome: number;
}

export interface FMPKeyMetrics {
  date: string;
  returnOnCapitalEmployed: number;
  freeCashFlowYield: number;
  netDebtToEBITDA: number;
}

export interface FMPFinancialGrowth {
  date: string;
  revenueGrowth: number;
  epsgrowth: number;
}

export interface FMPQuote {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
}

export interface FMPFilings {
  symbol: string;
  fillingDate: string;
  acceptedDate: string;
  type: string;
  finalLink: string;
}

export async function getCompanyData(symbol: string) {
  // In a real app, we'd want to parallelize these or use a single endpoint if possible
  // For MVP, we'll fetch what we need. 
  // We need 10 years for sparklines.
  const [income, balance, cashFlow, metrics, growth, quote, filings] = await Promise.all([
    fetchFMP(`income-statement`, { symbol, limit: '10' }),
    fetchFMP(`balance-sheet-statement`, { symbol, limit: '10' }),
    fetchFMP(`cash-flow-statement`, { symbol, limit: '10' }),
    fetchFMP(`key-metrics`, { symbol, limit: '10' }),
    fetchFMP(`financial-growth`, { symbol, limit: '10' }),
    fetchFMP(`quote`, { symbol }),
    fetchFMP(`sec_filings`, { symbol, limit: '5' })
  ]);

  return {
    income: income as FMPIncomeStatement[],
    balance: balance as FMPBalanceSheet[],
    cashFlow: cashFlow as FMPCashFlow[],
    metrics: metrics as FMPKeyMetrics[],
    growth: growth as FMPFinancialGrowth[],
    quote: (quote[0] || {}) as FMPQuote,
    filings: (filings || []) as FMPFilings[]
  };
}
