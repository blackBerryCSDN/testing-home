<template>
  <div style="height: 100%;">
    <div class="top-wrap" style="height: 46px;">
      <div class="top-title">
        返修管理
      </div>
      <div class="top-tabs-box" style="line-height: 40px;padding-top: 3px;color: #000;font-size: 15px;padding-left: 10px;">
        返修状态查询
      </div>
    </div>
    <div class="content-wrap" style="position: relative;top: 54px;height: calc(100% - 110px);overflow-y: auto;">
      <div class="chart-wrap ">
        <el-form ref="formQueryState" :model="formQueryState"  label-width="80px" size="mini">
          <el-form-item label="设备名称" prop="name">
            <el-select v-model="formQueryState.tsName"  size="mini" placeholder="请选择">
              <el-option
                v-for="item in repairs"
                :key="item.orderId"
                :label="item.tsName"
                :value="item.tsName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最近" class="time-input date-input-box" prop="time">
            <!--<el-select    style=" width: 100%;" v-model="formQueryState.fromDate" placeholder="请选择粒度">-->
              <!--<el-option-->
                <!--v-for="item in queryTimeOpt"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
              <!--</el-option>-->
            <!--</el-select>-->
            <div style="margin-top: 0px">
              <el-radio-group v-model="formQueryState.fromDate">
              <!--<el-radio-group v-model="formQueryState.fromDate">-->
                <el-radio :label="30">最近</el-radio>
                <el-radio :label="7">一周</el-radio>
                <el-radio :label='null'>全部</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-checkbox-group v-model="formQueryState.status">
                <el-checkbox  v-for="(state,index) in stateOptions" :key="index" :label="state.value">{{state.label}}</el-checkbox>
            </el-checkbox-group>
            <!--<el-select-->
              <!--style=" width: 100%;"-->
              <!--v-model="formQueryState.state"-->
              <!--multiple-->
              <!--collapse-tags-->
              <!--placeholder="请选择状态">-->
              <!--<el-option-->
                <!--v-for="item in stateOptions"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
              <!--</el-option>-->
            <!--</el-select>-->
          </el-form-item>
          <el-form-item label="" class="time-input date-input-box">
            <el-button size="mini" style="width: 50%;" type="primary" @click="onSubmitQuery('formQueryState')">查询</el-button>
          </el-form-item>
        </el-form>
        <div style="padding: 20px;background: rgba(0,0,0,0);text-align: center;" v-if="queryDataNull">
          暂无数据
        </div>
        <div style="padding-top: 10px;">
          <el-collapse v-model="queryCollapse" accordion @change="handleQueryCollapse">
            <el-collapse-item v-for="(item, index) in queryCollapseArr" :key="index" :name="index">
              <template slot="title">
                <span class="collapse-title">设备名称：{{ item.tsName }}</span>
                <!--<i class="fa" :class="item.type==='0' ? 'fa-clock-o' : 'fa-undo'" aria-hidden="true"></i>-->
              </template>
              <div style="min-height: 100px;" class="fa-box">
                <!--<ul :key="index" v-for="(items, index) in queryCollapseArr" >-->
                  <!--<li class="flex-center" :key="index" v-for="(item, index) in items">-->
                    <!--<div class="flex-label">{{item.name}}：</div>-->
                    <!--<div class="flex-value">{{item.value}}</div>-->
                  <!--</li>-->
                <!--</ul>-->
                <ul >
                  <li class="flex-center" >订单ID: {{ item.orderId}}</li>
                  <li class="flex-center" >设备ID: {{ item.tsId}}</li>
                  <li class="flex-center" >设备名称: {{ item.tsName}}</li>
                  <li class="flex-center" >设备地市: {{ item.cityName}}-{{item.districtName}}</li>
                  <li class="flex-center">设备配件：{{getPartType(item.partType)}}</li>
                  <li class="flex-center">维修原因：{{item.resultNote}}</li>
                  <li class="flex-center">设备状态：{{getOption(item.status)}}</li>
                  <li v-if="item.status==2" class="flex-center">驳回原因：{{item.remarks}}</li>
                  <li v-if="item.status==4" class="flex-center">物流进度：{{item.finalLogistics}}</li>
                  <li v-if="item.status==5" class="flex-center">物流单号：{{item.backLogisticsId}}</li>
                  <li class="flex-center">提交时间：{{item.orderTime}}</li>
                </ul>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
   </div>
    <tabbar></tabbar>
  </div>
