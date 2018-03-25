<template lang="html">
  <v-app white id="inspire">
    <!-- Load the map on the client-side  -->
    <init />

    <no-ssr>
      <mapboxMap />      
    </no-ssr>

    <no-ssr>
      <search-engine v-if='showFilters'/>
    </no-ssr>      

    <!-- Navbar and user left menu -->
    <user-drawer-wrapper />
    <navbar />

    <!-- Right panel to show jobs -->
    <job-drawer-wrapper />

    <!-- Wrapper modals -->
    <modal-wrapper />
  </v-app>
</template>

<script>
import navbar from '~/components/layout/navbar'
import mapboxMap from '~/components/map/mapboxMap'
import jobDrawerWrapper from '~/components/layout/job/jobDrawerWrapper'
import userDrawerWrapper from '~/components/layout/user/userDrawerWrapper'
import modalWrapper from '~/components/modals/modalWrapper'
import init from '@/components/init'
import searchEngine from '@/components/layout/searchEngine'

export default {
  components: {
    navbar,
    mapboxMap,
    jobDrawerWrapper,
    userDrawerWrapper,
    modalWrapper,
    init,
    searchEngine
  },
  data: function () {
    return {
      showFilters: false
    }
  },
  mounted () {
    this.$eventBus.$on('Search::ShowFilters', () => {
      this.showFilters = !this.showFilters
    })
  }
}
</script>
