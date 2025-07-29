interface IdOnly {
  id: number
}

interface TodoBase {
  title: string
  description?: string
}

export interface Todo extends TodoBase {
  id: number
  completed: boolean
  categories: Category[]
}

export interface TodoCreate extends TodoBase {
  completed?: boolean
  categories?: IdOnly[]
}

interface CategoryBase {
  name: string
  description?: string
}

export interface Category extends CategoryBase {
  id: number
}

export type CategoryCreate = CategoryBase
