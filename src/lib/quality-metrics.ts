import { getCompanyData } from './fmp';

export interface CompanyMetrics {
  symbol: string;
  name: string;
  roceHistory: number[];
  grossMarginHistory: number[];
  operatingMarginHistory: number[];
  fcfHistory: number[];
  fcfGrowth5yr: number;
  fcfYield: number;
  cashConversion: number;
  netDebtToEbitda: number;
  revenueGrowth5yr: number;
  epsGrowth5yr: number;
  marketCap: number;
  score: number;
  roceAvg10yr: number;
  grossMarginLatest: number;
  operatingMarginLatest: number;
  filingLink?: string;
  isMock?: boolean;
  lastUpdated?: string;
  passes: {
    roce: boolean;
    fcfGrowth: boolean;
    grossMargin: boolean;
    cashConversion: boolean;
    netDebtToEbitda: boolean;
    operatingMargin: boolean;
  };
  hardFloorFail: boolean;
}

export const DEFAULT_THRESHOLDS = {
  roce: 0.15,
  fcfGrowth: 0.05,
  grossMargin: 0.40,
  cashConversion: 0.80,
  netDebtToEbitda: 2.0,
  operatingMargin: 0.15,
};

export const WEIGHTS = {
  roce: 0.25,
  fcfGrowth: 0.20,
  grossMargin: 0.15,
  cashConversion: 0.15,
  netDebtToEbitda: 0.15,
  operatingMargin: 0.10,
};

function calculateCAGR(values: number[], years: number) {
  if (values.length < years + 1) return 0;
  const latest = values[0];
  const oldest = values[years];
  if (oldest <= 0) return 0;
  return Math.pow(latest / oldest, 1 / years) - 1;
}

