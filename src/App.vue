<template>
  <!-- 使用 v-slot 来获取组件，并包裹在 <transition> 里面 -->
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

</template>

<script>


export default {
  name: 'App',
  components: {
    
  },
  methods: {

  },
  data() {
    return {
      timeout: null,
    }
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Noto Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
/* 定义 fade 动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
