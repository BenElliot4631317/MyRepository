<script setup>
import {ref, onMounted, defineProps} from "vue";
import {getRecentPost as getRecentPostAPI} from "@/api"

const blogs = ref({})
const user_id = defineProps({
  user_id: {
    type: String,
    required: true,
  }
})

const get_recent_posts = async () => {
  try {
    const response = await getRecentPostAPI(user_id.user_id)
    blogs.value = response.data
    console.log("blogs:", blogs.value)
    console.log("get_recent_posts", response)
  }catch (error) {
    console.log(error)
  }
}

function formatDateToYMDHMS(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("zh-CN", {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  })
}

onMounted(() => {
  console.log("user_id的值为：",user_id)
  get_recent_posts();
})

</script>

<template>
  <div class="d-flex flex-column bg-body-tertiary p-3" v-for="blog in blogs" :key="blog.id">
    <h4 class="brief_title">{{ blog.title }}</h4>
    <p class="text-truncate brief_content">{{ blog.content }} </p>
    <router-link :to="`/blog/${blog.id}`" class="link-offset-2 link-dark">展开</router-link>
    <small class="text-end"><i class="bi bi-clock me-2"></i>{{ formatDateToYMDHMS(blog.created_at) }}</small>
    <hr>
  </div>
</template>

<style scoped>
.brief_title {
  font-family: Inter, sans-serif;
}

.brief_content {
  font-family: Roboto, sans-serif;
}
</style>