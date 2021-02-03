<template>
  <div v-cloak :style="{'min-height': heightBox + 'px', 'height': heightBox + 'px'}">
    <div class="top-wrap">
      <div class="top-title">
        返修管理
      </div>
      <div class="top-tabs-box"
           style="line-height: 40px;padding-top: 3px;color: #000;font-size: 15px;padding-left: 10px;">
        返修工单统计
      </div>
    </div>
    <div class="content-wrap" style="position: relative;top: 54px;overflow-y: auto;height: calc(100% - 115px)">
      <div class="chart-wrap " style="height: 100%;padding: 0px 10px;margin-bottom: 0px;">
        <div style="width: 100%;height: 100%">
          <!--          <div style="width: 100%;height: calc(100% - 0px);" ref="chart"></div>-->
          <el-form ref="formQueryState" class="reset-form" style="margin: 0px auto 0px;width: 80%;padding-top: 20px;"
                   :model="form" label-width="80px" size="mini">
            <el-form-item label="时间:">
              <el-select v-model="form.time" size="mini" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="最近一周" value="7"></el-option>
                <el-option label="最近一月" value="30"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="返修状态:">
              <el-select v-model="form.state" size="mini" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="不通过" value="1"></el-option>
                <el-option label="审核" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地市:">
              <el-select v-model="form.city" size="mini" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="成都" value="1"></el-option>
                <el-option label="攀枝花" value="2"></el-option>
              </el-select>
            </el-form-item>
              <div style="text-align: center">
                <el-button type="primary" style="margin-left: 0px;">查询</el-button>
              </div>
          </el-form>

          <div style="height: 1px;background: #ddd;margin: 15px 0px;"></div>

          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column prop="city" :label="labelHea"></el-table-column>
            <el-table-column prop="week" width="50" label="一周内"></el-table-column>
            <el-table-column prop="month" width="50" label="半月内"></el-table-column>
            <el-table-column prop="other" width="60" label="超过半月"></el-table-column>
            <el-table-column prop="total" width="60" label="累计返修"></el-table-column>
          </el-table>

        </div>
      </div>
    </div>
    <tabbar></tabbar>
  </div>

</template>

<script>
import tabbar from '../../components/tabbar'
import api from '../../util/api'
import Watermark from '@/util/watermark'

export default {
  name: 'index',
  components: {
    tabbar
  },
  data () {
    return {
      roleNum: '', // 账号类型
      form: {
        time: '',
        state: '',
        city: '',
      },
      labelHea: '',
      tableData: [{
        city: '巴中',
        week: 5,
        month: '-',
        other: '-',
        total: 12
      }],
      heightFix: 280,
      heightBox: '',
      cityName: [], // 所属城市名称
      totalArr: [], // 设备总量
      offlineArr: [] // 返修数量
    }
  },
  created() {
    this.init()
  },
  updated: function () {
    this.lineChart()
  },

  watch: {
    offlineArr () {
      this.data = this.dataArr
      this.lineChart()
    }

  },
  async mounted () {
    let account = window.sessionStorage.getItem('account')
    let mobile = window.sessionStorage.getItem('mobile')
    Watermark.set(account + '   ' + mobile)
    this.heightBox = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    const {data: {code, data}} = await api.get(this.GLOBAL.BASE_URL + '/api/repair/repairOrderReport', {})
    if (code === 0) {
      this.cityName = []
      this.totalArr = []
      this.offlineArr = []

      for (let i in data) {
        // 将每个数据放相应的数据组里面，排序要相同
        let names = ''
        if (data[i].nameCn.length > 4) {
          names = data[i].nameCn.substring(0, 4)
        } else {
          names = data[i].nameCn
        }
        this.cityName.push(names)
        this.totalArr.push(Math.floor(parseInt(data[i].sum)))
        this.offlineArr.push(Math.floor(parseInt(data[i].repairSum)))
      }

      // this.lineChart()
    }
  },
  methods: {
    init() {
      let role = window.sessionStorage.getItem('role');
      this.roleNum = role;
      if (this.roleNum === '10') {
        this.labelHea = '区县'
      }else {
        this.labelHea = '地市'
      }
    },

    lineChart () {
      // 基于准备好的dom，初始化echarts实例
      let barId = this.$refs.chart
      if (barId) {
        let myChart = this.$echarts.init(barId)
        myChart.setOption({
          color: ['#00b050', '#b0ad07'],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (data) {
              var color = ['#00b050', '#b0ad07']
              var fmt = data[0].name
              for (var i = 0; i < data.length; i++) {
                fmt += '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + color[i] + '"></span>' + data[i].seriesName + ':'
                if (!isNaN(data[i].value)) {
                  fmt += data[i].value + '台'
                } else {
                  fmt += '0台'
                }
              }
              return fmt
            }
            // formatter: function (data) {
            //   return '{b} <br/>{a0} : {c0} 台<br/>{a1} : {c1} 台'
            // }
          },
          legend: {
            textStyle: {
              // color: '#fff'
            },
            data: ['总量', '返修数量']
          },
          grid: {
            left: '0',
            right: '3%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            show: true,
            type: 'value',
            axisLabel: {
              // color: '#ddd',
              fontSize: '12px',
              // rotate: 45,
              interval: 0
            },
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                // color: '#ddd'
              }
            },
            axisTick: {
              alignWithLabel: true
            }
          },
          yAxis: {
            type: 'category',
            axisLabel: {
              // color: '#ddd',
              fontSize: '16px',
              rotate: 0,
              interval: 0
            },
            // max: 40,
            axisLine: {
              lineStyle: {
                // color: '#ddd'
              }
            },
            axisTick: {
              alignWithLabel: true
            },
            data: this.cityName
            // data: ['阿坝', '巴中', '成都', '达州', '德阳', '甘孜', '广安', '广元', '乐山', '凉山', '泸州', '眉山', '绵阳', '南充', '内江', '攀枝花', '遂宁', '天府', '雅安', '宜宾', '资阳', '自贡']
          },
          series: [
            {
              name: '总量',
              type: 'bar',
              label: {
                normal: {
                  show: true,
                  position: 'inside'
                }
              },
              data: this.totalArr
            },
            {
              name: '返修数量',
              type: 'bar',
              barGap: '-100%',
              label: {
                normal: {
                  show: true,
                  position: 'insideRight'
                }
              },
              data: this.offlineArr
            }
          ]
        })
        myChart.resize()
        setTimeout(function () {
          // 绘制图表
          myChart.resize()
        }, 20)
        myChart.on('click', (params) => {
        })
      }
    }
  }
}
</script>

<style>
@import "../../../static/scss/reset.css";
@import "../../../static/scss/com.css";
</style>
<style scoped lang="scss">
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 10px;
}

 /deep/ .el-table .cell {
  line-height: 16px;
  padding: 0px 5px;
}

 /deep/ .el-table--small td {
  padding: 4px 0px;
}

 /deep/ .el-table--small th {
  padding: 6px 0px;
}
</style>
