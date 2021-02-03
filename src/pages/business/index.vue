<template>
  <div style="height: 100%;" >
    <!--头部元素-->
    <div class="top-wrap" >
      <div class="top-title">
        业务体验
      </div>
      <div class="top-tabs-box">
        <div style="display: block;">
          <!--<p style="font-size: 15px;padding-top: 13px;">{{showName}}</p>-->
          <el-tabs v-model="activeName" type="card" @tab-click="tabsClick">
            <el-tab-pane v-for="(item, index) in tabsArr" :label="item" :key="index" :lazy=true :name="tabs(index)"></el-tab-pane>
            <!--&lt;!&ndash;<el-tab-pane label="宽带拨号" :lazy=true name="tabs0"></el-tab-pane>&ndash;&gt;-->
          </el-tabs>
        </div>
      </div>
    </div>
    <!--内容元素--------------start-->
    <div class="content-wrap" style="overflow: hidden;" ref="scrollDiv">
      <div class="swiper-container" :style="{height: heightBox + 'px' }" style="margin-top: 50px;">
        <div class="swiper-wrapper">
<!--          <div class="swiper-slide" style="height: 100%;" >
          </div>-->
          <!--<div class="swiper-slide" :id="jumpPage(index)" :style="{'min-height': heightBox + 'px'}" :class="index === 0 ? 'padding-top50': '' " :key="index" v-for="(itemDiv, index) in taskArr">-->
          <div class="swiper-slide" style="height: 100%;" :key="index" v-for="(itemDiv, index) in taskArr">
            <div class="chart-wrap">
              <div class="chart-title"> <i class="icon-style"></i>{{ itemDiv.name }}--{{itemDiv.businessArr[0].name}}</div>
              <div class="chart-body" style="">
                <div class="choose-top">
                  <div style="margin-top: 5px;text-align: center;">
                    <el-radio-group v-model="taskArr[index].chooseTime" size="mini" @change="changeTime(index)">
                      <el-radio-button label="Minute">分钟</el-radio-button>
                      <el-radio-button label="Hour">小时</el-radio-button>
                      <el-radio-button label="Day">日</el-radio-button>
                      <el-radio-button label="Week">周</el-radio-button>
<!--                      <el-radio-button label="Month">月</el-radio-button>-->
                    </el-radio-group>
                  </div>
                 <!-- <ul class="choose-ul">
                    <li v-for="(itemLi, indexLi) in itemDiv.businessArr" @click="changeBusiness(index, indexLi)" class="active" :key="indexLi" >
                      <i style="display: inline-block;width: 20px;" class="fa fa-hand-o-right" aria-hidden="true"></i> {{itemLi.name}} </li>
                  </ul>-->
                </div>
                <multiChart :height="getHeight(itemDiv.businessArr.length)" :id="chartId(index)" :xData="taskArr[index].xData" :xUnit="taskArr[index].xUnit"
                            :yData="taskArr[index].yData" :telDataArr="taskArr[index].telDataArr" :unit="taskArr[index].unit" :xTransferData="taskArr[index].xTransferData"
                            :linkDataArr="taskArr[index].linkDataArr" :mobileDataArr="taskArr[index].mobileDataArr" :perData="taskArr[index].chooseTime"></multiChart>
                <!--<div class="flex-center">-->
                <!--<div><span style="font-size: 15px;">移动{{dateShow(index)}}</span><p style="padding: 5px 0px;">{{getAverage(index, 'cmcc')}}{{perShow(index,index)}}</p></div>-->
                <!--<div><span style="font-size: 15px;">联通{{dateShow(index)}}</span><p style="padding: 5px 0px;">{{getAverage(index, 'ctcc')}}{{perShow(index,index)}}</p></div>-->
                <!--<div><span style="font-size: 15px;">电信{{dateShow(index)}}</span><p style="padding: 5px 0px;">{{getAverage(index, 'cucc')}}{{perShow(index,index)}}</p></div>-->
                <!--</div>-->
                <div class="flex-center">
                  <div><svg-icon icon-class="mobile" style="font-size: 30px;"></svg-icon><p style="padding: 5px 0px;">{{getAverage(index, 'cmcc')}}</p></div>
                  <div><svg-icon icon-class="telecom" style="font-size: 30px;"></svg-icon><p style="padding: 5px 0px;">{{getAverage(index, 'cucc')}}</p></div>
                  <div><svg-icon icon-class="unicom" style="font-size: 30px;"></svg-icon><p style="padding: 5px 0px;">{{getAverage(index, 'ctcc')}}</p></div>
                 <!-- <div><span style="font-size: 15px;">移动{{dateShow(index)}}</span><p style="padding: 5px 0px;">{{getAverage(index, 'cmcc')}}</p></div>
                  <div><span style="font-size: 15px;">联通{{dateShow(index)}}</span><p style="padding: 5px 0px;">{{getAverage(index, 'ctcc')}}</p></div>
                  <div><span style="font-size: 15px;">电信{{dateShow(index)}}</span><p style="padding: 5px 0px;">{{getAverage(index, 'cucc')}}</p></div>-->
                </div>
                <p class="data-source">数据来源于：全业务自动拨测系统</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--内容元素--------------end-->
    <tabbar></tabbar>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import Swiper from 'swiper'
