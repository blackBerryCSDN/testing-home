<template>
    <div style="height: 100%;">
      <div class="top-wrap">
        <div class="top-title">
          返修管理
        </div>
        <div class="top-tabs-box" style="line-height: 40px;padding-top: 3px;color: #000;font-size: 15px;padding-left: 10px;">
          新建返修工单
        </div>
      </div>
      <div class="content-wrap">
        <div class="chart-wrap " style="padding-top: 60px;padding-bottom: 50px;">
          <div>
            <el-form :model="addOrderForm" :rules="rules" ref="addOrderForm" label-width="80px" class="demo-ruleForm" size="mini">
              <el-form-item label="地市">
                <el-select v-model="addOrderForm.provinceName"  placeholder="请选择地市" @change="changeOnProvince">
                  <el-option
                    v-for="item in cityCode"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="县区">
                <el-select v-model="addOrderForm.nameCn" placeholder="请选择县区" @change="chooseName">
                  <el-option
                    v-for="item in districtID"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <!--<el-form-item label="测试点">-->
                <!--<el-select v-model="addOrderForm.area" placeholder="请选择测试点" @change="chooseArea">-->
                  <!--<el-option-->
                    <!--v-for="item in areaArr"-->
                    <!--:key="item.value"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value">-->
                  <!--</el-option>-->
                <!--</el-select>-->
              <!--</el-form-item>-->

              <el-form-item label="物流公司">
                <el-select v-model="addOrderForm.logistics" placeholder="请选择物流公司" @change="chooseLogistics">
                  <el-option
                    v-for="item in logisticsArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="物流单号">
                <el-input v-model.number="addOrderForm.logisticsNumer"  placeholder="请输入物流单号"></el-input>
              </el-form-item>

              <el-form-item label="终端" prop="tsId">
                <el-select v-model="addOrderForm.tsId"  placeholder="请选择测试终端" @change="chooseTsId">
                  <el-option
                    v-for="item in tsInfo"
                    :key="item.tsId"
                    :label="item.tsName"
                    :value="item.tsId">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="设备序列号">
                <el-input v-model="addOrderForm.serialNum" disabled placeholder="请输入设备序列号"></el-input>
              </el-form-item>

              <el-form-item label="适修配件" prop="partType">
                <el-select v-model="addOrderForm.partType" placeholder="请选择适修配件">
                  <el-option label="主机" value="1"></el-option>
                  <el-option label="电源适配器" value="2"></el-option>
                  <el-option label="主机+电源适配器" value="4"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="返修原因" prop="resultNote">
                <el-input  type="textarea" v-model="addOrderForm.resultNote" placeholder="请输入返修原因"></el-input>
              </el-form-item>

              <el-form-item label="寄件人姓名">
                <el-input v-model="addOrderForm.senderName"  placeholder="请输入寄件人姓名"></el-input>
              </el-form-item>

              <el-form-item label="寄件人电话">
                <el-input v-model.number="addOrderForm.senderPhone"  placeholder="请输入寄件人电话"></el-input>
              </el-form-item>

              <el-form-item label="寄件人地址">
                <el-input v-model="addOrderForm.senderAddress"  placeholder="请输入寄件人地址"></el-input>
              </el-form-item>

              <div style="display: flex;text-align: center">
                <div style="width: 50%;padding: 10px 20px">
                  <div style="padding: 5px 10px;color: #606266;">快递照片<br>【必填】</div>
                  <div>
                    <el-upload
                      class="avatar-uploader"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess1"
                      :before-upload="beforeAvatarUpload">
                      <img v-if="imageLogistics" :src="imageLogistics" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </div>
                </div>

                <div style="width: 50%;height: 100px;padding: 10px 20px">
                  <div style="padding: 5px 10px;color: #606266;">清单照片<br>【必填】</div>
                  <div>
                    <el-upload
                      class="avatar-uploader"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess2"
                      :before-upload="beforeAvatarUpload">
                      <img v-if="imageList" :src="imageList" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </div>
                </div>
              </div>

              <el-form-item>
                <div style="text-align: center;margin-left: -80px;">
                  <el-button type="primary" @click="submitForm('addOrderForm')">提交返修</el-button>
                  <el-button @click="resetForm('addOrderForm')">重置</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <tabbar></tabbar>
    </div>
</template>

