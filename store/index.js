import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      isUserLogged: false,
      userInformations: {
        firstname: ''
      },
      // TODO
      userPreferences: {}
    },
    mutations: {
      changeLoggedStatus (state, isUserLogged) {
        state.isUserLogged = isUserLogged
      },
      updateUserFirstname (state, firstname) {
        state.userInformations.firstname = firstname
      }
    }
  })
}

export default createStore
