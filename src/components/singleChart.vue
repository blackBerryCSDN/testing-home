<template>
  <div>
    <div>
      <div style="width: 100%;" :style="{height: height + 'px'}" :id=id ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'singleChart',
  props: {
    id: { type: String },
    xData: { type: Array },
    yData: { type: Array },
    seriesData: { type: Array },
    height: { type: Number }
  },
  mounted () {
    this.mapChart()
  },
  watch: {
    xData () {
      this.mapChart()
    },
    yData () {
      this.mapChart()
    },
    seriesData () {
      this.mapChart()
    }
  },

  methods: {
    mapChart () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(this.id))
      // 绘制图表
      myChart.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: '15',
          left: '-2',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.xData,
            axisLabel: {
              // color: '#ddd',
              fontSize: '12px',
              rotate: 45,
              interval: 0
            },
            axisLine: {
              lineStyle: {
                // color: '#ddd'
              }
            },
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            // name: '分',
            axisLabel: {
              // color: '#ddd',
              fontSize: '12px'
            },
            axisLine: {
              lineStyle: {
                // color: '#ddd'
              }
            },
            splitLine: {
              show: false
            },
            data: this.yData
          }
        ],
        series: this.seriesData
      })
      myChart.resize()
    }
  }
}
</script>

<style scoped>

</style>
