<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import CatalogTable from '@/modules/catalog/components/CatalogTable.vue'
import type { Brand, ModelItem, Category, Status, Ubication, CatalogPayload } from '@/types/catalog.types'
import {
  getBrands,    createBrand,    updateBrand,    deleteBrand,
  getModels,    createModel,    updateModel,    deleteModel,
  getCategories, createCategory, updateCategory, deleteCategory,
  getStatuses,
  getUbications, createUbication, updateUbication, deleteUbication,
} from '@/services/catalog.service'
import { getRoles, createRole, updateRole, deleteRole } from '@/services/role.service'
import type { Role } from '@/types/role.types'


const toast = useToast()

// ── Estado por entidad ────────────────────────────────────────────────
const brands     = ref<Brand[]>([])
const models     = ref<ModelItem[]>([])
const categories = ref<Category[]>([])
const statuses   = ref<Status[]>([])
const ubications = ref<Ubication[]>([])
const roles        = ref<Role[]>([])

const loadingBrands     = ref(false)
const loadingModels     = ref(false)
const loadingCategories = ref(false)
const loadingStatuses   = ref(false)
const loadingUbications = ref(false)
const loadingRoles = ref(false)

// ── Carga inicial ─────────────────────────────────────────────────────
async function load<T>(
  loadingRef: typeof loadingBrands,
  dataRef: typeof brands,
  fetcher: () => Promise<T[]>,
  label: string,
) {
  loadingRef.value = true
  try {
    dataRef.value = await fetcher() as any
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: `No se pudo cargar ${label}.`, life: 4000 })
  } finally {
    loadingRef.value = false
  }
}

onMounted(() => {
  load(loadingBrands,     brands,     getBrands,     'las marcas')
  load(loadingModels,     models,     getModels,     'los modelos')
  load(loadingCategories, categories, getCategories, 'las categorías')
  load(loadingStatuses,   statuses,   getStatuses,   'los estados')
  load(loadingUbications, ubications, getUbications, 'las ubicaciones')
  load(loadingRoles, roles, getRoles, 'los roles')
})

// ── Factory de handlers CRUD para cada entidad ────────────────────────
function makeCrud<T extends { id: number; name: string }>(
  dataRef: typeof brands,
  creator:  (p: CatalogPayload) => Promise<T>,
  updater:  (id: number, p: CatalogPayload) => Promise<T>,
  deleter:  (id: number) => Promise<void>,
  label: string,
) {
  async function onCreate(payload: CatalogPayload) {
    try {
      const item = await creator(payload)
      dataRef.value.push(item as any)
      toast.add({ severity: 'success', summary: 'Creado', detail: `"${payload.name}" agregado correctamente.`, life: 3000 })
    } catch {
      toast.add({ severity: 'error', summary: 'Error', detail: `No se pudo crear ${label.toLowerCase()}.`, life: 4000 })
    }
  }

  async function onUpdate(id: number, payload: CatalogPayload) {
    try {
      const updated = await updater(id, payload)
      const idx = dataRef.value.findIndex(i => i.id === id)
      if (idx !== -1) dataRef.value[idx] = updated as any
      toast.add({ severity: 'success', summary: 'Actualizado', detail: `"${payload.name}" actualizado correctamente.`, life: 3000 })
    } catch {
      toast.add({ severity: 'error', summary: 'Error', detail: `No se pudo actualizar ${label.toLowerCase()}.`, life: 4000 })
    }
  }

  async function onDelete(id: number) {
    try {
      await deleter(id)
      dataRef.value = dataRef.value.filter(i => i.id !== id) as any
      toast.add({ severity: 'success', summary: 'Eliminado', detail: `${label} eliminada correctamente.`, life: 3000 })
    } catch {
      toast.add({ severity: 'error', summary: 'Error', detail: `No se pudo eliminar ${label.toLowerCase()}. Puede estar en uso.`, life: 4000 })
    }
  }

  return { onCreate, onUpdate, onDelete }
}

// Instanciar handlers para cada entidad
const brandCrud    = makeCrud(brands,     createBrand,    updateBrand,    deleteBrand,    'Marca')
const modelCrud    = makeCrud(models,     createModel,    updateModel,    deleteModel,    'Modelo')
const categoryCrud = makeCrud(categories, createCategory, updateCategory, deleteCategory, 'Categoría')
const ubicCrud     = makeCrud(ubications, createUbication, updateUbication, deleteUbication, 'Ubicación')

const PROTECTED_ROLES = ['usuario', 'administrador']
const _roleCrud = makeCrud(roles, createRole, updateRole, deleteRole, 'Rol')

