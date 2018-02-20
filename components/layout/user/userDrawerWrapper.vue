<template lang="html">
  <v-navigation-drawer fixed :clipped="$vuetify.breakpoint.width > 1264" v-model="drawer" app>
    <v-list>

      <avatar-tile />

      <v-list-tile @click="logoutUser" v-if="isUserLogged">
        <v-list-tile-action>
          <v-icon>clear</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            Se déconnecter
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-divider />

      <v-list-tile @click="addJob" v-if="isUserLogged">
        <v-list-tile-action>
          <v-icon>add</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            Déposer une annonce
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

    </v-list>
  </v-navigation-drawer>
</template>

<script>
import AvatarTile from '~/components/layout/user/avatarTile'

export default {
  name: 'userDrawerWrapper',
  components: {
    AvatarTile
  },
  data: () => ({
    drawer: false,
    items: [
      { icon: 'account_circle', text: 'Mes informations' }, // TODO
      { icon: 'youtube_searched_for', text: 'Mes recherches' }, // TODO
      { icon: 'my_library_books', text: 'Mes messages', dividerBot: true }, // TODO
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: 'Labels',
        model: true,
        children: [
          { icon: 'add', text: 'Create label' }
        ]
      },
      { icon: 'settings', text: 'Mes préférences', dividerTop: true }, // TODO
      { icon: 'clear', text: 'Se déconnecter' } // Done
    ]
  }),
  computed: {
    isUserLogged () {
      return this.$store.state.user.isUserLogged
    }
  },
  methods: {
    logoutUser () {
      this.$kuzzle.logout((error, response) => {
        if (error) {
          console.error(error)
        }
        this.$store.commit('user/changeLoggedStatus', false)
        this.$store.commit('user/updateUserFirstname', '')

        this.drawer = !this.drawer
      })
    },

    addJob () {
      // Close the drawer
      this.drawer = !this.drawer
      // Open the first modal
      this.$eventBus.$emit('Jobs::StartCreate')
    }
  },
  mounted () {
    this.$eventBus.$on('User::toggleDrawer', () => {
      this.drawer = !this.drawer
    })
  }
}
</script>
