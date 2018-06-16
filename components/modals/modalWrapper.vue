<template lang="html">
  <div>
    <RegisterModal />
    <LoginModal />
    <AddJobModal />
  </div>
</template>

<script>
import RegisterModal from '~/components/modals/user/register'
import LoginModal from '~/components/modals/user/login'
import AddJobModal from '~/components/modals/job/addJob'

export default {
  name: 'modalWrapper',
  components: {
    RegisterModal,
    LoginModal,
    AddJobModal
  }
}
</script>

<style lang="css">
</style>
