<template>
  <div>
    <div>
      <div style="text-align: center;padding: 0px 0px 5px 0px;">
        <!--<div style="padding-bottom: 5px;height: 14px;"> {{ getShowTime(xUnit, axisVal) }}</div>-->
        <!--<div><span v-show="mobileVal !== null">移动:{{ mobileVal }} {{unit}} &nbsp;</span> <span v-show="linkVal !== null"> 联通:{{ linkVal }} {{unit}}  &nbsp;</span> <span v-show="telVal !== null ">电信:{{ telVal }} {{unit}} </span></div>-->
<!--
        <div><span >移动:{{ getUnit(mobileVal,unit)}} &nbsp;</span> <span> 联通:{{ getUnit(linkVal,unit)}} &nbsp;</span> <span>电信:{{ getUnit(telVal,unit)}} </span></div>
-->
      </div>
      <div style="width: 100%;height: calc(100vh - 295px)" :id=id ></div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'multiChart',
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
    linkDataArr: {
      type: Array,
      default () {
        return {}
      }
    },
    telDataArr: {
      type: Array,
      default () {
        return {}
      }
    },
    mobileDataArr: {
      type: Array,
      default () {
        return {}
      }
    },
    height: {
      type: Number,
      default () {
        return {}
      }
    },
    xTransferData: {
      type: Array,
      default () {
        return {}
      }
    },
    unit: {
      type: String,
      default () {
        return {}
      }
    },
    xUnit: {
      type: String,
      default () {
        return {}
      }
    },
    perData: {
      type: String,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      axisVal: '',
      mobileVal: null,
      telVal: null,
      linkVal: null,
      myChart: '',
      seriesType: '',
      interval: 0
    }
  },
  beforeCreate () {

  },
  created () {

  },
  update () {
    // console.log(22222)
  },
  watch: {
    linkDataArr (newValue, oldValue) {
      // console.log('newValue', newValue)
      // console.log('oldValue', oldValue)
      this.linkDataArr = newValue
      this.getInitValue()
      this.mapChart()
    },
    telDataArr (newValue, oldValue) {
      // console.log('newValue', newValue)
      // console.log('oldValue', oldValue)
      this.telDataArr = newValue
      this.getInitValue()
      this.mapChart()
    },
    mobileDataArr (newValue, oldValue) {
      // console.log('newValue', newValue)
      // console.log('oldValue', oldValue)
      this.mobileDataArr = newValue
      this.getInitValue()
      this.mapChart()
    },
    xUnit (newValue, oldValue) {
      // console.log('newValue', newValue)
      // console.log('oldValue', oldValue)
      this.xUnit = newValue
      this.getInitValue()
      this.mapChart()
    }
  },
  mounted () {
    // this.axisVal = this.telDataArr[0]
    // 进行初始化表格
    this.getInitValue()
    this.initChart()
  },

  methods: {
    getShowTime: function (u, value) {
      // let val = value
      // console.log(u, value)
      // if (u === '时') {
      //   val = '123'
      // }
      let date = new Date()
      let year = date.getFullYear()
      let mon = date.getMonth() + 1
      let nowMon = mon > 10 ? mon : '0' + mon
      if (value !== undefined) {
        if (u === '分') { // 201905141701
          return value.substring(0, 4) + '年 ' + value.substring(4, 6) + '月 ' + value.substring(6, 8) + '日 ' + value.substring(8, 10) + ':' + value.substring(10, 12)
        } else if (u === '时') { // 时 19-05-14 16
          return '20' + value.substring(0, 2) + '年 ' + value.substring(3, 5) + '月 ' + value.substring(6, 8) + '日 ' + value.substring(9, 11) + '点'
        } else if (u === '日') { // 日 19-05-14
          return '20' + value.substring(0, 2) + '年 ' + value.substring(3, 5) + ' 月 ' + value.substring(6, 8) + '日 '
        } else if (u === '周') { // 周 第3周
          return year + '年 ' + nowMon + '月 ' + value
        } else {
          return '20' + value.substring(0, 2) + '年 ' + value.substring(3, 5) + '月 ' + value.substring(6, 8) + '日 ' + value.substring(9, 11) + ':00'
        }
      }
    },
    getUnit: function (data, unit) {
      if (data === undefined) {
        return '无'
      }

      if (unit === '%') {
        // data = Number(data * 100).toFixed(1)
        data = data.toFixed(1)
      } else {
        data = Number(data).toFixed(1)
      }
      return data + unit
    },
    getInitValue () {
      let _this = this
      let num = _this.xTransferData.length - 1

      _this.axisVal = _this.xData[num]
      //  数据时整段时间,只是显示相关的日期 按照月日年进行判断

      if (_this.perData === 'Month') {
        _this.axisVal = _this.xTransferData[num]
      }
      if (_this.linkDataArr[num] === null) {
        _this.linkVal = undefined
      } else {
        _this.linkVal = _this.linkDataArr[num]
      }

      if (_this.mobileDataArr[num] === null) {
        _this.mobileVal = undefined
      } else {
        _this.mobileVal = _this.mobileDataArr[num]
      }
      if (_this.telDataArr[num] === null) {
        _this.telVal = undefined
      } else {
        _this.telVal = _this.telDataArr[num]
      }
    },
    initChart () {
      let _this = this
      _this.myChart = _this.$echarts.init(document.getElementById(this.id))
      _this.myChart.setOption({
        color: ['#7fe036', '#1296DB', '#D81E06'],
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
          left: '22',
          right: '30',
          bottom: '0%',
          containLabel: true
        },
        legend: {
          show: false,
          left: 'right',
          selectedMode: false,
          textStyle: {
            color: '#000',
            // height: 10,
            data: ['移动', '电信', '联通']
          }
        },
        xAxis: [
          {
            type: 'category',
            // data: this.xData,
            axisLabel: {
              color: '#000',
              fontSize: '12px'
              // rotate: 45
            },
            axisLine: {
              lineStyle: {
                color: '#000'
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
            name: _this.unit,
            // nameLocation: 'end',
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
        series: [
          {
            name: '移动',
            type: 'line',
            smooth: true,
            color: '#7fe036'
          },
          {
            name: '电信',
            type: 'line',
            color: '#1296DB'
          },
          {
            name: '联通',
            type: 'line',
            smooth: true,
            symbol: 'none',
            color: '#D81E06'
          }
        ]
      })
    },
    mapChart () {
      // 基于准备好的dom，初始化echarts实例
      let _this = this
      if (_this.perData === 'Minute' || _this.perData === 'Hour') {
        _this.seriesData = 'line'
      } else {
        _this.seriesData = 'bar'
      }
      if (_this.perData === 'Minute') {
        _this.interval = 5
      } else {
        _this.interval = 0
      }
      // 绘制图表
      _this.myChart.setOption({
        tooltip: {
          formatter: function (data) {
            var color = ['#7fe036', '#1296DB', '#D81E06']
            var fmt = ''
            if (_this.perData === 'week') {
              let index = data[0].name.substring(1, 2)
              let weekList = _this.getWeekList()
              fmt = weekList[index - 1]
            } else {
              fmt = data[0].name
            }
            for (var i = 0; i < data.length; i++) {
              fmt += '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + color[i] + '"></span>' + data[i].seriesName + ':' + data[i].value + _this.unit
            }
            return fmt
          }
        },
        xAxis: [
          {
            name: _this.xUnit,
            data: this.xTransferData,
            axisLabel: {
              interval: this.interval,
              rotate: 45
            }
          }
        ],
        yAxis: [
          {
            name: _this.unit,
            type: 'value',
            data: this.yData
          }
        ],
        series: [
          {
            name: '移动',
            type: _this.seriesData,
            smooth: true,
            data: this.mobileDataArr // [20, 30, 40, 50, 60]
          },
          {
            name: '电信',
            type: _this.seriesData,
            smooth: true,
            data: this.telDataArr // [10, 20, 80, 50, 60]
          },
          {
            name: '联通',
            type: _this.seriesData,
            smooth: true,
            data: this.linkDataArr // [20, 40, 40, 50, 60]
          }
        ]
      })
      _this.myChart.on('click', function (params) {
        // console.log(params)
      })
    },
    getWeekList () {
      let date = new Date()// 当前时间
      let today = date.getDate() // 当前日
      date.setDate(1) // 设置成本月第一天
      let month = date.getMonth() + 1// 当前月份
      let w = date.getDay()// 本月第一天的星期
      let day = date.getDate() // 本月起始天
      let arr = []

      if (w !== 1) {
        let end = day + (7 - w)
        if (today === 1) {
          arr.push(`${month < 10 ? '0' + month : month}.${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}.${day < 10 ? '0' + day : day}`)
        } else if (end > today) {
          arr.push(`${month < 10 ? '0' + month : month}.${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${today < 10 ? '0' + today : today}`)
        } else {
          arr.push(`${month < 10 ? '0' + month : month}.${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${end < 10 ? '0' + end : end}`)
        }
        date.setDate(end + 1)
      }
      while (date.getDate() <= today && date.getMonth() + 1 === month) {
        let ww = date.getDay()
        let dd = date.getDate()
        let ee = dd + (7 - ww)
        if (date.getDate() + 7 > today) {
          arr.push(`${month < 10 ? '0' + month : month}.${dd < 10 ? '0' + dd : dd}-${month < 10 ? '0' + month : month}-${today < 10 ? '0' + today : today}`)
        } else {
          arr.push(`${month < 10 ? '0' + month : month}.${dd < 10 ? '0' + dd : dd}-${month < 10 ? '0' + month : month}-${ee < 10 ? '0' + ee : ee}`)
        }
        date.setDate(ee + 1)
      }
      return arr
    }
  }
}
</script>

<style scoped>

</style>
