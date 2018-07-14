<template>
  <v-container :grid-list-2="true">
    <h4>Résultats de recherche</h4>
    <v-layout row wrap>
      <v-flex xs6 v-for="(id) in elements" :key="id">
        <job-preview :jobData="jobs[id]" />
      </v-flex>      
    </v-layout>

    TODO : find a way to make css fill to the bottom
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
      return Object.keys(this.jobs).slice(((this.page - 1) * this.elementsPerPage), (this.page * this.elementsPerPage))
    }
  }
}
</script>
