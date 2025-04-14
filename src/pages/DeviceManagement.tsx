
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeviceDiscovery from '@/components/DeviceDiscovery';
import SceneManager from '@/components/SceneManager';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDevices } from '@/store/DeviceStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { WifiOff, AlertCircle } from 'lucide-react';

const DeviceManagement: React.FC = () => {
  const { devices, deviceUsageStats, disconnectedDevices } = useDevices();
  
  // Prepare data for charts
  const devicesByType = devices.reduce((acc, device) => {
    acc[device.type] = (acc[device.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const typeData = Object.entries(devicesByType).map(([type, count]) => ({
    type,
    count
  }));
  
  const roomData = devices.reduce((acc, device) => {
    acc[device.room] = (acc[device.room] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const roomChartData = Object.entries(roomData).map(([room, count]) => ({
    room,
    count
  }));
  
  // Mock usage data
  const usageData = [
    { time: '00:00', usage: 2 },
    { time: '03:00', usage: 1 },
    { time: '06:00', usage: 3 },
    { time: '09:00', usage: 5 },
    { time: '12:00', usage: 4 },
    { time: '15:00', usage: 6 },
    { time: '18:00', usage: 8 },
    { time: '21:00', usage: 5 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Geräteverwaltung</h1>
      
      {disconnectedDevices.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Verbindungsprobleme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {disconnectedDevices.length} {disconnectedDevices.length === 1 ? 'Gerät ist' : 'Geräte sind'} derzeit nicht erreichbar.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {disconnectedDevices.map(id => {
                const device = devices.find(d => d.id === id);
                return device && (
                  <div 
                    key={id} 
                    className="flex items-center px-2 py-1 bg-red-100 dark:bg-red-900/20 rounded-full text-xs"
                  >
                    <WifiOff className="h-3 w-3 mr-1 text-red-500" />
                    {device.name}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="devices">Geräte</TabsTrigger>
          <TabsTrigger value="scenes">Szenen</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Geräteübersicht</CardTitle>
                <CardDescription>
                  Verteilung nach Typ und Raum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={typeData}>
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Raumübersicht</CardTitle>
                <CardDescription>
                  Geräte pro Raum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roomChartData}>
                      <XAxis dataKey="room" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Nutzungsstatistik</CardTitle>
              <CardDescription>
                Aktivität der letzten 24 Stunden
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="usage" 
                      stroke="#8884d8" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Gerätenutzung</CardTitle>
              <CardDescription>
                Top 5 am meisten genutzte Geräte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {devices
                  .filter(d => deviceUsageStats[d.id]?.usageTime > 0)
                  .sort((a, b) => (deviceUsageStats[b.id]?.usageTime || 0) - (deviceUsageStats[a.id]?.usageTime || 0))
                  .slice(0, 5)
                  .map(device => (
                    <div key={device.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-muted-foreground">{device.room}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{deviceUsageStats[device.id]?.usageTime || 0} Min</p>
                        <p className="text-sm text-muted-foreground">Nutzungszeit</p>
                      </div>
                    </div>
                  ))}
                
                {devices.filter(d => deviceUsageStats[d.id]?.usageTime > 0).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Keine Nutzungsdaten verfügbar
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="devices">
          <DeviceDiscovery />
        </TabsContent>
        
        <TabsContent value="scenes">
          <SceneManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceManagement;
