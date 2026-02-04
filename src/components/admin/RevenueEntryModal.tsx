import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, FileText, Tag } from 'lucide-react';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface RevenueEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Deal {
  id: string;
  name: string;
  company: string | null;
}

const EVENT_TYPES = [
  { value: 'payment', label: 'Payment Received' },
  { value: 'subscription', label: 'Subscription Revenue' },
  { value: 'upsell', label: 'Upsell/Expansion' },
  { value: 'renewal', label: 'Renewal' },
  { value: 'refund', label: 'Refund' },
  { value: 'other', label: 'Other' },
];

const RevenueEntryModal: React.FC<RevenueEntryModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [formData, setFormData] = useState({
    deal_id: '',
    amount: '',
    event_type: 'payment',
    event_date: new Date().toISOString().split('T')[0],
    description: '',
  });

  // Fetch deals for dropdown
  useEffect(() => {
    if (isOpen) {
      fetchDeals();
    }
  }, [isOpen]);

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('id, name, company')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeals(data || []);
    } catch (err) {
      console.error('Error fetching deals:', err);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.deal_id) {
      toast.error('Please select a deal');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) === 0) {
      toast.error('Please enter an amount');
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from('revenue_events').insert([
        {
          deal_id: formData.deal_id,
          amount: parseFloat(formData.amount),
          event_type: formData.event_type,
          event_date: formData.event_date,
          description: formData.description || null,
        },
      ]);

      if (error) throw error;

      toast.success('Revenue recorded successfully');
      setFormData({
        deal_id: '',
        amount: '',
        event_type: 'payment',
        event_date: new Date().toISOString().split('T')[0],
        description: '',
      });
      onClose();
    } catch (err) {
      console.error('Error recording revenue:', err);
      toast.error('Failed to record revenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#B8956C]/20">
          <h2 className="text-xl font-display font-semibold text-[#1A1915]">
            Record Revenue
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#B8956C]/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#8C857A]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Deal Selection */}
          <div className="space-y-2">
            <Label>Associated Deal *</Label>
            <Select
              value={formData.deal_id}
              onValueChange={(val) => setFormData({ ...formData, deal_id: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a deal..." />
              </SelectTrigger>
              <SelectContent>
                {deals.map((deal) => (
                  <SelectItem key={deal.id} value={deal.id}>
                    {deal.name}
                    {deal.company && ` (${deal.company})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C857A]" />
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="10000"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Event Type */}
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select
                value={formData.event_type}
                onValueChange={(val) => setFormData({ ...formData, event_type: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Event Date */}
            <div className="space-y-2">
              <Label htmlFor="event_date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C857A]" />
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Payment details, invoice number, etc..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#B8956C] hover:bg-[#A67C52] text-white"
            >
              {loading ? 'Recording...' : 'Record Revenue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RevenueEntryModal;
