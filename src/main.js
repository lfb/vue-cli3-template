import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible'
import Storage from 'vue-ls'

Vue.config.productionTip = false

Vue.use(Storage, {
  namespace: 'boblog__',
  name: 'ls',
  storage: 'local'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
