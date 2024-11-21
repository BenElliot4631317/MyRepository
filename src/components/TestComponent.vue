<template>
  <div>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <img src="../../public/snow.svg" class="rounded me-2" alt="...">
          <strong class="me-auto">Bootstrap</strong>
          <small>11 mins ago</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          Hello, world! This is a toast message.
        </div>
      </div>
    </div>

    <button type="button" class="btn btn-primary" id="liveToastBtn">Show live toast</button>
  </div>
</template>

<script setup>
import {onMounted} from "vue";
import Toast from 'bootstrap/js/dist/toast';


onMounted( () => {
  const toastTrigger = document.getElementById('liveToastBtn')
  const toastLiveExample = document.getElementById('liveToast')

  if (toastTrigger && toastLiveExample) {
    const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
    toastTrigger.addEventListener('click', () => {
      toastBootstrap.show()
    })
  }
})

</script>

<style scoped>

</style>
