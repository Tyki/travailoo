<template lang="html">
  <v-container class="engine_header">
    <!-- @todo: externalize to a component -->
    <h3>Effectuer une recherche</h3>
    <v-layout>
      <v-flex xs12>
        <v-select label="Saisissez un intitulé " autocomplete v-model="chosenJob" return-object clearable flat
          :loading="loading" :items="searchedJobs" :search-input.sync="search" item-text="name" item-value="category" />
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs6>
        <v-select v-bind:items="offerTypes" v-model="chosenOfferType" label="Type de contrat" item-text="label" item-value="key" return-object clearable />
      </v-flex>
      &nbsp;
      <v-flex xs6>
        <v-select v-bind:items="experiences" v-model="chosenExperience" label="Experiences" multiple item-text="label" item-value="key" clearable />
      </v-flex>
      &nbsp;
    </v-layout>

    <v-layout>
      <v-flex xs8 />
      <v-flex xs4>
        <v-btn color="blue" style="margin-top: 17px;" @click.native="filterSearch">
          <v-icon>search</v-icon>
          Rechercher
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { searchJobLabels } from '@/services/helpers/labelHelper'

export default {
  name: 'searchEngine',
  data: () => ({
    search: null,
    loading: false,
    searchedJobs: [],
    chosenJob: null,
    offerTypes: [
      {key: 1, label: 'Contrat à durée indeterminée'},
      {key: 2, label: 'Contrat à durée determinée'},
      {key: 3, label: 'Contrat de travail temporaire'},
      {key: 4, label: 'Contrat de professionnalisation'},
      {key: 5, label: 'Contrat d\'apprentissage'},
      {key: 6, label: 'Alternance'},
      {key: 7, label: 'Stage'}
    ],
    chosenOfferType: null,
    experiences: [
      {key: 1, label: 'Débutant'},
      {key: 2, label: 'Confirmé'},
      {key: 3, label: 'Senior'}
    ],
    chosenExperience: null,
    searchInterval: null
  }),
  methods: {
    filterJob (searchTerm) {
      if (searchTerm === '' || searchTerm === null) {
        this.searchedJobs = []
        return
      }

      this.loading = true
      clearTimeout(this.searchInterval)

      this.searchInterval = setTimeout(() => {
        this.searchedJobs = []
        this.searchedJobs = searchJobLabels(searchTerm)
        this.loading = false
      }, 300)
    },

    filterSearch () {
      let payload = {}
      if (this.chosenJob !== null && this.chosenJob.hasOwnProperty('code')) {
        payload.code = this.chosenJob.code
      }

      if (this.chosenOfferType !== null && this.chosenOfferType.hasOwnProperty('key')) {
        payload.offerType = this.chosenOfferType.key
      }

      if (this.chosenExperience !== null && this.chosenExperience.length > 0) {
        payload.experience = this.chosenExperience
      }

      // Do the search
    }
  },
  watch: {
    search (val) {
      this.filterJob(val)
    }
  }
}
</script>

<style lang="css">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}
</style>
