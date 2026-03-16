<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user.store'
import { getProducts } from '@/services/product.service'
import { getDevices, getAvailableDevices } from '@/services/device.service'
import { getLoans, getMyLoans } from '@/services/loan.service'

const router    = useRouter()
const toast     = useToast()
const userStore = useUserStore()

const loading = ref(false)

// ── Métricas ──────────────────────────────────────────────────────────
const totalProducts       = ref(0)
const totalDevices        = ref(0)
const availableDevices    = ref(0)
const pendingLoans        = ref(0)
const activeLoans         = ref(0)   // prestado
const myPendingLoans      = ref(0)
const myActiveLoans       = ref(0)

async function loadMetrics() {
  loading.value = true
  try {
    if (userStore.isAdmin) {
      const [products, devices, loans] = await Promise.all([
        getProducts(),
        getDevices(),
        getLoans(),
      ])
      totalProducts.value    = products.length
      totalDevices.value     = devices.length
      availableDevices.value = devices.filter(d => d.status?.name === 'disponible').length
      pendingLoans.value     = loans.filter(l => l.status?.name === 'pendiente').length
      activeLoans.value      = loans.filter(l => l.status?.name === 'prestado').length
    } else {
      const [available, myLoans] = await Promise.all([
        getAvailableDevices(),
        getMyLoans(),
      ])
      availableDevices.value = available.length
      myPendingLoans.value   = myLoans.filter(l => l.status?.name === 'pendiente').length
      myActiveLoans.value    = myLoans.filter(l => l.status?.name === 'prestado').length
    }
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las métricas.', life: 3000 })
  } finally {
    loading.value = false
  }
}

onMounted(loadMetrics)
</script>

<template>
  <div class="page-container">

    <!-- Bienvenida -->
    <div class="welcome-banner">
      <div class="welcome-text">
        <h1 class="welcome-title">
          Bienvenido, {{ userStore.currentUser?.name ?? userStore.currentUser?.username }} 👋
        </h1>
        <p class="welcome-sub">
          {{ userStore.isAdmin ? 'Panel de administración — LabDIC Inventory' : 'Portal de préstamos — LabDIC' }}
        </p>
      </div>
    </div>

    <!-- Métricas admin -->
    <template v-if="userStore.isAdmin">
      <div class="metrics-grid">

        <div class="metric-card" @click="$router.push({ name: 'admin-products' })">
          <div class="metric-icon products">
            <i class="pi pi-tag" />
          </div>
          <div class="metric-body">
            <span class="metric-value">
              <i v-if="loading" class="pi pi-spin pi-spinner" />
              <span v-else>{{ totalProducts }}</span>
            </span>
            <span class="metric-label">Productos</span>
          </div>
        </div>

        <div class="metric-card" @click="$router.push({ name: 'admin-devices' })">
          <div class="metric-icon devices">
            <i class="pi pi-server" />
          </div>
          <div class="metric-body">
            <span class="metric-value">
              <i v-if="loading" class="pi pi-spin pi-spinner" />
              <span v-else>{{ totalDevices }}</span>
            </span>
            <span class="metric-label">Dispositivos totales</span>
          </div>
        </div>

        <div class="metric-card" @click="$router.push({ name: 'catalog' })">
          <div class="metric-icon available">
            <i class="pi pi-check-circle" />
          </div>
          <div class="metric-body">
            <span class="metric-value">
              <i v-if="loading" class="pi pi-spin pi-spinner" />
              <span v-else>{{ availableDevices }}</span>
            </span>
            <span class="metric-label">Disponibles</span>
          </div>
        </div>

        <div class="metric-card" @click="$router.push({ name: 'admin-loans' })">
          <div class="metric-icon pending">
            <i class="pi pi-clock" />
          </div>
          <div class="metric-body">
            <span class="metric-value">
              <i v-if="loading" class="pi pi-spin pi-spinner" />
              <span v-else>{{ pendingLoans }}</span>
            </span>
            <span class="metric-label">Solicitudes pendientes</span>
          </div>
        </div>

        <div class="metric-card" @click="$router.push({ name: 'admin-loans' })">
          <div class="metric-icon active">
            <i class="pi pi-send" />
          </div>
          <div class="metric-body">
            <span class="metric-value">
              <i v-if="loading" class="pi pi-spin pi-spinner" />
              <span v-else>{{ activeLoans }}</span>
            </span>
            <span class="metric-label">Préstamos activos</span>
          </div>
        </div>

      </div>

      <!-- Accesos rápidos admin -->
      <div class="quick-access">
        <h2 class="section-title">Accesos rápidos</h2>
        <div class="quick-grid">
          <Button label="Gestionar préstamos" icon="pi pi-file-edit" outlined
            @click="$router.push({ name: 'admin-loans' })" />
          <Button label="Ver dispositivos" icon="pi pi-server" outlined severity="secondary"
            @click="$router.push({ name: 'admin-devices' })" />
          <Button label="Gestionar usuarios" icon="pi pi-users" outlined severity="secondary"
            @click="$router.push({ name: 'admin-users' })" />
          <Button label="Catálogo auxiliar" icon="pi pi-cog" outlined severity="secondary"
            @click="$router.push({ name: 'admin-catalog' })" />
        </div>
      </div>
    </template>

    <!-- Métricas usuario normal -->
    <template v-else>
      <div class="metrics-grid">

        <div class="metric-card" @click="$router.push({ name: 'catalog' })">
          <div class="metric-icon available">
            <i class="pi pi-box" />
          </div>
          <div class="metric-body">
            <span class="metric-value">
              <i v-if="loading" class="pi pi-spin pi-spinner" />
              <span v-else>{{ availableDevices }}</span>
            </span>
            <span class="metric-label">Dispositivos disponibles</span>
          </div>
        </div>

        <div class="metric-card" @click="$router.push({ name: 'my-loans' })">
          <div class="metric-icon pending">
            <i class="pi pi-clock" />
          </div>
          <div class="metric-body">
            <span class="metric-value">
              <i v-if="loading" class="pi pi-spin pi-spinner" />
              <span v-else>{{ myPendingLoans }}</span>
            </span>
            <span class="metric-label">Mis solicitudes pendientes</span>
          </div>
        </div>

        <div class="metric-card" @click="$router.push({ name: 'my-loans' })">
          <div class="metric-icon active">
            <i class="pi pi-send" />
          </div>
          <div class="metric-body">
            <span class="metric-value">
              <i v-if="loading" class="pi pi-spin pi-spinner" />
              <span v-else>{{ myActiveLoans }}</span>
            </span>
            <span class="metric-label">Mis préstamos activos</span>
          </div>
        </div>

      </div>

      <!-- Accesos rápidos usuario -->
      <div class="quick-access">
        <h2 class="section-title">¿Qué deseas hacer?</h2>
        <div class="quick-grid">
          <Button label="Ver catálogo de dispositivos" icon="pi pi-box"
            @click="$router.push({ name: 'catalog' })" />
          <Button label="Ver mis solicitudes" icon="pi pi-list" outlined severity="secondary"
            @click="$router.push({ name: 'my-loans' })" />
        </div>
      </div>
    </template>

  </div>
  <!-- Footer informativo -->
  <div class="author-footer">
    <p><strong>LabDIC Inventory</strong> © 2025 — Todos los derechos reservados</p>
    <p>Autor: Ariel López S. | Futuro ingeniero en computación</p>
    <p>Correo: arilopez@umag.cl · arielmrlpzst@gmail.com | Contacto: +56 9 4139 4363</p>
  </div>
