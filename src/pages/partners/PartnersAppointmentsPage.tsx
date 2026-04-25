import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import { usePartnersAuth } from "@/components/partners/PartnersRoute";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Calendar as CalIcon, List as ListIcon, Loader2, Download,
  ChevronLeft, ChevronRight, Copy, RefreshCw, MapPin, Link2, Trash2,
} from "lucide-react";

type Appointment = {
  id: string;
  client_id: string | null;
  partner_id: string | null;
  owner_id: string;
  title: string;
  scheduled_at: string;
  duration_minutes: number;
  location: string | null;
  meeting_link: string | null;
  status: string;
  notes: string | null;
  ics_uid: string;
  partner_clients?: { client_name: string } | null;
};

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });

const buildICS = (a: Appointment, clientName: string) => {
  const start = new Date(a.scheduled_at);
  const end = new Date(start.getTime() + (a.duration_minutes || 30) * 60000);
  const ts = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Galavanteer//Partners//EN",
    "BEGIN:VEVENT",
    `UID:${a.ics_uid}`,
    `DTSTAMP:${ts(new Date())}`,
    `DTSTART:${ts(start)}`,
    `DTEND:${ts(end)}`,
    `SUMMARY:${a.title} — ${clientName}`,
    a.location ? `LOCATION:${a.location}` : "",
    a.meeting_link ? `URL:${a.meeting_link}` : "",
    a.notes ? `DESCRIPTION:${a.notes.replace(/\n/g, "\\n")}` : "",
    "END:VEVENT", "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
};

