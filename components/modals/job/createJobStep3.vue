<template>
  <v-layout>
    <v-dialog v-model="showForm" scrollable max-width="1200px" persistent transition="scale-transition" origin="center center">
      <v-flex xs12 class="force-white-background">
        <v-layout column wrap align-center>
          <v-spacer />
          <!-- Title -->
          <v-flex xs12 sm4 class="my-5">
            <div class="text-xs-center">
              <h2 class="headline">Informations complémentaires</h2>
              <span class="subheading">
                Une description de l'annonce? Des pré-requis ?<br />
                Indiquez toutes les informations de votre offre maintenant :)
              </span>
            </div>
          </v-flex>

          <!-- Content -->
            <v-container grid-list-xl>
              <v-form v-model="formValid">

              <v-layout >
                <!-- Left Column -->
                <v-flex xs12 md6>
                  <!-- Input titre -->
                  <v-layout>
                    <v-flex xs4>
                      <v-subheader>Titre</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                      <v-text-field
                        name="title"
                        label="Titre de l'annonce"
                        single-line
                        v-model="title"
                        :rules="[() => title.length > 0 || 'Ce champ est requis']"
                        required
                      ></v-text-field>
                    </v-flex>
                  </v-layout>

                  <!-- Type de contrat -->
                  <v-layout>
                    <v-flex xs4>
                      <v-subheader>Type de contrat</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                      <v-select
                        v-bind:items="offerTypes"
                        v-model="chosenOfferType"
                        label="Type de contrat"
                        single-line
                        :rules="[() => chosenOfferType !== null || 'Ce champ est requis']"
                        bottom
                        required
                        item-text="label"
                        item-value="key"
                        return-object
                      ></v-select>
                    </v-flex>
                  </v-layout>

                  <!-- Type de contrat -->
                  <v-layout>
                    <v-flex xs4>
                      <v-subheader>Expérience souhaitée</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                      <v-select
                        v-bind:items="experiences"
                        v-model="chosenExperience"
                        label="Experiences"
                        multiple
                        bottom
                        :rules="[() => chosenExperience.length !== 0 || 'Ce champ est requis']"
                        required
                        item-text="label"
                        item-value="key"
                        return-object
                      ></v-select>
                    </v-flex>
                  </v-layout>

                  <!-- Description -->
                  <v-layout row>
                    <v-flex xs12>
                      <wysiwyg v-model="description" />

                      <!-- <v-text-field
                        name="description"
                        label="Description de l'annonce"
                        textarea
                        v-model="description"
                        :rules="[() => description.length > 0 || 'Ce champ est requis']"
                        required
                      ></v-text-field> -->
                    </v-flex>
                  </v-layout>
                </v-flex>

                <!-- Right Column -->
                <v-flex xs12 md6>
                  <!-- Salary -->
                  <v-layout>
                    <v-flex xs4>
                      <v-subheader>Rémunération</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                      <v-text-field
                        name="salary"
                        label="Rémunération"
                        single-line
                        v-model="salary"
                        :rules="[() => salary.length > 0 || 'Ce champ est requis']"
                        required
                      ></v-text-field>
                    </v-flex>
                  </v-layout>

                  <!-- Input societyName -->
                  <v-layout>
                    <v-flex xs4>
                      <v-subheader>Nom de la société</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                      <v-text-field
                        name="societyName"
                        label="Nom de la société"
                        single-line
                        v-model="societyName"
                        :rules="[() => societyName.length > 0 || 'Ce champ est requis']"
                        required
                      ></v-text-field>
                    </v-flex>
                  </v-layout>

                  <!-- Society address -->
                  <v-layout>
                    <v-flex xs4>
                      <v-subheader>Adresse de la société</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                      <v-text-field
                        name="societyAddress"
                        label="Adresse de la société"
                        single-line
                        v-model="societyAddress"
                        :rules="[() => societyAddress.length > 0 || 'Ce champ est requis']"
                        required
                      ></v-text-field>
                    </v-flex>
                  </v-layout>

                  <!-- Society website -->
                  <v-layout>
                    <v-flex xs4>
                      <v-subheader>Site web de la société</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                      <v-text-field
                        name="societyWebsite"
                        label="Site web de la société"
                        single-line
                        v-model="societyWebsite"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>

                  <v-flex xs12 class="force-white-background">
                    <v-card class="elevation-0">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click.native="cancel">Annuler</v-btn>
                        <v-btn color="blue darken-1" :disabled="!formValid" @click.native="validate">Valider</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-flex>
                </v-flex>
              </v-layout>
            </v-form>
            </v-container>
        </v-layout>
      </v-flex>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: 'createJobStep3',
  data: () => ({
    showForm: false,
    formValid: false,
    jobCode: '',
    jobPosition: '',
    description: '',
    title: '',
    chosenOfferType: null, // CDD, CDI, CTT, Contrat de Professionnalisation, Alternance, Stage
    offerTypes: [
      {key: 1, label: 'Contrat à durée indeterminée'},
      {key: 2, label: 'Contrat à durée determinée'},
      {key: 3, label: 'Contrat de travail temporaire'},
      {key: 4, label: 'Contrat de professionnalisation'},
      {key: 5, label: 'Contrat d\'apprentissage'},
      {key: 6, label: 'Alternance'},
      {key: 7, label: 'Stage'}
    ],
    societyName: '',
    societyAddress: '',
    societyWebsite: '',
    chosenExperience: [],
    experiences: [
      {key: 1, label: 'Débutant'},
      {key: 2, label: 'Confirmé'},
      {key: 3, label: 'Senior'}
    ],
    salary: ''

  }),
  methods: {
    validate () {
    },
    cancel () {
      // Close the form
      this.showForm = false

      // restore map Mode
      this.$store.commit('map/switchToMapModeShowJobs')
      this.$eventBus.$emit('Jobs::CancelCreate')

      // Restore data
      this.jobCode = ''
      this.jobPosition = ''
      this.description = ''
      this.title = ''
      this.chosenOfferType = null
      this.societyName = ''
      this.societyAddress = ''
      this.societyWebsite = ''
      this.chosenExperience = []
      this.salary = ''
    }
  },
  mounted () {
    this.$eventBus.$on('Jobs::CreateStep3', (payload) => {
      console.log(payload)
      this.jobCode = payload.jobCode
      this.jobPosition = payload.jobPosition
      this.showForm = true
    })
  }
}
</script>

<style>
</style>
