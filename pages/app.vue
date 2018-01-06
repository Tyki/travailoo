<template lang="html">
  <v-app>
    <v-content>
      <navbar/>
        <gmap-map
          :center="{lat:10, lng:10}"
          :zoom="7"
          map-type-id="terrain"
          style="width: 100vw; height: 93.7vh"
        >

        </gmap-map>
    </v-content>
  </v-app>


</template>

<script>
import navbar from '@/components/layout/navbar'

export default {
  components: {
    navbar
  }
}
</script>

<style type="text/css">
body {
    overflow:hidden;
}

::-webkit-scrollbar {
    display: none;
}
</style>
