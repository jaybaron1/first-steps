import React from "react";
import { AlertTriangle, ShieldAlert, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface SecurityAlert {
  id: string;
  type: "failed_login" | "rate_limit" | "suspicious_activity";
  severity: "low" | "medium" | "high";
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface SecurityAlertsPanelProps {
  alerts: SecurityAlert[];
  loading?: boolean;
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case "failed_login":
      return ShieldAlert;
    case "rate_limit":
      return AlertCircle;
    default:
      return AlertTriangle;
  }
};

const getSeverityStyles = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-red-50 border-red-200 text-red-700";
    case "medium":
      return "bg-amber-50 border-amber-200 text-amber-700";
    default:
      return "bg-blue-50 border-blue-200 text-blue-700";
  }
};

const SecurityAlertsPanel: React.FC<SecurityAlertsPanelProps> = ({ alerts, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg">
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#B8956C]/20 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1A1915]">Security Alerts</h3>
            <p className="text-sm text-[#8C857A]">Potential security concerns</p>
          </div>
        </div>
        
        {alerts.length > 0 && (
          <Badge className="bg-red-100 text-red-700 border-0">
            {alerts.length} Active
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-[#8C857A]">
            <div className="text-center">
              <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              <p className="text-sm">No security alerts</p>
              <p className="text-xs text-[#8C857A]">All systems secure</p>
            </div>
          </div>
        ) : (
          alerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border ${getSeverityStyles(alert.severity)} transition-all hover:shadow-sm`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className="text-xs py-0">
                        {alert.type.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-xs opacity-70 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`shrink-0 capitalize ${
                      alert.severity === "high" 
                        ? "border-red-300" 
                        : alert.severity === "medium" 
                        ? "border-amber-300" 
                        : "border-blue-300"
                    }`}
                  >
                    {alert.severity}
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SecurityAlertsPanel;
