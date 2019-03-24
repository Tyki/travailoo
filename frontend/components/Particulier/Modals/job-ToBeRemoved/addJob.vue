<template>
  <v-dialog
    v-model="showAddJobModal"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <v-toolbar card dark color="primary">
        <v-btn icon dark @click.native="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Soumettre une nouvelle offre</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <add-job-form @submitted="closeDialog" @canceled="closeDialog" />
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import addJobForm from '~/components/Offer/add/addJobForm'

export default {
  name: 'addJobModal',
  components: {
    addJobForm
  },
  data: () => ({
    showAddJobModal: false
  }),
  methods: {
    closeDialog: function() {
      this.showAddJobModal = false
    }
  },
  mounted() {
    this.$eventBus.$on('Jobs::AddJob', () => {
      this.showAddJobModal = true
    })
  }
}
</script>
