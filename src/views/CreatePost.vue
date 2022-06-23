<template>
    <div class="create-post-page">
      <h4>{{ isEditMode ? '编辑文章' : '新建文章'}}</h4>
      <uploader
        action="/upload"
        :beforeUpload="uploadCheck"
        @file-uploaded="handleFileUploaded"
        class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
        :uploaded="uploadedData"
      >
        <h2>点击上传头图</h2>
        <template #loading>
          <div class="d-flex">
            <div class="spinner-border text-secondary">
              <span class="visually-hidden">Loading...</span>
            </div>
            <h2>正在上传</h2>
          </div>
        </template>
        <template #loaded="dataProps">
          
          <div class="uploaded-area">
            <img :src="dataProps.uploadedData.data.url">
            <h3>点击重新上传</h3>
          </div>
        </template>
      </uploader>
      <validate-form @submit-form="onFormSubmit">
        <div class="mb-3">
          <label class="form-label">文章标题</label>
          <valid-input 
            :rules="titleRules"
            type="text"
            placeholder="请输入标题"
            v-model="titleVal"
          >
          </valid-input>
        </div>
        <div class="mb-3">
          <label class="form-label">文章内容</label>
          <valid-input 
            :rules="contentRules"
            type="text"
            placeholder="请输入文章内容"
            v-model="contentVal"
            tag="textarea"
            rows="10"
          >
          </valid-input>
        </div>
        <template #submit>
          <button class="btn btn-primary btn-large">{{ isEditMode ? '更新文章' : '发表文章' }}</button>
        </template>
      </validate-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import ValidateForm from '../components/ValidateForm.vue'
import ValidInput, { RulesProp } from '../components/ValidInput.vue'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '../store'
import Uploader from '../components/Uploader.vue'
import { beforeUploadCheck } from '../helper'
import createMessage from '../hooks/createMessage'

export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateForm,
    ValidInput,
    Uploader
  },
  setup() {
    const uploadedData = ref()
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const route = useRoute()
    const isEditMode = !!route.query.id
    let imageId = ''
    const titleVal = ref('')
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
          const currentPost = rawData.data
          console.log("currentPost", currentPost)
          if(currentPost.image) {
            uploadedData.value = { data: currentPost.image}
          }
          titleVal.value = currentPost.title
          contentVal.value = currentPost.content || ''
        })
      }
    })
    const onFormSubmit = (result: boolean) => {
      if(result) {
        const { column, _id } = store.state.user
        if( column ) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }
          console.log("newPost", newPost)
          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode ? {
            id: route.query.id,
            payload: newPost
          } : newPost
          store.dispatch(actionName, sendData).then(() => {
            createMessage('success', '发表成功，2s后跳转到文章', 2000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column }})
            }, 2000)
          })
        }
      }
    }

    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1})
      const { passed, error } = result
      if(error === 'format') {
        createMessage('上传图片只能是 JPG/PNG 格式', 'error')
      }else if(error === 'size') {
        createMessage('上传图片大小不能超过1Mb', 'error')
      }
      return passed
    }

    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if(rawData.data._id) {
        imageId = rawData.data._id
      }
    }
    return {
      titleRules,
      contentRules,
      titleVal,
      contentVal,
      onFormSubmit,
      uploadedData,
      uploadCheck,
      handleFileUploaded,
      isEditMode,
    }
  }
})
</script>

<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.uploaded-area {
  position: relative;
}
.uploaded-area:hover h3 {
  display: block;
}
.uploaded-area h3 {
  display: none;
  position: absolute;
  color: #000;
  text-align: center;
  width: 100%;
  top: 50px;
}
</style>