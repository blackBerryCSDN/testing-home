<template>
  <div style="height: 100%;">
    <!--头部元素-->
    <div class="top-wrap">
      <div class="top-title">
        测试
      </div>
      <div class="top-tabs-box">
        <div style="display: block;">
          <el-tabs v-model="activeName" type="card" @tab-click="tabsClick">
            <el-tab-pane label="测试demo"  :lazy=true name="first">
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <!--内容元素--------------start-->
    <div class="content-wrap" >
      <div id="jumpPage0"  style="padding-top: 40px;" >
        <div class="chart-wrap">
          <div class="chart-title chart-line"> <i class="icon-style"></i>测试demo</div>
          <div class="chart-body" style="">
            <div style="height: 300px;margin-bottom: 10px;width: 100%;" id="mapChart"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      activeName: 'first',
      scroll: ''
    }
  },
  mounted () {
    this.mapChart()
  },
  methods: {
    mapChart () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('mapChart'))
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
          x: 'left',
          y: 'bottom',
          splitList: [
            {start: 90},
            {start: 80, end: 90},
            {start: 70, end: 80},
            {end: 70}
            // {start: 200, end: 300},
            // {start: 100, end: 200},
          ],
          textStyle: {
            color: '#fff'
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
            name: '启动次数', // 浮动框的标题
            type: 'map',
            geoIndex: 0,
            data: [
              {name: '成都', value: parseInt(Math.random() * 100) + 50},
              {name: '阿坝', value: parseInt(Math.random() * 100) + 10},
              {name: '甘孜', value: parseInt(Math.random() * 100) + 40},
              {name: '凉山', value: parseInt(Math.random() * 100) + 60},
              {name: '攀枝花', value: parseInt(Math.random() * 100) + 1},
              {name: '雅安', value: parseInt(Math.random() * 100) + 50},
              {name: '乐山', value: parseInt(Math.random() * 100) + 1},
              {name: '广元', value: parseInt(Math.random() * 100) + 1},
              {name: '巴中', value: parseInt(Math.random() * 100) + 50},
              {name: '达州', value: parseInt(Math.random() * 100) + 1},
              {name: '绵阳', value: parseInt(Math.random() * 100) + 40},
              {name: '南充', value: parseInt(Math.random() * 100) + 40},
              {name: '德阳', value: parseInt(Math.random() * 100) + 1},
              {name: '广安', value: parseInt(Math.random() * 100) + 20},
              {name: '遂宁', value: parseInt(Math.random() * 100) + 50},
              {name: '滋养', value: parseInt(Math.random() * 100) + 50},
              {name: '自贡', value: parseInt(Math.random() * 100) + 1},
              {name: '宜宾', value: parseInt(Math.random() * 100) + 60},
              {name: '泸州', value: parseInt(Math.random() * 100) + 50},
              {name: '内江', value: parseInt(Math.random() * 100) + 1},
              {name: '眉山', value: parseInt(Math.random() * 100) + 40},
              {name: '资阳', value: parseInt(Math.random() * 100) + 1}
            ]// 这里就是数据，即数组可以单独放在外面也可以直接写
          }
        ]
      })
      myChart.resize()
    },
    tabsClick (tab, event) {
      // let index = tab._data.index
      // document.getElementById('jumpPage' + index).scrollIntoView(true)
    }
  }
}
</script>
<style>
  @import "../../../static/scss/reset.css";
</style>
<style scoped lang="scss">
  @import "../../../static/scss/com.css";
</style>
