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
                  <v-text-field
                    :label="$t('modals.login.email_label')"
                    v-model="email"
                    :rules="emailRules"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    :label="$t('modals.login.password_label')"
                    v-model="password"
                    type="password"
                  ></v-text-field>
                </v-flex>

                <v-flex xs8>
                  <v-checkbox
                    :label="$t('modals.login.stay_connnected_label')"
                    v-model="stayConnected"
                  ></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="openRegister">{{ $t('modals.login.register') }}</v-btn>
          <v-btn color="blue darken-1" @click.native="logUser">{{ $t('modals.login.connect') }}</v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { openSpecificModal } from '~/helpers/eventBus'

export default {
  name: 'login',
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
    logUser () {
      this.$kuzzle.loginPromise('local',
        {
          username: this.email.toLowerCase(),
          password: this.password
        }, this.stayConnected ? '385 days' : '12h')
        .then((response) => {
          // Store JWT in LocalStorage if the user checked stayConnectedf
          if (this.stayConnected) {
            localStorage.setItem('jwt', response.jwt)
          }

          // Store loggedStatus
          this.$store.commit('user/changeLoggedStatus', true)

          return this.$kuzzle.whoAmIPromise()
        })
        .then((user) => {
          if (user.hasOwnProperty('content') && user.content.hasOwnProperty('firstname')) {
            this.$store.commit('user/updateUserFirstname', user.content.firstname)
          }

          this.$toasted.global.toastSuccess({
            message: this.$t('success.logged')
          })

          this.$eventBus.$emit('Modals::close')
        })
        .catch((error) => {
          if (error.status === 401) {
            // Wrong credentials
            this.$toasted.global.toastError({
              message: this.$t('errors.wrong_credentials')
            })
          } else {
            this.$toasted.global.toastError()
          }
        })
    },
    openRegister () {
      openSpecificModal('openRegister')
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
