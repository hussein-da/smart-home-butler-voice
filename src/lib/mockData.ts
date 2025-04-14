import { Device, DeviceType, Room } from "./types";

export const mockDevices: Device[] = [
  {
    id: "light-livingroom-1",
    name: "Deckenlampe",
    type: "LIGHT",
    room: "Wohnzimmer",
    state: {
      on: true,
      brightness: 80,
      color: "#FFFFFF"
    },
    manufacturer: "Philips Hue",
    model: "White and Color Ambiance",
    connectionStatus: "ONLINE",
    lastUpdated: new Date()
  },
  {
    id: "thermostat-livingroom",
    name: "Thermostat",
    type: "THERMOSTAT",
    room: "Wohnzimmer",
    state: {
      on: true,
      temperature: 21.5
    },
    manufacturer: "Nest",
    model: "Learning Thermostat",
    connectionStatus: "ONLINE",
    lastUpdated: new Date()
  },
  {
    id: "light-kitchen-1",
    name: "Hauptlicht",
    type: "LIGHT",
    room: "Küche",
    state: {
      on: false,
      brightness: 100,
      color: "#FFFFFF"
    },
    manufacturer: "IKEA",
    model: "TRÅDFRI",
    connectionStatus: "ONLINE",
    lastUpdated: new Date()
  },
  {
    id: "blind-livingroom-1",
    name: "Wohnzimmer Jalousie",
    type: "BLIND",
    room: "Wohnzimmer",
    state: {
      position: 100,
      open: true
    },
    manufacturer: "Somfy",
    model: "Smart Blind Control",
    connectionStatus: "ONLINE",
    lastUpdated: new Date()
  },
  {
    id: "light-bedroom-1",
    name: "Nachttischlampe",
    type: "LIGHT",
    room: "Schlafzimmer",
    state: {
      on: false,
      brightness: 30,
      color: "#FFA07A"
    },
    manufacturer: "Philips Hue",
    model: "White and Color Ambiance",
    connectionStatus: "ONLINE",
    lastUpdated: new Date()
  },
  {
    id: "thermostat-bedroom",
    name: "Thermostat",
    type: "THERMOSTAT",
    room: "Schlafzimmer",
    state: {
      on: true,
      temperature: 19.5
    },
    manufacturer: "Nest",
    model: "Learning Thermostat",
    connectionStatus: "OFFLINE",
    lastUpdated: new Date()
  }
];

export const getDevicesByRoom = (room: Room) => {
  return mockDevices.filter(device => device.room === room);
};

export const getDevicesByType = (type: DeviceType) => {
  return mockDevices.filter(device => device.type === type);
};

export const getAllRooms = (): Room[] => {
  return Array.from(new Set(mockDevices.map(device => device.room)));
};

export const getDevice = (id: string): Device | undefined => {
  return mockDevices.find(device => device.id === id);
};

export const updateDevice = (id: string, newState: Partial<Device["state"]>): Device | undefined => {
  const deviceIndex = mockDevices.findIndex(device => device.id === id);
  if (deviceIndex === -1) return undefined;
  
  mockDevices[deviceIndex] = {
    ...mockDevices[deviceIndex],
    state: {
      ...mockDevices[deviceIndex].state,
      ...newState
    },
    lastUpdated: new Date()
  };
  
  return mockDevices[deviceIndex];
};

// Add new helper functions
export const updateDeviceConfig = (id: string, config: Partial<Device>): Device | undefined => {
  const deviceIndex = mockDevices.findIndex(device => device.id === id);
  if (deviceIndex === -1) return undefined;
  
  mockDevices[deviceIndex] = {
    ...mockDevices[deviceIndex],
    ...config,
    lastUpdated: new Date()
  };
  
  return mockDevices[deviceIndex];
};

export const unpairDevice = (id: string): boolean => {
  const deviceIndex = mockDevices.findIndex(device => device.id === id);
  if (deviceIndex === -1) return false;
  
  mockDevices.splice(deviceIndex, 1);
  return true;
};

export const pairDevice = (device: Device): Device => {
  mockDevices.push({
    ...device,
    lastUpdated: new Date()
  });
  return device;
};

export const getOfflineDevices = (): string[] => {
  return mockDevices
    .filter(device => device.connectionStatus === "OFFLINE")
    .map(device => device.id);
};
