export const state = () => ({
  // User
  isUserLogged: false,
  userInformations: {
    firstname: ''
  },
  // TODO
  userPreferences: {}
})

export const mutations = {
  // User
  changeLoggedStatus (state, isUserLogged) {
    state.isUserLogged = isUserLogged
  },
  updateUserFirstname (state, firstname) {
    state.userInformations.firstname = firstname
  }
}
