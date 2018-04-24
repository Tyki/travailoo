<template lang="html">
  <v-app id="inspire">
    <!-- Load the map on the client-side  -->
    <init />
    <v-layout>
      <v-flex xs9>
        <no-ssr>
          <mapboxMap />      
        </no-ssr>
      </v-flex>

      <v-flex xs3 class="elevation-25" style="background-color: white;">
        <job-wrapper />
      </v-flex>
    </v-layout>
    
    <!-- Navbar and user left menu -->
    <user-drawer-wrapper />

    <navbar />

    <!-- Right panel to show jobs -->

    <!-- Wrapper modals -->
    <modal-wrapper />
  </v-app>
</template>

<script>
import navbar from '~/components/layout/navbar'
import mapboxMap from '~/components/map/mapboxMap'
import jobWrapper from '~/components/layout/job/jobWrapper'
import userDrawerWrapper from '~/components/layout/user/userDrawerWrapper'
import modalWrapper from '~/components/modals/modalWrapper'
import init from '@/components/init'
import searchEngine from '@/components/layout/searchEngine'

export default {
  components: {
    navbar,
    mapboxMap,
    jobWrapper,
    userDrawerWrapper,
    modalWrapper,
    init,
    searchEngine
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
html {
    overflow: scroll;
    overflow-x: hidden;
}
::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    background: transparent;  /* optional: just make scrollbar invisible */
}
/* optional: show position indicator in red */
::-webkit-scrollbar-thumb {
    background: #FF0000;
}
</style>
