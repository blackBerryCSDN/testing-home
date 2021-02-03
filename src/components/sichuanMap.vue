<template>
  <div>
    <div>
      <div style="width: 100%;" :style="{height: height + 'px'}" :id=id></div>
    </div>
  </div>
</template>

<script>
import '../../static/plugins/echarts3/js/sichuan.js'
export default {
  name: 'singleChart',
  props: {
    id: { type: String },
    dataArr: { type: Array },
    height: { type: Number },
    scoreRange: { type: Array }
  },
  data () {
    return {
      data: this.dataArr,
      score: [
        {start: 90},
        {end: 60},
        {start: 80, end: 90},
        {start: 60, end: 80}

        // {start: 200, end: 300},
        // {start: 100, end: 200},
      ]
    }
  },
  watch: {
    dataArr () {
      this.data = this.dataArr
      this.mapChart()
    },
    scoreRange () {
      this.score = this.scoreRange
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
        title: {
          show: false,
          text: ''
        },
        backgroundColor: 'transparent',
        tooltip: {},
        visualMap: {
          show: true,
          x: 'right',
          y: 'bottom',
          splitList: this.score,
          // splitList: this.score,
          textStyle: {
            // color: '#fff'
          },
          color: [
            // '#5475f5',
            '#47c47d',
            '#f1da66',
            '#ebad8e',
            '#da432a'
            // '#9fb5ea'
          ]
        },
        geo: { // 这个是重点配置区
          map: '四川', // 表示中国地图
          name: '四川',
          roam: false,
          zoom: 1.2,
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: '#000'
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis: {
              areaColor: null,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'geo' // 对应上方配置
          },
          {
            name: '评分', // 浮动框的标题
            type: 'map',
            geoIndex: 0,
            data: this.data// 这里就是数据，即数组可以单独放在外面也可以直接写
          }
        ]
      })
      myChart.resize()
    }
  }
}
</script>

<style scoped>

</style>
