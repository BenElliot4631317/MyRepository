<script setup>
import {ref, reactive} from "vue";
import {registerUser as registerUserAPI} from "@/api";
import router from "@/router";
import {onMounted} from "vue";
import Toast from 'bootstrap/js/src/toast'

const firstName = ref('');
const lastName = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const email = ref('');
const responseMessage = ref('');
const alertClass = ref('alert alert-success');
const isSubmitting = ref(false);// 添加一个状态来追踪是否正在提交

//设置中文部分
const textContentCN = reactive({
  SignUpPage: {
    title: '注  册  用  户',
    firstNameCN: '名',
    lastNameCN: '姓',
    usernameCN: '用户名',
    passwordCN: '密码',
    confirmPasswordCN: '确认密码',
    emailCN: '电子邮箱',
    submitButtonCN: '提交信息',
    toastTitle: '系统消息',
    toastBodyMessage: '这是一条系统消息'
  }
})

const registerUser = async () => {

  if (isSubmitting.value){
    return;// 如果正在提交中，阻止重复提交
  }

  isSubmitting.value = true;// 标记为正在提交

  try {
    const response = await registerUserAPI({
      first_name: firstName.value,
      last_name: lastName.value,
      username: username.value,
      password: password.value,
      confirm_password: confirmPassword.value,
      email: email.value,
    });
    console.log('Response', response);
    console.log(response.data);
    responseMessage.value = response.data.message;
    textContentCN.SignUpPage.toastBodyMessage = responseMessage.value
    alertClass.value = 'alert alert-success';
    const toast = new Toast(document.getElementById('SignUpMessageToast'))
    toast.show()
    document.getElementById('SignUpMessageToast').addEventListener('hidden.bs.toast', ()=> {
      router.push('/login');
    })
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.data);

      //提取错误信息并显示到前端
      let errorMessages = '';
      const errorData = error.response.data;
      // 遍历错误信息，并处理不同类型的错误数据
      for (const field in errorData) {
        if (Object.prototype.hasOwnProperty.call(errorData, field)) {
          const fieldError = errorData[field];

          // 检查 fieldError 是否是数组，若是则使用 join()，否则直接输出
          if (Array.isArray(fieldError)) {
            errorMessages += `${fieldError.join(', ')}\n`;
          } else {
            errorMessages += `${fieldError}\n`;
          }
        }
      }

      responseMessage.value = errorMessages;
      alertClass.value = 'alert alert-danger';
      textContentCN.SignUpPage.toastBodyMessage = responseMessage.value
      const toast = new Toast(document.getElementById('SignUpMessageToast'))
      toast.show()
    } else {
      console.error('Unexpected Error:', error);
      alertClass.value = 'alert alert-danger';
    }

  }finally {
    isSubmitting.value = false; // 请求完成后，重置提交状态
  }
}


onMounted( () => {

})
</script>

<template>
  <section class="h-100">
    <div class="container-fluid position-relative z-1 my-5" style="width: 100%;">
      <div class="row justify-content-center">
        <div class="col-md-6 my-5 border bg-body-tertiary rounded p-5">
          <div class="input-group-div">
            <div class="row text-center">
              <div class="col-12">
                <img src="../../../public/icon-image/897241_article_blog_blogging_compose_write_icon.svg" width="72" height="72">
              </div>
            </div>
            <div class="row text-center">
              <div class="col-12 my-3">
                <h2 style="font-family: Inter,sans-serif">{{ textContentCN.SignUpPage.title }}</h2>
              </div>
            </div>
            <form @submit.prevent="registerUser">
              <div class="row">
                <div class="col-md-6 px-5">
                  <label for="firstNameInput" class="form-label">{{ textContentCN.SignUpPage.firstNameCN }}</label>
                  <input type="text" class="form-control" id="firstNameInput" v-model="firstName" required>
                </div>
                <div class="col-md-6 px-5">
                  <label for="lastNameInput" class="form-label">{{ textContentCN.SignUpPage.lastNameCN }}</label>
                  <input type="text" class="form-control" id="lastNameInput" v-model="lastName" required>
                </div>
              </div>
              <div class="row">
                <div class="col px-5 mt-3">
                  <label for="usernameInput" class="form-label">{{ textContentCN.SignUpPage.usernameCN }}</label>
                  <input type="text" class="form-control" id="usernameInput" v-model="username" required>
                </div>
              </div>
              <div class="row">
                <div class="col px-5 mt-3">
                  <label for="emailInput" class="form-label">{{ textContentCN.SignUpPage.emailCN }}</label>
                  <input type="text" class="form-control" id="emailInput" v-model="email" required>
                </div>
              </div>
              <div class="row">
                <div class="col px-5 mt-3">
                  <label for="passwordInput" class="form-label">{{ textContentCN.SignUpPage.passwordCN }}</label>
                  <input type="password" class="form-control" id="passwordInput" v-model="password" required>
                </div>
              </div>
              <div class="row">
                <div class="col px-5 mt-3">
                  <label for="confirmPasswordInput" class="form-label">{{
                      textContentCN.SignUpPage.confirmPasswordCN
                    }}</label>
                  <input type="password" class="form-control" id="confirmPasswordInput" v-model="confirmPassword"
                         required>
                </div>
              </div>
              <div class="row">
                <div class="col-12 px-5 mt-5">
                  <button class="btn btn-dark w-100" type="submit" :disabled="isSubmitting" id="signUpBtn">
                    <span class="spinner-border spinner-border-sm" aria-hidden="true" v-if="isSubmitting"></span>
                    <span v-else>{{ textContentCN.SignUpPage.submitButtonCN }}</span>
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="SignUpMessageToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <img src="../../../public/snow.svg" class="rounded me-2" alt="...">
          <strong class="me-auto">{{ textContentCN.SignUpPage.toastTitle }}</strong>
          <small>11 mins ago</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{ textContentCN.SignUpPage.toastBodyMessage }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>