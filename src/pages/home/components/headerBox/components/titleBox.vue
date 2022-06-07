<script setup lang="ts">
</script>

<template>
  <div class="title-box">
    <img src="/logo.png" alt="" class="title_logo">
    <span class="title">东为餐厅饭堂人脸识别系统</span>
  </div>
</template>

<style lang="scss" scoped>
  .title-box {
    box-sizing: border-box;

    // width: 1920px;
    // height: 89px;
    // background-color: orange;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 772px;
    height: 8.2407vh;
    padding-left: 40px;
    margin: 0 auto;
    background-image: url("../../static/images/title_box.png");
    background-repeat: repeat-x;
    background-origin: 0 0;
    background-size: 100% 100%;

    .title_logo {
      width: 55px;
      height: 55px;
    }

    .title {
      padding-left: 6px;
      font-size: 34px;
      font-weight: 900;
      color: #fff;
      letter-spacing: 1px;
    }
  }
</style>
