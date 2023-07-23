<template>
  <NuxtLayout name="signup">
    <v-card>
      <v-card-title>S'inscrire</v-card-title>

      <v-card-text>
        <v-text-field v-model="email" :variant="'underlined'" label="Email"></v-text-field>

        <v-text-field type="password" v-model="password" :variant="'underlined'" label="Mot de passe" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="signup" variant="tonal">S'inscrire</v-btn>
      </v-card-actions>
    </v-card>
  </NuxtLayout>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')

const signup = () => {
  
}
</script>