// src/types/product.types.ts
import type { Brand, ModelItem, Category } from './catalog.types'

// src/types/product.types.ts
export interface Product {
  id: number
  name: string
  brandId?: number | null
  modelId?: number | null
  categoryId?: number | null       // ← agregar
  brand?: Brand
  model?: ModelItem
  category?: Category
  description?: string
  isActive: boolean
  createdAt: string
}

export interface ProductPayload {
  name: string
  brandId?: number | null
  modelId?: number | null
  categoryId?: number | null
  description?: string
  isActive?: boolean
}
