import React from 'react';
import { Bell, ArrowRight } from 'lucide-react';

interface AlertItem {
  id: string;
  time: string;
  type: string;
  message: string;
  color: string;
  amount?: string;
  account?: string;
}

interface RecentAlertsCardProps {
  alerts?: AlertItem[];
  onViewAll?: () => void;
  onSelectAlert?: (alert: AlertItem) => void;
}

export const RecentAlertsCard: React.FC<RecentAlertsCardProps> = ({
  alerts,
  onViewAll,
  onSelectAlert
}) => {
  const defaultAlerts: AlertItem[] = [
    { id: '1', time: '22:26', type: 'Geospatial Cashout Alert', message: 'Wheel: B Gateway Branch ATM (+91,26,272)', color: 'red' },
    { id: '2', time: '22:25', type: 'Geospatial Cashout Alert', message: 'ACB Cash ATM Kiosk #09 (+91,86,314)', color: 'red' },
    { id: '3', time: '22:23', type: 'Suspicious Account Alert', message: 'HDFC Bank Branch #14 (+91,79,251)', color: 'red' },
    { id: '4', time: '18:45', type: 'Critical Alert', message: 'in AC78456 (₹12,50,000)', color: 'red' },
  ];

  // Guarantee alerts are NEVER empty
  const alertList = alerts && alerts.length > 0 ? alerts : defaultAlerts;

  return (
    <div className="bg-white rounded-xl p-2.5 sm:p-3 2xl:p-3.5 border border-slate-200/90 shadow-2xs flex flex-col justify-between h-full min-h-0 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Bell className="w-4 h-4 text-blue-600 shrink-0" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight truncate">
            Recent Alerts
          </h3>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors shrink-0"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Alerts Timeline List with Real-time Data */}
      <div className="flex-1 min-h-0 space-y-2 overflow-y-auto pr-1">
        {alertList.slice(0, 4).map((alert) => (
          <div
            key={alert.id}
            onClick={() => onSelectAlert ? onSelectAlert(alert) : onViewAll && onViewAll()}
            className="flex items-start gap-2.5 text-xs leading-snug cursor-pointer hover:bg-slate-50 p-1 rounded-md transition-colors"
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 mt-0.5">
              {alert.time || '18:45'}
            </span>
            <span
              className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                alert.color === 'red' || alert.type.toLowerCase().includes('critical')
                  ? 'bg-red-500'
                  : alert.color === 'orange' || alert.type.toLowerCase().includes('high')
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
            ></span>
            <div className="flex-1 min-w-0 truncate">
              <span
                className={`font-bold mr-1.5 ${
                  alert.color === 'red' || alert.type.toLowerCase().includes('critical')
                    ? 'text-red-600'
                    : alert.color === 'orange' || alert.type.toLowerCase().includes('high')
                    ? 'text-amber-600'
                    : 'text-blue-600'
                }`}
              >
                {alert.type}
              </span>
              <span className="text-slate-700 font-semibold truncate">{alert.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
