export type DeviceType = 'LIGHT' | 'THERMOSTAT' | 'SWITCH' | 'BLIND' | 'SENSOR';

export type Room = 'Wohnzimmer' | 'Küche' | 'Schlafzimmer' | 'Badezimmer' | 'Flur' | 'Büro';

export type ConnectionStatus = 'ONLINE' | 'OFFLINE' | 'DEGRADED';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: Room;
  state: DeviceState;
  lastUpdated: Date;
  // New fields for enhanced functionality
  ipAddress?: string;
  macAddress?: string;
  manufacturer?: string;
  model?: string;
  firmwareVersion?: string;
  connectionStatus?: ConnectionStatus;
}

export interface DeviceState {
  on?: boolean; // 0-100
  brightness?: number; // 0-100
  color?: string; // hex code
  temperature?: number; // celsius
  humidity?: number; // percent
  open?: boolean; // for blinds/windows
  position?: number; // 0-100 for blinds
  battery?: number; // 0-100 percent
}

export interface CommandRequest {
  text: string;
  audio?: Blob;
  userId?: string;
}

export interface CommandResponse {
  responseText: string;
  actionsExecuted: DeviceAction[];
  success: boolean;
  error?: string;
}

export interface DeviceAction {
  deviceId: string;
  action: string;
  value?: any;
  schedule?: Date;
}

export interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

// New interfaces for enhanced functionality
export interface Scene {
  id: string;
  name: string;
  deviceStates: Record<string, Partial<DeviceState>>;
  createdAt: Date;
}

export interface DeviceGroup {
  id: string;
  name: string;
  deviceIds: string[];
}

export interface DeviceStats {
  dailyUsage: number[];
  weeklyUsage: number[];
  energyConsumption: number;
  lastActivity: Date;
}

export interface AutomationRule {
  id: string;
  name: string;
  condition: AutomationCondition;
  action: DeviceAction;
  active: boolean;
}

export interface AutomationCondition {
  type: 'TIME' | 'EVENT' | 'STATE';
  parameter: any;
}
