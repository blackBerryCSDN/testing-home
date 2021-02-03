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

<!--        <div class="chart-wrap " >
          <div class="chart-title"> <i class="icon-style"></i> 综合视图</div>
          <div class="chart-body" style="">
            <barChart id="barChart" :xData="barData.xData" :onlineData="barData.onlineArr" :yData="barData.yData" :offlineData="barData.offlineArr"></barChart>
          </div>
        </div>-->
<!--        <div class="chart-wrap padding-top50">
          <div class="chart-title"> <i class="icon-style"></i> 地市视图</div>
          <div class="chart-body" style="">
            <chart id="cityChart" :xData="cityData.xData" :onlineData="cityData.onlineArr" :yData="cityData.yData" :totalData="cityData.totalArr"></chart>
          </div>
        </div>-->
        <div class="chart-wrap padding-top50">
<!--          <div class="chart-title"> <i class="icon-style"></i> 地市视图</div>-->
          <div class="chart-body" style="height: 100%;">
            <chartCity id="cityDataChart" :onlineData="cityDataChart.onlineArr"  :yData="cityDataChart.yData" :totalData="cityDataChart.totalArr" :offlineData="cityDataChart.offlineArr"></chartCity>
          </div>
        </div>
        <div class="chart-wrap">本网家宽探针{{netTotal}}个，在线{{netOnline}}个，在线率{{netOnlineRate}}%。<br>
          异网家宽探针{{differentNetTotal}}个，在线{{differentNetOnline}}个，在线率{{differentNetOnlineRate}}%。</div>
      </div>
      <tabbar></tabbar>
    </div>
</template>

<script>
/* eslint-disable no-undef,no-unused-vars */
import tabbar from '../../components/tabbar'
import chart from './chart'
import chartCity from './chart-city'
import barChart from './chart-bar'
import {getCookie} from '../../util/util'
import api from '../../util/api'
import Watermark from '@/util/watermark'
export default {
  name: 'index',
  components: {
    chart,
    chartCity,
    barChart,
    tabbar
  },
  data () {
    return {
      subTitle: '',
      barData: {
        xData: ['本网', '异网'],
        yData: [],
        onlineArr: [],
        offlineArr: []
      },
      netOnline: '',
      netOnlineRate: '',
      netTotal: '',
      differentNetOnline: '',
      differentNetOnlineRate: '',
      differentNetTotal: '',
      cityData: {
        xData: ['阿坝', '巴中', '成都', '达州', '德阳', '甘孜', '广安', '广元', '乐山', '凉山', '泸州', '眉山', '绵阳', '南充', '内江', '攀枝花', '遂宁', '天府', '雅安', '宜宾', '资阳', '自贡'],
        yData: [],
        onlineArr: [],
        totalArr: []
      },
      cityDataChart: {
        yData: ['阿坝', '巴中', '成都', '达州', '德阳', '甘孜', '广安', '广元', '乐山', '凉山', '泸州', '眉山', '绵阳', '南充', '内江', '攀枝花', '遂宁', '天府', '雅安', '宜宾', '资阳', '自贡'],
        xData: [],
        onlineArr: [],
        totalArr: [],
        offlineArr: []
      }
    }
  },
  created () {
    this.resetSetData()
  },
  async mounted () {
    let account = window.sessionStorage.getItem('account')
    let mobile = window.sessionStorage.getItem('mobile')
    Watermark.set(account + '   ' + mobile)
    var self = this
    const {data: { code, data }} = await api.get(self.GLOBAL.BASE_URL + '/api/ts/queryTsOnLine', {})
    if (code === 0) {
      self.barData.onlineArr = [data.innerOnLine, data.outerOnLine]
      self.barData.offlineArr = [data.innerOffLine, data.outerOffLine]
      self.netOnline = self.barData.onlineArr[0]
      self.netTotal = self.barData.offlineArr[0] + self.barData.onlineArr[0]
      if (self.barData.onlineArr[0] === 0) {
        self.netOnlineRate = 0
      } else {
        self.netOnlineRate = Math.round(self.barData.onlineArr[0] / (self.barData.offlineArr[0] + self.barData.onlineArr[0]) * 10000) / 100.00
      }
      self.differentNetOnline = self.barData.onlineArr[1]
      self.differentNetTotal = self.barData.offlineArr[1] + self.barData.onlineArr[1]
      if (self.barData.onlineArr[1] === 0) {
        self.differentNetOnlineRate = 0
      } else {
        self.differentNetOnlineRate = Math.round(self.barData.onlineArr[1] / (self.barData.offlineArr[1] + self.barData.onlineArr[1]) * 10000) / 100.00
      }
    }
    // 第二张表
    let onlineArr = []
    let totalArr = []
    let xData = []
    let res = await api.get(this.GLOBAL.BASE_URL + '/api/ts/queryTsOnLineByCity', {})

    if (res.data.code === 0) {
      for (var key in res.data.data) {
        xData.push(key)
        onlineArr.push(res.data.data[key].onLineCountByCity)
        totalArr.push(res.data.data[key].onLineCountTotal)
      }
    }
    this.cityData.onlineArr = onlineArr
    this.cityData.totalArr = totalArr
    this.cityData.xData = xData

    // 第三张表

    let yDataCity = []
    let onlineArrCity = []
    let totalArrCity = []
    let offlineArrCity = []
    let resData = await api.get(this.GLOBAL.BASE_URL + '/api/ts/queryTsOnlineDataByCity', {})

    if (resData.data.code === 0) {
      for (var key1 in resData.data.data) {
        for (var i in this.cityDataChart.yData) {
          if (resData.data.data[key1].nameCn.indexOf(this.cityDataChart.yData[i]) >= 0) {
            yDataCity.push(this.cityDataChart.yData[i])
            break
          }
        }
        onlineArrCity.push(resData.data.data[key1].onLine)
        totalArrCity.push(resData.data.data[key1].total)
        console.log(resData.data.data[key1].total - resData.data.data[key1].onLine)
        offlineArrCity.push(resData.data.data[key1].total - resData.data.data[key1].onLine)
      }
      console.log(offlineArrCity)
      this.cityDataChart.onlineArr = onlineArrCity
      this.cityDataChart.totalArr = totalArrCity
      this.cityDataChart.offlineArr = offlineArrCity
      this.cityDataChart.yData = yDataCity
    }
    /*    this.cityData.onlineArr = onlineArr
    this.cityData.totalArr = totalArr
    this.cityData.xData = xData */
    // this.$axios({
    //   url: 'http://localhost:8081/api/ts/queryTsOnLine',
    //   method: 'Get',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': getCookie('loginToken')
    //   }
    // }).then(function (response) {
    //   // console.log(response)
    //   // console.log(response.data.data.innerOffline)
    //
    // }).catch(function (error) {
    //   console.log(error)
    // })
  },
  methods: {
    // 获取随机数
    getRandom: function (max, min) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    resetSetData: function () {
      // this.$axios({
      //   url: 'http://localhost:8081/api/ts/queryTsOnLineByCity',
      //   method: 'Get',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': getCookie('loginToken')
      //   }
      // }).then(function (response) {
      //   console.log(response)
      //   for (var key in response.data.data) {
      //     xData.push(key)
      //     onlineArr.push(response.data.data[key].onLineCountByCity)
      //     totalArr.push(response.data.data[key].onLineCountTotal)
      //   }
      //   console.log('onlineArr')
      //   console.log(onlineArr)
      // }).catch(function (error) {
      //   console.log(error)
      // })

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
  .probe-wrap{
    padding: 0px 10px;
    .probe-title{
      color: #000;
    }
  }

</style>
