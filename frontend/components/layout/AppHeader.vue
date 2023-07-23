<template>
  <v-app-bar>
    Travailoo
    <v-spacer></v-spacer>
    <v-btn @click="openLoginModal">Login</v-btn>
    <v-btn variant="tonal" @click="toSignup">Signup</v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
const openLoginModal = () => {
  console.log('todo')
}

const toSignup = () => {
  navigateTo('signup')
}
</script> 