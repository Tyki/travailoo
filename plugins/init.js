import Vue from 'vue'
import Vuetify from 'vuetify'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps/src/main'
import EventBus from '~/helpers/eventBus'
import Toasted from 'vue-toasted'

// Plugin executed only at the beginning.
// Equals main.js

window.onNuxtReady(() => {
  // Front Lib
  Vue.use(Vuetify)

  // Setup Toast and global error toast
  Vue.use(Toasted)
  const toastOptions = {
    type: 'error',
    icon: 'error_outline',
    duration: 3000,
    position: 'top-right'
  }
  Vue.toasted.register('toastError',
    (payload) => {
      if (!payload.message) {
        return 'Oops.. Something went wrong...'
      }

      return payload.message
    }, toastOptions)

  Vue.use(VueGoogleMaps, {
    load: {
      key: process.env.API_KEY,
      libraries: 'places'
      // This is required if you use the Autocomplete plugin
      // OR: libraries: 'places,drawing'
      // OR: libraries: 'places,drawing,visualization'
      // (as you require)
    }
  })

  // Init the eventBus
  Vue.prototype.$eventBus = EventBus

  console.log('Done initializing')
})
