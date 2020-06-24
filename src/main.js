import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

import qs from 'qs'
import axios from 'axios'

Vue.prototype.qs = qs

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:3000'
// axios请求拦截器
axios.interceptors.request.use(config => {
  // 为请求头对象添加Authorization字段，值为token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须return config
  return config
})
Vue.prototype.axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
