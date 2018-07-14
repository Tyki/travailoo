<template>
  <v-navigation-drawer v-model="drawer"  absolute right width="635" clipped app>
    <div v-if="drawer && data">
      <v-toolbar card dark color="primary" >
        <v-toolbar-title>{{ data.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click.native="close">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-container >
        <v-layout>
          <v-flex xs5>
            <img src="http://via.placeholder.com/240x100" />
          </v-flex>

          <v-flex xs7>
            Date de publication : XX / XX / XX
            <v-layout>
              <v-btn>Contacter</v-btn>
            </v-layout>

            <v-btn xs6 flat>Sauvegarder</v-btn>
            <v-btn xs6 flat>Partager</v-btn>
          </v-flex>
        </v-layout>

        <h2>Description du poste</h2>
        <v-layout>
          {{ data.description }}
        </v-layout>

        <br>

        <h2>Informations sur le poste</h2>
        <v-layout>
          <v-flex xs6><h4>Salaire</h4></v-flex>
          <v-flex xs6><p>{{ data.salary === '' ? 'Non communiqué' : `€${data.salary}` }}</p></v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs6><h4>Experience souhaitée</h4></v-flex>
          <v-flex xs6><p>TODO</p></v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs6><h4>Type de contrat</h4></v-flex>
          <v-flex xs6><p>{{ getOfferType() }}</p></v-flex>
        </v-layout>

        <br>

        <h2>Informations sur l'entreprise</h2>
        <v-layout>
          <v-flex xs6><h4>Nom de l'entreprise</h4></v-flex>
          <v-flex xs6><p>{{ data.societyName }}</p></v-flex>
        </v-layout>

        <v-layout>
          <v-flex xs6><h4>Addresse de l'entreprise</h4></v-flex>
          <v-flex xs6><p>{{ data.societyAddress }}</p></v-flex>
        </v-layout>

        <h4>Présentation de l'entreprise</h4>
        <v-layout>
          <p>TODO</p>
        </v-layout>
      </v-container>
    </div>
  </v-navigation-drawer>   
</template>

<script>
export default {
  name: 'rightPanelJob',
  data: () => ({
    drawer: false,
    data: null,
    offerTypes: [
      {key: 1, label: 'Contrat à durée indeterminée'},
      {key: 2, label: 'Contrat à durée determinée'},
      {key: 3, label: 'Contrat de travail temporaire'},
      {key: 4, label: 'Contrat de professionnalisation'},
      {key: 5, label: 'Contrat d\'apprentissage'},
      {key: 6, label: 'Alternance'},
      {key: 7, label: 'Stage'}
    ]
  }),
  mounted () {
    this.$eventBus.$on('Jobs::focusJob', (job) => {
      this.data = job
      this.drawer = true
    })
    this.$eventBus.$on('Jobs::closeFocusJob', () => {
      this.close()
    })
  },
  methods: {
    close: function () {
      this.drawer = false
      this.data = null
      this.$eventBus.$emit('Map::FlyTo', {to: 'original'})
    },
    getOfferType: function () {
      let result = 'Non communiqué'
      this.offerTypes.forEach(offerType => {
        if (offerType.key === this.data.offerType) {
          result = offerType.label
        }
      })

      return result
    }
  }
}
</script>
