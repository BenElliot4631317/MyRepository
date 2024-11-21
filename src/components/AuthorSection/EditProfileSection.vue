<script setup>
import {ref, reactive, watchEffect} from 'vue'
import {updateUser as updateUserAPI} from "@/api";
import {getUserInfo as getUserInfoAPI} from "@/api";
import {useStore} from "vuex";
import {onMounted} from "vue";
import {localStorageService} from "@/LocalStorageService";
import Toast from "bootstrap/js/dist/toast";

const username = ref('')
const firstName = ref('')
const lastName = ref('')
const city = ref('')
const email = ref('')
const about = ref('')
const isSubmitting = ref(false)
const selectedFile = ref(null)

const store = useStore()

const textContentCN = reactive(
    {
      EditProfile: {
        avatarHeader: '个人页头像',
        avatarImageHint: 'JPG或者PNG，不超过5MB',
        avatarUploadBtn: '上传头像',
        accountDetails: '账号详情',
        usernameInput: '用户名',
        firstNameInput: '名',
        lastNameInput: '姓',
        CityInput: '城市',
        EmailInput: '电子邮箱',
        AboutInput: '介绍',
        UpdateBtnInput: '更改',
        usernamePlaceholder: '请输入你的用户名',
        firstnamePlaceholder: '请输入你的名',
        lastnamePlaceholder: '请输入你的姓',
        cityPlaceholder: '请输入你的城市',
        emailPlaceholder: '请输入你的电子邮箱地址',
        aboutPlaceholder: '向大家介绍一下自己吧！',
        toastTitle: '系统消息',
        toastMessage: '',
        defaultUsername: '',
        defaultFirstname: '',
        defaultLastname: '',
        defaultCity: '',
        defaultEmail: '',
        defaultDescription: ''
      }
    }
)

watchEffect(() => {

})

const submitForm = async () => {

  if (isSubmitting.value) return

  isSubmitting.value = true
  const requestData = new FormData();

  if (username.value) requestData.append('username', username.value);
  if (firstName.value) requestData.append('first_name', firstName.value);
  if (lastName.value) requestData.append('last_name', lastName.value);
  if (city.value) requestData.append('city', city.value);
  if (email.value) requestData.append('email', email.value);
  if (about.value) requestData.append('about', about.value);
  if (selectedFile.value) requestData.append('image', selectedFile.value)


  try {
    for (let pair of requestData.entries()) {
      console.log(pair[0] + ',' + pair[1])
    }

    const response = await updateUserAPI(requestData);
    textContentCN.EditProfile.toastMessage = response.data.message
    const toastBody = document.querySelector('.toast-body')
    const toast = new Toast(document.getElementById('updatedUserInfoToast'))
    toast.show()
    console.log(response.data.message)
    console.log(response.data)
    // alert(response.data.message)
    store.dispatch('updateUser', response.data.updatedUser)
    localStorageService.setItem('updatedUser', JSON.stringify(response.data.updatedUser))
    console.log('toastMessage:', textContentCN.EditProfile.toastMessage)
    console.log('toastBody:', toastBody.textContent)
    document.getElementById('updatedUserInfoToast').addEventListener('hidden.bs.toast', () => {
      window.location.reload()
    })
  }catch (error) {
    // alert(error.response.data.error)
    console.log(error.response.data.error)
    textContentCN.EditProfile.toastMessage = error.response.data.error
    const toast = new Toast(document.getElementById('updatedUserInfoToast'))
    toast.show()
    document.getElementById('updatedUserInfoToast').addEventListener('hidden.bs.toast', ()=> {
      window.location.href = 'http://localhost:8080/login'
    })
  }finally {
    isSubmitting.value = false
  }
}

const getUserInfo = async () => {
  try{
    const response = await getUserInfoAPI()
    console.log(response.data)
    textContentCN.EditProfile.defaultUsername = response.data.username
    textContentCN.EditProfile.defaultFirstname = response.data.first_name
    textContentCN.EditProfile.defaultLastname = response.data.last_name
    textContentCN.EditProfile.defaultCity = response.data.profile.city
    textContentCN.EditProfile.defaultEmail = response.data.email
    textContentCN.EditProfile.defaultDescription = response.data.profile.about
  } catch (error) {
    console.log(error)
  }
}

const updatedUserInfo = JSON.parse(localStorageService.getItem('updatedUser'));

