import Vue from 'vue'
import Vuetify from 'vuetify'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps/src/main'
import EventBus from '~/helpers/eventBus'

// Plugin executed only at the beginning.
// Equals main.js

window.onNuxtReady(() => {
  Vue.use(Vuetify)

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