</template>

<script>
import api from '../../util/api'
import {formatDate, getNewDay} from '../../util/util'
import tabbar from '../../components/tabbar'
import Watermark from '@/util/watermark'

export default {
  name: 'index',
  components: {
    tabbar
  },
  data () {
    return {
      formInline: {
        tsName: ''
      },
      formQueryState: { // 状态查询表单
        tsName: '',
        fromDate: 30,
        status: []
      },
      repairs: [],
      stateOptions: [
        {
          value: '1',
          label: '待审'
        },
        {
          value: '2',
          label: '不通过'
        },
        {
          value: '3',
          label: '已经审核'
        },
        {
          value: '4',
          label: '返修中'
        },
        {
          value: '5',
          label: '返回中'
        },
        {
          value: '6',
          label: '处理完成'
        }
      ],
      queryTimeOpt: [ // 时间粒度
        {value: '3', label: '最近三天'},
        {value: '7', label: '最近一周'},
        {value: '30', label: '最近一月'},
        {value: null, label: '全部'}
      ],
      queryDataNull: false, // 状态查询无数据显示
      // queryloading: true, // 状态查询加载状态
      queryCollapse: '', // 状态查询默认面板索引
      orderArr: [ // 待办工单数据
        {name: '20190424120921-成都', type: '1'},
        {name: '20190424120921-攀枝花', type: '0'},
        {name: '20190424120921-成都', type: '0'},
        {name: '20190424120921-成都', type: '1'}
      ],
      stateQuery: [], // 查询得到的数据
      queryCollapseArr: [] // 工单查询到数据
    }
  },
  created () {

  },
  mounted: async function () {
    let account = window.sessionStorage.getItem('account')
    let mobile = window.sessionStorage.getItem('mobile')
    Watermark.set(account + '   ' + mobile)
    let res = await api.get(this.GLOBAL.BASE_URL + '/api/repair/queryRepairOrder', {role: 2})
    if (res.data.code === 0) {
      this.repairs = []
      this.repairs = res.data.data.repairs
      // for (let i = 1; i < res.data.data.repairs.length; i++) {
      //   if (res.data.data.repairs[i].tsName !== res.data.data.repairs[i - 1].tsName) {
      //     this.repairs.push(res.data.data.repairs[i - 1])
      //   } else {
      //     this.repairs.push(res.data.data.repairs[i])
      //   }
      // }
    }
  },
  methods: {
    getOption (state) {
      let tag = this.stateOptions[parseInt(state) - 1]
      return tag.label
    },
    getPartType (partType) {
      if (partType === '1') {
        return '主机'
      } else if (partType === '2') {
        return '电源适配器'
      } else if (partType === '4') {
        return '主机+电源适配器'
      }
    },
    onSubmitQuery (formName) {
      var _this = this
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let fromDate = null
          if (_this.formQueryState.fromDate !== null) {
            let nowDate = formatDate(new Date(), 'yyyy-MM-dd')
            fromDate = getNewDay(nowDate, _this.formQueryState.fromDate)
          }
          let queryData = {
            name: _this.formQueryState.tsName,
            fromDate: fromDate,
            status: _this.formQueryState.status.join(',')
            // role: 2
          }
          const {data: { code, data }} = await api.get(_this.GLOBAL.BASE_URL + '/api/repair/queryRepairOrder', queryData)
          if (code === 0) {
            this.queryCollapseArr = []
            if (data.repairs.length !== 0) {
              this.queryDataNull = false
              for (var collapse in data.repairs) {
                this.queryCollapseArr.push(data.repairs[collapse])
              }
            } else {
              this.queryDataNull = true
            }
          }
          // // 假数据
          // this.queryCollapseArr = [
          //   {
          //     name: '20190424120921广元',
          //     data: [
          //       {name: '设备名称', value: '广元设备'},
          //       {name: '时间', value: '2019-05-01'},
          //       {name: '签收状态', value: '未签收'},
          //       {name: '是否驳回', value: '否'},
          //       {name: '返修状态', value: '返修中'}
          //     ]
          //   },
          //   {
          //     name: '20190424120921广元',
          //     data: [
          //       {name: '设备名称', value: '广元设备'},
          //       {name: '时间', value: '2019-05-01'},
          //       {name: '签收状态', value: '未签收'},
          //       {name: '是否驳回', value: '否'},
          //       {name: '返修状态', value: '返修中'}
          //     ]
          //   }
          // ]
          // // 无数据时改为true
          // this.queryDataNull = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    handleQueryCollapse: function (val) {
      // 判断是否切换到其他面板
      // if (val === '') {
      //   return
      // }
      // 清空数据
      // this.stateQuery = []
      // this.queryloading = true
      // 测试使用---------
      // setTimeout(() => {
      //   this.stateQuery = [
      //     [
      //       {name: '设备名称', value: '广元设备'},
      //       {name: '时间', value: '2019-05-01'},
      //       {name: '签收状态', value: '未签收'},
      //       {name: '是否驳回', value: '否'},
      //       {name: '返修状态', value: '返修中'}
      //     ]
      //   ]
      //   if (this.stateQuery.length > 0) {
      //     this.queryloading = false
      //   }
      // }, 500)
    },
    updateOrder (name) {

    },
    deleteOrder (name) {
      console.log('delete')
    }
  }
}
</script>

