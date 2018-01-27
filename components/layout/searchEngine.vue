<template lang="html">
  <transition name="fade">
    <v-toolbar
        color="white"
        floating
        style="position: absolute; top: 80px; left: 40vw;"
      >
      <v-select
        label="Rechercher un intitulé "
        autocomplete
        cache-items
        :loading="loading"
        :items="searchedJobs"
        :search-input.sync="search"
        v-model="chosenJob"
        item-text="name"
        item-value="category"
        return-object
      ></v-select>
    </v-toolbar>
  </transition>
</template>

<script>
export default {
  name: 'searchEngine',
  data: () => ({
    search: null,
    loading: false,
    searchedJobs: [],
    chosenJob: ''
  }),
  methods: {
    filterJob (searchTerm) {
      if (searchTerm === '' || searchTerm === null) {
        this.searchedJobs = []
        return
      }

      clearTimeout(this.searchInterval)
      this.searchInterval = setTimeout(() => {
        this.loading = true

        this.searchedJobs = []

        Object.keys(this.jobs).forEach(fullIdentifier => {
          this.jobs[fullIdentifier].forEach(document => {
            if (document.content.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
              this.searchedJobs.push({name: document.content.name, code: document.content.code})
            }
          })
        })
        this.loading = false
      }, 300)
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
