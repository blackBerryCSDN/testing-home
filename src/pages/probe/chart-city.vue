<template>
  <div>
    <div>
      <!--<div style="text-align: center;height: 20px;">{{showTime}}</div>-->
      <div style="width: 100%;height: calc(100vh - 204px)" :id=id ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'barChartCity',
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
    },
    offlineData: {
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
        /* color: ['#6495ed', '#87cefa', '#da70d6', '#32cd32', '#ff7f50',
          '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
          '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
          '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'], */
        color: ['#0bbf08', 'gray'],

        tooltip: {
          trigger: 'axis',

          formatter: function (params, ticket, callback) {
            var htmlStr = ''
            var onlineRate = 0
            for (var i = 0; i < params.length; i++) {
              var param = params[i]
              var xName = param.name// x轴的名称
              var seriesName = param.seriesName// 图例名称
              var value = param.value// y轴值
              var color = param.color// 图例颜色
              if (i === 0) {
                htmlStr += xName + '<br/>'// x轴的名称
              }
              htmlStr += '<div>'
              htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>'
              htmlStr += seriesName + '：' + value
              htmlStr += '</div>'
              if (i === 0) {
                onlineRate = value
              } else {
                if (onlineRate === 0) {
                  onlineRate = '0%'
                } else {
                  onlineRate = (Math.round(onlineRate / (onlineRate + value) * 10000) / 100.00) + '%'
                }
                htmlStr += '在线率' + '：' + onlineRate
              }
            }
            return htmlStr
          },
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          show: false,
          right: '0',
          // color: '#EEEEEE',
          textStyle: {
            // color: '#ddd',
            data: ['在线', '离线']
          }
        },
        grid: {
          top: '10px',
          left: '3%',
          right: '40px',
          bottom: '20px',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '台',
          boundaryGap: true,
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
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'category',
          minInterval: 1,
          axisLabel: {
            // color: '#ddd',
            fontSize: '12px'
          },
          axisLine: {
            lineStyle: {
              // color: '#ddd'
            }
          },
          data: this.yData
        },
        series: [
          {
            name: '在线',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  if (params.value > 0) {
                    return params.value
                  } else {
                    return ''
                  }
                },
                position: 'insideRight'
              }
            },
            data: this.onlineData
          },

          {
            name: '离线',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  if (params.value > 0) {
                    return params.value
                  } else {
                    return ''
                  }
                },
                position: 'insideRight'
              }
            },
            data: this.offlineData
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
