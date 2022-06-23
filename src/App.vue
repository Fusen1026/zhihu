<template>
  <div class="container">
    <global-header :user="currentUser"></global-header>
    <loading v-if="isLoading"></loading>
    <router-view></router-view>
  </div>
  
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from './store'
import Loading from './components/Loading.vue'
import createMessage from './hooks/createMessage'

export default defineComponent({
  name: 'App',
  components: { 
    GlobalHeader,
    Loading,
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const error = computed(() => store.state.error)
    watch(() => error.value.status, () => {
      const {status, message} = error.value
      if(status && message) {
        createMessage('error', message)
      }
    })
    return {
      currentUser,
      isLoading,
      error
    }
  }
});
</script>

<style>

</style>
