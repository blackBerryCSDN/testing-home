<template>
  <div style="height: 100%;">
    <div class="top-wrap">
      <div class="top-title">
        返修管理
      </div>
      <div class="top-tabs-box" style="line-height: 40px;padding-top: 3px;color: #000;font-size: 15px;padding-left: 10px;">
        返修待办工单
      </div>
    </div>
    <div class="content-wrap" style="position: relative;top: 54px;overflow-y: auto;height: calc(100% - 110px);max-height: calc(100% - 110px);">
      <div class="chart-wrap ">
        <el-collapse v-model="activeNames" accordion @change="handleChangeCollapse">

          <el-collapse-item v-for="(item, index) in orderArr" :key="index" :name="index">
            <template slot="title">
              <span class="collapse-title">{{ item.tsName }}{{ getType(item.status)}}</span>
            </template>
            <div style="text-align: right;" class="fa-box">
              <div style="text-align: left;">
              <div>审核理由: {{ item.resultNote }}</div><div>配件: {{ getPartType(item.partType) }}</div>
              </div>
              <!--// 1-待审，初步提交-->
              <!--// 2-不通过，审核不通过订单-->
              <!--// 3-已经审核，审核通过订单 -->
              <!--// 4-返修中，厂家填写物流信息后-->
              <!--// 5-返回中，厂家填写返回物流后-->
              <!--// 6-处理完成，签收到物流信息-->
              <!-- 地市自己-->
              <el-button type="success" v-if="roleType === 1 && item.status ===1 || roleType === 1 && item.status === 2 " size="mini"  @click="refreshEditSubmit(item.orderId, item.partType, item.resultNote,item.status)">重新提交</el-button>
              <el-button type="danger" v-if="roleType === 1 && item.status === 1 || roleType === 1 && item.status === 2 "  size="mini"  @click="deleteOrder(item.orderId)">删除</el-button>
              <el-button type="primary"  v-if="roleType === 1 && item.status === 3 " size="mini" @click="returnCompany(item.orderId,item.status)">返回厂家</el-button>
              <!--厂家-->
              <el-button type="success" v-if="roleType === 3 && item.status === 1" size="mini"  @click="pass(item.orderId)">通过</el-button>
              <el-button type="danger"  v-if="roleType === 3 && item.status === 1" size="mini" @click="reject(item.orderId)">驳回</el-button>
              <el-button type="primary"  v-if="roleType === 3 && item.status === 3 " size="mini" @click="returnCompany(item.orderId,item.status)">返回厂家</el-button>
              <el-button type="primary"  v-if="roleType === 3 && item.status === 4 " size="mini" @click="returnCompany(item.orderId,item.status)">返回地市</el-button>
              <el-button type="primary"  v-if="roleType === 3 && item.status === 5 " size="mini" @click="submitFormCall1(item.orderId,item.status)">结束</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <!-- 厂家返修dialog-->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogCall"
        width="90%"
        top="60px"
        :before-close="closeTransact">
        <div class="transact-form">
          <el-form :model="transactForm" :rules="dialogType === 3 ? rules0 : rules1" ref="transactForm" label-width="80px" class="demo-ruleForm" size="mini">
            <!-- 返回厂家-->
            <el-form-item v-if="dialogType === 3" label="快递公司" prop="toLogistics">
              <el-select v-model="transactForm.toLogistics" placeholder="请选择物流公司" style="width: 75%">
                <el-option
                  v-for="item in expressages"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item  v-if="dialogType === 3"  label="快递单号" prop="toLogisticsId" >
              <el-input v-model="transactForm.toLogisticsId" placeholder="请输入快递单号" style="width: 75%">
              </el-input>
              <a href="javascript:void(0);" class="file el-icon-full-screen">
                <input type="file" accept="image/*" capture="camera" @change="sweepCode($event)"/>
              </a>
            </el-form-item>
            <el-form-item  v-if="Showstatus === true" prop="status">
              <el-input v-model="transactForm.status" >
              </el-input>
            </el-form-item>
            <!--返回地市-->
            <el-form-item  v-if="dialogType === 4"  label="快递公司" prop="backLogistics">
              <el-select v-model="transactForm.backLogistics" placeholder="请选择物流公司" style="width: 75%">
                <el-option
                  v-for="item in expressages"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item  v-if="dialogType === 4"  label="快递单号" prop="backLogisticsId">
              <el-input v-model="transactForm.backLogisticsId" placeholder="请输入快递单号" style="width: 75%">
              </el-input>
              <a href="javascript:void(0);" class="file el-icon-full-screen">
                <input type="file" accept="image/*" capture="camera" @change="sweepCode($event)"/>
              </a>
            </el-form-item>
            <el-form-item  v-if="Showstatus === true" prop="status">
              <el-input v-model="transactForm.status" >
              </el-input>
            </el-form-item>
            <!--<el-form-item label="备注" prop="desc">-->
            <!--<el-input  type="textarea" v-model="transactForm.desc" placeholder="请输入备注"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item>
              <el-button @click="resetFormTransact('transactForm')">重置</el-button>
              <el-button type="primary" @click="submitFormCall('transactForm', dialogType)">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="dialogCall = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="dialogCall = false">确 定</el-button>-->
        <!--</span>-->
      </el-dialog>
      <!-- 重新提交dialog-->
      <el-dialog
        title=""
        :visible.sync="dialogEdit"
        width="90%"
        top="60px"
        :before-close="closeEdit">
        <div class="transact-form">
          <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="80px" class="demo-ruleForm" size="mini">
            <el-form-item label="适修配件" prop="partType">
              <el-select v-model="editForm.partType" @change="partTypeChange" placeholder="请选择适修配件" prop="partType">
                <el-option label="主机" value="1"></el-option>
                <el-option label="电源适配器" value="2"></el-option>
                <el-option label="主机+电源适配器" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="返修原因" prop="resultNote">
              <el-input  type="textarea" v-model="editForm.resultNote" placeholder="请输入返修原因"></el-input>
            </el-form-item>
            <el-form-item>
              <el-form-item  v-if="Showstatus === true" prop="status">
                <el-input v-model="editForm.status" >
                </el-input>
              </el-form-item>
              <!--<el-button @click="resetFormEdit('editForm')">重置</el-button>-->
              <el-button type="primary" @click="submitFormEdit('editForm')">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <!-- 驳回返修单 -->
      <el-dialog
        title=""
        :visible.sync="dialogReject"
        width="90%"
        top="60px"
        :before-close="closeReject">
        <div class="transact-form">
          <el-form :model="rejectForm" :rules="rejectRules" ref="rejectForm" label-width="80px" class="demo-ruleForm" size="mini">
            <el-form-item label="驳回原因" prop="remarks">
              <el-select v-model="rejectForm.remarks" placeholder="请选择驳回原因" prop="remarks">
                <el-option label="软件问题，已处理" value="软件问题，已处理"></el-option>
                <el-option label="网络问题，请检查" value="网络问题，请检查"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitFormReject('rejectForm')">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
    <tabbar></tabbar>
  </div>
