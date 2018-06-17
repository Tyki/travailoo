<template lang="html">
  <div>
    <RegisterModal />
    <LoginModal />
    <AddJobModal />
    <JobRightPanel />
  </div>
</template>

<script>
import RegisterModal from '~/components/modals/user/register'
import LoginModal from '~/components/modals/user/login'
import AddJobModal from '~/components/modals/job/addJob'
import JobRightPanel from '~/components/modals/job/rightPanelJob'

export default {
  name: 'modalWrapper',
  components: {
    RegisterModal,
    LoginModal,
    AddJobModal,
    JobRightPanel
  }
}
</script>

<style lang="css">
</style>
