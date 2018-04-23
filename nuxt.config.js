module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Travailoo',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      { rel: 'stylesheet', href: 'https://unpkg.com/vuetify@0.17.6/dist/vuetify.min.css' },
      { rel: 'stylesheet', href: 'https://api.mapbox.com/mapbox.js/v3.1.1/mapbox.css' },
      { rel: 'stylesheet', href: 'https://api.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v1.0.0/MarkerCluster.css'},
      { rel: 'stylesheet', href: 'https://api.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v1.0.0/MarkerCluster.Default.css'},
    ],
    script: [
      { src: 'https://api.mapbox.com/mapbox.js/v3.1.1/mapbox.js' },
      { src: 'https://api.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v1.0.0/leaflet.markercluster.js'}
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  env: {
    API_KEY: 'AIzaSyAZmYQHF1GKPrjwhlrL_4eIzDAP3deWetE',
    KUZZLE_HOST: 'localhost'
  },
  /*
  ** Plugins
  */
  plugins: [
    '~plugins/init',
    '~/plugins/i18n.js',
    {ssr: false, src: '~/plugins/toast'}
  ]
}
