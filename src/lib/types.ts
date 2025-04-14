
export type DeviceType = 'LIGHT' | 'THERMOSTAT' | 'SWITCH' | 'BLIND' | 'SENSOR';

export type Room = 'Wohnzimmer' | 'Küche' | 'Schlafzimmer' | 'Badezimmer' | 'Flur' | 'Büro';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: Room;
  state: DeviceState;
  lastUpdated: Date;
}

export interface DeviceState {
  on?: boolean;
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
