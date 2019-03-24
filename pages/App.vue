<template lang="html">
  <v-app style="overflow-y: hidden; height: 100vh;">
    <Navbar />

    <init />

    <v-content>
      <v-layout class="main-layout">
        <v-flex xs7>
          <no-ssr>
            <Mapbox class="map-layout" />
          </no-ssr>
        </v-flex>

        <v-flex xs5 class="elevation-25">
          <RightPanel />
        </v-flex>
      </v-layout>
    </v-content>

    <!-- Wrapper Modals -->
    <ModalWrapper />
  </v-app>
</template>

<script>
import Navbar from '../components/Particulier/Layout/Navbar'
import Mapbox from '../components/Particulier/Map/Mapbox'
import RightPanel from '../components/Particulier/Layout/RightPanel'
import ModalWrapper from '../components/Particulier/Modals/ModalWrapper'
import Init from '../components/Init'

export default {
  components: {
    Navbar,
    Mapbox,
    RightPanel,
    ModalWrapper,
    Init
  },
  data: function() {
    return {
      showFilters: false,
      showInit: true
    }
  },
  mounted() {
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
