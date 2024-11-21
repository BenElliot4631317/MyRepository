<script setup>
import {ref, onMounted, reactive, computed, watch} from "vue";
import {browseBlogs as browseBlogsAPI} from "@/api";
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()
const status = ref(true)
const blogCount = ref(0)
const blogs = ref({posts: [], total_pages: 0, current_page: 0})
const text = reactive({
  blogTitle: '',
  blogContent: '',
  blogId: 0,
  author_avatar: 'http://localhost:8000',
  post_id: '',
  current_page: 1,
  total_page: 0,
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("zh-CN")
}

const getBrowseBlogsResponse = async (page = 1) => {
  console.log("调用 getBrowseBlogsResponse 的页码：", page)
  try {
    const response = await browseBlogsAPI(page);
    blogCount.value = response.data.posts.length
    blogs.value = response.data.posts
    text.current_page = response.data.current_page
    text.total_page = response.data.total_pages
    console.log("Response:", response.data);
    console.log("BlogCount:", blogCount.value)
    console.log("Blogs:", blogs.value)
    console.log("Current Page:", text.current_page)
    console.log("Total Page:", text.total_page)
    console.log(text.blogTitle)
    status.value = false
  }catch (error) {
    console.log(error)
    status.value = true
  }
}

const pages = computed( () => {
  return Array.from( {length: text.total_page}, (_, i) => i + 1)
})

const changePage = (page) => {
  if (page > 0 && page <= text.total_page && page !== text.current_page) {
    router.push({
      path: "/browse",
      query: { page: page.toString() }
    });
  }
}

watch(
    () => route.query.page,
    (newPage) => {
      const page = parseInt(newPage, 10) || 1;
      console.log("Watching page:", page)
      getBrowseBlogsResponse(page);
    },
    {
      immediate: true
    }
);

onMounted( ()=> {
  const page = parseInt(route.query.page) || 1;
  getBrowseBlogsResponse(page);

})
</script>

<template>
  <div class="container mt-5 p-3 mb-2">
    <div class="row justify-content-center">
      <div class="col-12 col-md-7" style="height: auto">
        <div class="row justify-content-center p-2" v-for="blog in blogs" :key="blog.id">
          <div class="col-11 rounded border bg-body-tertiary post" style="height: auto">
            <div class="d-flex flex-column mb-3">
              <h5 class="mt-2 blog-title text-truncate" :class="{'placeholder placeholder-wave':status}">{{ blog.title }}</h5>
              <p :class="{'placeholder placeholder-wave':status}" class="text-truncate blog-content">{{ blog.content }}</p>
              <div class="mb-2">
                <router-link :to="`/blog/${blog.id}`" class="link-dark link-offset-2 expand" :class="{'placeholder placeholder-wave':status}">展开</router-link>
              </div>
              <div class="d-flex flex-row align-items-center justify-content-end mb-2">
                <router-link :to="`/author/${blog.author}`">
                  <img class="img-fluid rounded-circle object-fit-cover border m-0" :src="text.author_avatar + blog.author_avatar" style="width: 50px; height: 50px" alt="avatar img" :class="{'placeholder placeholder-wave':status}">
                </router-link>
              </div>
              <div class="d-flex flex-row align-items-center justify-content-end mb-2">
                <router-link :to="`/author/${blog.author}`" class="text-decoration-none link-dark">
                  <p class="m-0 blog-author" :class="{'placeholder placeholder-wave':status}">{{ blog.author_name }}</p>
                </router-link>
              </div>
              <div class="d-flex flex-row align-items-center justify-content-end">
                <p class="m-0" :class="{'placeholder placeholder-wave':status}"><i class="bi bi-clock pe-2"></i>{{
                    formatDate(blog.created_at)
                  }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center p-3">
      <div class="col-4" style="height: auto;">
        <div class="d-flex flex-column align-items-center">
          <nav aria-label="Page navigation example">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: text.current_page === 1 }">
                <router-link class="page-link" :to="{ path: '/browse', query: {page: text.current_page - 1} }" aria-label="Previous" @click.prevent="changePage(text.current_page - 1)">
                  <span aria-hidden="true">&laquo;</span>
                </router-link>
              </li>
              <li class="page-item" v-for="page in pages" :key="page" :class="['page-item', {active: page === text.current_page}]">
                <router-link class="page-link" :to="{ path: '/browse', query: { page } }" @click.prevent="changePage(page)">{{ page }}
                </router-link>
              </li>
              <li class="page-item" :class="{ disabled: text.current_page === text.total_page }">
                <router-link class="page-link" :to="{ path: '/browse', query: {page: text.current_page + 1} }" aria-label="Next" @click.prevent="changePage(text.current_page + 1)">
                  <span aria-hidden="true">&raquo;</span>
                </router-link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 基本的 card 样式 */
.post {
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 为 transform 和 box-shadow 设置动画 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 初始阴影 */
}

/* 鼠标悬停时的动画效果 */
.post:hover {
  transform: scale(1.03); /* 放大 1.05 倍 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 增加阴影 */
}

.blog-title {
  font-family: Inter,sans-serif;
}

.blog-content {
  font-family: Roboto,sans-serif;
}

.blog-author {
  font-family: Futura PT Book,sans-serif;
}

.blog-author:lang(zh) {
  font-family: 'Noto Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.expand {
  font-family: 'PingFang SC',sans-serif;
}
</style>