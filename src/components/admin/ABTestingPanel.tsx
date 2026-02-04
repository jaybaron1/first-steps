import React, { useState, useEffect } from 'react';
import { useABTests, ABExperiment, ABVariant, ABVariantResult } from '@/hooks/useABTests';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Play,
  Pause,
  Trash2,
  BarChart3,
  Trophy,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ABTestingPanel: React.FC = () => {
  const {
    experiments,
    loading,
    error,
    createExperiment,
    updateExperiment,
    deleteExperiment,
    getExperimentResults,
  } = useABTests();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);
  const [results, setResults] = useState<ABVariantResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  // New experiment form state
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSelector, setNewSelector] = useState('');
  const [newVariants, setNewVariants] = useState<ABVariant[]>([
    { id: 'control', name: 'Control', value: '', trafficPercent: 50 },
    { id: 'variant-b', name: 'Variant B', value: '', trafficPercent: 50 },
  ]);

  const loadResults = async (experimentId: string) => {
    setLoadingResults(true);
    const data = await getExperimentResults(experimentId);
    setResults(data);
    setLoadingResults(false);
  };

  useEffect(() => {
    if (selectedExperiment) {
      loadResults(selectedExperiment);
    }
  }, [selectedExperiment]);

  const handleCreate = async () => {
    const id = await createExperiment({
      name: newName,
      description: newDescription,
      element_selector: newSelector,
      variants: newVariants,
      status: 'draft',
    });

    if (id) {
      setIsCreateOpen(false);
      setNewName('');
      setNewDescription('');
      setNewSelector('');
      setNewVariants([
        { id: 'control', name: 'Control', value: '', trafficPercent: 50 },
        { id: 'variant-b', name: 'Variant B', value: '', trafficPercent: 50 },
      ]);
    }
  };

  const handleStatusChange = async (exp: ABExperiment, newStatus: string) => {
    await updateExperiment(exp.id, {
      status: newStatus,
      start_date: newStatus === 'running' ? new Date().toISOString() : exp.start_date,
      end_date: newStatus === 'completed' ? new Date().toISOString() : exp.end_date,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this experiment?')) {
      await deleteExperiment(id);
      if (selectedExperiment === id) {
        setSelectedExperiment(null);
        setResults([]);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-green-100 text-green-700">Running</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700">Completed</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-700">Paused</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 95) {
      return (
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {confidence}%
        </Badge>
      );
    }
    if (confidence >= 80) {
      return (
        <Badge className="bg-yellow-100 text-yellow-700">
          <AlertCircle className="w-3 h-3 mr-1" />
          {confidence}%
        </Badge>
      );
    }
    return <span className="text-muted-foreground">{confidence}%</span>;
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">A/B Experiments</h3>
          <p className="text-sm text-muted-foreground">
            Test different variations and measure their impact
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Experiment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Experiment</DialogTitle>
              <DialogDescription>
                Set up a new A/B test to compare different variations.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Experiment Name</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Hero CTA Copy Test"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="What are you testing?"
                />
              </div>

              <div className="space-y-2">
                <Label>Element Selector</Label>
                <Input
                  value={newSelector}
                  onChange={(e) => setNewSelector(e.target.value)}
                  placeholder="e.g., #hero-cta, .booking-button"
                />
              </div>

              <div className="space-y-2">
                <Label>Variants</Label>
                {newVariants.map((variant, i) => (
                  <div key={variant.id} className="flex gap-2">
                    <Input
                      value={variant.name}
                      onChange={(e) => {
                        const updated = [...newVariants];
                        updated[i].name = e.target.value;
                        setNewVariants(updated);
                      }}
                      placeholder="Variant name"
                      className="flex-1"
                    />
                    <Input
                      value={variant.value}
                      onChange={(e) => {
                        const updated = [...newVariants];
                        updated[i].value = e.target.value;
                        setNewVariants(updated);
                      }}
                      placeholder="Value/Copy"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={variant.trafficPercent}
                      onChange={(e) => {
                        const updated = [...newVariants];
                        updated[i].trafficPercent = parseInt(e.target.value) || 0;
                        setNewVariants(updated);
                      }}
                      placeholder="%"
                      className="w-20"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setNewVariants([
                      ...newVariants,
                      {
                        id: `variant-${newVariants.length}`,
                        name: `Variant ${String.fromCharCode(65 + newVariants.length)}`,
                        value: '',
                        trafficPercent: 0,
                      },
                    ])
                  }
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Variant
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!newName || !newSelector}>
                Create Experiment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Experiments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))
        ) : experiments.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-muted-foreground border rounded-lg">
            No experiments yet. Create your first A/B test to get started.
          </div>
        ) : (
          experiments.map((exp) => (
            <Card
              key={exp.id}
              className={`cursor-pointer transition-all ${
                selectedExperiment === exp.id
                  ? 'ring-2 ring-[#B8956C]'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedExperiment(exp.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{exp.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {exp.description || 'No description'}
                    </CardDescription>
                  </div>
                  {getStatusBadge(exp.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">
                    {exp.variants.length} variants • Created{' '}
                    {formatDistanceToNow(new Date(exp.created_at), { addSuffix: true })}
                  </div>
                  <div className="flex items-center gap-2">
                    {exp.status === 'draft' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(exp, 'running');
                        }}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    )}
                    {exp.status === 'running' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(exp, 'paused');
                        }}
                      >
                        <Pause className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(exp.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Results Panel */}
      {selectedExperiment && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#B8956C]" />
              <CardTitle className="text-base">Experiment Results</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {loadingResults ? (
              <Skeleton className="h-32" />
            ) : results.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No data yet. Start the experiment and wait for traffic.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variant</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Conversions</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Lift</TableHead>
                    <TableHead className="text-right">Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r, i) => {
                    const isWinner =
                      r.confidence >= 95 &&
                      r.conversionRate ===
                        Math.max(...results.map((x) => x.conversionRate));
                    return (
                      <TableRow key={r.variantId}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {isWinner && (
                              <Trophy className="w-4 h-4 text-amber-500" />
                            )}
                            <span className="font-medium">{r.variantName}</span>
                            {i === 0 && (
                              <Badge variant="outline" className="text-xs">
                                Control
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {r.views.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {r.conversions.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {r.conversionRate}%
                        </TableCell>
                        <TableCell className="text-right">
                          {i === 0 ? (
                            <span className="text-muted-foreground">Baseline</span>
                          ) : r.lift > 0 ? (
                            <span className="text-green-600 flex items-center justify-end gap-1">
                              <TrendingUp className="w-3 h-3" />+{r.lift}%
                            </span>
                          ) : (
                            <span className="text-red-600">{r.lift}%</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {i === 0 ? (
                            <span className="text-muted-foreground">—</span>
                          ) : (
                            getConfidenceBadge(r.confidence)
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ABTestingPanel;
