<template lang="html">
  <gmap-map
    :center="{lat:lat, lng:lng}"
    :zoom="10"
    map-type-id="terrain"
    style="width: 100vw; height: 100vh"
    @click="mapClickHandler"
  >
    <gmap-cluster v-if="mapMode === 'showJobs'">
      <gmap-marker v-for="job in jobs" :position="job.position" :key="job.id" />
    </gmap-cluster>

    <gmap-cluster v-if="mapMode === 'create'">
      <gmap-marker v-if="createNewJobPosition.lat !== '' && createNewJobPosition.lng !== ''" :position="createNewJobPosition" />
    </gmap-cluster>
  </gmap-map>
</template>

<script>
import * as mapModes from '@/helpers/constants/mapModes'

export default {
  name: 'mapWrapper',
  data: () => ({
    lat: 48.864716,
    lng: 2.349014,
    jobs: [],
    createNewJobPosition: {
      lat: '',
      lng: ''
    }
  }),
  computed: {
    mapMode () {
      return this.$store.state.map.mapMode
    }
  },
  methods: {
    showPosition (position) {
      this.lat = position.coords.latitude
      this.lng = position.coords.longitude
    },

    mapClickHandler (position) {
      if (this.mapMode === mapModes.default.create) {
        this.createNewJobPosition.lat = position.latLng.lat()
        this.createNewJobPosition.lng = position.latLng.lng()
        this.$eventBus.$emit('Jobs::PositionStep1', (position.latLng))
      }
    }
  },
  mounted () {
    this.$eventBus.$on('Jobs::CancelCreate', () => {
      // Reset the newJob marker
      this.createNewJobPosition.lat = ''
      this.createNewJobPosition.lng = ''
    })
  },
  created () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition)
    }
  }
}
</script>

<style lang="css">
</style>
