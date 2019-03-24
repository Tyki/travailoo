<template> </template>

<script>
import { loadJobs } from '~/services/helpers/labelHelper'

export default {
  name: 'init',
  data: () => ({
    mapLoaded: false,
    loadingPercentile: 0,
    query: { query: { match_all: {} } },
    options: { size: 1000 }
  }),
  methods: {
    fetchCategories: function() {
      let categories = localStorage.getItem('categories')
      if (categories === null) {
        this.$log('Fetch categories from Backend')
        this.$kuzzle
          .collection('categories', 'labels')
          .search(this.body, this.options, (error, result) => {
            if (error) {
              console.log(error)
              // Toast error !
            }

            this.$store.commit('jobs/addToCategories', result.getDocuments())
            localStorage.setItem(
              'categories',
              JSON.stringify(result.getDocuments())
            )
            this.loadingPercentile = 25
            this.fetchMidCategories()
          })
      } else {
        this.$log('Fetch categories from localStorage')
        this.$store.commit('jobs/addToCategories', JSON.parse(categories))
        this.fetchMidCategories()
      }
    },
    fetchMidCategories: function() {
      let midCategories = localStorage.getItem('midCategories')
      if (midCategories === null) {
        this.$log('Fetch midCategories from Backend')
        this.$kuzzle
          .collection('midCategories', 'labels')
          .search(this.body, this.options, (error, result) => {
            if (error) {
              console.log(error)
              // Toast error !
            }

            this.$store.commit('jobs/addToMidCategories', result.getDocuments())
            localStorage.setItem(
              'midCategories',
              JSON.stringify(result.getDocuments())
            )
            this.loadingPercentile = 50
            this.fetchSubCategories()
          })
      } else {
        this.$log('Fetch midCategories from localStorage')
        this.$store.commit('jobs/addToMidCategories', JSON.parse(midCategories))
        this.fetchSubCategories()
      }
    },
    fetchSubCategories: function() {
      let subCategories = localStorage.getItem('subCategories')
      if (subCategories === null) {
        this.$log('Fetch subCategories from Backend')
        this.$kuzzle
          .collection('subCategories', 'labels')
          .search(this.body, this.options, (error, result) => {
            if (error) {
              console.log(error)
              // Toast error !
            }

            this.$store.commit('jobs/addToSubCategories', result.getDocuments())
            localStorage.setItem(
              'subCategories',
              JSON.stringify(result.getDocuments())
            )
            this.loadingPercentile = 75

            loadJobs(this.$kuzzle, () => {
              this.loadingPercentile = 100
            })
          })
      } else {
        this.$log('Fetch subCategories from localStorage')
        this.$store.commit('jobs/addToSubCategories', JSON.parse(subCategories))
        loadJobs(this.$kuzzle, () => {
          this.loadingPercentile = 100
        })
      }
    }
  },
  mounted() {
    this.$eventBus.$on('UI::MapLoaded', () => {
      this.mapLoaded = true
    })

    let jwt = localStorage.getItem('jwt')
    if (jwt) {
      this.$kuzzle.checkToken(jwt, (error, response) => {
        if (error) {
          console.log(error)
        }
        // Valid, we log the User then fetch his firstname
        if (response.hasOwnProperty('valid') && response.valid === true) {
          this.$kuzzle.setJwtToken(jwt)
          this.$store.commit('User/changeLoggedStatus', true)
          this.$kuzzle.whoAmI((error, user) => {
            if (error) {
              // Do nothing
            }

            this.$store.commit('User/updateUserId', user.id)

            if (
              user.hasOwnProperty('content') &&
              user.content.hasOwnProperty('firstname')
            ) {
              this.$store.commit(
                'User/updateUserFirstname',
                user.content.firstname
              )
            }
          })
        } else {
          // Not valid anymore
          localStorage.removeItem('jwt')
        }
      })
    }

    this.fetchCategories()

    this.$kuzzle.addListener('tokenExpired', () => {
      this.$store.commit('User/changeLoggedStatus', false)
      this.$toasted.global.toastError({
        message: "Vous avez été déconnecté pour cause d'inactivité"
      })
    })
  }
}
</script>
