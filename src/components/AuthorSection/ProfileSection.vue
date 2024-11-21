<script setup>
import {reactive, onMounted, ref, watchEffect} from "vue";
import LatestPostSection from "@/components/BlogSection/LatestPostSection.vue";
import {getUserById as getUserByIdAPI} from "@/api";
import {useRoute} from "vue-router";



const route = useRoute()
const user_id = route.params.id
const loading = ref(true)
const userData = ref({})

const text = reactive(
  {
    editProfileButton: '编辑个人资料',
    posts: '帖子',
    followers: '粉丝',
    following: '关注',
    aboutTitle: '关于',
    about: '你还没有填些你的介绍哦~',
    recentPostsTitle: '最近发布',
    showAll: '更多',
    username: 'Andy Horwitz',
    city: '请填写你所在的城市',
    post_count: 3,
    followers_count: 123,
    following_count: 22,
    avatarImg: 'http://localhost:8000'
  }
)

const getUserInfoById = async () => {
  try{
    console.log("请求的user_id是：", user_id)
    const response = await getUserByIdAPI(user_id)
    console.log("根据ID返回的用户信息",response.data)
    loading.value = false
    userData.value = response.data
    console.log("UserData:", userData.value)
    text.username = userData.value.username
    text.city = userData.value.profile.city
    text.avatarImg = text.avatarImg + userData.value.profile.image
    console.log('avatarImg', text.avatarImg)
    text.about = userData.value.profile.about

  }catch (error){
    console.log(error)
    loading.value = false
  }
}

watchEffect( () => {

})

onMounted(() => {
  getUserInfoById(user_id)

})

</script>

<template>
  <section class="h-100" style="background: #f0f0f0">
    <div class="container-fluid py-5 h-100 mt-5">
      <div class="row d-flex justify-content-center">
        <div class="col col-lg-9 col-xl-8">
          <div class="card">
            <div class="rounded-top text-white d-flex flex-row" style="background: #000; height: 200px">
              <div class="ms-4 mt-5 d-flex flex-column" style="width: 150px;">
                <img :src="text.avatarImg" alt="Profile Image" class="img-fluid img-thumbnail object-fit-cover mt-4 mb-2 avatar">
              </div>
              <div class="ms-3" style="margin-top: 130px">
                <h5 class="profile-name">{{ text.username }}</h5>
                <p class="profile-city">{{ text.city }}</p>
              </div>
            </div>
            <div class="p-4 text-black bg-body-tertiary">
              <div class="d-flex justify-content-end text-center py-1 text-body">
                <div class="px-3">
                  <p class="mb-1 h5">{{ text.posts }}</p>
                  <p class="small text-muted mb-0 lead">{{ text.post_count }}</p>
                </div>
                <div class="px-3">
                  <p class="mb-1 h5">{{ text.followers }}</p>
                  <p class="small text-muted mb-0 lead">{{ text.followers_count }}</p>
                </div>
                <div class="px-3">
                  <p class="mb-1 h5">{{ text.following }}</p>
                  <p class="small text-muted mb-0 lead">{{ text.following_count }}</p>
                </div>
              </div>
            </div>
            <div class="card-body p-4 text-black">
              <div class="mb-5 text-body">
                <p class="lead fw-normal mb-1">{{ text.aboutTitle }}</p>
                <div class="p-4 bg-body-tertiary">
                  <p class="mb-1 profile-about">{{ text.about }}</p>
                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-4 text-body">
                <p class="lead fw-normal mb-0">{{ text.recentPostsTitle }}</p>
                <p class="mb-0"><a href="#" class="text-muted text-decoration-none">{{ text.showAll }}</a></p>
              </div>
              <div class="row justify-content-center">
                <div class="col-12">
                  <LatestPostSection :user_id="user_id"/>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.avatar {
  width: 150px;
  height: 150px;
  z-index: 1;
}

.profile-name {
  font-family: Futura PT Book,sans-serif;
}

.profile-city {
  font-family: "Noto Sans SC", sans-serif;
}

.profile-about {
  font-family: Roboto, sans-serif;
}
</style>