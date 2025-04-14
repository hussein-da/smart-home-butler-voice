
import React, { useState } from 'react';
import { useDevices } from '@/store/DeviceStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Device, Room } from '@/lib/types';
import { Settings, Save, Trash2, RefreshCw, WifiOff } from 'lucide-react';

interface DeviceConfigProps {
  device: Device;
}

const DeviceConfig: React.FC<DeviceConfigProps> = ({ device }) => {
  const { updateDeviceConfig, unpairDevice } = useDevices();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [config, setConfig] = useState({
    name: device.name,
    room: device.room,
    ipAddress: device.ipAddress || '',
    firmwareVersion: device.firmwareVersion || '1.0.0'
  });

  const handleSave = async () => {
    await updateDeviceConfig(device.id, {
      name: config.name,
      room: config.room,
      ip_address: config.ipAddress,
      firmware_version: config.firmwareVersion
    });
    setIsOpen(false);
  };

  const handleUnpair = async () => {
    await unpairDevice(device.id);
    setIsConfirmOpen(false);
    setIsOpen(false);
  };

  const handleFirmwareUpdate = () => {
    // Simulate firmware update
    updateDeviceConfig(device.id, {
      firmware_version: '1.1.0'
    });
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(true)}
        className="absolute top-2 right-2"
      >
        <Settings className="h-4 w-4" />
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Gerät konfigurieren</DialogTitle>
            <DialogDescription>
              Konfigurieren Sie die Einstellungen für {device.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right">
                Raum
              </Label>
              <Select 
                value={config.room} 
                onValueChange={(value) => setConfig({ ...config, room: value as Room })}
              >
                <SelectTrigger className="col-span-3">
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ipAddress" className="text-right">
                IP-Adresse
              </Label>
              <Input
                id="ipAddress"
                value={config.ipAddress}
                onChange={(e) => setConfig({ ...config, ipAddress: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firmware" className="text-right">
                Firmware
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Input
                  id="firmware"
                  value={config.firmwareVersion}
                  readOnly
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleFirmwareUpdate}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Update
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Status
              </Label>
              <div className="col-span-3 flex items-center">
                {device.connectionStatus === 'ONLINE' ? (
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span>Online</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <WifiOff className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-red-500">Offline</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Modell
              </Label>
              <div className="col-span-3">
                {device.manufacturer} {device.model || 'Unbekannt'}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                MAC-Adresse
              </Label>
              <div className="col-span-3">
                {device.macAddress || 'Unbekannt'}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="destructive" 
              onClick={() => setIsConfirmOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Gerät entfernen
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerät entfernen</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie das Gerät "{device.name}" entfernen möchten? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleUnpair}>
              Entfernen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeviceConfig;
