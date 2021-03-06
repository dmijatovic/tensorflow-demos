
module.exports = {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#333' },
  /*
  ** Global CSS
  */
  css: [
    '@/styles/variables.css',
    '@/styles/transitions.css',
    '@/styles/index.css',
    "@/styles/cars.css"
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    // { src: '@/plugins/usePageContent.js', mode: 'client' }
    { src: '@/plugins/dv4all.js', mode: 'client' },
    // { src: '@/plugins/tensorflow.js', mode: 'client' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
