// src/services/device.service.ts
import { apiFetch } from '@/services/api'
import type { Device, DevicePayload, DeviceStatusLog } from '@/types/device.types'

const BASE = '/labdic_inventory/devices'

export const getDevices = () =>
  apiFetch<Device[]>(BASE)

export const getDevicesByProduct = (productId: number) =>
  apiFetch<Device[]>(`${BASE}?product_id=${productId}`)

export const getAvailableDevices = () =>
  apiFetch<Device[]>(`${BASE}/available`)

export const getDevice = (id: number) =>
  apiFetch<Device>(`${BASE}/${id}`)

export const createDevice = (payload: DevicePayload) =>
  apiFetch<Device>(BASE, { method: 'POST', json: payload })

export const updateDevice = (id: number, payload: Partial<DevicePayload>) =>
  apiFetch<Device>(`${BASE}/${id}`, { method: 'PATCH', json: payload })

export const deleteDevice = (id: number) =>
  apiFetch<void>(`${BASE}/${id}`, { method: 'DELETE' })

export const changeDeviceStatus = (id: number, statusId: number) =>
  apiFetch<Device>(`${BASE}/${id}/status`, { method: 'PATCH', json: { statusId } })

export const getDeviceHistory = (id: number) =>
  apiFetch<DeviceStatusLog[]>(`${BASE}/${id}/history`)
