<template>
  <NuxtPage />
</template>

<script setup lang="ts">
import { useKuzzleClient } from '~/composables/kuzzleClient'

const { init } = useKuzzleClient()

await init()
</script>