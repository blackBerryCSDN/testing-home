<template>
  <div>
    <div class="chart-title chart-line"> <i class="icon-style"></i>达标率</div>
    <div class="chart-body" style="">
      <div id="reachStandardDiv" :style="{'height': heightBox - 60 + 'px'}"></div>
    </div>
  </div>
</template>

<script>
import api from '@/util/api'
export default {
  name: 'reachStandard',
  props: {
    heightBox: {
      type: Number,
      default () {
        return 480
      }
    }
  },
  data () {
    return {
      chart: '',
      data: {}
    }
  },
  async mounted () {
    const res = await api.get(this.GLOBAL.BASE_URL + '/api/quality/reachStandard', {})
    this.data = res.data.data
    console.log(JSON.stringify(this.data))
    this.initChart()
  },
  methods: {
    initChart () {
      this.chart = this.$echarts.init(document.getElementById('reachStandardDiv'))
      const citys = []
      const rate = []
      for (const key in this.data.citys) {
        citys.push(this.data.citys[key].cityName)
        rate.push(this.data.citys[key].score)
      }
      const option = {
        color: ['#3398DB'],
        tooltip: {
          show: true,
          // triggerOn: 'click',
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: '30',
          left: '5',
          right: '30',
          bottom: '20',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value',
            name: '%',
            axisLabel: {
              color: '#000',
              fontSize: '12px'
            },
            axisLine: {
              lineStyle: {
                color: '#000'
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            boundaryGap: true,
            axisLabel: {
              color: '#000',
              fontSize: '12px'
            },
            axisLine: {
              lineStyle: {
                color: '#000'
              }
            },
            axisTick: {
              alignWithLabel: true
            },
            data: citys
          }
        ],
        series: [
          {
            name: '达标率',
            type: 'bar',
            symbol: 'none',
            barWidth: '40%',
            label: {
              show: true,
              position: 'right',
              formatter: function (val) {
                return val.data + '%'
              }
            },
            markLine: {
              data: [
                {type: 'average', name: '平均值'}
              ]
            },
            // color: '#1E90FF',
            data: rate
          }
        ]
      }
      this.chart.setOption(option)
    },
    resize () {
      this.chart.resize()
    }
  }
}
</script>

<style scoped>

</style>
