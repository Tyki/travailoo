<template lang="html">
  <v-dialog v-model="dialog" max-width="700px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ $t('modals.register.title') }}</span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-container grid-list-md>
            <v-layout wrap>
              <!-- Firstname -->
              <v-flex xs12>
                <v-text-field
                  :label="$t('modals.register.firstname_label')"
                  v-model="firstname"
                  :rules="firstnameRules"
                  required
                ></v-text-field>
              </v-flex>

              <!-- Lastname -->
              <v-flex xs12>
                <v-text-field
                  :label="$t('modals.register.lastname_label')"
                  v-model="lastname"
                  :rules="lastnameRules"
                  required
                ></v-text-field>
              </v-flex>

              <!-- Email -->
              <v-flex xs12>
                <v-text-field
                  :label="$t('modals.login.email_label')"
                  v-model="email"
                  :rules="emailRules"
                  required
                ></v-text-field>
              </v-flex>

              <!-- Password -->
              <v-flex xs6>
                <v-text-field
                  :label="$t('modals.login.password_label')"
                  ref="password"
                  v-model="password"
                  type="password"
                  :rules="passwordRules"
                  persistent-hint
                  :hint="$t('modals.register.password_hint')"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  :label="$t('modals.register.repeat_password_label')"
                  v-model="second_password"
                  type="password"
                  required
                  :rules="passwordRules"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="openLogin">{{
          $t('modals.register.already_have_account')
        }}</v-btn>
        <v-btn
          v-if="!working"
          color="blue darken-1"
          @click.native="registerUser"
          >{{ $t('modals.register.register') }}</v-btn
        >
        <v-progress-circular
          v-else
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { openSpecificModal } from '~/services/helpers/eventBus'

export default {
  name: 'RegisterModal',
  data: () => ({
    dialog: false,
    valid: false,
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    second_password: '',
    working: false,
    // TODO:  Find a way to inject translated rules
    emailRules: [
      v => !!v || "l'email est requis",
      v =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "L'email doit être valide"
    ],
    firstnameRules: [v => !!v || 'Le prénom est requis'],
    lastnameRules: [v => !!v || 'Le nom est requis'],
    passwordRules: [
      v => !!v || 'Le mot de passe est requis',
      v =>
        v.length >= 8 ||
        'Votre mot de passe ne contient pas au moins 8 caractères'
    ]
  }),
  methods: {
    openLogin() {
      openSpecificModal('openLogin')
    },
    registerUser() {
      if (this.$refs.form.validate()) {
        if (this.password !== this.second_password) {
          this.$toasted.global.toastError({
            message: this.$t('rules.email_not_same')
          })

          this.$refs.password.focus()

          return
        }

        // Forbid the User to double click and create two accounts ^_^
        this.working = true

        const email = this.email.toLowerCase()
        const data = {
          content: {
            profileIds: ['default'],
            firstname: this.firstname,
            lastname: this.lastname
          },
          credentials: {
            local: {
              username: email,
              password: this.password
            }
          }
        }

        // Creating the User in the backend
        this.$kuzzle.security.createUser(
          email,
          data,
          { refresh: 'wait_for' },
          (error, response) => {
            if (error) {
              this.working = false
              if (error.status === 412) {
                // Email already exists!
                this.$toasted.global.toastError({
                  message: this.$t('errors.email_already_exists')
                })
              } else {
                this.$toasted.global.toastError({
                  message: 'Erreur lors de la création'
                })
              }

              return
            }

            this.$kuzzle.login(
              'local',
              { username: email, password: this.password },
              '12h',
              (error, response) => {
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

                // Store loggedStatus
                this.$store.commit('User/changeLoggedStatus', true)

                this.$kuzzle.whoAmI((error, user) => {
                  if (error) {
                    this.$toasted.global.toastError()
                    return
                  }

                  if (
                    user.hasOwnProperty('content') &&
                    user.content.hasOwnProperty('firstname')
                  ) {
                    this.$store.commit(
                      'User/updateUserFirstname',
                      user.content.firstname
                    )
                  }

                  this.$toasted.global.toastSuccess({
                    message: this.$t('success.account_created')
                  })

                  this.working = false

                  // TODO : connect the User?
                  // TODO : reset v-models
                  this.$eventBus.$emit('Modals::close')
                })
              }
            )
          }
        )
      }
    }
  },
  mounted() {
    this.$eventBus.$on('Modals::openRegister', () => {
      this.dialog = true
    })

    this.$eventBus.$on('Modals::close', () => {
      this.dialog = false
    })
  }
}
</script>
