import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PublicFacility } from '../types';
import {
  HelpCircle, MapPin, Clock, Phone, Star, CheckCircle2,
  Filter, RefreshCw, Compass, Shield, Accessibility, Droplets
} from 'lucide-react';

export const PublicHelpFinderPage: React.FC = () => {
  const [facilities, setFacilities] = useState<PublicFacility[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [wheelchairOnly, setWheelchairOnly] = useState<boolean>(false);

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPublicFacilities();
      setFacilities(data);
    } catch (err) {
      console.error('Failed to load facilities', err);
    } finally {
      setIsLoading(false);
    }
  };

  const types = ['All', 'Public Restroom', 'Drinking Water Station', 'Primary Health Center', 'E-Seva Center'];

  const filteredFacilities = facilities.filter((f) => {
    const matchesType = selectedType === 'All' || f.facility_type === selectedType;
    const matchesWheelchair = !wheelchairOnly || f.is_wheelchair_accessible;
    return matchesType && matchesWheelchair;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Feature #14 · Citizen Services
            </span>
            <span className="text-xs text-slate-400 font-medium">Civic Amenities Navigator</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Public Help Finder & Essential Amenities
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Locate verified municipal amenities near you: clean public restrooms, free RO drinking water hubs, primary clinics, and e-Seva centers.
          </p>
        </div>

        <button
          onClick={loadFacilities}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Amenities
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                selectedType === type
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Wheelchair filter toggle */}
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <Accessibility className="w-4 h-4 text-teal-600" />
          <span>Wheelchair Accessible Only</span>
          <input
            type="checkbox"
            checked={wheelchairOnly}
            onChange={(e) => setWheelchairOnly(e.target.checked)}
            className="accent-teal-600 w-4 h-4 rounded cursor-pointer ml-1"
          />
        </label>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFacilities.map((fac) => (
          <div
            key={fac.id}
            className="p-6 rounded-2xl border border-slate-200 transition-all bg-white shadow-xs hover:shadow-md space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
                  {fac.facility_type}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{(fac.hygiene_rating || fac.cleanliness_rating || 4.5).toFixed(1)}</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-navy-900">{fac.name}</h3>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{fac.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{fac.operating_hours}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-1.5 text-slate-600">
                  <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{fac.distance_km} km away</span>
                </div>
              </div>

              {fac.is_wheelchair_accessible && (
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-bold flex items-center gap-1.5">
                  <Accessibility className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ramp & Wheelchair Accessible</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Ward {fac.ward}</span>
              <a
                href={`tel:${fac.contact_phone}`}
                className="font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Center</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
