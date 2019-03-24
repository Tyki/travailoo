<template>
  <v-flex xs6>
    <v-card style="margin: 5px">
      <v-img
        src="http://via.placeholder.com/400x200"
        height="200px"
        @click.stop="openFullPreview"
      >
      </v-img>
      <v-card-title primary-title @click.stop="openFullPreview">
        <div>
          <h3 class="headline mb-0">{{ jobData.title }}</h3>
          <div>{{ truncate(jobData.description) }}</div>
        </div>
      </v-card-title>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'Preview',
  props: ['jobData'],
  methods: {
    truncate: function(description) {
      if (description.length > 50) {
        return description.substring(0, 50) + '...'
      } else {
        return description
      }
    },

    openFullPreview: function() {
      this.$eventBus.$emit('Jobs::focusJob', this.jobData)
      this.$eventBus.$emit('Map::FlyTo', {
        to: {
          position: this.jobData.jobPosition
        }
      })
    }
  }
}
</script>
