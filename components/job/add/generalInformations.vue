<template>
  <div>
    <h2 class="headline">Informations sur l'annonce</h2>

    <v-text-field name="title" label="Titre de l'annonce " v-model="title"
    :rules="[() => title.length > 0 || 'Ce champ est requis']" required />

    <v-select v-bind:items="offerTypes" v-model="chosenOfferType" label="Type de contrat "  
      :rules="[() => chosenOfferType !== null || 'Ce champ est requis']"
      bottom required item-text="label" item-value="key" return-object />

    <v-text-field name="description" label="Description de l'annonce "
      textarea v-model="description" required
      :rules="[() => description.length > 0 || 'Ce champ est requis']" />

    <v-text-field name="salary" label="Rémunération " ingle-line model="salary" required
      :rules="[() => salary.length > 0 || 'Ce champ est requis']" />

    <v-text-field name="societyName" label="Nom de la société "   v-model="societyName"
      :rules="[() => societyName.length > 0 || 'Ce champ est requis']" required />

    <v-text-field name="societyAddress" label="Adresse de la société "  required
      v-model="societyAddress"
      :rules="[() => societyAddress.length > 0 || 'Ce champ est requis']" />
  </div>
</template>

<script>
export default {
  name: 'generalInformations',
  data: () => ({
    title: '',
    description: '',
    salary: '',
    societyName: '',
    societyAddress: '',
    chosenOfferType: '',
    offerTypes: [
      {key: 1, label: 'Contrat à durée indeterminée'},
      {key: 2, label: 'Contrat à durée determinée'},
      {key: 3, label: 'Contrat de travail temporaire'},
      {key: 4, label: 'Contrat de professionnalisation'},
      {key: 5, label: 'Contrat d\'apprentissage'},
      {key: 6, label: 'Alternance'},
      {key: 7, label: 'Stage'}
    ]
  })
}
</script>
