import Vue from 'vue';
import Storage from 'vue-ls';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(Storage, {
  namespace: 'project_name_storage__',
  name: 'ls',
  storage: 'local',
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
