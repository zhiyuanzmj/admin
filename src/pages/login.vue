<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useUserStore } from '~/stores/user'
const user = useUserStore()
const form = reactive({
  username: '',
  password: '',
})
async function submit() {
  await user.login(form)
  ElMessage.success('登录成功')
}
</script>

<template>
  <div h-screen flex items-center justify-center>
    <el-form w-md h-md @submit.prevent="submit">
      <el-form-item>
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" w-full>
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<route lang="yaml">
meta:
  hidden: true
  layout: home
  white: true
</route>
