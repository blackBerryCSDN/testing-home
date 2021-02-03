<template>
  <div>
    <div align="center" style="padding: 10px 0px;" v-if="scoreValue.length>0"> 今天最低：{{scoreValue[0].value}} 分， 最高{{scoreValue[scoreValue.length-1].value}}分，平均 {{avgScore}}分</div>
    <div id="main" style="height:400px;"></div>
    <div align="center" style="padding: 30px 0px 0px;">
      说明：视图展示今天0点到现在全省关键指标数据。
    </div>
  </div>
</template>

<script>
import api from '@/util/api'
export default {
  name: `scMap`,
  data () {
    return {
      score: [
        {start: 90},
        {end: 60},
        {start: 80, end: 90},
        {start: 60, end: 80}

        // {start: 200, end: 300},
        // {start: 100, end: 200},
      ],
      chart: null,
      avgScore: '',
      scoreValue: []
    }
  },
  async created () {
    const res = await api.get(this.GLOBAL.BASE_URL + '/api/quality/cityScore', {})
    console.log('ddddddd',JSON.stringify(res));
    const data = res.data.data
    this.avgScore = data.avgScore
    data.citys.forEach(item => {
      const d = {}
      d.name = item.cityName
      d.value = item.score
      this.scoreValue.push(d)
    })
  },
  mounted () {
    this.initChart()
  },
  methods: {
    initChart () {
      let myChart = this.$echarts.init(document.getElementById('main'))
      this.$axios.get('./../../static/sc.json').then(res => {
        this.$echarts.registerMap('sc', res.data, {})
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>{c}'
          },
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
          series: [
            {
              name: '西城',
              type: 'map',
              mapType: 'sc',
              aspectScale: 0.85, // 地图长度比
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    color: '#000'
                  }
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    color: '#333'
                  }
                }
              },
              data: this.scoreValue
            }
          ]
        }
        myChart.setOption(option)
      }).catch(err => {
        console.log(err, 'eeeeeeeee')
      })
    }
  }
}
</script>

<style scoped>

</style>
