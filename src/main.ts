import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import axios from 'axios'

// 替换 baseURL
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config => {
  config.params = { ...config.params, icode: 'E7B7252EEF983612' }
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append('icode', 'E7B7252EEF983612')
  } else {
  // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: 'E7B7252EEF983612' }
  }
  store.commit('setLoading', true)
  return config
})
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
}, e => {
  console.log('e.response', e.response)
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error})
  store.commit('setLoading', false)
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
