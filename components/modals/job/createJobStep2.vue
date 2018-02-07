<template lang="html">
  <v-layout class="force-white-background">
    <v-dialog v-model="showForm" max-width="1000px" persistent transition="scale-transition" origin="center center" class="force-white-background">
      <v-flex xs12 class="force-white-background">
        <v-layout column wrap align-center>
          <v-spacer />
          <!-- Title -->
          <v-flex xs12 sm4 class="my-5">
            <div class="text-xs-center">
              <h2 class="headline">Créer une annonce</h2>
              <span class="subheading">
                Sélectionnez le type d'annonce que vous voulez soumettre
              </span>
            </div>
          </v-flex>

          <!-- Content -->
            <v-container grid-list-xl>
              <v-layout row wrap align-center>
                <!-- Left Column -->
                <v-flex xs12 md6>
                  <v-card class="elevation-0">
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline">En filtrant par catégorie</div>
                    </v-card-title>
                    <v-card-text>
                      <v-select
                        autocomplete
                        v-bind:items="categories"
                        v-model="chosenCategory"
                        label="Sélectionnez la catégorie de l'offre"
                        single-line
                        bottom
                        item-text="name"
                        item-value="category"
                        return-object
                      ></v-select>

                      <v-select v-if="checkSubSelect('midCategory')"
                        autocomplete
                        v-bind:items="midCategories"
                        v-model="chosenMidCategory"
                        label="Sélectionnez une sous-catégorie"
                        single-line
                        bottom
                        item-text="name"
                        item-value="category"
                        return-object
                      ></v-select>

                      <v-select v-if="checkSubSelect('subCategory')"
                        autocomplete
                        v-bind:items="subCategories"
                        v-model="chosenSubCategory"
                        label="Affinez la recherche..."
                        single-line
                        bottom
                        item-text="name"
                        item-value="category"
                        return-object
                      ></v-select>

                      <v-select v-if="checkSubSelect('jobs')"
                        autocomplete
                        v-bind:items="getJobsByParents"
                        v-model="chosenJob"
                        label="Selectionner l'intitulé du travail"
                        single-line
                        bottom
                        item-text="name"
                        item-value="category"
                        return-object
                      ></v-select>
                    </v-card-text>
                  </v-card>
                </v-flex>

                <!-- Right Column -->
                <v-flex xs12 md6>
                  <v-card class="elevation-0">
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline">Ou en tapant l'intitulé du titre</div>
                    </v-card-title>
                    <v-card-text>
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
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
        </v-layout>
      </v-flex>

      <v-flex xs12>
        <v-card>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="cancel">Annuler</v-btn>
            <v-btn color="blue darken-1" @click.native="next">Suivant</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-dialog>
  </v-layout>
</template>

<script>
import { searchJobLabels, searchJobsByFullIdentifier } from '~/helpers/labelHelper'

export default {
  name: 'createJobStep2',
  props: [
    'newJobPosition'
  ],
  data: () => ({
    showForm: false, // v-dialog wont work without v-model. So constant 'true' to show the dialog
    chosenCategory: '',
    chosenMidCategory: '',
    chosenSubCategory: '',
    chosenJob: '',
    // Right column
    loading: false,
    search: null,
    jobs: [],
    searchedJobs: [],
    searchInterval: 3000,
    categories: []
  }),
  computed: {
    midCategories () {
      return Object.keys(this.$store.state.jobs.midCategories[this.chosenCategory.category]).map(midCategory => {
        return {midCategory, name: this.$store.state.jobs.midCategories[this.chosenCategory.category][midCategory]}
      })
    },
    subCategories () {
      return Object.keys(this.$store.state.jobs.subCategories[this.chosenCategory.category + '-' + this.chosenMidCategory.midCategory]).map(subCategory => {
        return {subCategory, name: this.$store.state.jobs.subCategories[this.chosenCategory.category + '-' + this.chosenMidCategory.midCategory][subCategory]}
      })
    },
    getJobsByParents () {
      if (this.chosenCategory === '' || this.chosenMidCategory === '' || this.chosenSubCategory === '') {
        return []
      } else {
        let fullIdentifier = this.chosenCategory.category + '-' + this.chosenMidCategory.midCategory + '-' + this.chosenSubCategory.subCategory
        this.jobs = searchJobsByFullIdentifier(fullIdentifier)

        return Object.keys(this.jobs).map(key => {
          return {code: this.jobs[key].content.code, name: this.jobs[key].content.name}
        })
      }
    }
  },
  methods: {
    filterJob (searchTerm) {
      if (searchTerm === '' || searchTerm === null) {
        this.searchedJobs = []
        return
      }

      clearTimeout(this.searchInterval)
      this.searchInterval = setTimeout(() => {
        this.loading = true

        this.searchedJobs = searchJobLabels(searchTerm)

        this.loading = false
      }, 1000)
    },
    checkSubSelect (toCheck) {
      if (toCheck === 'midCategory') {
        return (this.chosenCategory !== '' && this.chosenCategory.hasOwnProperty('category') && this.chosenCategory.category !== '')
      } else if (toCheck === 'subCategory') {
        return (this.chosenCategory !== '' && this.chosenCategory.hasOwnProperty('category') && this.chosenCategory.category !== '' &&
               this.chosenMidCategory !== '' && this.chosenMidCategory.hasOwnProperty('midCategory') && this.chosenMidCategory.midCategory !== '')
      } else if (toCheck === 'jobs') {
        return (this.chosenCategory !== '' && this.chosenCategory.hasOwnProperty('category') && this.chosenCategory.category !== '' &&
               this.chosenMidCategory !== '' && this.chosenMidCategory.hasOwnProperty('midCategory') && this.chosenMidCategory.midCategory !== '' &&
               this.chosenSubCategory !== '' && this.chosenSubCategory.hasOwnProperty('subCategory') && this.chosenSubCategory.subCategory !== '')
      }
    },
    cancel () {
      // restore map Mode
      this.$store.commit('map/switchToMapModeShowJobs')
      this.$eventBus.$emit('Jobs::CancelCreate')

      this.resetComponent()
    },
    resetComponent () {
      // Close the form
      this.showForm = false

      // Restore data
      this.chosenCategory = ''
      this.chosenMidCategory = ''
      this.chosenSubCategory = ''
      this.chosenJob = ''
      // Right column data
      this.selectedJob = ''
      this.loading = false
      this.search = null
      this.searchedJobs = []
    },
    next () {
      if (this.chosenJob === '') {
        this.$toasted.global.toastError({
          message: 'Merci de choisir un intitulé pour cette nouvelle annonce'
        })
        return
      }
      this.resetComponent()

      this.$eventBus.$emit('Jobs::CreateStep3', {jobCode: this.chosenJob.code, jobPosition: this.newJobPosition})
    }
  },
  mounted () {
    this.$eventBus.$on('Jobs::CreateStep2', () => {
      this.showForm = true
    })
  },
  created () {
    this.categories = Object.keys(this.$store.state.jobs.categories).map(category => {
      return {category, name: this.$store.state.jobs.categories[category]}
    })
  },
  watch: {
    search (val) {
      this.filterJob(val)
    }
  }
}
</script>

<style lang="css">
.force-white-background {
  background-color: white;
}
</style>
