<script setup>
import router from "@/router";
import {localStorageService} from "@/LocalStorageService";
import {onMounted, reactive, ref, computed, defineProps, watchEffect} from "vue"
import {logoutUser as logoutUserAPI} from "@/api";
import {getUserInfo as getUserInfoAPI} from "@/api"
import Toast from "bootstrap/js/dist/toast";

// const store = useStore();

const key = 'auth_token'
const tokenData = localStorageService.getItem(key)
const userData = ref(JSON.parse(localStorageService.getItem('user'))) || defaultUserData
const userInfo = ref({})
const user_id = ref('')

const defaultUserData = {
  username: '访客',
  first_name: '',
  last_name: '',
  email: ''
}

const logout = async () => {
  try {
    const response = await logoutUserAPI();
    localStorageService.removeItem(key)
    localStorageService.removeItem('user')
    localStorageService.removeItem('profile')
    localStorageService.removeItem('updatedUser')
    console.log("用户登出的返回消息：",response.data)

    const toast = new Toast(document.getElementById('logoutToast'))
    toast.show()
    document.getElementById('logoutToast').addEventListener('hidden.bs.toast', ()=>{
      if (router.currentRoute.value.path === '/'){
        window.location.reload();
      } else {
        router.push('/');
      }
    })
  } catch (error) {
    console.log("用户退出失败", error);
  }
}

const getUserInfo = async () => {
  try {
    const response = await getUserInfoAPI()
    userInfo.value = response.data
    user_id.value = userInfo.value.id
  }catch (error) {
    console.log(error)
  }
}

const textContent = reactive(
    {
      homepage: {
        navbar_brand: '',
        navbar_item1: '首页',
        navbar_item2: '浏览',
        btnLogInCN: '登录',
        btnSignUpCN: '注册',
        navbar_dropdownCN: '博客',
        dropdownItems1: '发布',
        dropdownItems2: '标签',
        dropdownItems3: '管理',
        userNameDropdown: '用户名',
        avatarDropdownItem1: '个人资料',
        avatarDropdownItem2: '编辑个人资料',
        avatarDropdownItem3: '退出',
        logoutToastTitle: '系统消息',
        logoutToastContent: '您已经成功退出'
      }
    }
)

const props = defineProps({
  profile: {
    type: Object,
    default: () => {
      const storedProfile = localStorageService.getItem('profile');
      let userAvatar = null;

      // 确保 storedProfile 不为 null，且解析后包含 image 属性
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        userAvatar = parsedProfile && parsedProfile.image ? parsedProfile.image : null;
      }
      return {
        image: userAvatar ? userAvatar : 'http://localhost:8000/profile_image/default_avatar.jpg'
      };
    }
  }
})

const profileImageUrl = computed(() => {
  const profileImage = props.profile.image
  if (profileImage && profileImage.startsWith('http')) {
    return profileImage
  }
  return props.profile.image ? `http://localhost:8000${props.profile.image}` : JSON.parse(localStorageService.getItem('profile')).image
})

watchEffect( () => {
  const updatedUserInfo = JSON.parse(localStorageService.getItem('updatedUser'))
  if (updatedUserInfo && updatedUserInfo.profile.image) {
    // eslint-disable-next-line vue/no-mutating-props
    props.profile.image = updatedUserInfo.profile.image
  }
})

onMounted( () => {

  if (userData.value && userData.value.username) {
    textContent.homepage.userNameDropdown = userData.value.username;
  }

  const updatedUser = JSON.parse(localStorageService.getItem('updatedUser')) || null;

  if (updatedUser) {
    textContent.homepage.userNameDropdown = updatedUser.user.username
  }
  getUserInfo()

})
</script>

<template>
  <nav class="navbar navbar-expand-lg fixed-top bg-body-tertiary shadow p-0">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        <img src="../../public/icon-image/897241_article_blog_blogging_compose_write_icon.svg" width="48" height="48">
        {{ textContent.homepage.navbar_brand }}
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link">{{ textContent.homepage.navbar_item1 }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/browse">{{ textContent.homepage.navbar_item2 }}</router-link>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ textContent.homepage.navbar_dropdownCN }}
            </a>
            <ul class="dropdown-menu">
              <li><router-link to="/author/post" class="dropdown-item"><i class="bi bi-pen me-2"></i>{{ textContent.homepage.dropdownItems1 }}</router-link></li>
              <li><a class="dropdown-item" href="#"><i class="bi bi-bookmark me-2"></i>{{ textContent.homepage.dropdownItems2 }}</a></li>
              <li><router-link class="dropdown-item" to="/management"><i class="bi bi-clipboard2 me-2"></i>{{ textContent.homepage.dropdownItems3 }}</router-link></li>
            </ul>
          </li>
        </ul>

        <div v-if="tokenData" class="navbar-nav ms-auto">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle d-flex align-items-center avatar-username" href="#" id="avatarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img :src="profileImageUrl" alt="avatar" class="border rounded-circle me-2" width="40px" height="40px" style="object-fit: cover; aspect-ratio: 1 / 1">
              {{ textContent.homepage.userNameDropdown }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="avatarDropdown">
              <li><router-link class="dropdown-item" :to="`/author/${user_id}`"><i class="bi bi-person-rolodex me-2"></i>{{ textContent.homepage.avatarDropdownItem1 }}</router-link></li>
              <li><router-link class="dropdown-item" to="/author/edit"><i class="bi bi-person-vcard me-2"></i>{{ textContent.homepage.avatarDropdownItem2 }}</router-link></li>
              <li><a class="dropdown-item" href="#" @click="logout" id="logoutLink"><i class="bi bi-person-down me-2"></i>{{ textContent.homepage.avatarDropdownItem3 }}</a></li>
            </ul>
          </li>
        </div>

        <div v-else class="p-2">
          <router-link to="/signup" type="button" class="btn btn-dark mx-2">{{ textContent.homepage.btnSignUpCN }}</router-link>
          <router-link to="/login" type="button" class="btn btn-light">{{ textContent.homepage.btnLogInCN }}</router-link>
        </div>
      </div>

      <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="logoutToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
            <img src="../../public/snow.svg" class="rounded me-2" alt="...">
            <strong class="me-auto">{{ textContent.homepage.logoutToastTitle }}</strong>
            <small>11 mins ago</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            {{ textContent.homepage.logoutToastContent }}
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.avatar-username{
  font-family: Futura PT Book,sans-serif;
}

.nav-item {
  font-family: 'Noto Sans SC', sans-serif;
}
</style>