<template lang="html">
  <div>
    <register />
    <login />
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
  data: () => ({

  })
}
</script>

<style lang="css">
</style>
