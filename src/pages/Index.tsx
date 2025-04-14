
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';
import RoomDevices from '@/components/RoomDevices';
import { useDevices } from '@/store/DeviceStore';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Room } from '@/lib/types';

const Index = () => {
  const { devices, loading } = useDevices();
  const hasDevices = devices.length > 0;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (!hasDevices) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[80vh] max-w-2xl mx-auto text-center">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Willkommen bei SmartHome Butler</CardTitle>
              <CardDescription>
                Beginnen Sie mit der Einrichtung Ihres Smart Homes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Sie haben noch keine Geräte hinzugefügt. Beginnen Sie mit der Einrichtung, indem Sie entweder:
              </p>
              <div className="space-y-4">
                <Link to="/devices">
                  <Button className="w-full" size="lg">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Demo-Geräte hinzufügen
                  </Button>
                </Link>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      oder
                    </span>
                  </div>
                </div>
                <Link to="/devices">
                  <Button variant="outline" className="w-full" size="lg">
                    Mein eigenes Smart Home verbinden
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // Fixed the type issue here by ensuring we only use valid Room values
  const validRooms: Room[] = ['Wohnzimmer', 'Küche', 'Schlafzimmer', 'Badezimmer', 'Flur', 'Büro'];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Mein Smart Home</h1>
          <Link to="/devices">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Gerät hinzufügen
            </Button>
          </Link>
        </div>
        {validRooms.map((room) => (
          <RoomDevices key={room} room={room} />
        ))}
      </div>
    </AppLayout>
  );
};

export default Index;
