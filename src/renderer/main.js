import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import {ElementUI, Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.prototype.$message = Message
/* eslint-disable no-new */
const vue = new Vue({
  components: { App },
  router,
  store,
  ElementUI,
  template: '<App/>'
}).$mount('#app')

export default vue
