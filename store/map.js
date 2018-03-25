import * as MapModes from '@/services/constants/mapModes'

// Modules
let mapModes = MapModes.default

export const state = () => ({
  // MAP
  mapMode: mapModes.showJobs
})

export const mutations = {
  // Map
  switchToMapModeCreate (state) {
    state.mapMode = mapModes.create
  },
  switchToMapModeShowJobs (state) {
    state.mapMode = mapModes.showJobs
  }
}
