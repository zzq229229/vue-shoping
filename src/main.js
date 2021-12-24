import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局
import './assets/css/global.css'
// 导入图标
import './assets/fonts/iconfont.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
// import { config } from 'vue/types/umd'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 获取表单数据
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
//   在最后必须返回config
})

Vue.prototype.$http = axios
Vue.config.productionTip = false
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

// vue.component('tree_table', treeTable)
Vue.component('tree-table', TreeTable)
// 时间过滤器vue.filter('过滤器名字'，函数function(originVal 需要处理的时间数据))
Vue.filter('deteFormet', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
