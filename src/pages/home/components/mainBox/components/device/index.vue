<script>
import lottie from 'lottie-web'
import faceDetect from './components/face_detect/index.vue'
import faceListDom from './components/face_list/index.vue'
import animationData from './animation/data.json'
import portrait from '~/pages/home/components/static/images/portrait.png'
import succ from '~/pages/home/components/static/images/succ.png'
import recognition_fail from '~/pages/home/components/static/images/recognition_fail.png'
import originImgPath from '~/pages/home/components/static/images/img_3.png'
// 动画插件
import messageCommon from '~/pages/home/components/MessageCommon.vue'
// import { timeroutClearList } from '@/controller/request'
const personInfoEl = {
  accountNumer: '0',
  // cardNum: '',
  // cardType: '',
  cardNum: '000',
  cardType: '临时卡',
  expireDate: '2046-10-10',
  name: '-',
  quanCheng: '-',
  sex: 1,
  startDate: '-',
  userBalance: '-',
}
const timer = []
export default {
  components: {
    FaceDetect: faceDetect,
    MessageCommon: messageCommon,
    FaceListDom: faceListDom,
  },
  props: {
    windowIndex: Number,
    faceList: null,
    personInfo: {
      type: Object,
      default: () => Object.assign({}, personInfoEl),
    },
    stopLoad: Boolean,
    showErrorMessage: Object,
  },
  data() {
    return {
      imgPath: '/api/file',
      originImgPath,
      timerOutList: [],
      recognition_fail,
      succ,
      portrait,
    }
  },
  watch: {
    // 一分钟后自动退回扫描界面
    personInfo(e) {
      const winIndex = this.windowIndex
      const index = winIndex - 1
      this.timerOutList[index] = false
      clearTimeout(timer[index])
      timer[index] = setTimeout(() => {
        // 清除余额 恢复背景颜色图
        this.$emit('emptyPersonInfo', index)
        // e.userBalance = '-'
        const data = {
          window: winIndex,
        }
        this.timerOutList[index] = true
        this.faceList[index] = new Array(4).fill({})
      }, 60000)
    },
  },
  mounted() {
    this.playSvg()
  },
  methods: {
    // 运行播放识别动画
    playSvg() {
      const element = document.getElementById(`recognition${this.windowIndex}`)
      lottie.loadAnimation({
        container: element,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData,
        // assetsPath: '~/pages/home/components/mainBox/components/device/animation/images/',
        // rendererSettings: this.options.rendererSettings
      })
    },
  },
}
</script>

<template>
  <div class="device-frame">
    <FaceDetect :person-info="personInfo" :window-index="windowIndex">
      <template #moveState>
        <!-- 正在扫描人脸识别 -->
        <div
          v-show="(Object.keys(faceList[windowIndex - 1][0]).length === 0 && !stopLoad) || timerOutList[windowIndex - 1]"
          class="animation"
        >
          <div :id="`recognition${windowIndex}`" class="tips_img" />
          <div class="tips_wrap">
            <span>正在识别人脸信息</span>
            <span>请稍候...</span>
          </div>
        </div>

        <!-- 识别成功 -->
        <div
          v-show="
            Object.keys(faceList[windowIndex - 1][0]).length > 0
              && !stopLoad
              && !timerOutList[windowIndex - 1]
          "
          class="animation"
        >
          <!-- <div class="animation"> -->
          <!-- 人脸信息 -->
          <div class="tips_img">
            <img :src="portrait" alt="加载图片失败..">
            <el-image
              class="succ_img_portrait"
              :src="
                Object.keys(faceList[windowIndex - 1][0]).length > 0
                  ? imgPath + personInfo.photoName
                  : originImgPath
              "
              alt="加载图片失败.."
            />

            <div class="succ">
              <img class="succ-img" :src="succ" alt>
              <span class="succ-text">识别人脸信息成功！</span>
            </div>
          </div>

          <div class="tips_wrap portrait-info">
            <!-- 个人信息 -->
            <div class="person-info">
              <div class="self">
                <span class="name">{{ personInfo.name }}</span>
              </div>
              <span class="department">{{ personInfo.quanCheng }}</span>
            </div>

            <!-- 消费金额 -->
            <div class="consume-money">
              <span>本次消费</span>
              <span class="consume-num money-num">{{ personInfo.accountNumer }}</span>
              <span>元</span>
            </div>

            <!-- 相关信息 -->
            <div class="detail-info">
              <div class="info-main">
                <span>余额总计</span>
                <span
                  class=" money-num card-total" :class="[{ 'balance-no-amply': personInfo.userBalance !== '-' && Number(personInfo.userBalance) < 10 }]"
                >{{ personInfo.userBalance }}</span>
                <span>元</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 识别失败 -->
        <div v-if="stopLoad" class="animation">
          <div class="tips_img">
            <img class="fail_img" :src="recognition_fail" alt>
          </div>
          <div class="tips_wrap">
            <span>识别人脸信息失败！</span>
            <span>请重刷！</span>
          </div>
        </div>

        <!-- 弹窗提示的错误信息 3.5s隐藏 -->
        <MessageCommon :mess-info="showErrorMessage" />
      </template>
    </FaceDetect>
    <!-- 历史刷脸列表 -->
    <FaceListDom :face-list-item="faceList[windowIndex - 1]" />
  </div>
