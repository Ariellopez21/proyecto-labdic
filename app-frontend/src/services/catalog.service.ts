/**
 * API client para los endpoints de catálogo bajo /labdic_inventory.
 *
 * Cada función mapea a un endpoint REST estándar:
 *  - getX()      -> GET  /labdic_inventory/x
 *  - createX(...) -> POST /labdic_inventory/x
 *  - updateX(id)  -> PATCH /labdic_inventory/x/{id}
 *  - deleteX(id)  -> DELETE /labdic_inventory/x/{id}
 *
 * Usa `apiFetch` para aplicar manejo de errores/autenticación de forma centralizada.
 */
// src/services/catalog.service.ts
import { apiFetch } from '@/services/api'
import type { Brand, ModelItem, Category, Status, Ubication, CatalogPayload } from '@/types/catalog.types'

/** Raíz base para todos los endpoints del inventario */
const BASE = '/labdic_inventory'

// ── Brands ────────────────────────────────────────────────────────────
export const getBrands    = () => apiFetch<Brand[]>(`${BASE}/brands`)
export const createBrand  = (p: CatalogPayload) => apiFetch<Brand>(`${BASE}/brands`, { method: 'POST', json: p })
export const updateBrand  = (id: number, p: CatalogPayload) => apiFetch<Brand>(`${BASE}/brands/${id}`, { method: 'PATCH', json: p })
export const deleteBrand  = (id: number) => apiFetch<void>(`${BASE}/brands/${id}`, { method: 'DELETE' })

// ── Models ────────────────────────────────────────────────────────────
export const getModels    = () => apiFetch<ModelItem[]>(`${BASE}/models`)
export const createModel  = (p: CatalogPayload) => apiFetch<ModelItem>(`${BASE}/models`, { method: 'POST', json: p })
export const updateModel  = (id: number, p: CatalogPayload) => apiFetch<ModelItem>(`${BASE}/models/${id}`, { method: 'PATCH', json: p })
export const deleteModel  = (id: number) => apiFetch<void>(`${BASE}/models/${id}`, { method: 'DELETE' })

// ── Categories ────────────────────────────────────────────────────────
export const getCategories   = () => apiFetch<Category[]>(`${BASE}/categories`)
export const createCategory  = (p: CatalogPayload) => apiFetch<Category>(`${BASE}/categories`, { method: 'POST', json: p })
export const updateCategory  = (id: number, p: CatalogPayload) => apiFetch<Category>(`${BASE}/categories/${id}`, { method: 'PATCH', json: p })
export const deleteCategory  = (id: number) => apiFetch<void>(`${BASE}/categories/${id}`, { method: 'DELETE' })

// ── Statuses (solo lectura) ───────────────────────────────────────────
export const getStatuses = () => apiFetch<Status[]>(`${BASE}/statuses`)

// ── Ubications ────────────────────────────────────────────────────────
export const getUbications   = () => apiFetch<Ubication[]>(`${BASE}/ubications`)
export const createUbication = (p: CatalogPayload) => apiFetch<Ubication>(`${BASE}/ubications`, { method: 'POST', json: p })
export const updateUbication = (id: number, p: CatalogPayload) => apiFetch<Ubication>(`${BASE}/ubications/${id}`, { method: 'PATCH', json: p })
export const deleteUbication = (id: number) => apiFetch<void>(`${BASE}/ubications/${id}`, { method: 'DELETE' })
