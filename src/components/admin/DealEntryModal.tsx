import React, { useState } from 'react';
import { X, DollarSign, Building2, Calendar, Percent } from 'lucide-react';
import { useDeals, type DealStage } from '@/hooks/useDeals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface DealEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STAGES: { value: DealStage; label: string }[] = [
  { value: 'lead', label: 'Lead' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
];

const DealEntryModal: React.FC<DealEntryModalProps> = ({ isOpen, onClose }) => {
  const { createDeal } = useDeals();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    value: '',
    stage: 'lead' as DealStage,
    probability: '10',
    expected_close_date: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Deal name is required');
      return;
    }

    try {
      setLoading(true);
      await createDeal({
        name: formData.name,
        company: formData.company || null,
        value: parseFloat(formData.value) || 0,
        stage: formData.stage,
        probability: parseInt(formData.probability) || 10,
        expected_close_date: formData.expected_close_date || null,
        notes: formData.notes || null,
      });
      
      toast.success('Deal created successfully');
      setFormData({
        name: '',
        company: '',
        value: '',
        stage: 'lead',
        probability: '10',
        expected_close_date: '',
        notes: '',
      });
      onClose();
    } catch (err) {
      console.error('Error creating deal:', err);
      toast.error('Failed to create deal');
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
            Add New Deal
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
          {/* Deal Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Deal Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enterprise Contract 2024"
              required
            />
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C857A]" />
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Acme Corporation"
                className="pl-10"
              />
            </div>
          </div>

          {/* Value */}
          <div className="space-y-2">
            <Label htmlFor="value">Deal Value</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C857A]" />
              <Input
                id="value"
                type="number"
                min="0"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="50000"
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Stage */}
            <div className="space-y-2">
              <Label>Stage</Label>
              <Select
                value={formData.stage}
                onValueChange={(val) => setFormData({ ...formData, stage: val as DealStage })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Probability */}
            <div className="space-y-2">
              <Label htmlFor="probability">Probability %</Label>
              <div className="relative">
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                  placeholder="50"
                />
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C857A]" />
              </div>
            </div>
          </div>

          {/* Expected Close Date */}
          <div className="space-y-2">
            <Label htmlFor="expected_close_date">Expected Close Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C857A]" />
              <Input
                id="expected_close_date"
                type="date"
                value={formData.expected_close_date}
                onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional context about this deal..."
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
              {loading ? 'Creating...' : 'Create Deal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealEntryModal;
