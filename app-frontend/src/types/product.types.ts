// src/types/product.types.ts
import type { Brand, ModelItem, Category } from './catalog.types'

export interface Product {
  id: number
  name: string
  brand?: Brand
  model?: ModelItem
  category?: Category
  description?: string
  isActive: boolean
  createdAt: string
  // El backend excluye devices en ProductReadDTO,
  // se cargan aparte en la vista de detalle
}

export interface ProductPayload {
  name: string
  brandId?: number | null
  modelId?: number | null
  categoryId?: number | null
  description?: string
  isActive?: boolean
}
