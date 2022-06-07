<script setup lang="ts" name="home">
import HeaderBox from './components/headerBox/index.vue'
import MainBox from './components/mainBox/index.vue'
</script>

<template>
  <div class="container1">
    <HeaderBox />
    <MainBox />
  </div>
</template>

<style lang="scss" scoped>
  .container1 {
    align-items: center;
    height: 100vh;
    overflow: hidden;
    background-image: url("./components/static/images/background.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
  }
</style>

<route lang="yaml">
name: home
meta:
  permission: false
  title: 人脸识别
  icon: iconoir:face-id
  layout: home
</route>
