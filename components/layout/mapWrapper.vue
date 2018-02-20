<template lang='html'>
  <div v-bind:class="{ hidden: !mapLoaded }">
    <div id='map' class='map' style='width: 100vw; height: 100vh'></div>
    <!-- TODO : pass saved filter to the search engine in case the user closed the search -->
    <search-engine v-if="showFilters" :filters="filters"/>
  </div>
</template>

<script>
import * as mapModes from '@/helpers/constants/mapModes'
import { getOffersAround } from '@/helpers/jobHelper'
import searchEngine from '@/components/layout/searchEngine'

/* eslint-disable no-undef */
/* eslint-disable no-new */
export default {
  name: 'mapWrapper',
  components: {
    searchEngine
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
    showFilters: false,
    filters: {},
    mapLoaded: false
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

      this.map.setCenter(this.lng, this.lat)

      this.updateJobs()
    },

    updateJobs (bounds) {
      clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
        if (!this.working && this.mapMode === mapModes.default.showJobs) {
          this.working = true

          // Fetching the jobs at the new center
          getOffersAround(bounds, this.zoom, this.filters, this.$kuzzle, (result) => {
            // Remove layers and source
            if (this.map.getLayer('clusters')) {
              this.map.removeLayer('clusters')
              this.map.removeLayer('unclustered-point')
            }

            if (this.map.getSource('offers')) {
              this.map.removeSource('offers')
            }
            this.features = []

            result.offers.forEach(offer => {
              this.features.push({
                'type': 'Feature',
                'geometry': {
                  'type': 'Point',
                  'coordinates': [offer.jobPosition.lng, offer.jobPosition.lat]
                },
                'properties': {
                  'title': '',
                  'icon': 'marker'
                }
              })
            })

            this.redrawLayers({
              'type': 'FeatureCollection',
              'features': this.features
            })

            this.working = false
          })
        }
      }, 400)
    },

    redrawLayers (geoJson) {
      this.map.addSource('offers', {
        type: 'geojson',
        data: geoJson,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: this.zoom // Radius of each cluster when clustering points (defaults to 50)
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
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      })

      this.map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'offers',
        filter: ['!has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        },
        layout: {
          visibility: this.showLayers
        }
      })
    },

    bindMapEvents () {
      // this.map
      this.map.on('dragend', () => {
        this.lat = this.map.getCenter().lat
        this.lng = this.map.getCenter().lng
        this.updateJobs(this.map.getBounds())
      })

      this.map.on('zoomend', () => {
        this.zoom = this.map.getZoom()
        this.updateJobs(this.map.getBounds())
      })

      this.map.on('click', (e) => {
        if (this.mapMode === mapModes.default.create) {
          this.createNewJobPosition.lat = e.lngLat.lat
          this.createNewJobPosition.lng = e.lngLat.lng

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
      zoom: this.zoom,
      center: [this.lng, this.lat]
    })

    this.map.on('load', () => {
      // Send the information that the map is ready and we can rmeove the loader
      this.mapLoaded = true
      this.$eventBus.$emit('UI::MapLoaded')
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
