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
    hardFloorFail
  };
}

export const MOCK_COMPANIES: CompanyMetrics[] = [
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
    hardFloorFail: false
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
    hardFloorFail: false
  }
];
