import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet, Globe, Laptop } from 'lucide-react';
import { useDeviceStats } from '@/hooks/useDeviceStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const deviceIcons: Record<string, React.ReactNode> = {
  desktop: <Monitor className="w-4 h-4" />,
  mobile: <Smartphone className="w-4 h-4" />,
  tablet: <Tablet className="w-4 h-4" />,
  laptop: <Laptop className="w-4 h-4" />,
  unknown: <Globe className="w-4 h-4" />,
};

const DeviceBrowserAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('7days');
  const { devices, browsers, operatingSystems, loading, error } = useDeviceStats(timeRange);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-[#F3EDE4] rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  const ProgressBar = ({ percentage, label, count }: { percentage: number; label: string; count: number }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-[#4A4640] font-medium">{label}</span>
        <span className="text-[#8C857A]">{count} ({percentage}%)</span>
      </div>
      <div className="h-2 bg-[#F3EDE4] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#B8956C] to-[#D4A574] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex gap-2">
        {(['today', '7days', '30days'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              timeRange === range
                ? 'bg-[#B8956C] text-white'
                : 'bg-[#F3EDE4] text-[#8C857A] hover:bg-[#E8E0D5]'
            }`}
          >
            {range === 'today' ? 'Today' : range === '7days' ? '7 Days' : '30 Days'}
          </button>
        ))}
      </div>

      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#F3EDE4]">
          <TabsTrigger value="devices" className="data-[state=active]:bg-white">Devices</TabsTrigger>
          <TabsTrigger value="browsers" className="data-[state=active]:bg-white">Browsers</TabsTrigger>
          <TabsTrigger value="os" className="data-[state=active]:bg-white">OS</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="mt-4 space-y-3">
          {devices.length === 0 ? (
            <p className="text-[#8C857A] text-sm text-center py-4">No device data available</p>
          ) : (
            devices.map((device) => (
              <div key={device.device_type} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#F3EDE4] text-[#B8956C]">
                  {deviceIcons[device.device_type.toLowerCase()] || deviceIcons.unknown}
                </div>
                <div className="flex-1">
                  <ProgressBar
                    percentage={device.percentage}
                    label={device.device_type}
                    count={device.count}
                  />
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="browsers" className="mt-4 space-y-3">
          {browsers.length === 0 ? (
            <p className="text-[#8C857A] text-sm text-center py-4">No browser data available</p>
          ) : (
            browsers.slice(0, 5).map((browser) => (
              <ProgressBar
                key={browser.browser}
                percentage={browser.percentage}
                label={browser.browser}
                count={browser.count}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="os" className="mt-4 space-y-3">
          {operatingSystems.length === 0 ? (
            <p className="text-[#8C857A] text-sm text-center py-4">No OS data available</p>
          ) : (
            operatingSystems.slice(0, 5).map((os) => (
              <ProgressBar
                key={os.os}
                percentage={os.percentage}
                label={os.os}
                count={os.count}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceBrowserAnalytics;
