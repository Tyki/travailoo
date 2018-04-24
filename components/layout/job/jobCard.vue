<template>
  <v-flex xs6>
    <v-card>
      <v-card-media src="https://vuetifyjs.com/static/doc-images/cards/desert.jpg" height="200px">
        </v-card-media>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{ jobData.title }}</h3>
            <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
          </div>
        </v-card-title>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'jobCard',
  props: [
    'jobData'
  ]
}
</script>