<style>
  @import "../../../static/scss/reset.css";
  .el-radio-group .el-radio{
    /*color: #fff;*/
    margin-right: 15px;
  }
  .el-checkbox-group .el-checkbox{
    margin-right: 15px;
  }
  .el-checkbox__label{
    padding-left: 5px;
  }
  .el-radio__label{
    padding-left: 5px;
  }
  .el-form-item__label {
    /*color: #fff;*/
  }
  .fa-box .fa{
    font-size: 11px;
    /*color: #eaf7f8;*/
  }
  .el-collapse{
    border-top: 1px solid gray;
  }
  .el-collapse-item__header{
    height: 35px;
    line-height: 35px;
    /*background: rgba(0,0,0,0.5);*/
    /*color: #fff;*/
    padding: 0px 10px;
    /*border-bottom: 1px solid rgba(0,0,0,0.9);*/
    border-bottom: 1px solid gray;
  }
  .el-collapse-item__content{
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    /*color:#eee;*/
  }
  .el-collapse-item__wrap{
    /*background: rgba(0,0,0,0.3);*/
    border-bottom: 1px solid gray;
  }
  .fa{
    padding-right: 4px;
  }
  .el-input__inner{
    background: transparent;
    /*color: #fff;*/
  }
  .el-checkbox, .el-checkbox-button__inner {
    /*color: #fff;*/
  }
  .el-input , .el-textarea__inner{
    position: relative;
    font-size: 14px;
    display: inline-block;
    /*width: calc(100% - 80px);*/
  }
  .el-form-item__content{
    width: calc(100% - 80px);
  }
</style>
<style scoped lang="scss">
  @import "../../../static/scss/com.css";
  .top-wrap .top-title{
    /*min-width: 100px;*/
    /*border-right: none;*/
  }
  .collapse-title{
    padding: 0px 10px 0px 0px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
</style>
