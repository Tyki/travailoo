import Vue from 'vue'

const EventBus = new Vue()

export default EventBus

export const openSpecificModal = event => {
  EventBus.$emit('Modals::close')
  EventBus.$emit('Modals::' + event)
}
