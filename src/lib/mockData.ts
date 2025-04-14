
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
    lastUpdated: new Date()
  },
  {
    id: "light-livingroom-2",
    name: "Stehlampe",
    type: "LIGHT",
    room: "Wohnzimmer",
    state: {
      on: false,
      brightness: 50,
      color: "#FFF5E0"
    },
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
    lastUpdated: new Date()
  },
  {
    id: "thermostat-kitchen",
    name: "Thermostat",
    type: "THERMOSTAT",
    room: "Küche",
    state: {
      on: true,
      temperature: 20.0
    },
    lastUpdated: new Date()
  },
  {
    id: "light-bedroom-1",
    name: "Hauptlicht",
    type: "LIGHT",
    room: "Schlafzimmer",
    state: {
      on: false,
      brightness: 70,
      color: "#FFF5E0"
    },
    lastUpdated: new Date()
  },
  {
    id: "blind-bedroom-1",
    name: "Rolladen",
    type: "BLIND",
    room: "Schlafzimmer",
    state: {
      open: true,
      position: 100
    },
    lastUpdated: new Date()
  },
  {
    id: "thermostat-bedroom",
    name: "Thermostat",
    type: "THERMOSTAT",
    room: "Schlafzimmer",
    state: {
      on: true,
      temperature: 19.0
    },
    lastUpdated: new Date()
  },
  {
    id: "sensor-bathroom",
    name: "Feuchtigkeitssensor",
    type: "SENSOR",
    room: "Badezimmer",
    state: {
      humidity: 65
    },
    lastUpdated: new Date()
  },
  {
    id: "light-bathroom-1",
    name: "Hauptlicht",
    type: "LIGHT",
    room: "Badezimmer",
    state: {
      on: false,
      brightness: 100,
      color: "#FFFFFF"
    },
    lastUpdated: new Date()
  },
  {
    id: "switch-office-1",
    name: "Steckdose PC",
    type: "SWITCH",
    room: "Büro",
    state: {
      on: true
    },
    lastUpdated: new Date()
  },
  {
    id: "light-office-1",
    name: "Schreibtischlampe",
    type: "LIGHT",
    room: "Büro",
    state: {
      on: true,
      brightness: 90,
      color: "#F5F5FF"
    },
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
