
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useDevices } from '@/store/DeviceStore';
import { Save, Volume2, Moon, Wifi, Bell, ShieldAlert } from 'lucide-react';

const Settings = () => {
  const { disconnectedDevices } = useDevices();
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Einstellungen</h1>
        
        <Tabs defaultValue="general">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="general">Allgemein</TabsTrigger>
            <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
            <TabsTrigger value="security">Sicherheit</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Allgemeine Einstellungen</CardTitle>
                <CardDescription>
                  Konfigurieren Sie die grundlegenden Einstellungen Ihres Smart Homes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dunkelmodus</Label>
                    <p className="text-sm text-muted-foreground">Aktivieren Sie den dunklen Modus für die Benutzeroberfläche</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4 text-muted-foreground" />
                    <Switch id="dark-mode" defaultChecked />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sound">Systemtöne</Label>
                    <p className="text-sm text-muted-foreground">Aktivieren Sie Ton-Feedback für Interaktionen</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <Switch id="sound" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="offline-detection">Offline-Erkennung</Label>
                    <p className="text-sm text-muted-foreground">Benachrichtigung bei Geräteausfällen</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <Switch id="offline-detection" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Benachrichtigungseinstellungen</CardTitle>
                <CardDescription>
                  Konfigurieren Sie, wann und wie Sie Benachrichtigungen erhalten
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push-Benachrichtigungen</Label>
                    <p className="text-sm text-muted-foreground">Aktivieren Sie Push-Benachrichtigungen für wichtige Ereignisse</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Switch id="push-notifications" defaultChecked />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">E-Mail-Benachrichtigungen</Label>
                    <p className="text-sm text-muted-foreground">Erhalten Sie wichtige Benachrichtigungen per E-Mail</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="email-notifications" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sicherheitseinstellungen</CardTitle>
                <CardDescription>
                  Sichern Sie Ihr Smart Home vor unbefugtem Zugriff
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Zwei-Faktor-Authentifizierung</Label>
                    <p className="text-sm text-muted-foreground">Erhöhen Sie die Sicherheit Ihres Kontos</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    <Switch id="two-factor" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>System-Information</CardTitle>
                <CardDescription>
                  Technische Details und System-Status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-medium">Version</h3>
                  <p className="text-sm text-muted-foreground">SmartHome Butler v1.0.0</p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-medium">Netzwerk-Status</h3>
                  <p className="text-sm text-muted-foreground">Verbunden</p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-medium">Offline Geräte</h3>
                  <p className="text-sm text-muted-foreground">
                    {disconnectedDevices.length > 0 
                      ? `${disconnectedDevices.length} Gerät(e) offline` 
                      : 'Alle Geräte sind online'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Einstellungen speichern
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
