<template>
  <div class="hello">
      <div>
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"><i class="el-icon-date"></i> KQI综合评分</span>
            <div style="height: 500px;width: 100%;" id="myChart"></div>
          </el-tab-pane>
          <el-tab-pane label="宽带达标率">
            <div>
              宽带达标率
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {
    // this.drawLine()
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: { text: '手机销量' },
        tooltip: {},
        xAxis: {
          data: ['苹果', '华为', 'oppo', 'vivo']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [ 99, 89, 75, 60 ]
        }]
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
