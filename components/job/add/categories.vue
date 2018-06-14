<template>
  <div>
    <h2 class="headline">Informations complémentaires</h2>

    <v-select autocomplete label="Sélectionnez la catégorie de l'offre " item-text="name" item-value="category"
      v-bind:items="categories" v-model="chosenCategory" return-object required />

    <v-select autocomplete label="Sélectionnez une sous-catégorie" bottom item-text="name" item-value="category"
      v-bind:items="midCategories" v-model="chosenMidCategory" return-object />
    <!-- v-if="checkSubSelect('midCategory')" -->

    <v-select autocomplete label="Affinez la recherche..." bottom item-text="name" item-value="category"
      v-bind:items="subCategories" v-model="chosenSubCategory" return-object />
      <!-- v-if="checkSubSelect('subCategory')" -->
  </div>
</template>

<script>
export default {
  name: 'categories',
  data: () => ({
    chosenCategory: '',
    chosenMidCategory: '',
    chosenSubCategory: '',
    chosenJob: '',
    categories: []
  }),
  computed: {
    midCategories () {
      if (!this.chosenCategory) {
        return []
      }

      return Object.keys(this.$store.state.jobs.midCategories[this.chosenCategory.category]).map(midCategory => {
        return {midCategory, name: this.$store.state.jobs.midCategories[this.chosenCategory.category][midCategory]}
      })
    },
    subCategories () {
      if (!this.chosenMidCategory) {
        return []
      }
      return Object.keys(this.$store.state.jobs.subCategories[this.chosenCategory.category + '-' + this.chosenMidCategory.midCategory]).map(subCategory => {
        return {subCategory, name: this.$store.state.jobs.subCategories[this.chosenCategory.category + '-' + this.chosenMidCategory.midCategory][subCategory]}
      })
    }
  },
  methods: {
    checkSubSelect (toCheck) {
      if (toCheck === 'midCategory') {
        return (this.chosenCategory !== '' && this.chosenCategory.hasOwnProperty('category') && this.chosenCategory.category !== '')
      } else if (toCheck === 'subCategory') {
        return (this.chosenCategory !== '' && this.chosenCategory.hasOwnProperty('category') && this.chosenCategory.category !== '' &&
               this.chosenMidCategory !== '' && this.chosenMidCategory.hasOwnProperty('midCategory') && this.chosenMidCategory.midCategory !== '')
      } else if (toCheck === 'jobs') {
        return (this.chosenCategory !== '' && this.chosenCategory.hasOwnProperty('category') && this.chosenCategory.category !== '' &&
               this.chosenMidCategory !== '' && this.chosenMidCategory.hasOwnProperty('midCategory') && this.chosenMidCategory.midCategory !== '' &&
               this.chosenSubCategory !== '' && this.chosenSubCategory.hasOwnProperty('subCategory') && this.chosenSubCategory.subCategory !== '')
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.categories = Object.keys(this.$store.state.jobs.categories).map(category => {
        return {category, name: this.$store.state.jobs.categories[category]}
      })
    }, 500)
  }
}
</script>

