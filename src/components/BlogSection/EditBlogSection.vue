<script setup>
import {ref, reactive, onMounted} from "vue";
import {getBlog as getBlogAPI} from "@/api"
import {useRoute} from "vue-router";
import {updateBlog as updateBlogAPI} from "@/api"
import Toast from 'bootstrap/js/src/toast'

const route = useRoute()
const blog_id = route.params.blog_id
const text = reactive({
  blog_title: '',
  blog_content: '',
  toast_title: '系统消息',
  toast_message: ''
})
const updated_blog_title = ref('')
const updated_blog_content = ref('')
const isSubmitting = ref(false)

const getBlogById = async () => {
  try {
    const response = await getBlogAPI(blog_id)
    text.blog_title = response.data.title
    text.blog_content = response.data.content
    updated_blog_title.value = text.blog_title
    updated_blog_content.value = text.blog_content
  }catch(error) {
    console.error("getBlogById error:",error)
  }
}

const updateBlog = async () => {
  try {
    if (isSubmitting.value) return
    isSubmitting.value = true

    const updatedData = {
      title: updated_blog_title.value,
      content: updated_blog_content.value
    }
    const response = await updateBlogAPI(blog_id, updatedData)
    text.toast_message = response.data.message
    const toast = new Toast(document.getElementById('EditBlogMessageToast'))
    toast.show()
    document.getElementById('EditBlogMessageToast').addEventListener('hidden.bs.toast', () => {
      window.location.reload()
    })
    console.log("更新后返回的数据：", response.data)
  }catch (error) {
    console.log("error:", error)
    const toast = new Toast(document.getElementById('EditBlogMessageToast'))
    toast.show()
    document.getElementById('EditBlogMessageToast').addEventListener('hidden.bs.toast', () => {
      window.location.reload()
    })
  }finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  getBlogById();
})
</script>

<template>
  <div class="container my-5 p-2">
    <div class="row row-cols-2 justify-content-center my-5">
      <div class="col-12 col-md-8 border rounded bg-body-tertiary p-5" style="height: 100vh">
        <form @submit.prevent="updateBlog">
          <div class="row">
            <div class="col-12 my-5 text-center">
              <h3>修改你的博客</h3>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="form-floating mb-3">
                <input class="form-control edit-blog-title" type="text" id="blogTitle" v-model="updated_blog_title">
                <label for="blogTitle">修改后的博客标题</label>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="form-floating">
                <textarea class="form-control edit-blog-content" id="blogContent" style="height: 50vh" v-model="updated_blog_content"></textarea>
                <label for="blogContent">修改后的博客内容</label>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <button type="submit" class="btn btn-dark my-3 w-100" :disabled="isSubmitting">
                <span class="spinner-border spinner-border-sm" aria-hidden="true" v-if="isSubmitting"></span>
                <span v-else>更改</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="EditBlogMessageToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <img src="../../../public/snow.svg" class="rounded me-2" alt="...">
          <strong class="me-auto">{{ text.toast_title }}</strong>
          <small>11 mins ago</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{ text.toast_message }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-blog-title {
  font-family: Inter, sans-serif;
}

.edit-blog-content {
  font-family: Roboto, sans-serif;
}
</style>