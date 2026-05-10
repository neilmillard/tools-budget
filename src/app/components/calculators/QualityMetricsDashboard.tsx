'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CompanyMetrics, 
  DEFAULT_THRESHOLDS, 
  MOCK_COMPANIES, 
  processCompanyData,
  calculateScore
} from '@/lib/quality-metrics';
import { FMP_API_KEY, FREE_TICKERS } from '@/lib/fmp';
import {
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight,
  Settings,
  Download,
  Plus
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const INITIAL_TICKERS = [
  'MSFT', 'AAPL', 'GOOGL', 'AMZN', 'META', 'V', 'NVDA', 'PEP', 
  'KO', 'NKE', 'JNJ', 'COST', 'UNH', 'WMT', 'ADBE', 'TSM'
];

export default function QualityMetricsDashboard() {
  const [companies, setCompanies] = useState<CompanyMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [newTicker, setNewTicker] = useState('');
  const [filterPassing, setFilterPassing] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!FMP_API_KEY) {
        setCompanies(MOCK_COMPANIES);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await Promise.all(
          INITIAL_TICKERS.map(async (symbol) => {
            try {
              return await processCompanyData(symbol, thresholds);
            } catch (e) {
              console.error(`Failed to fetch ${symbol}`, e);
              return null;
            }
          })
        );
        const validCompanies = results.filter((c): c is CompanyMetrics => c !== null);
        
        if (validCompanies.length === 0) {
          setCompanies(MOCK_COMPANIES);
        } else {
          setCompanies(validCompanies);
        }
      } catch (err) {
        setError('Failed to load financial data. Please check your API key.');
        setCompanies(MOCK_COMPANIES);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const scoredCompanies = useMemo(() => {
    return companies.map(c => {
      const { score, passes, hardFloorFail } = calculateScore(c, thresholds);
      return { ...c, score, passes, hardFloorFail };
    });
  }, [companies, thresholds]);

  const sortedCompanies = useMemo(() => {
    let filtered = [...scoredCompanies];
    if (filterPassing) {
      filtered = filtered.filter(c => c.score >= 80 && !c.hardFloorFail);
    }
    return filtered.sort((a, b) => b.score - a.score);
  }, [scoredCompanies, filterPassing]);

  const portfolioAggregates = useMemo(() => {
    if (companies.length === 0) return null;
    const count = companies.length;
    return {
      avgRoce: companies.reduce((sum, c) => sum + c.roceAvg10yr, 0) / count,
      avgFcfGrowth: companies.reduce((sum, c) => sum + c.fcfGrowth5yr, 0) / count,
      avgGrossMargin: companies.reduce((sum, c) => sum + c.grossMarginLatest, 0) / count,
      avgCashConversion: companies.reduce((sum, c) => sum + c.cashConversion, 0) / count,
      avgOperatingMargin: companies.reduce((sum, c) => sum + c.operatingMarginLatest, 0) / count,
    };
  }, [companies]);

  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicker) return;

    const ticker = newTicker.toUpperCase().trim();
    if (!FREE_TICKERS.includes(ticker)) {
      alert(`The ticker "${ticker}" is not in the supported free list. Payment is needed to access data for this company.`);
      return;
    }

    if (!FMP_API_KEY) {
      alert('Cannot add new ticker without a valid FMP API key.');
      return;
    }

    setLoading(true);
    try {
      const data = await processCompanyData(ticker, thresholds);
      setCompanies(prev => [...prev, data]);
      setNewTicker('');
    } catch (err) {
      alert('Failed to add ticker. Check symbol and API key.');
    } finally {
      setLoading(false);
    }
  };

  const formatPercent = (val: number) => (val * 100).toFixed(1) + '%';
  const formatValue = (val: number) => val.toFixed(2);
  const formatLargeNumber = (val: number) => {
    if (val >= 1e12) return (val / 1e12).toFixed(2) + 'T';
    if (val >= 1e9) return (val / 1e9).toFixed(1) + 'B';
    if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
    return val.toLocaleString();
  };

  const exportToCSV = () => {
    const headers = ['Symbol', 'Name', 'Score', 'ROCE (10y)', 'FCF Growth', 'Gross Margin', 'Cash Conv.', 'Net Debt/EBITDA', 'Mkt Cap'];
    const rows = sortedCompanies.map(c => [
      c.symbol,
      c.name,
      c.score,
      formatPercent(c.roceAvg10yr),
      formatPercent(c.fcfGrowth5yr),
      formatPercent(c.grossMarginLatest),
      formatPercent(c.cashConversion),
      formatValue(c.netDebtToEbitda),
      c.marketCap
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "quality_metrics_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (pass: boolean, hardFloorFail?: boolean) => {
    if (hardFloorFail) return 'text-red-600 bg-red-50';
    return pass ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50';
  };

  if (error && companies.length === 0) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans text-slate-900">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quality Metrics Dashboard</h1>
          <p className="text-slate-500 mt-1">Fundsmith-style universe screening & analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setFilterPassing(!filterPassing)}
            className={`px-3 py-2 border rounded-md text-sm transition-colors ${filterPassing ? 'bg-blue-50 border-blue-200 text-blue-600 font-medium' : 'hover:bg-slate-50'}`}
          >
            {filterPassing ? 'Showing Passing Only' : 'Show Passing Only'}
          </button>
          <form onSubmit={handleAddTicker} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Add ticker..." 
              className="px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
            />
            <button type="submit" className="p-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors">
              <Plus size={20} />
            </button>
          </form>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 border rounded-md hover:bg-slate-50 transition-colors ${showSettings ? 'bg-slate-100' : ''}`}
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={exportToCSV}
            className="p-2 border rounded-md hover:bg-slate-50 transition-colors"
          >
            <Download size={20} />
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <section className="bg-slate-50 border rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-2">
            <label className="text-sm font-semibold block">ROCE Threshold (%)</label>
            <input 
              type="number" 
              value={thresholds.roce * 100} 
              onChange={(e) => setThresholds({...thresholds, roce: Number(e.target.value) / 100})}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold block">FCF Growth Threshold (%)</label>
            <input 
              type="number" 
              value={thresholds.fcfGrowth * 100} 
              onChange={(e) => setThresholds({...thresholds, fcfGrowth: Number(e.target.value) / 100})}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold block">Gross Margin Threshold (%)</label>
            <input 
              type="number" 
              value={thresholds.grossMargin * 100} 
              onChange={(e) => setThresholds({...thresholds, grossMargin: Number(e.target.value) / 100})}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold block">Cash Conv. Threshold (%)</label>
            <input 
              type="number" 
              value={thresholds.cashConversion * 100} 
              onChange={(e) => setThresholds({...thresholds, cashConversion: Number(e.target.value) / 100})}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold block">Net Debt/EBITDA Max (x)</label>
            <input 
              type="number" 
              value={thresholds.netDebtToEbitda} 
              onChange={(e) => setThresholds({...thresholds, netDebtToEbitda: Number(e.target.value)})}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold block">Operating Margin Threshold (%)</label>
            <input 
              type="number" 
              value={thresholds.operatingMargin * 100} 
              onChange={(e) => setThresholds({...thresholds, operatingMargin: Number(e.target.value) / 100})}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </section>
      )}

      {/* Portfolio Aggregates */}
      {portfolioAggregates && (
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <AggregateCard label="Avg ROCE (10y)" value={formatPercent(portfolioAggregates.avgRoce)} highlight={portfolioAggregates.avgRoce >= thresholds.roce} />
          <AggregateCard label="Avg FCF Growth" value={formatPercent(portfolioAggregates.avgFcfGrowth)} highlight={portfolioAggregates.avgFcfGrowth >= thresholds.fcfGrowth} />
          <AggregateCard label="Avg Gross Margin" value={formatPercent(portfolioAggregates.avgGrossMargin)} highlight={portfolioAggregates.avgGrossMargin >= thresholds.grossMargin} />
          <AggregateCard label="Avg Cash Conv." value={formatPercent(portfolioAggregates.avgCashConversion)} highlight={portfolioAggregates.avgCashConversion >= thresholds.cashConversion} />
          <AggregateCard label="Avg Opt Margin" value={formatPercent(portfolioAggregates.avgOperatingMargin)} highlight={portfolioAggregates.avgOperatingMargin >= thresholds.operatingMargin} />
        </section>
      )}

      {/* Main Table */}
      <section className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Company</th>
                <th className="px-4 py-4 text-center">Score</th>
                <th className="px-4 py-4">ROCE (10y)</th>
                <th className="px-4 py-4">FCF Growth</th>
                <th className="px-4 py-4">Gross Margin</th>
                <th className="px-4 py-4">Cash Conv.</th>
                <th className="px-4 py-4">Net Debt/EBITDA</th>
                <th className="px-4 py-4">Mkt Cap</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {loading && companies.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-slate-400">Loading financial data...</td></tr>
              ) : sortedCompanies.map(company => (
                <tr 
                  key={company.symbol} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedSymbol(selectedSymbol === company.symbol ? null : company.symbol)}
                >
                  <td className="px-6 py-4">
                    <div className="font-bold">{company.symbol}</div>
                    <div className="text-xs text-slate-500 truncate max-w-37.5">{company.name}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-xs ${
                      company.score >= 80 ? 'bg-green-100 text-green-700' : 
                      company.score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {company.score}
                    </span>
                  </td>
                  <td className={`px-4 py-4 font-medium ${getStatusColor(company.passes.roce, company.roceAvg10yr < thresholds.roce)}`}>
                    {formatPercent(company.roceAvg10yr)}
                  </td>
                  <td className={`px-4 py-4 font-medium ${getStatusColor(company.passes.fcfGrowth)}`}>
                    {formatPercent(company.fcfGrowth5yr)}
                  </td>
                  <td className={`px-4 py-4 font-medium ${getStatusColor(company.passes.grossMargin)}`}>
                    {formatPercent(company.grossMarginLatest)}
                  </td>
                  <td className={`px-4 py-4 font-medium ${getStatusColor(company.passes.cashConversion, company.cashConversion < thresholds.cashConversion)}`}>
                    {formatPercent(company.cashConversion)}
                  </td>
                  <td className={`px-4 py-4 font-medium ${getStatusColor(company.passes.netDebtToEbitda)}`}>
                    {formatValue(company.netDebtToEbitda)}x
                  </td>
                  <td className="px-4 py-4 text-slate-500">
                    {formatLargeNumber(company.marketCap)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Drill-down Section (Simple Version) */}
      {selectedSymbol && (
        <CompanyDrillDown 
          company={companies.find(c => c.symbol === selectedSymbol)!} 
          onClose={() => setSelectedSymbol(null)} 
        />
      )}
    </div>
  );
}

function AggregateCard({ label, value, highlight }: { label: string, value: string, highlight: boolean }) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="text-xs text-slate-500 font-medium uppercase">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${highlight ? 'text-green-600' : 'text-slate-900'}`}>{value}</div>
    </div>
  );
}

