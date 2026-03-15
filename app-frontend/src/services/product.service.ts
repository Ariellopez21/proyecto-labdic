// src/services/product.service.ts
import { apiFetch } from '@/services/api'
import type { Product, ProductPayload } from '@/types/product.types'

const BASE = '/labdic_inventory/products'

export const getProducts   = () => apiFetch<Product[]>(BASE)

export const getProduct    = (id: number) => apiFetch<Product>(`${BASE}/${id}`)

export const createProduct = (payload: ProductPayload) =>
  apiFetch<Product>(BASE, { method: 'POST', json: payload })

export const updateProduct = (id: number, payload: Partial<ProductPayload>) =>
  apiFetch<Product>(`${BASE}/${id}`, { method: 'PATCH', json: payload })

export const deleteProduct = (id: number) =>
  apiFetch<void>(`${BASE}/${id}`, { method: 'DELETE' })
