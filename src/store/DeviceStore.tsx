
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Device, DeviceState, Room, DeviceType, Scene, ConnectionStatus } from '@/lib/types';
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
  // New functionality
  discoverDevices: () => Promise<void>;
  pairDevice: (discoveredDevice: Partial<Device>) => Promise<void>;
  unpairDevice: (id: string) => Promise<void>;
  updateDeviceConfig: (id: string, config: any) => Promise<void>;
  scenes: Scene[];
  createScene: (name: string, deviceStates: Record<string, Partial<DeviceState>>) => Promise<void>;
  activateScene: (sceneId: string) => Promise<void>;
  deviceGroups: Record<string, string[]>;
  createDeviceGroup: (name: string, deviceIds: string[]) => Promise<void>;
  disconnectedDevices: string[];
  checkDeviceConnectivity: () => void;
  deviceUsageStats: Record<string, { usageTime: number, lastActivated: Date | null }>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  
  // New state variables for enhanced functionality
  const [discoveredDevices, setDiscoveredDevices] = useState<Partial<Device>[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [deviceGroups, setDeviceGroups] = useState<Record<string, string[]>>({});
  const [disconnectedDevices, setDisconnectedDevices] = useState<string[]>([]);
  const [deviceUsageStats, setDeviceUsageStats] = useState<Record<string, { usageTime: number, lastActivated: Date | null }>>({});

  useEffect(() => {
    // Fetch initial devices data
    fetchDevices();
    fetchScenes();
    fetchDeviceGroups();
    fetchCommandHistory();

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

    // Start periodic connectivity check
    const connectivityTimer = setInterval(checkDeviceConnectivity, 60000);
    
    // Start usage statistics tracker
    const usageStatsTimer = setInterval(updateUsageStatistics, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(connectivityTimer);
      clearInterval(usageStatsTimer);
    };
  }, []);

  // Monitor active devices for usage statistics
  useEffect(() => {
    devices.forEach(device => {
      if (device.state.on && !deviceUsageStats[device.id]?.lastActivated) {
        setDeviceUsageStats(prev => ({
          ...prev,
          [device.id]: {
            ...prev[device.id],
            lastActivated: new Date()
          }
        }));
      } else if (!device.state.on && deviceUsageStats[device.id]?.lastActivated) {
        const startTime = deviceUsageStats[device.id]?.lastActivated || new Date();
        const usageTime = Math.floor((new Date().getTime() - startTime.getTime()) / 60000);
        
        setDeviceUsageStats(prev => ({
          ...prev,
          [device.id]: {
            usageTime: (prev[device.id]?.usageTime || 0) + usageTime,
            lastActivated: null
          }
        }));
      }
    });
  }, [devices]);

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
        lastUpdated: new Date(device.updated_at || new Date()),
        ipAddress: device.ip_address,
        macAddress: device.mac_address,
        manufacturer: device.manufacturer,
        model: device.model,
        firmwareVersion: device.firmware_version,
        connectionStatus: (device.connection_status || 'ONLINE') as ConnectionStatus
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

  const fetchScenes = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('scenes')
        .select('*');

      if (fetchError) {
        throw fetchError;
      }

      setScenes(data.map(scene => ({
        id: scene.id,
        name: scene.name,
        deviceStates: scene.device_states,
        createdAt: new Date(scene.created_at)
      })));
    } catch (err) {
      console.error('Error fetching scenes:', err);
    }
  };

  const fetchDeviceGroups = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('device_groups')
        .select('*');

      if (fetchError) {
        throw fetchError;
      }

      const groups: Record<string, string[]> = {};
      data.forEach(group => {
        groups[group.name] = group.device_ids;
      });
      
      setDeviceGroups(groups);
    } catch (err) {
      console.error('Error fetching device groups:', err);
    }
  };

  const fetchCommandHistory = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('commands_history')
        .select('*')
        .order('executed_at', { ascending: false })
        .limit(5);

      if (fetchError) {
        throw fetchError;
      }

      setRecentCommands(data.map(item => item.command));
    } catch (err) {
      console.error('Error fetching command history:', err);
    }
  };

  const updateDevice = async (id: string, newState: Partial<DeviceState>) => {
    setLoading(true);
    try {
      const device = devices.find(d => d.id === id);
      if (!device) {
        throw new Error('Device not found');
      }
      
      // Simulate sending command to physical device
      console.log(`Sending command to device ${device.name} (${device.ipAddress}):`, newState);
      
      // Add a slight delay to simulate network communication
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { data, error: updateError } = await supabase
        .from('devices')
        .update({ 
          state: { ...device.state, ...newState },
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

  const discoverDevices = async () => {
    setLoading(true);
    try {
      // Simulate discovering new devices on the network
      toast({
        title: "Suche nach neuen Geräten",
        description: "Suche im Netzwerk nach neuen Geräten...",
      });
      
      // Add a delay to simulate network discovery
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate finding some devices
      const mockDiscoveredDevices: Partial<Device>[] = [
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
        }
      ];
      
      setDiscoveredDevices(mockDiscoveredDevices);
      
      toast({
        title: "Geräte gefunden",
        description: `${mockDiscoveredDevices.length} neue Geräte im Netzwerk gefunden.`,
      });
    } catch (err) {
      console.error('Error discovering devices:', err);
      toast({
        title: "Fehler",
        description: 'Fehler bei der Gerätesuche.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const pairDevice = async (discoveredDevice: Partial<Device>) => {
    setLoading(true);
    try {
      // Simulate pairing process
      toast({
        title: "Verbindung wird hergestellt",
        description: `Verbinde mit ${discoveredDevice.name}...`,
      });
      
      // Add a delay to simulate pairing process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDevice = {
        name: discoveredDevice.name || 'Unbekanntes Gerät',
        type: discoveredDevice.type || 'SWITCH',
        room: 'Wohnzimmer' as Room, // Default room
        state: { on: false } as DeviceState,
        mac_address: discoveredDevice.macAddress,
        ip_address: discoveredDevice.ipAddress,
        manufacturer: discoveredDevice.manufacturer,
        model: discoveredDevice.model,
        firmware_version: '1.0.0',
        connection_status: 'ONLINE'
      };
      
      const { data, error: insertError } = await supabase
        .from('devices')
        .insert(newDevice)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Gerät hinzugefügt",
        description: `${data.name} wurde erfolgreich hinzugefügt.`,
      });
      
      // Remove from discovered devices list
      setDiscoveredDevices(prev => prev.filter(d => d.macAddress !== discoveredDevice.macAddress));
    } catch (err) {
      console.error('Error pairing device:', err);
      toast({
        title: "Fehler",
        description: 'Gerät konnte nicht hinzugefügt werden.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const unpairDevice = async (id: string) => {
    setLoading(true);
    try {
      const device = devices.find(d => d.id === id);
      if (!device) {
        throw new Error('Device not found');
      }
      
      toast({
        title: "Verbindung wird getrennt",
        description: `Trenne Verbindung zu ${device.name}...`,
      });
      
      // Add a delay to simulate unpairing process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { error: deleteError } = await supabase
        .from('devices')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      toast({
        title: "Gerät entfernt",
        description: `${device.name} wurde erfolgreich entfernt.`,
      });
    } catch (err) {
      console.error('Error unpairing device:', err);
      toast({
        title: "Fehler",
        description: 'Gerät konnte nicht entfernt werden.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDeviceConfig = async (id: string, config: any) => {
    setLoading(true);
    try {
      const device = devices.find(d => d.id === id);
      if (!device) {
        throw new Error('Device not found');
      }
      
      // Simulate sending configuration to physical device
      console.log(`Updating configuration for device ${device.name} (${device.ipAddress}):`, config);
      
      // Add a delay to simulate configuration update
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { data, error: updateError } = await supabase
        .from('devices')
        .update({ 
          ...config,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Konfiguration aktualisiert",
        description: `Konfiguration für ${data.name} wurde aktualisiert.`,
      });
    } catch (err) {
      console.error('Error updating device configuration:', err);
      toast({
        title: "Fehler",
        description: 'Konfiguration konnte nicht aktualisiert werden.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createScene = async (name: string, deviceStates: Record<string, Partial<DeviceState>>) => {
    setLoading(true);
    try {
      const { data, error: insertError } = await supabase
        .from('scenes')
        .insert({
          name,
          device_states: deviceStates
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Refresh scenes list
      fetchScenes();

      toast({
        title: "Szene erstellt",
        description: `Szene "${name}" wurde erfolgreich erstellt.`,
      });
    } catch (err) {
      console.error('Error creating scene:', err);
      toast({
        title: "Fehler",
        description: 'Szene konnte nicht erstellt werden.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const activateScene = async (sceneId: string) => {
    setLoading(true);
    try {
      const scene = scenes.find(s => s.id === sceneId);
      if (!scene) {
        throw new Error('Scene not found');
      }
      
      toast({
        title: "Szene wird aktiviert",
        description: `Aktiviere Szene "${scene.name}"...`,
      });
      
      // Apply each device state in the scene
      const deviceStatePromises = Object.entries(scene.deviceStates).map(([deviceId, newState]) => {
        return updateDevice(deviceId, newState);
      });
      
      await Promise.all(deviceStatePromises);
      
      toast({
        title: "Szene aktiviert",
        description: `Szene "${scene.name}" wurde erfolgreich aktiviert.`,
      });
    } catch (err) {
      console.error('Error activating scene:', err);
      toast({
        title: "Fehler",
        description: 'Szene konnte nicht aktiviert werden.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDeviceGroup = async (name: string, deviceIds: string[]) => {
    setLoading(true);
    try {
      const { data, error: insertError } = await supabase
        .from('device_groups')
        .insert({
          name,
          device_ids: deviceIds
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Update local state
      setDeviceGroups(prev => ({
        ...prev,
        [name]: deviceIds
      }));

      toast({
        title: "Gerätegruppe erstellt",
        description: `Gerätegruppe "${name}" wurde erfolgreich erstellt.`,
      });
    } catch (err) {
      console.error('Error creating device group:', err);
      toast({
        title: "Fehler",
        description: 'Gerätegruppe konnte nicht erstellt werden.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkDeviceConnectivity = () => {
    console.log('Checking device connectivity...');
    
    // Simulate random device connectivity issues
    const newDisconnectedDevices: string[] = [];
    
    devices.forEach(device => {
      // 5% chance a device will be disconnected during this check
      if (Math.random() < 0.05) {
        newDisconnectedDevices.push(device.id);
        
        // Update device connection status in database
        supabase
          .from('devices')
          .update({ 
            connection_status: 'OFFLINE',
            updated_at: new Date().toISOString()
          })
          .eq('id', device.id)
          .then(() => {
            console.log(`Device ${device.name} is now offline`);
          })
          .catch(err => {
            console.error('Error updating device connection status:', err);
          });
      }
    });
    
    if (newDisconnectedDevices.length > 0) {
      setDisconnectedDevices(prev => [...prev, ...newDisconnectedDevices]);
      
      toast({
        title: "Verbindungsprobleme",
        description: `${newDisconnectedDevices.length} Geräte sind offline.`,
        variant: "destructive"
      });
    }
  };
  
  const updateUsageStatistics = () => {
    console.log('Updating device usage statistics...');
    
    // Update usage time for devices that are currently on
    const updatedStats = { ...deviceUsageStats };
    
    devices.forEach(device => {
      if (device.state.on && updatedStats[device.id]?.lastActivated) {
        const startTime = updatedStats[device.id]?.lastActivated || new Date();
        const usageTime = Math.floor((new Date().getTime() - startTime.getTime()) / 60000);
        
        updatedStats[device.id] = {
          usageTime: (updatedStats[device.id]?.usageTime || 0) + usageTime,
          lastActivated: new Date() // Reset timer
        };
      }
    });
    
    setDeviceUsageStats(updatedStats);
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
      addCommand,
      // New functionality
      discoverDevices,
      pairDevice,
      unpairDevice,
      updateDeviceConfig,
      scenes,
      createScene,
      activateScene,
      deviceGroups,
      createDeviceGroup,
      disconnectedDevices,
      checkDeviceConnectivity,
      deviceUsageStats
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
