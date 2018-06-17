<template>
  <v-container :grid-list-2="true">
    <h4>Résultats de recherche</h4>
    <v-layout row wrap>
      <v-flex xs6 v-for="(job, key) in elements" :key="key">
        <job-preview :jobData="job" />
      </v-flex>      
    </v-layout>
  </v-container>
</template>

<script>
import jobPreview from '@/components/layout/job/jobPreview'

export default {
  name: 'searchResults',
  components: {
    jobPreview
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
      return this.jobs.slice(((this.page - 1) * this.elementsPerPage), (this.page * this.elementsPerPage))
    }
  }
}
</script>

<style>
.searchResults_content {
  background-color: lightgrey;
}
</style>
