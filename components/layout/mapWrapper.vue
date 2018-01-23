<template lang="html">
  <div class="google-map" :id="mapName" style="width: 100vw; height: 100vh"></div>
  <!-- <gmap-map
    :center="{lat:lat, lng:lng}"
    :zoom="zoom"
    map-type-id="terrain"
    style="width: 100vw; height: 100vh"
    @click="mapClickHandler"
    @center_changed="updateCenter"
    @zoom_changed="updateZoom"
  > -->
    <!-- <gmap-cluster v-if="mapMode === 'showJobs'"> -->
    <!-- </gmap-cluster> -->

    <!-- <gmap-cluster v-if="mapMode === 'create'">
      <gmap-marker v-if="createNewJobPosition.lat !== '' && createNewJobPosition.lng !== ''" :position="createNewJobPosition" />
    </gmap-cluster> -->
  <!-- </gmap-map> -->
</template>

<script>
import * as mapModes from '@/helpers/constants/mapModes'
import { getOffersAround } from '@/helpers/jobHelper'

/* eslint-disable no-undef */
/* eslint-disable no-new */
export default {
  name: 'mapWrapper',
  data: () => ({
    lat: 48.864716,
    lng: 2.349014,
    offers: [],
    createNewJobPosition: {
      lat: '',
      lng: ''
    },
    zoom: 10,
    map: null,
    mapName: 'map',
    timeout: null
  }),
  computed: {
    mapMode () {
      return this.$store.state.map.mapMode
    }
  },
  methods: {
    setPosition (position) {
      this.lat = position.coords.latitude
      this.lng = position.coords.longitude

      // Set center
      this.map.setCenter({
        lat: this.lat,
        lng: this.lng
      })
    },

    updateZoom (zoom) {
      this.zoom = zoom

      this.updateJobs()
    },

    mapClickHandler (position) {
      if (this.mapMode === mapModes.default.create) {
        this.createNewJobPosition.lat = position.latLng.lat()
        this.createNewJobPosition.lng = position.latLng.lng()
        this.$eventBus.$emit('Jobs::PositionStep1', (position.latLng))
      }
    },

    updateCenter (position) {
      this.lat = position.lat()
      this.lng = position.lng()

      this.updateJobs()
    },

    updateJobs () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        getOffersAround(this.lat, this.lng, this.zoom, this.$kuzzle, (offers) => {
          this.offers.forEach(marker => {
            marker.setMap(null)
          })
          // this.offers = offers
          offers.forEach(offer => {
            this.offers.push(new google.maps.Marker({
              position: offer.jobPosition,
              map: this.map
            }))
          })
        })
      }, 400)
    },

    bindEvents () {
      // this.map
      this.map.addListener('center_changed', () => {
        let position = this.map.getCenter()
        this.lat = position.lat()
        this.lng = position.lng()

        this.updateJobs()
      })

      this.map.addListener('zoom_changed', () => {
        this.zoom = this.map.getZoom()
      })
    },

    setMapOnAll (map) {
      this.markers.forEach((marker, key) => {
        this.markers[key].setMap(map)
      })
    }
  },
  mounted () {
    this.$eventBus.$on('Jobs::CancelCreate', () => {
      // Reset the newJob marker
      this.createNewJobPosition.lat = ''
      this.createNewJobPosition.lng = ''
    })

    const element = document.getElementById('map')
    const options = {
      zoom: this.zoom,
      center: new google.maps.LatLng(this.lat, this.lng)
    }
    this.map = new google.maps.Map(element, options)

    this.bindEvents()
  },
  created () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition)
    }
  }
}
</script>

<style lang="css">
</style>
