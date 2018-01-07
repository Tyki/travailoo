<template lang="html">
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">User Profile</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6 md4>
              <v-text-field label="Legal first name" required></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field label="Legal last name" hint="example of persistent helper text"
                persistent-hint
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Email" required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Password" type="password" required></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select
                label="Age"
                required
                :items="['0-17', '18-29', '30-54', '54+']"
              ></v-select>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select
                label="Interests"
                multiple
                autocomplete
                chips
                :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
              ></v-select>
            </v-flex>
          </v-layout>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" flat @click.native="dialog = false">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'register',
  data: () => ({
    dialog: false
  }),
  mounted () {
    this.$eventBus.$on('Modals::openRegister', () => {
      this.dialog = true
      console.log('opening Register')
    })

    this.$eventBus.$on('Modals::close', () => {
      this.dialog = false

      console.log('close modals')
    })
  }
}
</script>

<style lang="css">
</style>
