<template>
  <div class="post-list">
    {{list.length}}
    <article v-for="post in list" :key="post._id" class="card mb-3 shadow-sm">
      <div class="card-body">
        <h4><router-link :to="`/posts/${post._id}`">{{ post.title }}</router-link></h4>
        <div class="row my-3 align-items-center">
          <div v-if="post.image && (typeof post.image !== 'string')" class="col-4">
            <img :src="post.image.url" :alt="post.title" class="rounded-lg w-100">
          </div>
          <p :class="{'col-9': post.image}">{{post.excerpt}}</p>
        </div>
        <span class="text-muted">{{ post.createdAt }}</span>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { PostProps } from '../store'
import { defineComponent, PropType } from 'vue'
export default defineComponent ({
  props: {
    list: {
      type: Array as PropType<PostProps[]>,
      required: true
    }
  }
})
</script>

<style>

</style>