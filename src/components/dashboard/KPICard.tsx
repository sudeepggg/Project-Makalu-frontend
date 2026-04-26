import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  sub?: string;
  Icon?: LucideIcon;
  accent?: 'green' | 'gold' | 'blue' | 'red';
}

const accents = {
  green: 'bg-primary-50 text-primary border-primary/10',
  gold:  'bg-amber-50 text-amber-700 border-amber-100',
  blue:  'bg-blue-50 text-blue-700 border-blue-100',
  red:   'bg-red-50 text-red-600 border-red-100',
};

const KPICard: React.FC<KPICardProps> = ({ title, value, sub, Icon, accent = 'green' }) => (
  <div className="card p-5 fade-in">
    <div className="flex items-start justify-between mb-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">{title}</p>
      {Icon && (
        <div className={`p-2 rounded-lg border ${accents[accent]}`}>
          <Icon size={16} />
        </div>
      )}
    </div>
    <p className="font-display text-3xl text-ink">{value}</p>
    {sub && <p className="text-xs text-ink-faint mt-1">{sub}</p>}
  </div>
);
export default KPICard;
