import Vue from 'vue'
import Vuetify from 'vuetify'
import EventBus from '~/services/helpers/eventBus'
import Kuzzle from 'kuzzle-sdk'

// Plugin executed only at the beginning.
// Equals main.js

// Front Lib
Vue.use(Vuetify)

// Init the eventBus
Vue.prototype.$eventBus = EventBus

// Init the kuzzle websocket
const kuzzle = new Kuzzle(process.env.KUZZLE_HOST)

// Inject Kuzzle in Vue prototype
Vue.prototype.$kuzzle = kuzzle

const logger = function (message) {
  if (window && localStorage && localStorage.getItem('debug')) {
    // TODO : needs to be multi-argument aware
    console.log(message)
  }
}

const loggerError = function (message) {
  if (window && localStorage && localStorage.getItem('debug')) {
    // TODO : needs to be multi-argument aware
    console.error(message)
  }
}

Vue.prototype.$log = logger
Vue.prototype.$logError = loggerError
