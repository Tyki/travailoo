<template lang="html">
  <v-toolbar color="blue" dense fixed clipped-left app>
    <v-toolbar-title
      :style="$vuetify.breakpoint.width > 1264 && 'width: 300px'"
      class="ml-0 pl-3"
      :class="$vuetify.breakpoint.width <= 1264 && 'pr-3'"
    >
      <v-toolbar-side-icon @click.stop="$eventBus.$emit('User::toggleDrawer')"></v-toolbar-side-icon>
    </v-toolbar-title>
    <v-layout row align-center style="max-width: 650px">
      <v-text-field
        placeholder="Rechercher..."
        single-line
        append-icon="search"
        :append-icon-cb="() => {}"
        class="white--text"
        hide-details
      ></v-text-field>
    </v-layout>
  </v-toolbar>
</template>

<script>
export default {
  name: 'navbar'
}
</script>