</template>

<script>
/* eslint-disable no-trailing-spaces */

import api from '../../util/api'
import tabbar from '../../components/tabbar'
import Quagga from 'quagga'
import $ from 'jquery'
import Watermark from '@/util/watermark'

export default {
  name: 'transact',
  components: {
    tabbar
  },
  data () {
    return {
      roleType: 3, // 角色类型
      Showstatus: false, // 不显示状态
      dialogType: '', // 0 为地市 1为厂家
      dialogCall: false, // 厂家dialog
      dialogEdit: false, // 重新提交dialog
      dialogReject: false, // 驳回工单dialog
      activeNames: [0], // 待办工单默认面板索引
      dialogTitle: '', // dialog标题
      orderArr: [ // 待办工单数据
        {name: '20190424120921-成都', type: 1},
        {name: '20190424120921-攀枝花', type: 2},
        // {name: '20190424120921-成都', type: '0'},
        // {name: '20190424120921-成都', type: '1'}
      ],
      expressages: [
        {label: '顺丰快递', value: 'shunfeng'},
        {label: '申通快递', value: 'shentong'},
        {label: '圆通快递', value: 'yuantong'},
        {label: '中通快递', value: 'zhongtong'},
        {label: '天天快递', value: 'tiantian'},
        {label: '邮政快递', value: 'youzheng'},
        {label: '优速快递', value: 'yousu'},
        {label: '德邦快递', value: 'debang'},
        {label: '韵达快递', value: 'yunda'},
        {label: '百世快递', value: 'huitongkuaidi'},
        {label: '其他', value: 'other'}
      ],
      transactForm: { // 返回厂家/厂家表单
        toLogistics: '', //
        toLogisticsId: '', //
        backLogistics: '', //
        backLogisticsId: '', //
        // desc: '' //
        status: ''
      },
      rules0: { // 厂家验证规则
        toLogistics: [
          {required: true, message: '请选择快递公司', trigger: 'blur'}
        ],
        toLogisticsId: [
          {required: true, message: '请填写快递单号', trigger: 'blur'}
        ]
      },
      rules1: { // 返回地市验证规则
        backLogistics: [
          {required: true, message: '请选择快递公司', trigger: 'blur'}
        ],
        backLogisticsId: [
          {required: true, message: '请填写快递单号', trigger: 'blur'}
        ]
      },
      editForm: { // 重新提交
        partType: '', //
        resultNote: '' //
      },
      editRules: {
        partType: [
          {required: true, message: '请选择适修配件', trigger: 'blur'}
        ],
        resultNote: [
          {required: true, message: '请输入备注', trigger: 'blur'}
        ]
      },
      rejectRules: {
        remarks: [
          {required: true, message: '请选择驳回原因', trigger: 'blur'}
        ]
      },
      rejectForm: { // 驳回
        orderId: '',
        remarks: ''
      },
      // 扫码参数
      state: {
        inputStream: {
          size: 800,
          singleChannel: false
        },
        locator: {
          patchSize: 'medium',
          halfSample: true
        },
        decoder: {
          readers: [{
            format: 'code_128_reader',
            config: {}
          }]
        },
        locate: true,
        src: null
      }
    }
  },
  updated: function () {

  },
  created () {

  },
  mounted: function () {
    let account = window.sessionStorage.getItem('account')
    let mobile = window.sessionStorage.getItem('mobile')
    Watermark.set(account + '   ' + mobile)
    // /api/repair/queryRepairOrder
    this.queryRepairOrder()
  },
  methods: {
    getType (status) {
      if (status === 1) {
        return '(待审)'
      } else if (status === 2) {
        return '(不通过)'
      } else if (status === 3) {
        return '(已经审核)'
      } else if (status === 4) {
        return '(返修中)'
      } else if (status === 5) {
        return '(返回中)'
      } else if (status === 6) {
        return '(处理完成)'
      }
    },
    getRules () {
      let _this = this
      let type = _this.dialogType
      if (type === 3) {
        return _this.rules0
      } else if (type === 4) {
        return _this.rules1
      }
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
    handleChangeCollapse: function (val) {

    },
    queryRepairOrder: async function () {
      let _this = this
      const {data: {code, data}} = await api.get(_this.GLOBAL.BASE_URL + '/api/repair/queryRepairOrder', {
        status: [1, 2, 3, 4, 5].join(','),
        role: 1
      })
      if (code === 0) {
        let role = data.role
        let repairs = data.repairs
        this.orderArr = []
        // 8厂家  9省  10 地市
        if (role === 8) { // 厂家
          this.roleType = 3
          for (let i = 0; i < repairs.length; i++) {
            if (repairs[i].status === 1 || repairs[i].status === 3 || repairs[i].status === 4 || repairs[i].status === 5) {
              this.orderArr.push(repairs[i])
            }
          }
        }
        // else if (role === 9) { // 省
        //   this.roleType = 2
        //   for (let i = 0; i < repairs.length; i++) {
        //     if (repairs[i].status === 1) {
        //       this.orderArr.push(repairs[i])
        //     }
        //   }
        // }
        else if (role === 10) { // 地市
          this.roleType = 1
          for (let i = 0; i < repairs.length; i++) {
            if (repairs[i].status === 1 || repairs[i].status === 2 || repairs[i].status === 3) {
              this.orderArr.push(repairs[i])
            }
          }
        }
        console.log(this.orderArr)
        // this.orderArr = data.repairs
      }
    },
    async refreshEditSubmit (id, type, desc, status) { // 重新提交
      this.dialogEdit = true
      this.editForm.partType = type.toString()
      this.editForm.resultNote = desc
      this.editForm.orderId = id
      this.editForm.status = 1
    },
    closeTransact (done) {
      this.dialogCall = false
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done()
      //   })
      //   .catch(_ => {})
    },
    closeEdit (done) {
      this.dialogEdit = false
    },
    closeReject (done) {
      this.dialogReject = false
    },
    resetFormEdit (formName) { // 重新提交 重置
      this.$refs[formName].resetFields()
    },
    async submitFormCall1 (id, status) {
      let _this = this
      const {data: { code }} = await api.get(_this.GLOBAL.BASE_URL + '/api/repair/updateRepairOrder', {orderId: id, status: status + 1})
      if (code === 0) {
        console.log('结束操作成功')
        this.queryRepairOrder()
      } else {
        console.log('结束操作失败')
      }
    },
    async submitFormCall (formName) { // 厂家返回提交事件
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.dialogCall = false
          if (this.transactForm.status === 3) {
            this.transactForm.status = 4
          } else if (this.transactForm.status === 4) {
            this.transactForm.status = 5
          }
          let returnForm = this.transactForm
          let _this = this
          const {data: { code }} = await api.get(_this.GLOBAL.BASE_URL + '/api/repair/updateRepairOrder', returnForm)
          if (code === 0) {
            let txt = this.dialogType === 4 ? '已返回地市' : '已返回厂家'
            const loading = this.$loading({
              lock: true,
              text: txt,
              spinner: 'fa fa-check',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            setTimeout(() => {
              loading.close()
            }, 700)
            this.queryRepairOrder()
          }
        } else {
          return false
        }
      })
    },
    resetFormTransact (formName) { // 重置厂家返修
      this.$refs[formName].resetFields()
    },
    partTypeChange (val) {
      this.editForm.partType = val
    },
    async submitFormEdit (formName) { // 重新提交提交事件 /api/repair/updateRepairOrder
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let paramsData = this.editForm
          let _this = this
          const {data: { code, data }} = await api.get(_this.GLOBAL.BASE_URL + '/api/repair/updateRepairOrder', paramsData)
          if (code === 0) {
            this.queryRepairOrder()
            const loading = this.$loading({
              lock: true,
              text: '已提交  ',
              spinner: 'fa fa-check',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            setTimeout(() => {
              loading.close()
            }, 500)
          } else {
          }
          this.dialogEdit = false
        } else {
          return false
        }
      })
    },
    deleteOrder (id) {
      this.$confirm('此操作将删除工单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDeleteOrder(id)
      }).catch(() => {
      })
    },
    async doDeleteOrder (id) { // 删除  /api/repair/deleteRepairOrder {id : }
      let _this = this
      const {data: { code, data }} = await api.get(_this.GLOBAL.BASE_URL + '/api/repair/deleteRepairOrder', {orderId: id})
      if (code === 0) {
        const loading = this.$loading({
          lock: true,
          text: '删除成功',
          spinner: 'fa fa-check',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        setTimeout(() => {
          loading.close()
        }, 500)
        let _this = this
        const {data: { data }} = await api.get(_this.GLOBAL.BASE_URL + '/api/repair/queryRepairOrder', {status: [1, 2, 3, 4, 5].join(','), role: 1})
        if (code === 0) {
          this.orderArr = data.repairs
        }
      }
    },
    reject (id) {
      this.rejectForm.orderId = id
      this.rejectForm.remarks = ''
      this.dialogReject = true
    },
    async submitFormReject (formName) { // 驳回请求 /api/repair/checkRepairOrder
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.dialogReject = false
          let orderId = this.rejectForm.orderId
          let remarks = this.rejectForm.remarks
          let _this = this
          const {data: { code, data }} = await api.get(_this.GLOBAL.BASE_URL + '/api/repair/checkRepairOrder', {orderId: orderId, remarks: remarks, status: 2})
          if (code === 0) {
            const loading = this.$loading({
              lock: true,
              text: '已驳回',
              spinner: 'fa fa-check',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            setTimeout(() => {
              loading.close()
            }, 500)
            this.queryRepairOrder()
          }
        } else {
          return false
        }
      })
    },
    pass (id) {
      this.$confirm('此操作将通过工单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doPass(id)
      }).catch(() => {
      })
    },
    async doPass (id) { // 通过请求 /api/repair/checkRepairOrder
      let _this = this
      const {data: { code, data }} = await api.get(_this.GLOBAL.BASE_URL + '/api/repair/checkRepairOrder', {orderId: id, status: 3})
      if (code === 0) {
        const loading = this.$loading({
          lock: true,
          text: '已通过',
          spinner: 'fa fa-check',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        setTimeout(() => {
          loading.close()
        }, 500)
        // const {data: { code, data }} = await api.get(_this.GLOBAL.BASE_URL + '/api/repair/queryRepairOrder', {status: [1, 2, 3, 4, 5].join(','), role: 1})
        // if (code === 0) {
        //   this.orderArr = data.repairs
        this.queryRepairOrder()
        // }
      }
    },
    async returnCity (id) {
      this.dialogType = 0
      this.dialogCall = true
      this.dialogTitle = '返回地市'
      this.transactForm.orderId = id
      // 清空表单
      this.transactForm.toLogistics = ''
      this.transactForm.toLogisticsId = ''
      this.transactForm.backLogistics = ''
      this.transactForm.backLogisticsId = ''
    },
    async returnCompany (id, status) {
      this.dialogCall = true
      if (status === 3) {
        this.dialogType = 3
        this.dialogTitle = '返回厂家'
      }
      if (status === 4) {
        this.dialogType = 4
        this.dialogTitle = '返回地市'
      }
      this.transactForm.orderId = id
      this.transactForm.status = status
      // 清空表单
      this.transactForm.toLogistics = ''
      this.transactForm.toLogisticsId = ''
      this.transactForm.backLogistics = ''
      this.transactForm.backLogisticsId = ''
    },
    // 扫码识别
    sweepCode (e) {
      if (e.target.files && e.target.files.length) {
        this.decode(URL.createObjectURL(e.target.files[0]))
      }
    },
    decode (src) {
      const _this = this
      var config = $.extend({}, this.state, {src: src})
      Quagga.decodeSingle(config, function (result) {})
      Quagga.onDetected(function (result) {
        var code = result.codeResult.code
        _this.getExpressName(code)
      })
    },
    async getExpressName (expressId) {
      const {data: { code, data }} = await api.get(this.GLOBAL.BASE_URL + '/api/repair/getExpressName', {expressId: expressId})
      if (data != null) {
        if (this.dialogType === 3) {
          this.transactForm.toLogisticsId = expressId
          this.transactForm.toLogistics = data
        } else if (this.dialogType === 4) {
          this.transactForm.backLogisticsId = expressId
          this.transactForm.backLogistics = data
        }
      } else {
        this.$alert('快递单号不合法', '提示', {
          confirmButtonText: '确定'
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
    /*color: #eaf7f8;*/
  }
  .el-dialog{
    /*background: #fafafa;*/
  }
  .el-collapse{
    /*border-top: 1px solid gray;*/
  }
  .el-collapse-item__header{
    height: 35px;
    line-height: 35px;
    /*background: rgba(0,0,0,0.5);*/
    /*color: #fff;*/
    padding: 0px 10px;
    /*border-bottom: 1px solid rgba(0,0,0,0.9);*/
    /*border-bottom: 1px solid gray;*/
  }
  .el-collapse-item__content{
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    /*color:#eee;*/
  }
  .el-collapse-item__wrap{
    background: #fafafa;
    /*border-bottom: 1px solid gray;*/
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
    /*color: #fff;*/
  }
  .el-form-item__label{
    /*color: #fff;*/
    padding: 0 7px 0 0;
  }
  .el-icon-loading{
    font-size: 20px;
  }
  .transact-form .el-form-item__label{
    color: #000;
  }
  .transact-form .el-input__inner,.transact-form  .el-textarea__inner {
    background: transparent;
    color: #000;
  }
  .el-loading-spinner .fa {
    /*color: #fff;*/
    font-size: 26px;
  }
  .el-loading-spinner  .el-loading-text{
    /*color: #fff;*/
  }
  .el-select{
    width: 100%;
  }
  .el-message-box {
    width: 300px;
  }
  .file {
    position: relative;
    display: inline-block;
    border-radius: 4px;
    padding: 4px 12px;
    /*color: #c0c4cc;*/
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
    font-size: 18px;
  }
  .file input {
    position: absolute;
    right: 0;
    top: 0;
    opacity: 0;
    width: 36px;
  }
  .file:hover {
    text-decoration: none;
  }
</style>
<style scoped lang="scss">
  @import "../../../static/scss/com.css";
  .top-wrap .top-title{
    /*min-width: 100px;*/
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
    /*min-width: 100px;*/
    /*border-right: none;*/
  }
  .collapse-title{
    padding: 0px 10px 0px 0px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

</style>
