// src/types/device.types.ts
export interface Device {
  id: number
  internalCode?: string
  serialNumber?: string
  status?: { id: number; name: string }
  ubication?: { id: number; name: string }
  createdAt: string
}
