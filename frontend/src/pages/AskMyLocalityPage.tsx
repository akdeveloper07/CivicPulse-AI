import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HelpCircle, Search, ExternalLink, Building2, Phone, Clock,
  ShieldCheck, FileText, ArrowRight, Sparkles, MapPin, CheckCircle2,
  AlertTriangle, BookOpen, Compass
} from 'lucide-react';

interface VerifiedLocalityRule {
  id: string;
  questionKeywords: string[];
  title: string;
  department: string;
  departmentShort: string;
  zonalScope: string;
  summaryAnswer: string;
  stepByStep: string[];
  officialHelpline: string;
  slaDays: string;
  sourceTitle: string;
  sourceUrl: string;
  officialPortalUrl: string;
  reportCategory: string;
  internalReportLink: string;
}

const VERIFIED_RULES_DIRECTORY: VerifiedLocalityRule[] = [
  {
    id: 'rule-drain-01',
    questionKeywords: ['drain', 'blocked drain', 'sewage', 'clogged', 'gutter', 'waterlog', 'culvert', 'stormwater'],
    title: 'Reporting Blocked Drains, Stormwater Clogs & Sewage Overflow',
    department: 'Greater Chennai Corporation — Stormwater Drainage (SWD) Wing & CMWSSB',
    departmentShort: 'GCC SWD / CMWSSB',
    zonalScope: 'All 15 Zones (Zone I to XV)',
    summaryAnswer:
      'Roadside stormwater drains (rainwater) are maintained by GCC Stormwater Drainage Wing. Underground sanitary sewer lines and manhole overflowing are maintained by CMWSSB (Metrowater).',
    stepByStep: [
      'For open drains and roadside culverts: File a ticket via CivicNexus AI or call GCC 1913 with your street and nearest landmark.',
      'For sewage backflow or manhole bubbling: Contact Chennai Metrowater Complaint Cell at 044-45674567 or CMWSSB Zonal Depot.',
      'Field crews are dispatched with high-pressure super-sucker de-silting machines within 24 to 48 hours under GCC Monsoon SLA.'
    ],
    officialHelpline: '1913 (GCC) / 044-45674567 (CMWSSB)',
    slaDays: '24 – 48 Hours',
    sourceTitle: 'GCC Citizen Charter Sec 4(1)(b) & CMWSSB Operation Bylaws 2024',
    sourceUrl: 'https://chennaicorporation.gov.in/gcc/citizen-charter/',
    officialPortalUrl: 'https://chennaicorporation.gov.in',
    reportCategory: 'Drainage & Stormwater',
    internalReportLink: '/submit-report?category=drainage',
  },
  {
    id: 'rule-light-02',
    questionKeywords: ['street light', 'streetlight', 'lamp', 'dark street', 'pole', 'led', 'wire', 'flickering'],
    title: 'Broken Streetlights, Dark Corridors & Exposed Electrical Wires',
    department: 'Municipal Electrical Department & TANGEDCO (TNEB)',
    departmentShort: 'GCC Electrical / TANGEDCO',
    zonalScope: 'Zonal Electrical Units',
    summaryAnswer:
      'Public streetlights on Corporation roads are maintained by GCC Electrical Wing under the Centralized Control & Monitoring System (CCMS). Broken poles or overhead wire snaps are handled jointly with TANGEDCO.',
    stepByStep: [
      'Locate the 6-digit pole identification tag stenciled in yellow/white on the lamp post.',
      'Submit through CivicNexus AI or call 1913 specifying the pole ID and street.',
      'For high-voltage sparking or falling wire emergencies, immediately notify TANGEDCO Emergency Minnagam at 1912.'
    ],
    officialHelpline: '1913 (GCC) / 1912 (TANGEDCO Minnagam)',
    slaDays: '24 Hours (LED Lamp Replacement)',
    sourceTitle: 'TANGEDCO Supply Code & GCC Electrical Maintenance Standard ISO 9001',
    sourceUrl: 'https://www.tangedco.gov.in/consumer_charter.html',
    officialPortalUrl: 'https://www.tnebltd.gov.in',
    reportCategory: 'Streetlights & Electrical',
    internalReportLink: '/submit-report?category=streetlight',
  },
  {
    id: 'rule-pothole-03',
    questionKeywords: ['pothole', 'road', 'crater', 'asphalt', 'damaged road', 'speed breaker', 'tar', 'footpath', 'footway'],
    title: 'Road Damage, Potholes & Broken Pedestrian Footpaths',
    department: 'Greater Chennai Corporation — Bus Route Roads (BRR) & Interior Roads Wing',
    departmentShort: 'GCC Works (BRR)',
    zonalScope: 'Bus Route Roads & Zonal Interior Roads',
    summaryAnswer:
      'Arterial bus route roads (e.g. Anna Salai, Poonamallee High Rd) are repaired directly by the BRR Division. Interior cross-streets and residential lanes are maintained by the respective Ward Assistant Engineer.',
    stepByStep: [
      'Photograph the crater and enable GPS location on CivicNexus AI.',
      'Cold-mix bitumen patch trucks are deployed within 48 hours for immediate safety.',
      'Full milling and asphalt carpet laying is scheduled via annual zonal ward maintenance contracts.'
    ],
    officialHelpline: '1913 / 044-25619200 (Works Dept)',
    slaDays: '48 Hours (Cold-mix Bitumen Patch)',
    sourceTitle: 'Tamil Nadu Highways & GCC Bus Route Roads Maintenance Manual 2023',
    sourceUrl: 'https://chennaicorporation.gov.in/gcc/department/bus-route-roads/',
    officialPortalUrl: 'https://chennaicorporation.gov.in',
    reportCategory: 'Roads & Footpaths',
    internalReportLink: '/submit-report?category=roads',
  },
  {
    id: 'rule-water-04',
    questionKeywords: ['water', 'drinking water', 'pipeline', 'tanker', 'potable', 'contamination', 'metrowater', 'low pressure'],
    title: 'Drinking Water Supply Interruptions, Pipe Bursts & Contamination',
    department: 'Chennai Metropolitan Water Supply and Sewerage Board (CMWSSB)',
    departmentShort: 'CMWSSB (Metrowater)',
    zonalScope: 'Area I to Area XV (Metro Water Depots)',
    summaryAnswer:
      'All piped drinking water, distribution pipelines, water quality testing, and Dial-a-Tanker services are governed exclusively by CMWSSB.',
    stepByStep: [
      'Book emergency tanker supply directly using Dial-a-Tanker portal or phone.',
      'Report main line bursts to the Zonal Area Engineer to prevent road cave-ins.',
      'Water quality samples for testing can be requested at your local Metrowater Area Depot.'
    ],
    officialHelpline: '044-45674567 (CMWSSB 24x7 Helpline)',
    slaDays: '4 to 6 Hours (Emergency Pipe Isolation)',
    sourceTitle: 'CMWSSB Water Supply & Sewerage Services Regulations 2022',
    sourceUrl: 'https://chennaimetrowater.tn.gov.in',
    officialPortalUrl: 'https://chennaimetrowater.tn.gov.in',
    reportCategory: 'Water Supply',
    internalReportLink: '/water-tanker',
  },
  {
    id: 'rule-garbage-05',
    questionKeywords: ['garbage', 'waste', 'trash', 'dumping', 'bin', 'urbaser', 'solid waste', 'sweeping', 'litter'],
    title: 'Uncollected Garbage, Overflowing Bins & Illegal Debris Dumping',
    department: 'Solid Waste Management (SWM) Wing & Concessionaire Operations (Urbaser Sumeet)',
    departmentShort: 'GCC SWM Cell',
    zonalScope: 'Zones VII to XV (Private Concessionaires) & Zones I to VI (Departmental)',
    summaryAnswer:
      'Door-to-door segregated collection happens daily between 6:30 AM and 1:00 PM. Secondary compactor bins are cleared round-the-clock using GPS-tracked compactor trucks.',
    stepByStep: [
      'Take a photo of the overflowing bin or illegal construction debris dump.',
      'Report via CivicNexus AI with landmark details for automatic SWM route supervisor dispatch.',
      'Building debris dumping on public roads incurs statutory spot fines under SWM Bylaws 2019.'
    ],
    officialHelpline: '1913 / 1800-425-1913 (Urbaser SWM)',
    slaDays: '12 – 24 Hours',
    sourceTitle: 'GCC Solid Waste Management Bylaws 2019 & SWM Rules (GOI)',
    sourceUrl: 'https://chennaicorporation.gov.in/gcc/department/solid-waste-management/',
    officialPortalUrl: 'https://chennaicorporation.gov.in',
    reportCategory: 'Waste Management',
    internalReportLink: '/submit-report?category=garbage',
  },
  {
    id: 'rule-tree-06',
    questionKeywords: ['tree', 'branch', 'pruning', 'fallen tree', 'greenery', 'park', 'electric wire tree', 'cyclone'],
    title: 'Tree Pruning Near Electric Lines, Fallen Branches & Dangerous Trees',
    department: 'Parks & Urban Forestry Wing in coordination with TANGEDCO',
    departmentShort: 'GCC Parks & TNEB',
    zonalScope: 'Zonal Parks Supervisors',
    summaryAnswer:
      'Pruning of tree branches entangled in high-voltage electrical lines requires joint operations between Corporation tree-pruning teams and TANGEDCO power-cutoff line staff.',
    stepByStep: [
      'Do NOT attempt to cut branches touching live wires yourself.',
      'Submit an urgent ticket or call GCC 1913 / TNEB 1912.',
      'Hydraulic boom cutters and wood chippers are deployed for rapid clearance.'
    ],
    officialHelpline: '1913 (GCC Control Room)',
    slaDays: '24 Hours (Immediate if blocking roadway)',
    sourceTitle: 'Tamil Nadu Parks, Play-fields and Open Spaces Act & GCC Tree Bylaws',
    sourceUrl: 'https://chennaicorporation.gov.in/gcc/department/parks/',
    officialPortalUrl: 'https://chennaicorporation.gov.in',
    reportCategory: 'Parks & Environment',
    internalReportLink: '/tree-guardian',
  },
  {
    id: 'rule-office-07',
    questionKeywords: ['zonal office', 'public office', 'ward office', 'tax', 'certificate', 'where is office', 'property tax', 'ward sabha'],
    title: 'Locating Your Zonal Corporation Office, Ward Sabha & Certificate Desks',
    department: 'Revenue & General Administration Wing',
    departmentShort: 'GCC Administration',
    zonalScope: '15 Zonal Offices & 200 Ward Counters',
    summaryAnswer:
      'Greater Chennai Corporation is divided into 15 administrative zones (e.g. Zone 5 Royapuram, Zone 8 Anna Nagar, Zone 10 Kodambakkam, Zone 13 Adyar). Every zone has a designated Zonal Officer, Executive Engineer, and Ward Revenue Counters.',
    stepByStep: [
      'Property tax assessments, trade licenses, birth/death certificate corrections are processed at your Zonal Office (Mon–Fri, 10 AM to 5 PM).',
      'Ward Sabha public consultations are conducted on national holidays (Jan 26, May 1, Aug 15, Oct 2) in every ward.',
      'Check the CivicNexus AI Department Directory for exact Google Maps coordinates and phone extensions.'
    ],
    officialHelpline: '044-25619251 / 1913',
    slaDays: 'Standard Working Hours: 10:00 AM – 5:00 PM',
    sourceTitle: 'Chennai City Municipal Corporation Act (IV of 1919) & Zonal Administration Guide',
    sourceUrl: 'https://chennaicorporation.gov.in/gcc/zonal-offices/',
    officialPortalUrl: 'https://chennaicorporation.gov.in',
    reportCategory: 'Governance',
    internalReportLink: '/departments',
  },
  {
    id: 'rule-animal-08',
    questionKeywords: ['animal', 'dog', 'stray', 'bite', 'cattle', 'rabies', 'cow', 'vaccination', 'abc'],
    title: 'Stray Cattle Impounding, Dog Vaccination (ABC) & Animal Welfare',
    department: 'Veterinary Public Health Wing',
    departmentShort: 'GCC Veterinary Unit',
    zonalScope: 'Zonal Cattle Pounds & Animal Birth Control Centers',
    summaryAnswer:
      'Stray cattle roaming on roads are impounded with ₹10,000 statutory fines levied on owners. Community dogs are protected under Animal Birth Control (ABC) Rules 2023 with mandatory anti-rabies vaccination and ear-notching.',
    stepByStep: [
      'Report aggressive pack behaviour, unvaccinated strays, or cattle traffic obstructions.',
      'Corporation veterinary vans safely catch and transport cattle to Perambur or Pudupet cattle pounds.',
      'Community animal birth control and anti-rabies vaccination happens in accredited NGO centers (Blue Cross, SPCA, WNVS).'
    ],
    officialHelpline: '1913 / 044-25619330 (Veterinary Wing)',
    slaDays: '24 Hours (Cattle Impounding)',
    sourceTitle: 'Animal Birth Control (Dogs) Rules 2023 & GCC Stray Cattle Bylaw',
    sourceUrl: 'https://chennaicorporation.gov.in/gcc/department/health/',
    officialPortalUrl: 'https://chennaicorporation.gov.in',
    reportCategory: 'Public Safety',
    internalReportLink: '/animal-rescue',
  },
];

