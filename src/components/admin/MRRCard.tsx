import React from 'react';
import { TrendingUp, Users, Briefcase, DollarSign } from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const MRRCard: React.FC = () => {
  const { metrics, loading } = useSubscriptions();

  return (
    <div className="bg-gradient-to-br from-[#B8956C] to-[#9A7B58] rounded-2xl p-8 shadow-lg text-white mb-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/70 mb-1">Monthly Recurring Revenue</p>
          <h2 className="text-4xl font-display font-semibold">
            {loading ? '—' : formatCurrency(metrics.mrr)}
          </h2>
          <p className="text-sm text-white/80 mt-1">
            {formatCurrency(metrics.arr)} ARR · {metrics.activeCount} active subscriptions
          </p>
        </div>
        <Link to="/admin/my-business">
          <Button size="sm" variant="secondary" className="bg-white/15 hover:bg-white/25 text-white border-0">
            Manage subscriptions
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
            <DollarSign className="w-3.5 h-3.5" /> Direct MRR
          </div>
          <p className="text-xl font-semibold">{formatCurrency(metrics.directMrr)}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
            <Briefcase className="w-3.5 h-3.5" /> Partner MRR
          </div>
          <p className="text-xl font-semibold">{formatCurrency(metrics.partnerMrr)}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
            <TrendingUp className="w-3.5 h-3.5" /> Churned (mo)
          </div>
          <p className="text-xl font-semibold">{metrics.churnedThisMonth}</p>
        </div>
      </div>
    </div>
  );
};

export default MRRCard;
