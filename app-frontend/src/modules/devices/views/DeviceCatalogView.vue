<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { Device } from '@/types/device.types'
import type { Category } from '@/types/catalog.types'
import { getAvailableDevices } from '@/services/device.service'
import { getCategories } from '@/services/catalog.service'
import DeviceStatusBadge from '@/components/ui/DevicesStatusBadge.vue'

const toast = useToast()

// ── Datos ─────────────────────────────────────────────────────────────

const loading    = ref(false)
const devices    = ref<Device[]>([])
const categories = ref<Category[]>([])

async function loadData() {
  loading.value = true
  try {
    const [d, c] = await Promise.all([getAvailableDevices(), getCategories()])
    devices.value    = d
    categories.value = c
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el catálogo.', life: 4000 })
  } finally {
    loading.value = false
  }
}

// ── Filtros ───────────────────────────────────────────────────────────
const filterCategory = ref<number | null>(null)
const filterSearch   = ref('')

const filteredDevices = computed(() => {
  let result = devices.value

  if (filterCategory.value) {
  result = result.filter(d => d.product?.categoryId === filterCategory.value)
  }

  if (filterSearch.value.trim()) {
    const q = filterSearch.value.toLowerCase()
    result = result.filter(d =>
      d.product?.name?.toLowerCase().includes(q) ||
      d.internalCode?.toLowerCase().includes(q) ||
      d.serialNumber?.toLowerCase().includes(q)
    )
  }

  return result
})

function clearFilters() {
  filterCategory.value = null
  filterSearch.value   = ''
}

// ── Selección de devices para préstamo ───────────────────────────────
const selectedDeviceIds = ref<number[]>([])

function toggleSelection(deviceId: number) {
  const idx = selectedDeviceIds.value.indexOf(deviceId)
  if (idx === -1) {
    selectedDeviceIds.value.push(deviceId)
  } else {
    selectedDeviceIds.value.splice(idx, 1)
  }
}

function isSelected(deviceId: number) {
  return selectedDeviceIds.value.includes(deviceId)
}

const selectedDevices = computed(() =>
  devices.value.filter(d => selectedDeviceIds.value.includes(d.id))
)

// ── Dialog solicitud de préstamo ─────────────────────────────────────
const showLoanDialog        = ref(false)
const loanReason            = ref('')
const loanEstimatedReturn   = ref<Date | null>(null)
const submittingLoan        = ref(false)

function openLoanDialog() {
  if (selectedDeviceIds.value.length === 0) {
    toast.add({ severity: 'warn', summary: 'Sin selección', detail: 'Selecciona al menos un dispositivo.', life: 3000 })
    return
  }
  loanReason.value          = ''
  loanEstimatedReturn.value = null
  showLoanDialog.value      = true
}

async function handleCreateLoan() {
  // Fase 5 — aquí se llamará a loan.service.ts
  // Por ahora mostramos confirmación visual
  submittingLoan.value = true
  try {
    // TODO Fase 5:
    // await createLoanRequest({
    //   deviceIds: selectedDeviceIds.value,
    //   reason: loanReason.value,
    //   estimatedReturnDate: loanEstimatedReturn.value,
    // })
    toast.add({
      severity: 'info',
      summary: 'Próximamente',
      detail: 'La creación de solicitudes de préstamo estará disponible en la próxima actualización.',
      life: 4000,
    })
    showLoanDialog.value    = false
    selectedDeviceIds.value = []
  } finally {
    submittingLoan.value = false
  }
}

// ── Init ──────────────────────────────────────────────────────────────
onMounted(loadData)
</script>

