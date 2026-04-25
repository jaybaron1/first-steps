import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { toast } from 'sonner';
import type { ClientSubscription } from '@/hooks/useSubscriptions';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editing?: ClientSubscription | null;
}

const SubscriptionModal: React.FC<Props> = ({ isOpen, onClose, onSaved, editing }) => {
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    client_name: '',
    monthly_amount: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'active' as 'active' | 'paused' | 'churned',
    is_partner_sourced: false,
    partner_id: '',
    notes: '',
  });

  useEffect(() => {
    if (!isOpen) return;
    supabase
      .from('partners')
      .select('id, name')
      .order('name')
      .then(({ data }) => setPartners((data as any) || []));
    if (editing) {
      setForm({
        client_name: editing.client_name,
        monthly_amount: String(editing.monthly_amount),
        start_date: editing.start_date,
        end_date: editing.end_date || '',
        status: editing.status,
        is_partner_sourced: editing.is_partner_sourced,
        partner_id: editing.partner_id || '',
        notes: editing.notes || '',
      });
    } else {
      setForm({
        client_name: '',
        monthly_amount: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        status: 'active',
        is_partner_sourced: false,
        partner_id: '',
        notes: '',
      });
    }
  }, [isOpen, editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_name || !form.monthly_amount) {
      toast.error('Client name and monthly amount are required');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        client_name: form.client_name,
        monthly_amount: parseFloat(form.monthly_amount),
        start_date: form.start_date,
        end_date: form.end_date || null,
        status: form.status,
        is_partner_sourced: form.is_partner_sourced,
        partner_id: form.is_partner_sourced && form.partner_id ? form.partner_id : null,
        notes: form.notes || null,
      };
      if (editing) {
        const { error } = await (supabase as any)
          .from('client_subscriptions')
          .update(payload)
          .eq('id', editing.id);
        if (error) throw error;
        toast.success('Subscription updated');
      } else {
        const { error } = await (supabase as any).from('client_subscriptions').insert([payload]);
        if (error) throw error;
        toast.success('Subscription added');
      }
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit subscription' : 'Add subscription'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Client name *</Label>
            <Input
              value={form.client_name}
              onChange={(e) => setForm({ ...form, client_name: e.target.value })}
              placeholder="Acme Co."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Monthly amount (USD) *</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.monthly_amount}
                onChange={(e) => setForm({ ...form, monthly_amount: e.target.value })}
                placeholder="106.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="churned">Churned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Start date</Label>
              <Input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>End date (optional)</Label>
              <Input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="partner-sourced"
              checked={form.is_partner_sourced}
              onCheckedChange={(c) => setForm({ ...form, is_partner_sourced: !!c })}
            />
            <Label htmlFor="partner-sourced" className="cursor-pointer">Partner-sourced client</Label>
          </div>
          {form.is_partner_sourced && (
            <div className="space-y-2">
              <Label>Partner</Label>
              <Select value={form.partner_id} onValueChange={(v) => setForm({ ...form, partner_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select partner…" /></SelectTrigger>
                <SelectContent>
                  {partners.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#B8956C] hover:bg-[#A67C52] text-white"
            >
              {loading ? 'Saving…' : editing ? 'Save changes' : 'Add subscription'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
