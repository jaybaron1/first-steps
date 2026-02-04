import React, { useState } from "react";
import { Shield, ShieldCheck, ShieldX, Activity, Users } from "lucide-react";
import { useSecurityEvents } from "@/hooks/useSecurityEvents";
import LoginAttemptsLog from "@/components/admin/LoginAttemptsLog";
import SecurityAlertsPanel from "@/components/admin/SecurityAlertsPanel";
import StatsCard from "@/components/admin/StatsCard";
import { Badge } from "@/components/ui/badge";

const SecurityPage: React.FC = () => {
  const [days, setDays] = useState(7);
  const {
    loginAttempts,
    totalLoginAttempts,
    successfulLogins,
    failedLogins,
    failedLoginRate,
    alerts,
    auditLog,
    recentActivity,
    loading,
  } = useSecurityEvents(days);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-[#1A1915]">
            Security Dashboard
          </h1>
          <p className="text-sm text-[#8C857A] mt-1">
            Monitor authentication and security events
          </p>
        </div>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3 py-2 rounded-lg border border-[#B8956C]/20 bg-white text-sm text-[#4A4640] focus:outline-none focus:ring-2 focus:ring-[#B8956C]/30"
        >
          <option value={1}>Last 24 hours</option>
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Login Attempts"
          value={totalLoginAttempts}
          icon={Users}
          loading={loading}
        />
        <StatsCard
          label="Successful Logins"
          value={successfulLogins}
          icon={ShieldCheck}
          loading={loading}
          accentColor="text-emerald-600"
        />
        <StatsCard
          label="Failed Logins"
          value={failedLogins}
          icon={ShieldX}
          loading={loading}
          accentColor={failedLogins > 10 ? "text-red-600" : "text-amber-600"}
        />
        <StatsCard
          label="Failure Rate"
          value={`${failedLoginRate}%`}
          icon={Activity}
          loading={loading}
          accentColor={
            failedLoginRate > 30
              ? "text-red-600"
              : failedLoginRate > 10
              ? "text-amber-600"
              : "text-emerald-600"
          }
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LoginAttemptsLog attempts={loginAttempts} loading={loading} />
        </div>
        <div>
          <SecurityAlertsPanel alerts={alerts} loading={loading} />
        </div>
      </div>

      {/* Activity Summary */}
      {recentActivity.length > 0 && (
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#F3EDE4] rounded-lg">
              <Activity className="w-5 h-5 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#1A1915]">Activity Summary</h3>
              <p className="text-sm text-[#8C857A]">Security events by type</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.action}
                className="flex items-center gap-2 px-4 py-2 bg-[#F3EDE4] rounded-lg"
              >
                <span className="text-sm font-medium text-[#4A4640]">
                  {activity.action.replace(/_/g, " ")}
                </span>
                <Badge variant="outline" className="border-[#B8956C]/30">
                  {activity.count}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Log Preview */}
      {auditLog.length > 0 && (
        <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#F3EDE4] rounded-lg">
              <Shield className="w-5 h-5 text-[#B8956C]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#1A1915]">Recent Audit Log</h3>
              <p className="text-sm text-[#8C857A]">Last 10 security events</p>
            </div>
          </div>

          <div className="space-y-2">
            {auditLog.slice(0, 10).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-[#FDFBF7] rounded-lg hover:bg-[#F3EDE4] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-white">
                    {entry.action.replace(/_/g, " ")}
                  </Badge>
                  {entry.user_email && (
                    <span className="text-sm text-[#4A4640]">{entry.user_email}</span>
                  )}
                </div>
                <span className="text-xs text-[#8C857A]">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityPage;
