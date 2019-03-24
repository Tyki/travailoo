<template>
  <div id="travailoo-map-picker" style="height: 300px;"></div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable no-new */
export default {
  name: 'miniMapPicker',
  data: () => ({
    lat: 48.864716,
    lng: 2.34,
    map: null,
    marker: null
  }),
  methods: {
    setPosition(position) {
      this.lat = position.coords.latitude
      this.lng = position.coords.longitude

      // Set center on the Map
      this.map.setView([this.lat, this.lng])
    }
  },
  mounted() {
    L.mapbox.accessToken =
      'pk.eyJ1IjoieGdhcmEiLCJhIjoiY2pjczNpZHd4Mjh5ZTJ3cm9qOWVweGh2diJ9.R_ISD6-vHwKeBvh8hZWaIA'
    this.map = L.mapbox
      .map('travailoo-Map-picker', 'mapbox.streets', {
        zoomControl: false
      })
      .setView([this.lng, this.lat], 10)

    this.map.on('click', event => {
      if (this.marker) {
        this.map.removeLayer(this.marker)
      }

      this.marker = L.marker(event.latlng)

      this.map.addLayer(this.marker)

      this.$emit('position', event.latlng)
    })

    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition)
    }
  }
}
</script>
