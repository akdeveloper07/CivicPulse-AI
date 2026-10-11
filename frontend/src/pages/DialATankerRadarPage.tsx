import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { WaterTankerStatus } from '../types';
import {
  Droplets, Truck, Building2, Phone, CheckCircle2, Shield,
  Clock, MapPin, Sparkles, AlertCircle, Award
} from 'lucide-react';

export const DialATankerRadarPage: React.FC = () => {
  const [tankers, setTankers] = useState<WaterTankerStatus[]>([]);
  const [deliveredId, setDeliveredId] = useState<string | null>(null);

  useEffect(() => {
    api.getWaterTankers().then((data) => setTankers(data));
  }, []);

  const handleConfirmDelivery = (id: string) => {
    setDeliveredId(id);
    setTimeout(() => setDeliveredId(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-cyan-950 via-teal-950 to-slate-900 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/30 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5" /> Boost Feature #6 · Water Security
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase border border-emerald-500/30">
              Live GPS Telemetry
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Dial-a-Tanker Live Radar & Potability Quality Index
          </h1>
          <p className="text-xs text-cyan-200/90 max-w-2xl">
            Real-time drinking water tracking: Monitor Metro Water distribution trucks en route to your street, verified lab potability index (TDS, pH, chlorine), and driver contact.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-cyan-300">CMWSSB Booking Desk</div>
          <div className="text-base font-black text-white font-mono">044-45674567</div>
          <div className="text-[10px] text-cyan-300/80">Dial-a-Tanker Hotline</div>
        </div>
      </div>

      {/* Department & Role Governance Banner */}
      <div className="bg-slate-900 text-white border border-cyan-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Operated by:</strong> Chennai Metro Water Supply & Sewerage Board (CMWSSB)
            <span className="text-slate-400 ml-2">(Nodal: Er. K. Sundararajan, SE Operations · Toll-Free: 1916)</span>
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[11px] border border-cyan-500/30 shrink-0">
          👥 Accessible by: Citizens & Metro Water Drivers
        </span>
      </div>

      {/* Tankers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tankers.map((t) => {
          const isDelivered = deliveredId === t.booking_id;

          return (
            <div
              key={t.booking_id}
              className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white hover:border-slate-300 shadow-sm space-y-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-black text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200">
                    {t.booking_id}
                  </span>
                  <h3 className="font-bold text-base text-navy-900 mt-2">
                    {t.street}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">Recipient: {t.citizen_name}</div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-teal-100 text-teal-800">
                    {t.status}
                  </span>
                  <div className="text-base font-black text-cyan-600 mt-1 flex items-center justify-end gap-1">
                    <Clock className="w-4 h-4" /> ETA: {t.eta_minutes} mins
                  </div>
                </div>
              </div>

              {/* Truck and Driver Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Assigned Driver & Vehicle</div>
                  <div className="font-bold text-navy-900 text-sm">{t.driver_name}</div>
                  <div className="font-mono text-slate-600">{t.truck_number} · {t.capacity_liters} Liters Tank</div>
                </div>
                <a
                  href={`tel:${t.driver_contact}`}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Driver
                </a>
              </div>

              {/* Purity Lab Report */}
              <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-900 uppercase text-[10px] tracking-wider flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-teal-600" /> CMWSSB Certified Potability Index
                  </span>
                  <span className="font-black text-emerald-600 text-xs">Grade: {t.pds_purity_score.potability}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 rounded-xl bg-white border border-teal-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">TDS Level</div>
                    <div className="font-black text-teal-800">{t.pds_purity_score.tds_ppm} PPM</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-teal-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">pH Balance</div>
                    <div className="font-black text-teal-800">{t.pds_purity_score.ph_level} pH</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-teal-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Chlorine</div>
                    <div className="font-black text-teal-800">{t.pds_purity_score.chlorine_mg_l} mg/L</div>
                  </div>
                </div>
              </div>

              {/* Delivery Confirmation */}
              <button
                onClick={() => handleConfirmDelivery(t.booking_id)}
                disabled={isDelivered}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                  isDelivered
                    ? 'bg-emerald-600 text-white'
                    : 'bg-cyan-700 hover:bg-cyan-800 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isDelivered ? 'Delivery Confirmed & Lab Rating Saved!' : 'Confirm Water Received & Verify Purity'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
