import Toasted from 'vue-toasted'
import Vue from 'vue'

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

Vue.toasted.register('toastInfo',
  (payload) => {
    if (!payload.message) {
      return 'Information missing!'
    }
    return payload.message
  }, {
    type: 'info',
    icon: 'done',
    duration: 3000,
    position: 'top-right'
  })
