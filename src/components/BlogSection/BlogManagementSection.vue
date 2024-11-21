<script setup>
import {ref, onMounted, reactive} from "vue";
import {getUserInfo as getUserInfoAPI, logoutUser as logoutUserAPI} from '@/api'
import {deleteBlogById as deleteBlogByIdAPI} from '@/api'
import {getBlogForManagement as getBlogForManagementAPI} from '@/api'
import Modal from 'bootstrap/js/src/modal'
import Toast from "bootstrap/js/dist/toast";
import {localStorageService} from "@/LocalStorageService";
import router from "@/router";

const text = reactive(
    {
      username: '',
      avatar_img_url: 'http://localhost:8000',
      about: '',
      blogTitle: '',
      blogBrief: '',
      blog_created_at: '',
      blog_updated_at: '',
      toast_title: '系统消息',
      toast_message: ''
    }
)

const blogs = ref({})
const selectedBlogId = ref(null)

const confirmDeleteBlog = (blogId) => {
  selectedBlogId.value = blogId;
  const modal = new Modal(document.getElementById("deleteBlogModal"))
  modal.show()
  document.getElementById('deleteBlogMessageToast').addEventListener('hidden.bs.toast', ()=> {
    window.location.reload();
  }, 3000)
  console.log("BlogId in Modal:", blogId)
}

const getUserInfo = async () => {
  try {
    const response = await getUserInfoAPI()
    console.log("UserInfo:", response.data)
    text.username = response.data.username
    text.avatar_img_url = text.avatar_img_url + response.data.profile.image
    text.about = response.data.profile.about
    console.log("avatar_img_url:", response.data.avatar_img_url)
  }catch (error){
    console.log("error:", error)
  }
}

const getPostsForManagement = async () => {
  try {
    const response = await getBlogForManagementAPI()
    console.log("PostsForManagement:", response.data)
    blogs.value = response.data
    console.log("blogs:", blogs.value)
  }catch (error){
    console.log("error:", error)
  }
}

const deleteBlogById = async () => {
  try {
    const response = await deleteBlogByIdAPI(selectedBlogId.value)
    console.log("选中的博客Id:", selectedBlogId.value)
    console.log("删除博客后的返回数据：", response.data.message)
    text.toast_message = response.data.message

    console.log("hint message:", text.toast_message)
    const toast = new Toast(document.getElementById('deleteBlogMessageToast'))
    toast.show()
  }catch (error) {
    console.log("error:", error)
    text.toast_message = error
    const toast = new Toast(document.getElementById('deleteBlogMessageToast'))
    toast.show()
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

function getFirstParagraph(content) {
  if (typeof content === "string" && content.trim() !== "") {
    return content.split("\n")[0];
  }
  return "";
}

const logout = async () => {
  try {
    const response = await logoutUserAPI();
    localStorageService.removeItem('auth_token')
    localStorageService.removeItem('user')
    localStorageService.removeItem('profile')
    localStorageService.removeItem('updatedUser')
    console.log("用户登出的返回消息：",response.data)
    text.toast_message = response.data.message
    const toast = new Toast(document.getElementById('deleteBlogMessageToast'))
    toast.show()
    document.getElementById('deleteBlogMessageToast').addEventListener('hidden.bs.toast', ()=>{
      if (router.currentRoute.value.path === '/'){
        window.location.reload();
      } else {
        router.push('/');
      }
    })
  } catch (error) {
    text.toast_message = error
    const toast = new Toast(document.getElementById('deleteBlogMessageToast'))
    toast.show()
    document.getElementById('deleteBlogMessageToast').addEventListener('hidden.bs.toast', ()=>{
      window.location.reload();
    })
    console.log("用户退出失败", error);
  }
}

onMounted( () => {
  getUserInfo();
  getPostsForManagement();
})

</script>

<template>
  <div class="container mt-5 p-3">
    <div class="row justify-content-center">
      <div class="col-12 col-md-3" style="height: auto">
        <div class="d-flex flex-row">
          <div class="bg-body-tertiary border rounded mt-3" style="width: 100%; height: auto">
            <div class="d-flex flex-row justify-content-center p-3">
              <div class="d-flex justify-content-center" style="width: 50%; height: auto">
                <img :src="text.avatar_img_url" class="img-fluid object-fit-cover rounded-circle border" style="width: 100px; height: 100px" alt="avatar img">
              </div>
            </div>
            <div class="d-flex flex-row justify-content-center p-3">
              <div>
                <h3 class="text-center" style="font-family: Futura PT Book, sans-serif">{{ text.username }}</h3>
                <p>{{ text.about }}</p>
              </div>
            </div>
            <div class="d-flex flex-column justify-content-center align-items-center p-3">
              <div>
                <router-link to="/author/edit" class="btn btn-dark me-5">
                  <i class="bi bi-clipboard2-minus me-2"></i>
                  编辑
                </router-link>
                <button class="btn btn-danger" @click="logout">
                  <i class="bi bi-person-down me-2"></i>
                  退出
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-7" style="height: auto">
        <div class="row">
          <div class="col-12 my-3" v-for="blog in blogs" :key="blog.id">
            <div class="border rounded blog bg-body-tertiary" style="height: auto; width: 100%">
              <div class="d-flex flex-column p-2">
                <router-link :to="`/blog/${blog.id}`" class="link-dark text-decoration-none">
                  <h3 class="ms-3 blog-title">{{ blog.title }}</h3>
                </router-link>

                <p class="ms-3 blog-content">{{ getFirstParagraph(blog.content) }}</p>
                <div class="d-flex flex-column text-end p-2">
                  <small>更新时间： {{ formatDateToYMDHMS(blog.updated_at) }}</small>
                  <small>发布时间： {{ formatDateToYMDHMS(blog.created_at) }}</small>
                </div>
                <div class="d-flex flex-row justify-content-end p-3">

                  <router-link :to="`/blog/edit/${blog.id}`" class="btn btn-dark me-3"><i class="bi bi-pen me-2"></i>编辑</router-link>
                  <router-link :to="`/blog/comment-management/${blog.id}`" class="btn btn-warning me-3"><i class="bi bi-chat-right-text me-2"></i>查看评论</router-link>
                  <button class="btn btn-danger" @click="confirmDeleteBlog(blog.id)"><i class="bi bi-x-circle me-2"></i>删除</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="deleteBlogModal" tabindex="-1" aria-labelledby="deleteBlogModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="deleteBlogModalLabel">系统消息</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                你确认要删掉此条博客吗？
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                <button type="button" class="btn btn-danger" @click="deleteBlogById" data-bs-dismiss="modal">确认删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="deleteBlogMessageToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
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
.blog-title {
  font-family: Inter, sans-serif;
}

.blog-content {
  font-family: Roboto, sans-serif;
}

/* 基本的 card 样式 */
.blog {
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 为 transform 和 box-shadow 设置动画 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 初始阴影 */
}

/* 鼠标悬停时的动画效果 */
.blog:hover {
  transform: scale(1.03); /* 放大 1.05 倍 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 增加阴影 */
}
</style>