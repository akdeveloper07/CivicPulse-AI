import React, { useState } from 'react';
import { MOCK_WHATSAPP_CONVERSATION } from '../services/mockData';
import { WhatsAppChatMessage } from '../types';
import { realTimeService } from '../services/realtime';
import {
  MessageSquare, Send, CheckCheck, Sparkles, Building2, Shield,
  Phone, Bot, User, CheckCircle2, CornerDownRight, Smartphone
} from 'lucide-react';

export const WhatsAppBotSimulatorPage: React.FC = () => {
  const [messages, setMessages] = useState<WhatsAppChatMessage[]>(MOCK_WHATSAPP_CONVERSATION);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: WhatsAppChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const isWater = text.includes('water') || text.includes('குடிநீர்') || text.includes('drain');
      const isRoad = text.includes('pothole') || text.includes('road') || text.includes('பள்ளம்');
      const isLight = text.includes('light') || text.includes('மின்சாரம்') || text.includes('lamp');

      const dept = isWater ? 'Chennai Metro Water (CMWSSB)' : isRoad ? 'GCC Works & Highways' : isLight ? 'TANGEDCO Electrical Wing' : 'GCC Solid Waste Management';
      const category = isWater ? 'Water Pipeline & Drainage' : isRoad ? 'Roads & Infrastructure' : isLight ? 'Streetlights & Electrical' : 'Solid Waste Management';
      const ticketId = `REP-WA-${Math.floor(1000 + Math.random() * 9000)}`;

      const botReply: WhatsAppChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `📍 Auto-triaged: Ward 104, Zone VII\n🏷️ Category: ${category}\n🏢 Assigned Department: ${dept}\n\n✅ Complaint Registered Successfully!\n🎫 Tracking Ticket: #${ticketId}\n⏳ SLA Resolution Target: 24 Hours\n\nNodal Officer notified. Live telemetry broadcasted to field crew.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ticket_id: ticketId,
      };

      setMessages((prev) => [...prev, botReply]);

      // Broadcast to real-time engine
      realTimeService.broadcast({
        id: `evt-${Date.now()}`,
        timestamp: 'Just now',
        type: 'NEW_REPORT',
        title: `WhatsApp Complaint: ${text.slice(0, 35)}...`,
        description: text,
        ward: 'Ward 104 (Zone VII)',
        department: dept,
        status: 'Auto-Triaged via WhatsApp',
        urgency: 'high',
      });
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Boost Feature #1 · Citizen Channels
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-400 text-slate-950 text-[10px] font-black uppercase">
              Bilingual (தமிழ் / English)
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            WhatsApp Civic Chatbot Simulator
          </h1>
          <p className="text-xs text-emerald-200/90 max-w-2xl">
            Zero-friction citizen participation: Report civic issues directly through WhatsApp without installing apps. Automated AI categorization, ticket generation, and department dispatch.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-emerald-300">Official Helpline</div>
          <div className="text-base font-black text-white font-mono">+91 94451 90000</div>
          <div className="text-[10px] text-emerald-300/80">Greater Chennai Corporation</div>
        </div>
      </div>

      {/* Department & Role Governance Banner */}
      <div className="bg-slate-900 text-white border border-teal-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            <strong>Operated by:</strong> GCC Town Planning, Welfare & e-Governance Cell
            <span className="text-slate-400 ml-2">(Nodal: Smt. Anitha Balakrishnan, IAS · Toll-Free: 1913)</span>
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 font-bold text-[11px] border border-teal-500/30 shrink-0">
          👥 Accessible by: All Citizens
        </span>
      </div>

      {/* Main WhatsApp Simulator Interface */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left: Instructions & Features */}
        <div className="md:col-span-1 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
            <h3 className="font-bold text-sm text-navy-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              How It Works
            </h3>
            <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside leading-relaxed font-medium">
              <li>Citizen sends message or voice note in Tamil or English to the official WhatsApp number.</li>
              <li>Natural Language AI detects the issue category and GPS coordinates.</li>
              <li>Complaint is routed to the exact municipal agency (GCC, CMWSSB, TANGEDCO).</li>
              <li>Instant tracking ticket and SLA countdown generated.</li>
            </ol>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
            <h4 className="font-bold text-xs text-navy-900 uppercase tracking-wider text-slate-500">
              Quick Test Scenarios
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => handleSendMessage('Severe pothole at Shanthi Colony main road')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-xs transition-all flex items-center justify-between group"
              >
                <span className="font-medium text-slate-700 group-hover:text-emerald-900">🛣️ Pothole on Shanthi Colony</span>
                <CornerDownRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
              </button>
              <button
                onClick={() => handleSendMessage('குடிநீர் குழாய் உடைந்து தண்ணீர் வீணாகிறது (Water pipe broken)')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-xs transition-all flex items-center justify-between group"
              >
                <span className="font-medium text-slate-700 group-hover:text-emerald-900">💧 குடிநீர் குழாய் உடைப்பு (Tamil)</span>
                <CornerDownRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
              </button>
              <button
                onClick={() => handleSendMessage('Streetlight dark for 3 days near 4th cross school')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-xs transition-all flex items-center justify-between group"
              >
                <span className="font-medium text-slate-700 group-hover:text-emerald-900">💡 Streetlight Non-Functional</span>
                <CornerDownRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: WhatsApp Chat Window */}
        <div className="md:col-span-2 rounded-2xl overflow-hidden shadow-2xl border border-slate-300 flex flex-col h-[580px] bg-[#efeae2]">
          {/* WhatsApp Header */}
          <div className="bg-[#075e54] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-950 flex items-center justify-center font-bold text-sm">
                  <Bot className="w-5 h-5 text-emerald-900" />
                </div>
                <span className="w-3 h-3 bg-emerald-400 rounded-full absolute bottom-0 right-0 border-2 border-[#075e54]" />
              </div>
              <div>
                <div className="font-bold text-sm flex items-center gap-1.5">
                  CivicNexus AI Bot <span className="text-[10px] bg-emerald-800 px-1.5 py-0.2 rounded text-emerald-200">Verified</span>
                </div>
                <div className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span>online · GCC e-Governance Desk</span>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-emerald-200 font-mono">
              24x7 AI Assist
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-xs text-xs whitespace-pre-line leading-relaxed ${
                      isUser
                        ? 'bg-[#dcf8c6] text-slate-900 rounded-tr-none'
                        : 'bg-white text-slate-900 rounded-tl-none border border-slate-200'
                    }`}
                  >
                    <div>{m.text}</div>
                    <div className="text-[10px] text-slate-400 text-right mt-1 flex items-center justify-end gap-1">
                      <span>{m.timestamp}</span>
                      {isUser && <CheckCheck className="w-3.5 h-3.5 text-teal-600" />}
                    </div>
                  </div>

                  {/* Bot Quick Replies if present */}
                  {m.quick_replies && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {m.quick_replies.map((qr) => (
                        <button
                          key={qr}
                          onClick={() => handleSendMessage(qr)}
                          className="px-2.5 py-1 rounded-full bg-white text-emerald-800 border border-emerald-300 text-[11px] font-semibold hover:bg-emerald-50 transition-colors shadow-xs"
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 bg-white rounded-full w-24 border border-slate-200 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-150" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-300" />
                <span className="text-[10px] text-slate-400 ml-1">Typing</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="bg-[#f0f2f5] p-3 border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type in Tamil or English (e.g. Water leak at Anna Nagar)..."
              className="flex-1 px-4 py-2.5 rounded-full border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-full bg-[#128c7e] hover:bg-[#075e54] text-white disabled:opacity-40 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
