export const state = () => ({
  debug: false
})

export const mutations = {
  debug(state, debugActivated) {
    state.debug = debugActivated
  }
}
