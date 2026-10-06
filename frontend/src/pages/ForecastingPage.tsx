import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ForecastResponse, IssueCategory } from '../types';
import { TrendingUp, Activity, HelpCircle, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export const ForecastingPage: React.FC = () => {
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [categories, setCategories] = useState<IssueCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [horizonWeeks, setHorizonWeeks] = useState<number>(4);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    api.getForecasts(horizonWeeks, selectedCategory || undefined)
      .then(setForecast)
      .finally(() => setIsLoading(false));
  }, [horizonWeeks, selectedCategory]);

  const combinedData = forecast
    ? [
        ...forecast.historical_points.map((h) => ({
          period: h.period,
          historical: h.historical_count,
          forecast: null,
          lower: null,
          upper: null
        })),
        ...forecast.forecast_points.map((f) => ({
          period: f.period,
          historical: null,
          forecast: f.forecast_count,
          lower: f.lower_bound,
          upper: f.upper_bound
        }))
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white p-8 rounded-2xl shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> Time-Series Volume Forecasting
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Predictive Issue Volume Intelligence</h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            Forecast incoming municipal issue volume over 1–8 week horizons with explicit confidence bounds and holdout MAE evaluation benchmarks.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs font-semibold outline-none"
          >
            <option value="">All Categories Combined</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={horizonWeeks}
            onChange={(e) => setHorizonWeeks(Number(e.target.value))}
            className="px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs font-semibold outline-none"
          >
            <option value={2}>2 Weeks Horizon</option>
            <option value={4}>4 Weeks Horizon</option>
            <option value={8}>8 Weeks Horizon</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-slate-500">Calculating predictive time-series forecast...</div>
      ) : forecast && (
        <div className="space-y-8">
          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-card p-5 space-y-1">
              <span className="text-xs font-bold uppercase text-slate-400">Forecasting Algorithm</span>
              <div className="text-lg font-extrabold text-navy-900">{forecast.method}</div>
            </div>

            <div className="glass-card p-5 space-y-1">
              <span className="text-xs font-bold uppercase text-slate-400">Mean Absolute Error (MAE)</span>
              <div className="text-2xl font-extrabold text-emerald-600">{forecast.mae} Issues / Wk</div>
              <div className="text-[11px] text-slate-500">Evaluated on holdout split</div>
            </div>

            <div className="glass-card p-5 space-y-1">
              <span className="text-xs font-bold uppercase text-slate-400">Forecast Horizon</span>
              <div className="text-2xl font-extrabold text-teal-600">+{horizonWeeks} Weeks Ahead</div>
            </div>
          </div>

          {/* Time-Series Forecast Chart */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-navy-900">Historical Trends vs Projected Volume</h3>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={combinedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="historical" name="Historical Observed" stroke="#0f172a" fill="#334155" fillOpacity={0.1} strokeWidth={2} />
                  <Area type="monotone" dataKey="forecast" name="Predicted Volume" stroke="#0d9488" fill="#14b8a6" fillOpacity={0.2} strokeWidth={2.5} />
                  <Area type="monotone" dataKey="upper" name="Upper 95% Bound" stroke="#cbd5e1" strokeDasharray="4 4" fill="none" />
                  <Area type="monotone" dataKey="lower" name="Lower 95% Bound" stroke="#cbd5e1" strokeDasharray="4 4" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span><b>Data Coverage & Limitations Note:</b> {forecast.limitations_note}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
