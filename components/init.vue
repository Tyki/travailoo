<template>

</template>

<script>
import { loadJobs } from '~/services/helpers/labelHelper'

export default {
  name: 'init',
  data: () => ({
    mapLoaded: false,
    loadingPercentile: 0
  }),
  methods: {
    fetchJobsData () {
      let body = {
        query: {
          match_all: {}
        }
      }
      let options = { size: 1000 }

      // TODO : store data inside LocalStorage to dodge asking again to server

      // Fetch categories
      this.$kuzzle.collection('categories', 'labels').search(body, options, (error, result) => {
        if (error) {
          console.log(error)
          // Toast error !
        }

        this.$store.commit('jobs/addToCategories', result.getDocuments())
        this.loadingPercentile = 25

        // Mid Categories
        this.$kuzzle.collection('midCategories', 'labels').search(body, options, (error, result) => {
          if (error) {
            console.log(error)
          }
          this.$store.commit('jobs/addToMidCategories', result.getDocuments())
          this.loadingPercentile = 50

          // Sub Categories
          this.$kuzzle.collection('subCategories', 'labels').search(body, options, (error, result) => {
            if (error) {
              console.log(error)
            }
            this.$store.commit('jobs/addToSubCategories', result.getDocuments())
            this.loadingPercentile = 75

            loadJobs(this.$kuzzle, () => {
              this.loadingPercentile = 100
            })
          })
        })
      })
    }
  },
  mounted () {
    this.$eventBus.$on('UI::MapLoaded', () => {
      this.mapLoaded = true
    })

    let jwt = localStorage.getItem('jwt')
    if (jwt) {
      this.$kuzzle.checkToken(jwt, (error, response) => {
        if (error) {
          console.log(error)
        }
        // Valid, we log the user then fetch his firstname
        if (response.hasOwnProperty('valid') && response.valid === true) {
          this.$kuzzle.setJwtToken(jwt)
          this.$store.commit('user/changeLoggedStatus', true)
          this.$kuzzle.whoAmI((error, user) => {
            if (error) {
              // Do nothing
            }

            if (user.hasOwnProperty('content') && user.content.hasOwnProperty('firstname')) {
              this.$store.commit('user/updateUserFirstname', user.content.firstname)
            }
          })
        } else {
          // Not valid anymore
          localStorage.removeItem('jwt')
        }
      })
    }

    this.fetchJobsData()

    this.$kuzzle.addListener('tokenExpired', () => {
      this.$store.commit('user/changeLoggedStatus', false)
      this.$toasted.global.toastError({
        message: 'Vous avez été déconnecté pour cause d\'inactivité'
      })
    })
  }
}
</script>