const downloadICS = (a: Appointment, clientName: string) => {
  const blob = new Blob([buildICS(a, clientName)], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${a.title.replace(/[^a-z0-9]/gi, "_")}.ics`;
  link.click();
  URL.revokeObjectURL(url);
};

const PartnersAppointmentsPage: React.FC = () => {
  const { user, isAdmin } = usePartnersAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [view, setView] = useState<"list" | "calendar">("list");
  const [open, setOpen] = useState(false);
  const [feedOpen, setFeedOpen] = useState(false);
  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d;
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({
    client_id: "",
    title: "Discovery call",
    date: new Date().toISOString().slice(0, 10),
    time: "10:00",
    duration_minutes: 30,
    location: "",
    meeting_link: "",
    notes: "",
  });

  // Appointments list
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["partners-crm", "appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*, partner_clients(client_name)")
        .order("scheduled_at", { ascending: true });
      if (error) throw error;
      return (data || []) as Appointment[];
    },
  });

  // Clients for the dropdown
  const { data: clients = [] } = useQuery({
    queryKey: ["partners-crm", "clients-min"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partner_clients")
        .select("id, client_name, partner_id")
        .order("client_name");
      if (error) throw error;
      return data || [];
    },
  });

  // ICS feed token (for current user)
  const { data: tokenRow, refetch: refetchToken } = useQuery({
    queryKey: ["partners-crm", "ics-token", user.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("ics_feed_tokens")
        .select("token")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
  });

  const createMut = useMutation({
    mutationFn: async (vars: typeof form) => {
      const client = clients.find((c) => c.id === vars.client_id);
      const scheduled_at = new Date(`${vars.date}T${vars.time}:00`).toISOString();
      const { data, error } = await supabase
        .from("appointments")
        .insert({
          client_id: vars.client_id || null,
          partner_id: client?.partner_id || null,
          owner_id: user.id,
          title: vars.title,
          scheduled_at,
          duration_minutes: vars.duration_minutes,
          location: vars.location || null,
          meeting_link: vars.meeting_link || null,
          notes: vars.notes || null,
        })
        .select()
        .single();
      if (error) throw error;
      // Fire alert email (best-effort)
      supabase.functions.invoke("notify-appointment", {
        body: { appointment_id: data.id },
      }).catch(() => {});
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partners-crm", "appointments"] });
      toast({ title: "Appointment booked", description: "Email alert sent." });
      setOpen(false);
    },
    onError: (e: Error) =>
      toast({ title: "Could not save", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appointments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partners-crm", "appointments"] });
      toast({ title: "Appointment removed" });
      setDeleteId(null);
    },
  });

  const ensureTokenMut = useMutation({
    mutationFn: async (rotate: boolean) => {
      if (rotate && tokenRow) {
        await supabase.from("ics_feed_tokens").delete().eq("user_id", user.id);
      }
      const { data, error } = await supabase
        .from("ics_feed_tokens")
        .insert({ user_id: user.id })
        .select()
        .single();
      if (error && error.code !== "23505") throw error;
      await refetchToken();
      return data;
    },
    onSuccess: () => toast({ title: "Calendar feed ready" }),
  });

  const feedUrl = tokenRow?.token
    ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ics-feed?token=${tokenRow.token}`
    : "";
  const webcalUrl = feedUrl.replace(/^https?:\/\//, "webcal://");

  // Calendar grid data
  const calendarDays = useMemo(() => {
    const start = new Date(calMonth);
    const startDay = start.getDay();
    const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    const days: { date: Date; inMonth: boolean }[] = [];
    for (let i = 0; i < startDay; i++) {
      const d = new Date(start); d.setDate(d.getDate() - (startDay - i));
      days.push({ date: d, inMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(start); d.setDate(i);
      days.push({ date: d, inMonth: true });
    }
    while (days.length % 7 !== 0) {
      const last = days[days.length - 1].date;
      const d = new Date(last); d.setDate(d.getDate() + 1);
      days.push({ date: d, inMonth: false });
    }
    return days;
  }, [calMonth]);

  const apptsByDay = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const a of appointments) {
      const key = new Date(a.scheduled_at).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    }
    return map;
  }, [appointments]);

  const upcoming = appointments.filter((a) => new Date(a.scheduled_at) >= new Date());
  const past = appointments.filter((a) => new Date(a.scheduled_at) < new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Appointments
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isAdmin ? "All scheduled meetings across the team." : "Your scheduled meetings."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-0.5 rounded-md bg-slate-100 border border-slate-200">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs ${
                view === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs ${
                view === "calendar" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
              }`}
            >
              <CalIcon className="w-3.5 h-3.5" /> Calendar
            </button>
          </div>
          <Button
            variant="outline"
            onClick={() => setFeedOpen(true)}
            className="border-slate-200"
          >
            <CalIcon className="w-4 h-4" /> Subscribe
          </Button>
          <Button
            onClick={() => setOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            <Plus className="w-4 h-4" /> New appointment
          </Button>
        </div>
      </div>

      {view === "list" ? (
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-none overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Upcoming ({upcoming.length})
            </div>
            <div className="divide-y divide-slate-100">
              {isLoading ? (
                <div className="px-4 py-12 text-center text-slate-400 text-sm">Loading…</div>
              ) : upcoming.length === 0 ? (
                <div className="px-4 py-12 text-center text-slate-400 text-sm">No upcoming appointments.</div>
              ) : (
                upcoming.map((a) => (
                  <ApptRow
                    key={a.id} a={a}
                    onDownload={() => downloadICS(a, a.partner_clients?.client_name || "Client")}
                    onDelete={() => setDeleteId(a.id)}
                  />
                ))
              )}
            </div>
          </Card>

          {past.length > 0 && (
            <Card className="border-slate-200 shadow-none overflow-hidden opacity-75">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Past ({past.length})
              </div>
              <div className="divide-y divide-slate-100">
                {past.slice(-10).reverse().map((a) => (
                  <ApptRow
                    key={a.id} a={a}
                    onDownload={() => downloadICS(a, a.partner_clients?.client_name || "Client")}
                    onDelete={() => setDeleteId(a.id)}
                  />
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card className="border-slate-200 shadow-none">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900">
              {calMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const d = new Date(calMonth); d.setMonth(d.getMonth() - 1);
                  setCalMonth(d);
                }}
                className="p-1 rounded hover:bg-slate-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const d = new Date(); d.setDate(1); d.setHours(0,0,0,0);
                  setCalMonth(d);
                }}
                className="text-xs px-2 py-1 rounded hover:bg-slate-100"
              >
                Today
              </button>
              <button
                onClick={() => {
                  const d = new Date(calMonth); d.setMonth(d.getMonth() + 1);
                  setCalMonth(d);
                }}
                className="p-1 rounded hover:bg-slate-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
              <div key={d} className="text-[10px] uppercase tracking-wider text-slate-500 font-medium px-2 py-1.5 text-center">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map(({ date, inMonth }, i) => {
              const isToday = date.toDateString() === new Date().toDateString();
              const dayAppts = apptsByDay.get(date.toDateString()) || [];
              return (
                <div
                  key={i}
                  className={`min-h-[100px] border-r border-b border-slate-100 p-1.5 ${
                    inMonth ? "bg-white" : "bg-slate-50/50"
                  }`}
                >
                  <div className={`text-xs mb-1 ${
                    isToday ? "text-slate-900 font-bold" : inMonth ? "text-slate-700" : "text-slate-400"
                  }`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-0.5">
                    {dayAppts.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        className="text-[10px] bg-amber-50 border-l-2 border-amber-600 px-1.5 py-0.5 rounded-r truncate"
                        title={`${a.title} — ${a.partner_clients?.client_name || ""}`}
                      >
                        <span className="font-medium">{new Date(a.scheduled_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>
                        {" "}{a.title}
                      </div>
                    ))}
                    {dayAppts.length > 3 && (
                      <div className="text-[10px] text-slate-500 px-1.5">+{dayAppts.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* New Appointment Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New appointment</DialogTitle>
            <DialogDescription>
              Logs the meeting and emails an alert (with .ics) to admin and the owning SDR.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => { e.preventDefault(); createMut.mutate(form); }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label className="text-xs">Client *</Label>
              <Select value={form.client_id} onValueChange={(v) => setForm((f) => ({ ...f, client_id: v }))}>
                <SelectTrigger className="h-10 border-slate-200"><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.client_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Title *</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required className="h-10 border-slate-200" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Date *</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required className="h-10 border-slate-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Time *</Label>
                <Input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} required className="h-10 border-slate-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Duration (min)</Label>
                <Input type="number" min={5} max={480} value={form.duration_minutes} onChange={(e) => setForm((f) => ({ ...f, duration_minutes: Number(e.target.value) }))} className="h-10 border-slate-200" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Location / link</Label>
              <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Office, Zoom, phone…" className="h-10 border-slate-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Meeting URL</Label>
              <Input type="url" value={form.meeting_link} onChange={(e) => setForm((f) => ({ ...f, meeting_link: e.target.value }))} placeholder="https://…" className="h-10 border-slate-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={3} className="border-slate-200" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-slate-200">Cancel</Button>
              <Button type="submit" disabled={createMut.isPending || !form.client_id} className="bg-slate-900 hover:bg-slate-800 text-white">
                {createMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Book appointment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Subscribe Feed Dialog */}
      <Dialog open={feedOpen} onOpenChange={setFeedOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Subscribe to your calendar feed</DialogTitle>
            <DialogDescription>
              Auto-syncs to Apple Calendar, Google Calendar, Outlook. {isAdmin ? "Shows all appointments." : "Shows only yours."}
            </DialogDescription>
          </DialogHeader>
          {!tokenRow ? (
            <div className="py-4 text-center">
              <Button onClick={() => ensureTokenMut.mutate(false)} className="bg-slate-900 hover:bg-slate-800 text-white">
                Generate my secret feed URL
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-slate-700">Subscribe URL (recommended)</Label>
                <div className="flex gap-2 mt-1">
                  <Input readOnly value={webcalUrl} className="h-10 border-slate-200 font-mono text-xs" />
                  <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(webcalUrl); toast({ title: "Copied" }); }} className="border-slate-200">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Click on Mac/iPhone to add to Apple Calendar instantly.</p>
              </div>
              <div>
                <Label className="text-xs text-slate-700">HTTPS URL (Google Calendar)</Label>
                <div className="flex gap-2 mt-1">
                  <Input readOnly value={feedUrl} className="h-10 border-slate-200 font-mono text-xs" />
                  <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(feedUrl); toast({ title: "Copied" }); }} className="border-slate-200">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">In Google Calendar → Other calendars → From URL.</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded p-3">
                <p className="text-[11px] text-amber-900">
                  <strong>Keep this URL private.</strong> Anyone with it can read your calendar.
                </p>
              </div>
              <Button variant="outline" onClick={() => ensureTokenMut.mutate(true)} className="w-full border-slate-200">
                <RefreshCw className="w-3.5 h-3.5" /> Rotate URL (invalidates the old one)
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove this appointment?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="border-slate-200">Cancel</Button>
            <Button onClick={() => deleteId && deleteMut.mutate(deleteId)} className="bg-red-600 hover:bg-red-700 text-white">
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ApptRow: React.FC<{ a: Appointment; onDownload: () => void; onDelete: () => void }> = ({ a, onDownload, onDelete }) => (
  <div className="px-4 py-3 hover:bg-slate-50 flex items-start gap-4">
    <div className="text-center w-14 flex-shrink-0">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
        {new Date(a.scheduled_at).toLocaleString("en-US", { month: "short" })}
      </div>
      <div className="text-xl font-semibold text-slate-900 tabular-nums">
        {new Date(a.scheduled_at).getDate()}
      </div>
      <div className="text-[10px] text-slate-500 tabular-nums">
        {new Date(a.scheduled_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-slate-900 text-sm">{a.title}</p>
      <p className="text-xs text-slate-500 mt-0.5">
        {a.partner_clients?.client_name || "—"} · {a.duration_minutes}min
      </p>
      <div className="flex flex-wrap gap-3 mt-1.5 text-[11px] text-slate-500">
        {a.location && (
          <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{a.location}</span>
        )}
        {a.meeting_link && (
          <a href={a.meeting_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900">
            <Link2 className="w-3 h-3" /> Join
          </a>
        )}
      </div>
    </div>
    <div className="flex items-center gap-1 flex-shrink-0">
      <button onClick={onDownload} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900" title="Download .ics">
        <Download className="w-3.5 h-3.5" />
      </button>
      <button onClick={onDelete} className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600" title="Remove">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

export default PartnersAppointmentsPage;
