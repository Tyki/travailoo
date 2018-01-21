<template lang="html">
  <div>
    <register />
    <login />
    <createJob />
    <createJobStep3 />
  </div>
</template>

<script>
import Register from '~/components/modals/user/register'
import Login from '~/components/modals/user/login'
import CreateJob from '~/components/modals/job/createJob'
import CreateJobStep3 from '~/components/modals/job/createJobStep3'

export default {
  name: 'modalWrapper',
  components: {
    Register,
    Login,
    CreateJob,
    CreateJobStep3
  },
  data: () => ({

  })
}
</script>

<style lang="css">
</style>
