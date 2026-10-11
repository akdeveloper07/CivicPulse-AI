import { RealTimeCivicEvent } from '../types';

type EventListener = (event: RealTimeCivicEvent) => void;

const SEED_EVENTS: RealTimeCivicEvent[] = [
  {
    id: 'evt-1',
    timestamp: 'Just now',
    type: 'NEW_REPORT',
    title: 'Severe Pothole Reported',
    description: 'Anna Nagar 2nd Avenue, near Shanthi Colony signal. AI pre-check passed.',
    ward: 'Ward 104 (Zone VII)',
    department: 'GCC Works & Roads Dept',
    status: 'Dispatched',
    urgency: 'high',
  },
  {
    id: 'evt-2',
    timestamp: '18s ago',
    type: 'CREW_DISPATCHED',
    title: 'Water Main Leak Crew En Route',
    description: 'CMWSSB Rapid Response Unit #7 dispatched with replacement gasket.',
    ward: 'Ward 112 (Zone VIII)',
    department: 'Chennai Metro Water (CMWSSB)',
    status: 'En Route',
    urgency: 'critical',
  },
  {
    id: 'evt-3',
    timestamp: '45s ago',
    type: 'REPAIR_VERIFIED',
    title: 'Streetlight Cluster Restored',
    description: '4 citizen confirmations verified on RepairProof. Audit score 98%.',
    ward: 'Ward 89 (Zone VI)',
    department: 'TANGEDCO Electrical Wing',
    status: 'Audited & Closed',
    urgency: 'low',
  },
  {
    id: 'evt-4',
    timestamp: '1m ago',
    type: 'SLA_COUNTDOWN',
    title: 'SLA Auto-Escalation Check',
    description: 'All 14 overdue tickets in Zone V successfully routed to Zonal Joint Commissioner.',
    ward: 'Ward 72 (Zone V)',
    department: 'Zonal Joint Commissioner Office',
    status: 'Escalated',
    urgency: 'medium',
  },
];

const RANDOM_SCENARIOS = [
  {
    type: 'NEW_REPORT' as const,
    title: 'Open Stormwater Sump Hazard',
    description: 'Pedestrian walkway barrier broken. Direct risk to school children.',
    ward: 'Ward 117 (Zone IX)',
    department: 'GCC Stormwater Drains Wing',
    status: 'Triaged',
    urgency: 'high' as const,
  },
  {
    type: 'CREW_DISPATCHED' as const,
    title: 'Urbaser Sumeet SWM Clean-Up',
    description: 'Mechanical compactor truck dispatched to market area clearing 1.2T waste.',
    ward: 'Ward 135 (Zone X)',
    department: 'GCC Solid Waste Management',
    status: 'In Progress',
    urgency: 'medium' as const,
  },
  {
    type: 'REPAIR_VERIFIED' as const,
    title: 'Pedestrian Ramp Surface Finished',
    description: 'Wheelchair access ramp at Nungambakkam bus stop certified by Welfare Officer.',
    ward: 'Ward 110 (Zone VIII)',
    department: 'GCC Town Planning & Social Welfare',
    status: 'Verified Fixed',
    urgency: 'low' as const,
  },
  {
    type: 'EMERGENCY_ALERT' as const,
    title: 'Fallen Tree Branch on Power Line',
    description: 'GCC Parks team and TANGEDCO joint rapid unit isolated line safely.',
    ward: 'Ward 123 (Zone IX)',
    department: 'GCC Parks & TANGEDCO Joint Taskforce',
    status: 'Secured',
    urgency: 'critical' as const,
  },
];

class RealTimeTelemetryService {
  private events: RealTimeCivicEvent[] = [...SEED_EVENTS];
  private listeners: Set<EventListener> = new Set();
  private timer: any = null;
  private isStreaming: boolean = true;

  constructor() {
    this.startStreaming();
  }

  public getRecentEvents(): RealTimeCivicEvent[] {
    return [...this.events];
  }

  public subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public broadcast(event: RealTimeCivicEvent) {
    this.events = [event, ...this.events.slice(0, 24)];
    this.listeners.forEach((cb) => {
      try {
        cb(event);
      } catch (err) {
        console.error('RealTime listener error:', err);
      }
    });
  }

  public triggerSimulatedIncident(customTitle?: string, customDept?: string) {
    const scenario = RANDOM_SCENARIOS[Math.floor(Math.random() * RANDOM_SCENARIOS.length)];
    const newEvent: RealTimeCivicEvent = {
      id: `evt-${Date.now()}`,
      timestamp: 'Just now',
      type: scenario.type,
      title: customTitle || scenario.title,
      description: scenario.description,
      ward: scenario.ward,
      department: customDept || scenario.department,
      status: scenario.status,
      urgency: scenario.urgency,
    };
    this.broadcast(newEvent);
    return newEvent;
  }

  public toggleStreaming(): boolean {
    this.isStreaming = !this.isStreaming;
    if (this.isStreaming) {
      this.startStreaming();
    } else {
      clearInterval(this.timer);
    }
    return this.isStreaming;
  }

  public isStreamActive(): boolean {
    return this.isStreaming;
  }

  private startStreaming() {
    if (this.timer) clearInterval(this.timer);
    // Periodically emit realistic civic events every 9 seconds
    this.timer = setInterval(() => {
      if (this.isStreaming && Math.random() > 0.3) {
        this.triggerSimulatedIncident();
      }
    }, 9000);
  }
}

export const realTimeService = new RealTimeTelemetryService();
