<template>
  <div>
    <div class="top-wrap">
      <div class="top-title">
        探针概况
      </div>
      <div class="top-tabs-box" style="line-height: 40px;padding-top: 3px;color: #000;font-size: 15px;padding-left: 10px;">
        全网概况
      </div>
    </div>
    <div class="content-wrap" style="padding-top: 54px;padding-bottom: 50px;">
      <div class="chart-wrap padding-top50">
        <div class="chart-body">
          <div id="generalDiv" style="width: 100%;height: calc(100vh - 204px)"></div>
        </div>
      </div>
    </div>

    <tabbar></tabbar>
  </div>
</template>

<script>
import tabbar from '../../components/tabbar'
import api from '@/util/api'
export default {
  name: 'general',
  components: {
    tabbar
  },
  data () {
    return {
      chart: '',
      data: {}
    }
  },
  created () {
  },
  mounted () {
    api.get(this.GLOBAL.BASE_URL + '/device/getDeviceGeneral', {}).then(res => {
      this.data = res.data.data
      this.initChart()
      // this.resize()
    })
  },
  methods: {
    initChart () {
      this.chart = this.$echarts.init(document.getElementById('generalDiv'))
      const citys = []
      const onlines = []
      const offlines = []
      for (const key in this.data) {
        citys.push(key)
        onlines.push(this.data[key].online)
        offlines.push(this.data[key].offline)
      }
      console.log('online',JSON.stringify(onlines));
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: citys
        },
        series: [
          {
            name: '在线',
            type: 'bar',
            stack: '数量',
            label: {
              show: false,
              position: 'insideRight'
            },
            data: onlines
          },
          {
            name: '离线',
            type: 'bar',
            stack: '数量',
            label: {
              show: false,
              position: 'insideRight'
            },
            data: offlines
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
<style>
  @import "../../../static/scss/reset.css";
</style>
<style scoped lang="scss">
  @import "../../../static/scss/com.css";
  .probe-wrap {
    padding: 0px 10px;

    .probe-title {
      color: #000;
    }
  }

</style>
