<template>
  <v-layout row align-center justify-center class="white--text">
    <v-card max-width="800px">
      <v-card-actions>
        <v-container grid-list-md>
          <v-btn color="primary" @click="$emit('Home::isUser')">
            Je suis un particulier
          </v-btn>
          <v-btn color="lightgrey" @click="$emit('Home::isSociety')">
            Je suis un professionnel
          </v-btn>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  name: 'ChooseEntity'
}
</script>
