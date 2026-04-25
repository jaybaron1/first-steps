import React, { useState } from 'react';
import { Plus, TrendingUp, DollarSign, Users, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscriptions, type ClientSubscription } from '@/hooks/useSubscriptions';
import SubscriptionModal from '@/components/admin/SubscriptionModal';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const fmtMoney = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const MyBusinessPage: React.FC = () => {
  const { subscriptions, metrics, loading, refetch, remove, generateMonthly } = useSubscriptions();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ClientSubscription | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (sub: ClientSubscription) => {
    setEditing(sub);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleGenerate = async () => {
    try {
      const count = await generateMonthly();
      toast.success(`Generated ${count} subscription revenue event(s) for this month`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate revenue');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await remove(deleteId);
      toast.success('Subscription removed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-[#1A1915] mb-2">My Business</h2>
          <p className="text-[#8C857A]">Direct subscriptions, MRR, and active client list</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleGenerate} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Generate this month
          </Button>
          <Button onClick={handleAdd} className="gap-2 bg-[#B8956C] hover:bg-[#A67C52] text-white">
            <Plus className="w-4 h-4" /> Add subscription
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-[#B8956C]/20 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[#8C857A] text-xs mb-1">
            <DollarSign className="w-4 h-4" /> MRR
          </div>
          <p className="text-2xl font-display font-semibold text-[#1A1915]">{fmt(metrics.mrr)}</p>
        </div>
        <div className="bg-white border border-[#B8956C]/20 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[#8C857A] text-xs mb-1">
            <TrendingUp className="w-4 h-4" /> ARR
          </div>
          <p className="text-2xl font-display font-semibold text-[#1A1915]">{fmt(metrics.arr)}</p>
        </div>
        <div className="bg-white border border-[#B8956C]/20 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[#8C857A] text-xs mb-1">
            <Users className="w-4 h-4" /> Active subscriptions
          </div>
          <p className="text-2xl font-display font-semibold text-[#1A1915]">{metrics.activeCount}</p>
        </div>
        <div className="bg-white border border-[#B8956C]/20 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[#8C857A] text-xs mb-1">
            <DollarSign className="w-4 h-4" /> Direct vs Partner
          </div>
          <p className="text-sm text-[#4A4640]">
            <span className="font-semibold text-[#1A1915]">{fmt(metrics.directMrr)}</span> direct
          </p>
          <p className="text-sm text-[#4A4640]">
            <span className="font-semibold text-[#1A1915]">{fmt(metrics.partnerMrr)}</span> partner
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#B8956C]/20 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#B8956C]/15 flex items-center justify-between">
          <h3 className="font-display font-semibold text-[#1A1915]">All subscriptions</h3>
          <span className="text-xs text-[#8C857A]">{subscriptions.length} total</span>
        </div>
        {loading ? (
          <p className="p-8 text-sm text-[#8C857A]">Loading…</p>
        ) : subscriptions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-[#8C857A] mb-4">No subscriptions yet.</p>
            <Button onClick={handleAdd} className="gap-2 bg-[#B8956C] hover:bg-[#A67C52] text-white">
              <Plus className="w-4 h-4" /> Add first subscription
            </Button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#FDFBF7]">
              <tr className="text-left text-xs text-[#8C857A] uppercase tracking-wider">
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3 text-right">Monthly</th>
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3">Started</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s) => (
                <tr key={s.id} className="border-t border-[#B8956C]/10">
                  <td className="px-6 py-3 text-[#1A1915] font-medium">{s.client_name}</td>
                  <td className="px-6 py-3 text-right text-[#1A1915]">{fmtMoney(Number(s.monthly_amount))}</td>
                  <td className="px-6 py-3 text-[#4A4640]">
                    {s.is_partner_sourced ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[#B8956C]/10 text-[#B8956C]">
                        Partner
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700">
                        Direct
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-[#4A4640]">{s.start_date}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                        s.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : s.status === 'paused'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(s)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteId(s.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <SubscriptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={refetch}
        editing={editing}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the subscription and any auto-generated monthly revenue events linked to it. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyBusinessPage;
