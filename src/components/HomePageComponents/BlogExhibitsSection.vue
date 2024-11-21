<script setup>
import {ref} from "vue";
import {onMounted, reactive} from "vue";
import {blogExhibition as blogExhibitionAPI, getLikeStatus as getLikeStatusAPI, LikePost as LikePostAPI} from '@/api.js'

const text = reactive(
    {
      blogAuthor: '',
      blogTitle: '',
      blogContent: '',
      post_id: 0,
      author_avatar: 'http://localhost:8000',
    }
)


const status = ref(true)
const blogs = ref({posts: []})

const blogExhibition = async () => {
  try{
    const response = await blogExhibitionAPI()
    console.log("返回的数据：", response.data)
    blogs.value = response.data.posts.map(blog => ({
      ...blog,
      isLiked: false
    }))
    console.log("blogs里的数据：", blogs.value)
    for (const blog of blogs.value) {
      await getLikeStatus(blog.id, blog)
    }
    status.value = false
  }catch(error) {
    console.log(error)
    status.value = true
  }
}

const toggleLike = async (post_id) => {
  const blog = blogs.value.find(blog => blog.id === post_id)
  if (blog) {
    blog.isLiked = !blog.isLiked
  }
  try {
    await likePost(post_id);
    console.log(`博客的${post_id}的新点赞状态：`, blog.isLiked)
  }catch (error) {
    console.log("点赞失败", error)
    if (blog) {
      blog.isLiked = !blog.isLiked
    }
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("zh-CN")
}

function getFirstParagraph(content) {
  if (typeof content === "string" && content.trim() !== "") {
    return content.split("\n")[0];
  }
  return "";
}

const likePost = async (post_id) => {
  try {
    const response = await LikePostAPI(post_id)
    console.log("Response:", response.data)
  }catch (error) {
    console.log(error)
  }
}

const getLikeStatus = async (post_id, blog) => {
  try {
    const response = await getLikeStatusAPI(post_id)
    if (blog) {
      blog.isLiked = response.data.is_liked
    }
    console.log("isLiked Value:", blog.isLiked)
    console.log("liked status response:", response.data)
  }catch (error) {
    console.log(error)
  }
}

onMounted( () => {
  blogExhibition();
  getLikeStatus();
})
</script>

<template>
  <div class="m-3">
    <div class="row row-cols-md-4 row-cols-1 justify-content-center">
      <div class="col-12 col-md-6 my-3" v-for="blog in blogs" :key="blog.id">
        <div class="card h-100 bg-body-tertiary">
          <div class="card-header">
            <div class=" d-flex flex-row align-items-center">
              <div class="d-flex justify-content-center align-items-center" style="height: 100%">
                <router-link :to="`/author/${blog.author}`">
                  <img :src="text.author_avatar + blog.author_avatar" class="img-fluid rounded-circle border object-fit-cover border" height="50px" width="50px" alt="avatar" style="aspect-ratio: 1 / 1"  :class="{'placeholder placeholder-wave':status}">
                </router-link>
              </div>

              <p class="card-title ms-3 my-0" :class="{'placeholder placeholder-wave':status}">
                <router-link :to="`/author/${blog.author}`" class="text-decoration-none link-dark blog-author">{{ blog.author_name }}
                </router-link>
              </p>
            </div>
          </div>
          <div class="card-body">
            <router-link :to="`/blog/${blog.id}`" class="text-decoration-none link-dark">
              <h3 class="text-truncate blog-brief" :class="{'placeholder placeholder-wave':status}">{{ blog.title }}</h3>
            </router-link>
            <p class="card-text blog-brief" :class="{'placeholder placeholder-wave':status}">{{ getFirstParagraph(blog.content) }}</p>
            <p class="card-text blog-brief">...</p>
            <hr>
            <div class="d-flex flex-row">
              <transition name="heart-animation" mode="out-in">
                <i
                    :key="blog.isLiked"
                    :class="[blog.isLiked ? 'bi-heart-fill liked' : 'bi-heart', 'fs-3 icon-cursor me-3 p-1 heart-animation-press']"
                    @click="toggleLike(blog.id)"
                    style="position: relative"
                ></i>
              </transition>
              <i class="bi bi-chat fs-3 icon-cursor p-1"></i>
            </div>
          </div>
          <div class="card-footer text-end">
            <p class="card-text">
              <i class="bi bi-clock pe-2"></i>
              <small :class="{'placeholder placeholder-wave':status}">{{ formatDate(blog.created_at) }}
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-cursor {
  cursor: pointer;
}

.heart-animation-enter-active, .heart-animation-leave-active {
  transition: transform 0.3s ease, opacity 0.2s ease;
}

.heart-animation-enter-from, .heart-animation-leave-to {
  transform: scale(80%);
  opacity: 50%;
}

.heart-animation-enter-to, .heart-animation-leave-from {
  transform: scale(1);
  opacity: 1;
}

.heart-animation-press {
  transition: transform 0.1s ease;
}

.heart-animation-press:active {
  transform: scale(0.85);
}

.liked {
  color: red;
}

/* 基本的 card 样式 */
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 为 transform 和 box-shadow 设置动画 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 初始阴影 */
}

/* 鼠标悬停时的动画效果 */
.card:hover {
  transform: scale(1.03); /* 放大 1.05 倍 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 增加阴影 */
}

.card-title {
  font-family: Inter,sans-serif;
}

.blog-author {
  font-family: Futura PT Book,sans-serif;
}

.blog-brief {
  font-family: Roboto,sans-serif;
}
</style>