<template>
  <validate-form @submit-form="submitForm">
      账户 111@test.com
      密码 111111
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <valid-input 
          :rules="emailRules"
          type="text"
          placeholder="请输入电子邮箱"
          v-model="emailVal"
        >
        </valid-input>
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <valid-input 
          :rules="passwordRules" 
          type="password"
          placeholder="请输入密码"
          v-model="passwordVal"
        >
        </valid-input>
      </div>
      
      <template #submit>
        <span class="btn btn-danger">Submit</span>
      </template>
    </validate-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidInput, { RulesProp }from '../components/ValidInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import createMessage from '../hooks/createMessage'
export default defineComponent ({
  components: {
    ValidInput,
    ValidateForm,
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const emailVal = ref('')
    const passwordVal = ref('')
    const emailRules: RulesProp = [
      {type: 'required', message: '输入不能为空'},
      {type: 'email', message: '输入正确的邮箱地址'}
    ]
    const passwordRules: RulesProp = [
      {type: 'required', message: '输入不能为空'},
      {type: 'min', message: '密码长度不能少于六位'}
    ]
    const submitForm = (result: boolean) => {
      if(result) {
        const payload = {
          email: emailVal.value,
          password: passwordVal.value
        }
        store.dispatch('loginAndFetch', payload).then(() => {
          createMessage('success', '登录成功，两秒后跳转到首页')
          setTimeout(() => {
            router.push('/')
          }, 2000)
        })
      }
    }
    return {
      emailRules,
      passwordRules,
      submitForm,
      emailVal,
      passwordVal
    }
  }
})
</script>

<style>

</style>