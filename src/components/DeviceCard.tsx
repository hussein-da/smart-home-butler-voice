
import React from 'react';
import { Device } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useDevices } from '@/store/DeviceStore';
import { Lightbulb, Thermometer, PlugZap, Blinds, BarChart3 } from 'lucide-react';

interface DeviceCardProps {
  device: Device;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const { updateDevice } = useDevices();

  const getDeviceIcon = () => {
    switch (device.type) {
      case 'LIGHT':
        return <Lightbulb className={`h-6 w-6 ${device.state.on ? 'text-yellow-400' : 'text-gray-400'}`} />;
      case 'THERMOSTAT':
        return <Thermometer className="h-6 w-6 text-butler-primary" />;
      case 'SWITCH':
        return <PlugZap className={`h-6 w-6 ${device.state.on ? 'text-green-500' : 'text-gray-400'}`} />;
      case 'BLIND':
        return <Blinds className="h-6 w-6 text-butler-primary" />;
      case 'SENSOR':
        return <BarChart3 className="h-6 w-6 text-butler-primary" />;
      default:
        return <div className="h-6 w-6 bg-gray-300 rounded-full"></div>;
    }
  };

  const handleToggleSwitch = () => {
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

  const renderDeviceControls = () => {
    switch (device.type) {
      case 'LIGHT':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {device.state.on ? 'Ein' : 'Aus'}
              </span>
              <Switch
                checked={device.state.on}
                onCheckedChange={handleToggleSwitch}
              />
            </div>
            {device.state.brightness !== undefined && device.state.on && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Helligkeit</span>
                  <span className="text-sm font-medium">{device.state.brightness}%</span>
                </div>
                <Slider
                  defaultValue={[device.state.brightness]}
                  max={100}
                  step={1}
                  onValueChange={handleBrightnessChange}
                  disabled={!device.state.on}
                />
              </div>
            )}
          </div>
        );
      
      case 'THERMOSTAT':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {device.state.on ? 'Ein' : 'Aus'}
              </span>
              <Switch
                checked={device.state.on}
                onCheckedChange={handleToggleSwitch}
              />
            </div>
            {device.state.temperature !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Temperatur</span>
                  <span className="text-sm font-medium">{device.state.temperature}°C</span>
                </div>
                <Slider
                  defaultValue={[device.state.temperature]}
                  min={16}
                  max={28}
                  step={0.5}
                  onValueChange={handleTemperatureChange}
                  disabled={!device.state.on}
                />
              </div>
            )}
          </div>
        );
      
      case 'SWITCH':
        return (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {device.state.on ? 'Ein' : 'Aus'}
            </span>
            <Switch
              checked={device.state.on}
              onCheckedChange={handleToggleSwitch}
            />
          </div>
        );
      
      case 'BLIND':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {device.state.open ? 'Offen' : 'Geschlossen'}
              </span>
              <Switch
                checked={device.state.open}
                onCheckedChange={() => updateDevice(device.id, { open: !device.state.open })}
              />
            </div>
            {device.state.position !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Position</span>
                  <span className="text-sm font-medium">{device.state.position}%</span>
                </div>
                <Slider
                  defaultValue={[device.state.position]}
                  max={100}
                  step={1}
                  onValueChange={handlePositionChange}
                />
              </div>
            )}
          </div>
        );
      
      case 'SENSOR':
        return (
          <div className="space-y-2">
            {device.state.temperature !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Temperatur</span>
                <span className="text-sm font-medium">{device.state.temperature}°C</span>
              </div>
            )}
            {device.state.humidity !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Luftfeuchtigkeit</span>
                <span className="text-sm font-medium">{device.state.humidity}%</span>
              </div>
            )}
          </div>
        );
      
      default:
        return <div>Keine Steuerung verfügbar</div>;
    }
  };

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {getDeviceIcon()}
            <CardTitle className="text-lg">{device.name}</CardTitle>
          </div>
          <Badge variant="outline">{device.room}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {renderDeviceControls()}
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
