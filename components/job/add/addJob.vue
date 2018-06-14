<template>
  <div style="margin-top: 64px">
    <v-layout >
      <v-flex xs12 >
        <div class="text-xs-center">
          <h1 class="headline">Créer une annonce</h1>
        </div>
      </v-flex>
    </v-layout>

    <br />
    <br />
    <br />

    <v-layout >
      <v-flex xs6>
        <v-form v-model="formValid">
          <general-informations />
        </v-form>
      </v-flex>
      <!-- TODO: trouver un moyen de virer ca ! -->
      &nbsp;
      &nbsp;
      &nbsp;
      <v-flex xs6>
        <categories /> <br />

        <h2 class="headline">Géolocalisez le lieu de l'offre <span style="color: red;">*</span></h2>
        <mini-map-picker @position="chosenPosition" class="map-layout"/>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import miniMapPicker from '~/components/job/add/miniMapPicker'
import generalInformations from '~/components/job/add/generalInformations'
import categories from '~/components/job/add/categories'

export default {
  name: 'addJob',
  components: {
    miniMapPicker,
    generalInformations,
    categories
  },
  data: () => ({
    formValid: false
  }),
  methods: {
    chosenPosition: function (position) {
      console.log(position)
    }
  }
}
</script>

