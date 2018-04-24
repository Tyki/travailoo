<template>
  <div class="searchResults_content">
    <v-container>
      <h4>Résultats de recherche</h4>
      <div v-for="(row, key) in displayedJobs" :key="key">
        <v-layout>
          <job-card :jobData="row.even" />
          &nbsp;
          <job-card :jobData="row.odd" />
        </v-layout>
        &nbsp;
      </div>
    </v-container>
  </div>
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
    displayedEvenJobs: function () {
      return this.jobs.slice((this.page - 1) * this.elementsPerPage, this.page * this.elementsPerPage).filter((element, key) => key % 2 === 0)
    },
    displayedOddjobs: function () {
      return this.jobs.slice((this.page - 1) * this.elementsPerPage, this.page * this.elementsPerPage).filter((element, key) => key % 2 !== 0)
    },
    displayedJobs: function () {
      let array = []
      for (var i = 0; i < (this.elementsPerPage / 2); i++) {
        array.push({
          even: this.displayedEvenJobs[i],
          odd: this.displayedOddjobs[i]
        })
      }

      return array
    }
  }
}
</script>

<style>
.searchResults_content {
  background-color: lightgrey;
  min-height: 100%;
  min-width: 100%
}
</style>
