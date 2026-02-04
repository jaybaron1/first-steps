import React from "react";
import { ShieldCheck, ShieldX, User, Clock, Monitor } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNow } from "date-fns";

interface LoginAttempt {
  id: string;
  timestamp: string;
  email: string;
  status: "success" | "failed";
  ip_address?: string;
  user_agent?: string;
}

interface LoginAttemptsLogProps {
  attempts: LoginAttempt[];
  loading?: boolean;
}

const LoginAttemptsLog: React.FC<LoginAttemptsLogProps> = ({ attempts, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-[#B8956C]/10">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#B8956C]/20 rounded-2xl overflow-hidden shadow-lg">
      <div className="p-6 border-b border-[#B8956C]/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#F3EDE4] rounded-lg">
            <ShieldCheck className="w-5 h-5 text-[#B8956C]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1A1915]">Login Attempts</h3>
            <p className="text-sm text-[#8C857A]">Admin authentication history</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#FDFBF7]">
              <TableHead className="font-semibold text-[#4A4640]">Status</TableHead>
              <TableHead className="font-semibold text-[#4A4640]">User</TableHead>
              <TableHead className="font-semibold text-[#4A4640]">Time</TableHead>
              <TableHead className="font-semibold text-[#4A4640]">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attempts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-[#8C857A]">
                  No login attempts recorded
                </TableCell>
              </TableRow>
            ) : (
              attempts.slice(0, 20).map((attempt) => (
                <TableRow key={attempt.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                  <TableCell>
                    {attempt.status === "success" ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-0">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Success
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 border-0">
                        <ShieldX className="w-3 h-3 mr-1" />
                        Failed
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#F3EDE4] rounded-full">
                        <User className="w-3 h-3 text-[#B8956C]" />
                      </div>
                      <span className="text-sm font-medium text-[#1A1915]">{attempt.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-[#4A4640]">
                      <Clock className="w-3 h-3 text-[#8C857A]" />
                      <span title={format(new Date(attempt.timestamp), "PPpp")}>
                        {formatDistanceToNow(new Date(attempt.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono text-[#8C857A]">
                      {attempt.ip_address || "—"}
                    </span>
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

export default LoginAttemptsLog;
