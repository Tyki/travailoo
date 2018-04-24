<template lang="html">
  <div class="jobWrapper_content">  

    <div class="jobWrapper_header">
      <search-engine />    
    </div>
  </div>
</template>

<script>
import searchEngine from '@/components/layout/searchEngine'

export default {
  name: 'jobWrapper',
  components: {
    searchEngine
  }
}
</script>

<style scoped>
.jobWrapper_content {
  padding-top: 64px;
  z-index: 9999;
}
.jobWrapper_header {
  background-color: white;
}
</style>