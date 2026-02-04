import React, { useState } from 'react';
import { useGoals, Goal, GoalConfig } from '@/hooks/useGoals';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  MoreHorizontal,
  Target,
  Link,
  Clock,
  ArrowDown,
  FileText,
  Zap,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const GOAL_TYPES = [
  { value: 'url_visit', label: 'URL Visit', icon: Link, description: 'Track visits to specific pages' },
  { value: 'event', label: 'Event', icon: Zap, description: 'Track custom events like CTA clicks' },
  { value: 'time_on_site', label: 'Time on Site', icon: Clock, description: 'Track visitors who stay longer than X seconds' },
  { value: 'scroll_depth', label: 'Scroll Depth', icon: ArrowDown, description: 'Track visitors who scroll past X%' },
  { value: 'page_count', label: 'Page Count', icon: FileText, description: 'Track visitors who view X+ pages' },
];

interface GoalFormData {
  name: string;
  description: string;
  goal_type: Goal['goal_type'];
  goal_config: GoalConfig;
  value: string;
  status: Goal['status'];
}

const initialFormData: GoalFormData = {
  name: '',
  description: '',
  goal_type: 'url_visit',
  goal_config: {},
  value: '',
  status: 'active',
};

const GoalsPanel: React.FC = () => {
  const { goals, goalStats, loading, error, createGoal, updateGoal, deleteGoal, refetch } = useGoals();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState<GoalFormData>(initialFormData);
  const [saving, setSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      description: goal.description || '',
      goal_type: goal.goal_type,
      goal_config: goal.goal_config,
      value: goal.value?.toString() || '',
      status: goal.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const goalData = {
        name: formData.name,
        description: formData.description || null,
        goal_type: formData.goal_type,
        goal_config: formData.goal_config,
        value: formData.value ? parseFloat(formData.value) : null,
        status: formData.status,
      };

      if (editingGoal) {
        await updateGoal(editingGoal.id, goalData);
      } else {
        await createGoal(goalData);
      }

      setIsDialogOpen(false);
      setFormData(initialFormData);
    } catch (err) {
      console.error('Error saving goal:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(id);
    }
  };

  const handleStatusChange = async (id: string, status: Goal['status']) => {
    await updateGoal(id, { status });
  };

  const updateConfig = (key: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      goal_config: { ...prev.goal_config, [key]: value },
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-700">Paused</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-700">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getGoalIcon = (type: string) => {
    const goalType = GOAL_TYPES.find(t => t.value === type);
    const Icon = goalType?.icon || Target;
    return <Icon className="w-4 h-4" />;
  };

  const renderConfigFields = () => {
    switch (formData.goal_type) {
      case 'url_visit':
        return (
          <div className="space-y-3">
            <div>
              <Label>URL Pattern</Label>
              <Input
                placeholder="/pricing% or /contact"
                value={formData.goal_config.url_pattern || ''}
                onChange={(e) => updateConfig('url_pattern', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Use % as wildcard</p>
            </div>
            <div>
              <Label>Minimum Time on Page (seconds)</Label>
              <Input
                type="number"
                placeholder="10"
                value={formData.goal_config.min_time || ''}
                onChange={(e) => updateConfig('min_time', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        );
      
      case 'event':
        return (
          <div className="space-y-3">
            <div>
              <Label>Event Type</Label>
              <Select
                value={formData.goal_config.event_type || ''}
                onValueChange={(v) => updateConfig('event_type', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg">
                  <SelectItem value="cta_click">CTA Click</SelectItem>
                  <SelectItem value="form_start">Form Start</SelectItem>
                  <SelectItem value="form_submit">Form Submit</SelectItem>
                  <SelectItem value="chatbot_lead_captured">Chatbot Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Event Filter (JSON)</Label>
              <Input
                placeholder='{"ctaName": "Book"}'
                value={JSON.stringify(formData.goal_config.event_filter || {})}
                onChange={(e) => {
                  try {
                    const filter = JSON.parse(e.target.value || '{}');
                    setFormData(prev => ({
                      ...prev,
                      goal_config: { ...prev.goal_config, event_filter: filter },
                    }));
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
              />
            </div>
          </div>
        );
      
      case 'time_on_site':
        return (
          <div>
            <Label>Minimum Seconds</Label>
            <Input
              type="number"
              placeholder="180"
              value={formData.goal_config.min_seconds || ''}
              onChange={(e) => updateConfig('min_seconds', parseInt(e.target.value) || 0)}
            />
          </div>
        );
      
      case 'scroll_depth':
        return (
          <div className="space-y-3">
            <div>
              <Label>Minimum Scroll Depth (%)</Label>
              <Input
                type="number"
                placeholder="75"
                min="0"
                max="100"
                value={formData.goal_config.min_depth || ''}
                onChange={(e) => updateConfig('min_depth', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>URL Pattern (optional)</Label>
              <Input
                placeholder="/% for all pages"
                value={formData.goal_config.url_pattern || ''}
                onChange={(e) => updateConfig('url_pattern', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'page_count':
        return (
          <div>
            <Label>Minimum Pages</Label>
            <Input
              type="number"
              placeholder="3"
              value={formData.goal_config.min_pages || ''}
              onChange={(e) => updateConfig('min_pages', parseInt(e.target.value) || 0)}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  // Mini sparkline component
  const Sparkline: React.FC<{ data: { count: number }[] }> = ({ data }) => {
    const max = Math.max(...data.map(d => d.count), 1);
    return (
      <div className="flex items-end gap-0.5 h-6">
        {data.map((d, i) => (
          <div
            key={i}
            className="w-1.5 bg-[#B8956C]/60 rounded-t"
            style={{ height: `${Math.max((d.count / max) * 100, 4)}%` }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {goals.length} goals defined • {goalStats.filter(s => s.goal.status === 'active').length} active
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={refetch}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Create Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingGoal ? 'Edit Goal' : 'Create Goal'}</DialogTitle>
                <DialogDescription>
                  Define a conversion goal to track visitor actions.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Goal Name</Label>
                  <Input
                    required
                    placeholder="e.g., Pricing Page Visit"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Description (optional)</Label>
                  <Textarea
                    placeholder="Describe what this goal tracks..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Goal Type</Label>
                  <Select
                    value={formData.goal_type}
                    onValueChange={(v: Goal['goal_type']) => setFormData(prev => ({
                      ...prev,
                      goal_type: v,
                      goal_config: {},
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      {GOAL_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {GOAL_TYPES.find(t => t.value === formData.goal_type)?.description}
                  </p>
                </div>
                
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="text-sm font-medium mb-3">Configuration</h4>
                  {renderConfigFields()}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Goal Value ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="100"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v: Goal['status']) => setFormData(prev => ({ ...prev, status: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : (editingGoal ? 'Update' : 'Create')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Goals Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[300px]">Goal</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Completions</TableHead>
              <TableHead className="text-right">Today</TableHead>
              <TableHead className="text-right">Conv. Rate</TableHead>
              <TableHead>7-Day Trend</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-6" /></TableCell>
                </TableRow>
              ))
            ) : goalStats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No goals defined yet</p>
                  <p className="text-xs">Create your first goal to start tracking conversions</p>
                </TableCell>
              </TableRow>
            ) : (
              goalStats.map((stat) => (
                <TableRow key={stat.goal.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{stat.goal.name}</p>
                      {stat.goal.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {stat.goal.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getGoalIcon(stat.goal.goal_type)}
                      <span className="text-sm capitalize">
                        {stat.goal.goal_type.replace('_', ' ')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(stat.goal.status)}</TableCell>
                  <TableCell className="text-right font-medium">{stat.completions}</TableCell>
                  <TableCell className="text-right">
                    {stat.completionsToday > 0 ? (
                      <span className="text-green-600 flex items-center justify-end gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {stat.completionsToday}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{stat.conversionRate}%</TableCell>
                  <TableCell>
                    <Sparkline data={stat.trend} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background border shadow-lg">
                        <DropdownMenuItem onClick={() => handleOpenEdit(stat.goal)}>
                          Edit
                        </DropdownMenuItem>
                        {stat.goal.status === 'active' ? (
                          <DropdownMenuItem onClick={() => handleStatusChange(stat.goal.id, 'paused')}>
                            Pause
                          </DropdownMenuItem>
                        ) : stat.goal.status === 'paused' ? (
                          <DropdownMenuItem onClick={() => handleStatusChange(stat.goal.id, 'active')}>
                            Activate
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem onClick={() => handleStatusChange(stat.goal.id, 'archived')}>
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(stat.goal.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GoalsPanel;
