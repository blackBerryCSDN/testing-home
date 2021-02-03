<template>
  <div style="height: 100%;">
    <div class="top-wrap">
      <div class="top-title">
        返修管理
      </div>
      <div class="top-tabs-box"
           style="line-height: 40px;padding-top: 3px;color: #000;font-size: 15px;padding-left: 10px;">
        关于
      </div>
    </div>
    <div class="content-wrap"
         style="position: relative;top: 54px;overflow-y: auto;height: calc(100% - 110px);max-height: calc(100% - 110px);background: #fff;">
      <div class="chart-wrap ">
        <div style="padding: 50px 40px;text-align: center;line-height: 25px;">
          <p>四川拨测之豪德信公众号提供衣宽宽带上网体验及运维管 理服务，自在通过提供自动化的运维手段充分实现家庭宽 带自动化运维:为助力四川京庭宽带7速发展提供可靠 高饮的拨测手段。</p>
          <br>
          <p>版本号: 2020.03.31.0.51</p>
        </div>
      </div>

      <div style="position: absolute;bottom: 0px;padding: 20px 0px;text-align: center;width: 100%;">
        <div style="text-align: center;">
          <el-button type="danger" @click="logout">账号注销</el-button>

        </div>
      </div>
    </div>
    <tabbar></tabbar>
  </div>
</template>

<script>
import tabbar from '../../components/tabbar'

export default {
  name: 'about',
  components: {
    tabbar
  },
  methods: {
    logout() {
      this.$confirm('此操作将永久注销此号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {

      });
    }
  }
}
</script>

<style>
@import "../../../static/scss/reset.css";
@import "../../../static/scss/com.css";
</style>

<style scoped>
.el-message-box__wrapper{
   width: 80%;
    top: 30%;
}
</style>
