export const state = () => ({
  // User
  isUserLogged: false,
  userId: '',
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
  },
  updateUserId (state, userId) {
    state.userId = userId
  }
}