</template>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 1.5rem; }

/* Banner de bienvenida */
.welcome-banner {
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
  color: white;
}
.welcome-title { font-size: 1.5rem; font-weight: 700; margin: 0; }
.welcome-sub   { font-size: 0.9rem; opacity: 0.8; margin: 0.25rem 0 0; }

/* Grid de métricas */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 10px;
  background: var(--p-surface-0, #ffffff);
  border: 1px solid var(--p-surface-200, rgba(0,0,0,0.08));
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: box-shadow 150ms, transform 150ms;
}
.metric-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.metric-icon {
  width: 48px; height: 48px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
}
.metric-icon.products  { background: #ede9fe; color: #7c3aed; }
.metric-icon.devices   { background: #dbeafe; color: #2563eb; }
.metric-icon.available { background: #dcfce7; color: #16a34a; }
.metric-icon.pending   { background: #fef9c3; color: #ca8a04; }
.metric-icon.active    { background: #ffedd5; color: #ea580c; }

.metric-body { display: flex; flex-direction: column; gap: 0.2rem; min-width: 0; }
.metric-value { font-size: 1.75rem; font-weight: 700; line-height: 1; color: var(--p-text-color); }
.metric-label { font-size: 0.8rem; color: var(--p-text-muted-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Accesos rápidos */
.quick-access { display: flex; flex-direction: column; gap: 0.75rem; }
.section-title { font-size: 1rem; font-weight: 700; margin: 0; color: var(--p-text-muted-color); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.8rem; }
.quick-grid { display: flex; gap: 0.75rem; flex-wrap: wrap; }

@media (max-width: 640px) {
  .metrics-grid { grid-template-columns: 1fr 1fr; }
  .welcome-title { font-size: 1.2rem; }
}
.author-footer {
  margin-top: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--p-surface-200, rgba(0,0,0,0.08));
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
  line-height: 1.8;
}
</style>
