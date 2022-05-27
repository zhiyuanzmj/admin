<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '~/stores/user'
import { toggleDark } from '~/composables'

const user = useUserStore()

const username = $ref('')
const password = $ref('')

const formRef = $ref<FormInstance>()
async function submit() {
  await formRef.validate()
  await user.login({ username, password })
  ElMessage.success('登录成功')
}
</script>

<template>
  <div class="flex flex-col flex-nowrap w-screen h-screen bg-no-repeat !bg-cover bg-gray-100 dark:bg-zinc-900">
    <button absolute right-5 top-5 btn fa6-solid:sun dark:fa6-solid-moon @click="toggleDark()" />
    <el-form
      ref="formRef"
      size="large"
      class="m-auto p-10 rounded-lg flex shadow-lg bg-white dark:bg-zinc-800 "
      @submit.prevent="submit"
    >
      <div class="flex flex-col w-sm">
        <div class="text-left">
          <div class="tracking-widest my-1 whitespace-nowrap text-4xl font-extrabold text-gray-700 dark:text-gray-100">
            菜谱预点餐系统
          </div>
          <p class="text-sm text-gray-400">
            Recipe pre-order management system
          </p>
        </div>
        <div class="text-center text-gray-500 dark:text-gray-300 mt-3 mb-10">—— 登陆界面 ——</div>
        <el-form-item prop="username">
          <el-input v-model="username" placeholder="用户名">
            <template #prefix>
              <i ep:user />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="password" type="password" show-password placeholder="密码">
            <template #prefix>
              <i ep:lock />
            </template>
          </el-input>
        </el-form-item>
        <el-button type="primary" native-type="submit">登录</el-button>
      </div>
      <!-- <img src="/login.jpg" class="select-none ml-10 my-auto w-md hidden lg:block"> -->
    </el-form>
    <div class="mx-auto mb-5 tracking-widest text-gray-400 text-sm font-medium">CopyRight © 2022东为信息科技有限公司</div>
  </div>
</template>

<route lang="yaml">
meta:
  hidden: true
  layout: home
</route>
