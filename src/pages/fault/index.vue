<template>
  <div style="height: 100%;">
    <div class="top-wrap">
      <div class="top-title">
        拨测质量
      </div>
      <div class="top-tabs-box" style="line-height: 40px;padding-top: 3px;color: #000;font-size: 15px;padding-left: 10px;">
        故障分析
      </div>
    </div>
    <div class="content-wrap"
         style="position: relative;top: 54px;overflow-y: auto;height: calc(100% - 110px);max-height: calc(100% - 110px);background: #fff;">
      <div class="chart-wrap " style="height: calc(100% - 30px);">
        <div class="header-choose">
          <!--选择地市-->
          <p v-show="pageShow.step === 1"> <br> 请选择需要诊断的地市 </p>
          <!--选择县区-->
          <p v-show="pageShow.step === 2"> <br> 请选择需要诊断的区县 </p>
          <p v-show="pageShow.step === 3"> <br> 请选择需要诊断的测试点 </p>
          <p v-show="pageShow.step === 4"> <br> 诊断结果 </p>
        </div>
        <div class="body-check">
          <!--选择地市-->
          <div v-show="pageShow.step === 1">
            <el-checkbox-group v-model="checkedCityArray" size="mini">
              <el-checkbox :label="item.cityCode" border :key="index" v-for="(item, index) in cityArray">{{item.nameCn}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <!--选择县区-->
          <div v-show="pageShow.step === 2">
            <el-checkbox-group v-model="checkedDistrictArray" size="mini">
              <el-checkbox :label="item.districtId" border :key="index" v-for="(item, index) in districtArray">{{item.nameCn}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <!--选择测试点-->
          <div v-show="pageShow.step === 3">
            <el-checkbox-group v-model="checkedTsArray">
              <div style="padding: 0px 20px;">
                <el-checkbox style="display: block;margin-bottom: 5px;" v-for="(item,index) in tsArray" :label="item.tsId" :key="index"><span :style="{color:(item.online ? 'green':'')}">{{item.tsName}}</span></el-checkbox>
              </div>
            </el-checkbox-group>
            <span v-if="tsArray.length === 0">该地区下没有测试终端</span>
          </div>
          <!--  测试结果-->
          <div v-show="pageShow.step === 4">
            <table style="width: 100px;border: 1px solid">
              <tr>
                <td rowspan="2">{{dimension == 'ts' ? '测试终端' : '地市'}}</td>
                <td rowspan="2" v-if="dimension != 'ts'">在线率</td>
                <td rowspan="2" v-if="dimension == 'ts'">在线状态</td>
                <td colspan="2">网络质量</td>
                <td colspan="2">业务体验</td>
              </tr>
              <tr>
                <td>时延</td>
                <td>丢包</td>
                <td>测速</td>
                <td>网页</td>
              </tr>
              <tr v-for="(item,index) in result" :key="index">
                <td :style="{background: 'linear-gradient(to right, red 0%,red '+item.finishCount/item.totalCount*100+'%,white 0%,white 100%)'}">{{item.dimensionName}}</td>
                <td v-if="dimension != 'ts'">{{item.onlineRate}}%</td>
                <td v-if="dimension == 'ts'">{{item.online}}</td>
                <td>{{item.avgoffsettime}}</td>
                <td>{{item.lostrate}}</td>
                <td>{{item.downbandwidth}}</td>
                <td>{{item.url90poffsettime}}</td>
              </tr>
            </table>
          </div>

        </div>

        <div class="tool-bottom">
          <!--选择地市-->
          <span v-show="pageShow.step == 1">
             <el-checkbox border @change="checkAllCity">全选</el-checkbox>
             <el-button type="success" :disabled="checkedCityArray.length === 0" v-show="checkedCityArray.length <= 1" @click="nextStep">下一步</el-button>
          </span>
          <!--选择县区-->
          <span v-show="pageShow.step == 2">
            <el-checkbox border @change="checkAllDistrict">全选</el-checkbox>
            <el-button @click="preStep">上一步</el-button>
            <el-button type="success" :disabled="checkedDistrictArray.length === 0" v-show="checkedDistrictArray.length <= 1" @click="nextStep">下一步</el-button>
          </span>
          <!--  选择测试点-->
          <span v-show="pageShow.step == 3">
            <el-checkbox border @change="checkAllTs" v-if="tsArray.length > 0">全选</el-checkbox>
            <el-button @click="preStep">上一步</el-button>
          </span>
          <span v-show="pageShow.step == 4">
             <el-button type="success" @click="back">返回</el-button>
          </span>
          <span v-show="pageShow.step < 4">
            <el-button type="primary" v-show="checkedCityArray.length > 1 || checkedDistrictArray.length > 1 || pageShow.step == 3" :disabled="pageShow.step == 3 && checkedTsArray.length === 0" @click="startTest" :loading="loadingTest">开始诊断</el-button>
          </span>
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
  name: 'index',
  components: {
    tabbar
  },
  data () {
    return {
      pageShow: {
        step: 1
      },
      // 地市
      cityArray: [],
      checkedCityArray: [],
      districtArray: [],
      checkedDistrictArray: [],
      tsArray: [],
      checkedTsArray: [],
      taskId: '',
      tableData: [
        {
          city: '成都',
          online: 80,
          delay: '-',
          pack: '-',
          speed: 12,
          webpage: 12,
        }
      ],
      result: [],
      loadingTest: false,
      interval: '',
      dimension: ''
    }
  },
  async created () {
    const res = await api.get(this.GLOBAL.BASE_URL + '/area/getCityList', {})
    console.log(JSON.stringify(res.data.data));
    this.cityArray = res.data.data
  },
  async mounted () {

  },
  methods: {
    checkAllCity (checked) {
      this.checkedCityArray = []
      if (checked) {
        this.cityArray.forEach(item => {
          this.checkedCityArray.push(item.cityCode)
        })
      }
    },
    checkAllDistrict (checked) {
      this.checkedDistrictArray = []
      if (checked) {
        this.districtArray.forEach(item => {
          this.checkedDistrictArray.push(item.districtId)
        })
      }
    },
    checkAllTs (checked) {
      this.checkedTsArray = []
      if (checked) {
        this.tsArray.forEach(item => {
          this.checkedTsArray.push(item.tsId)
        })
      }
    },
    async nextStep () {
      if (this.pageShow.step === 1) {
        const res = await api.get(this.GLOBAL.BASE_URL + '/area/getDistrict', {cityCode: this.checkedCityArray[0]})
        this.districtArray = res.data.data
      }
      if (this.pageShow.step === 2) {
        const res = await api.get(this.GLOBAL.BASE_URL + '/device/getDistrictDevice', {districtId: this.checkedDistrictArray[0]})
        this.tsArray = res.data.data
      }
      this.pageShow.step++
    },
    preStep () {
      if (this.pageShow.step === 3) {
        this.checkedTsArray = []
      } else if (this.pageShow.step === 2) {
        this.checkedDistrictArray = []
      }
      this.pageShow.step--
    },
    back () {
      this.pageShow.step = 1
      clearInterval(this.interval)
    },
    // 开始诊断
    startTest () {
      this.loadingTest = true
      let codes = ''
      if (this.pageShow.step === 1) {
        this.dimension = 'cityCode'
        codes = this.checkedCityArray.join(',')
      } else if (this.pageShow.step === 2) {
        this.dimension = 'districtId'
        codes = this.checkedDistrictArray.join(',')
      } else if (this.pageShow.step === 3) {
        this.dimension = 'ts'
        codes = this.checkedTsArray.join(',')
      }
      api.post(this.GLOBAL.BASE_URL + '/task/addTask', {dimension: this.dimension, codes: codes}).then(res => {
        console.log(JSON.stringify(res.data.data))
        this.loadingTest = false
        let data = res.data.data
        if (data && data.success) {
          this.loadingTest = false
          this.pageShow.step = 4
          this.taskId = data.taskId
          this.interval = setInterval(() => {
            api.post(this.GLOBAL.BASE_URL + '/task/result', {taskId: this.taskId, dimension: this.dimension, codes: codes}).then(r => {
              this.result = r.data.data
              console.log(JSON.stringify(this.result))
            })
          }, 3000)
        } else {
          this.$alert(data.msg)
        }
      }).catch(err => {
        this.loadingTest = false
        console.log(err)
      })
    }
  }
}
</script>

<style>
@import "../../../static/scss/reset.css";
@import "../../../static/scss/com.css";
</style>
<style scoped>
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

.el-checkbox.is-bordered+.el-checkbox.is-bordered{
  margin-left: 0px;
  margin-bottom: 10px;
}

.header-choose{
  text-align: center;
  font-weight: bold;
  height: 50px;
  border-bottom: 1px solid #ddd;
}
.body-check{
  height: calc(100% - 122px);
  padding: 20px 0px 20px;
}
.tool-bottom{
  line-height: 50px;
  height: 50px;
  text-align: center;
  border-top: 1px solid #ddd;
}
</style>
