import React, { useState } from 'react';
import { useLeads, Lead } from '@/hooks/useLeads';
import LeadTemperatureBadge from './LeadTemperatureBadge';
import PaginationControls from './PaginationControls';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Mail,
  Phone,
  Building,
  Clock,
  MapPin,
  Briefcase,
  Users,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'converted'];
const SOURCE_OPTIONS = ['chatbot', 'form', 'contact'];
const PAGE_SIZE = 10;

const LeadsPanel: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'lead_score'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  const { leads, loading, error, totalCount, totalPages, refetch, updateLeadStatus, deleteLead } = useLeads({
    search: search.trim() || undefined,
    status: statusFilter !== 'all' ? [statusFilter] : undefined,
    source: sourceFilter !== 'all' ? [sourceFilter] : undefined,
    sortBy,
    sortOrder,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const handleDeleteClick = (lead: Lead) => {
    setLeadToDelete(lead);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (leadToDelete) {
      await deleteLead(leadToDelete.id);
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    await updateLeadStatus(leadId, newStatus);
  };

  const toggleSort = (field: 'created_at' | 'lead_score') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusBadgeColor = (status: string | null) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'contacted': return 'bg-yellow-100 text-yellow-700';
      case 'qualified': return 'bg-purple-100 text-purple-700';
      case 'converted': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatEntryPage = (url: string) => {
    if (url === '/' || url === 'Direct') return 'Homepage';
    return url.replace(/^\//, '').split('/')[0] || 'Homepage';
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg">
            <SelectItem value="all">All Status</SelectItem>
            {STATUS_OPTIONS.map(s => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg">
            <SelectItem value="all">All Sources</SelectItem>
            {SOURCE_OPTIONS.map(s => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{totalCount} total leads</span>
        <span>•</span>
        <span>Showing {leads.length}</span>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[250px]">Contact</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted"
                onClick={() => toggleSort('lead_score')}
              >
                <div className="flex items-center gap-1">
                  Score
                  {sortBy === 'lead_score' && (
                    sortOrder === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                  )}
                </div>
              </TableHead>
              <TableHead>Journey</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted"
                onClick={() => toggleSort('created_at')}
              >
                <div className="flex items-center gap-1">
                  Created
                  {sortBy === 'created_at' && (
                    sortOrder === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-6" /></TableCell>
                </TableRow>
              ))
            ) : leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No leads found
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <React.Fragment key={lead.id}>
                  <TableRow 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{lead.name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{lead.email || 'No email'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {lead.source || 'unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(lead.status)}>
                        {lead.status || 'new'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <LeadTemperatureBadge score={lead.lead_score || 0} />
                        <span className="text-sm text-muted-foreground">{lead.lead_score || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{lead.page_views_count || 0} pages</p>
                        <p className="text-muted-foreground text-xs">
                          via {formatEntryPage(lead.entry_page || '/')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {lead.created_at 
                          ? formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })
                          : 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border shadow-lg">
                          {STATUS_OPTIONS.map(status => (
                            <DropdownMenuItem 
                              key={status}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(lead.id, status);
                              }}
                              className="capitalize"
                            >
                              Mark as {status}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(lead);
                            }}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Lead
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row */}
                  {expandedLead === lead.id && (
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={7}>
                        <div className="py-4 px-2 space-y-3">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {lead.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span>{lead.email}</span>
                              </div>
                            )}
                            {lead.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{lead.phone}</span>
                              </div>
                            )}
                            {lead.company && (
                              <div className="flex items-center gap-2">
                                <Building className="w-4 h-4 text-muted-foreground" />
                                <span>{lead.company}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{Math.round((lead.total_time_seconds || 0) / 60)} min on site</span>
                            </div>
                          </div>
                          
                          {/* Company Enrichment Data */}
                          {(lead.company_name || lead.company_industry || lead.company_size) && (
                            <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-primary">Enriched Company Data</span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                {lead.company_name && (
                                  <div className="flex items-center gap-2">
                                    <Building className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">{lead.company_name}</span>
                                  </div>
                                )}
                                {lead.company_size && (
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    <Badge variant="secondary">{lead.company_size}</Badge>
                                  </div>
                                )}
                                {lead.company_industry && (
                                  <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                                    <Badge variant="outline">{lead.company_industry}</Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {lead.message && (
                            <div className="bg-background rounded-lg p-3 border">
                              <p className="text-sm text-muted-foreground mb-1">Message:</p>
                              <p className="text-sm">{lead.message}</p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        onPageChange={(page) => {
          setCurrentPage(page);
          setExpandedLead(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the lead "{leadToDelete?.name || leadToDelete?.email || 'Unknown'}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeadsPanel;
