import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default ({ app }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: 'fr',
    messages: {
      fr: require('~/services/translations/fr.json'),
      en: require('~/services/translations/en.json')
    }
  })
}
