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

const logger = function(...message) {
  if (window && localStorage && localStorage.getItem('debug')) {
    console.log(message)
  }
}

const loggerError = function(...message) {
  if (window && localStorage && localStorage.getItem('debug')) {
    console.error(message)
  }
}

const inBrowser = typeof navigator !== 'undefined'
if (inBrowser) {
  // Inject Kuzzle in Vue prototype
  Vue.prototype.$kuzzle = new Kuzzle(process.env.KUZZLE_HOST)
}

function getParametersByName(name) {
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
  localStorage.setItem('debug', 'true')
}

Vue.prototype.$log = logger
Vue.prototype.$logError = loggerError

Vue.mixin({
  computed: {
    isUserLogged() {
      return this.$store.state.user.isUserLogged
    },
    userInformations() {
      return this.$store.state.user.userInformations
    }
  }
})
