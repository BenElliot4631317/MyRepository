<script setup>
import {onMounted, reactive, ref, watchEffect} from "vue";
import {getBlog as getBlogAPI} from "@/api";
import {addComment as addCommentAPI} from "@/api"
import {getUserInfo as getUserInfoAPI} from "@/api"
import {getCommentsById as getCommentsByIdAPI} from "@/api"
import {LikePost as LikePostAPI} from "@/api"
import {getLikeStatus as getLikeStatusAPI} from "@/api"
import {useRoute} from "vue-router";

const route = useRoute(null)
const commentText = ref('')
const comments = ref({})


const text = reactive({
  blogTitle: '',
  blogContent: '',
  author: '',
  avatar_img_url: '',
  created_at: '',
  author_id: '',
  user_avatar_img_url : 'http://localhost:8000',
  comment_avatar_img_url: 'http://localhost:8000',
  comment_content: '',
  comment_created_at: ''
})

const isLiked = ref(false)

const toggleLike = () => {
  isLiked.value = !isLiked.value
  likePost();
  console.log(isLiked.value)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("zh-CN")
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

const status = ref(true)

const getBlogResponse = async () => {
  try {
    const post_id = route.params.post_id
    const response = await getBlogAPI(post_id);
    text.blogTitle = response.data.title
    text.blogContent = response.data.content
    text.author = response.data.author_name
    text.avatar_img_url = 'http://localhost:8000' + response.data.author_profile_image
    text.created_at = formatDate(response.data.created_at)
    text.author_id = response.data.author
    status.value = false
    console.log('Response:', response.data);
    console.log('Avatar_URL:', text.avatar_img_url)
  }catch (error) {
    console.log(error.data)
    status.value = true
  }
}

const getUserInfo = async () => {
  try {
    const response = await getUserInfoAPI()
    text.user_avatar_img_url = text.user_avatar_img_url + response.data.profile.image
    console.log("UserInfo:", response.data)
  }catch (error) {
    console.log(error)
  }
}

const addComment =async () => {
  try {
    const comment = {
      content: commentText.value
    }
    const post_id = route.params.post_id
    console.log("comment", comment.content)
    const response = await addCommentAPI(post_id, comment)
    console.log("response:", response.data.message)
    window.location.reload()
  }catch (error) {
    console.log(error)
  }
}

const get_comments_by_id = async () => {
  try {
    const post_id = route.params.post_id
    const response = await getCommentsByIdAPI(post_id)
    comments.value = response.data
    console.log("comments:", comments.value)
    console.log("response", response.data)
  }catch (e) {
    console.log(e)
  }
}

const likePost = async () => {
  try {
    const post_id = route.params.post_id
    const response = await LikePostAPI(post_id)
    console.log("Response:", response.data)
  }catch (error) {
    console.log(error)
  }
}

const getLikeStatus = async () => {
  try {
    const post_id = route.params.post_id
    const response = await getLikeStatusAPI(post_id)
    isLiked.value = response.data.is_liked
    console.log("isLiked Value:", isLiked.value)
    console.log("liked status response:", response.data)
  }catch (error) {
    console.log(error)
  }
}

watchEffect( () => {

})

onMounted(()=> {
  getBlogResponse();
  getUserInfo();
  get_comments_by_id();
  getLikeStatus();
})
</script>

<template>
  <div class="row justify-content-center mt-5">
    <div class="col-12 col-md-8 rounded border my-5 bg-body-tertiary" style="height: auto">
      <div class="row justify-content-center mt-5">
        <div class="col-8">
          <h2 class="m-0" :class="{'placeholder placeholder-wave': status}" style="font-family: Inter,sans-serif">{{ text.blogTitle }}</h2>
        </div>
      </div>
      <div class="row justify-content-center mt-3">
        <div class="col-8">
          <div class="d-flex justify-content-evenly align-items-center">
            <router-link :to="`/author/${text.author_id}`">
              <img alt="avatar img" :src="text.avatar_img_url" class="img-fluid rounded-circle border object-fit-cover" :class="{'placeholder placeholder-wave': status}" style="width: 50px; height: 50px;">
            </router-link>
            <router-link :to="`/author/${text.author_id}`" class="text-decoration-none link-dark">
              <p class="m-0" :class="{'placeholder placeholder-wave': status}" style="font-family: Futura PT Book,sans-serif">{{ text.author }}</p>
            </router-link>
            <small :class="{'placeholder placeholder-wave': status}"><i class="bi bi-clock pe-2"></i>{{ text.created_at }}</small>
          </div>
        </div>
      </div>
      <div class="row justify-content-center mt-3">
        <div class="col-8">
          <p :class="{'placeholder placeholder-wave': status}" style="white-space: pre-line; font-family: Roboto,sans-serif;">
            {{ text.blogContent }}
          </p>
        </div>
      </div>
      <div class="row justify-content-center mt-3">
        <div class="col-8">
          <hr>
          <div class="d-flex">
            <transition name="heart-animation" mode="out-in">
              <i :class="[
                  isLiked ? 'bi-heart-fill liked' : 'bi-heart',
                  'fs-3 icon-pointer p-1 heart-animation-press'
                  ]"
                 @click="toggleLike"
                 :key="isLiked"
                 style="position: relative"
              ></i>
            </transition>
            <i class="bi bi-chat fs-3 ms-3 icon-pointer"></i>
          </div>
        </div>
      </div>
      <div class="row justify-content-center mt-3">
        <div class="col-8">
          <div class="d-flex flex-column">
            <h5>评论</h5>
            <form @submit.prevent="addComment">
              <div class="d-flex flex-row">
                <div style="width: 100px; height: 100px">
                  <img :src="text.user_avatar_img_url" class="rounded border img-fluid object-fit-cover" style="width: 60px; height: 60px" alt="avatar img">
                </div>
                  <textarea class="form-control mb-3 comment-font ms-2" placeholder="请友善地评论哦~" v-model="commentText" style="height: 150px"></textarea>
              </div>

              <button class="btn btn-dark w-100" type="submit">发表评论</button>
            </form>
          </div>
        </div>
      </div>
      <div class="row justify-content-center mt-3">
        <div class="col-8">
          <h5 class="mb-3">看看其他人对这条博客的评论</h5>
        </div>
      </div>
      <div class="row justify-content-center mt-3">
        <div class="col-8" v-if="Object.keys(comments).length === 0">
          <h5 class="text-center lead">暂无评论，快来评论吧~</h5>
        </div>
      </div>
      <div class="row justify-content-center mt-3">
        <div class="col-8" v-for="comment in comments" :key="comment.id">
          <div class="d-flex flex-row mb-3">
            <div style="width: 100px; height: 100px">
              <img :src="text.comment_avatar_img_url + comment.user_avatar"
                   class="img-fluid object-fit-cover rounded border" style="width: 60px; height: 60px;"
                   alt="avatar img">
            </div>
            <div class="comment-section rounded d-flex flex-column bg-body-secondary p-3 ms-2" style="width: 100%; height: auto">
              <p :class="{'placeholder placeholder-wave': status}" style="white-space: pre-line; font-family: Roboto,sans-serif;">
                {{ comment.content }}</p>
            </div>
          </div>
          <div class="d-flex flex-row justify-content-end">
            <p class="mb-1" style="font-family: Futura PT Book,sans-serif">{{ comment.user_name }}</p>
          </div>
          <div class="d-flex flex-row justify-content-end align-items-center mb-2">
            <small><i class="bi bi-clock pe-2"></i>{{ formatDateToYMDHMS(comment.created_at) }}</small>
          </div>
          <div class="d-flex flex-row justify-content-end">
            <a href="#" class="btn mb-3">
              回复TA
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-pointer {
  cursor: pointer;
}

.liked {
  color: red;
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

.comment-font {
  font-family: Roboto, sans-serif;
}
</style>