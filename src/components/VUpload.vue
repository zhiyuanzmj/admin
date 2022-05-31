<script setup lang="ts">
import type { UploadInstance, UploadProps } from 'element-plus'
import { ElLoading } from 'element-plus'
import { getHeaders } from '~/composables/request'

interface Props extends Partial<UploadProps> {
  photoName?: string
  onSuccess: (_?: any) => void
}
const { photoName, onSuccess } = defineProps<Props>()

let img = $ref(photoName ? `/api/file${photoName}` : '')
let file = $ref<any>()
function onChange({ raw }: any) {
  file = raw
  img = URL.createObjectURL(raw)
}

let loading: any
function beforeUpload() {
  loading = ElLoading.service({ fullscreen: true })
}
function onError() {
  loading?.close()
}

const headers = getHeaders()
const uploadRef = $shallowRef<UploadInstance>()
defineExpose({
  submit: () => file ? uploadRef?.submit?.() : onSuccess(),
  abort: uploadRef?.abort,
  handleStart: uploadRef?.handleStart,
})
</script>

<template>
  <el-upload
    ref="uploadRef"
    class="avatar-uploader"
    action="/api/image/easyUpload"
    :headers="headers"
    icon="el-icon-upload"
    :show-file-list="false"
    :auto-upload="false"
    transition
    b="~ dashed gray-300 rounded hover:blue-500"
    cursor-pointer
    :on-change="onChange"
    :on-success="onSuccess"
    :before-upload="beforeUpload"
    :on-error="onError"
  >
    <el-image v-if="img" :src="img" class="avatar" width="300px" height="30px" />
    <el-icon v-else class="avatar-uploader-icon"><i class="ep:plus" text-3xl /></el-icon>
  </el-upload>
</template>

<style lang="scss">
.avatar-uploader {
  .el-upload {
    display: flex;
  }

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
