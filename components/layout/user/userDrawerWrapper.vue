<template lang="html">
  <v-navigation-drawer fixed :clipped="$vuetify.breakpoint.width > 1264" v-model="drawer" app>
    <v-list>

      <avatar-tile />
      <v-divider></v-divider>

      <!-- Menu actions -->
      <template v-for="(item, i) in items">
        <v-list-group v-if="item.children" v-model="item.model" no-action>
            <v-list-tile slot="item" @click="">

              <v-list-tile-action>
                <v-icon>{{ item.model ? item.icon : item['icon-alt'] }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
              @click=""
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
        </v-list-group>

        <div v-else>
        <v-divider v-if="item.dividerTop"></v-divider>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider v-if="item.dividerBot"></v-divider>
      </div>

      </template>
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
      { icon: 'account_circle', text: 'Mes informations' },
      { icon: 'youtube_searched_for', text: 'Mes recherches' },
      { icon: 'my_library_books', text: 'Mes messages', dividerBot: true },
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: 'Labels',
        model: true,
        children: [
          { icon: 'add', text: 'Create label' }
        ]
      },
      { icon: 'settings', text: 'Mes préférences', dividerTop: true },
      { icon: 'clear', text: 'Se déconnecter' }
    ]
  }),
  mounted () {
    this.$eventBus.$on('User::toggleDrawer', () => {
      this.drawer = !this.drawer
    })
  }
}
</script>

<style lang="css">
</style>
