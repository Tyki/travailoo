<template lang='html'>
  <v-app id='inspire'>
      <!-- Load the map on the client-side  -->
      <init />
      <v-layout class='main-layout'>
        <v-flex xs8>
          <no-ssr>
            <mapboxMap class='map-layout'/>      
          </no-ssr>
        </v-flex>

        <v-flex xs4 class='elevation-25'>
          <right-panel />
        </v-flex>
      </v-layout>
      
      <!-- Navbar and user left menu -->
      <user-drawer-wrapper />

      <navbar />

      <!-- Wrapper modals -->
      <modal-wrapper />
  </v-app>
</template>

<script>
import navbar from '~/components/layout/navbar'
import mapboxMap from '~/components/map/mapboxMap'
import rightPanel from '@/components/layout/rightPanel'
import userDrawerWrapper from '~/components/layout/user/userDrawerWrapper'
import modalWrapper from '~/components/modals/modalWrapper'
import init from '@/components/init'

export default {
  components: {
    navbar,
    mapboxMap,
    rightPanel,
    userDrawerWrapper,
    modalWrapper,
    init
  },
  data: function () {
    return {
      showFilters: false,
      showInit: true
    }
  },
  mounted () {
    this.$eventBus.$on('Search::ShowFilters', () => {
      this.showFilters = !this.showFilters
    })
  }
}
</script>

<style>
.main-layout {
  position: relative;
}
.map-layout {
  flex: 0 0 75%;
}
</style>
