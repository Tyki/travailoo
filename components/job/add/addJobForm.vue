<template>
  <div style="margin-top: 14px">
    <v-layout >
      <v-flex xs6>
        <v-form>
          <div>
            <h2 class="headline">Informations sur l'annonce</h2>

            <v-text-field name="title" label="Titre de l'annonce " v-model="title"
            :rules="[() => title.length > 0 || 'Ce champ est requis']" required ref="title"/>

            <v-select v-bind:items="offerTypes" v-model="chosenOfferType" label="Type de contrat "  
              :rules="[() => chosenOfferType !== null || 'Ce champ est requis']"
              bottom required item-text="label" item-value="key" return-object ref="chosenOfferType"/>

            <v-text-field name="description" label="Description de l'annonce "
              textarea v-model="description" required
              :rules="[() => description.length > 0 || 'Ce champ est requis']" ref="description" />

            <v-text-field name="salary" label="Rémunération " v-model="salary" single-line model="salary" />

            <v-text-field name="societyName" label="Nom de la société "   v-model="societyName"
              :rules="[() => societyName.length > 0 || 'Ce champ est requis']" required  ref="societyName" />

            <v-text-field name="societyAddress" label="Adresse de la société " required v-model="societyAddress"
              :rules="[() => societyAddress.length > 0 || 'Ce champ est requis']" ref="societyAddress" />
          </div>
        </v-form>
      </v-flex>
      <!-- TODO: trouver un moyen de virer ca ! -->
      &nbsp;
      &nbsp;
      &nbsp;
      <v-flex xs6>
        <div>
          <h2 class="headline">Informations complémentaires</h2>

          <v-select autocomplete label="Sélectionnez la catégorie de l'offre " item-text="name" item-value="category"
            v-bind:items="categories" v-model="chosenCategory" return-object required ref="chosenCategory" />

          <v-select autocomplete label="Sélectionnez une sous-catégorie" bottom item-text="name" item-value="category"
            v-bind:items="midCategories" v-model="chosenMidCategory" return-object />
          <!-- v-if="checkSubSelect('midCategory')" -->

          <v-select autocomplete label="Affinez la recherche..." bottom item-text="name" item-value="category"
            v-bind:items="subCategories" v-model="chosenSubCategory" return-object />
            <!-- v-if="checkSubSelect('subCategory')" -->
        </div>

        <h2 class="headline">Géolocalisez le lieu de l'offre <span style="color: red;">*</span></h2>
        <mini-map-picker @position="chosenPosition" class="map-layout"/>
      </v-flex>
    </v-layout>


    <v-btn right color="info" style="float: right;" @click="submitForm">Soumettre</v-btn>
    <v-btn right color="error" @click="$emit('canceled')">Annuler</v-btn>
  </div>
</template>

<script>
import miniMapPicker from '~/components/job/add/miniMapPicker'

export default {
  name: 'addJobForm',
  components: {
    miniMapPicker
  },
  data: () => ({
    formValid: false,
    jobPosition: null,
    title: '',
    description: '',
    salary: '',
    societyName: '',
    societyAddress: '',
    chosenOfferType: '',
    chosenCategory: '',
    chosenMidCategory: '',
    chosenSubCategory: '',
    chosenJob: '',
    offerTypes: [
      {key: 1, label: 'Contrat à durée indeterminée'},
      {key: 2, label: 'Contrat à durée determinée'},
      {key: 3, label: 'Contrat de travail temporaire'},
      {key: 4, label: 'Contrat de professionnalisation'},
      {key: 5, label: 'Contrat d\'apprentissage'},
      {key: 6, label: 'Alternance'},
      {key: 7, label: 'Stage'}
    ],
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
    chosenPosition: function (position) {
      this.jobPosition = position
    },
    checkSubSelect: function (toCheck) {
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
    },
    submitForm: function () {
      const fieldsToValidate = ['title', 'chosenOfferType', 'description', 'societyName', 'societyAddress', 'chosenCategory']

      // Validate field text
      let formValid = !fieldsToValidate.some(fieldName => {
        if (this[fieldName] === '' || this[fieldName] === null) {
          this.$refs[fieldName].focus()
          this.$toasted.global.toastError({
            message: 'Merci de renseigner les champs requis'
          })
          return true
        }
      })

      // Validate map picker
      if (this.jobPosition === null) {
        this.$toasted.global.toastError({
          message: 'Merci de géolocaliser l\'offre à l\'aide de la mini-carte'
        })
        return
      }

      if (formValid) {
        let document = {
          title: this.title,
          description: this.description,
          societyName: this.societyName,
          societyAddress: this.societyAddress,
          experience: [],
          salary: this.salary,
          offerType: this.chosenOfferType.key,
          jobPosition: {
            lat: this.jobPosition.lat,
            lon: this.jobPosition.lng
          },
          category: this.chosenCategory.category,
          ownerId: this.$store.state.user.userId
        }

        if (this.chosenMidCategory && this.chosenMidCategory.midCategory) {
          document.midCategory = this.chosenMidCategory.midCategory
        }
        if (this.chosenSubCategory && this.chosenSubCategory.subCategory) {
          document.subCategory = this.chosenSubCategory.subCategory
        }

        return this.$kuzzle.collection('data', 'offers').createDocument(document, (error, response) => {
          if (error) {
            this.$logError(error)
            this.$toasted.global.toastError({message: 'Erreur lors de la soumission de votre annonce'})
            return
          }

          this.$toasted.global.toastSuccess({message: 'Annonce soumise avec succès'})

          setTimeout(() => {
            this.$emit('submitted')
          }, 2000)
        })
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

