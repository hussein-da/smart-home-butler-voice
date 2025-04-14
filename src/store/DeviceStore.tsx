
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Device, DeviceState, Scene, Room } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import { mockDevices, getDevicesByRoom, getAllRooms, updateDevice, updateDeviceConfig, unpairDevice, pairDevice, getOfflineDevices } from '@/lib/mockData';

interface DeviceContextType {
  devices: Device[];
  loading: boolean;
  error: string | null;
  updateDevice: (id: string, newState: Partial<DeviceState>) => Promise<void>;
  getDevicesByRoom: (room: Room) => Device[];
  getAllRooms: () => Room[];
  discoverDevices: () => Promise<void>;
  disconnectedDevices: string[];
  updateDeviceConfig: (id: string, config: Partial<Device>) => Promise<void>;
  unpairDevice: (id: string) => Promise<void>;
  pairDevice: (device: Device) => Promise<void>;
  scenes: Scene[];
  createScene: (name: string, deviceStates: Record<string, Partial<DeviceState>>) => Promise<void>;
  activateScene: (id: string) => Promise<void>;
  recentCommands: string[];
  addCommand: (command: string) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const [disconnectedDevices, setDisconnectedDevices] = useState<string[]>([]);

  useEffect(() => {
    const offlineDevices = getOfflineDevices();
    setDisconnectedDevices(offlineDevices);
  }, [devices]);

  const handleUpdateDevice = async (id: string, newState: Partial<DeviceState>) => {
    try {
      setLoading(true);
      const updatedDevice = updateDevice(id, newState);
      if (!updatedDevice) throw new Error('Device not found');
      
      setDevices([...mockDevices]);
      toast({
        title: "Gerät aktualisiert",
        description: `${updatedDevice.name} wurde aktualisiert.`
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

  const handleDiscoverDevices = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
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

  const handleUpdateDeviceConfig = async (id: string, config: Partial<Device>) => {
    try {
      const updatedDevice = updateDeviceConfig(id, config);
      if (!updatedDevice) throw new Error('Device not found');
      
      setDevices([...mockDevices]);
      toast({
        title: "Konfiguration gespeichert",
        description: `Die Einstellungen für ${updatedDevice.name} wurden aktualisiert.`
      });
    } catch (err) {
      toast({
        title: "Fehler",
        description: 'Konfiguration konnte nicht gespeichert werden.',
        variant: "destructive"
      });
    }
  };

  const handleUnpairDevice = async (id: string) => {
    try {
      const success = unpairDevice(id);
      if (!success) throw new Error('Device not found');
      
      setDevices([...mockDevices]);
      toast({
        title: "Gerät entfernt",
        description: "Das Gerät wurde erfolgreich entfernt."
      });
    } catch (err) {
      toast({
        title: "Fehler",
        description: 'Gerät konnte nicht entfernt werden.',
        variant: "destructive"
      });
    }
  };

  const handlePairDevice = async (device: Device) => {
    try {
      const newDevice = pairDevice(device);
      setDevices([...mockDevices]);
      toast({
        title: "Gerät hinzugefügt",
        description: `${newDevice.name} wurde erfolgreich hinzugefügt.`
      });
    } catch (err) {
      toast({
        title: "Fehler",
        description: 'Gerät konnte nicht hinzugefügt werden.',
        variant: "destructive"
      });
    }
  };

  const handleCreateScene = async (name: string, deviceStates: Record<string, Partial<DeviceState>>) => {
    try {
      const newScene: Scene = {
        id: crypto.randomUUID(),
        name,
        deviceStates,
        createdAt: new Date()
      };
      setScenes([...scenes, newScene]);
      toast({
        title: "Szene erstellt",
        description: `Die Szene "${name}" wurde erstellt.`
      });
    } catch (err) {
      toast({
        title: "Fehler",
        description: 'Szene konnte nicht erstellt werden.',
        variant: "destructive"
      });
    }
  };

  const handleActivateScene = async (id: string) => {
    try {
      const scene = scenes.find(s => s.id === id);
      if (!scene) throw new Error('Scene not found');

      // Update all devices in the scene
      for (const [deviceId, state] of Object.entries(scene.deviceStates)) {
        await handleUpdateDevice(deviceId, state);
      }

      toast({
        title: "Szene aktiviert",
        description: `Die Szene "${scene.name}" wurde aktiviert.`
      });
    } catch (err) {
      toast({
        title: "Fehler",
        description: 'Szene konnte nicht aktiviert werden.',
        variant: "destructive"
      });
    }
  };

  const handleAddCommand = (command: string) => {
    setRecentCommands(prev => [command, ...prev.slice(0, 9)]);
  };

  return (
    <DeviceContext.Provider value={{
      devices,
      loading,
      error,
      updateDevice: handleUpdateDevice,
      getDevicesByRoom,
      getAllRooms,
      discoverDevices: handleDiscoverDevices,
      disconnectedDevices,
      updateDeviceConfig: handleUpdateDeviceConfig,
      unpairDevice: handleUnpairDevice,
      pairDevice: handlePairDevice,
      scenes,
      createScene: handleCreateScene,
      activateScene: handleActivateScene,
      recentCommands,
      addCommand: handleAddCommand
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
