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