<template>
  <div class="page-container">

    <!-- Cabecera -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Catálogo de Dispositivos</h1>
        <p class="page-subtitle">Selecciona los dispositivos que deseas solicitar en préstamo</p>
      </div>

      <!-- Botón solicitar (visible cuando hay selección) -->
      <Transition name="fade">
        <Button
          v-if="selectedDeviceIds.length > 0"
          :label="`Solicitar préstamo (${selectedDeviceIds.length})`"
          icon="pi pi-file-edit"
          @click="openLoanDialog"
        />
      </Transition>
    </div>

    <!-- Filtros -->
    <Card>
      <template #content>
        <div class="filters-row">
          <InputText
            v-model="filterSearch"
            placeholder="Buscar por nombre, código o serie..."
            class="filter-search"
          >
          </InputText>

          <Select
            v-model="filterCategory"
            :options="categories"
            optionLabel="name"
            optionValue="id"
            placeholder="Todas las categorías"
            showClear
            class="filter-category"
          />

          <Button
            v-if="filterCategory || filterSearch"
            label="Limpiar filtros"
            severity="secondary"
            text
            icon="pi pi-times"
            @click="clearFilters"
          />
        </div>
      </template>
    </Card>

    <!-- Contador de resultados -->
    <div class="results-info">
      <span>{{ filteredDevices.length }} dispositivo{{ filteredDevices.length !== 1 ? 's' : '' }} disponible{{ filteredDevices.length !== 1 ? 's' : '' }}</span>
      <span v-if="selectedDeviceIds.length > 0" class="selected-count">
        · {{ selectedDeviceIds.length }} seleccionado{{ selectedDeviceIds.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Tabla de dispositivos -->
    <Card>
      <template #content>
        <DataTable
          :value="filteredDevices"
          :loading="loading"
          dataKey="id"
          stripedRows
        >
          <template #empty>
            <div class="text-center py-8 text-muted-color">
              <i class="pi pi-inbox text-4xl block mb-3 opacity-30" />
              No hay dispositivos disponibles en este momento.
            </div>
          </template>

          <!-- Columna de selección -->
          <Column style="width: 52px">
            <template #body="{ data }">
              <Checkbox
                :modelValue="isSelected(data.id)"
                :binary="true"
                @change="toggleSelection(data.id)"
              />
            </template>
          </Column>

          <Column header="Producto">
            <template #body="{ data }">
              <div class="product-info">
                <span class="product-name">{{ data.product?.name ?? '—' }}</span>
                <span v-if="data.product?.category" class="product-category">
                  {{ data.product.category.name }}
                </span>
              </div>
            </template>
          </Column>

          <Column field="internalCode" header="Código">
            <template #body="{ data }">{{ data.internalCode ?? '—' }}</template>
          </Column>

          <Column header="Estado" style="width: 130px">
            <template #body="{ data }">
              <DeviceStatusBadge :status="data.status?.name ?? ''" />
            </template>
          </Column>

          <Column header="Ubicación">
            <template #body="{ data }">{{ data.ubication?.name ?? '—' }}</template>
          </Column>

          <!-- Columna de selección rápida -->
          <Column style="width: 120px">
            <template #body="{ data }">
              <Button
                :label="isSelected(data.id) ? 'Quitar' : 'Seleccionar'"
                :severity="isSelected(data.id) ? 'secondary' : 'primary'"
                :outlined="!isSelected(data.id)"
                size="small"
                @click="toggleSelection(data.id)"
              />
            </template>
          </Column>

        </DataTable>
      </template>
    </Card>

    <!-- Dialog de solicitud de préstamo -->
    <Dialog
      v-model:visible="showLoanDialog"
      header="Solicitar préstamo"
      modal
      :style="{ width: '480px' }"
      :closable="!submittingLoan"
    >
      <div class="loan-dialog-content">

        <!-- Dispositivos seleccionados -->
        <div class="selected-devices-section">
          <label class="section-label">Dispositivos seleccionados</label>
          <div class="selected-devices-list">
            <div
              v-for="device in selectedDevices"
              :key="device.id"
              class="selected-device-item"
            >
              <i class="pi pi-server text-muted-color" />
              <span>{{ device.product?.name ?? '—' }}</span>
              <span class="device-code text-muted-color">{{ device.internalCode ?? `#${device.id}` }}</span>
            </div>
          </div>
        </div>

        <!-- Motivo -->
        <div class="flex flex-col gap-1">
          <label class="font-medium">Motivo del préstamo</label>
          <Textarea
            v-model="loanReason"
            rows="3"
            placeholder="Describe brevemente para qué necesitas el dispositivo..."
            :disabled="submittingLoan"
          />
        </div>

        <!-- Fecha estimada de devolución -->
        <div class="flex flex-col gap-1">
          <label class="font-medium">Fecha estimada de devolución</label>
          <DatePicker
            v-model="loanEstimatedReturn"
            :minDate="new Date()"
            dateFormat="dd/mm/yy"
            placeholder="Selecciona una fecha"
            showIcon
            :disabled="submittingLoan"
          />
        </div>

      </div>

      <template #footer>
        <Button label="Cancelar" severity="secondary" text :disabled="submittingLoan" @click="showLoanDialog = false" />
        <Button
          label="Enviar solicitud"
          icon="pi pi-send"
          :loading="submittingLoan"
          @click="handleCreateLoan"
        />
      </template>
    </Dialog>

  </div>
</template>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 1.25rem; }
.page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
.page-title { font-size: 1.5rem; font-weight: 700; margin: 0; }
.page-subtitle { font-size: 0.875rem; color: var(--p-text-muted-color); margin: 0.25rem 0 0; }

.filters-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.filter-search { flex: 1; min-width: 200px; }
.filter-category { width: 200px; }

.results-info { font-size: 0.875rem; color: var(--p-text-muted-color); }
.selected-count { color: var(--p-primary-color); font-weight: 600; }

.product-info { display: flex; flex-direction: column; gap: 0.15rem; }
.product-name { font-weight: 500; font-size: 0.9rem; }
.product-category { font-size: 0.75rem; color: var(--p-text-muted-color); }

/* Dialog */
.loan-dialog-content { display: flex; flex-direction: column; gap: 1rem; }
.section-label { font-weight: 600; font-size: 0.875rem; display: block; margin-bottom: 0.5rem; }
.selected-devices-list { display: flex; flex-direction: column; gap: 0.4rem; max-height: 150px; overflow-y: auto; }
.selected-device-item {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.4rem 0.6rem; border-radius: 6px;
  background: var(--p-surface-50, rgba(0,0,0,0.03));
  font-size: 0.875rem;
}
.device-code { margin-left: auto; font-size: 0.8rem; }

/* Transición del botón de solicitud */
.fade-enter-active, .fade-leave-active { transition: opacity 200ms, transform 200ms; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
