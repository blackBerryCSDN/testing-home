<template>
  <div>
    <div>
      <!--<div style="text-align: center;height: 20px;">{{showTime}}</div>-->
      <div style="width: 100%;height: 220px;" :id=id ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'multiChart',
  data () {
    return {
      showTime: null,
      value6: 22
    }
  },
  props: {
    id: {
      type: String,
      default () {
        return {}
      }
    },
    xData: {
      type: Array,
      default () {
        return {}
      }
    },
    yData: {
      type: Array,
      default () {
        return {}
      }
    },
    onlineData: {
      type: Array,
      default () {
        return {}
      }
    },
    totalData: {
      type: Array,
      default () {
        return {}
      }
    }
  },
  watch: {
    onlineData (newValue, oldValue) {
      // console.log('newValue', newValue)
      // console.log('oldValue', oldValue)
      this.telDataArr = newValue
      this.mapChart()
    },
    mobileDataArr (newValue, oldValue) {
      // console.log('newValue', newValue)
      // console.log('oldValue', oldValue)
      this.mobileDataArr = newValue
      this.mapChart()
    }
  },
  mounted () {
    this.mapChart()
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
          top: '30',
          left: '-2',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        legend: {
          right: '0',
          textStyle: {
            color: '#eee',
            data: ['在线', '总量']
          }
        },
        xAxis: [
          {
            type: 'category',
            data: this.xData,
            boundaryGap: true,
            axisLabel: {
              color: '#ddd',
              fontSize: '12px',
              rotate: 45,
              interval: 0
            },
            axisLine: {
              lineStyle: {
                color: '#ddd'
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
            minInterval: 1,
            axisLabel: {
              color: '#ddd',
              fontSize: '12px'
            },
            axisLine: {
              lineStyle: {
                color: '#ddd'
              }
            },
            data: this.yData
          }
        ],
        series: [
          {
            name: '在线',
            type: 'bar',
            color: '#00b050',
            barWidth: '40%',
            data: this.onlineData
          },
          {
            name: '总量',
            type: 'line',
            smooth: true,
            symbol: 'none',
            color: '#ffff00',
            data: this.totalData
          }
        ]
      })
      myChart.resize()
      myChart.on('click', (params) => {
        // let val = params
        // console.log(val)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .flex-center{
    padding: 0px 0px 0px 0px;
    display: flex;
    display: -webkit-flex;
    justify-content:space-around;
  }
</style>
