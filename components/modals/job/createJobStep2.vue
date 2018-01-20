<template lang="html">
  <v-layout>
    <v-dialog max-width="600px" persistent transition="scale-transition" origin="center center">
      <v-card>
        <v-card-title>
          <span class="headline">Créer une annonce</span>
        </v-card-title>
        <v-card-text>
          <v-select
              autocomplete
              v-bind:items="categories"
              v-model="chosenCategory"
              label="Select"
              single-line
              bottom
              item-text="name"
              item-value="category"
              return-object
            ></v-select>

            <v-select v-if="chosenCategory !== ''"
              autocomplete
              v-bind:items="subCategories[chosenCategory]"
              v-model="chosenSubCategory"
              label="Select"
              single-line
              bottom
              item-text="name"
              item-value="category"
              return-object
            ></v-select>

            <!-- <v-select
              autocomplete
              v-bind:items="categories"
              v-model="chosenCategory"
              label="Select"
              single-line
              bottom
              item-text="name"
              item-value="category"
              return-object
              @change="selectMidCategory"
            ></v-select>

            <v-select
              autocomplete
              v-bind:items="categories"
              v-model="chosenCategory"
              label="Select"
              single-line
              bottom
              item-text="name"
              item-value="category"
              return-object
              @change="selectMidCategory"
            ></v-select> -->
        </v-card-text>
        <v-card-actions>

        </v-card-actions>

    </v-card>
  </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: 'createJobStep2',
  props: [
    'newJobPosition'
  ],
  data: () => ({
    categories: [],
    midCategories: [],
    subCategories: [],
    jobs: [],
    chosenCategory: '',
    chosenMidCategory: ''
  }),
  methods: {
    initForm () {

    }
  },
  mounted () {
    console.log(this.newJobPosition)
  }
}
</script>

<style lang="css">
</style>
