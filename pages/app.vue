<template lang="html">
  <v-app white id="inspire">
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
</template>

<script>
import navbar from '~/components/layout/navbar'
import mapWrapper from '~/components/layout/mapWrapper'
import jobDrawerWrapper from '~/components/layout/job/jobDrawerWrapper'
import userDrawerWrapper from '~/components/layout/user/userDrawerWrapper'
import modalWrapper from '~/components/modals/modalWrapper'

export default {
  components: {
    navbar,
    mapWrapper,
    jobDrawerWrapper,
    userDrawerWrapper,
    modalWrapper
  },
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

        // Mid Categories
        this.$kuzzle.collection('midCategories', 'labels').search(body, options, (error, result) => {
          if (error) {
            console.log(error)
          }
          this.$store.commit('jobs/addToMidCategories', result.getDocuments())

          // Sub Categories
          this.$kuzzle.collection('subCategories', 'labels').search(body, options, (error, result) => {
            if (error) {
              console.log(error)
            }
            this.$store.commit('jobs/addToSubCategories', result.getDocuments())

            // Desactivate this line to store all available jobs inside vuex
            // It crash the vue-devtools
            // this.fetchJobs({})
          })
        })
      })
    },

    fetchJobs (accumulator) {
      this.$kuzzle.collection('jobs', 'labels').search({query: {match_all: {}}}, {size: 1000, scroll: '1s'}, (error, result) => {
        if (error) {
          console.log(error)
        }

        result.getDocuments().forEach(document => {
          accumulator[document.id] = document
        })

        if (result.options.scrollId) {
          this.scrollFetchJobs(result.options.scrollId, accumulator)
        }
      })
    },

    scrollFetchJobs (scrollId, accumulator) {
      if (scrollId) {
        this.$kuzzle.collection('jobs', 'labels').scroll(scrollId, {scroll: '1s'}, (error, result) => {
          if (error) {
            console.log(error)
          }

          result.getDocuments().forEach(document => {
            accumulator[document.id] = document
          })

          if (result.getDocuments().length !== 0 && result.options.scrollId) {
            this.scrollFetchJobs(result.options.scrollId, accumulator)
          } else {
            // Done with scroll, push into vuex
            this.$store.commit('jobs/addToJobsList', accumulator)
          }
        })
      }
    }
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
</style>
