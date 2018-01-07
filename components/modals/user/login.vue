<template lang="html">
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="350px" transition="scale-transition" origin="center center">
      <!-- <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs6>
            <div style="background-color: white;">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    label="E-mail"
                    v-model="email"
                    :rules="emailRules"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    label="Mot de passe"
                    v-model="password"
                  ></v-text-field>
                </v-flex>

                <v-flex xs8>
                  <v-checkbox
                    label="Rester connecter?"
                    v-model="stayConnected"
                  ></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>
            </div>
          </v-flex>

          <v-flex xs6>
            <v-card>
              <v-card-title>
                <span class="headline">Connexion</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-text-field
                        label="E-mail"
                        v-model="email"
                        :rules="emailRules"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12>
                      <v-text-field
                        label="Mot de passe"
                        v-model="password"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs8>
                      <v-checkbox
                        label="Rester connecter?"
                        v-model="stayConnected"
                      ></v-checkbox>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" @click.native="LogUser">Se connecter</v-btn>
              </v-card-actions>

            </v-card>
          </v-flex>
        </v-layout>
      <!-- </v-container> --> -->

      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('modals.login.title') }}</span>
        </v-card-title>
        <v-card-text>
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
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="openRegister">{{ $t('modals.login.register') }}</v-btn>
          <v-btn color="blue darken-1" @click.native="LogUser">{{ $t('modals.login.connect') }}</v-btn>
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
      this.dialog = false
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

      console.log('close modals')
    })
  }
}
</script>

<style lang="css" scoped>

</style>