export const AskMyLocalityPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState('Ward 104 (Anna Nagar West)');
  const [activeRuleId, setActiveRuleId] = useState<string | null>(VERIFIED_RULES_DIRECTORY[0].id);

  const sampleQuestions = [
    'Where can I report a blocked drain?',
    'Which public office handles this streetlight issue?',
    'How do I report low water pressure or pipe burst?',
    'What are the rules for tree pruning near electric wires?',
    'Where is my Zonal Ward Office for property tax?',
    'How are potholes repaired on bus route roads?',
    'Who handles stray cattle and dog vaccination?'
  ];

  const filteredRules = useMemo(() => {
    if (!query.trim()) return VERIFIED_RULES_DIRECTORY;
    const lower = query.toLowerCase();
    return VERIFIED_RULES_DIRECTORY.filter((r) => {
      const matchKeywords = r.questionKeywords.some((k) => lower.includes(k) || k.includes(lower));
      const matchTitle = r.title.toLowerCase().includes(lower);
      const matchDept = r.department.toLowerCase().includes(lower);
      const matchAns = r.summaryAnswer.toLowerCase().includes(lower);
      return matchKeywords || matchTitle || matchDept || matchAns;
    });
  }, [query]);

  const activeRule = useMemo(() => {
    return VERIFIED_RULES_DIRECTORY.find((r) => r.id === activeRuleId) || filteredRules[0] || VERIFIED_RULES_DIRECTORY[0];
  }, [activeRuleId, filteredRules]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Verified Municipal Rules & Service Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ask My Locality
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Instant, verified civic answers for everyday urban questions: which municipal department handles your problem, legal SLAs, official 24x7 helplines, and direct statutory source links.
          </p>
        </div>

        {/* Ward Location Selector */}
        <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700 space-y-1.5 w-full md:w-auto min-w-[240px]">
          <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Your Selected Jurisdiction:
          </span>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="w-full bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="Ward 104 (Anna Nagar West)">Ward 104 · Zone VIII (Anna Nagar)</option>
            <option value="Ward 052 (Royapuram Central)">Ward 052 · Zone V (Royapuram)</option>
            <option value="Ward 112 (T. Nagar Panagal)">Ward 112 · Zone X (Kodambakkam)</option>
            <option value="Ward 173 (Adyar Besant Nagar)">Ward 173 · Zone XIII (Adyar)</option>
            <option value="Ward 005 (Madhavaram Corridor)">Ward 005 · Zone III (Madhavaram)</option>
            <option value="Ward 180 (Sholinganallur OMR)">Ward 180 · Zone XV (Sholinganallur)</option>
          </select>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-teal-600 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question (e.g. 'Where can I report a blocked drain?' or 'Who fixes dark streetlights?')..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 outline-none text-sm font-medium shadow-sm transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> Popular Questions:
          </span>
          {sampleQuestions.map((q) => (
            <button
              key={q}
              onClick={() => setQuery(q)}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-medium border border-slate-200 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout: Directory Questions on Left, Detailed Answer Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Verified Topics (4 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verified Topics ({filteredRules.length})
            </span>
            <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
              Zonal Directory
            </span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredRules.map((rule) => {
              const isSelected = activeRule?.id === rule.id;
              return (
                <div
                  key={rule.id}
                  onClick={() => setActiveRuleId(rule.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-400'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                      {rule.departmentShort}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      SLA: {rule.slaDays}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-navy-900 mt-2 line-clamp-2">
                    {rule.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {rule.summaryAnswer}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">📞 {rule.officialHelpline.split('/')[0]}</span>
                    <span className="text-teal-600 font-bold hover:underline flex items-center gap-1">
                      View Rules <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredRules.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No matching municipal rule found.</p>
                <p className="text-[11px] text-slate-500">
                  Try searching for keywords like "drain", "light", "pothole", "water", or "office".
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Verified Topic Detail (7 cols) */}
        {activeRule && (
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200 bg-white rounded-3xl">
            {/* Top metadata */}
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                  {activeRule.zonalScope}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Legal Bylaw
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">
                {activeRule.title}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{activeRule.department}</span>
              </div>
            </div>

            {/* Concise Verified Answer */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-teal-950 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 block">
                Official Answer & Authority Breakdown:
              </span>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {activeRule.summaryAnswer}
              </p>
            </div>

            {/* Step-by-Step Reporting Instructions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" /> Standard Procedure & Protocol
              </h4>
              <ol className="space-y-2.5">
                {activeRule.stepByStep.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Helpline and SLA Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-teal-600" /> 24x7 Official Helpline
                </span>
                <p className="text-sm font-extrabold text-navy-900">{activeRule.officialHelpline}</p>
                <span className="text-[10px] text-slate-400">Toll-free emergency dispatch</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" /> Statutory SLA Target
                </span>
                <p className="text-sm font-extrabold text-emerald-700">{activeRule.slaDays}</p>
                <span className="text-[10px] text-slate-400">GCC Citizen Charter mandated</span>
              </div>
            </div>

            {/* Source Reference & Statutory Verification Link */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-600" /> Verified Statutory Reference
              </span>
              <p className="text-xs text-slate-700 font-medium">
                {activeRule.sourceTitle}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href={activeRule.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline"
                >
                  <span>Official Bylaw / Citizen Charter Documentation</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <span className="text-slate-300">|</span>
                <a
                  href={activeRule.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-navy-900"
                >
                  <span>Departmental Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* 1-Click Action to File Report */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Notice this issue in your ward right now?
              </span>
              <button
                onClick={() => navigate('/submit-report', { state: { prefillCategory: activeRule.reportCategory } })}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md hover:shadow-teal-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Report This Problem in {selectedWard.split('(')[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
