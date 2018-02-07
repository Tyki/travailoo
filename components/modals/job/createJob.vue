<template>
  <v-layout>
    <!-- Step 1. Choose a GPS POSITION -->
    <v-card color="grey lighten-4" v-if="snackbar">
      <v-snackbar
          :timeout="timeout"
          :color="'dark'"
          :multi-line="false"
          :vertical="true"
          v-model="snackbar"
        >
          Sélectionnez l'emplacement ou se trouve votre annonce
          <v-layout>
            <v-btn dark flat @click.native="cancel">Annuler</v-btn>
            <v-btn dark flat v-if="showValidate" @click.native="validate">Confirmer</v-btn>
          </v-layout>
      </v-snackbar>
    </v-card>

    <!-- Step 2. Fill the form to submit the new job -->
    <createJobStep2 v-bind:newJobPosition="newJobPosition"/>
  </v-layout>
</template>

<script>
import createJobStep2 from '@/components/modals/job/createJobStep2'

export default {
  name: 'jobStep1',
  components: {
    createJobStep2
  },
  data: () => ({
    // Step 1 data
    snackbar: false,
    showStep2: false,
    timeout: 86400000, // Dont hide the snackbar
    showValidate: false,
    newJobPosition: {
      lat: '',
      lng: ''
    }
  }),
  methods: {
    cancel () {
      // Close this component
      this.$eventBus.$emit('Modals::close')
      this.$eventBus.$emit('Jobs::CancelCreate')
      // Restore the map to show the jobs
      this.$store.commit('map/switchToMapModeShowJobs')
    },

    validate () {
      this.snackbar = false
      this.$eventBus.$emit('Jobs::CreateStep2')
    }
  },
  mounted () {
    this.$eventBus.$on('Jobs::StartCreate', () => {
      // Reset the component
      this.showValidate = false
      this.showStep2 = false
      // Step 1
      this.snackbar = true
      this.$store.commit('map/switchToMapModeCreate')
    })

    this.$eventBus.$on('Jobs::CancelCreate', () => {
      this.newJobPosition = {
        lat: '',
        lng: ''
      }
    })

    // Click on the map to fetch the exact GPS position of the new job
    this.$eventBus.$on('Jobs::PositionStep1', (jobPosition) => {
      this.showValidate = true
      this.newJobPosition.lat = jobPosition.lat
      this.newJobPosition.lng = jobPosition.lng
    })

    this.$eventBus.$on('Modals::close', () => {
      this.snackbar = false
    })
  }
}
</script>

<style>
</style>
