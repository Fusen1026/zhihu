<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
type ValidateFunc = () => boolean
type Events = {
  'form-item-created': ValidateFunc
}
export const emitter = mitt<Events>()
export default defineComponent({
  emits: ['submit-form'],
  setup(props, context) {
    let funcArr: ValidateFunc[] = []
    
    const callback = (func: ValidateFunc) => {
      funcArr.push(func)
    }
    const submitForm = () => {
      const result = funcArr.map(func => func()).every(result => result)
      console.log('result', result)
      context.emit('submit-form', result)
    }
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
    }
  }
})
</script>

<style>

</style>