import multiChart from '../../components/multiChart'
import tabbar from '../../components/tabbar'
import {getHttpParams} from '../../util/util'
import api from '../../util/api'
import Watermark from '@/util/watermark'
export default {
  name: 'index',
  components: { multiChart, tabbar },
  data () {
    return {
      businessSwiper: '',
      tabsArr: [ '宽带拨号', '网络质量', '网页浏览', '游戏质量', '视频播放', '文件下载' ],
      activeName: 'tabs0',
      showName: '宽带拨号',
      heightBox: '',
      taskName: {
        '41100428': 0, // 拨号成功率
        '40100000': 1, // 网络质量
        '40000000': 2, // 网页 网页首屏时延
        '40100794': 3, // 网游游戏PING
        '41300000': 4, // WEB视频
        '40002000': 5 // http下载
      },
      taskArr: [
        {
          name: '宽带拨号', // 业务名称
          chooseTime: 'Week', // 选择显示周期
          resultData: {}, // 当前结果
          avgValues: [], // 平均值 是 电信 联通 移动的总和
          serviceType: '41100428', // 业务编码
          showItem: 0, // 选择业务 ping 丢包率等
          requested: false, // 是否请求数据
          businessArr: [ // 业务名称
            {name: '拨号成功率'}
          ],
          unit: ' ', // 单位
          xUnit: '', // x轴单位
          // 具体数据
          telDataArr: [], // 电信
          linkDataArr: [], // 联通
          mobileDataArr: [], // 移动
          xData: [], // 接收横坐标数据
          xTransferData: [], // 要显示x轴数据，转义过来数据  月 1-4周 周 2019-5-10 日 0-23 时 01-60
          yData: []
        },
        {
          name: '网络质量',
          chooseTime: 'Week',
          resultData: {},
          avgValues: [],
          serviceType: '40100000',
          showItem: 0,
          requested: false,
          businessArr: [
            {name: 'Ping时延'}
          ],
          unit: ' ', // 单位
          xUnit: '', // x轴单位
          // 具体数据
          telDataArr: [], // 电信
          linkDataArr: [], // 联通
          mobileDataArr: [], // 移动
          xData: [], // 接收横坐标数据
          xTransferData: [], // 要显示x轴数据，转义过来数据  月 1-4周 周 2019-5-10 日 0-23 时 01-60
          yData: []
        },
        {
          name: '网络质量',
          chooseTime: 'Week',
          resultData: {},
          avgValues: [],
          serviceType: '40100000',
          showItem: 1,
          requested: false,
          businessArr: [
            {name: 'PING丢包率'}
          ],
          unit: ' ', // 单位
          xUnit: '', // x轴单位
          // 具体数据
          telDataArr: [], // 电信
          linkDataArr: [], // 联通
          mobileDataArr: [], // 移动
          xData: [], // 接收横坐标数据
          xTransferData: [], // 要显示x轴数据，转义过来数据  月 1-4周 周 2019-5-10 日 0-23 时 01-60
          yData: []
        },
        {
          name: '网页浏览',
          chooseTime: 'Week',
          resultData: {},
          avgValues: [],
          serviceType: '40000000',
          showItem: 1,
          requested: false,
          businessArr: [
            {name: '网页首屏时延'}
          ],
          unit: ' ', // 单位
          xUnit: '', // x轴单位
          // 具体数据
          telDataArr: [], // 电信
          linkDataArr: [], // 联通
          mobileDataArr: [], // 移动
          xData: [], // 接收横坐标数据
          xTransferData: [], // 要显示x轴数据，转义过来数据  月 1-4周 周 2019-5-10 日 0-23 时 01-60
          yData: []
        },
        {
          name: '网页浏览',
          chooseTime: 'Week',
          resultData: {},
          avgValues: [],
          serviceType: '40000000',
          showItem: 0,
          requested: false,
          businessArr: [
            {name: '网页打开成功率'}
          ],
          unit: ' ', // 单位
          xUnit: '', // x轴单位
          // 具体数据
          telDataArr: [], // 电信
          linkDataArr: [], // 联通
          mobileDataArr: [], // 移动
          xData: [], // 接收横坐标数据
          xTransferData: [], // 要显示x轴数据，转义过来数据  月 1-4周 周 2019-5-10 日 0-23 时 01-60
          yData: []
        },
        {
          name: '游戏质量',
          chooseTime: 'Week',
          resultData: {},
          avgValues: [],
          serviceType: '40100794',
          showItem: 0,
          requested: false,
          businessArr: [
            {name: '游戏Ping时延'}
          ],
          unit: ' ', // 单位
          xUnit: '', // x轴单位
          // 具体数据
          telDataArr: [], // 电信
          linkDataArr: [], // 联通
          mobileDataArr: [], // 移动
          xData: [], // 接收横坐标数据
          xTransferData: [], // 要显示x轴数据，转义过来数据  月 1-4周 周 2019-5-10 日 0-23 时 01-60
          yData: []
        },
        {
          name: '游戏质量',
          chooseTime: 'Week',
          resultData: {},
          avgValues: [],
          serviceType: '40100794',
          showItem: 1,
          requested: false,
          businessArr: [
            {name: 'PING丢包率'}
          ],
          unit: ' ', // 单位
          xUnit: '', // x轴单位
          // 具体数据
          telDataArr: [], // 电信
          linkDataArr: [], // 联通
          mobileDataArr: [], // 移动
          xData: [], // 接收横坐标数据
          xTransferData: [], // 要显示x轴数据，转义过来数据  月 1-4周 周 2019-5-10 日 0-23 时 01-60
          yData: []
        },
        {
          name: '视频播放',
          chooseTime: 'Week',
          serviceType: '41300000',
          resultData: {},
          avgValues: [],
          showItem: 0,
          requested: false,
          businessArr: [
            {name: '视频卡顿次数'}
          ],
          unit: ' ', // 单位
          xUnit: '', // x轴单位
          // 具体数据
          telDataArr: [], // 电信
          linkDataArr: [], // 联通
          mobileDataArr: [], // 移动
          xData: [], // 接收横坐标数据
          xTransferData: [], // 要显示x轴数据，转义过来数据  月 1-4周 周 2019-5-10 日 0-23 时 01-60
          yData: []
        },
        {
          name: '视频播放',
          chooseTime: 'Week',
          serviceType: '41300000',
          resultData: {},
          avgValues: [],
          showItem: 1,
          requested: false,
          businessArr: [
            {name: '视频缓冲时长占比'}
          ],
          unit: ' ', // 单位
          xUnit: '', // x轴单位
          // 具体数据
          telDataArr: [], // 电信
          linkDataArr: [], // 联通
          mobileDataArr: [], // 移动
          xData: [], // 接收横坐标数据
          xTransferData: [], // 要显示x轴数据，转义过来数据  月 1-4周 周 2019-5-10 日 0-23 时 01-60
          yData: []
        },
        {
          name: '文件下载',
          chooseTime: 'Week',
          resultData: {},
          avgValues: [],
          serviceType: '40002000',
          showItem: 0,
          requested: false,
          businessArr: [
            {name: '文件下载成功率'}
          ],
          unit: ' ', // 单位
          xUnit: '', // x轴单位
          // 具体数据
          telDataArr: [], // 电信
          linkDataArr: [], // 联通
          mobileDataArr: [], // 移动
          xData: [], // 接收横坐标数据
          xTransferData: [], // 要显示x轴数据，转义过来数据  月 1-4周 周 2019-5-10 日 0-23 时 01-60
          yData: []
        },
        {
          name: '文件下载',
          chooseTime: 'Week',
          resultData: {},
          avgValues: [],
          serviceType: '40002000',
          showItem: 1,
          requested: false,
          businessArr: [
            {name: '文件下载速率'}
          ],
          unit: ' ', // 单位
          xUnit: '', // x轴单位
          // 具体数据
          telDataArr: [], // 电信
          linkDataArr: [], // 联通
          mobileDataArr: [], // 移动
          xData: [], // 接收横坐标数据
          xTransferData: [], // 要显示x轴数据，转义过来数据  月 1-4周 周 2019-5-10 日 0-23 时 01-60
          yData: []
        }
      ]
    }
  },
  async created () {
    // this.getHeight = window.innerHeight - 60 || document.documentElement.clientHeight - 60 || document.body.clientHeight - 60
    // console.log('this.created', this.getHeight)
    var kpi41100428day = await api.get(this.GLOBAL.BASE_URL + '/api/buss/kpi/41100428/' + this.taskArr[0].chooseTime, {})
    if (kpi41100428day.data.code === 0) {
      // taskName, business,  taskData
      // console.log(kpi41100428day, JSON.stringify(kpi41100428day))
      this.resetSetDataNew(0, 0, kpi41100428day.data.data)
    }
  },
  async mounted () {
    let account = window.sessionStorage.getItem('account')
    let mobile = window.sessionStorage.getItem('mobile')
    Watermark.set(account + '   ' + mobile)
    let _this = this
    // console.log(_this.taskArr[0].telDataArr.length)
    // let kpi41100428day = await api.get(this.GLOBAL.BASE_URL + '/api/buss/kpi/41100428/' + this.taskArr[0].chooseTime, {})
    this.heightBox = document.documentElement.clientHeight - 100
    this.businessSwiper = new Swiper('.swiper-container', {
      direction: 'vertical',
      autoplay: false,
      loop: false,
      on: {
        tap: function (event) {
          // console.log(event)
        },
        slideChange: function () {
          // console.log('start')
        },
        async slideChangeTransitionEnd () {
          let swiperIndex = this.realIndex
          // console.log(swiperIndex)
         /* if (swiperIndex === 0) {
            _this.$router.push({ path: '/comprehensive' })
          } else*/ if (swiperIndex === 0) {
            _this.activeName = 'tabs0'
            _this.taskArr[0].chooseTime = 'Week'
            _this.changeTime(0)
            // _this.showName = _this.taskArr[0].name
          } else if (swiperIndex === 1) { // '40100000': 1, // 网络质量
            _this.activeName = 'tabs1'
            _this.taskArr[1].chooseTime = 'Week'
            if (!_this.taskArr[1].requested) {
              let kpi40100000day = await api.get(_this.GLOBAL.BASE_URL + '/api/buss/kpi/40100000/' + _this.taskArr[1].chooseTime, {})
              if (kpi40100000day.data.code === 0) {
                // taskName, business,  taskData
                // console.log('kpi40100000day', JSON.stringify(kpi40100000day.data.data))
                _this.resetSetDataNew(1, 0, kpi40100000day.data.data)
              }
            } else {
              _this.changeTime(1)
            }
          } else if (swiperIndex === 2) { // '40100000': 1, // 网络质量
            _this.activeName = 'tabs1'
            _this.taskArr[2].chooseTime = 'Week'
            if (!_this.taskArr[2].requested) {
              let kpi40100000day = await api.get(_this.GLOBAL.BASE_URL + '/api/buss/kpi/40100000/' + _this.taskArr[2].chooseTime, {})
              if (kpi40100000day.data.code === 0) {
                _this.resetSetDataNew(2, 1, kpi40100000day.data.data)
              }
            } else {
              _this.changeTime(2)
            }
          } else if (swiperIndex === 3) { // '40000000': 2, // 网页 网页主要展现时延
            _this.activeName = 'tabs2'
            _this.taskArr[3].chooseTime = 'Week'
            if (!_this.taskArr[3].requested) {
              let kpi40100000day = await api.get(_this.GLOBAL.BASE_URL + '/api/buss/kpi/40000000/' + _this.taskArr[3].chooseTime, {})
              if (kpi40100000day.data.code === 0) {
                _this.resetSetDataNew(3, 1, kpi40100000day.data.data)
              }
            } else {
              _this.changeTime(3)
            }
          } else if (swiperIndex === 4) { // '40000000': 2, // 网页 网页主要展现时延
            _this.activeName = 'tabs2'
            _this.taskArr[4].chooseTime = 'Week'
            if (!_this.taskArr[4].requested) {
              let kpi40100000day = await api.get(_this.GLOBAL.BASE_URL + '/api/buss/kpi/40000000/' + _this.taskArr[4].chooseTime, {})
              if (kpi40100000day.data.code === 0) {
                _this.resetSetDataNew(4, 0, kpi40100000day.data.data)
              }
            } else {
              _this.changeTime(4)
            }
          } else if (swiperIndex === 5) { // '40100794': 3, // 网游游戏PING
            _this.activeName = 'tabs3'
            _this.taskArr[5].chooseTime = 'Week'
            if (!_this.taskArr[5].requested) {
              let kpi40100000day = await api.get(_this.GLOBAL.BASE_URL + '/api/buss/kpi/40100794/' + _this.taskArr[5].chooseTime, {})
              if (kpi40100000day.data.code === 0) {
                _this.resetSetDataNew(5, 0, kpi40100000day.data.data)
              }
            } else {
              _this.changeTime(5)
            }
          } else if (swiperIndex === 6) { // '40100794': 3, // 网游游戏PING
            _this.activeName = 'tabs3'
            _this.taskArr[6].chooseTime = 'Week'
            if (!_this.taskArr[6].requested) {
              let kpi40100000day = await api.get(_this.GLOBAL.BASE_URL + '/api/buss/kpi/40100794/' + _this.taskArr[6].chooseTime, {})
              if (kpi40100000day.data.code === 0) {
                _this.resetSetDataNew(6, 1, kpi40100000day.data.data)
              }
            } else {
              _this.changeTime(6)
            }
          } else if (swiperIndex === 7) { // '41300000': 4, // WEB视频
            _this.activeName = 'tabs4'
            _this.taskArr[7].chooseTime = 'Week'
            if (!_this.taskArr[7].requested) {
              let kpi40100000day = await api.get(_this.GLOBAL.BASE_URL + '/api/buss/kpi/41300000/' + _this.taskArr[7].chooseTime, {})
              if (kpi40100000day.data.code === 0) {
                _this.resetSetDataNew(7, 0, kpi40100000day.data.data)
              }
            } else {
              _this.changeTime(7)
            }
          } else if (swiperIndex === 8) { // '41300000': 4, // WEB视频
            _this.activeName = 'tabs4'
            _this.taskArr[8].chooseTime = 'Week'
            if (!_this.taskArr[8].requested) {
              let kpi40100000day = await api.get(_this.GLOBAL.BASE_URL + '/api/buss/kpi/41300000/' + _this.taskArr[8].chooseTime, {})
              if (kpi40100000day.data.code === 0) {
                _this.resetSetDataNew(8, 1, kpi40100000day.data.data)
              }
            } else {
              _this.changeTime(8)
            }
          } else if (swiperIndex === 9) { // '40002000': 5 // http下载
            _this.activeName = 'tabs5'
            _this.taskArr[9].chooseTime = 'Week'
            if (!_this.taskArr[9].requested) {
              let kpi40100000day = await api.get(_this.GLOBAL.BASE_URL + '/api/buss/kpi/40002000/' + _this.taskArr[9].chooseTime, {})
              if (kpi40100000day.data.code === 0) {
                _this.resetSetDataNew(9, 0, kpi40100000day.data.data)
              }
            } else {
              _this.changeTime(9)
            }
          } else if (swiperIndex === 10) { // '40002000': 5 // http下载
            _this.activeName = 'tabs5'
            _this.taskArr[10].chooseTime = 'Week'
            if (!_this.taskArr[10].requested) {
              let kpi40100000day = await api.get(_this.GLOBAL.BASE_URL + '/api/buss/kpi/40002000/' + _this.taskArr[10].chooseTime, {})
              if (kpi40100000day.data.code === 0) {
                _this.resetSetDataNew(10, 1, kpi40100000day.data.data)
              }
            } else {
              _this.changeTime(10)
            }
          }
        }
      }
    })
    // this.getHeight = window.innerHeight - 60 || document.documentElement.clientHeight - 60 || document.body.clientHeight - 60
    // console.log('this.mounted', this.getHeight)
    // window.addEventListener('scroll', this.jump)
    // window.addEventListener('scroll', this.scrollToTop)
    if (getHttpParams('tab')) {
      // this.activeName = 'tabs' + getHttpParams('tab')
      // document.getElementById('jumpPage' + getHttpParams('tab')).scrollIntoView(true)
    }
  },
  beforeDestroy () {
    this.heightBox = window.innerHeight - 100 || document.documentElement.clientHeight - 100 || document.body.clientHeight - 100
  },
  methods: {
    tabs: function (index) {
      return 'tabs' + index
    },
    async tabsClick (tab, event) {
      // return false
      let index = tab._data.index
      // console.log(index)
      if (index === '0') {
        this.businessSwiper.slideTo(0)
      } else if (index === '1') {
        this.businessSwiper.slideTo(1)
      } else if (index === '2') {
        this.businessSwiper.slideTo(3)
      } else if (index === '3') {
        this.businessSwiper.slideTo(5)
      } else if (index === '4') {
        this.businessSwiper.slideTo(7)
      } else if (index === '5') {
        this.businessSwiper.slideTo(9)
      }
      // 显示到当前的元素
      // this.activeName = 'tabs' + index

      // var index = $(this).index();
      // swiper.slideTo(index)
      // if (!this.taskArr[index].requested) {
      //   var kpi = await api.get(this.GLOBAL.BASE_URL + '/api/buss/kpi/' + this.taskArr[index].serviceType + '/' + this.taskArr[index].chooseTime, {})
      //   if (kpi.data.code === 0) {
      //     this.resetSetData(this.taskArr[index].serviceType, this.taskArr[index].showItem, kpi.data.data)
      //   }
      // }
      // document.getElementById('jumpPage' + index).scrollIntoView(true)
    },
    jumpPage: function (index) {
      return 'jumpPage' + index
    },
    getHeight: function (i) {
      let num = i
      if (num > 3) {
        num = 3
      }
      // 325 = top 50 + tabbar 50 + 其他的高度
      return window.innerHeight - (325 + 25 * num) || document.documentElement.clientHeight - (325 + 25 * num) || document.body.clientHeight - (325 + 25 * num)
    },
    chartId: function (index) {
      return 'chartId' + index
    },
    getRandom: function (max, min) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 获取平均值
    getAverage: function (index, type) {
      let v = '无'
      // let showItem = this.taskArr[index].showItem

      if (type === 'cucc') {
        // v  = '电信'
        for (let val in this.taskArr[index].avgValues) {
          if (this.taskArr[index].avgValues[val].name === 'cucc') {
            // v = 10000
            v = this.taskArr[index].avgValues[val].value
          }
        }
      } else if (type === 'cmcc') {
        // v  = '移动'
        for (let val in this.taskArr[index].avgValues) {
          if (this.taskArr[index].avgValues[val].name === 'cmcc') {
            // v = 10086
            v = this.taskArr[index].avgValues[val].value
          }
        }
      } else if (type === 'ctcc') {
        // v  = '联通'
        for (let val in this.taskArr[index].avgValues) {
          if (this.taskArr[index].avgValues[val].name === 'ctcc') {
            // v = 10010
            v = this.taskArr[index].avgValues[val].value
          }
        }
      }
      let unit = this.taskArr[index].unit

      if (v === null) {
        return '无'
      }

      if (unit === '%') {
        // v = Number(v * 100).toFixed(1)
        v = v.toFixed(1)
      }
      return v + unit
    },
    // 单位函数
    perShow: function (index, i) {
      // let chooseTime = this.taskArr[index].businessArr[i].name
      // if ( ) {

      // }
      return this.taskArr[index].unit
    },
    // 显示日期
    dateShow: function (index) {
      let chooseTime = this.taskArr[index].chooseTime
      let per = null
      let date = new Date()
      let time = date.getHours()
      if (chooseTime === 'Minute') {
        per = time + '时指标'
      } else if (chooseTime === 'Day') {
        per = '今天指标'
      } else if (chooseTime === 'Week') {
        per = '本周指标'
      } else if (chooseTime === 'Month') {
        per = '本月指标'
      }
      return per
    },
    /**
     * taskName 业务的索引
     * business 任务的索引 成功率 丢包率等
     * taskData 业务数据
     * */
    resetSetDataNew: function (taskName, business, taskData) {
      // console.log(taskData)
      // 通过任务名拿到相关索引值   如400000 --》 2
      // let tabIndex = this.taskName[taskName]
      let tabIndex = taskName
      this.taskArr[tabIndex].resultData = taskData

      // 确定要显示的时间 this.taskArr[index].chooseTime
      let chooseTime = this.taskArr[tabIndex].chooseTime
      let mobileData = [] // 移动
      let linkData = [] // 联通
      let telData = [] // 电信
      let xData = [] // 横坐标
      let avgValue = [] // 均值
      let unit = '' // 均值
      if (taskData.operators !== null || taskData.operators !== undefined) {
        let operatorsList = taskData.operators // 电信联通移动
        if (business === 1) {
          for (let cc in operatorsList) {
            // 电信联通移动 各个数值为多少
            let priceValue = operatorsList[cc].normList[1].values
            if (operatorsList[cc].code === 46000) { // 移动
              unit = operatorsList[cc].normList[business].unit
              avgValue.push({name: 'cmcc', value: operatorsList[cc].normList[1].avgValue})
              for (let v in priceValue) {
                xData.push(priceValue[v].time)
                mobileData.push(priceValue[v].value == null ? '' : priceValue[v].value.toFixed(2))
              }
            } else if (operatorsList[cc].code === 46002) { // 联通
              avgValue.push({name: 'ctcc', value: operatorsList[cc].normList[1].avgValue})
              for (let v in priceValue) {
                linkData.push(priceValue[v].value == null ? '' : priceValue[v].value.toFixed(2))
              }
            } else if (operatorsList[cc].code === 46003) { // 电信
              avgValue.push({name: 'cucc', value: operatorsList[cc].normList[1].avgValue})
              for (let v in priceValue) {
                telData.push(priceValue[v].value == null ? '' : priceValue[v].value.toFixed(2))
              }
            }
          }
        } else {
          for (let cc in operatorsList) {
            // 电信联通移动 各个数值为多少
            let priceValue = operatorsList[cc].normList[business].values
            if (operatorsList[cc].code === 46000) { // 移动
              unit = operatorsList[cc].normList[business].unit
              avgValue.push({name: 'cmcc', value: operatorsList[cc].normList[business].avgValue})
              for (let v in priceValue) {
                xData.push(priceValue[v].time)
                mobileData.push(priceValue[v].value == null ? '' : priceValue[v].value.toFixed(2))
              }
            } else if (operatorsList[cc].code === 46002) { // 联通
              avgValue.push({name: 'ctcc', value: operatorsList[cc].normList[business].avgValue})
              for (let v in priceValue) {
                linkData.push(priceValue[v].value == null ? '' : priceValue[v].value.toFixed(2))
              }
            } else if (operatorsList[cc].code === 46003) { // 电信
              avgValue.push({name: 'cucc', value: operatorsList[cc].normList[business].avgValue})
              for (let v in priceValue) {
                telData.push(priceValue[v].value == null ? '' : priceValue[v].value.toFixed(2))
              }
            }
          }
        }
      }

      //  根据xdata进行转换数据
      let xTransferData = [] // 转义过后横坐标，真实显示   转义过来数据  月 第1周-第4周 周 2019-5-10 日 0-23 时 01-60
      if (chooseTime === 'Minute') {
        for (let v in xData) {
          let sum = xData[v]
          xTransferData.push(sum.substring(8, 10) + ':' + sum.substring(10, 12))
        }
      } else if (chooseTime === 'Hour') {
        for (let v in xData) {
          let sum = v
          xTransferData.push((sum) + '点')
        }
      } else if (chooseTime === 'Day') {
        for (let v in xData) {
          let sum = xData[v]
          let split = sum.split('-')
          xTransferData.push((split[1] + '月' + split[2] + '日') + '')
        }
      } else if (chooseTime === 'Week') {
        for (let v in xData) {
          xTransferData.push(xData[v])
        }
      } else if (chooseTime === 'Month') {
        for (let v in xData) {
          let sum = ++v
          xTransferData.push('第' + (sum) + '周')
        }
      }
      // console.log('mobileData', mobileData)
      this.taskArr[tabIndex].linkDataArr = linkData
      this.taskArr[tabIndex].telDataArr = telData
      this.taskArr[tabIndex].mobileDataArr = mobileData
      // xData存储真是x值  xTransferData存储是转义后的x值
      this.taskArr[tabIndex].xData = xData
      this.taskArr[tabIndex].xTransferData = xTransferData
      this.taskArr[tabIndex].avgValues = avgValue
      this.taskArr[tabIndex].unit = unit
      // 进行判断是否可以再起请求
      this.taskArr[tabIndex].requested = true
    },
    /**
     * index 业务的索引
     * businessIndex 任务的索引
     * */
    changeBusiness (index, businessIndex) {
      // 1、改变索引值
      let val = this.taskArr[index].showItem
      if (val === businessIndex) {
        // console.log('未改变')
      } else {
        // this.taskArr[index].showItem = businessIndex
        //  2、获取数据
        // this.resetSetDataNew(this.taskArr[index].serviceType, businessIndex, this.taskArr[index].resultData)
      }
    },
    /**
     * index 任务索引
     * */
    changeTime: async function (index) {
      var kpi = await api.get(this.GLOBAL.BASE_URL + '/api/buss/kpi/' + this.taskArr[index].serviceType + '/' + this.taskArr[index].chooseTime, {})
      if (kpi.data.code === 0) {
        // if (this.taskArr[index].chooseTime === 'Minute') {
        //   this.taskArr[index].xUnit = ''
        //   // console.log('分')
        // } else if (this.taskArr[index].chooseTime === 'Day') {
        //   this.taskArr[index].xUnit = ''
        // } else if (this.taskArr[index].chooseTime === 'Week') {
        //   this.taskArr[index].xUnit = ''
        // } else if (this.taskArr[index].chooseTime === 'Month') {
        //   this.taskArr[index].xUnit = ''
        // }
        this.resetSetDataNew(index, this.taskArr[index].showItem, kpi.data.data)
      }
    }
  }
}
</script>
<style>
  @import "../../../static/scss/reset.css";
  .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: gray;
  }
</style>
<style scoped lang="scss">
  @import "../../../static/scss/com.css";
  .choose-top{
    /*display: -webkit-flex;*/
    /*justify-content:space-between;*/
    /*align-items: center;*/
    .choose-ul{
      max-height: 70px;
      padding: 0px;
      margin: 0px;
      margin-bottom: 5px;
      overflow: auto;
      li{
        list-style: none;
        padding: 2px 0px;
        font-size: 15px;
      }
      .active{
        color: #e0fa02;
      }
    }
  }
  .flex-center{
    padding: 10px 0px 5px 0px;
    display: flex;
    display: -webkit-flex;
    justify-content:space-around;
    div{
      text-align: center;
      p{
        color: #000;
      }
    }
  }
</style>
