<template lang='html'>
  <div id='map' class='map' style='width: 100vw; height: 100vh'></div>
  <!-- <gmap-map
    :center='{lat:lat, lng:lng}'
    :zoom='zoom'
    map-type-id='terrain'
    style='width: 100vw; height: 100vh'
    @click='mapClickHandler'
    @center_changed='updateCenter'
    @zoom_changed='updateZoom'
  > -->
    <!-- <gmap-cluster v-if='mapMode === 'showJobs''> -->
    <!-- </gmap-cluster> -->

    <!-- <gmap-cluster v-if='mapMode === 'create''>
      <gmap-marker v-if='createNewJobPosition.lat !== '' && createNewJobPosition.lng !== ''' :position='createNewJobPosition' />
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
    timeout: null,
    features: [],
    working: false
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

      this.map.setCenter(this.lng, this.lat)

      this.updateJobs()
    },

    updateJobs () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        if (!this.working) {
          this.working = true
          getOffersAround(this.lat, this.lng, this.zoom, this.$kuzzle, (result) => {
            // this.offers = offers

            if (this.map.getLayer('clusters')) {
              this.map.removeLayer('clusters')
              this.map.removeLayer('cluster-count')
              this.map.removeLayer('unclustered-point')
            }
            if (this.map.getSource('earthquakes')) {
              this.map.removeSource('earthquakes')
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
                  'title': offer.title,
                  'icon': 'marker'
                }
              })
            })

            var geoJson = {
              'type': 'FeatureCollection',
              'features': this.features
            }

            this.map.addSource('earthquakes', {
              type: 'geojson',
              data: geoJson,
              cluster: true,
              clusterMaxZoom: 14, // Max zoom to cluster points on
              clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
            })

            this.map.addLayer({
              id: 'clusters',
              type: 'circle',
              source: 'earthquakes',
              filter: ['has', 'point_count'],
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
              id: 'cluster-count',
              type: 'symbol',
              source: 'earthquakes',
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
              source: 'earthquakes',
              filter: ['!has', 'point_count'],
              paint: {
                'circle-color': '#11b4da',
                'circle-radius': 4,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
              }
            })

            if (result.limit === true) {
              this.$toasted.global.toastInfo({
                message: 'Résultats limités aux 1000 premiers résultats. Merci de filtrer votre recherche'
              })
            }
            this.working = false
          })
        }
      }, 400)
    },

    bindEvents () {
      // this.map
      this.map.on('dragend', () => {
        this.lat = this.map.getCenter().lat
        this.lng = this.map.getCenter().lng

        this.updateJobs()
      })

      this.map.on('zoom', () => {
        this.zoom = parseInt(this.map.getZoom())

        if (this.zoom < 9) {
          this.map.setZoom(9)
        }
      })

      this.map.on('zoomend', () => {
        this.zoom = parseInt(this.map.getZoom())

        if (this.zoom < 9) {
          this.map.setZoom(9)
        } else {
          this.map.setZoom(this.map.getZoom())
        }

        this.updateJobs()
      })
    }
  },
  mounted () {
    this.$eventBus.$on('Jobs::CancelCreate', () => {
      // Reset the newJob marker
      this.createNewJobPosition.lat = ''
      this.createNewJobPosition.lng = ''
    })

    mapboxgl.accessToken = 'pk.eyJ1IjoieGdhcmEiLCJhIjoiY2pjczNpZHd4Mjh5ZTJ3cm9qOWVweGh2diJ9.R_ISD6-vHwKeBvh8hZWaIA'
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v10',
      zoom: this.zoom,
      center: [this.lng, this.lat]
    })

    this.bindEvents()
  },
  created () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition)
    }
  }
}
</script>

<style lang='css'>
</style>