const defaultImage = (updatedUserInfo && updatedUserInfo.profile && updatedUserInfo.profile.image)
    ?`http://localhost:8000${updatedUserInfo.profile.image}`
    : `http://localhost:8000${JSON.parse(localStorageService.getItem('profile')).image}`
const fileInput = ref(null);
const uploadedImageUrl = ref(defaultImage)

const triggerFileUpload = () => {
  fileInput.value.click();
}

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImageUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
    console.log('selected file:', file);
  }
}

onMounted( () => {
  getUserInfo();
  console.log("default Img url:", localStorageService.getItem('profile'))
})
</script>

<template>
  <div class="container-fluid px-4 mt-4">
    <div class="row mt-5 justify-content-center">
      <div class="col-xl-4 col-md-4 col-xxl-4 mt-5">
        <div class="card mb-4 mb-xl-0">
          <div class="card-header">{{ textContentCN.EditProfile.avatarHeader }}</div>
          <div class="card-body text-center">
            <img :src="uploadedImageUrl || defaultImage" alt="profile picture" class="mb-2" style="height: 10rem;">
            <div class="small text-muted mb-4">{{ textContentCN.EditProfile.avatarImageHint }}</div>
            <button class="btn btn-dark text-white" type="button" @click="triggerFileUpload">{{ textContentCN.EditProfile.avatarUploadBtn }}</button>
            <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none">
          </div>
        </div>
      </div>
      <div class="col-xl-8 col-md-6 col-xxl-6 mt-5">
        <div class="card mb-4">
          <div class="card-header">{{textContentCN.EditProfile.accountDetails}}</div>
          <div class="card-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label class="small mb-1" for="inputUsername">{{ textContentCN.EditProfile.usernameInput }}</label>
                <input class="form-control" type="text" id="inputUsername" v-model="username" :placeholder="textContentCN.EditProfile.defaultUsername">
              </div>
              <div class="row gx-3 mb-3">
                <div class="col-md-6">
                  <label class="small mb-1" for="inputFirstName">{{ textContentCN.EditProfile.firstNameInput }}</label>
                  <input class="form-control" id="inputFirstName" type="text" v-model="firstName" :placeholder="textContentCN.EditProfile.defaultFirstname">
                </div>
                <div class="col-md-6">
                  <label class="small mb-1" for="inputLastName">{{ textContentCN.EditProfile.lastNameInput }}</label>
                  <input class="form-control" id="inputLastName" type="text" v-model="lastName" :placeholder="textContentCN.EditProfile.defaultLastname">
                </div>
              </div>
              <div class="row gx-3 mb-3">
                <div class="col-md-6">
                  <label class="small mb-1" for="inputCity">{{ textContentCN.EditProfile.CityInput }}</label>
                  <input class="form-control" id="inputCity" type="text" list="cityDatalist" v-model="city" :placeholder="textContentCN.EditProfile.defaultCity">
                  <datalist id="cityDatalist">
                    <option value="London"></option>
                    <option value="New York"></option>
                    <option value="Los Angeles"></option>
                  </datalist>
                </div>
                <div class="col-md-6">
                  <label class="small mb-1" for="inputEmail">{{ textContentCN.EditProfile.EmailInput }}</label>
                  <input class="form-control" id="inputEmail" type="email" v-model="email" :placeholder="textContentCN.EditProfile.defaultEmail">
                </div>
              </div>
              <div class="mb-3">
                <label class="small mb-1" for="inputDescription">{{ textContentCN.EditProfile.AboutInput }}</label>
                <textarea class="form-control" id="inputDescription" v-model="about" :placeholder="textContentCN.EditProfile.defaultDescription"></textarea>
              </div>
              <div class="row">
                <div class="col-12 mt-3">
                  <button type="submit" class="btn btn-dark text-white w-100" :disabled="isSubmitting" id="updateUserInfoBtn">
                    <span class="spinner-border spinner-border-sm" aria-hidden="true" v-if="isSubmitting"></span>
                    <span v-else>{{ textContentCN.EditProfile.UpdateBtnInput }}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="updatedUserInfoToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
            <img src="../../../public/snow.svg" class="rounded me-2" alt="...">
            <strong class="me-auto">{{ textContentCN.EditProfile.toastTitle }}</strong>
            <small>11 mins ago</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            {{ textContentCN.EditProfile.toastMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>