
import React from 'react';
import { useDevices } from '@/store/DeviceStore';
import RoomDevices from '@/components/RoomDevices';
import VoiceInput from '@/components/VoiceInput';
import RecentCommands from '@/components/RecentCommands';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Mic, Lightbulb, Thermometer, WifiOff, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { loading, error, getAllRooms, devices, disconnectedDevices } = useDevices();
  const rooms = getAllRooms();

  const lightCount = devices.filter(d => d.type === 'LIGHT').length;
  const thermostatCount = devices.filter(d => d.type === 'THERMOSTAT').length;
  const onlineCount = devices.length - disconnectedDevices.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-butler-primary/20 mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        <p>{error}</p>
        <button className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-md">
          Erneut versuchen
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Smart Home Dashboard</h1>
        <Link to="/devices">
          <Button className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Zur Geräteverwaltung
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-butler-primary text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Ihr Zuhause
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-1">{rooms.length} Räume</p>
            <p className="text-sm opacity-90">{devices.length} verbundene Geräte</p>
            {disconnectedDevices.length > 0 && (
              <div className="mt-2 flex items-center text-sm bg-white/10 px-2 py-1 rounded-full w-fit">
                <WifiOff className="h-3 w-3 mr-1" />
                {disconnectedDevices.length} Offline
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
              Beleuchtung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-1">{lightCount} Lichter</p>
            <p className="text-sm text-muted-foreground">
              {devices.filter(d => d.type === 'LIGHT' && d.state.on).length} eingeschaltet
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-yellow-500 h-2.5 rounded-full" 
                style={{ width: `${(devices.filter(d => d.type === 'LIGHT' && d.state.on).length / Math.max(1, lightCount)) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Thermometer className="mr-2 h-5 w-5 text-red-400" />
              Klima
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-1">{thermostatCount} Thermostate</p>
            <p className="text-sm text-muted-foreground">
              Ø {(devices
                .filter(d => d.type === 'THERMOSTAT' && d.state.temperature)
                .reduce((sum, d) => sum + (d.state.temperature || 0), 0) / 
                Math.max(1, devices.filter(d => d.type === 'THERMOSTAT' && d.state.temperature).length)).toFixed(1)}°C
            </p>
            <div className="mt-2 flex items-center">
              <span className="text-xs text-blue-500 mr-1">18°C</span>
              <div className="flex-1 h-1.5 mx-2 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500"></div>
              <span className="text-xs text-red-500 ml-1">26°C</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-butler-primary border-l-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Mic className="mr-2 h-5 w-5 text-butler-primary" />
                Butler Assistent
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <VoiceInput />
            </CardContent>
          </Card>

          <div className="space-y-4">
            {rooms.map((room) => (
              <RoomDevices key={room} room={room} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <RecentCommands />
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Netzwerkstatus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Verbundene Geräte</p>
                  <p className="text-sm text-muted-foreground">Gesamt: {devices.length}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{onlineCount} Online</p>
                  <p className="text-sm text-red-500">{disconnectedDevices.length} Offline</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  style={{ width: `${(onlineCount / devices.length) * 100}%` }}
                ></div>
              </div>
              
              {disconnectedDevices.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Offline Geräte:</p>
                  <div className="space-y-2">
                    {disconnectedDevices.map(id => {
                      const device = devices.find(d => d.id === id);
                      return device && (
                        <div key={id} className="flex justify-between items-center text-sm p-2 bg-red-50 dark:bg-red-900/10 rounded">
                          <div className="flex items-center">
                            <WifiOff className="h-4 w-4 text-red-500 mr-2" />
                            <span>{device.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{device.room}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tipps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <span className="font-semibold block text-butler-primary">Neue Geräte hinzufügen:</span>
                Gehen Sie zur Geräteverwaltung, um neue Geräte im Netzwerk zu finden und zu verbinden.
              </p>
              <p>
                <span className="font-semibold block text-butler-primary">Szenen erstellen:</span>
                Definieren Sie Szenarien wie "Filmabend" oder "Guten Morgen", um mehrere Geräte gleichzeitig zu steuern.
              </p>
              <p>
                <span className="font-semibold block text-butler-primary">Sprachbefehle:</span>
                Versuchen Sie Befehle wie "Schalte das Licht im Wohnzimmer ein" oder "Wie warm ist es im Schlafzimmer?"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
