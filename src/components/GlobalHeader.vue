<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link to="/" class="navbar-brand">知乎专栏</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登录</router-link></li>
      <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <drop-down :title="`你好 ${ user.nickName }`">
          <drop-down-item><router-link to="/create" class="dropdown-item">新建文章</router-link></drop-down-item>
          <drop-down-item><router-link :to="`/column/${user.column}`" class="dropdown-item">我的专栏</router-link></drop-down-item>
          <drop-down-item :disabled="true"><a href="#" class="dropdown-item">编辑文章</a></drop-down-item>
          <drop-down-item><a href="#" class="dropdown-item" @click="logout">退出登录</a></drop-down-item>
        </drop-down>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import DropDown from './DropDown.vue'
import DropDownItem from './DropDownItem.vue'
import { UserProps } from '../store'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import createMessage from '../hooks/createMessage'

export default defineComponent ({
  components: {
    DropDown,
    DropDownItem
  },
  props: {
    user: Object as PropType<UserProps>,
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const logout = () => {
      store.commit('logout')
      createMessage('success', '退出登录，两秒后')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
    return {
      logout,
    }
  }
})
</script>

<style>

</style>