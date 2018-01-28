<template lang="html">
  <v-app white id="inspire" v-if="loaded">

    <!-- Navbar and user left menu -->
    <user-drawer-wrapper />
    <navbar />

    <!-- Map with jobs -->
    <map-wrapper />

    <!-- Right panel to show jobs -->
    <job-drawer-wrapper />

    <!-- Wrapper modals -->
    <modal-wrapper />
  </v-app>

  <v-app v-else>
    <v-progress-circular
        v-bind:size="100"
        v-bind:width="15"
        v-bind:rotate="-90"
        v-bind:value="loadingPercentile"
        color="primary"
        style="position: absolute; top:50vh; left:50vw"
      >
      {{ loadingPercentile }}
    </v-progress-circular>
  </v-app>
</template>

<script>
import navbar from '~/components/layout/navbar'
import mapWrapper from '~/components/layout/mapWrapper'
import jobDrawerWrapper from '~/components/layout/job/jobDrawerWrapper'
import userDrawerWrapper from '~/components/layout/user/userDrawerWrapper'
import modalWrapper from '~/components/modals/modalWrapper'
import { loadJobs } from '~/helpers/labelHelper'

export default {
  components: {
    navbar,
    mapWrapper,
    jobDrawerWrapper,
    userDrawerWrapper,
    modalWrapper
  },
  data: () => ({
    loaded: false,
    loadingPercentile: 0
  }),
  methods: {
    fetchJobsData () {
      let options = {
        size: 1000
      }

      let body = {
        query: {
          match_all: {}
        }
      }

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
              this.loaded = true
            })
          })
        })
      })
    }
  },
  mounted () {
    this.$kuzzle.addListener('tokenExpired', () => {
      this.$store.commit('user/changeLoggedStatus', false)
      this.$toasted.global.toastError({
        message: 'Vous avez été déconnecté pour cause d\'inactivité'
      })
    })
  },
  created () {
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

    // Fetch data
    this.fetchJobsData()
  }
}
</script>

<style type="text/css">
body {
    overflow:hidden;
}

::-webkit-scrollbar {
    display: none;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}
</style>
