
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Device } from '@/lib/types';
import { useDevices } from '@/store/DeviceStore';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { LightbulbOff, Lightbulb, Thermometer, Power } from 'lucide-react';
import DeviceConfig from './DeviceConfig';

interface DeviceCardProps {
  device: Device;
}

const DeviceCardExtended: React.FC<DeviceCardProps> = ({ device }) => {
  const { updateDevice } = useDevices();

  const handleToggle = () => {
    updateDevice(device.id, { on: !device.state.on });
  };

  const handleBrightnessChange = (value: number[]) => {
    updateDevice(device.id, { brightness: value[0] });
  };

  const handleTemperatureChange = (value: number[]) => {
    updateDevice(device.id, { temperature: value[0] });
  };

  const handlePositionChange = (value: number[]) => {
    updateDevice(device.id, { position: value[0] });
  };

  const renderDeviceContent = () => {
    switch (device.type) {
      case 'LIGHT':
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {device.state.on ? (
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                ) : (
                  <LightbulbOff className="h-5 w-5 text-gray-400" />
                )}
                <span>{device.state.on ? 'Ein' : 'Aus'}</span>
              </div>
              <Switch checked={device.state.on || false} onCheckedChange={handleToggle} />
            </div>
            
            {device.state.on && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Helligkeit</span>
                  <span className="text-sm font-medium">{device.state.brightness || 0}%</span>
                </div>
                <Slider
                  value={[device.state.brightness || 0]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleBrightnessChange}
                />
              </div>
            )}
          </>
        );
        
      case 'THERMOSTAT':
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-5 w-5 text-red-500" />
                <span>{device.state.temperature || 20}°C</span>
              </div>
              <Switch checked={device.state.on || false} onCheckedChange={handleToggle} />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Temperatur</span>
                <span className="text-sm font-medium">{device.state.temperature || 20}°C</span>
              </div>
              <Slider
                value={[device.state.temperature || 20]}
                min={15}
                max={30}
                step={0.5}
                onValueChange={handleTemperatureChange}
              />
            </div>
          </>
        );
        
      case 'SWITCH':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Power className={`h-5 w-5 ${device.state.on ? 'text-green-500' : 'text-gray-400'}`} />
              <span>{device.state.on ? 'Ein' : 'Aus'}</span>
            </div>
            <Switch checked={device.state.on || false} onCheckedChange={handleToggle} />
          </div>
        );
        
      case 'BLIND':
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span>{device.state.open ? 'Geöffnet' : 'Geschlossen'}</span>
              </div>
              <Switch 
                checked={device.state.open || false} 
                onCheckedChange={() => updateDevice(device.id, { open: !device.state.open })} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Position</span>
                <span className="text-sm font-medium">{device.state.position || 0}%</span>
              </div>
              <Slider
                value={[device.state.position || 0]}
                min={0}
                max={100}
                step={1}
                onValueChange={handlePositionChange}
              />
            </div>
          </>
        );
        
      case 'SENSOR':
        return (
          <div className="space-y-2">
            {device.state.temperature !== undefined && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-5 w-5 text-red-500" />
                  <span>Temperatur</span>
                </div>
                <span className="font-medium">{device.state.temperature}°C</span>
              </div>
            )}
            
            {device.state.humidity !== undefined && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-500"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                  <span>Luftfeuchtigkeit</span>
                </div>
                <span className="font-medium">{device.state.humidity}%</span>
              </div>
            )}
            
            {device.state.battery !== undefined && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-500"><rect x="2" y="7" width="20" height="10" rx="2" ry="2"/><line x1="2" y1="11" x2="22" y2="11"/></svg>
                  <span>Batterie</span>
                </div>
                <span className="font-medium">{device.state.battery}%</span>
              </div>
            )}
          </div>
        );
        
      default:
        return <p>Unbekannter Gerätetyp</p>;
    }
  };

  // Check if device is offline
  const isOffline = device.connectionStatus === 'OFFLINE';

  return (
    <Card className={`relative ${isOffline ? 'opacity-60' : ''}`}>
      {isOffline && (
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 mr-1"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
            Offline
          </div>
        </div>
      )}
      
      <DeviceConfig device={device} />
      
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">{device.name}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {renderDeviceContent()}
        
        <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
          Zuletzt aktualisiert: {device.lastUpdated.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceCardExtended;
