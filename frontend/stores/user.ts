import { defineStore } from 'pinia'

type State  = {
  jwt: string | null
}

type Getters = {
  isLoggedIn: (state: State) => boolean
}

export const useUserStore = defineStore('user', {
  state: () => ({
    jwt: null
  } as State),
  getters: {
    isLoggedIn: (state) => {
      return Boolean(state.jwt)
    }
  } as Getters
})