<script>
import api from '../../util/api'
import tabbar from '../../components/tabbar'
export default {
  name: 'index',
  components: {
    tabbar
  },
  data () {
    return {
      companies: [
        {label: '顺丰快递', value: 'shunfeng'},
        {label: '申通快递', value: 'shentong'},
        {label: '圆通快递', value: 'yuantong'},
        {label: '天天快递', value: 'tiantian'},
        {label: '邮政快递', value: 'youzheng'},
        {label: '优速快递', value: 'yousu'}
      ],
      cityCode: [],
      districtID: [],
      // 测试点
      areaArr: [],
      // 设备序列号
      serialArr: [],
      // 快递公司
      logisticsArr: [],
      tsInfo: [],
      addOrderForm: {
        tsId: '', // 测试终端Id
        provinceName: '', // 省份
        nameCn: '', // 城市名称
        area: '', // 测试点
        serialNum: '', // 设备序列号
        partType: '', // 配件 前端自定义
        toLogistics: '', // 物流
        toLogisticsId: '', // 物流单号
        resultNote: '', // 返修原因
        senderName: '', // 寄件人姓名
        senderPhone: '', // 寄件人电话
        senderAddress: '', // 寄件人地址
        logistics: '', // 快递公司
        logisticsNumer: '', // 物流单号
        operator: '', // 寄件人
      },
      imageList: '',
      imageLogistics: '',
      rules: {
        tsId: [
          {required: true, message: '请选择测试终端', trigger: 'blur'}
        ],
        provinceName: [
          {required: true, message: '请选择城市名称', trigger: 'blur'}
        ],
        nameCn: [
          {required: true, message: '请选择地区名称', trigger: 'change'}
        ],
        partType: [
          {required: true, message: '请选择适修配件', trigger: 'change'}
        ],
        // toLogistics: [
        //   {required: true, message: '请选择物流公司', trigger: 'change'}
        // ],
        // logisticsNumer: [
        //   {required: true, message: '请填写物流单号', trigger: 'blur'}
        // ],
        resultNote: [
          {required: true, message: '请输入返修原因', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
  },
  async mounted () {
    let self = this
    const {data: { code, data }} = await api.get(self.GLOBAL.BASE_URL + '/api/basic/queryCitys', {})
    if (code === 0) {
      // let cityCode = data[0].cityCode
      for (var city in data) {
        this.cityCode.push({label: data[city].nameCn, value: data[city].cityCode})
      }
      // let distData = await api.get(self.GLOBAL.BASE_URL + '/api/basic/queryDistricts', {cityCode: cityCode})
      // if (distData.data.code === 0) {
      //   var dataDist = distData.data.data
      //   for (var dist in dataDist) {
      //     this.districtID.push({label: dataDist[dist].nameCn, value: dataDist[dist].districtID})
      //   }
      // }
    }
    this.queryName()
    // 终端信息
    // let serviceData = await api.get(self.GLOBAL.BASE_URL + '/api/basic/queryServices', {})
    // if (serviceData.data.code === 0) {
    //   let dataService = serviceData.data.data
    //   console.log(dataService)
    // }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const {data: {code}} = await api.get(this.GLOBAL.BASE_URL + '/api/repair/createRepairOrder', this.addOrderForm)
          if (code === 0) {
            const loading = this.$loading({
              lock: true,
              text: '操作成功',
              spinner: 'fa fa-check',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            setTimeout(() => {
              loading.close()
            }, 700)
            this.$router.push({ path: '/repair-manage' })
          } else {
            alert('操作失败')
          }
        } else {
          alert('操作失败')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    async changeOnProvince (cityCode) {
      this.addOrderForm.nameCn = ''
      let distData = await api.get(this.GLOBAL.BASE_URL + '/api/basic/queryDistricts', {cityCode: cityCode})
      if (distData.data.code === 0) {
        var dataDist = distData.data.data
        this.districtID = []
        for (var dist in dataDist) {
          this.districtID.push({label: dataDist[dist].nameCn, value: dataDist[dist].districtID})
        }
      }
    },
    async chooseName (districtId) {
      const {data: { code, data }} = await api.get(this.GLOBAL.BASE_URL + '/api/ts/queryTsOnLineDetail', {districtId: districtId, online: '0', hasOrder: '0'})
      this.tsInfo = []
      if (code === 0) {
        this.tsInfo = data
        console.log(data);
      }
    },
    // 选择终端
    chooseTsId(val){
      this.tsInfo.forEach(item=> {
        if (val === item.tsId) {
          if (item.tsNo){
            this.addOrderForm.serialNum = item.tsNo
          } else {
            this.addOrderForm.serialNum = 'null'
          }

        }
      })
    },
    // 测试点
    chooseArea() {},
    // 物流公司
    chooseLogistics() {},
    async queryName () {
      const {data: { code, data }} = await api.get(this.GLOBAL.BASE_URL + '/api/ts/queryTsOnLineDetail', {online: '0', hasOrder: '0'})
      this.tsInfo = []
      if (code === 0) {
        this.tsInfo = data
        console.log(data);
      }
    },
    // 快递照片
    handleAvatarSuccess1 (res, file) {
      this.imageLogistics = URL.createObjectURL(file.raw)
    },
    // 快递照片
    handleAvatarSuccess2(res, file) {
      this.imageList = URL.createObjectURL(file.raw)
    },
    // 图片限制
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

  }
}
</script>
<style>
  @import "../../../static/scss/reset.css";
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 12px;
  }
  .el-input , .el-textarea__inner{
    position: relative;
    font-size: 14px;
    display: inline-block;
  }
  .el-form-item__content{
    width: calc(100% - 80px);
  }
  .el-select {
    display: block;
  }
  .el-input{
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

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
<style scoped lang="scss">
  @import "../../../static/scss/com.css";
  .top-wrap .top-title{
    /*min-width: 120px;*/
    /*border-right: none;*/
  }
</style>
