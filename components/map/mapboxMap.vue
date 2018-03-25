<template lang='html'>
  <div v-bind:class='{ hidden: !mapLoaded }'>
    <div id='map' style='width: 100vw; height: 100vh'></div>

    <!-- <mapbox-marker v-for='offer in offers' v-bind:offer='offer' v-bind:key='offer.id' /> -->
  </div>
</template>

<script>
import * as mapModes from '@/services/constants/mapModes'
import { getOffersAround } from '@/services/helpers/jobHelper'
import mapboxMarker from '@/components/map/mapboxMarker'

/* eslint-disable no-undef */
/* eslint-disable no-new */
export default {
  name: 'map',
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
    mapLoaded: false,
    offers: []
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

      // Set center on the map
      this.map.setCenter({
        lat: this.lat,
        lng: this.lng
      })

      this.updateJobs(this.map.getBounds())
    },

    updateJobs (bounds) {
      clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
        if (!this.working && this.mapMode === mapModes.default.showJobs) {
          this.working = true

          // Fetching the jobs at the new center
          // TODO : send filters from store
          getOffersAround(bounds, {}, this.$kuzzle, (result) => {
            if (result.error) {
              console.log(result.error)
            }

            this.offers = this.offers.slice(0, this.offers.length)
            result.forEach(offer => {
              this.offers.push(offer)
            })
            // Remove layers and source

            // TODO : use components now
            if (this.map.getLayer('clusters')) {
              this.map.removeLayer('clusters')
              this.map.removeLayer('unclustered-point')
              this.map.removeLayer('cluster-count')
            }

            if (this.map.getSource('offers')) {
              this.map.removeSource('offers')
            }
            this.features = []

            this.ids = {}

            result.forEach(offer => {
              if (!this.ids[offer.id]) {
                this.ids[offer.id] = 1
              } else {
                this.ids[offer.id] = this.ids[offer.id]++
              }
              this.features.push({
                'type': 'Feature',
                'geometry': {
                  'type': 'Point',
                  'coordinates': [offer.jobPosition.lng, offer.jobPosition.lat]
                },
                'properties': {

                  'icon': 'marker',
                  ...offer
                }
              })
            })

            this.redrawLayers(this.features)

            this.working = false
          })
        }
      }, 400)
    },

    redrawLayers (features) {
      this.map.addSource('offers', {
        type: 'geojson',
        data: {
          type: 'FeaturesCollection',
          features
        },
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 20 // Radius of each cluster when clustering points (defaults to 50)
      })

      this.map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'offers',
        filter: ['has', 'point_count'],
        layout: {
          visibility: this.showLayers
        },
        paint: {
          'circle-color': '#cc3300',
          'circle-radius': ['step', ['get', 'point_count'], 10, 100, 30, 750, 40]
        }
      })

      this.map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'offers',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      })

      this.map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'offers',
        filter: ['!has', 'point_count'],
        paint: {
          'circle-color': '#cc3300'
        },
        layout: {
          visibility: this.showLayers
        }
      })
    },

    bindMapEvents () {
      this.map.on('load', () => {
        // Send the information that the map is ready and we can rmeove the loader
        this.mapLoaded = true
        this.$eventBus.$emit('UI::MapLoaded')
      })

      this.map.on('click', (e) => {
        var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]]
        var features = this.map.queryRenderedFeatures(bbox, {layers: ['unclustered-point', 'clusters']})
        console.log(features)
      })

      this.map.on('dragend', () => {
        this.lat = this.map.getCenter().lat
        this.lng = this.map.getCenter().lng
        this.updateJobs(this.map.getBounds())
      })

      this.map.on('zoomend', () => {
        this.updateJobs(this.map.getBounds())
      })

      this.map.on('click', (e) => {
        if (this.mapMode === mapModes.default.create) {
          this.createNewJobPosition.lat = e.lngLat.lat
          this.createNewJobPosition.lng = e.lngLat.lng

          if (this.map.getLayer('new-job-point')) {
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

        this.updateJobs(this.map.getBounds())
      }

      if (this.map.getLayer('clusters')) {
        this.map.setLayoutProperty('clusters', 'visibility', this.showLayers)
      }
      if (this.map.getLayer('cluster-count')) {
        this.map.setLayoutProperty('cluster-count', 'visibility', this.showLayers)
      }
      if (this.map.getLayer('unclustered-point')) {
        this.map.setLayoutProperty('unclustered-point', 'visibility', this.showLayers)
      }
    }
  },
  mounted () {
    this.$eventBus.$on('Jobs::CancelCreate', () => {
      // Reset the newJob marker
      this.createNewJobPosition.lat = ''
      this.createNewJobPosition.lng = ''
    })

    this.$eventBus.$on('Search::ShowFilters', () => {
      this.showFilters = !this.showFilters
    })

    this.$eventBus.$on('Search::FilterSearch', (payload) => {
      this.filters = payload
      this.updateJobs(this.map.getBounds())
    })

    mapboxgl.accessToken = 'pk.eyJ1IjoieGdhcmEiLCJhIjoiY2pjczNpZHd4Mjh5ZTJ3cm9qOWVweGh2diJ9.R_ISD6-vHwKeBvh8hZWaIA'
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v10',
      zoom: 8,
      center: [this.lng, this.lat]
    })

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
