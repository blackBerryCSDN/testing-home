<template>
  <div id="app" :style="{'min-height': heightBox + 'px', height: heightBox + 'px'}">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
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

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/
  color: #000;
  overflow: auto;
  font-size: 14px;
  background: #f2eff6;
  /*background-size: 100%;*/
  /*background-size:cover;*/
}
</style>
