
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeviceDiscovery from '@/components/DeviceDiscovery';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDevices } from '@/store/DeviceStore';
import AppLayout from '@/components/layout/AppLayout';
import { Loader2, WifiOff } from 'lucide-react';

const DeviceManagement: React.FC = () => {
  const { devices, loading, discoverDevices } = useDevices();

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Geräteverwaltung</h1>

        {loading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="add-devices">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="add-devices">Geräte hinzufügen</TabsTrigger>
              <TabsTrigger value="demo-data">Demo-Daten</TabsTrigger>
            </TabsList>

            <TabsContent value="add-devices">
              <Card>
                <CardHeader>
                  <CardTitle>Smart Home Geräte verbinden</CardTitle>
                  <CardDescription>
                    Verbinden Sie Ihre eigenen Smart Home Geräte mit dem Butler
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Unterstützte Gerätehersteller:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Philips Hue', 'IKEA TRÅDFRI', 'Shelly', 'Sonoff'].map((brand) => (
                      <Card key={brand} className="p-4 text-center">
                        <p className="font-medium">{brand}</p>
                      </Card>
                    ))}
                  </div>
                  <Button 
                    onClick={() => discoverDevices()} 
                    className="w-full mt-4"
                  >
                    Nach Geräten suchen
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="demo-data">
              <Card>
                <CardHeader>
                  <CardTitle>Demo-Daten laden</CardTitle>
                  <CardDescription>
                    Testen Sie die Funktionen mit vordefinierten Demo-Geräten
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <Button 
                      onClick={() => discoverDevices()} 
                      className="w-full"
                    >
                      Demo-Geräte hinzufügen
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                      Die Demo-Daten enthalten verschiedene Smart Home Geräte wie Lampen, Thermostate und Sensoren
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
};

export default DeviceManagement;
