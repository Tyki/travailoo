<template>
  <v-card style="margin: 5px">
    <v-card-media src="http://via.placeholder.com/400x200" height="200px" @click.stop="openFullPreview">
    </v-card-media>
    <v-card-title primary-title @click.stop="openFullPreview">
      <div>
        <h3 class="headline mb-0">{{ jobData.title }}</h3>
        <div>{{ truncate(jobData.description) }}</div>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'jobPreview',
  props: [
    'jobData'
  ],
  methods: {
    truncate: function (description) {
      if (description.length > 50) {
        return description.substring(0, 50) + '...'
      } else {
        return description
      }
    },

    openFullPreview: function () {
      this.$eventBus.$emit('Jobs::focusJob', this.jobData)
      this.$eventBus.$emit('Map::FlyTo', {to: {
        position: this.jobData.jobPosition
      }})
    }
  }
}
</script>

