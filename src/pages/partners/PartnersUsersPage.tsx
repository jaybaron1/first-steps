import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import { usePartnersAuth } from "@/components/partners/PartnersRoute";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2, Trash2, ShieldCheck, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { formatDate } from "@/lib/partnersFormat";

type TeamUser = {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
};

const callFn = async <T,>(action: string, payload: Record<string, unknown> = {}): Promise<T> => {
  const { data, error } = await supabase.functions.invoke("manage-team-users", {
    body: { action, ...payload },
  });
  if (error) throw new Error(error.message || "Request failed");
  if (data?.error) throw new Error(data.error);
  return data as T;
};

const generatePassword = () => {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*";
  let out = "";
  const arr = new Uint32Array(16);
  crypto.getRandomValues(arr);
  for (let i = 0; i < 16; i++) out += chars[arr[i] % chars.length];
  return out;
};

const PartnersUsersPage: React.FC = () => {
  const { isAdmin, user: currentUser } = usePartnersAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["partners-crm", "team-users"],
    enabled: isAdmin,
    queryFn: () => callFn<{ users: TeamUser[] }>("list"),
  });
  const users = data?.users || [];

  const [open, setOpen] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: generatePassword(),
    role: "sdr" as "admin" | "sdr",
  });
  const [deleteUser, setDeleteUser] = useState<TeamUser | null>(null);
  const [createdCreds, setCreatedCreds] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const inviteMut = useMutation({
    mutationFn: (vars: typeof form) => callFn("invite", vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partners-crm", "team-users"] });
      setCreatedCreds({ email: form.email, password: form.password });
      setOpen(false);
      setForm({ email: "", password: generatePassword(), role: "sdr" });
    },
    onError: (e: Error) => {
      toast({ title: "Could not invite", description: e.message, variant: "destructive" });
    },
  });

  const setRoleMut = useMutation({
    mutationFn: (vars: { user_id: string; role: "admin" | "sdr" }) =>
      callFn("set_role", vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partners-crm", "team-users"] });
      toast({ title: "Role added" });
    },
    onError: (e: Error) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const removeRoleMut = useMutation({
    mutationFn: (vars: { user_id: string; role: "admin" | "sdr" }) =>
      callFn("remove_role", vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partners-crm", "team-users"] });
      toast({ title: "Role removed" });
    },
    onError: (e: Error) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: (vars: { user_id: string }) => callFn("delete_user", vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partners-crm", "team-users"] });
      toast({ title: "User deleted" });
      setDeleteUser(null);
    },
    onError: (e: Error) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (!isAdmin) {
    return (
      <Card className="p-8 border-slate-200 shadow-none text-center">
        <p className="text-sm text-slate-600">
          Only administrators can manage team users.
        </p>
      </Card>
    );
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || form.password.length < 12) {
      toast({
        title: "Invalid input",
        description: "Email required and password must be 12+ characters.",
        variant: "destructive",
      });
      return;
    }
    inviteMut.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Team users
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Provision admin and SDR accounts for the Partners CRM.
          </p>
        </div>
        <Button
          onClick={() => {
            setForm({ email: "", password: generatePassword(), role: "sdr" });
            setOpen(true);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white"
        >
          <Plus className="w-4 h-4" />
          Invite user
        </Button>
      </div>

      <Card className="border-slate-200 shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Roles</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Created</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Last sign-in</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400 text-sm">Loading…</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-red-600 text-sm">
                  {(error as Error).message}
                </td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400 text-sm">No team users yet.</td></tr>
              ) : (
                users.map((u) => {
                  const isSelf = u.id === currentUser.id;
                  const hasAdmin = u.roles.includes("admin");
                  const hasSdr = u.roles.includes("sdr");
                  return (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900 break-all">
                          {u.email || "—"}
                          {isSelf && (
                            <span className="ml-2 text-[10px] text-slate-400 uppercase tracking-wider">you</span>
                          )}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {hasAdmin && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium border bg-slate-900 text-white border-slate-900">
                              <ShieldCheck className="w-3 h-3" /> Admin
                            </span>
                          )}
                          {hasSdr && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium border bg-slate-100 text-slate-700 border-slate-200">
                              <UserIcon className="w-3 h-3" /> SDR
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 tabular-nums">{formatDate(u.created_at)}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 tabular-nums">
                        {u.last_sign_in_at ? formatDate(u.last_sign_in_at) : "Never"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1 flex-wrap">
                          {!hasAdmin && (
                            <button
                              onClick={() => setRoleMut.mutate({ user_id: u.id, role: "admin" })}
                              className="text-[11px] px-2 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-100"
                            >
                              + Admin
                            </button>
                          )}
                          {hasAdmin && !isSelf && (
                            <button
                              onClick={() => removeRoleMut.mutate({ user_id: u.id, role: "admin" })}
                              className="text-[11px] px-2 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-100"
                            >
                              − Admin
                            </button>
                          )}
                          {!hasSdr && (
                            <button
                              onClick={() => setRoleMut.mutate({ user_id: u.id, role: "sdr" })}
                              className="text-[11px] px-2 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-100"
                            >
                              + SDR
                            </button>
                          )}
                          {hasSdr && (
                            <button
                              onClick={() => removeRoleMut.mutate({ user_id: u.id, role: "sdr" })}
                              className="text-[11px] px-2 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-100"
                            >
                              − SDR
                            </button>
                          )}
                          {!isSelf && (
                            <button
                              onClick={() => setDeleteUser(u)}
                              className="p-1 rounded hover:bg-red-50 text-slate-500 hover:text-red-600"
                              aria-label="Delete user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4 border-slate-200 shadow-none bg-slate-50/50">
        <p className="text-xs text-slate-600">
          <strong className="text-slate-900">How roles work:</strong> Admins see and manage everything.
          SDRs see only the partners and clients they own. Roles take effect immediately.
          Newly created users can sign in at <code className="text-[11px] bg-white px-1 py-0.5 rounded border border-slate-200">/partners/login</code>.
        </p>
      </Card>

      {/* Invite dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite team user</DialogTitle>
            <DialogDescription>
              Creates an account with the password below. Share the credentials securely.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-700">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="h-10 border-slate-200"
                placeholder="user@company.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-700">Temporary password</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="h-10 border-slate-200 pr-10 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForm((f) => ({ ...f, password: generatePassword() }))}
                  className="border-slate-200 text-xs"
                >
                  Regenerate
                </Button>
              </div>
              <p className="text-[11px] text-slate-400">Min 12 characters.</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-700">Role</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm((f) => ({ ...f, role: v as "admin" | "sdr" }))}
              >
                <SelectTrigger className="h-10 border-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sdr">SDR — sees only their own records</SelectItem>
                  <SelectItem value="admin">Admin — full access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-slate-200">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={inviteMut.isPending}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                {inviteMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create user"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Created credentials display */}
      <Dialog open={!!createdCreds} onOpenChange={(o) => !o && setCreatedCreds(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User created</DialogTitle>
            <DialogDescription>
              Share these credentials securely. The password will not be shown again.
            </DialogDescription>
          </DialogHeader>
          {createdCreds && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-2 font-mono text-xs">
                <div>
                  <span className="text-slate-500">Email:</span>{" "}
                  <span className="text-slate-900">{createdCreds.email}</span>
                </div>
                <div>
                  <span className="text-slate-500">Password:</span>{" "}
                  <span className="text-slate-900">{createdCreds.password}</span>
                </div>
                <div>
                  <span className="text-slate-500">Login:</span>{" "}
                  <span className="text-slate-900">{window.location.origin}/partners/login</span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Partners CRM access\nLogin: ${window.location.origin}/partners/login\nEmail: ${createdCreds.email}\nPassword: ${createdCreds.password}`,
                  );
                  toast({ title: "Copied to clipboard" });
                }}
                className="w-full border-slate-200"
              >
                Copy credentials
              </Button>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setCreatedCreds(null)} className="bg-slate-900 hover:bg-slate-800 text-white">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteUser} onOpenChange={(o) => !o && setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes <strong>{deleteUser?.email}</strong> and all their roles.
              Their owned partners and clients remain in the database but become orphaned. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUser && deleteMut.mutate({ user_id: deleteUser.id })}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PartnersUsersPage;
