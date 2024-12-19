import {
  BarChart3,
  CreditCard,
  DollarSign,
  Users,
} from 'lucide-react';
import { StatCard } from '@/components/atoms/stat-card';

const stats = [
  {
    name: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    trend: 'up' as const,
    icon: DollarSign,
  },
  {
    name: 'Active Users',
    value: '2,338',
    change: '+15.3%',
    trend: 'up' as const,
    icon: Users,
  },
  {
    name: 'Sales',
    value: '$12,234.59',
    change: '-4.5%',
    trend: 'down' as const,
    icon: CreditCard,
  },
  {
    name: 'Active Projects',
    value: '12',
    change: '+2.3%',
    trend: 'up' as const,
    icon: BarChart3,
  },
];

export function StatsGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.name} {...stat} />
      ))}
    </div>
  );
}
