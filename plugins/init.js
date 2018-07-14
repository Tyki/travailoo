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

const inBrowser = (typeof navigator !== 'undefined')

function getParametersByName (name) {
  console.log(inBrowser)
  // SSR compliant
  if (!inBrowser) {
    return null
  }

  let url = window.location.href
  /* eslint-disable no-useless-escape */
  name = name.replace(/[\[\]]/g, '\\$&')

  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  var results = regex.exec(url)

  if (!results) return null
  if (!results[2]) return ''

  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

if (getParametersByName('debug') === 'true') {
  localStorage.setItem('debug', true)
}

Vue.prototype.$log = logger
Vue.prototype.$logError = loggerError
