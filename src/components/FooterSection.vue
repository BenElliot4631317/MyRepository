<script setup>

const textContent = {
  footer: {
    home: '主页',
    links: '链接',
    blog: '博客',
    user: '用户',
    login: '登录',
    signup: '注册',
    profile: '个人主页',
    edit: '编辑个人主页',
    aboutUs: '关于我们',
  }
}

const Year = new Date().getFullYear()
</script>

<template>
  <!--  footer content  -->
  <footer class="bg-body-tertiary border-top">
    <div class="container">
      <div class="row d-flex justify-content-between p-3">
        <div class="col-12 col-md-4">
          <h5 class="mb-3">{{ textContent.footer.links }}</h5>
          <p><router-link to="/" class="text-decoration-none link-secondary">{{ textContent.footer.home }}</router-link></p>
          <p><a class="text-decoration-none link-secondary">{{ textContent.footer.blog }}</a></p>
          <p><a class="text-decoration-none link-secondary">{{ textContent.footer.aboutUs }}</a></p>
        </div>
        <div class="col-12 col-md-4">
          <h5 class="mb-3">{{ textContent.footer.user }}</h5>
          <p><router-link class="text-decoration-none link-secondary" to="/login">{{ textContent.footer.login }}</router-link></p>
          <p><router-link class="text-decoration-none link-secondary" to="/signup">{{ textContent.footer.signup }}</router-link></p>
        </div>
        <div class="col-12 col-md-4">
          <h5 class="mb-3">Contact</h5>
          <p><a class="text-decoration-none link-secondary">Home</a></p>
          <p><a class="text-decoration-none link-secondary">Blog</a></p>
          <p><a class="text-decoration-none link-secondary">About Us</a></p>
        </div>
      </div>

      <div class="d-flex justify-content-center p-3">
        <p>
          <img src="../../public/icon-image/897241_article_blog_blogging_compose_write_icon.svg" width="48" height="48" alt="blog icon">
          &copy;{{ Year }} copyright all reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer{
  width: 100%;
  height: auto;
}

a:hover{
  cursor: pointer;
}

.link-hr {
  width: 60%;
}
</style>