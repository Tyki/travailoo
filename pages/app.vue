<template lang="html">
  <v-app dark id="inspire">
    <!-- Navbar and user left menu -->
    <user-drawer-wrapper />
    <navbar />

    <!-- Map with jobs -->
    <map-wrapper />

    <!-- Right panel to show jobs -->
    <job-drawer-wrapper />
  </v-app>
</template>

<script>
import navbar from '~/components/layout/navbar'
import mapWrapper from '~/components/layout/mapWrapper'
import jobDrawerWrapper from '~/components/layout/job/jobDrawerWrapper'
import userDrawerWrapper from '~/components/layout/user/userDrawerWrapper'

export default {
  components: {
    navbar,
    mapWrapper,
    jobDrawerWrapper,
    userDrawerWrapper
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
