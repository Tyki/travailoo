<template>
  <div>
    <v-layout>
      <v-flex xs12 />
    </v-layout>

    <v-layout>
      <h1 style="float:left;">Vos résultats de recherche</h1>
      <br />
    </v-layout>

    <v-layout row wrap>
      <v-flex xs3>
        <v-select :items="items" label="Trier par" solo></v-select>
      </v-flex>
    </v-layout>

    <v-layout row wrap fill-height>
      <Preview v-for="id in elements" :key="id" :jobData="jobs[id]" />
    </v-layout>
  </div>
</template>

<script>
import Preview from './Offer/Preview'

export default {
  name: 'searchResults',
  components: {
    Preview
  },
  data: () => ({
    page: 1,
    elementsPerPage: 12,
    items: []
  }),
  computed: {
    jobs: function() {
      return this.$store.state.jobs.jobs
    },
    elements: function() {
      return Object.keys(this.jobs).slice(
        (this.page - 1) * this.elementsPerPage,
        this.page * this.elementsPerPage
      )
    }
  }
}
</script>
