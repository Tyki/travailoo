<template>
  <v-app id="inspire">

    <init />

    <v-container>
      <addJob />
    </v-container>
    
    <!-- Navbar and user left menu -->
    <user-drawer-wrapper />
    <navbar />
    <!-- Wrapper modals -->
    <modal-wrapper />
  </v-app>
</template>

<script>
import navbar from '~/components/layout/navbar'
import userDrawerWrapper from '~/components/layout/user/userDrawerWrapper'
import modalWrapper from '~/components/modals/modalWrapper'
import addJob from '~/components/job/add/addJob'
import init from '~/components/init'

export default {
  components: {
    userDrawerWrapper,
    navbar,
    modalWrapper,
    addJob,
    init
  }
}
</script>

