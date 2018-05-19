<template>
  <v-container :grid-list-2="true" fluid>
    <h4>Résultats de recherche</h4>
    <v-layout row wrap>
      <v-flex xs6 v-for="(job, key) in elements" :key="key">
        <job-card :jobData="job" />
      </v-flex>      
    </v-layout>
  </v-container>
</template>

<script>
import jobCard from '@/components/layout/job/jobCard'

export default {
  name: 'searchResults',
  components: {
    jobCard
  },
  data: () => ({
    page: 1,
    elementsPerPage: 12
  }),
  computed: {
    jobs: function () {
      return this.$store.state.jobs.jobs
    },
    elements: function () {
      return this.jobs.slice((this.page * this.elementsPerPage), ((this.page + 1) * this.elementsPerPage))
    }
  }
}
</script>

<style>
.searchResults_content {
  background-color: lightgrey;
}
</style>
