
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Device, DeviceState } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import { mockDevices } from '@/lib/mockData';

interface DeviceContextType {
  devices: Device[];
  loading: boolean;
  error: string | null;
  updateDevice: (id: string, newState: Partial<DeviceState>) => Promise<void>;
  getDevicesByRoom: (room: string) => Device[];
  getAllRooms: () => string[];
  discoverDevices: () => Promise<void>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDevice = async (id: string, newState: Partial<DeviceState>) => {
    try {
      setLoading(true);
      const deviceIndex = devices.findIndex(d => d.id === id);
      if (deviceIndex === -1) throw new Error('Device not found');

      const updatedDevices = [...devices];
      updatedDevices[deviceIndex] = {
        ...updatedDevices[deviceIndex],
        state: {
          ...updatedDevices[deviceIndex].state,
          ...newState
        },
        lastUpdated: new Date()
      };

      setDevices(updatedDevices);
      toast({
        title: "Gerät aktualisiert",
        description: `${updatedDevices[deviceIndex].name} wurde aktualisiert.`
      });
    } catch (err) {
      console.error('Error updating device:', err);
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

  const discoverDevices = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Load mock devices
      setDevices(mockDevices);
      
      toast({
        title: "Demo-Geräte hinzugefügt",
        description: `${mockDevices.length} Geräte wurden erfolgreich hinzugefügt.`
      });
    } catch (err) {
      console.error('Error discovering devices:', err);
      setError('Fehler beim Suchen nach Geräten');
      toast({
        title: "Fehler",
        description: 'Geräte konnten nicht gefunden werden.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getDevicesByRoom = (room: string) => {
    return devices.filter(device => device.room === room);
  };

  const getAllRooms = () => {
    return Array.from(new Set(devices.map(device => device.room)));
  };

  return (
    <DeviceContext.Provider value={{
      devices,
      loading,
      error,
      updateDevice,
      getDevicesByRoom,
      getAllRooms,
      discoverDevices
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
