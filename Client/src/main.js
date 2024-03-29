import Vue from 'vue'
import App from './App.vue'
import '@/mixins/generalMixin'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueYoutube from 'vue-youtube'
import VueResource from 'vue-resource'
import Axios from 'axios'


Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueYoutube)
Vue.use(VueResource)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.prototype.$axios = Axios;

new Vue({
  render: h => h(App),
}).$mount('#app')
