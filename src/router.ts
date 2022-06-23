import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import Signup from './views/Signup.vue'
import PostDetail from './views/PostDetail.vue'
import store from './store'
import axios from 'axios'

const history = createWebHistory()
const router = createRouter({
  history,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      meta: { isAlreadyLogin: true},
      component: Login
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/create',
      name: 'create',
      meta: {isRequiredLogin: true},
      component: CreatePost
    },
    {
      path: '/signup',
      name: 'signup',
      meta: { isAlreadyLogin: true },
      component: Signup
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: PostDetail
    }
  ]
})
router.beforeEach((to, from, next) => {
  const { user, token } = store.state
  const { isRequiredLogin, isAlreadyLogin } = to.meta
  if(!user.isLogin) {
    if(token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if(isAlreadyLogin) {
          next("/")
        }else {
          next()
        }
      }).catch(e => {
        console.log(e)
        store.commit('logout')
        next('login')
      })
    }else {
      if(isRequiredLogin) {
        next('login')
      }else {
        next()
      }
    }
  }else {
    if(isAlreadyLogin) {
      next('/')
    }else {
      next()
    }
  }
})

export default router