const roleCrud = {
  onCreate: _roleCrud.onCreate,
  onUpdate: async (id: number, payload: CatalogPayload) => {
    const role = roles.value.find(r => r.id === id)
    if (role && PROTECTED_ROLES.includes(role.name.toLowerCase())) {
      toast.add({
        severity: 'warn',
        summary: 'Rol protegido',
        detail: `El rol "${role.name}" es esencial y no puede modificarse.`,
        life: 4000,
      })
      return
    }
    await _roleCrud.onUpdate(id, payload)
  },
  onDelete: async (id: number) => {
    const role = roles.value.find(r => r.id === id)
    if (role && PROTECTED_ROLES.includes(role.name.toLowerCase())) {
      toast.add({
        severity: 'warn',
        summary: 'Rol protegido',
        detail: `El rol "${role.name}" es esencial y no puede eliminarse.`,
        life: 4000,
      })
      return
    }
    await _roleCrud.onDelete(id)
  },
}
</script>

<template>
  <div class="page-container">

    <!-- Cabecera de página -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Catálogo</h1>
        <p class="page-subtitle">Administra las entidades auxiliares del sistema</p>
      </div>
    </div>

    <!-- Tabs -->
    <Tabs value="brands">
      <TabList>
        <Tab value="brands">
          <i class="pi pi-tag mr-2" />Marcas
        </Tab>
        <Tab value="models">
          <i class="pi pi-box mr-2" />Modelos
        </Tab>
        <Tab value="categories">
          <i class="pi pi-th-large mr-2" />Categorías
        </Tab>
        <Tab value="statuses">
          <i class="pi pi-circle mr-2" />Estados
        </Tab>
        <Tab value="ubications">
          <i class="pi pi-map-marker mr-2" />Ubicaciones
        </Tab>
        <Tab value="roles">
          <i class="pi pi-id-card mr-2" />Roles
        </Tab>
      </TabList>

      <TabPanels>

        <!-- Marcas -->
        <TabPanel value="brands">
          <CatalogTable
            :items="brands"
            :loading="loadingBrands"
            label="Marca"
            @create="brandCrud.onCreate"
            @update="brandCrud.onUpdate"
            @delete="brandCrud.onDelete"
          />
        </TabPanel>

        <!-- Modelos -->
        <TabPanel value="models">
          <CatalogTable
            :items="models"
            :loading="loadingModels"
            label="Modelo"
            @create="modelCrud.onCreate"
            @update="modelCrud.onUpdate"
            @delete="modelCrud.onDelete"
          />
        </TabPanel>

        <!-- Categorías -->
        <TabPanel value="categories">
          <CatalogTable
            :items="categories"
            :loading="loadingCategories"
            label="Categoría"
            @create="categoryCrud.onCreate"
            @update="categoryCrud.onUpdate"
            @delete="categoryCrud.onDelete"
          />
        </TabPanel>

        <!-- Estados (solo lectura) -->
        <TabPanel value="statuses">
          <div class="readonly-notice">
            <i class="pi pi-info-circle" />
            Los estados están definidos por el sistema y no pueden modificarse
            para garantizar la integridad de los datos.
          </div>
          <CatalogTable
            :items="statuses"
            :loading="loadingStatuses"
            label="Estado"
            :readonly="true"
          />
        </TabPanel>

        <!-- Ubicaciones -->
        <TabPanel value="ubications">
          <CatalogTable
            :items="ubications"
            :loading="loadingUbications"
            label="Ubicación"
            :has-description="true"
            @create="ubicCrud.onCreate"
            @update="ubicCrud.onUpdate"
            @delete="ubicCrud.onDelete"
          />
        </TabPanel>

        <!-- Roles -->
        <TabPanel value="roles">
          <div class="readonly-notice">
            <i class="pi pi-info-circle" />
            Los roles <b>administrador</b> y <b>usuario</b> están definidos por el sistema y no pueden modificarse
            para garantizar la integridad de los datos.
          </div>
          <CatalogTable
            :items="roles"
            :loading="loadingRoles"
            label="Rol"
            :has-description="true"
            @create="roleCrud.onCreate"
            @update="roleCrud.onUpdate"
            @delete="roleCrud.onDelete"
          />
        </TabPanel>

      </TabPanels>
    </Tabs>

  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
  margin: 0.25rem 0 0;
}

.readonly-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.9rem;
  background: var(--p-blue-50, rgba(59,130,246,0.08));
  border: 1px solid var(--p-blue-200, rgba(59,130,246,0.2));
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--p-blue-700, #1d4ed8);
  margin-bottom: 0.75rem;
}
</style>
