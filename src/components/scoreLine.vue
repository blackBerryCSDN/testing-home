<template>
  <div>
    <div style="text-align: center">全省综合评分</div>
    <div id="lineDiv" :style="{'height': heightBox - 60 + 'px'}"></div>
    <div style="text-align: center">视图展示最近7天全省关键指标数据</div>
  </div>
</template>

<script>
import api from '@/util/api'
export default {
  name: 'scoreLine',
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
  async created () {
  },
  async mounted () {
    const res = await api.get(this.GLOBAL.BASE_URL + '/api/quality/cityScore7', {})
    this.data = res.data.data
    this.initChart()
  },
  methods: {
    initChart () {
      this.chart = this.$echarts.init(document.getElementById('lineDiv'))
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: this.data.legend
        },
        grid: {
          top: 70,
          bottom: 50
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false
            },
            data: this.data.xAxis
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: []
      }
      this.data.datas.forEach(item => {
        const o = {
          type: 'line',
          smooth: true
        }
        o.name = item.name
        o.data = item.data
        option.series.push(o)
      })
      console.log('11111111',JSON.stringify(option));
      this.chart.setOption(option)
    },
    resize () {
      // this.chart.resize()
    }
  }
}
</script>

<style scoped>

</style>
