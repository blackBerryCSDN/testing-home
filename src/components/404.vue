<template>
    <div :style="{'min-height': heightBox + 'px'}">
      <img src="../../static/img/404.png" alt="" style="width: 50%;height: 80%;margin-top: 150px;margin-bottom: 50px;margin-left: 24%;">
      <h2 style="text-align: center;color: #fafafa;">你访问的页面不存在!</h2>
      <br>
    </div>
</template>

<script>
export default {
  name: 'nofount',
  data () {
    return {
      heightBox: ''
    }
  },
  mounted () {
    this.heightBox = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  }
}
</script>

<style scoped>

</style>
