<template lang="html">
  <v-app white id="inspire">
    <!-- Load the map on the client-side  -->
    <init />

    <no-ssr>
      <map-wrapper />      
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
import mapWrapper from '~/components/layout/mapWrapper'
import jobDrawerWrapper from '~/components/layout/job/jobDrawerWrapper'
import userDrawerWrapper from '~/components/layout/user/userDrawerWrapper'
import modalWrapper from '~/components/modals/modalWrapper'
import init from '@/components/init'

export default {
  components: {
    navbar,
    mapWrapper,
    jobDrawerWrapper,
    userDrawerWrapper,
    modalWrapper,
    init
  }
}
</script>
