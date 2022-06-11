<script>
import originImgPath from '~/pages/home/components/static/images/img_3.png'
export default {
  props: {
    faceListItem: null,
  },
  data() {
    return {
      originImgPath,
      imgPath: '/api/file',
      zmj: 1,
    }
  },
  watch: {
    faceListItem(e) {
      // console.log('e', e)
      // return
      const itemWindowList = e
      // return e
      const addNumSlot = 4 - itemWindowList.length
      if (addNumSlot === 0)
        return
      if (addNumSlot) {
        for (let i = 0; i < addNumSlot; i++)
          itemWindowList.push({})

        return e
      }
    },
  },
  mounted() {
    setInterval(() => this.zmj++, 1000)
  },
}
</script>

<template>
  <div class="face-list">
    <ul>
      <li
        v-for="(item, itemIndex) of faceListItem"
        :key="Object.keys(item).length > 0 ? item.StaffID : itemIndex"
      >
        <el-image
          class="img"
          :src="
            Object.keys(item).length > 0
              ? imgPath + item.photoName
              : originImgPath
          "
          :style="{ opacity: Object.keys(item).length === 0 ? 0.3 : 1 + zmj }"
        />
        <!-- <img src="~static/images/img_3.png" alt=""> -->
        <span class="name_veil">{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.face-list {
  // padding-top: 20px;
  padding-top: 1.851851851851852vh;

  // background-color: purple;
  ul {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding-left: 45px;

    li {
      position: relative;
      box-sizing: border-box;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;

      // transform: scale(3);
      // height: 207px;
      // width: 164px;
      height: 19.16666666666667vh;
      margin-left: 30px;
      background-image: url("../../../../../static/images/portrait_frame2.png");
      background-repeat: repeat-x;
      background-position: center;
      background-size: 100% 100%;

      &:first {
        padding-left: 0;
      }

      .img {
        box-sizing: border-box;
        width: 70%;
        height: 15.58533333333333vh;
        border: 1px solid #0dcaff;

        // padding-top: 1.85vh;
        // padding-left: 24px;
      }

      .name_veil {
        position: absolute;

        // bottom: 1.505768vh;
        bottom: 1.9444vh;
        left: 24px;
        z-index: 2;

        // line-height: 2.684vh;
        // height: 2.684vh;
        // text-align: center;
        width: 117px;

        // bottom: 0;
        font: 21px SimHei;
        color: #fff;

        &::after {
          position: absolute;
          bottom: -5px;
          left: 0;
          z-index: -1;
          display: block;
          width: 100%;
          height: 100%;
          padding: 5px 0;
          content: "";
          background-color: #3b9aff;
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
