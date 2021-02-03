<template>
  <div >
    <div>
      <div class="top-wrap">
        <div class="top-title">
          探针概况
        </div>
        <div class="top-tabs-box" style="line-height: 40px;padding-top: 3px;color: #000;font-size: 15px;padding-left: 10px;">
          探针在线情况
        </div>
      </div>
      <div class="content-wrap"  style="padding-top: 54px;padding-bottom: 50px;height: calc(100vh - 110px)">
        <div class="online-wrap " style="height: 100%;">
          <!--<div class="online-title"> 详情查询</div>-->
          <div class="online-body" style="height: 100%;">
            <div style="background: #fff;margin-bottom: 5px;padding-bottom: 4px;">
<!--              <el-form :inline="true" :model="formInline" size="mini" class="demo-form" style="height: 94px;">-->
<!--                <div class="flex-wrap" style="">-->
<!--                  <div class="flex-item">-->
<!--                    <div class="item-title">地市</div>-->
<!--                    <el-select v-model="formInline.city" @focus="cityClick" @change="cityChange" size="mini" placeholder="请选择">-->
<!--                      <el-option-->
<!--                        v-for="item in cities"-->
<!--                        :key="item.citiesValue"-->
<!--                        :label="item.label"-->
<!--                        :value="item.citiesValue">-->
<!--                      </el-option>-->
<!--                    </el-select>-->
<!--                  </div>-->
<!--                  <div class="flex-item">-->
<!--                    <div class="item-title">县区</div>-->
<!--                    <el-select v-model="formInline.county"  @change="countyChange" size="mini" placeholder="请选择">-->
<!--                      <el-option-->
<!--                        v-for="item in counties"-->
<!--                        :key="item.countiesValue"-->
<!--                        :label="item.label"-->
<!--                        :value="item.countiesValue">-->
<!--                      </el-option>-->
<!--                    </el-select>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div style="margin: 10px 0px;text-align: right;padding: 0px 10px;">-->
<!--                  &lt;!&ndash;<el-form-item style="width: calc(100% - 20px);">&ndash;&gt;-->
<!--                    <el-button type="primary" @click="onSubmit" size="mini" style="width: 100%;"> 查询</el-button>-->
<!--                  &lt;!&ndash;</el-form-item>&ndash;&gt;-->
<!--                </div>-->
<!--              </el-form>-->
              <el-form  :model="formInline" style="height: 45px; "   >
                <el-row >
                  <el-col :span="10" >
                    <el-form-item label="地市" style="font-size:10px; margin-top: 10px" >
                      <el-select v-model="formInline.city"
                                 @focus="cityClick"
                                 style="width: 70%;"
                                 @change="cityChange"
                                 clearable
                                 filterable
                                 placeholder="请选择">
                        <el-option
                          v-for="item in cities"
                          :key="item.citiesValue"
                          :label="item.label"
                          :value="item.citiesValue">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                  <el-form-item label="县区"  style="font-size:10px;margin-top: 10px">
                    <el-select v-model="formInline.county"  style="width: 70%;" @change="countyChange" clearable filterable placeholder="请选择">
                      <el-option
                        v-for="item in counties"
                        :key="item.countiesValue"
                        :label="item.label"
                        :value="item.countiesValue">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  </el-col>
                  <el-col :span="2">
                 <el-form-item style="font-size:10px;margin-top: 10px">
                    <el-button type="primary" @click="onSubmit" size="mini"> 查询</el-button>
                  </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div style="background: #fff;margin-bottom: 0px;padding: 10px 10px;height:calc(100% - 78px);">
              <el-table
                :cell-style="cellStyle"
                size="mini"
                :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                v-loadmore="loadMore"
                height="calc(100% - 15px)"
                border>
                <el-table-column
                  prop="name"
                  label="测试点" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  width="80px"
                  prop="tsType"
                  label="终端类型"
                  :formatter="formatterTsType"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  width="80px"
                  prop="state"
                  label="在线情况"
                  :formatter="formatterState"
                  show-overflow-tooltip
                >
                </el-table-column>
              </el-table>
              <el-pagination
                style="text-align: right;"
                :page-size="10"
                :pager-count="5"
                @current-change="onLineChange"
                layout="total"
                :total="tableData.length">
              </el-pagination>
              <!--<el-button type="primary" @click="loadMore" size="mini" style="width: 100%;"> 加载更多...</el-button>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <tabbar></tabbar>
  </div>
</template>

