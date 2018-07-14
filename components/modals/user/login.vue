<template lang="html">
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="425px" transition="scale-transition" origin="center center">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('modals.login.title') }}</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field :label="$t('modals.login.email_label')" :rules="emailRules" v-model="email" @keyup="keyupEvent"/>
                </v-flex>

                <v-flex xs12>
                  <v-text-field :label="$t('modals.login.password_label')" v-model="password" type="password" @keyup="keyupEvent" />
                </v-flex>

                <v-flex xs8>
                  <v-checkbox :label="$t('modals.login.stay_connnected_label')" v-model="stayConnected" />
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          TODO : MDP Oublié
          <v-btn color="blue darken-1" flat @click.native="openRegister">{{ $t('modals.login.register') }}</v-btn>
          <v-btn color="blue darken-1" @click.native="logUser">{{ $t('modals.login.connect') }}</v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { openSpecificModal } from '~/services/helpers/eventBus'

export default {
  name: 'loginModal',
  data: () => ({
    dialog: false,
    valid: false,
    email: '',
    password: '',
    stayConnected: true,
    // TODO:  Find a way to inject translated rules
    emailRules: [
      (v) => !!v || 'L\'email est requis',
      (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'L\'email doit être valide'
    ]
  }),
  methods: {
    logUser: function () {
      const data = {username: this.email.toLowerCase(), password: this.password}
      this.$kuzzle.login('local', data, this.stayConnected ? '385 days' : '12h', (error, response) => {
        if (error) {
          // Handle error
          if (error.status === 401) {
            // Wrong credentials
            this.$toasted.global.toastError({
              message: this.$t('errors.wrong_credentials')
            })
          } else {
            this.$toasted.global.toastError()
          }
          return
        }

        if (this.stayConnected && response.jwt) {
          localStorage.setItem('jwt', response.jwt)
        }

        // Store loggedStatus
        this.$store.commit('user/changeLoggedStatus', true)

        this.$kuzzle.whoAmI((error, user) => {
          if (error) { this.$toasted.global.toastError() }

          this.$store.commit('user/updateUserId', user.id)
          if (user.hasOwnProperty('content') && user.content.hasOwnProperty('firstname')) {
            this.$store.commit('user/updateUserFirstname', user.content.firstname)
          }

          this.$toasted.global.toastSuccess({
            message: this.$t('success.logged')
          })

          this.$eventBus.$emit('Modals::close')
        })
      })
    },
    openRegister: function () {
      openSpecificModal('openRegister')
    },
    keyupEvent: function (e) {
      if (e.keyCode === 13) {
        // Enter button
        this.logUser()
      }
    }
  },
  mounted () {
    this.$eventBus.$on('Modals::openLogin', () => {
      this.dialog = true
    })

    this.$eventBus.$on('Modals::close', () => {
      this.dialog = false
    })
  }
}
</script>

<style lang="css" scoped>

</style>
