import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  name: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
}

export function StatCard({ name, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-white p-6">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-gray-600" />
        <p className="text-sm font-medium text-gray-500">{name}</p>
      </div>
      <div className="mt-6">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {change && (
          <div className="flex items-center gap-1 mt-2">
            <span
              className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
