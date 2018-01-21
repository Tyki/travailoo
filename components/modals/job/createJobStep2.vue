<template lang="html">
  <v-layout>
    <v-dialog v-model="showForm" max-width="600px" persistent transition="scale-transition" origin="center center">
      <v-card>
        <v-card-title>
          <span class="headline">Créer une annonce</span>
        </v-card-title>
        <v-card-text>
          <v-select
            autocomplete
            v-bind:items="categories"
            v-model="chosenCategory"
            label="Sélectionnez la catégorie de l'offre"
            single-line
            bottom
            item-text="name"
            item-value="category"
            return-object
          ></v-select>

          <v-select v-if="checkSubSelect('midCategory')"
            autocomplete
            v-bind:items="midCategories"
            v-model="chosenMidCategory"
            label="Select"
            single-line
            bottom
            item-text="name"
            item-value="category"
            return-object
          ></v-select>

          <v-select v-if="checkSubSelect('subCategory')"
            autocomplete
            v-bind:items="subCategories"
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
    showForm: true, // v-dialog wont work without v-model. So constant 'true' to show the dialog
    chosenCategory: '',
    chosenMidCategory: '',
    chosenSubCategory: ''
  }),
  computed: {
    categories () {
      return Object.keys(this.$store.state.jobs.categories).map(category => {
        return {category, name: this.$store.state.jobs.categories[category]}
      })
    },
    midCategories () {
      return Object.keys(this.$store.state.jobs.midCategories[this.chosenCategory.category]).map(midCategory => {
        return {midCategory, name: this.$store.state.jobs.midCategories[this.chosenCategory.category][midCategory]}
      })
    },
    subCategories () {
      return Object.keys(this.$store.state.jobs.subCategories[this.chosenCategory.category + '-' + this.chosenMidCategory.midCategory]).map(subCategory => {
        return {subCategory, name: this.$store.state.jobs.subCategories[this.chosenCategory.category + '-' + this.chosenMidCategory.midCategory][subCategory]}
      })
    },
    jobs () {
      return this.$store.state.jobs.jobs
    }
  },
  methods: {
    reset () {
      this.chosenMidCategory = ''
    },
    checkSubSelect (toCheck) {
      if (toCheck === 'midCategory') {
        return (this.chosenCategory !== '' && this.chosenCategory.hasOwnProperty('category') && this.chosenCategory.category !== '')
      } else if (toCheck === 'subCategory') {
        return (this.chosenCategory !== '' && this.chosenCategory.hasOwnProperty('category') && this.chosenCategory.category !== '' &&
               this.chosenMidCategory !== '' && this.chosenMidCategory.hasOwnProperty('midCategory') && this.chosenMidCategory.midCategory !== '')
      }
    }
  },
  watch: {
    chosenCategory: () => {
      console.log('LA')
      this.chosenMidCategory = ''
    }
  }
}
</script>

<style lang="css">
</style>
