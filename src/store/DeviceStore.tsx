
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Device, DeviceState, Room, DeviceType } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
    // Fetch initial devices data
    fetchDevices();

    // Set up real-time subscription
    const channel = supabase
      .channel('device-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchDevices(); // Refresh devices when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDevices = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('devices')
        .select('*');

      if (fetchError) {
        throw fetchError;
      }

      // Map the database results to our Device type, ensuring correct typing
      setDevices(data.map(device => ({
        id: device.id,
        name: device.name,
        // Convert the string type to our DeviceType enum
        type: device.type as DeviceType,
        // Convert the string room to our Room enum
        room: device.room as Room,
        state: device.state as DeviceState,
        lastUpdated: new Date(device.updated_at || new Date())
      })));
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError('Fehler beim Laden der Geräte');
      setLoading(false);
      toast({
        title: "Fehler",
        description: 'Geräte konnten nicht geladen werden.',
        variant: "destructive"
      });
    }
  };

  const updateDevice = async (id: string, newState: Partial<DeviceState>) => {
    setLoading(true);
    try {
      const { data, error: updateError } = await supabase
        .from('devices')
        .update({ 
          state: { ...devices.find(d => d.id === id)?.state, ...newState },
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Gerät aktualisiert",
        description: `${data.name} wurde aktualisiert.`,
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

  const getDevicesByRoom = (room: Room) => {
    return devices.filter(device => device.room === room);
  };

  const getAllRooms = (): Room[] => {
    return Array.from(new Set(devices.map(device => device.room)));
  };

  const addCommand = async (command: string) => {
    try {
      await supabase.from('commands_history').insert({
        command,
        executed_at: new Date().toISOString()
      });
      
      setRecentCommands(prev => [command, ...prev].slice(0, 5));
    } catch (err) {
      console.error('Error saving command:', err);
    }
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
