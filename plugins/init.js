import Vue from 'vue'
import Vuetify from 'vuetify'
// import * as VueGoogleMaps from '~/node_modules/vue2-google-maps/src/main'
import EventBus from '~/helpers/eventBus'
import Kuzzle from 'kuzzle-sdk'
import wysiwyg from 'vue-wysiwyg'

// Plugin executed only at the beginning.
// Equals main.js

// Front Lib
Vue.use(Vuetify)
Vue.use(wysiwyg, {
  hideModules: {
    'image': true,
    'removeFormat': true
  }
})

/* Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.API_KEY,
    libraries: 'places'
    // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
  }
}) */

// Init the eventBus
Vue.prototype.$eventBus = EventBus

// Init the kuzzle websocket
const kuzzle = new Kuzzle(process.env.KUZZLE_HOST)

// Inject Kuzzle in Vue prototype
Vue.prototype.$kuzzle = kuzzle
