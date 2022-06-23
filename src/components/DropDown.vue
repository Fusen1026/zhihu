<template>
  <div class="dropdown" ref="dropdownRef">
    <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleClick"> 
      {{ title }}
    </a>
    <ul class="dropdown-menu" :style="{display: 'block'}" v-if="isOpen">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch} from 'vue'
import useClickOutside from '../hooks/useClickOutside'

export default defineComponent ({
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup() {
    const isOpen = ref(false)
    const dropdownRef = ref<null | HTMLElement>(null)
    const toggleClick = () => {
      isOpen.value = !isOpen.value
    }
    const isOutSideClick = useClickOutside(dropdownRef)
    watch(isOutSideClick, () => {
      if(isOutSideClick.value && isOpen.value) {
        isOpen.value = false
      }
    })
    return {
      isOpen,
      toggleClick,
      dropdownRef,
    }
  }
})
</script>

<style>

</style>