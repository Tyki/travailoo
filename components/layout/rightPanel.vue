<template>
  <div class="engine_container">
    <search-engine />

    <search-results class="engine_results" style="background-color: white" />
  </div>
  
</template>

<script>
import searchResults from '~/components/layout/job/searchResults'
import searchEngine from '~/components/layout/searchEngine'

export default {
  name: 'rightPanel',
  components: {
    searchResults,
    searchEngine
  }
}
</script>

<style>
.engine_container {
  margin-top: 64px;
  overflow: auto;
}
</style>


