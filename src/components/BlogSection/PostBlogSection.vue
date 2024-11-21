<script setup>
import {ref, reactive} from 'vue'
import {postBlog as postBlogAPI} from '@/api'
import Toast from "bootstrap/js/dist/toast"

const blogTitle = ref('')
const blogContent = ref('')
// const blogTags = ref('')
const isSubmitting = ref(false)
const text = reactive({
  postBlogPage: {
    toastTitle: '系统消息'
  }
})
const toastMessage = ref('')

const postBlogRequest = async() => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const response = await postBlogAPI({
      title: blogTitle.value,
      content: blogContent.value,
    });
    console.log('Response:', response)
    toastMessage.value = response.data.message
    console.log('ToastMessage:', toastMessage.value)
    const toast = new Toast(document.getElementById('postBlogMessageToast'))
    toast.show()
  }catch (error) {
    toastMessage.value = error.response.data.error
    const toast = new Toast(document.getElementById('postBlogMessageToast'))
    toast.show()
  }finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="container">
    <div class="row mt-5 p-5 justify-content-center">

      <div class="col-12 col-md-8 border rounded bg-body-tertiary p-5" style="height: auto">
        <h3 class="text-center my-5 px-5">发布博客</h3>
        <form @submit.prevent="postBlogRequest">
          <input type="text" class="form-control mt-3 post-blog-title" placeholder="输入博客标题" v-model="blogTitle" required>
          <textarea class="form-control mt-3 post-blog-content" rows="5" placeholder="请输入内容" v-model="blogContent" required style="height: 40vh"></textarea>
          <input type="text" class="form-control mt-3" placeholder="输入标签，用逗号分隔">
          <button type="submit" class="btn btn-dark mt-3 w-100" :disabled="isSubmitting" id="PostBlogBtn">
            <span class="spinner-border spinner-border-sm" aria-hidden="true" v-if="isSubmitting"></span>
            <span v-else>发布</span>
          </button>
        </form>
      </div>
      <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="postBlogMessageToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
            <img src="../../../public/snow.svg" class="rounded me-2" alt="...">
            <strong class="me-auto">{{ text.postBlogPage.toastTitle }}</strong>
            <small>11 mins ago</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            {{ toastMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-blog-title {
  font-family: Inter, sans-serif;
}

.post-blog-content {
  font-family: Roboto, sans-serif;
}
</style>