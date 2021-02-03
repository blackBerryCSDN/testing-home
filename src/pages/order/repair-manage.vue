<template>
  <div style="height: 100%;">
    <div class="top-wrap">
      <div class="top-title">
        返修管理
      </div>
      <div class="top-tabs-box"
           style="line-height: 40px;padding-top: 3px;color: #000;font-size: 15px;padding-left: 10px;">
        返修工单管理
      </div>
    </div>
    <div class="content-wrap" style="position: relative;top: 54px;overflow-y: auto;height: calc(100% - 110px);max-height: calc(100% - 110px);">
      <div class="chart-wrap ">
        <!-- 表单查询 -->
        <el-form ref="formQueryState" :model="formQueryState"  label-width="80px" size="mini">
          <el-form-item label="工单号" prop="orderNo">
            <el-select v-model="formQueryState.orderNo"  placeholder="请选择">
              <el-option
                v-for="item in orderNumber"
                :key="item.orderNo"
                :label="item.orderName"
                :value="item.orderName">
              </el-option>
            </el-select>
          </el-form-item>
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
          <el-form-item label="状态" prop="status">
            <el-select v-model="formQueryState.status"  placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间" class="time-input date-input-box" prop="time">
            <div style="margin-top: 0px">
              <el-radio-group v-model="formQueryState.time">
                <el-radio :label="30">最近</el-radio>
                <el-radio :label="7">一周</el-radio>
                <el-radio :label='null'>全部</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="" class="time-input date-input-box">
            <el-button size="mini" style="width: 50%;" type="primary" @click="onSubmitQuery('formQueryState')">查询</el-button>
          </el-form-item>
        </el-form>

        <!-- 分割线 -->
        <div style="height: 1px;background: #ddd;margin: 15px 0px;"></div>

        <!-- 表单结果 -->
        <el-table
          :data="tableData"
          border
          @cell-click="handle"
          style="width: 100%">
          <el-table-column prop="orderNo" label="工单号"></el-table-column>
          <el-table-column prop="tsName" label="设备名称"></el-table-column>
          <el-table-column prop="status"  label="状态"></el-table-column>
        </el-table>
      </div>
    </div>
    <tabbar></tabbar>
  </div>
</template>

<script>
  import api from '../../util/api'
  import Watermark from '@/util/watermark'
  import tabbar from '../../components/tabbar'

  export default {
    name: 'repair-manage',
    components: {
      tabbar
    },
    data () {
      return {
        roleNum: '', // 账号类型
        formQueryState: { // 状态查询表单
          orderNo: '',
          tsName: '',
          status: [],
          time: 30
        },
        orderNumber: [],
        repairs: [],
        statusOptions: [
          {
            value: '1',
            label: '全部'
          },
          {
            value: '2',
            label: '地市返修中'
          },
          {
            value: '3',
            label: '厂家检测中'
          },
          {
            value: '4',
            label: '送检不符合要求'
          },
          {
            value: '5',
            label: '已维修返回中'
          },
          {
            value: '6',
            label: '地市已签收'
          }
        ],
        tableData: [
          {
          orderNo: 'SF202003270003',
          tsName: '南充市阆中县中江OLT001-C300',
          status: '地市返修中'
          },
          {
            orderNo: 'SF202003270003',
            tsName: '南充市阆中县中江OLT001-C300',
            status: '厂家检测中'
          },
          {
            orderNo: 'SF202003270003',
            tsName: '南充市阆中县中江OLT001-C300',
            status: '送检不符合要求'
          },
          {
            orderNo: 'SF202003270003',
            tsName: '南充市阆中县中江OLT001-C300',
            status: '已维修返回中'
          },
          {
            orderNo: 'SF202003270003',
            tsName: '南充市阆中县中江OLT001-C300',
            status: '地市已签收'
          }
        ], // 表格数据
      }
    },
    created () {
      // 8厂家  9省  10 地市
      let role = window.sessionStorage.getItem('role')
      this.roleNum = role
      console.log(this.roleNum);
    },
    mounted: async function () {
      let account = window.sessionStorage.getItem('account')
      let mobile = window.sessionStorage.getItem('mobile')
      Watermark.set(account + '   ' + mobile)
      let res = await api.get(this.GLOBAL.BASE_URL + '/api/repair/queryRepairOrder', {role: 2})
      if (res.data.code === 0) {
        this.repairs = []
        this.repairs = res.data.data.repairs
        console.log(this.repairs);
      }
    },
    methods: {
      // 提交查询
      onSubmitQuery (formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            console.log('数据提交成功');
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },

      // 点击表格行
      handle(row) {
        if (this.roleNum === '9') {
          return false
        }else {
          this.$router.push({
            path: '/manage-detail',
            query: {
              id: row.orderNo,
              tsName: row.tsName,
              status: row.status
            }
          })
        }
      }
    }
  }
</script>

<style>
  @import "../../../static/scss/reset.css";

  .fa-box .fa {
    font-size: 11px;
    /*color: #eaf7f8;*/
  }

</style>
<style scoped lang="scss">
  @import "../../../static/scss/com.css";
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