</template>

<style lang="scss" scoped>
.device-frame {
  position: relative;

  // width: 790px;
  flex: 1;
  height: 96.4%;

  // background-color: blue;
  .animation {
    position: absolute;
    top: 11.57vh;
    left: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;

    // background: pink;
    width: calc(100% - 65px);

    // background-color: pink;
    .tips_img {
      position: relative;

      // transform: scale(2);
      width: 376px;
      height: 376px;

      .succ_img_portrait {
        position: absolute;
        top: 76px;

        // top: 50%;
        // left: 81.5px;
        left: 50%;
        box-sizing: border-box;
        width: 215px;
        height: 215px;
        border: 7px solid #17c6ff;

        // border: 7px solid red;
        border-radius: 50%;
        transform: translate(-50%);
      }

      .succ {
        // background-color: red;
        position: absolute;
        bottom: 0;
        left: 50%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 82px;
        font-size: 15px;
        line-height: 82px;
        color: #eee;
        white-space: nowrap;
        transform: translateX(-50%);

        .succ-img {
          width: 22px;
          padding-right: 7px;
          line-height: 22px;
        }
      }
    }

    .tips_wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      // background-color: red;
      padding-top: 1.6vh;
      padding-left: 27px;

      // height: 100%;
      // background-color: orange;
      span {
        font-size: 27px;
        line-height: 1.5;
        color: #eee;
        text-align: center;
      }

      &.portrait-info {
        position: absolute;
        top: 6.48vh;
        left: 371px;
        align-items: flex-start;
        padding-top: 0;
        padding-left: 0;
        line-height: 1;

        .person-info {
          // background-color: pink;
          // padding-top: 4.82vh;
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .self {
            display: flex;
            flex-direction: row;
            align-items: flex-end;

            .name {
              font-family: SimHei;
              font-size: 41px;
              line-height: 1;
            }

            .sex {
              padding-left: 19px;
              font-size: 16px;
              line-height: 1;
            }
          }

          .department {
            padding-top: 17px;
            font-size: 16px;
          }
        }

        .consume-money {
          display: flex;
          flex-direction: row;
          align-items: baseline;

          // width: 284px;
          // height: 8.51vh;
          // border: 1px solid #eee;
          padding-top: 4.3vh;

          span {
            font-size: 14px;
            line-height: 1;

            // background: red;
          }

          .consume-num {
            padding-right: 10px;
            padding-left: 7px;
            font-size: 24px;
            font-weight: 700;
            color: #ffe480;
          }
        }

        .detail-info {

          // background-color: pink;
          // height: 266px;
          position: relative;

          // 因为图片本来宽高就有一共18px的裂缝 158px多加18px = 176px进去
          // height: 24.629vh;
          box-sizing: border-box;
          display: none;
          width: 302px;
          height: 176px;

          // 因为图片本来宽高就有一共18px的裂缝 284px多加18px = 302px进去
          padding: 10px 16px 6px 23px;
          margin-top: 2.12vh;

          // border: 1px solid #7f9dd2;
          // background-color: rgba(255, 255, 255, 0.15);
          background-image: url("../../../static/images/personInfoCard.png");
          background-size: 100% 100%;

          .info-header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            white-space: nowrap;

            // background-color: green;
            .card-num {
              flex: 0.7;

              // background: red;
              overflow: hidden;
              font-size: 13px;
              text-align: start;
              text-overflow: ellipsis;
            }

            .card-type {
              flex: 0.3;
              font-size: 12px;

              // background: green;
              text-align: end;
            }
          }

          .info-main {
            // padding-top: 4.9vh;
            // padding-top: 52.92px;
            position: absolute;

            // top: 82px;
            top: 68px;
            left: 50%;
            display: flex;
            flex-direction: row;

            // background-color: blue;
            align-items: flex-end;
            line-height: 1 !important;

            // height: 22px;
            // line-height: 22px;
            white-space: nowrap;
            transform: translateX(-50%);

            // padding-left: 36px;
            // text-align: start;
            // position: absolute;
            // top: 6.75vh;
            // left: 36px;
            span {
              font-size: 12px;

              &.card-total {
                padding-right: 8px;
                padding-left: 6px;
                font-size: 22px;
                font-weight: 700;
                color: #3bd19f;
              }

              &.balance-no-amply {
                color: #ed070f !important;
              }
            }
          }

          .info-footer {
            position: absolute;
            right: 13px;
            bottom: 19px;

            // background-color: purple;
            display: flex;
            text-align: end;

            span {
              font-size: 12px;
              line-height: 1;
            }

            .valid-date {
              padding-left: 5px;
            }
          }
        }

        .money-num {
          font-size: 40px !important;

          // background-color: green;
          line-height: 1;
        }
      }
    }
  }
}
</style>
