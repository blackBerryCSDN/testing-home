<template>
  <div v-cloak  :style="{'min-height': heightBox + 'px'}">
    <div class="top-wrap">
      <div class="top-title">
        返修管理
      </div>
      <div class="top-tabs-box"></div>
    </div>
    <div class="content-wrap">
      <div class="chart-wrap " style="padding-top: 50px;">
        <el-tabs v-model="activeName"  @tab-click="handleClick">
          <!-- 新建工单 -->
          <el-tab-pane label="新建工单" name="tabs0" key='0' :lazy=true>
            <addOrder> </addOrder>
          </el-tab-pane>
          <!-- 代办工单 -->
          <el-tab-pane label="代办工单" name="tabs1" key='1' :lazy=true>
            <el-collapse v-model="activeNames" accordion @change="handleChangeCollapse">

              <el-collapse-item v-for="(item, index) in orderArr" :key="index" :name="index">
                <template slot="title">
                  <span class="collapse-title">{{ item.name }} {{ item.type==='0' ? '（待审）' : '（审核驳回）'}}</span>
                  <!--<i class="fa" :class="item.type==='0' ? 'fa-clock-o' : 'fa-undo'" aria-hidden="true"></i>-->
                </template>
                <div style="text-align: right;" class="fa-box">
                  <el-button type="success" size="mini" icon="fa fa-refresh" @click="refreshSubmit()">重新提交</el-button>
                  <!--<el-button type="primary" size="mini" icon="fa fa-check" @click="updateOrder()">更新</el-button>-->
                  <el-button type="danger" size="mini" icon="fa fa-times" @click="deleteOrder()">删除</el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <!-- 状态查询 -->
          <el-tab-pane label="状态查询" name="tabs2" key='2' :lazy=true>
            <el-form ref="formQueryState" :model="formQueryState" :rules="rules" label-width="80px" size="mini">
              <el-form-item label="" prop="name">
                <el-input v-model="formQueryState.name" placeholder="请输入设备名称"></el-input>
              </el-form-item>
              <el-form-item label="粒度" class="time-input date-input-box" prop="time">
                <el-select v-model="formQueryState.time" placeholder="请选择粒度">
                  <el-option
                    v-for="item in queryTimeOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" class="time-input date-input-box">
                <el-button size="mini" style="width: 50%;" type="primary" @click="onSubmitQueryState('formQueryState')">查询</el-button>
              </el-form-item>
            </el-form>
            <div style="padding: 20px;background: rgba(0,0,0,0.5);text-align: center;" v-if="queryDataNull">
              暂无数据
            </div>
            <div style="padding-top: 10px;">
              <el-collapse v-model="queryCollapse" accordion @change="handleChangeCollapse">
                <el-collapse-item v-for="(item, index) in queryCollapseArr" :key="index" :name="index">
                  <template slot="title">
                    <span class="collapse-title">{{ item.name }}</span>
                    <!--<i class="fa" :class="item.type==='0' ? 'fa-clock-o' : 'fa-undo'" aria-hidden="true"></i>-->
                  </template>
                  <div style="min-height: 100px;" class="fa-box"
                       v-loading="queryloading"
                       element-loading-text="加载中"
                       element-loading-spinner="el-icon-loading"
                       element-loading-background="rgba(0, 0, 0, 0.8)">
                    <ul :key="index" v-for="(items, index) in stateQuery" >
                      <li class="flex-center" :key="index" v-for="(item, index) in items">
                        <div class="flex-label">{{item.name}}：</div>
                        <div class="flex-value">{{item.value}}</div>
                      </li>
                    </ul>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-tab-pane>
          <!-- 返修统计 -->
          <el-tab-pane label="返修统计" name="tabs3" key='3' :lazy=true>
            <!--<div v-if="tabs3 === activeName" style="width: 100%;height: 450px;" ref="barTotal" id="barTotal"></div>-->
            <div v-if="tabs3 === activeName" style="width: 100%;height: 450px;" ref="chart"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import addOrder from './add'
