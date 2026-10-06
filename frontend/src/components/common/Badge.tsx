import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let styles = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'Submitted':
      styles = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'Under Review':
      styles = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    case 'In Progress':
      styles = 'bg-amber-50 text-amber-800 border-amber-200';
      break;
    case 'Resolved':
      styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'Reopened':
      styles = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'Rejected':
      styles = 'bg-slate-100 text-slate-500 border-slate-300';
      break;
    case 'Confirmed duplicate':
    case 'Confirmed Recurrence':
      styles = 'bg-teal-50 text-teal-700 border-teal-200';
      break;
  }

  return (
    <span className={`badge-pill border ${styles}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 mr-1" />
      {status}
    </span>
  );
};

interface PriorityBadgeProps {
  score: number;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ score }) => {
  let color = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = 'Low Priority';

  if (score >= 75) {
    color = 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
    label = 'Critical Priority';
  } else if (score >= 50) {
    color = 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
    label = 'High Priority';
  } else if (score >= 25) {
    color = 'bg-blue-50 text-blue-700 border-blue-200';
    label = 'Moderate Priority';
  }

  return (
    <span className={`badge-pill border ${color}`}>
      {score.toFixed(1)} / 100 — {label}
    </span>
  );
};

interface UncertaintyBadgeProps {
  label: string;
}

export const UncertaintyBadge: React.FC<UncertaintyBadgeProps> = ({ label }) => {
  let style = 'bg-slate-100 text-slate-700';

  if (label.includes('High')) {
    style = 'bg-amber-100 text-amber-800 border border-amber-300';
  } else if (label.includes('Moderate')) {
    style = 'bg-blue-100 text-blue-800 border border-blue-300';
  } else {
    style = 'bg-emerald-100 text-emerald-800 border border-emerald-300';
  }

  return (
    <span className={`badge-pill ${style}`}>
      {label}
    </span>
  );
};
