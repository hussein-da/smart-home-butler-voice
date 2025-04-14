
import React, { useState } from 'react';
import { useDevices } from '@/store/DeviceStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, Wifi, WifiOff, Plus, RefreshCw } from 'lucide-react';
import { Room } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const DeviceDiscovery: React.FC = () => {
  const { devices, discoverDevices, pairDevice, loading } = useDevices();
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room>('Wohnzimmer');

  const handleDiscover = async () => {
    setIsDiscovering(true);
    try {
      // Simulate device discovery
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate some mock discovered devices
      const mockDevices = [
        {
          name: "Philips Hue Bulb",
          type: "LIGHT",
          macAddress: "AB:CD:EF:12:34:56",
          ipAddress: "192.168.1.101",
          manufacturer: "Philips",
          model: "Hue White A19"
        },
        {
          name: "Nest Thermostat",
          type: "THERMOSTAT",
          macAddress: "12:34:56:78:9A:BC",
          ipAddress: "192.168.1.102",
          manufacturer: "Google",
          model: "Nest Learning Thermostat"
        },
        {
          name: "Smart Plug",
          type: "SWITCH",
          macAddress: "98:76:54:32:10:AB",
          ipAddress: "192.168.1.103",
          manufacturer: "TP-Link",
          model: "Kasa Smart Wi-Fi Plug"
        },
        {
          name: "LIFX Color Bulb",
          type: "LIGHT",
          macAddress: "FE:DC:BA:98:76:54",
          ipAddress: "192.168.1.104",
          manufacturer: "LIFX",
          model: "A19 Color"
        },
        {
          name: "Ecobee Thermostat",
          type: "THERMOSTAT",
          macAddress: "54:32:10:FE:DC:BA",
          ipAddress: "192.168.1.105",
          manufacturer: "Ecobee",
          model: "SmartThermostat"
        }
      ];
      
      setDiscoveredDevices(mockDevices);
      toast({
        title: "Gerätesuche abgeschlossen",
        description: `${mockDevices.length} neue Geräte im Netzwerk gefunden.`,
      });
    } catch (err) {
      console.error('Error discovering devices:', err);
      toast({
        title: "Fehler",
        description: 'Fehler bei der Gerätesuche.',
        variant: "destructive"
      });
    } finally {
      setIsDiscovering(false);
    }
  };

  const handlePair = async (device: any) => {
    try {
      await pairDevice({
        ...device,
        room: selectedRoom
      });
      
      // Remove from discovered list after successful pairing
      setDiscoveredDevices(prev => prev.filter(d => d.macAddress !== device.macAddress));
    } catch (err) {
      console.error('Error pairing device:', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Geräte entdecken</CardTitle>
        <CardDescription>
          Suchen Sie nach neuen Smart Home Geräten in Ihrem Netzwerk und verbinden Sie sie mit Ihrem Smart Home.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Button 
            onClick={handleDiscover} 
            disabled={isDiscovering}
            className="flex items-center"
          >
            {isDiscovering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suche läuft...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Gerätesuche starten
              </>
            )}
          </Button>
          
          <Select value={selectedRoom} onValueChange={(value) => setSelectedRoom(value as Room)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Raum auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Wohnzimmer">Wohnzimmer</SelectItem>
              <SelectItem value="Küche">Küche</SelectItem>
              <SelectItem value="Schlafzimmer">Schlafzimmer</SelectItem>
              <SelectItem value="Badezimmer">Badezimmer</SelectItem>
              <SelectItem value="Flur">Flur</SelectItem>
              <SelectItem value="Büro">Büro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isDiscovering ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">
              Suche nach Geräten in Ihrem Netzwerk...
            </p>
          </div>
        ) : discoveredDevices.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-muted/30">
            <WifiOff className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Keine neuen Geräte gefunden</p>
            <p className="text-sm text-muted-foreground mt-2">
              Stellen Sie sicher, dass Ihre Geräte eingeschaltet und mit Ihrem Netzwerk verbunden sind.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-medium">Gefundene Geräte ({discoveredDevices.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {discoveredDevices.map((device, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">{device.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {device.manufacturer} • {device.model}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 pb-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-muted-foreground">IP-Adresse</p>
                        <p>{device.ipAddress}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">MAC-Adresse</p>
                        <p>{device.macAddress}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Typ</p>
                        <p>{device.type}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-2 flex justify-end bg-muted/10">
                    <Button 
                      size="sm" 
                      onClick={() => handlePair(device)}
                      disabled={loading}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Verbinden
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceDiscovery;
