import Vue from 'vue'
import Element from 'element-ui'
import '../element-variables.scss'

Vue.use(Element)
Vue.prototype.$messsage = Element.Message
Vue.prototype.$notify = Element.Notification
