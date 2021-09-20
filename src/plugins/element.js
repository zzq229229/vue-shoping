import Vue from 'vue'
// 组件导入
// import { Button } from 'element-ui'
// import { Input } from 'element-ui'
import { Form, FormItem, Input, Button, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
// $message是自定义属性，可改
