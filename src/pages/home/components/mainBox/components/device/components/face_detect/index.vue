<script>
import messageCommon from '~/pages/home/components/MessageCommon.vue'
import balanceAmpleBgImg from '~/pages/home/components/static/images/device_frame.png'
import balanceNoAmpleBgImg from '~/pages/home/components/static/images/device_frame_balance_no_ample.png'
import camera from '~/pages/home/components/static/images/camera.png'
export default {
  components: {
    MessageCommon: messageCommon,
  },
  props: {
    personInfo: Object,
    isBalancetTip: Boolean,
    windowIndex: Number,
  },
  data() {
    return {
      camera,
      balanceNoAmpleBgImg,
      balanceAmpleBgImg,
      messageCommon,
      faceDetectList: [],
      bgImgUrl: this.personInfo.userBalance !== '-' && Number(this.personInfo.userBalance) < 10 ? balanceNoAmpleBgImg : balanceAmpleBgImg,
      balanceMessage: {
        status: false,
        message: '余额不足，请充值!',
      },
      timer: null,
    }
  },
  computed: {
    personInfoWinToWinIndex() {
      return personInfo.window % 2 === 0 ? 2 : 1
    },
  },
  watch: {
    // 判断是否余额不足
    personInfo: {
      handler(e) {
        // console.log('e', e)
        if (e.userBalance === '-') {
          this.bgImgUrl = balanceAmpleBgImg
          return
        }
        const isBalanceNoAmple = Number(e.userBalance) < 10
        // console.log('isBalanceNoAmple', isBalanceNoAmple)
        this.bgImgUrl = isBalanceNoAmple ? balanceNoAmpleBgImg : balanceAmpleBgImg
        // this.balanceMessage.status = isBalanceNoAmple
        // 先清除定时器和提示信息数据s: false
        this.$set(this.balanceMessage, 'status', false)
        clearTimeout(this.timer)
        const data = {
          status: isBalanceNoAmple,
          message: '余额不足，请充值！',
        }
        this.$set(this, 'balanceMessage', data)

        this.timer = setTimeout(() => {
          this.$set(this.balanceMessage, 'status', false)
        }, 3000)
      },
      deep: true,
    },
  },
}
</script>

<template>
  <div class="face-detect" :style="{ 'background-image': `url(${bgImgUrl})` }">
    <div class="title_wrap">
      <span>
        <img :src="camera" alt>
      </span>
      <span class="title">人脸设备{{ personInfo.window }}</span>
    </div>

    <!-- 余额不足改变背景色和弹框提示 -->
    <MessageCommon :mess-info="balanceMessage" />

    <!-- <div id="animation" class="animation"></div> -->
    <slot name="moveState" class="animation" />
  </div>
</template>

<style lang="scss" scoped>
.face-detect {
  position: relative;
  width: 100%;

  // height: 650px;
  height: 60.18vh;
  overflow: hidden;

  // background-color: pink;
  background-position: center;
  background-size: 100% 100%;

  .title_wrap {
    position: absolute;
    top: 2.67vh;
    left: 53px;
    display: flex;
    align-items: center;
    height: 41px;
    line-height: 41px;

    span {
      height: 100%;
    }

    img {
      display: inline-block;
      width: 37px;
      height: 100%;
    }

    .title {
      padding-left: 17px;
      font-size: 21px;
      color: #eee;
    }
  }
}
</style>
