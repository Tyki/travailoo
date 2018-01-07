<template lang="html">
  <gmap-map
    :center="{lat:10, lng:10}"
    :zoom="7"
    map-type-id="terrain"
    style="width: 100vw; height: 100vh"
  >

  </gmap-map>
</template>

<script>
export default {
  name: 'mapWrapper',
  created () {
    // Fetch the differents jobs
  }
}
</script>

<style lang="css">
</style>
