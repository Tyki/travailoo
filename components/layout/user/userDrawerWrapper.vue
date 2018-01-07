<template lang="html">
  <v-navigation-drawer
    fixed
    :clipped="$vuetify.breakpoint.width > 1264"
    v-model="drawer"
    app
  >
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'userDrawerWrapper',
  data: () => ({
    drawer: false
  }),
  mounted () {
    this.$eventBus.$on('User::toggleDrawer', () => {
      this.drawer = !this.drawer
    })
  }
}
</script>

<style lang="css">
</style>
