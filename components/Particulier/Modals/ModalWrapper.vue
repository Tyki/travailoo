<template lang="html">
  <div>
    <RegisterModal />
    <LoginModal />
  </div>
</template>

<script>
import RegisterModal from './User/Register'
import LoginModal from './User/Login'

export default {
  name: 'ModalWrapper',
  components: {
    RegisterModal,
    LoginModal
  }
}
</script>
