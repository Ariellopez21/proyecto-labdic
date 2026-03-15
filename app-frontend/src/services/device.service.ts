// src/services/device.service.ts
import { apiFetch } from '@/services/api'
import type { Device } from '@/types/device.types'

export const getDevicesByProduct = (productId: number) =>
  apiFetch<Device[]>(`/labdic_inventory/devices?product_id=${productId}`)
