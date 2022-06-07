<script>
export default {
  name: 'MessageCommon',
  components: {},
  props: {
    messInfo: Object,
  },
  data() {
    return {}
  },
}
</script>

<template>
  <div>
    <div v-show="messInfo.status" class="error-message animated bounceIn">
      <!-- <svg-icon icon-class="message-icon-wran" class-name="icon-error" /> -->
      <i ep:warning-filled text-3xl mr-2 />
      <p class="el-message__content">{{ messInfo.message }}</p>
    </div>
    <!-- <transition name="el-fade-in">
      <div class="error-message" v-show="messInfo.status">
        <svg-icon icon-class="message-icon-wran" class-name="icon-error" />
        <p class="el-message__content">{{ messInfo.message }}</p>
      </div>
    </transition> -->
  </div>
</template>

<style lang="scss" scoped>
.error-message {
  // font-size: 52px !important;
  // position: absolute;
  // top: 0 !important;
  // left: 0;
  // left: 50%;
  // left: 205px;
  z-index: 2000;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content !important;
  min-width: 380px;

  // width: 100%;
  // background-color: orange;
  height: 6.6vh;
  padding: 0 20px;
  margin: 0 auto;
  margin-top: 5.2vh;

  // transform: translateX(-50%) !important;
  overflow: hidden;
  color: #ed070f;

  // background-color: #fef0f0;
  background-image: url("./static/images/message-wrap.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  transition: opacity 0.3s, transform 0.4s, top 0.4s;

  .icon-error {
    margin-right: 10px;
    font-size: 42px;
  }

  & > p.el-message__content {
    margin: 0;
    font-size: 36px !important;
    font-weight: 700 !important;
    white-space: nowrap;

    // background-color: blue;
  }
}
</style>
