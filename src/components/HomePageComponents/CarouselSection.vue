<script setup>
import {reactive} from "vue";

const text = reactive({
  carouselTitle1: '你的每一篇博客都是一段旅程',
  carouselTitle2: '探索未知，交流思想',
  carouselTitle3: '记录每一个值得铭记的瞬间',
  carouselContent1: '无论是日常生活、专业见解，还是旅途风景，这里是分享你故事的舞台，让你的声音被更多人听见！',
  carouselContent2: '阅读、评论、分享，每一次互动都是一种成长。在这里发现灵感，与志同道合的人建立联系。',
  carouselContent3: '从小感动到大梦想，用你的文字点亮生活的每一面，一键发布，与世界分享你的独特视角！',
})

</script>

<template>
  <div id="carouselSection" class="carousel carousel-fade slide" data-bs-ride="carousel" data-bs-interval="5000">
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img src="../../../public/background-img/4413403.jpg" class="d-block w-100" alt="...">
        <div class="carousel-caption d-done d-md-block">
          <h1 class="carousel-hero-title">{{ text.carouselTitle1 }}</h1>
          <p class="carousel-hero-content mt-5">{{ text.carouselContent1 }}</p>
        </div>
      </div>
      <div class="carousel-item">
        <img src="../../../public/background-img/810.jpg" class="d-block w-100" alt="...">
        <div class="carousel-caption d-done d-md-block">
          <h1 class="carousel-hero-title">{{ text.carouselTitle2 }}</h1>
          <p class="carousel-hero-content mt-5">{{ text.carouselContent2 }}</p>
        </div>
      </div>
      <div class="carousel-item">
        <img src="../../../public/background-img/3524967_515331-PIWSNP-964.jpg" class="d-block w-100" alt="...">

        <div class="carousel-caption d-done d-md-block">
          <h1 class="carousel-hero-title">{{ text.carouselTitle3 }}</h1>
          <p class="carousel-hero-content mt-5">{{ text.carouselContent3 }}</p>
        </div>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselSection" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselSection" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<style scoped>
.carousel-item img {
  width: 100%;
  height:500px;
  object-fit: cover;
  margin-top: 10px;
  filter: brightness(0.6);
}

.carousel-hero-title {
  font-family: "PingFang SC", sans-serif;
}

.carousel-hero-content {
  font-family: Roboto, sans-serif;
}

.carousel-caption {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 10;
}

</style>