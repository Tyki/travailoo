<template>
  <v-layout row align-center justify-center class="white--text">
    <v-card>
      <v-card-title>
        <span class="headline">Que recherchez vous?</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex xs4>
              <v-select :items="items" label="Secteur" solo></v-select>
            </v-flex>

            <v-flex xs4>
              <v-select :items="items" label="Catégories" solo></v-select>
            </v-flex>

            <v-flex xs4>
              <v-select :items="items" label="Sous-catégories" solo></v-select>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1">
          <nuxt-link to="/app">
            Rechercher
          </nuxt-link>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  name: 'UserIsSearching',
  data: () => ({
    show: true,
    items: []
  })
}
</script>
