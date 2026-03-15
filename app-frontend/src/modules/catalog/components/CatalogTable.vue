<script setup lang="ts">
/**
 * CatalogTable — componente genérico reutilizable para todas las entidades del catálogo.
 * Maneja CRUD completo o modo solo lectura según el prop `readonly`.
 */
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { CatalogPayload } from '@/types/catalog.types'

interface CatalogItem {
  id: number
  name: string
  description?: string
}

const props = defineProps<{
  items: CatalogItem[]
  loading: boolean
  label: string              // Nombre singular: "Marca", "Categoría", etc.
  hasDescription?: boolean   // Si la entidad tiene campo descripción
  readonly?: boolean         // Sin botones de editar/eliminar (para Statuses)
}>()

const emit = defineEmits<{
  (e: 'create', payload: CatalogPayload): void
  (e: 'update', id: number, payload: CatalogPayload): void
  (e: 'delete', id: number): void
}>()

const toast = useToast()

// ── Formulario inline ─────────────────────────────────────────────────
const showForm    = ref(false)
const editingId   = ref<number | null>(null)
const formName    = ref('')
const formDesc    = ref('')
const submitting  = ref(false)

function openCreate() {
  editingId.value = null
  formName.value  = ''
  formDesc.value  = ''
  showForm.value  = true
}

function openEdit(item: CatalogItem) {
  editingId.value = item.id
  formName.value  = item.name
  formDesc.value  = item.description ?? ''
  showForm.value  = true
}

function cancelForm() {
  showForm.value = false
}

function validateAndSubmit() {
  if (!formName.value.trim()) {
    toast.add({ severity: 'warn', summary: 'Campo requerido', detail: 'El nombre es obligatorio.', life: 3000 })
    return
  }

  const payload: CatalogPayload = {
    name: formName.value.trim(),
    ...(props.hasDescription ? { description: formDesc.value.trim() || undefined } : {}),
  }

  submitting.value = true

  if (editingId.value !== null) {
    emit('update', editingId.value, payload)
  } else {
    emit('create', payload)
  }

  showForm.value   = false
  submitting.value = false
}

// ── Confirmación de eliminación ───────────────────────────────────────
const showDeleteDialog = ref(false)
const itemToDelete     = ref<CatalogItem | null>(null)

function confirmDelete(item: CatalogItem) {
  itemToDelete.value   = item
  showDeleteDialog.value = true
}

function handleDelete() {
  if (!itemToDelete.value) return
  emit('delete', itemToDelete.value.id)
  showDeleteDialog.value = false
  itemToDelete.value     = null
}
</script>

<template>
  <div class="catalog-table">

    <!-- Header de la sección -->
    <div class="section-header">
      <span class="section-count">{{ items.length }} {{ items.length === 1 ? label.toLowerCase() : `${label.toLowerCase()}s` }}</span>
      <Button
        v-if="!readonly"
        icon="pi pi-plus"
        :label="`Nueva ${label}`"
        size="small"
        @click="openCreate"
      />
    </div>

    <!-- Formulario inline (crear / editar) -->
    <div v-if="showForm && !readonly" class="inline-form">
      <div class="form-fields">
        <InputText
          v-model="formName"
          :placeholder="`Nombre de la ${label.toLowerCase()}`"
          class="flex-1"
          autofocus
          @keyup.enter="validateAndSubmit"
          @keyup.escape="cancelForm"
        />
        <InputText
          v-if="hasDescription"
          v-model="formDesc"
          placeholder="Descripción (opcional)"
          class="flex-1"
          @keyup.enter="validateAndSubmit"
          @keyup.escape="cancelForm"
        />
      </div>
      <div class="form-actions">
        <Button
          :icon="editingId ? 'pi pi-check' : 'pi pi-plus'"
          :label="editingId ? 'Guardar' : 'Crear'"
          size="small"
          :loading="submitting"
          @click="validateAndSubmit"
        />
        <Button
          icon="pi pi-times"
          label="Cancelar"
          size="small"
          severity="secondary"
          text
          @click="cancelForm"
        />
      </div>
    </div>

    <!-- Tabla -->
    <DataTable
      :value="items"
      :loading="loading"
      dataKey="id"
      stripedRows
      size="small"
    >
      <template #empty>
        <div class="text-center py-4 text-muted-color">
          No hay {{ label.toLowerCase() }}s registradas.
        </div>
      </template>

      <Column field="name" :header="label" />

      <Column
        v-if="hasDescription"
        field="description"
        header="Descripción"
      >
        <template #body="{ data }">
          <span class="text-muted-color">{{ data.description ?? '—' }}</span>
        </template>
      </Column>

      <!-- Badge de solo lectura para Statuses -->
      <Column v-if="readonly" header="" style="width: 120px">
        <template #body>
          <Tag value="Solo lectura" severity="secondary" />
        </template>
      </Column>

      <!-- Acciones (solo si no es readonly) -->
      <Column v-if="!readonly" header="" style="width: 90px">
        <template #body="{ data }">
          <Button
            icon="pi pi-pencil"
            rounded text severity="secondary"
            size="small"
            v-tooltip.top="'Editar'"
            @click="openEdit(data)"
          />
          <Button
            icon="pi pi-trash"
            rounded text severity="danger"
            size="small"
            v-tooltip.top="'Eliminar'"
            @click="confirmDelete(data)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- Dialog de confirmación de eliminación -->
    <Dialog
      v-model:visible="showDeleteDialog"
      header="Confirmar eliminación"
      modal
      :style="{ width: '360px' }"
    >
      <p>
        ¿Eliminar <strong>{{ itemToDelete?.name }}</strong>?
        Esta acción no se puede deshacer.
      </p>
      <template #footer>
        <Button label="Cancelar" severity="secondary" text @click="showDeleteDialog = false" />
        <Button label="Eliminar" severity="danger" icon="pi pi-trash" @click="handleDelete" />
      </template>
    </Dialog>

  </div>
</template>

<style scoped>
.catalog-table {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-count {
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
}

/* Formulario inline */
.inline-form {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--p-surface-50, rgba(0,0,0,0.03));
  border: 1px solid var(--p-surface-200, rgba(0,0,0,0.08));
  border-radius: 8px;
  flex-wrap: wrap;
}

.form-fields {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  flex-wrap: wrap;
  min-width: 0;
}

.form-fields .p-inputtext {
  min-width: 160px;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>
