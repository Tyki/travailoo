<template lang="html">
  <v-toolbar color="blue" fixed clipped-left app>
    <!-- Drawer menu and Title -->
    <v-toolbar-title
      :style="$vuetify.breakpoint.width > 1264 && 'width: 300px'"
      class="ml-0 pl-3"
      :class="$vuetify.breakpoint.width <= 1264 && 'pr-3'"
    >
      <v-toolbar-side-icon @click.stop="$eventBus.$emit('User::toggleDrawer')"></v-toolbar-side-icon>
      Travailoo
    </v-toolbar-title>

    <!-- Search Box -->
    <v-layout row align-center style="max-width: 650px">
      <v-text-field
        light
        solo
        prepend-icon="search"
        placeholder="Search"
        style="max-width: 500px; min-width: 128px"
      ></v-text-field>
    </v-layout>

    <!-- Right buttons -->
    <div class="d-flex align-center" style="margin-left: auto">
      <v-btn flat @click="open('openLogin')">Se connecter</v-btn>
      <span>ou</span>
      <v-btn flat @click="open('openRegister')">S'inscrire</v-btn>
    </div>

  </v-toolbar>
</template>

<script>
import { openSpecificModal } from '~/helpers/eventBus'

export default {
  name: 'navbar',
  methods: {
    open (event) {
      openSpecificModal(event)
    }
  }
}
</script>
