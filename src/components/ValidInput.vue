<template>
  <div class="validate-input-container pb-3">
    <input
      v-if="tag != 'textarea'"
      :class="{ 'is-invalid': inputRef.error}"
      class="form-control" 
      v-model="inputRef.val"
      @blur="isValidInput"
      v-bind="$attrs"
    >
    <textarea
      v-else
      :class="{ 'is-invalid': inputRef.error}"
      class="form-control" 
      v-model="inputRef.val"
      @blur="isValidInput"
      v-bind="$attrs"
    >
    </textarea>
    <span class="invalid-feedback" v-if="inputRef.error">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
export interface ruleProp {
  type: 'email' | 'required' | 'min' | 'custom';
  message: string;
  validator?: () => boolean
}
type Tag = 'textarea' | 'input'
export type RulesProp = ruleProp[]
import { defineComponent, PropType, reactive, onMounted, computed } from 'vue'
import {emitter} from './ValidateForm.vue'
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>,
    tag: {
      type: String as PropType<Tag>,
      default: 'input'
    },
    modelValue: String,
  },
  inheritAttrs: false,
  setup(props, context) {
    const inputRef = reactive({
      val: computed({
        get: () => props.modelValue || '',
        set: val => {
          context.emit('update:modelValue', val)
        }
      }),
      error: false,
      message: ''
    })
    const isValidInput = () => {
      if(props.rules) {
        const allPassed = props.rules.every((rule) => {
          let passed = true
          inputRef.message = rule.message
          switch(rule.type) {
            case 'email': 
              passed = emailReg.test(inputRef.val)
              break;
            case 'required':
              passed = (inputRef.val.trim() != '')
              break;
            case 'min':
              passed = inputRef.val.length >= 6
              break;
            case 'custom':
              passed = rule.validator ? rule.validator() : true
              break;
            default: 
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    onMounted(() => {
      emitter.emit('form-item-created', isValidInput)
    })
    return {
      isValidInput,
      inputRef
    }
  }
})
</script>

<style>

</style>