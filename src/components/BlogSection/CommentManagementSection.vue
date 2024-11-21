<script setup>
import {ref, onMounted} from "vue";
import {getCommentsById as getCommentsByIdAPI} from "@/api"
import {useRoute} from "vue-router";
import {deleteComment as deleteCommentAPI} from "@/api";
import Modal from 'bootstrap/js/src/modal'

const route = useRoute()
const blog_id  = route.params.blog_id


const comments = ref({})
const selectedComment = ref(null)

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

const confirmDeleteComment = (comment_id) => {
  selectedComment.value = comment_id
  const modal = new Modal(document.getElementById("deleteCommentModal"))
  modal.show()
  console.log("Comment_id", comment_id)
}

const deleteComment = async () => {
  try {
    const response = await deleteCommentAPI(selectedComment.value)
    console.log("Selected Comment ID:", selectedComment.value)
    console.log("Response:", response.data)
    window.location.reload()
  }catch (error) {
    console.error(error)
  }
}

const getComments = async () => {
  try {
    const response = await getCommentsByIdAPI(blog_id)
    comments.value = response.data
    console.log("Blog ID:", blog_id)
    console.log("Response:", response.data)
  }catch (error) {
    console.log(error)
  }
}


onMounted(() => {
  getComments();
})

</script>

<template>
  <div class="container my-5 py-3">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10" style="height: auto">
        <div class="d-flex flex-column border rounded">
          <div class="d-flex flex-row p-3">
            <table class="table table-striped">
              <thead>
                <th>文章标题</th>
                <th>评论用户</th>
                <th>评论内容</th>
                <th>评论时间</th>
                <th>操作</th>
              </thead>
              <tbody>
                <tr v-for="comment in comments" :key="comment.id">
                  <td>{{ comment.post_title }}</td>
                  <td>{{ comment.user_name }}</td>
                  <td>{{ comment.content }}</td>
                  <td>{{ formatDateToYMDHMS(comment.created_at) }}</td>
                  <td>
                    <button class="btn btn-danger" @click="confirmDeleteComment(comment.id)"><i class="bi bi-x-circle me-2"></i>删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="deleteCommentModal" tabindex="-1" aria-labelledby="deleteCommentModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="deleteCommentModalLabel">系统消息</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            你确认要删掉此条评论吗？
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteComment" data-bs-dismiss="modal">确认删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>