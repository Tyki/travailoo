import Vue from 'vue'
import Vuetify from 'vuetify'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps/src/main'

// Plugin executed only at the beginning.
// Equals main.js

window.onNuxtReady(() => {
  // TODO : to be changed to specific needed components
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

  console.log('Done initializing')
})