<script>
import api from '../../util/api'
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
        city: '',
        county: ''
      },
      cities: [
      ],
      counties: [
      ],
      citiesValue: '',
      pagesize: 30,
      currentPage: 1,
      countiesValue: '',
      provinceCode: '',
      tableData: []
    }
  },
  mounted () {
    this.cityClick()
    this.onSubmit()
    let account = window.sessionStorage.getItem('account')
    let mobile = window.sessionStorage.getItem('mobile')
    Watermark.set(account + '   ' + mobile)
  },
  methods: {
    cityClick: async function () {
      var self = this
      let res = await api.get(this.GLOBAL.BASE_URL + '/area/getCityList', {})
      if (res.data.code === 0) {
        self.cities = []
        self.cities.push({citiesValue: 0, label: '请选择'})
        self.provinceCode = res.data.data[0].provinceCode
        // console.log(res.data)
        for (var i = 0; i < res.data.data.length; i++) {
          // console.log(res.data.data!=null)
          if (res.data.data[i] != null) {
            self.cities.push({citiesValue: res.data.data[i].cityCode, label: res.data.data[i].nameCnHandle})
          }
        }
      }
    },
    cityChange: function () {
      this.formInline.county = ''
      this.countyClick(this.formInline.city)
    },
    onLineChange: function (currentPage) {
      this.currentPage = currentPage
    },
    countyClick: async function (code) {
      var self = this
      if (code !== 0) {
        let res = await api.get(this.GLOBAL.BASE_URL + '/area/getDistrict', {cityCode: code})
        if (res.data.code === 0) {
          self.counties = []
          self.counties.push({countiesValue: 0, label: '请选择'})
          for (var j = 0; j < res.data.data.length; j++) {
            self.counties.push({countiesValue: res.data.data[j].districtId, label: res.data.data[j].nameCnHandle})
          }
          console.log(self.counties)
        }
      } else {
        self.counties = []
      }
    },
    countyChange: function () {
    },
    onSubmit: async function () {
      console.log(this.formInline)
      var self = this
      var cityCode = this.formInline.city
      var cityCode1
      cityCode === '' ? cityCode1 = 0 : cityCode1 = cityCode
      var districtId = this.formInline.county
      var districtId1
      districtId === '' ? districtId1 = 0 : districtId1 = districtId
      var provinceCode = this.provinceCode
      // Number.isNaN(cityCode) ? cityCode = null : null
      // Number.isNaN(districtId) ? districtId = null : null
      let res = await api.get(this.GLOBAL.BASE_URL + '/api/ts/queryTsOnLineDetail',
        {provinceCode: provinceCode, districtId: districtId1, cityCode: cityCode1, online: '-1', hasOrder: '-1'})
      if (res.data.code === 0) {
        self.tableData = []
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].online !== 0) {
            self.tableData.push({name: res.data.data[i].tsName, state: '在线', tsType: res.data.data[i].tsType})
          } else {
            var result = this.DateDiff(res.data.data[i].lastConnectTime)
            self.tableData.push({name: res.data.data[i].tsName, state: '离线', time: result, tsType: res.data.data[i].tsType})
          }
        }
      }
    },

    /**
     * 计算传入时间与当前时间的时间差
     * @param sDate
     * @returns {string}
     * @constructor
     */
    DateDiff: function (sDate) {
      var date = new Date(sDate)
      var nDate = new Date()
      var iDays = parseInt(Math.abs(nDate - date) / 1000)
      var result = ''
      if (iDays < (60 * 60 * 24)) {
        result = ''
      } else if ((60 * 60 * 24) <= iDays) {
        result = parseInt(iDays / (60 * 60 * 24)) + '天'
      }
      return result
    },

    formatterState: function (row, column) {
      let val = row.state
      let time = row.time
      if (val === '在线') {
        return val
      } else {
        return '离线' + time
      }
    },
    formatterTsType: function (row, column) {
      let val = row.tsType
      if (val === 1) {
        return 'PC'
      } else if (val === 2) {
        return '安卓客户端'
      } else if (val === 3) {
        return 'IOS客户端'
      } else if (val === 4) {
        return 'WEB客户端'
      } else if (val === 5) {
        return '网络拨测终端'
      } else if (val === 6) {
        return '云测终端(客如云)'
      } else if (val === 7) {
        return '云测终端(安防设备)'
      }
    },
    cellStyle: function (row, column, rowIndex, columnIndex) {
      let val = row.row.state
      let index = row.columnIndex
      if (val === '在线' && index === 2) {
        return 'color: #56F507'
      } else if (val === '离线' && index === 2) {
        return 'color: #CC3517'
      }
    },
    loadMore () {
      this.pagesize += 10
      // this.currentPage += 1
    }
  }
}
</script>

<style>
  @import "../../../static/scss/reset.css";
  .el-input__inner{
    background: transparent;
    color: #000;
  }
  .el-form-item__content{
    width: 100%;
  }
  .el-table, .el-table__expanded-cell {
    background-color: transparent;
  }
  .el-table th, .el-table tr {
    background-color: transparent;
    color: #000;
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td {
    background: rgba(0, 0, 0, 0.1)
  }
  .el-table thead th{
    color: #000;
    font-weight: 500;
    /*background: rgba(0,0,0,0.5);*/
  }
  .el-pagination button:disabled {
    /*color: #fff;*/
    /*background-color: transparent;*/
    cursor: not-allowed;
  }
  .el-pager li.active {
    background: transparent;
  }
  .el-pagination button:hover {
    color: #409EFF;
    background: transparent;
  }
  .el-dialog, .el-pager li {
    background: transparent;
    -webkit-box-sizing: border-box;
    /*color: #fff;*/
    min-width: 20px;
  }
  .el-pagination .btn-prev {
    padding-right: 12px;
    background-color: transparent;
    /*color: #fff;*/
  }
  .el-pagination .btn-next {
    padding-left: 12px;
    background-color: transparent;
    /*color: #fff;*/
  }
  .el-pager li.btn-quicknext, .el-pager li.btn-quickprev {
    /*color: #fff;*/
  }
  .flex-item .el-select>.el-input {
    display: block;
    width: 100%;
  }
  .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 23px;
  }
  .el-table__body tr,
  .el-table__body td {
    padding: 0;
    height: 23px;
  }
</style>
<style scoped lang="scss">
  @import "../../../static/scss/com.css";
  .online-wrap{

  }
  .online-title{

  }
  .online-body{
    .flex-wrap{
      display: flex;
      display: -webkit-flex;
      justify-content:space-around;
      .flex-item{
        padding: 0px 10px;
        .item-title{
          padding-bottom: 5px;
          color: #000;
        }
      }
    }
  }
</style>
