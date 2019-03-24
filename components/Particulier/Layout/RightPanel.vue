<template>
  <div>
    <v-container grid-list-md style="height:calc(100vh - 68px)">
      <v-layout row style="flex-direction: column; height:calc(100vh - 68px);">
        <v-flex xs12 style="flex-grow:1; flex-shrink: 1; flex-basis: 180px;">
          <SearchEngine />
        </v-flex>

        <v-flex
          xs12
          style="max-height: 95vh; overflow-y: scroll; padding-bottom: 20px;"
        >
          <SearchResults />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import SearchResults from './SearchResults'
import SearchEngine from './SearchEngine'

export default {
  name: 'RightPanel',
  components: {
    SearchResults,
    SearchEngine
  }
}
</script>
