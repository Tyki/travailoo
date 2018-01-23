import Vue from 'vue'
import Vuetify from 'vuetify'
// import * as VueGoogleMaps from '~/node_modules/vue2-google-maps/src/main'
import EventBus from '~/helpers/eventBus'
import Toasted from 'vue-toasted'
import Kuzzle from 'kuzzle-sdk'
import bluebird from 'bluebird'
import wysiwyg from 'vue-wysiwyg'

// Plugin executed only at the beginning.
// Equals main.js

window.onNuxtReady(() => {
  // Front Lib
  Vue.use(Vuetify)
  Vue.use(wysiwyg, {
    hideMOdules: {
      'image': true,
      'removeFormat': true
    }
  })

  // Setup Toast and global error toast
  Vue.use(Toasted)
  Vue.toasted.register('toastError',
    (payload) => {
      if (!payload.message) {
        return 'Oops.. Something went wrong...'
      }

      return payload.message
    }, {
      type: 'error',
      icon: 'error_outline',
      duration: 3000,
      position: 'top-right'
    })

  Vue.toasted.register('toastSuccess',
    (payload) => {
      if (!payload.message) {
        return 'Success!'
      }
      return payload.message
    }, {
      type: 'success',
      icon: 'done',
      duration: 3000,
      position: 'top-right'
    })

  // Vue.use(VueGoogleMaps, {
  //   load: {
  //     key: process.env.API_KEY,
  //     libraries: 'places'
  //     // This is required if you use the Autocomplete plugin
  //     // OR: libraries: 'places,drawing'
  //     // OR: libraries: 'places,drawing,visualization'
  //     // (as you require)
  //   }
  // })

  // Init the eventBus
  Vue.prototype.$eventBus = EventBus

  // Init the kuzzle websocket
  Kuzzle.prototype.bluebird = bluebird
  const kuzzle = new Kuzzle(process.env.KUZZLE_HOST)

  // Inject Kuzzle in Vue prototype
  Vue.prototype.$kuzzle = kuzzle

  console.log('Done initializing')
})
