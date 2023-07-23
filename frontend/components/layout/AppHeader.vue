<template>
  <v-app-bar>
    <span @click="navigateTo('/')">Travailoo</span>
    <v-spacer></v-spacer>
    <div v-if="!isLoggedIn">
      <v-btn @click="openLoginModal">Login</v-btn>
      <v-btn variant="tonal" @click="toSignup">Signup</v-btn>
    </div>

    <div v-else>
      <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
          <v-chip
            color="primary"
            v-bind="props"
          >
          </v-chip>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
          >
            <v-list-item-title v-if="item.title" @click="item.action">{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>

      </v-menu>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useUserStore } from '~~/stores';
import { useKuzzleClient } from '~~/composables/kuzzleClient'

const userStore = useUserStore()
const { client } = useKuzzleClient()

const isLoggedIn = computed(() => userStore.isLoggedIn)

const logout = async () => {
  try {
    console.log('logout')
    await client.auth.logout()
    userStore.jwt = null
  } catch(e) {
    // TODO
    console.log(e)
  }
}

const items = [
  { title: 'Mes informations personnelles', action: () => navigateTo('/user/account')},
  { title: 'Mon profil public', action: () => navigateTo('/user/profile')},
  { spacer: true },
  { title: 'Se déconnecter', action: logout},
]

const openLoginModal = () => {
  navigateTo('login')
}

const toSignup = () => {
  navigateTo('signup-customer')
}
</script> 