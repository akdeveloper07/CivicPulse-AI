import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CommunityEvent } from '../types';
import {
  Users, Award, Calendar, MapPin, CheckCircle2, Sparkles,
  RefreshCw, Check, ArrowRight, ShieldCheck, Heart
} from 'lucide-react';

export const CommunityActionPage: React.FC = () => {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [karmaPoints, setKarmaPoints] = useState<number>(340);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCommunityEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load community events', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRSVP = async (id: string, eventKarma: number) => {
    try {
      await api.toggleEventRSVP(id);
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id === id) {
            const nextReg = !e.user_registered;
            return {
              ...e,
              user_registered: nextReg,
              volunteers_registered: nextReg ? e.volunteers_registered + 1 : e.volunteers_registered - 1,
            };
          }
          return e;
        })
      );

      const targetEvent = events.find((e) => e.id === id);
      const isNowRegistered = !targetEvent?.user_registered;
      setKarmaPoints((prev) => (isNowRegistered ? prev + eventKarma : prev - eventKarma));

      setFeedback(
        isNowRegistered
          ? `Registered for drive! +${eventKarma} Civic Karma points credited to your civic trust profile.`
          : 'Registration cancelled.'
      );
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      console.error('Failed to toggle event RSVP', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Feature #15 · Citizen Services
            </span>
            <span className="text-xs text-slate-400 font-medium">Volunteering & Community Action</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Community Action Matcher & Civic Karma Hub
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Join verified neighborhood initiatives: community cleanups, urban tree planting, and civic audits. Earn Civic Karma for active civic stewardship.
          </p>
        </div>

        {/* Karma Badge Display */}
        <div className="bg-slate-800/90 border border-teal-500/30 p-3.5 rounded-2xl flex items-center gap-3 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
            <Award className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Civic Karma</div>
            <div className="text-xl font-black text-white">{karmaPoints} pts</div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-300 text-teal-800 text-sm flex items-center gap-3 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="p-6 rounded-2xl border border-slate-200 transition-all bg-white shadow-xs hover:shadow-md space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
                  {ev.category}
                </span>
                <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> +{ev.karma_points} Karma
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-navy-900 leading-snug">{ev.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ev.description}</p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="font-semibold">{ev.date} · {ev.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{ev.location}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <span>Volunteer Progress:</span>
                  <span>{ev.volunteers_registered} / {ev.volunteers_needed || 30} registered</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    style={{ width: `${Math.min((ev.volunteers_registered / (ev.volunteers_needed || 30)) * 100, 100)}%` }}
                    className="h-full bg-teal-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 truncate">By: {ev.organizer}</span>
              <button
                onClick={() => handleRSVP(ev.id, ev.karma_points || 50)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                  ev.user_registered
                    ? 'bg-emerald-600 text-white'
                    : 'bg-teal-50 text-teal-700 border border-teal-300 hover:bg-teal-600 hover:text-white'
                }`}
              >
                {ev.user_registered ? <Check className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                <span>{ev.user_registered ? 'Registered' : 'Join Drive'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
