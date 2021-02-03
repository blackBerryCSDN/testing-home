<template>
  <div>
    <div class="chart-title chart-line"> <i class="icon-style"></i>在线率</div>
    <div class="chart-body" style="">
      <div style="display: flex">
        <div style="width: 60%">
          <div id="onlineRateDiv" :style="{'height': heightBox - 60 + 'px'}"></div>
        </div>
        <div style="width: 20%;text-align: center;">
          <div style="height: 30px; border-bottom: 1px solid #ddd;" >同比</div>
          <div style="padding: 0px;display: flex;flex-wrap: wrap;align-items: center;" :style="{'height': heightBox - 130 + 'px'}">
            <div
              style="width: 100%;"
              :key="index"
              v-for="(item,index) in data">
              <div>
                <span><i :class="bijiaoCss(item,1)"></i></span> {{bijiao(item,1)}}
              </div>
            </div>
          </div>
        </div>
        <div style="text-align: center;width: 20%;">
          <div style="height: 30px; border-bottom: 1px solid #ddd;" >环比</div>
          <div style="padding: 0px;display: flex;flex-wrap: wrap;align-items: center;" :style="{'height': heightBox - 130 + 'px'}">
            <div
              style="width: 100%;"
              :key="index"
              v-for="(item,index) in data">
              <div>
                <span><i :class="bijiaoCss(item,2)"></i></span> {{bijiao(item,2)}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/util/api'
export default {
  name: 'tsOnlineRate',
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
    const res = await api.get(this.GLOBAL.BASE_URL + '/api/quality/tsOnlineRate', {})
    this.data = res.data.data
    console.log(JSON.stringify(this.data))
    this.initChart()
  },
  methods: {
    initChart () {
      this.chart = this.$echarts.init(document.getElementById('onlineRateDiv'))
      const citys = []
      const rate = []
      for (const key in this.data) {
        citys.push(key)
        rate.push(this.data[key][0])
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
            name: '在线率',
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
            data: rate
          }
        ]
      }
      this.chart.setOption(option)
    },
    resize () {
      this.chart.resize()
    },
    bijiaoCss (array, index) {
      if (array[0] == null) {
        if (array[index] == null) {
          return ''
        } else {
          return 'red el-icon-caret-top'
        }
      } else {
        if (array[index] == null) {
          return 'red el-icon-caret-top'
        } else {
          return array[0] > array[index] ? 'red el-icon-caret-top' : 'green el-icon-caret-bottom'
        }
      }
    },
    bijiao (array, index) {
      if (array[0] == null) {
        if (array[index] == null) {
          return '-'
        } else {
          return -array[index]
        }
      } else {
        if (array[index] == null) {
          return -array[index]
        } else {
          return (array[0] / array[index] - 1) * 100 + '%'
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