function CompanyDrillDown({ company, onClose }: { company: CompanyMetrics, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">{company.name} ({company.symbol})</h2>
            <p className="text-slate-500">10-Year Financial History</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <XCircle size={24} className="text-slate-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-xs text-slate-500 font-bold uppercase">Quality Score</div>
                <div className="text-2xl font-black">{company.score}</div>
              </div>
              <div className="border-r h-10 self-center"></div>
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase">Status</div>
                {company.hardFloorFail ? (
                  <div className="flex items-center gap-1 text-red-600 font-bold">
                    <AlertTriangle size={16} /> Fails Hard Floors
                  </div>
                ) : company.score >= 80 ? (
                  <div className="flex items-center gap-1 text-green-600 font-bold">
                    <CheckCircle size={16} /> High Quality Pass
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <XCircle size={16} /> Watchlist
                  </div>
                )}
              </div>
            </div>
            {company.filingLink && (
              <a 
                href={company.filingLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Latest Annual Report <ArrowUpRight size={16} />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase">ROCE Trend</h3>
              <div className="h-48">
                <Sparkline data={company.roceHistory} label="ROCE" color="#10b981" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase">Gross Margin Trend</h3>
              <div className="h-48">
                <Sparkline data={company.grossMarginHistory} label="Gross Margin" color="#3b82f6" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase">Operating Margin Trend</h3>
              <div className="h-48">
                <Sparkline data={company.operatingMarginHistory} label="Operating Margin" color="#8b5cf6" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase">Free Cash Flow</h3>
              <div className="h-48">
                <Sparkline data={company.fcfHistory} label="FCF" color="#f59e0b" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
            <MetricBadge label="Revenue Growth (5y)" value={(company.revenueGrowth5yr * 100).toFixed(1) + '%'} />
            <MetricBadge label="EPS Growth (5y)" value={(company.epsGrowth5yr * 100).toFixed(1) + '%'} />
            <MetricBadge label="FCF Yield" value={(company.fcfYield * 100).toFixed(1) + '%'} />
            <MetricBadge label="Cash Conv." value={(company.cashConversion * 100).toFixed(1) + '%'} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBadge({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-3 bg-slate-50 rounded-lg">
      <div className="text-[10px] text-slate-500 font-bold uppercase">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

function Sparkline({ data, label, color }: { data: number[], label: string, color: string }) {
  if (!data || data.length === 0) {
    return <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">No data available</div>;
  }
  // data is newest to oldest, reverse for chart
  const chartData = [...data].reverse();
  const labels = chartData.map((_, i) => `Y-${chartData.length - 1 - i}`);

  return (
    <Line 
      data={{
        labels,
        datasets: [{
          label,
          data: chartData,
          borderColor: color,
          backgroundColor: color + '20',
          fill: true,
          tension: 0.4,
          pointRadius: 2,
        }]
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false },
        },
        scales: {
          x: { display: false },
          y: { 
            grid: { color: '#f1f5f9' },
            ticks: { 
              font: { size: 10 },
              callback: (val) => typeof val === 'number' ? (val * 100).toFixed(0) + '%' : val 
            }
          }
        }
      }}
    />
  );
}
