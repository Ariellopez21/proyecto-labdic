// src/plugins/pinia.ts
import { createPinia } from 'pinia'

import type { App } from 'vue'

export default function setupPinia(app: App) {
  app.use(createPinia())
}
