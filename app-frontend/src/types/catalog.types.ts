// src/types/catalog.types.ts

export interface Brand {
  id: number
  name: string
}

export interface ModelItem {
  id: number
  name: string
}

export interface Category {
  id: number
  name: string
}

export interface Status {
  id: number
  name: string
}

export interface Ubication {
  id: number
  name: string
  description?: string
}

// Payload genérico para crear/editar cualquier entidad del catálogo
export interface CatalogPayload {
  name: string
  description?: string
}
