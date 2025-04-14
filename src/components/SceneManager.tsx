
import React, { useState } from 'react';
import { useDevices } from '@/store/DeviceStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Device, DeviceState } from '@/lib/types';
import { Plus, Play, Lightbulb, Thermometer } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const SceneManager: React.FC = () => {
  const { devices, scenes, createScene, activateScene } = useDevices();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSceneName, setNewSceneName] = useState('');
  const [selectedDevices, setSelectedDevices] = useState<Record<string, Partial<DeviceState>>>({});

  const handleCreateScene = async () => {
    if (!newSceneName.trim()) return;
    
    await createScene(newSceneName, selectedDevices);
    setNewSceneName('');
    setSelectedDevices({});
    setIsCreateOpen(false);
  };

  const toggleDeviceInScene = (device: Device) => {
    if (selectedDevices[device.id]) {
      const newSelected = { ...selectedDevices };
      delete newSelected[device.id];
      setSelectedDevices(newSelected);
    } else {
      setSelectedDevices({
        ...selectedDevices,
        [device.id]: { ...device.state }
      });
    }
  };

  const updateDeviceStateInScene = (deviceId: string, state: Partial<DeviceState>) => {
    setSelectedDevices({
      ...selectedDevices,
      [deviceId]: {
        ...selectedDevices[deviceId],
        ...state
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Szenen</CardTitle>
            <CardDescription>
              Erstellen und aktivieren Sie Szenen für verschiedene Situationen.
            </CardDescription>
          </div>
          
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Neue Szene
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {scenes.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-muted/30">
            <p className="text-muted-foreground">Keine Szenen vorhanden</p>
            <p className="text-sm text-muted-foreground mt-2">
              Erstellen Sie Ihre erste Szene, um verschiedene Geräte gleichzeitig zu steuern.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenes.map((scene) => (
              <Card key={scene.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">{scene.name}</CardTitle>
                  <CardDescription>
                    {Object.keys(scene.deviceStates).length} Geräte
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 pb-2">
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(scene.deviceStates).slice(0, 3).map((deviceId) => {
                      const device = devices.find(d => d.id === deviceId);
                      return device ? (
                        <div 
                          key={deviceId}
                          className="text-xs px-2 py-1 bg-primary/10 rounded-full"
                        >
                          {device.name}
                        </div>
                      ) : null;
                    })}
                    {Object.keys(scene.deviceStates).length > 3 && (
                      <div className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                        +{Object.keys(scene.deviceStates).length - 3} mehr
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-2 flex justify-end bg-muted/10">
                  <Button 
                    size="sm" 
                    onClick={() => activateScene(scene.id)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Aktivieren
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Neue Szene erstellen</DialogTitle>
            <DialogDescription>
              Wählen Sie Geräte aus und legen Sie deren Zustände fest.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sceneName" className="text-right">
                Name
              </Label>
              <Input
                id="sceneName"
                value={newSceneName}
                onChange={(e) => setNewSceneName(e.target.value)}
                placeholder="z.B. Filmabend, Gute Nacht, etc."
                className="col-span-3"
              />
            </div>
            
            <Tabs defaultValue="lights">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="lights">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Lichter
                </TabsTrigger>
                <TabsTrigger value="climate">
                  <Thermometer className="h-4 w-4 mr-2" />
                  Klima
                </TabsTrigger>
                <TabsTrigger value="other">Andere</TabsTrigger>
              </TabsList>
              
              <TabsContent value="lights" className="space-y-4">
                {devices.filter(d => d.type === 'LIGHT').map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center">
                      <Switch
                        checked={!!selectedDevices[device.id]}
                        onCheckedChange={() => toggleDeviceInScene(device)}
                      />
                      <Label className="ml-2">{device.name}</Label>
                    </div>
                    
                    {selectedDevices[device.id] && (
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Label>An/Aus</Label>
                          <Switch
                            checked={!!selectedDevices[device.id].on}
                            onCheckedChange={(checked) => 
                              updateDeviceStateInScene(device.id, { on: checked })
                            }
                          />
                        </div>
                        
                        {selectedDevices[device.id].on && (
                          <div className="flex items-center space-x-2">
                            <Label>Helligkeit</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={selectedDevices[device.id].brightness || 100}
                              onChange={(e) => 
                                updateDeviceStateInScene(device.id, { brightness: parseInt(e.target.value) })
                              }
                              className="w-16"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="climate" className="space-y-4">
                {devices.filter(d => d.type === 'THERMOSTAT').map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center">
                      <Switch
                        checked={!!selectedDevices[device.id]}
                        onCheckedChange={() => toggleDeviceInScene(device)}
                      />
                      <Label className="ml-2">{device.name}</Label>
                    </div>
                    
                    {selectedDevices[device.id] && (
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Label>Temperatur</Label>
                          <Input
                            type="number"
                            min="16"
                            max="30"
                            step="0.5"
                            value={selectedDevices[device.id].temperature || 21}
                            onChange={(e) => 
                              updateDeviceStateInScene(device.id, { temperature: parseFloat(e.target.value) })
                            }
                            className="w-16"
                          />
                          <span>°C</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="other" className="space-y-4">
                {devices.filter(d => d.type !== 'LIGHT' && d.type !== 'THERMOSTAT').map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center">
                      <Switch
                        checked={!!selectedDevices[device.id]}
                        onCheckedChange={() => toggleDeviceInScene(device)}
                      />
                      <Label className="ml-2">{device.name}</Label>
                    </div>
                    
                    {selectedDevices[device.id] && (
                      <div className="flex items-center space-x-4">
                        {device.type === 'SWITCH' && (
                          <div className="flex items-center space-x-2">
                            <Label>An/Aus</Label>
                            <Switch
                              checked={!!selectedDevices[device.id].on}
                              onCheckedChange={(checked) => 
                                updateDeviceStateInScene(device.id, { on: checked })
                              }
                            />
                          </div>
                        )}
                        
                        {device.type === 'BLIND' && (
                          <div className="flex items-center space-x-2">
                            <Label>Position</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={selectedDevices[device.id].position || 0}
                              onChange={(e) => 
                                updateDeviceStateInScene(device.id, { position: parseInt(e.target.value) })
                              }
                              className="w-16"
                            />
                            <span>%</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleCreateScene} disabled={!newSceneName.trim() || Object.keys(selectedDevices).length === 0}>
              Szene erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SceneManager;
