<template lang='html'>
  <div v-bind:class='{ hidden: !mapLoaded }'>
    <div id='travailoo-map' style='height: 100vh' />
  </div>
</template>

<script>
import * as mapModes from '@/services/constants/mapModes'
import { getOffersAround } from '@/services/helpers/jobHelper'
import mapboxMarker from '@/components/map/mapboxMarker'

/* eslint-disable no-undef */
/* eslint-disable no-new */
export default {
  name: 'mapboxMap',
  components: {
    mapboxMarker
  },
  data: () => ({
    lat: 48.864716,
    lng: 2.349014,
    createNewJobPosition: {
      lat: '',
      lng: ''
    },
    zoom: 8,
    map: null,
    timeout: null,
    features: [],
    working: false,
    showLayers: 'visible',
    lastLayer: null,
    mapLoaded: true
  }),
  computed: {
    mapMode () {
      return this.$store.state.map.mapMode
    },
    filters () {
      return this.$store.state.jobs.filters
    }
  },
  methods: {
    setPosition (position) {
      this.lat = position.coords.latitude
      this.lng = position.coords.longitude

      // Set center on the map
      this.map.setView([
        this.lat,
        this.lng
      ])

      this.updateJobs()
    },

    updateJobs () {
      clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
        if (!this.working && this.mapMode === mapModes.default.showJobs) {
          this.working = true

          // Fetching the jobs at the new center
          // TODO : send filters from store
          getOffersAround(this.map.getBounds(), this.filters, this.$kuzzle, (result) => {
            if (result.error) {
              console.log(result.error)
            } else {
              var markers = new L.MarkerClusterGroup()

              this.$store.commit('jobs/addToJobsList', result)

              result.forEach(offer => {
                var marker = L.marker(new L.LatLng(offer.jobPosition.lat, offer.jobPosition.lng), {
                  icon: L.mapbox.marker.icon({'marker-symbol': 'post', 'marker-color': '0044FF'}),
                  title: offer.title
                })

                marker.bindPopup(offer.title)
                markers.addLayer(marker)
              })

              this.map.addLayer(markers)

              if (this.lastLayer !== null) {
                this.map.removeLayer(this.lastLayer)
              }

              this.lastLayer = markers
            }
            this.working = false
          })
        }
      }, 400)
    },

    bindMapEvents () {
      this.map.on('dragend', () => {
        this.updateJobs()
      })

      this.map.on('zoomend', () => {
        this.updateJobs()
      })

      this.map.on('click', (e) => {
        if (this.mapMode === mapModes.default.create) {
          this.createNewJobPosition.lat = e.lngLat.lat
          this.createNewJobPosition.lng = e.lngLat.lng

          if (this.map.hasLayer('new-job-point')) {
            this.map.removeLayer('new-job-point')
            this.map.removeSource('new-job-point')
          }

          this.map.addLayer({
            id: 'new-job-point',
            type: 'circle',
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [this.createNewJobPosition.lng, this.createNewJobPosition.lat]
                  }
                }]
              }
            },
            paint: {
              'circle-color': '#cc3300'
            }
          })

          this.$eventBus.$emit('Jobs::PositionStep1', this.createNewJobPosition)
        }
      })
    }
  },
  watch: {
    mapMode () {
      if (this.mapMode === mapModes.default.create) {
        this.showLayers = 'none'
      } else {
        // Changing mode => Cancel the layer
        if (this.map.getLayer('new-job-point')) {
          this.map.removeLayer('new-job-point')
        }

        this.showLayers = 'visible'
        // Get the points after a cancel where the map is
        this.lat = this.map.getCenter().lat
        this.lng = this.map.getCenter().lng

        this.updateJobs()
      }
    }
  },
  mounted () {
    this.$eventBus.$on('Jobs::CancelCreate', () => {
      // Reset the newJob marker
      this.createNewJobPosition.lat = ''
      this.createNewJobPosition.lng = ''
    })

    this.$eventBus.$on('Jobs::UpdateFiltes', () => {
      // Right panel send an update in filters
      this.updateJobs()
    })

    L.mapbox.accessToken = 'pk.eyJ1IjoieGdhcmEiLCJhIjoiY2pjczNpZHd4Mjh5ZTJ3cm9qOWVweGh2diJ9.R_ISD6-vHwKeBvh8hZWaIA'
    this.map = L.mapbox.map('travailoo-map', 'mapbox.streets', {
      zoomControl: false
    }).setView([this.lng, this.lat], 10)

    this.bindMapEvents()
  },
  created () {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition)
    }
  }
}
</script>

<style>
.hidden {
  visibility: hidden;
}
</style>
