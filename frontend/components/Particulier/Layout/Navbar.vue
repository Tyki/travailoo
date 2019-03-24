<template lang="html">
  <v-toolbar color="white">
    <v-toolbar-title v-text="'Travailoo'"></v-toolbar-title>

    <!-- Search Box -->
    <v-layout row align-center>
      <v-text-field
        light
        prepend-icon="search"
        placeholder="Chercher une adresse..."
        style="margin-left: 100px; max-width: 500px; min-width: 128px"
      ></v-text-field>
      <!--  <v-btn color="primary" @click.native="$eventBus.$emit('Search::ShowFilters')">Affiner votre recherche</v-btn> -->
    </v-layout>

    <!-- Right buttons -->
    <div class="d-flex align-center" style="margin-left: auto">
      <!-- Anonymous actions: login/register -->
      <div v-if="!isUserLogged">
        <v-btn flat @click="open('openLogin')">{{
          $t('common.connect')
        }}</v-btn>
        <span>ou</span>
        <v-btn flat @click="open('openRegister')">{{
          $t('common.register')
        }}</v-btn>
      </div>

      <!-- Say Hello ! -->
      <div v-else>
        <v-btn flat @click="$eventBus.$emit('User::toggleDrawer')">
          {{ $t('common.hello') }} {{ userInformations.firstname }}
        </v-btn>
      </div>
    </div>
  </v-toolbar>
</template>

<script>
import { openSpecificModal } from '~/services/helpers/eventBus'

export default {
  name: 'Navbar',
  methods: {
    open(event) {
      openSpecificModal(event)
    }
  }
}
</script>
