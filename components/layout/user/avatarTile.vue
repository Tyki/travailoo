<template lang="html">
  <div >
    <v-list-tile avatar v-if="isUserLogged">
      <v-list-tile-avatar>
        <img src="https://res.cloudinary.com/closebrace/image/upload/w_400/v1491315007/usericon_id76rb.png" />
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>
          {{ $t('common.hello') }} {{ userInformations.firstname }}
        </v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar v-else>
      <v-list-tile-avatar>
        <img src="https://res.cloudinary.com/closebrace/image/upload/w_400/v1491315007/usericon_id76rb.png" />
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>
          <span @click="open('openLogin')">{{ $t('common.connect') }}</span>
        </v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-divider></v-divider>
  </div>
</template>

<script>
import { openSpecificModal } from '~/helpers/eventBus'

export default {
  name: 'avatarTile',
  computed: {
    isUserLogged () {
      return this.$store.state.user.isUserLogged
    },
    userInformations () {
      return this.$store.state.user.userInformations
    }
  },
  methods: {
    open (event) {
      openSpecificModal(event)
    }
  }
}
</script>

<style lang="css">
</style>
