<template>
  <div style="height: 100%;">
    <!--头部元素-->
    <div class="top-wrap">
      <div class="top-title">
        综合质量
      </div>
      <div class="top-tabs-box">
        <div style="display: block;">
          <el-tabs v-model="activeName" type="card" @tab-click="tabsClickTop">
            <el-tab-pane label="KQI综合评分"   :lazy=true name="tabs0">
            </el-tab-pane>
            <el-tab-pane label="宽带达标率"  :lazy=true name="tabs1">
            </el-tab-pane>
            <!--<el-tab-pane label="宽带达标率" :lazy=true name="third">-->
            <!--</el-tab-pane>-->
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="content-wrap" ref="scrollDiv1" style="overflow: hidden;" :style="{'min-height': heightBox + 'px'}">
      <div class="swiper-container" style="margin-top: 50px;" >
        <div class="swiper-wrapper">
          <div class="swiper-slide" :style="{'min-height': heightBox + 'px'}">
            <div style="height: 500px;">1</div>
          </div>
          <div class="swiper-slide" :style="{'min-height': heightBox + 'px'}">
            <div>1</div>
          </div>
        </div>
      </div>
    </div>
   </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      heightBox: ''
    }
  },
  beforeCreate () {
    this.heightBox = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  },
  create () {
    // this.heightView = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  },
  methods: {

  }
}
</script>

<style>
  @import "../../../static/scss/reset.css";
</style>
<style scoped lang="scss">
  @import "../../../static/scss/com.css";

</style>
