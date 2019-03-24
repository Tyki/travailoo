<template lang="html">
  <div v-bind:class="{ hidden: !mapLoaded }">
    <div id="TravailooMap" style="height: 100vh" />
  </div>
</template>

<script>
import { getOffersAround } from '@/services/helpers/jobHelper'

/* eslint-disable no-undef */
/* eslint-disable no-new */
export default {
  name: 'Mapbox',

  data: () => ({
    lat: 48.864716,
    lng: 2.349014,
    zoom: 8,
    map: null,
    timeout: null,
    features: [],
    working: false,
    lastLayer: null,
    mapLoaded: false,
    originalPosition: {},
    originalZoom: {}
  }),
  computed: {
    filters() {
      return this.$store.state.jobs.filters
    }
  },
  methods: {
    setPosition(position) {
      this.lat = position.coords.latitude
      this.lng = position.coords.longitude

      // Set center on the Map
      this.map.setView([this.lat, this.lng])

      this.originalPosition = this.map.getCenter()
      this.originalZoom = this.map.getZoom()

      this.updateJobs()
    },

    clickMarker(e) {
      this.$eventBus.$emit('Jobs::focusJob', this.jobData)
    },

    updateJobs() {
      clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
        if (!this.working) {
          this.working = true

          // Fetching the jobs at the new center
          // TODO : send filters from store
          getOffersAround(
            this.map.getBounds(),
            this.filters,
            this.$kuzzle,
            result => {
              if (result.error) {
                console.log(result.error)
              } else {
                var markers = new L.MarkerClusterGroup()
                this.$store.commit('jobs/addToJobsList', result)

                Object.keys(result).forEach(id => {
                  let offer = result[id]
                  var marker = L.marker(
                    new L.LatLng(offer.jobPosition.lat, offer.jobPosition.lng),
                    {
                      icon: L.mapbox.marker.icon({
                        'marker-symbol': 'post',
                        'marker-color': '0044FF'
                      }),
                      title: offer.title,
                      riseOnHover: false // Set to true for paid ads
                    }
                  )

                  marker.on('click', this.clickMarker)

                  markers.addLayer(marker)
                })

                this.map.addLayer(markers)

                if (this.lastLayer !== null) {
                  this.map.removeLayer(this.lastLayer)
                }

                this.lastLayer = markers
              }
              this.working = false
            }
          )
        }
      }, 400)
    },

    bindMapEvents() {
      this.map.on('dragend', () => {
        this.originalPosition = this.map.getCenter()
        this.originalZoom = this.map.getZoom()

        this.updateJobs()
      })

      this.map.on('zoomend', () => {
        this.originalZoom = this.map.getZoom()

        this.updateJobs()
      })

      this.map.on('click', e => {
        this.$eventBus.$emit('Jobs::closeFocusJob')
      })
    }
  },
  mounted() {
    this.$eventBus.$on('Jobs::UpdateFiltes', () => {
      // Right panel send an update in filters
      this.updateJobs()
    })

    // TODO : to debug
    /* this.$eventBus.$on('Map::FlyTo', (payload) => {
      if (payload.to === 'original') {
        this.Map.setView([
          this.originalPosition.lat,
          this.originalPosition.lng
        ], this.originalZoom)
      } else {
        let position = payload.to.position
        this.Map.setView([
          position.lat,
          position.lng
        ], 15)
      }
    }) */

    L.mapbox.accessToken =
      'pk.eyJ1IjoieGdhcmEiLCJhIjoiY2pjczNpZHd4Mjh5ZTJ3cm9qOWVweGh2diJ9.R_ISD6-vHwKeBvh8hZWaIA'
    this.map = L.mapbox
      .map('TravailooMap', 'mapbox.streets', {
        zoomControl: false
      })
      .setView([this.lng, this.lat], 10)

    this.bindMapEvents()

    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition)
    }

    this.updateJobs()
    this.mapLoaded = true
  }
}
</script>

<style>
.hidden {
  visibility: hidden;
}
</style>
