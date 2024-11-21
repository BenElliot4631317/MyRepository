<script setup>
import {ref, reactive} from "vue";
import {loginUser as loginUserAPI} from '@/api'
import router from "@/router";
import {localStorageService} from "@/LocalStorageService";
import Toast from "bootstrap/js/dist/toast";

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const responseMessage = ref('');
const rememberMe = ref(false);
const isSubmitting = ref(false);
const alertClass = ref('alert alert-success');

//中文
const textContentCN = reactive({
  LoginPage: {
    emailCN: '电子邮箱',
    passwordCN: '密码',
    rememberMeCN: '记住我',
    btnSubmitCN: '登录',
    toastTitle: '系统消息',
    toastMessage: '',
  }
})


const loginUser = async () => {

  if (isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    const response = await loginUserAPI({
      email: email.value,
      password: password.value,
      remember_me: rememberMe.value,
    });
    const token = response.data.token;
    const userData = response.data.user;
    const profileData = response.data.profile;
    const key = 'auth_token';
    localStorageService.setItem(key, token);
    localStorageService.setItem('user', JSON.stringify(userData));
    localStorageService.setItem('profile', JSON.stringify(profileData));
    responseMessage.value = response.data.message;
    textContentCN.LoginPage.toastMessage = response.data.message
    const toast = new Toast(document.getElementById('loginMessageToast'))
    toast.show()
    console.log('response', response);
    console.log('token', token);
    console.log('userdata', userData);
    console.log('profileData', profileData)
    alertClass.value = 'alert alert-success';
    document.getElementById('loginMessageToast').addEventListener('hidden.bs.toast', ()=> {
      router.push('/');
    })
  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.error;
    } else {
      errorMessage.value = 'An unexpected error occurred.';
    }
    responseMessage.value = errorMessage.value;
    textContentCN.LoginPage.toastMessage = errorMessage.value;
    const toast = new Toast(document.getElementById('loginMessageToast'))
    toast.show()
    alertClass.value = 'alert alert-danger';
  } finally {
    isSubmitting.value = false;
  }
}

</script>

<template>
  <div class="container-fluid position-relative z-1 my-5" style="width: 100%;">
    <div class="row justify-content-center">
      <div class="col-md-6 my-5 border rounded p-5">
        <div class="input-group-div">
          <div class="row text-center">
            <div class="col-12">
              <img src="../../../public/icon-image/897241_article_blog_blogging_compose_write_icon.svg" width="72" height="72" alt="icon">
            </div>
          </div>
          <div>
            <form @submit.prevent="loginUser">
              <div class="row justify-content-center mt-5">
                <div class="col-md-6 col-sm-8">
                  <label for="emailInput" class="form-label">{{ textContentCN.LoginPage.emailCN }}</label>
                  <input type="text" class="form-control" id="emailInput" v-model="email" required>
                </div>
              </div>
              <div class="row justify-content-center mt-2">
                <div class="col-md-6 col-sm-8">
                  <label for="passwordInput" class="form-label">{{ textContentCN.LoginPage.passwordCN }}</label>
                  <input type="password" class="form-control" id="passwordInput" v-model="password" required>
                </div>
              </div>
              <div class="row justify-content-center mt-2">
                <div class="col-md-6 col-sm-8">
                  <div class="form-check">
                    <input class="form-check-input checkbox-style" type="checkbox" value="" id="remember-me"
                           v-model="rememberMe">
                    <label class="form-check-label" for="remember-me">{{
                        textContentCN.LoginPage.rememberMeCN
                      }}</label>
                  </div>
                </div>
              </div>
              <div class="row justify-content-center mt-4">
                <div class="col-md-6 col-sm-8 text-center">
                  <button type="submit" class="btn btn-dark w-100" :disabled="isSubmitting" id="loginBtn">
                    <span class="spinner-border spinner-border-sm" aria-hidden="true" v-if="isSubmitting"></span>
                    <span v-else>{{ textContentCN.LoginPage.btnSubmitCN }}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
      <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="loginMessageToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
            <img src="../../../public/snow.svg" class="rounded me-2" alt="...">
            <strong class="me-auto">{{ textContentCN.LoginPage.toastTitle }}</strong>
            <small>11 mins ago</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            {{ textContentCN.LoginPage.toastMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-group-div {
  width: 100%;
  height: auto;
}

.checkbox-style:hover {
  cursor: pointer;
}

</style>