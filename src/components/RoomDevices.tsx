
import React from 'react';
import { useDevices } from '@/store/DeviceStore';
import DeviceCard from './DeviceCard';
import { Room } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronRight, Home } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface RoomDevicesProps {
  room: Room;
}

const roomIcons: Record<Room, React.ReactNode> = {
  'Wohnzimmer': <Home className="h-5 w-5 text-butler-primary" />,
  'Küche': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-butler-primary"><path d="M19 3v12h-2c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2h-2c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2H3V3h16Z"/><path d="M3 15h18v2c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-2Z"/><path d="M12 3v2"/></svg>,
  'Schlafzimmer': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-butler-primary"><path d="M2 9V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5"/><path d="M4 18v3"/><path d="M20 18v3"/><path d="M4 14h16"/><path d="M12 14v3"/></svg>,
  'Badezimmer': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-butler-primary"><path d="M4 4h16"/><path d="M20 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4"/><path d="M12 4v4"/><path d="M8 10s1.5 1 4 1 4-1 4-1"/><path d="M4 20.5v.5"/><path d="M20 20.5v.5"/></svg>,
  'Flur': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-butler-primary"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M10 22V12h4v10"/></svg>,
  'Büro': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-butler-primary"><rect width="18" height="12" x="3" y="4" rx="2" ry="2"/><path d="M2 20h20"/><path d="M12 4v16"/></svg>
};

const RoomDevices: React.FC<RoomDevicesProps> = ({ room }) => {
  const { getDevicesByRoom } = useDevices();
  const devices = getDevicesByRoom(room);
  const [isOpen, setIsOpen] = React.useState(true);

  if (devices.length === 0) {
    return null;
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <Card className="mb-4 border-l-4 border-l-butler-primary shadow-sm">
        <CardHeader className="py-3 px-4">
          <CollapsibleTrigger className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {roomIcons[room]}
              <CardTitle className="text-xl">{room}</CardTitle>
            </div>
            {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default RoomDevices;
