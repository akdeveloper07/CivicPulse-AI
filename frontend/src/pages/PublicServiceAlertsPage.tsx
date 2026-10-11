import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PublicServiceAlert } from '../types';
import {
  Bell, BellOff, ShieldAlert, CheckCircle2, Clock, MapPin,
  RefreshCw, Filter, Waves, Zap, Construction, AlertCircle
} from 'lucide-react';

export const PublicServiceAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<PublicServiceAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPublicAlerts();
      setAlerts(data);
    } catch (err) {
      console.error('Failed to load alerts', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSubscription = async (id: string) => {
    try {
      const updated = await api.toggleAlertSubscription(id);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_subscribed: !a.is_subscribed, subscriber_count: a.is_subscribed ? a.subscriber_count - 1 : a.subscriber_count + 1 } : a))
      );
      setFeedback(
        `Subscription preferences updated! You will receive municipal broadcast SMS / WhatsApp notifications.`
      );
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      console.error('Failed to toggle alert subscription', err);
    }
  };

  const categories = ['All', 'Water Interruption', 'Power Maintenance', 'Road Diversion', 'Weather Advisory'];

  const filteredAlerts = alerts.filter(
    (a) => selectedCategory === 'All' || a.category === selectedCategory
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5" /> Feature #11 · Accountability & Trust
            </span>
            <span className="text-xs text-slate-400 font-medium">Verified Municipal Bulletins</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Public-Service Alerts & Municipal Bulletins
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Official broadcasts on scheduled drinking water cuts, power outages, and road diversions. Subscribe to real-time neighborhood updates.
          </p>
        </div>

        <button
          onClick={loadAlerts}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Bulletins
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-300 text-teal-800 text-sm flex items-center gap-3 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isUrgent = alert.urgency === 'High' || alert.urgency === 'Critical';

          return (
            <div
              key={alert.id}
              className={`p-6 rounded-2xl border transition-all bg-white shadow-xs hover:shadow-md space-y-4 ${
                isUrgent ? 'border-amber-300' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      alert.category.includes('Water')
                        ? 'bg-blue-100 text-blue-800'
                        : alert.category.includes('Power')
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {alert.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Issued by {alert.issuing_department}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Duration: {alert.start_time} - {alert.end_time}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-extrabold text-lg text-navy-900">{alert.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{alert.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Affected Areas</span>
                  <div className="font-bold text-slate-800 mt-0.5">{(alert.affected_wards || alert.affected_areas || ['Zone 7']).join(', ')}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Alternative Arrangement</span>
                  <div className="font-bold text-teal-700 mt-0.5">{alert.alternative_arrangements}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Subscriber Base</span>
                    <div className="font-bold text-navy-900 mt-0.5">{alert.subscriber_count} Citizens</div>
                  </div>

                  <button
                    onClick={() => handleToggleSubscription(alert.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      alert.is_subscribed
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {alert.is_subscribed ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                    <span>{alert.is_subscribed ? 'Subscribed' : 'Get Alerts'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
