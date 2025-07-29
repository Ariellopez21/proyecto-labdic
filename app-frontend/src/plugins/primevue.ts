import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'

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
}
