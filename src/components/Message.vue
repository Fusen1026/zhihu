<template>
  <teleport to="#message">
    <div class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between mt-2"
      :class="classObject" v-if="isVisible">
      <span>{{ message }}</span>
      <button type="button" class="btn-close" aria-label="Close"></button>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
export type MessageProps = 'success' | 'error' | 'default'
import useDOMCreate from '../hooks/useDOMCreate'
export default defineComponent({
  props: {
    message: String,
    type: {
      type: String as PropType<MessageProps>,
      default: 'default'
    }
  },
  emits: ['close-message'],
  setup(props, context) {
    const isVisible = ref(true)
    const hide = () => {
      isVisible.value = false
      context.emit('close-message', true)
    }
    const classObject = {
      'alert-success': props.type === 'success',
      'alert-danger': props.type === 'error',
      'alert-primary': props.type === 'default'
    }
    useDOMCreate('message')
    return {
      isVisible,
      classObject,
      hide,
    }
  }
})
</script>

<style>

</style>