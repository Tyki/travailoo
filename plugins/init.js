import Vue from 'vue'
import Vuetify from 'vuetify'
import EventBus from '~/services/helpers/eventBus'
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

// Init the eventBus
Vue.prototype.$eventBus = EventBus

// Init the kuzzle websocket
const kuzzle = new Kuzzle(process.env.KUZZLE_HOST)

// Inject Kuzzle in Vue prototype
Vue.prototype.$kuzzle = kuzzle