import statistics from './statistics'
import api from '../../util/api'
export default {
  name: 'index',
  components: {
    addOrder,
    statistics
  },
  data () {
    return {
      activeName: 'tabs0',
      tabs3: 'tabs3',
      heightBox: '',
      activeNames: [0], // 待办工单默认面板索引
      formQueryState: { // 状态查询表单
        name: '',
        time: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入终端名称', trigger: 'blur'}
        ],
        time: [
          {required: true, message: '请选择粒度', trigger: 'blur'}
        ]
      },
      queryTimeOpt: [ // 时间粒度
        {value: '1', label: '最近三天'},
        {value: '2', label: '最近一周'},
        {value: '3', label: '最近一月'},
        {value: '4', label: '全部'}
      ],
      queryDataNull: false, // 状态查询无数据显示
      queryloading: true, // 状态查询加载状态
      queryCollapse: '', // 状态查询默认面板索引
      orderArr: [], // 待办工单数据
      stateQuery: [], // 查询得到的数据
      queryCollapseArr: [], // 工单查询到数据
      cityName: [], // 所属城市名称
      totalArr: [], // 设备总量
      offlineArr: [] // 返修数量
    }
  },
  updated: function () {
    this.lineChart()
  },
  created () {

  },
  async mounted () {
    this.heightBox = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    // 根据自身查看相关数据  订单状况请求数据 repairOrderReport
    // const {data: { code, data }} = await api.get(self.GLOBAL.BASE_URL + '/api/basic/queryCitys', {})
    const {data: { code, data }} = await api.get(this.GLOBAL.BASE_URL + '/api/repair/repairOrderReport', {})
    if (code === 0) {
      this.cityName = []
      this.totalArr = []
      this.offlineArr = []
      for (let i in data) {
        // 将每个数据放相应的数据组里面，排序要相同
        this.cityName.push(data[i].nameCn)
        this.totalArr.push(Math.floor(parseInt(data[i].sum)))
        this.offlineArr.push(Math.floor(parseInt(data[i].repairSum)))
      }
    }
  },
  methods: {
    onSubmitQueryState (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 假数据
          this.queryCollapseArr = [
            {name: '20190424120921广元'}
          ]
          // 无数据时改为true
          this.queryDataNull = false
        } else {
          cosole.log('error submit!!')
          return false
        }
      })
    },
    handleClick (tab, event) {

    },
    handleChangeCollapse: function (val) {
      // 判断是否切换到其他面板
      if (val === '') {
        return
      }
      // 清空数据
      this.stateQuery = []
      this.queryloading = true
      // 测试使用---------
      setTimeout(() => {
        this.stateQuery = [
          [
            {name: '设备名称', value: '广元设备'},
            {name: '时间', value: '2019-05-01'},
            {name: '签收状态', value: '未签收'},
            {name: '是否驳回', value: '否'},
            {name: '返修状态', value: '返修中'}
          ]
        ]
        if (this.stateQuery.length > 0) {
          this.queryloading = false
        }
      }, 500)
    },
    refreshSubmit (name) {
      console.log('提交了')
    },
    updateOrder (name) {

    },
    deleteOrder (name) {
      console.log('delete')
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
            }
          },
          legend: {
            textStyle: {
              color: '#fff'
            },
            data: ['总量', '返修数量']
          },
          grid: {
            left: '0',
            right: '0',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            show: true,
            type: 'value',
            axisLabel: {
              color: '#ddd',
              fontSize: '12px',
              rotate: 45,
              interval: 0
            },
            axisLine: {
              lineStyle: {
                color: '#ddd'
              }
            },
            axisTick: {
              alignWithLabel: true
            }
          },
          yAxis: {
            type: 'category',
            axisLabel: {
              color: '#ddd',
              fontSize: '16px',
              rotate: 0,
              interval: 0
            },
            axisLine: {
              lineStyle: {
                color: '#ddd'
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
              stack: '总量',
              barWidth: '25%',
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
              stack: '总量',
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
          let val = params
        })
      }
    }
  }
}
</script>

<style>
  @import "../../../static/scss/reset.css";
  .fa-box .fa{
    font-size: 11px;
    color: #eaf7f8;
  }
  .el-collapse{
    border-top: 1px solid gray;
  }
  .el-collapse-item__header{
    height: 35px;
    line-height: 35px;
    background: rgba(0,0,0,0.5);
    color: #fff;
    padding: 0px 10px;
    /*border-bottom: 1px solid rgba(0,0,0,0.9);*/
    border-bottom: 1px solid gray;
  }
  .el-collapse-item__content{
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    color:#eee;
  }
  .el-collapse-item__wrap{
    background: rgba(0,0,0,0.3);
    border-bottom: 1px solid gray;
  }
  .fa{
    padding-right: 4px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: auto;
    min-width: 220px;
  }
  .el-picker-panel{
    color: gray;
  }
  .el-input , .el-textarea__inner{
    position: relative;
    font-size: 14px;
    display: inline-block;
    /*width: calc(100% - 40px);*/
  }
  .el-input__inner, .el-textarea__inner {
    background: transparent;
    color: #fff;
  }
  .el-form-item__label{
    color: #fff;
    padding: 0 7px 0 0;
  }
  .el-icon-loading{
    font-size: 20px;
  }
</style>
<style scoped lang="scss">
  @import "../../../static/scss/com.css";
  .top-wrap .top-title{
    min-width: 100px;
    /*border-right: none;*/
  }
  .flex-center{
    padding: 5px 15px;
    /*display: flex;*/
    /*display: -webkit-flex;*/
    /*justify-content:space-around;*/
  }
  .flex-label{
    min-width: 60px;
    display: inline-block;
    color: orange;
  }
  .flex-value{
    display: inline-block;
  }
  .top-wrap .top-title{
    min-width: 100px;
    /*border-right: none;*/
  }
  .collapse-title{
    padding: 0px 10px 0px 0px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

</style>
