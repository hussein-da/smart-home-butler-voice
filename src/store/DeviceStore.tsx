
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockDevices, updateDevice as mockUpdateDevice } from '@/lib/mockData';
import { Device, DeviceState, Room } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

interface DeviceContextType {
  devices: Device[];
  loading: boolean;
  error: string | null;
  updateDevice: (id: string, newState: Partial<DeviceState>) => Promise<void>;
  getDevicesByRoom: (room: Room) => Device[];
  getAllRooms: () => Room[];
  recentCommands: string[];
  addCommand: (command: string) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);

  useEffect(() => {
    // Simulate API fetch with a delay
    const fetchDevices = async () => {
      try {
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setDevices(mockDevices);
        setLoading(false);
      } catch (err) {
        setError('Fehler beim Laden der Geräte');
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const updateDevice = async (id: string, newState: Partial<DeviceState>) => {
    setLoading(true);
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const updatedDevice = mockUpdateDevice(id, newState);
      
      if (!updatedDevice) {
        throw new Error('Gerät nicht gefunden');
      }
      
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === id ? updatedDevice : device
        )
      );
      
      toast({
        title: "Gerät aktualisiert",
        description: `${updatedDevice.name} (${updatedDevice.room}) wurde aktualisiert.`,
      });
    } catch (err) {
      setError('Fehler beim Aktualisieren des Geräts');
      toast({
        title: "Fehler",
        description: 'Gerät konnte nicht aktualisiert werden.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getDevicesByRoom = (room: Room) => {
    return devices.filter(device => device.room === room);
  };

  const getAllRooms = (): Room[] => {
    return Array.from(new Set(devices.map(device => device.room)));
  };

  const addCommand = (command: string) => {
    setRecentCommands(prev => [command, ...prev].slice(0, 5));
  };

  return (
    <DeviceContext.Provider value={{ 
      devices, 
      loading, 
      error, 
      updateDevice, 
      getDevicesByRoom,
      getAllRooms,
      recentCommands,
      addCommand
    }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
};
