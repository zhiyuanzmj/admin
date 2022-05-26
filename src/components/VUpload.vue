<script setup lang="ts">
import { getHeaders } from '~/composables/request'

const { photoName } = defineProps<{
  photoName?: string
}>()

let img = $ref(photoName ? `/file/${photoName}` : '')
let file = $ref<any>()
function imgChange({ raw }: any) {
  file = raw
  img = URL.createObjectURL(raw)
}

const headers = getHeaders()
</script>

<template>
  <el-upload
    class="avatar-uploader"
    action="/api/image/easyUpload"
    :headers="headers"
    icon="el-icon-upload"
    :show-file-list="false"
    :auto-upload="true"
    transition
    b="~ dashed gray-300 rounded hover:blue-500"
    cursor-pointer
    :on-change="imgChange"
  >
    <img v-if="!img" :src="img" class="avatar" width="300px" height="30px">
    <el-icon v-else class="avatar-uploader-icon"><i class="ep:plus" text-3xl /></el-icon>
  </el-upload>
</template>

<style lang="scss">
.avatar-uploader {
  .avatar {
    display: block;
    width: 178px;
    height: 178px;
  }

  .el-icon.avatar-uploader-icon {
    width: 178px;
    height: 178px;

    // font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
}
</style>
