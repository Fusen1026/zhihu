<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar && column.avatar.url" :alt="column.title" class="rounded-circle border" width="100">
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
  </div> 
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import PostList from '../components/PostList.vue'
import { ColumnProps } from '../store'
import { addColumnAvatar } from '../helper'
export default defineComponent ({
  components: {
    PostList,
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    // 为了让 computed 响应对应的彼岸花，添加响应式对象
    const currentId = ref(route.params.id)
    
    const column = computed(() => {
      const selectColumn = store.getters.getColumnById(currentId.value) as ColumnProps | undefined
      if(selectColumn) {
        addColumnAvatar(selectColumn, 100, 100)
      }
      return selectColumn
    })
    const list = computed(() => store.getters.getPostsByCid(currentId.value))
    onMounted(() => {
      store.dispatch('fetchColumn', currentId.value)
      store.dispatch('fetchPosts', currentId.value)
    })
    // 检测变化
    watch(() => route.params, (toParams) => {
      // 确保要变化的路径是进入到用户的专栏
      if((toParams && toParams.id) === store.state.user.column) {
        // 重新发送请求， 在store中有对应的缓存设置
        store.dispatch('fetchColumn', toParams.id)
        store.dispatch('fetchposts', toParams.id)
        // 重新赋值,这样 computed 会变化
        currentId.value = toParams.id
      }
    })
    return {
      route,
      column,
      list,
    }
  }
})
</script>

<style>

</style>