<template lang="html">
  <v-navigation-drawer
    fixed
    :clipped="$vuetify.breakpoint.width > 1264"
    v-model="drawer"
    right
    app
  >
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'jobDrawerWrapper',
  data: () => ({
    drawer: false
  }),
  mounted () {
    this.$eventBus.$on('Jobs::toggleDrawer', () => {
      this.showFirstTime = true
      this.drawer = !this.drawer
    })
  }
}
</script>

<style lang="css">
</style>
