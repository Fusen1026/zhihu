<template>
	<div class="signup-page mx-auto p-3 w-330">
		<validate-form @submit-form="onFormSubmit">
			<div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <valid-input
          :rules="emailRules"
          placeholder="请输入邮箱地址"
          v-model="formData.email"
          type="text"
        />
      </div>
			<div class="mb-3">
        <label class="form-label">昵称</label>
        <valid-input
          :rules="nameRules"
          placeholder="请输入昵称"
          v-model="formData.nickName"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <valid-input
          type="password"
          placeholder="请输入密码"
          v-model="formData.password"
          :rules="passwordRules"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">重复密码</label>
        <valid-input
          type="password"
          placeholder="请再次密码"
          v-model="formData.repeatPassword"
          :rules="repeatPasswordRules"
        />
      </div>
			<template #submit>
				<button type="submit" class="btn btn-primary btn-block btn-large">注册新用户</button>
			</template>
		</validate-form>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import ValidateForm from '../components/ValidateForm.vue'
import ValidInput, { RulesProp } from '../components/ValidInput.vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import createMessage from '../hooks/createMessage'

export default defineComponent({
	components: {
		ValidateForm,
		ValidInput,
	},
	setup() {
    const formData = reactive({
      email: '',
      nickName: '',
      password: '',
      repeatPassword: '',
    })
    const router = useRouter()
		const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const nameRules: RulesProp = [
      { type: 'required', message: '昵称不能为空' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]
    const repeatPasswordRules: RulesProp = [
      { type: 'required', message: '重复密码不能为空' },
      { type: 'custom', message: '两次密码不相同', validator: () => {
        return formData.password === formData.repeatPassword
      }}
    ]
		const onFormSubmit = () => {
      const payload = {
        email: formData.email,
        password: formData.password,
        nickName: formData.nickName
      }
      axios.post('/users/', payload).then(data => {
        console.log(data)
        createMessage('success', '注册成功，正在跳转登录页面')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }).catch(e => {
        console.log(e)
      })
		}
		return {
			onFormSubmit,
			emailRules,
			nameRules,
			passwordRules,
			repeatPasswordRules,
      formData
		}
	}
})
</script>

<style>

</style>