function calculateAverage(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function calculateScore(company: Partial<CompanyMetrics>, thresholds = DEFAULT_THRESHOLDS) {
  const passes = {
    roce: (company.roceAvg10yr || 0) >= thresholds.roce,
    fcfGrowth: (company.fcfGrowth5yr || 0) >= thresholds.fcfGrowth,
    grossMargin: (company.grossMarginLatest || 0) >= thresholds.grossMargin,
    cashConversion: (company.cashConversion || 0) >= thresholds.cashConversion,
    netDebtToEbitda: (company.netDebtToEbitda || 0) <= thresholds.netDebtToEbitda,
    operatingMargin: (company.operatingMarginLatest || 0) >= thresholds.operatingMargin,
  };

  let score = 0;
  if (passes.roce) score += WEIGHTS.roce * 100;
  if (passes.fcfGrowth) score += WEIGHTS.fcfGrowth * 100;
  if (passes.grossMargin) score += WEIGHTS.grossMargin * 100;
  if (passes.cashConversion) score += WEIGHTS.cashConversion * 100;
  if (passes.netDebtToEbitda) score += WEIGHTS.netDebtToEbitda * 100;
  if (passes.operatingMargin) score += WEIGHTS.operatingMargin * 100;

  const hardFloorFail = (company.roceAvg10yr || 0) < thresholds.roce || (company.cashConversion || 0) < thresholds.cashConversion;

  return { score, passes, hardFloorFail };
}

export async function processCompanyData(symbol: string, thresholds = DEFAULT_THRESHOLDS): Promise<CompanyMetrics> {
  const data = await getCompanyData(symbol);
  
  const roceHistory = data.metrics.map(m => m.returnOnCapitalEmployed);
  const grossMarginHistory = data.income.map(i => i.grossProfitRatio);
  const operatingMarginHistory = data.income.map(i => i.operatingIncomeRatio);
  const fcfHistory = data.cashFlow.map(c => c.freeCashFlow);
  
  const roceAvg10yr = calculateAverage(roceHistory);
  const fcfGrowth5yr = calculateCAGR(fcfHistory, 5);
  const grossMarginLatest = grossMarginHistory[0] || 0;
  const operatingMarginLatest = operatingMarginHistory[0] || 0;
  
  // Cash conversion = FCF / Net Income
  const latestCashFlow = data.cashFlow[0];
  const cashConversion = latestCashFlow ? latestCashFlow.freeCashFlow / latestCashFlow.netIncome : 0;
  
  const netDebtToEbitda = data.metrics[0]?.netDebtToEBITDA || 0;
  const fcfYield = data.metrics[0]?.freeCashFlowYield || 0;
  
  const revenueGrowth5yr = calculateCAGR(data.income.map(i => i.revenue), 5);
  const epsGrowth5yr = calculateCAGR(data.income.map(i => i.eps), 5);

  const latestAnnualReport = data.filings.find(f => f.type === '10-K' || f.type === '20-F');
  const filingLink = latestAnnualReport?.finalLink;

  const { score, passes, hardFloorFail } = calculateScore({
    roceAvg10yr,
    fcfGrowth5yr,
    grossMarginLatest,
    cashConversion,
    netDebtToEbitda,
    operatingMarginLatest
  }, thresholds);

  return {
    symbol,
    name: data.quote.name || symbol,
    roceHistory,
    grossMarginHistory,
    operatingMarginHistory,
    fcfHistory,
    roceAvg10yr,
    fcfGrowth5yr,
    grossMarginLatest,
    operatingMarginLatest,
    fcfYield,
    cashConversion,
    netDebtToEbitda,
    revenueGrowth5yr,
    epsGrowth5yr,
    marketCap: data.quote.marketCap,
    score,
    filingLink,
    passes,
    hardFloorFail,
    isMock: false,
    lastUpdated: new Date().toISOString()
  };
}

export const MOCK_COMPANIES: CompanyMetrics[] = [
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    roceHistory: [0.25, 0.24, 0.23, 0.22, 0.21, 0.2, 0.19, 0.18, 0.17, 0.16],
    grossMarginHistory: [0.56, 0.55, 0.54, 0.53, 0.52, 0.51, 0.5, 0.5, 0.5, 0.5],
    operatingMarginHistory: [0.3, 0.28, 0.27, 0.26, 0.25, 0.24, 0.23, 0.22, 0.21, 0.2],
    fcfHistory: [60000, 55000, 50000, 45000, 40000, 35000],
    roceAvg10yr: 0.205,
    fcfGrowth5yr: 0.084,
    grossMarginLatest: 0.56,
    operatingMarginLatest: 0.3,
    fcfYield: 0.04,
    cashConversion: 0.95,
    netDebtToEbitda: -0.8,
    revenueGrowth5yr: 0.18,
    epsGrowth5yr: 0.2,
    marketCap: 1800000000000,
    score: 100,
    passes: { roce: true, fcfGrowth: true, grossMargin: true, cashConversion: true, netDebtToEbitda: true, operatingMargin: true },
    hardFloorFail: false,
    isMock: true
  },
  {
    symbol: 'V',
    name: 'Visa Inc.',
    roceHistory: [0.35, 0.34, 0.33, 0.32, 0.31, 0.3, 0.29, 0.28, 0.27, 0.26],
    grossMarginHistory: [0.8, 0.79, 0.78, 0.77, 0.76, 0.75, 0.75, 0.75, 0.75, 0.75],
    operatingMarginHistory: [0.52, 0.51, 0.5, 0.49, 0.48, 0.47, 0.46, 0.45, 0.44, 0.43],
    fcfHistory: [18000, 17000, 16000, 15000, 14000, 13000],
    roceAvg10yr: 0.305,
    fcfGrowth5yr: 0.067,
    grossMarginLatest: 0.8,
    operatingMarginLatest: 0.52,
    fcfYield: 0.035,
    cashConversion: 1.02,
    netDebtToEbitda: 0.6,
    revenueGrowth5yr: 0.1,
    epsGrowth5yr: 0.12,
    marketCap: 500000000000,
    score: 100,
    passes: { roce: true, fcfGrowth: true, grossMargin: true, cashConversion: true, netDebtToEbitda: true, operatingMargin: true },
    hardFloorFail: false,
    isMock: true
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    roceHistory: [0.28, 0.26, 0.24, 0.22, 0.2, 0.18, 0.17, 0.16, 0.15, 0.14],
    grossMarginHistory: [0.81, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
    operatingMarginHistory: [0.35, 0.33, 0.31, 0.29, 0.27, 0.25, 0.23, 0.21, 0.19, 0.17],
    fcfHistory: [40000, 38000, 35000, 30000, 25000, 20000],
    roceAvg10yr: 0.2,
    fcfGrowth5yr: 0.148,
    grossMarginLatest: 0.81,
    operatingMarginLatest: 0.35,
    fcfYield: 0.045,
    cashConversion: 0.9,
    netDebtToEbitda: -0.4,
    revenueGrowth5yr: 0.2,
    epsGrowth5yr: 0.22,
    marketCap: 1200000000000,
    score: 100,
    passes: { roce: true, fcfGrowth: true, grossMargin: true, cashConversion: true, netDebtToEbitda: true, operatingMargin: true },
    hardFloorFail: false,
    isMock: true
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    roceHistory: [0.3, 0.28, 0.25, 0.24, 0.22, 0.21, 0.2, 0.19, 0.18, 0.17],
    grossMarginHistory: [0.68, 0.69, 0.68, 0.67, 0.66, 0.65, 0.64, 0.64, 0.64, 0.64],
    operatingMarginHistory: [0.42, 0.41, 0.4, 0.39, 0.38, 0.37, 0.36, 0.35, 0.34, 0.33],
    fcfHistory: [63000, 60000, 56000, 50000, 45000, 40000],
    roceAvg10yr: 0.222,
    fcfGrowth5yr: 0.095,
    grossMarginLatest: 0.68,
    operatingMarginLatest: 0.42,
    fcfYield: 0.025,
    cashConversion: 1.05,
    netDebtToEbitda: -0.5,
    revenueGrowth5yr: 0.14,
    epsGrowth5yr: 0.16,
    marketCap: 3000000000000,
    score: 100,
    passes: { roce: true, fcfGrowth: true, grossMargin: true, cashConversion: true, netDebtToEbitda: true, operatingMargin: true },
    hardFloorFail: false,
    isMock: true
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    roceHistory: [0.5, 0.45, 0.4, 0.35, 0.3, 0.28, 0.25, 0.24, 0.23, 0.22],
    grossMarginHistory: [0.44, 0.43, 0.42, 0.4, 0.39, 0.38, 0.38, 0.38, 0.38, 0.38],
    operatingMarginHistory: [0.3, 0.29, 0.28, 0.27, 0.26, 0.25, 0.24, 0.24, 0.24, 0.24],
    fcfHistory: [100000, 95000, 90000, 80000, 75000, 70000],
    roceAvg10yr: 0.322,
    fcfGrowth5yr: 0.073,
    grossMarginLatest: 0.44,
    operatingMarginLatest: 0.3,
    fcfYield: 0.035,
    cashConversion: 1.1,
    netDebtToEbitda: 0.2,
    revenueGrowth5yr: 0.08,
    epsGrowth5yr: 0.1,
    marketCap: 2800000000000,
    score: 100,
    passes: { roce: true, fcfGrowth: true, grossMargin: true, cashConversion: true, netDebtToEbitda: true, operatingMargin: true },
    hardFloorFail: false,
    isMock: true
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    roceHistory: [0.12, 0.11, 0.1, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03],
    grossMarginHistory: [0.45, 0.44, 0.43, 0.42, 0.41, 0.4, 0.4, 0.4, 0.4, 0.4],
    operatingMarginHistory: [0.06, 0.05, 0.04, 0.03, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02],
    fcfHistory: [30000, 25000, 20000, 15000, 10000, 5000],
    roceAvg10yr: 0.075,
    fcfGrowth5yr: 0.43,
    grossMarginLatest: 0.45,
    operatingMarginLatest: 0.06,
    fcfYield: 0.02,
    cashConversion: 0.85,
    netDebtToEbitda: 1.2,
    revenueGrowth5yr: 0.25,
    epsGrowth5yr: 0.3,
    marketCap: 1800000000000,
    score: 65,
    passes: { roce: false, fcfGrowth: true, grossMargin: true, cashConversion: true, netDebtToEbitda: true, operatingMargin: false },
    hardFloorFail: true,
    isMock: true
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    roceHistory: [0.45, 0.35, 0.25, 0.2, 0.18, 0.16, 0.14, 0.12, 0.1, 0.08],
    grossMarginHistory: [0.7, 0.65, 0.6, 0.58, 0.56, 0.55, 0.55, 0.55, 0.55, 0.55],
    operatingMarginHistory: [0.4, 0.3, 0.25, 0.22, 0.2, 0.18, 0.16, 0.14, 0.12, 0.1],
    fcfHistory: [25000, 15000, 10000, 8000, 6000, 4000],
    roceAvg10yr: 0.203,
    fcfGrowth5yr: 0.44,
    grossMarginLatest: 0.7,
    operatingMarginLatest: 0.4,
    fcfYield: 0.015,
    cashConversion: 0.98,
    netDebtToEbitda: -0.5,
    revenueGrowth5yr: 0.4,
    epsGrowth5yr: 0.5,
    marketCap: 2200000000000,
    score: 100,
    passes: { roce: true, fcfGrowth: true, grossMargin: true, cashConversion: true, netDebtToEbitda: true, operatingMargin: true },
    hardFloorFail: false,
    isMock: true
  },
  {
    symbol: 'PEP',
    name: 'PepsiCo, Inc.',
    roceHistory: [0.22, 0.21, 0.2, 0.19, 0.18, 0.17, 0.16, 0.15, 0.14, 0.13],
    grossMarginHistory: [0.54, 0.54, 0.53, 0.53, 0.53, 0.52, 0.52, 0.52, 0.52, 0.52],
    operatingMarginHistory: [0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14],
    fcfHistory: [8000, 7500, 7000, 6500, 6000, 5500],
    roceAvg10yr: 0.175,
    fcfGrowth5yr: 0.078,
    grossMarginLatest: 0.54,
    operatingMarginLatest: 0.14,
    fcfYield: 0.035,
    cashConversion: 0.82,
    netDebtToEbitda: 2.1,
    revenueGrowth5yr: 0.06,
    epsGrowth5yr: 0.07,
    marketCap: 230000000000,
    score: 75,
    passes: { roce: true, fcfGrowth: true, grossMargin: true, cashConversion: true, netDebtToEbitda: false, operatingMargin: false },
    hardFloorFail: false,
    isMock: true
  },
  {
    symbol: 'KO',
    name: 'The Coca-Cola Company',
    roceHistory: [0.18, 0.17, 0.16, 0.15, 0.14, 0.13, 0.12, 0.11, 0.1, 0.09],
    grossMarginHistory: [0.6, 0.6, 0.59, 0.59, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58],
    operatingMarginHistory: [0.28, 0.27, 0.26, 0.25, 0.24, 0.23, 0.22, 0.21, 0.2, 0.19],
    fcfHistory: [9500, 9000, 8500, 8000, 7500, 7000],
    roceAvg10yr: 0.135,
    fcfGrowth5yr: 0.063,
    grossMarginLatest: 0.6,
    operatingMarginLatest: 0.28,
    fcfYield: 0.038,
    cashConversion: 0.9,
    netDebtToEbitda: 1.8,
    revenueGrowth5yr: 0.05,
    epsGrowth5yr: 0.06,
    marketCap: 260000000000,
    score: 75,
    passes: { roce: false, fcfGrowth: true, grossMargin: true, cashConversion: true, netDebtToEbitda: true, operatingMargin: true },
    hardFloorFail: true,
    isMock: true
  },
  {
    symbol: 'NKE',
    name: 'NIKE, Inc.',
    roceHistory: [0.25, 0.24, 0.23, 0.22, 0.21, 0.2, 0.19, 0.18, 0.17, 0.16],
    grossMarginHistory: [0.44, 0.44, 0.43, 0.43, 0.43, 0.42, 0.42, 0.42, 0.42, 0.42],
    operatingMarginHistory: [0.12, 0.12, 0.11, 0.11, 0.11, 0.1, 0.1, 0.1, 0.1, 0.1],
    fcfHistory: [5000, 4800, 4500, 4200, 4000, 3800],
    roceAvg10yr: 0.205,
    fcfGrowth5yr: 0.056,
    grossMarginLatest: 0.44,
    operatingMarginLatest: 0.12,
    fcfYield: 0.03,
    cashConversion: 0.85,
    netDebtToEbitda: 0.8,
    revenueGrowth5yr: 0.08,
    epsGrowth5yr: 0.09,
    marketCap: 150000000000,
    score: 80,
    passes: { roce: true, fcfGrowth: true, grossMargin: true, cashConversion: true, netDebtToEbitda: true, operatingMargin: false },
    hardFloorFail: false,
    isMock: true
  },
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    roceHistory: [0.2, 0.19, 0.18, 0.17, 0.16, 0.15, 0.14, 0.13, 0.12, 0.11],
    grossMarginHistory: [0.68, 0.67, 0.67, 0.66, 0.66, 0.65, 0.65, 0.65, 0.65, 0.65],
    operatingMarginHistory: [0.25, 0.24, 0.24, 0.23, 0.23, 0.22, 0.22, 0.22, 0.22, 0.22],
    fcfHistory: [15000, 14500, 14000, 13500, 13000, 12500],
    roceAvg10yr: 0.155,
    fcfGrowth5yr: 0.037,
    grossMarginLatest: 0.68,
    operatingMarginLatest: 0.25,
    fcfYield: 0.045,
    cashConversion: 0.88,
    netDebtToEbitda: 0.5,
    revenueGrowth5yr: 0.04,
    epsGrowth5yr: 0.05,
    marketCap: 380000000000,
    score: 80,
    passes: { roce: true, fcfGrowth: false, grossMargin: true, cashConversion: true, netDebtToEbitda: true, operatingMargin: true },
    hardFloorFail: false,
    isMock: true
  },
  {
    symbol: 'COST',
    name: 'Costco Wholesale Corporation',
    roceHistory: [0.2, 0.19, 0.18, 0.17, 0.16, 0.15, 0.14, 0.13, 0.12, 0.11],
    grossMarginHistory: [0.12, 0.12, 0.12, 0.12, 0.12, 0.12, 0.12, 0.12, 0.12, 0.12],
    operatingMarginHistory: [0.035, 0.035, 0.034, 0.034, 0.033, 0.033, 0.032, 0.032, 0.031, 0.031],
    fcfHistory: [7000, 6500, 6000, 5500, 5000, 4500],
    roceAvg10yr: 0.155,
    fcfGrowth5yr: 0.092,
    grossMarginLatest: 0.12,
    operatingMarginLatest: 0.035,
    fcfYield: 0.02,
    cashConversion: 0.92,
    netDebtToEbitda: -0.4,
    revenueGrowth5yr: 0.12,
    epsGrowth5yr: 0.14,
    marketCap: 320000000000,
    score: 70,
    passes: { roce: true, fcfGrowth: true, grossMargin: false, cashConversion: true, netDebtToEbitda: true, operatingMargin: false },
    hardFloorFail: false,
    isMock: true
  },
  {
    symbol: 'UNH',
    name: 'UnitedHealth Group Incorporated',
    roceHistory: [0.2, 0.19, 0.18, 0.17, 0.16, 0.15, 0.14, 0.13, 0.12, 0.11],
    grossMarginHistory: [0.24, 0.24, 0.23, 0.23, 0.23, 0.22, 0.22, 0.22, 0.22, 0.22],
    operatingMarginHistory: [0.09, 0.09, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08],
    fcfHistory: [25000, 22000, 20000, 18000, 16000, 14000],
    roceAvg10yr: 0.155,
    fcfGrowth5yr: 0.123,
    grossMarginLatest: 0.24,
    operatingMarginLatest: 0.09,
    fcfYield: 0.048,
    cashConversion: 1.15,
    netDebtToEbitda: 1.1,
    revenueGrowth5yr: 0.11,
    epsGrowth5yr: 0.13,
    marketCap: 450000000000,
    score: 65,
    passes: { roce: true, fcfGrowth: true, grossMargin: false, cashConversion: true, netDebtToEbitda: true, operatingMargin: false },
    hardFloorFail: false,
    isMock: true
  },
  {
    symbol: 'WMT',
    name: 'Walmart Inc.',
    roceHistory: [0.12, 0.12, 0.11, 0.11, 0.11, 0.1, 0.1, 0.1, 0.1, 0.1],
    grossMarginHistory: [0.25, 0.25, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24, 0.24],
    operatingMarginHistory: [0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04],
    fcfHistory: [15000, 14000, 13000, 12000, 11000, 10000],
    roceAvg10yr: 0.106,
    fcfGrowth5yr: 0.084,
    grossMarginLatest: 0.25,
    operatingMarginLatest: 0.04,
    fcfYield: 0.035,
    cashConversion: 0.85,
    netDebtToEbitda: 1.4,
    revenueGrowth5yr: 0.05,
    epsGrowth5yr: 0.06,
    marketCap: 480000000000,
    score: 50,
    passes: { roce: false, fcfGrowth: true, grossMargin: false, cashConversion: true, netDebtToEbitda: true, operatingMargin: false },
    hardFloorFail: true,
    isMock: true
  },
  {
    symbol: 'ADBE',
    name: 'Adobe Inc.',
    roceHistory: [0.25, 0.24, 0.23, 0.22, 0.21, 0.2, 0.19, 0.18, 0.17, 0.16],
    grossMarginHistory: [0.88, 0.88, 0.87, 0.87, 0.87, 0.87, 0.87, 0.87, 0.87, 0.87],
    operatingMarginHistory: [0.34, 0.34, 0.33, 0.33, 0.33, 0.32, 0.32, 0.32, 0.32, 0.32],
    fcfHistory: [7500, 7000, 6500, 6000, 5500, 5000],
    roceAvg10yr: 0.205,
    fcfGrowth5yr: 0.084,
    grossMarginLatest: 0.88,
    operatingMarginLatest: 0.34,
    fcfYield: 0.03,
    cashConversion: 1.05,
    netDebtToEbitda: -0.2,
    revenueGrowth5yr: 0.15,
    epsGrowth5yr: 0.18,
    marketCap: 230000000000,
    score: 100,
    passes: { roce: true, fcfGrowth: true, grossMargin: true, cashConversion: true, netDebtToEbitda: true, operatingMargin: true },
    hardFloorFail: false,
    isMock: true
  },
  {
    symbol: 'TSM',
    name: 'Taiwan Semiconductor Manufacturing Company Limited',
    roceHistory: [0.28, 0.27, 0.26, 0.25, 0.24, 0.23, 0.22, 0.21, 0.2, 0.19],
    grossMarginHistory: [0.55, 0.54, 0.53, 0.52, 0.51, 0.5, 0.5, 0.5, 0.5, 0.5],
    operatingMarginHistory: [0.42, 0.41, 0.4, 0.39, 0.38, 0.37, 0.36, 0.35, 0.34, 0.33],
    fcfHistory: [20000, 18000, 16000, 14000, 12000, 10000],
    roceAvg10yr: 0.235,
    fcfGrowth5yr: 0.148,
    grossMarginLatest: 0.55,
    operatingMarginLatest: 0.42,
    fcfYield: 0.035,
    cashConversion: 0.75,
    netDebtToEbitda: -0.3,
    revenueGrowth5yr: 0.18,
    epsGrowth5yr: 0.2,
    marketCap: 700000000000,
    score: 85,
    passes: { roce: true, fcfGrowth: true, grossMargin: true, cashConversion: false, netDebtToEbitda: true, operatingMargin: true },
    hardFloorFail: true,
    isMock: true
  }
];
