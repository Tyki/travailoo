<template>
  <NuxtLayout>
    <v-card>
      <v-card-title>S'inscrire</v-card-title>

      <v-card-text>
        <v-text-field v-model="email" :variant="'underlined'" label="Email"></v-text-field>

        <v-text-field type="password" v-model="password" :variant="'underlined'" label="Mot de passe" />

        <v-alert v-if="error" color="error" icon="$error" :title="error" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="signup" variant="tonal" :loading="loading">S'inscrire</v-btn>
      </v-card-actions>
    </v-card>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useKuzzleClient } from '~~/composables/kuzzleClient'
const { client } = useKuzzleClient()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref()

const signup = async () => {
  // TODO: validation
  if (!email.value || !password.value) return

  loading.value = true
  error.value = null

  try {
    const result = await client.security.createRestrictedUser({
      content: {
        email: email.value,
        type: 'customer'
      },
      credentials: {
        local: {
          username: email.value,
          password: password.value
        }
      }
    })

    console.log(result)
  } catch (e) {
    error.value = 'Une erreur est survenue'
  } finally {
    loading.value = false
  } 
}

watch (error, newValue => {
  if (newValue) {
    setTimeout(() => error.value = null, 4000)
  }
})
</script>