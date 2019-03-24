<template lang="html">
  <div>
    <!-- Filtres par défaut -->
    <v-layout row wrap>
      <v-flex xs4>
        <v-select :items="items" label="Secteur" solo></v-select>
      </v-flex>

      <v-flex xs4>
        <v-select :items="items" label="Catégories" solo></v-select>
      </v-flex>

      <v-flex xs4>
        <v-select :items="items" label="Sous-catégories" solo></v-select>
      </v-flex>
    </v-layout>

    <v-layout row wrap v-if="displayMoreFilters">
      <v-flex xs12>
        <v-text-field label="Ajouter des mot-clefs" />
      </v-flex>
    </v-layout>

    <!-- Affiner la recherche -->
    <v-layout row wrap>
      <v-flex xs6>
        <v-btn block @click.prevent="displayMoreFilters = !displayMoreFilters">
          <span v-if="displayMoreFilters"
            >Fermer les filtres supplémentaires</span
          >
          <span v-else>Affiner la recherche</span>
        </v-btn>
      </v-flex>

      <v-flex xs6>
        <v-btn block>
          Rechercher
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { searchJobLabels } from '@/services/helpers/labelHelper'

export default {
  name: 'SearchEngine',
  data: () => ({
    search: null,
    loading: false,
    searchedJobs: [],
    chosenJob: null,
    searchInterval: null,
    items: [],
    displayMoreFilters: false
  }),
  methods: {
    filterJob(searchTerm) {
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

    filterSearch() {
      let payload = {}
      if (this.chosenJob !== null && this.chosenJob.hasOwnProperty('code')) {
        payload.code = this.chosenJob.code
      }

      if (
        this.chosenOfferType !== null &&
        this.chosenOfferType.hasOwnProperty('key')
      ) {
        payload.offerType = this.chosenOfferType.key
      }

      if (this.chosenExperience !== null && this.chosenExperience.length > 0) {
        payload.experience = this.chosenExperience
      }

      // Do the search
    }
  },
  watch: {
    search(val) {
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
