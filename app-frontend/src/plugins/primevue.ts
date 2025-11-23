// src/plugins/primevue.ts
import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'

import type { App } from 'vue'

export default function setupPrimeVue(app: App) {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: 'my-dark',
      },
    },
  })
  app.use(ConfirmationService)
  app.use(ToastService)
}
