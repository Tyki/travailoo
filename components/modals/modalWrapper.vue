<template lang="html">
  <div>
    <register v-if="showRegister"/>
    <login v-if="showLogin" />
  </div>
</template>

<script>
import Register from '~/components/modals/user/register'
import Login from '~/components/modals/user/login'

export default {
  name: 'modalWrapper',
  components: {
    Register,
    Login
  },
  data(() => {
    showRegister: false,
    showLogin: false
  }),
  methods: {
    resetModals () {
      this.showRegister = false
      this.showLogin = false
    }
  },
  mounted () {
    // Init the eventBus
    this.$eventBus.on('modals::openLogin', () => {
      this.resetModals()
      console.log('opening Login')
    })

    this.$eventBus.on('modals::openRegister', () => {
      this.resetModals()
      console.log('opening Register')
    })

  }
}
</script>

<style lang="css">
</style>
