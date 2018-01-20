<template lang="html">
  <div>
    <register />
    <login />
    <createJob />
  </div>
</template>

<script>
import Register from '~/components/modals/user/register'
import Login from '~/components/modals/user/login'
import createJob from '~/components/modals/job/createJob'

export default {
  name: 'modalWrapper',
  components: {
    Register,
    Login,
    createJob
  },
  data: () => ({

  })
}
</script>

<style lang="css">
</style>
