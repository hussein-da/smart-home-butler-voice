
import React from 'react';
import { useDevices } from '@/store/DeviceStore';
import RoomDevices from '@/components/RoomDevices';
import VoiceInput from '@/components/VoiceInput';
import RecentCommands from '@/components/RecentCommands';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Mic, Lightbulb, Thermometer } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { loading, error, getAllRooms, devices } = useDevices();
  const rooms = getAllRooms();

  const lightCount = devices.filter(d => d.type === 'LIGHT').length;
  const thermostatCount = devices.filter(d => d.type === 'THERMOSTAT').length;

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
              <CardTitle className="text-lg">Tipps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <span className="font-semibold block text-butler-primary">Sprachbefehle:</span>
                Versuchen Sie Befehle wie "Schalte das Licht im Wohnzimmer ein" oder "Wie warm ist es im Schlafzimmer?"
              </p>
              <p>
                <span className="font-semibold block text-butler-primary">Gerätesteuerung:</span>
                Tippen Sie auf ein Gerät, um es direkt zu steuern oder seinen Status zu ändern.
              </p>
              <p>
                <span className="font-semibold block text-butler-primary">Raumbasiert:</span>
                Alle Geräte sind nach Räumen gruppiert. Klappen Sie einen Raum auf, um alle enthaltenen Geräte zu sehen.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
