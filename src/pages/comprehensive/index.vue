<template>
  <div style="height: 100%;">
    <!--头部元素-->
    <div class="top-wrap">
      <div class="top-title">
        综合质量
      </div>
      <div class="top-tabs-box">
        <div style="display: block;">
          <el-tabs v-model="activeName" type="card" @tab-click="tabsClickTop">
            <el-tab-pane label="全省综合质量"   :lazy=true name="tabs1"></el-tab-pane>
            <el-tab-pane label="综合评分"  :lazy=true name="tabs2"></el-tab-pane>
            <el-tab-pane label="达标率"  :lazy=true name="tabs3"></el-tab-pane>
            <el-tab-pane label="在线率"  :lazy=true name="tabs4"></el-tab-pane>
            <el-tab-pane label="关键指标趋势分析"  :lazy=true name="tabs5"></el-tab-pane>
            <el-tab-pane label="关键指标忙闲时对比"  :lazy=true name="tabs6"></el-tab-pane>
            <el-tab-pane label="竞对分析"  :lazy=true name="tabs7"></el-tab-pane>
            <el-tab-pane label="质差分析"  :lazy=true name="tabs8"></el-tab-pane>
<!--            <el-tab-pane label="宽带达标率"  :lazy=true name="tabs6"></el-tab-pane>-->
            <!--<el-tab-pane label="宽带达标率" :lazy=true name="third">-->
            <!--</el-tab-pane>-->
          </el-tabs>
        </div>
      </div>
    </div>
    <!--内容元素--------------start-->
     <div class="content-wrap" ref="scrollDiv1" style="overflow: hidden;">
       <div class="swiper-container" style="margin-top: 50px;" :style="{height: heightBox + 'px' }" >
         <div class="swiper-wrapper">
           <!--1、全省综合质量-->
           <div class="swiper-slide" :style="{'min-height': heightBox + 'px'}" style="overflow: auto;">
             <div class="chart-wrap" style="margin-bottom: 10px;height: calc(100% - 30px);overflow-y: auto;">
               <div class="chart-title chart-line"> <i class="icon-style"></i>全省综合质量</div>
               <div class="chart-body" style="">
                 <!--<div align="center" style="padding: 10px 0px;"> 今天最低：0 分， 最高100分，平均 50分</div>-->
                 <scMap ref="page1Map" id="scMap" :height="300" :dataArr="mapData" :scoreRange="scoreRange"></scMap>
                 <!--<div align="center" style="padding: 30px 0px 0px;">
                   说明：视图展示今天0点到现在全省关键指标数据。
                 </div>-->
               </div>
             </div>
           </div>
            <!-- 2、综合评分 -->
           <div class="swiper-slide" :style="{'min-height': heightBox + 'px'}" style="overflow: auto;">
             <div class="chart-wrap" style="margin-bottom: 10px;height: calc(100% - 30px);overflow-y: auto;">
               <!--<div class="chart-title chart-line"> <i class="icon-style"></i>全省综合评分</div>
               <div class="chart-body" style="">
                 <div id="rateScoreChart" :style="{'height': heightBox - 60 + 'px'}"></div>
               </div>-->
               <scoreLine ref="scoreLine" :heightBox="heightBox"/>
             </div>
           </div>
           <!-- 3、达标率  -->
           <div class="swiper-slide" :style="{'min-height': heightBox + 'px'}" style="overflow: auto;">
             <div class="chart-wrap" style="margin-bottom: 10px;height: calc(100% - 30px);overflow-y: auto;">
               <reachStandard ref="reachStandard" :heightBox="heightBox"/>
             </div>
           </div>
           <!--3、在线率  -->
           <div class="swiper-slide" :style="{'min-height': heightBox + 'px'}" style="overflow: auto;">
             <div class="chart-wrap" style="margin-bottom: 10px;height: calc(100% - 30px);overflow-y: auto;">
               <tsOnlineRate ref="tsOnlineRate" :heightBox="heightBox"/>
             </div>
           </div>

           <!--5、关键指标趋势分析-->
           <div class="swiper-slide" :style="{'min-height': heightBox + 'px'}" style="overflow: auto;">
             <div class="chart-wrap" style="margin-bottom: 10px;height: calc(100% - 30px);overflow-y: auto;">
               <div class="chart-title chart-line"> <i class="icon-style"></i>关键指标趋势分析</div>
               <div class="chart-body" style="">
                 <div style="" class="reset-table-swiper">
                   <el-table
                     :height="heightBox - 90"
                     :data="trendAnalysisTable"
                     style="width: 100%">
                     <el-table-column
                       prop="normName"
                       label="指标">
                       <template scope="scope">
                         {{scope.row.normName}}({{scope.row.normUnit}})
                       </template>
                     </el-table-column>
                     <el-table-column label="今日指标" align="center">
                       <template scope="scope">
                         <el-tooltip class="item" effect="light" :content="trendTip(scope.row)" placement="top">
                           <div style="position: relative;width: 100%">
                             <div class="item-bar" style="display: flex;height: 16px;">
                               <div class="item "
                                    style="text-align: left;color: white"
                                    :style="{width : trendRatio(scope.row,'min')  + '%', background: scope.row.matchIndex=='0'?'#FE4365':'#83AF9B'}">
                               </div>
                               <div class="item "
                                    style="background: #FFBA0C;text-align: left;color: white"
                                    :style="{width : trendRatio(scope.row,'avg')  + '%'}">
                               </div>
                               <div class="item "
                                    style="text-align: left;color: white"
                                    :style="{width : trendRatio(scope.row,'max')  + '%', background: scope.row.matchIndex=='0'?'#83AF9B':'#FE4365'}">
                               </div>
                             </div>
                           </div>
                         </el-tooltip>
                       </template>
                     </el-table-column>
                     <el-table-column
                       prop="rate1"
                       width="70px"
                       label="同比" align="center">
                       <template scope="scope">
                         <div :style="{color: contrastRatio(scope.row.normValue,scope.row.normValue_lastWeek,scope.row.matchIndex).contrastFlag === 'up' ? 'green' : 'red'}">
                           <i :class="contrastRatio(scope.row.normValue,scope.row.normValue_lastWeek,scope.row.matchIndex).contrastFlag === 'up' ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>{{ contrastRatio(scope.row.normValue,scope.row.normValue_lastWeek,scope.row.matchIndex).contrastRatio }}
                         </div>
                       </template>
                     </el-table-column>
                     <el-table-column
                       prop="rete2"
                       width="70px"
                       align="center"
                       label="环比">
                       <template scope="scope">
                         <div :style="{color: contrastRatio(scope.row.normValue,scope.row.normValue_lastMonth,scope.row.matchIndex).contrastFlag === 'up' ? 'green' : 'red'}">
                           <i :class="contrastRatio(scope.row.normValue,scope.row.normValue_lastMonth,scope.row.matchIndex).contrastFlag === 'up' ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>{{ contrastRatio(scope.row.normValue,scope.row.normValue_lastMonth,scope.row.matchIndex).contrastRatio }}
                         </div>
                       </template>
                     </el-table-column>
                   </el-table>
                   <div style="line-height: 30px;text-align: center;color: #999;">说明：环比为上周同一天，同比为上月同一天。</div>
                 </div>
               </div>
             </div>
           </div>

           <!-- 6、关键指标忙闲时对比  -->
           <div class="swiper-slide" :style="{'min-height': heightBox + 'px'}" style="overflow: auto;">
             <div class="chart-wrap" style="margin-bottom: 10px;height: calc(100% - 30px);overflow-y: auto;">
               <div class="chart-title chart-line"> <i class="icon-style"></i>关键指标忙闲时对比</div>
               <div class="chart-body" style="">
                 <div style="" class="reset-table-swiper">
                   <el-table
                     :height="heightBox - 90"
                     :data="busyAnalysisTable"
                     :span-method="objectSpanMethod"
                     border
                     style="width: 100%;">
                     <el-table-column
                       prop="normName"
                       label="业务指标">
                       <template scope="scope">
                         {{scope.row.normName}}({{scope.row.normUnit}})
                       </template>
                     </el-table-column>
                     <el-table-column
                       prop="normValue_busy"
                       label="昨日忙时"
                       width="80px">
                     </el-table-column>
                     <el-table-column
                       prop="normValue_free"
                       label="昨日闲时"
                       width="80px">
                     </el-table-column>
                   </el-table>
                   <div style="line-height: 30px;text-align: center;color: #999;">说明：忙时为20-23点，闲时为8-18点。</div>
                 </div>
               </div>
             </div>
           </div>

           <!-- 7、竞对分析 -->
           <div class="swiper-slide" :style="{'min-height': heightBox + 'px'}" style="overflow: auto;">
             <div class="chart-wrap" style="margin-bottom: 10px;height: calc(100% - 30px);overflow-y: auto;">
               <div class="chart-title chart-line"> <i class="icon-style"></i>竞对分析</div>
               <div class="chart-body" style="">
                 <div style="" class="reset-table-swiper">
                   <el-table
                     :height="heightBox - 90"
                     :data="contrastAnalysisTable"
                     border
                     style="width: 100%;">
                     <el-table-column
                       prop="normName"
                       width="140"
                       label="指标">
                       <template scope="scope">
                         {{scope.row.normName}}({{scope.row.normUnit}})
                       </template>
                     </el-table-column>
                     <el-table-column
                       prop="busy"
                       label="展示">
                       <template scope="scope">
                         <el-tooltip class="item" effect="light" :content="jingDuiTip(scope.row)" placement="top">
                           <div style="display: flex;">
                             <div style="position:relative;height: 50px;width: calc(100% - 30px)">
                               <div style="position:absolute;left: 2px;background: #83AF9B;height: 12px;" :style="{width: jingDuiRatio(scope.row.normValue_46000,scope.row) + '%'}"></div>
                               <div style="position:absolute;left: 2px;top: 18px; background: #2196F3;height: 12px;" :style="{width: jingDuiRatio(scope.row.normValue_46003,scope.row) + '%'}"></div>
                               <div style="position:absolute;left: 2px;top: 36px; background: #FE4365;height: 12px;" :style="{width: jingDuiRatio(scope.row.normValue_46001,scope.row) + '%'}"></div>

                               <div style="position:absolute;padding-left: 10px;width: 30px" :style="{left:  jingDuiRatio(scope.row.normValue_46000,scope.row) + '%',color:scope.row.rank==1?'#83AF9B':scope.row.rank==2?'#2196F3':scope.row.rank==3?'#FE4365':''}">{{scope.row.rank}}</div>
                               <div style="position:absolute;top: 18px;padding-left: 10px;width: 30px;" :style="{left:  jingDuiRatio(scope.row.normValue_46003,scope.row) + '%'}"></div>
                               <div style="position:absolute;top: 36px;padding-left: 10px;width: 30px;" :style="{left:  jingDuiRatio(scope.row.normValue_46001,scope.row) + '%'}"></div>
                             </div>
                           </div>
                         </el-tooltip>
                       </template>
                     </el-table-column>
                   </el-table>
                   <div style="line-height: 30px;text-align: center;color: #999;">指标说明：移动为绿色，电信为蓝色，联通为红色。</div>
                 </div>
               </div>
             </div>
           </div>

           <!-- 8、质差分析 -->
           <div class="swiper-slide" :style="{'min-height': heightBox + 'px'}" style="overflow: auto;">
             <div class="chart-wrap" style="margin-bottom: 10px;height: calc(100% - 30px);overflow-y: auto;">
               <div class="chart-title chart-line"> <i class="icon-style"></i>质差分析</div>
               <div class="chart-body" style="">
                 <div class="reset-table-swiper">
                   <el-table
                     :data="zhiCha_40000000"
                     border
                     style="width: 100%;">
                     <el-table-column prop="type" label="类型" min-width="40%">网站</el-table-column>
                     <el-table-column prop="urlName" label="名称" width=""></el-table-column>
                     <el-table-column label="质差URL占比" min-width="100%">
                       <template scope="scope">
                         <el-tooltip class="item" effect="light" :content="zhiChaTip(scope.row)" placement="top">
                           <div style="position: relative;width: 100%;">
                             <div class="item-bar" style="display: flex;height: 16px;">
                               <div class="item "
                                    style="background: #83AF9B;text-align: center;color: white"
                                    :style="{width : zhiChaRatio(scope.row.normValue_46000,scope.row)  + '%'}">
                               </div>
                               <div class="item "
                                    style="background: #2196F3;text-align: center;color: white"
                                    :style="{width : zhiChaRatio(scope.row.normValue_46003,scope.row)  + '%'}">
                               </div>
                               <div class="item "
                                    style="background: #FE4365;text-align: center;color: white"
                                    :style="{width : zhiChaRatio(scope.row.normValue_46001,scope.row)  + '%'}">
                               </div>
                             </div>
                           </div>
                         </el-tooltip>
                       </template>
                     </el-table-column>
                     <el-table-column prop="delay" label="首屏时延(s)" width="">
                       <template scope="scope">
                         <span style="color: #83AF9B">{{scope.row.normValue_46000}}</span>&nbsp;
                         <span style="color: #2196F3">{{scope.row.normValue_46003}}</span>&nbsp;
                         <span style="color: #FE4365">{{scope.row.normValue_46001}}</span>
                       </template>
                     </el-table-column>
                   </el-table><br/>
                   <el-table
                     :data="zhiCha_41300000"
                     border
                     style="width: 100%;">
                     <el-table-column prop="type" label="类型" min-width="40%">视频</el-table-column>
                     <el-table-column prop="urlName" label="名称" width=""></el-table-column>
                     <el-table-column label="质差URL占比" min-width="100%">
                       <template scope="scope">
                         <el-tooltip class="item" effect="light" :content="zhiChaTip(scope.row)" placement="top">
                           <div style="position: relative;width: 100%">
                             <div class="item-bar" style="display: flex;height: 16px;">
                               <div class="item "
                                    style="background: #83AF9B;text-align: center;color: white"
                                    :style="{width : zhiChaRatio(scope.row.normValue_46000,scope.row)  + '%'}">
                               </div>
                               <div class="item "
                                    style="background: #2196F3;text-align: center;color: white"
                                    :style="{width : zhiChaRatio(scope.row.normValue_46003,scope.row)  + '%'}">
                               </div>
                               <div class="item "
                                    style="background: #FE4365;text-align: center;color: white"
                                    :style="{width : zhiChaRatio(scope.row.normValue_46001,scope.row)  + '%'}">
                               </div>
                             </div>
                           </div>
                         </el-tooltip>
                       </template>
                     </el-table-column>
                     <el-table-column prop="delay" label="卡顿时长占比(%)" width="">
                       <template scope="scope">
                         <span style="color: #83AF9B">{{scope.row.normValue_46000}}</span>&nbsp;
                         <span style="color: #2196F3">{{scope.row.normValue_46003}}</span>&nbsp;
                         <span style="color: #FE4365">{{scope.row.normValue_46001}}</span>
                       </template>
                     </el-table-column>
                   </el-table><br/>
                   <el-table
                     :data="zhiCha_40100794"
                     border
                     style="width: 100%;">
                     <el-table-column prop="type" label="类型" min-width="40%">游戏</el-table-column>
                     <el-table-column prop="urlName" label="名称" width=""></el-table-column>
                     <el-table-column label="质差URL占比" min-width="100%">
                       <template scope="scope">
                         <el-tooltip class="item" effect="light" :content="zhiChaTip(scope.row)" placement="top">
                           <div style="position: relative;width: 100%">
                             <div class="item-bar" style="display: flex;height: 16px;">
                               <div class="item "
                                    style="background: #83AF9B;text-align: center;color: white"
                                    :style="{width : zhiChaRatio(scope.row.normValue_46000,scope.row)  + '%'}">
                               </div>
                               <div class="item "
                                    style="background: #2196F3;text-align: center;color: white"
                                    :style="{width : zhiChaRatio(scope.row.normValue_46003,scope.row)  + '%'}">
                               </div>
                               <div class="item "
                                    style="background: #FE4365;text-align: center;color: white"
                                    :style="{width : zhiChaRatio(scope.row.normValue_46001,scope.row)  + '%'}">
                               </div>
                             </div>
                           </div>
                         </el-tooltip>
                       </template>
                     </el-table-column>
                     <el-table-column prop="delay" label="游戏丢包率(%)" width="">
                       <template scope="scope">
                         <span style="color: #83AF9B">{{scope.row.normValue_46000}}</span>&nbsp;
                         <span style="color: #2196F3">{{scope.row.normValue_46003}}</span>&nbsp;
                         <span style="color: #FE4365">{{scope.row.normValue_46001}}</span>
                       </template>
                     </el-table-column>
                   </el-table>
                   <div style="line-height: 30px;text-align: center;color: #999;">指标说明：移动为绿色，电信为蓝色，联通为红色。</div>
                 </div>
               </div>
             </div>
           </div>

           <!--  <div class="swiper-slide" :style="{'min-height': heightBox + 'px'}" style="overflow: auto;">
               <div class="chart-wrap" style="margin-bottom: 10px;height: calc(100% - 30px);overflow-y: auto;">
                 <div class="chart-title chart-line"> <i class="icon-style"></i>家庭宽带KQI综合质量评分</div>
                 <div class="chart-body" style="">
                   &lt;!&ndash;<sichuanMap id="mapChart"  :height="getHeight('map')" :dataArr="mapData" :scoreRange="scoreRange"></sichuanMap>&ndash;&gt;
                   <sichuanMap id="mapChart"  :height="300" :dataArr="mapData" :scoreRange="scoreRange"></sichuanMap>
                   <div class="grade-box" style="">
                   </div>
                   <div style="">
                     <p>KQI评分最差地市</p>
                     <div v-if="upBadList.length === 0" style="padding: 15px 0px;text-align: center;">无</div>
                     <div style="padding-bottom: 5px">
                       <span style="font-size: 13px;padding-left: 20px;display:inline-block; width: calc(50% - 21px)" v-for="(scoreBad, index) in scoreBadList" :key="index+'avg'">  {{scoreBad.city.substring(0, 4)}} : {{scoreBad.value}} 分</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
             <div class="swiper-slide" :style="{'min-height': heightBox + 'px'}" style="overflow: auto;">
               <div class="chart-wrap" style="margin-bottom: 10px;height: calc(100% - 30px);overflow-y: auto;">
                 <div class="chart-title chart-line"> <i class="icon-style"></i>拨测质量达标率</div>
                 <div style="text-align: right">全省均值（移动宽带）: {{ProvincialMean}}</div>
                 <singleChart id="myChart2"  :height="300" :yData="lineYData" :xData="lineXData" :seriesData="lineSeriesData" ></singleChart>
                 <div>
                   <p>达标率最差地市</p>
                   <div v-if="upBadList.length === 0" style="padding: 15px 0px;text-align: center;">无</div>
                   <div style="">
                     <span style="font-size: 13px;padding-left: 20px;display: inline-block;width: calc(50% - 21px)" v-for="(upbad, index) in upBadList" :key="index">  {{upbad.city.substring(0, 4)}} : {{upbad.value}} 分&emsp;</span>
                   </div>
                 </div>
               </div>
             </div>-->
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
import '../../../static/plugins/echarts3/js/sichuan.js'
import sichuanMap from '../../components/sichuanMap'
import scMap from '../../components/scMap'
import scoreLine from '@/components/scoreLine'
import tsOnlineRate from '@/components/tsOnlineRate'
import reachStandard from '@/components/reachStandard'
import singleChart from '../../components/singleChart'
import tabbar from '../../components/tabbar'
import api from '../../util/api'
import Watermark from '@/util/watermark'
let lineitemStyleColor = {
  // 通常情况下：
  normal: {
    // 每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
    color: function (params) {
      let index = params.value
      let val = 99
      // 判断数据是否大于1
      if (index > 50 && index >= val) {
        return '#00b050'
      } else if (index <= 50) {
        return 'red'
      } else {
        return '#ff7f50'
      }
    }
  }
}
export default {
  name: 'index',
  components: {
    scMap,
    sichuanMap,
    singleChart,
    tabbar,
    scoreLine,
    tsOnlineRate,
    reachStandard
  },
  data () {
    return {
      comSwiper: '',
      heightBox: 0,
      activeName: 'tabs1',
      // lineXData: ['阿坝', '巴中', '成都', '达州', '德阳', '甘孜', '广安', '广元', '乐山', '凉山', '泸州', '眉山', '绵阳', '南充', '内江', '攀枝花', '遂宁', '天府', '雅安', '宜宾', '资阳', '自贡'],
      lineXData: [],
      // lineYData: [ 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 98, 96, 94, 30 ]
      lineYData: [],
      cmccAvgScore: null,
      cuccAvgScore: null,
      ctccAvgScore: null,
      // 全省均值
      ProvincialMean: null,
      scoreRange: [],
      scoreBadList: [],
      upBadList: [],
      lineData: [],
      lineSeriesData: [
        {
          name: '',
          type: 'bar',
          barWidth: '40%',
          itemStyle: lineitemStyleColor,
          data: []
        }
      ],
      // mapData: [ {name: '成都', value: parseInt(Math.random() * 100) + 50},
      //   {name: '阿坝', value: parseInt(Math.random() * 100) + 10},
      //   {name: '甘孜', value: parseInt(Math.random() * 100) + 40},
      //   {name: '凉山', value: parseInt(Math.random() * 100) + 60},
      //   {name: '攀枝花', value: parseInt(Math.random() * 100) + 1},
      //   {name: '雅安', value: parseInt(Math.random() * 100) + 50},
      //   {name: '乐山', value: parseInt(Math.random() * 100) + 1},
      //   {name: '广元', value: parseInt(Math.random() * 100) + 1},
      //   {name: '巴中', value: parseInt(Math.random() * 100) + 50},
      //   {name: '达州', value: parseInt(Math.random() * 100) + 1},
      //   {name: '绵阳', value: parseInt(Math.random() * 100) + 40},
      //   {name: '南充', value: parseInt(Math.random() * 100) + 40},
      //   {name: '德阳', value: parseInt(Math.random() * 100) + 1},
      //   {name: '广安', value: parseInt(Math.random() * 100) + 20},
      //   {name: '遂宁', value: parseInt(Math.random() * 100) + 50},
      //   {name: '滋养', value: parseInt(Math.random() * 100) + 50},
      //   {name: '自贡', value: parseInt(Math.random() * 100) + 1},
      //   {name: '宜宾', value: parseInt(Math.random() * 100) + 60},
      //   {name: '泸州', value: parseInt(Math.random() * 100) + 50},
      //   {name: '内江', value: parseInt(Math.random() * 100) + 1},
      //   {name: '眉山', value: parseInt(Math.random() * 100) + 40},
      //   {name: '资阳', value: parseInt(Math.random() * 100) + 1}]
      mapData: [],
      linaDataArr: [],
      page5IndexArr: [
        { name: '宽带拨号成功率', rate1: '10%', state1: 0, rate2: '5%', state2: 1, num1: 99.5, num2: 99.5, num3: 50 }
      ],
      trendAnalysisTable: [
        // {
        //   matchIndex: '0',
        //   normId: '0',
        //   normMax: '100',
        //   normMin: '20',
        //   normName: '宽带拨号成功率',
        //   normUnit: '%',
        //   normValue: '50',
        //   normValue_lastMonth: '40',
        //   normValue_lastWeek: '20',
        //   serviceType: '41100428',
        //   type: '网络质量'
        // },
        // {
        //   matchIndex: '1',
        //   normId: '6',
        //   normMax: '6',
        //   normMin: '1',
        //   normName: '接入网Ping时延',
        //   normUnit: 'MS',
        //   normValue: '3',
        //   normValue_lastMonth: '2',
        //   normValue_lastWeek: '2',
        //   serviceType: '40100000',
        //   type: '网络质量'
        // },
        // {
        //   matchIndex: '1',
        //   normId: '32',
        //   normMax: '100',
        //   normMin: '20',
        //   normName: '接入网Ping丢包率',
        //   normUnit: '%',
        //   normValue: '40',
        //   normValue_lastMonth: '50',
        //   normValue_lastWeek: '50',
        //   serviceType: '40100000',
        //   type: '网络质量'
        // },
        // {
        //   matchIndex: '1',
        //   normId: '83',
        //   normMax: '6',
        //   normMin: '1',
        //   normName: '网页首屏时延',
        //   normUnit: 'S',
        //   normValue: '3',
        //   normValue_lastMonth: '2',
        //   normValue_lastWeek: '2',
        //   serviceType: '40000000',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '1',
        //   normId: '6',
        //   normMax: '6',
        //   normMin: '1',
        //   normName: '游戏Ping时延',
        //   normUnit: 'MS',
        //   normValue: '3',
        //   normValue_lastMonth: '2',
        //   normValue_lastWeek: '2',
        //   serviceType: '40100794',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '1',
        //   normId: '32',
        //   normMax: '100',
        //   normMin: '20',
        //   normName: '游戏Ping丢包率',
        //   normUnit: '%',
        //   normValue: '40',
        //   normValue_lastMonth: '50',
        //   normValue_lastWeek: '50',
        //   serviceType: '40100794',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '1',
        //   normId: '85',
        //   normMax: '6',
        //   normMin: '1',
        //   normName: '视频播放卡顿次数',
        //   normUnit: '次',
        //   normValue: '3',
        //   normValue_lastMonth: '2',
        //   normValue_lastWeek: '2',
        //   serviceType: '41300000',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '1',
        //   normId: '214',
        //   normMax: '100',
        //   normMin: '20',
        //   normName: '视频播放缓冲占比',
        //   normUnit: '%',
        //   normValue: '40',
        //   normValue_lastMonth: '50',
        //   normValue_lastWeek: '50',
        //   serviceType: '41300000',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '0',
        //   normId: '0',
        //   normMax: '100',
        //   normMin: '20',
        //   normName: '文件下载成功率',
        //   normUnit: '%',
        //   normValue: '40',
        //   normValue_lastMonth: '50',
        //   normValue_lastWeek: '50',
        //   serviceType: '40002000',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '0',
        //   normId: '28',
        //   normMax: '6',
        //   normMin: '1',
        //   normName: '文件下载速率',
        //   normUnit: 'KBPS',
        //   normValue: '3',
        //   normValue_lastMonth: '2',
        //   normValue_lastWeek: '2',
        //   serviceType: '40002000',
        //   type: '业务质量'
        // }
      ],
      busyAnalysisTable: [
        // {
        //   matchIndex: '0',
        //   normField: 'norm_428_sucrate',
        //   normId: '0',
        //   normName: '宽带拨号成功率',
        //   normUnit: '%',
        //   normValue_busy: '1',
        //   normValue_free: '2',
        //   serviceType: '41100428',
        //   type: '网络质量'
        // },
        // {
        //   matchIndex: '1',
        //   normField: 'norm_40100_6',
        //   normId: '6',
        //   normName: '接入网Ping时延',
        //   normUnit: 'MS',
        //   normValue_busy: '3',
        //   normValue_free: '4',
        //   serviceType: '40100000',
        //   type: '网络质量'
        // },
        // {
        //   matchIndex: '1',
        //   normField: 'norm_40100_32',
        //   normId: '32',
        //   normName: '接入网Ping丢包率',
        //   normUnit: '%',
        //   normValue_busy: '5',
        //   normValue_free: '6',
        //   serviceType: '40100000',
        //   type: '网络质量'
        // },
        // {
        //   matchIndex: '1',
        //   normField: 'norm_4000_83',
        //   normId: '83',
        //   normName: '网页首屏时延',
        //   normUnit: 'S',
        //   normValue_busy: '7',
        //   normValue_free: '8',
        //   serviceType: '40000000',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '1',
        //   normField: 'norm_794_6',
        //   normId: '6',
        //   normName: '游戏Ping时延',
        //   normUnit: 'MS',
        //   normValue_busy: '9',
        //   normValue_free: '10',
        //   serviceType: '40100794',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '1',
        //   normField: 'norm_794_32',
        //   normId: '32',
        //   normName: '游戏Ping丢包率',
        //   normUnit: '%',
        //   normValue_busy: '11',
        //   normValue_free: '12',
        //   serviceType: '40100794',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '1',
        //   normField: 'norm_41300_85',
        //   normId: '85',
        //   normName: '视频播放卡顿次数',
        //   normUnit: '次',
        //   normValue_busy: '13',
        //   normValue_free: '14',
        //   serviceType: '41300000',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '1',
        //   normField: 'norm_41300_214',
        //   normId: '214',
        //   normName: '视频播放缓冲占比',
        //   normUnit: '%',
        //   normValue_busy: '15',
        //   normValue_free: '16',
        //   serviceType: '41300000',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '0',
        //   normField: 'norm_40002_sucrate',
        //   normId: '0',
        //   normName: '文件下载成功率',
        //   normUnit: '%',
        //   normValue_busy: '17',
        //   normValue_free: '18',
        //   serviceType: '40002000',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '0',
        //   normField: 'norm_40002_28',
        //   normId: '28',
        //   normName: '文件下载速率',
        //   normUnit: 'KBPS',
        //   normValue_busy: '18',
        //   normValue_free: '19',
        //   serviceType: '40002000',
        //   type: '业务质量'
        // }
      ],
      //
      contrastAnalysisTable: [
        // {
        //   matchIndex: '1',
        //   normField: 'norm_40100_6',
        //   normId: '6',
        //   normName: '接入网Ping时延',
        //   normUnit: 'MS',
        //   normValue_46000: '1',
        //   normValue_46001: '2',
        //   normValue_46003: '3',
        //   rank: '1',
        //   serviceType: '40100000',
        //   type: '网络质量'
        // },
        // {
        //   matchIndex: '1',
        //   normField: 'norm_40100_32',
        //   normId: '32',
        //   normName: '接入网Ping丢包率',
        //   normUnit: '%',
        //   normValue_46000: '4',
        //   normValue_46001: '5',
        //   normValue_46003: '6',
        //   rank: '1',
        //   serviceType: '40100000',
        //   type: '网络质量'
        // },
        // {
        //   matchIndex: '1',
        //   normField: 'norm_4000_83',
        //   normId: '83',
        //   normName: '网页首屏时延',
        //   normUnit: 'S',
        //   normValue_46000: '8',
        //   normValue_46001: '6',
        //   normValue_46003: '9',
        //   rank: '2',
        //   serviceType: '40000000',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '1',
        //   normField: 'norm_794_6',
        //   normId: '6',
        //   normName: '游戏Ping时延',
        //   normUnit: 'MS',
        //   normValue_46000: '8',
        //   normValue_46001: '5',
        //   normValue_46003: '3',
        //   rank: '3',
        //   serviceType: '40100794',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '1',
        //   normField: 'norm_794_32',
        //   normId: '32',
        //   normName: '游戏Ping丢包率',
        //   normUnit: '%',
        //   normValue_46000: '3',
        //   normValue_46001: '5',
        //   normValue_46003: '8',
        //   rank: '1',
        //   serviceType: '40100794',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '1',
        //   normField: 'norm_41300_85',
        //   normId: '85',
        //   normName: '视频播放卡顿次数',
        //   normUnit: '次',
        //   normValue_46000: '8',
        //   normValue_46001: '6',
        //   normValue_46003: '7',
        //   rank: '1',
        //   serviceType: '41300000',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '1',
        //   normField: 'norm_41300_214',
        //   normId: '214',
        //   normName: '视频播放缓冲占比',
        //   normUnit: '%',
        //   normValue_46000: '8',
        //   normValue_46001: '9',
        //   normValue_46003: '3',
        //   rank: '2',
        //   serviceType: '41300000',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '0',
        //   normField: 'norm_40002_sucrate',
        //   normId: '0',
        //   normName: '文件下载成功率',
        //   normUnit: '%',
        //   normValue_46000: '7',
        //   normValue_46001: '8',
        //   normValue_46003: '9',
        //   rank: '3',
        //   serviceType: '40002000',
        //   type: '业务质量'
        // },
        // {
        //   matchIndex: '0',
        //   normField: 'norm_40002_28',
        //   normId: '28',
        //   normName: '文件下载速率',
        //   normUnit: 'KBPS',
        //   normValue_46000: '1',
        //   normValue_46001: '2',
        //   normValue_46003: '3',
        //   rank: '3',
        //   serviceType: '40002000',
        //   type: '业务质量'
        // }
      ],
      zhiCha_40000000: [
        // {
        //   urlName: '新浪网',
        //   normValue_46000: '20',
        //   normValue_46001: '',
        //   normValue_46003: '40'
        // },
        // {
        //   urlName: '新浪网',
        //   normValue_46000: '10',
        //   normValue_46001: '40',
        //   normValue_46003: '50'
        // },
        // {
        //   urlName: '新浪网',
        //   normValue_46000: '40',
        //   normValue_46001: '40',
        //   normValue_46003: '10'
        // },
        // {
        //   urlName: '新浪网',
        //   normValue_46000: '20',
        //   normValue_46001: '20',
        //   normValue_46003: '60'
        // }
      ],
      zhiCha_41300000: [
        // {
        //   urlName: '新浪网',
        //   normValue_46000: '20',
        //   normValue_46001: '',
        //   normValue_46003: '40'
        // },
        // {
        //   urlName: '新浪网',
        //   normValue_46000: '10',
        //   normValue_46001: '40',
        //   normValue_46003: '50'
        // },
        // {
        //   urlName: '新浪网',
        //   normValue_46000: '40',
        //   normValue_46001: '40',
        //   normValue_46003: '10'
        // },
        // {
        //   urlName: '新浪网',
        //   normValue_46000: '20',
        //   normValue_46001: '20',
        //   normValue_46003: '60'
        // }
      ],
      zhiCha_40100794: [
        // {
        //   urlName: '新浪网',
        //   normValue_46000: '20',
        //   normValue_46001: '',
        //   normValue_46003: '40'
        // },
        // {
        //   urlName: '新浪网',
        //   normValue_46000: '10',
        //   normValue_46001: '40',
        //   normValue_46003: '50'
        // },
        // {
        //   urlName: '新浪网',
        //   normValue_46000: '40',
        //   normValue_46001: '40',
        //   normValue_46003: '10'
        // },
        // {
        //   urlName: '新浪网',
        //   normValue_46000: '20',
        //   normValue_46001: '20',
        //   normValue_46003: '60'
        // }
      ]
    }
  },
  beforeDestroy () {
    // this.heightBox = window.innerHeight || docum/**/ent.documentElement.clientHeight || document.body.clientHeight
  },
  async mounted () {
    let account = window.sessionStorage.getItem('account')
    let mobile = window.sessionStorage.getItem('mobile')
    Watermark.set(account + '   ' + mobile)
    this.heightBox = document.documentElement.clientHeight - 100
    let self = this
    const {data: { code, data }} = await api.get(self.GLOBAL.BASE_URL + '/api/buss/kqi', {})
    if (code === 0) {
      // 评分 平均成绩
      this.cmccAvgScore = data.cmccAvgScore
      this.cuccAvgScore = data.cuccAvgScore
      this.ctccAvgScore = data.ctccAvgScore
      // 评分 质差城市
      this.scoreBadList = data.scoreBadList
      // 达标率 质差城市
      this.upBadList = data.upBadList

      // 综合评分
      let mapList = data.scoreDataList
      this.mapData = []
      // console.log(JSON.stringify(mapList))
      for (let i in mapList) {
        if (mapList[i].city === '阿坝藏族羌族自治州') {
          this.mapData.push({name: '阿坝', value: parseInt(mapList[i].value)})
        } if (mapList[i].city === '凉山彝族自治州') {
          this.mapData.push({name: '凉山', value: parseInt(mapList[i].value)})
        } if (mapList[i].city === '甘孜藏族自治州') {
          this.mapData.push({name: '甘孜', value: parseInt(mapList[i].value)})
        } else {
          this.mapData.push({name: mapList[i].city.substr(0, mapList[i].city.length - 1), value: parseInt(mapList[i].value)})
        }
      }

      // 评分 阈值
      let scoreRange = data.scoreRange
      for (let rang in scoreRange) {
        if (scoreRange[rang].split(',')[0] === '') {
          // 只有最低线
          this.scoreRange.push({end: parseInt(scoreRange[rang].split(',')[1])})
        } else if (scoreRange[rang].split(',')[1] === '') {
          // 只有最高分
          this.scoreRange.push({start: parseInt(scoreRange[rang].split(',')[0])})
        } else {
          this.scoreRange.push({start: parseInt(scoreRange[rang].split(',')[0]), end: parseInt(scoreRange[rang].split(',')[1])})
        }
      }
      // 达标率
      // 加载数据
      // 质量达标
      this.upDataList = data.upDataList
      this.lineXData = []
      this.lineYData = []
      let sum = 0
      // console.log(JSON.stringify(data.upDataList))
      // let tempCityName = []
      for (let i in data.upDataList) {
        if (data.upDataList[i].city === '阿坝藏族羌族自治州') {
          this.lineXData[i] = '阿坝'
        } else if (data.upDataList[i].city === '甘孜藏族自治州') {
          this.lineXData[i] = '甘孜'
        } else if (data.upDataList[i].city === '天府新区') {
          this.lineXData[i] = '天府'
        } else if (data.upDataList[i].city === '凉山彝族自治州') {
          this.lineXData[i] = '凉山'
        } else {
          this.lineXData.push(data.upDataList[i].city.substring(0, data.upDataList[i].city.length - 1))
        }
        // this.lineXData.push(data.upDataList[i].city)
        let number = parseInt(data.upDataList[i].value)
        this.lineSeriesData[0].data.push(number)
        sum = sum + number
      }
      // console.log(tempCityName)
      if (data.upDataList.length !== 0) {
        this.ProvincialMean = (sum / data.upDataList.length).toFixed(2) + '分'
      } else {
        this.ProvincialMean = '' + '分'
      }
      // if (self.lineSeriesData[0].data.length === 0) {
      //   self.lineXData = ['阿坝', '巴中', '成都', '达州', '德阳', '甘孜', '广安', '广元', '乐山', '凉山', '泸州', '眉山', '绵阳', '南充', '内江', '攀枝花', '遂宁', '天府', '雅安', '宜宾', '资阳', '自贡']
      //   self.lineSeriesData[0].data = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 98, 96, 94, 30]
      // }
    }
    this.comSwiper = new Swiper('.swiper-container', {
      direction: 'vertical',
      autoplay: false,
      loop: false,
      on: {
        init: function () {
          self.$refs.page1Map.initChart()
          // //Swiper初始化了
          // alert('当前的slide序号是'+this.activeIndex);
          // this.emit('transitionEnd');//在初始化时触发一次transitionEnd事件，需要先设置transitionEnd
        },
        tap: function (event) {
          console.log(event)
        },
        slideChange: function () {
          // console.log('start')
        },
        slideChangeTransitionEnd: function () {
          // console.log(this.realIndex)
          let swiperIndex = this.realIndex
          // 判断当前是哪一个页面
          self.swiperChangeFun(swiperIndex)
        }
      }
    })
    // window.addEventListener('scroll', this.scrollToTop)
    // const { data: { code, data }} = await api.get('/api/comment/get', {page: 1})
  },
  methods: {
    async tabsClickTop (tab, event) {
      let index = tab._data.index
      console.log(index)
      this.comSwiper.slideTo(index)
      if (tab.name === 'tabs8') {
        let qualityDifferenceAnalysisData = await api.get(this.GLOBAL.BASE_URL + '/api/quality/qualityDifferenceAnalysis')
        this.zhiCha_40000000 = qualityDifferenceAnalysisData.data.data.resultData_40000000
        this.zhiCha_41300000 = qualityDifferenceAnalysisData.data.data.resultData_41300000
        this.zhiCha_40100794 = qualityDifferenceAnalysisData.data.data.resultData_40100794
        console.log(qualityDifferenceAnalysisData.data.data)
      } else if (tab.name === 'tabs7') {
        let contrastAnalysisData = await api.get(this.GLOBAL.BASE_URL + '/api/quality/contrastAnalysis')
        this.contrastAnalysisTable = []
        this.contrastAnalysisTable = contrastAnalysisData.data.data
        console.log(contrastAnalysisData.data.data)
      } else if (tab.name === 'tabs6') {
        let busyAnalysisData = await api.get(this.GLOBAL.BASE_URL + '/api/quality/busyAnalysis')
        this.busyAnalysisTable = busyAnalysisData.data.data
        console.log(busyAnalysisData.data.data)
      } else if (tab.name === 'tabs5') {
        let trendAnalysisData = await api.get(this.GLOBAL.BASE_URL + '/api/quality/trendAnalysis')
        this.trendAnalysisTable = trendAnalysisData.data.data
        console.log(trendAnalysisData.data.data)
      }
      // document.getElementById('jumpPage' + index).scrollIntoView(true)
    },
    getHeight: function (type) {
      if (type === 'map') {
        return window.innerHeight - 300 || document.documentElement.clientHeight - 300 || document.body.clientHeight - 300
      } else if (type === 'line') {
        // 230 = padding-top: 50 +  title = 30 +  达标城市 80 +  其他
        return window.innerHeight - 260 || document.documentElement.clientHeight - 260 || document.body.clientHeight - 260
      }
    },
    // 2 、综合评分
    swiper2Rate: function () {
      this.$refs.scoreLine.resize()
    },
    // 3、达标率
    swiper3score () {
      this.$refs.reachStandard.resize()
    },
    // 4、在线率
    swiper4online () {
      this.$refs.tsOnlineRate.resize()
    },
    // 5、关键指标趋势分析
    swiper5Index () {
      let _this = this
    },
    swiperChangeFun (index) {
      var self = this
      if (index === 0) {
        self.activeName = 'tabs1'
        this.$refs.page1Map.initChart()
      } else if (index === 1) {
        self.activeName = 'tabs2'
        this.swiper2Rate()
      } else if (index === 2) {
        self.activeName = 'tabs3'
        this.swiper3score()
      } else if (index === 3) {
        self.activeName = 'tabs4'
        this.swiper4online()
      } else if (index === 4) {
        self.activeName = 'tabs5'
        this.swiper5Index()
      } else if (index === 5) {
        self.activeName = 'tabs6'
      } else if (index === 6) {
        self.activeName = 'tabs7'
      } else if (index === 7) {
        self.activeName = 'tabs8'
      }
    },
    scrollToTop () {
      // let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // if (scrollTop < 50) {
      //   this.activeName = 'tabs0'
      // } else if (scrollTop >= 50) {
      //   this.activeName = 'tabs1'
      // }
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // console.log(rowIndex, columnIndex)
        // if () {}
        // return {
        //   rowspan: 0,
        //   colspan: 2
        // }
      } else {
        return {
          rowspan: 1,
          colspan: 1
        }
      }
    },
    // 质差合并列
    zcSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        const _row = this.zhiCha_40000000[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    trendTip (row) {
      let normValue = row.normValue
      let normMax = row.normMax
      let normMin = row.normMin
      let normUnit = row.normUnit
      let matchIndex = row.matchIndex
      if (matchIndex=='0') {
        return '均值:' + normValue + normUnit + ' 最优:' + normMax + normUnit + ' 最差:' + normMin + normUnit
      } else {
        return '均值:' + normValue + normUnit + ' 最优:' + normMin + normUnit + ' 最差:' + normMax + normUnit
      }
    },
    trendRatio (row, flag) {
      let arr = []
      arr.push(Number(row.normValue))
      arr.push(Number(row.normMax))
      arr.push(Number(row.normMin))
      arr.sort(function (a, b) {
        return a - b
      })
      let ratio = 0
      if (flag === 'min') {
        ratio = arr[0] * 100 / (arr[2])
      } else if (flag === 'avg') {
        ratio = (arr[1] - arr[0]) * 100 / (arr[2])
      } else if (flag === 'max') {
        ratio = (arr[2] - arr[1]) * 100 / (arr[2])
      }
      return ratio.toFixed(2)
    },
    contrastRatio (normValue, contrastValue, matchIndex) {
      let contrastFlag = ''
      let contrastRatio = ''
      if (normValue === '' || contrastValue === '') {
        contrastFlag = 'down'
        contrastRatio = '无'
      } else {
        if (matchIndex === '1') {
          if (Number(normValue) > Number(contrastValue)) {
            contrastFlag = 'down'
            let ratio = (Number(normValue) - Number(contrastValue)) * 100 / Number(contrastValue)
            contrastRatio = ratio.toFixed(2) + '%'
          } else {
            contrastFlag = 'up'
            let ratio = (Number(contrastValue) - Number(normValue)) * 100 / Number(contrastValue)
            contrastRatio = ratio.toFixed(2) + '%'
          }
        } else {
          if (Number(normValue) > Number(contrastValue)) {
            contrastFlag = 'up'
            let ratio = (Number(normValue) - Number(contrastValue)) * 100 / Number(contrastValue)
            contrastRatio = ratio.toFixed(2) + '%'
          } else {
            contrastFlag = 'down'
            let ratio = (Number(contrastValue) - Number(normValue)) * 100 / Number(contrastValue)
            contrastRatio = ratio.toFixed(2) + '%'
          }
        }
      }
      return {contrastFlag: contrastFlag, contrastRatio: contrastRatio}
    },
    zhiChaTip (row) {
      let normValue46000 = Number(row.normValue_46000)
      let normValue46001 = Number(row.normValue_46001)
      let normValue46003 = Number(row.normValue_46003)
      let ratio46000 = Number(normValue46000) * 100 / (normValue46000 + normValue46001 + normValue46003)
      let ratio46001 = Number(normValue46001) * 100 / (normValue46000 + normValue46001 + normValue46003)
      let ratio46003 = Number(normValue46003) * 100 / (normValue46000 + normValue46001 + normValue46003)
      return '移动:' + ratio46000.toFixed(2) + '% 电信:' + ratio46003.toFixed(2) + '% 联通:' + ratio46001.toFixed(2) + '%'
    },
    zhiChaRatio (normValue, row) {
      let normValue46000 = Number(row.normValue_46000)
      let normValue46001 = Number(row.normValue_46001)
      let normValue46003 = Number(row.normValue_46003)
      let ratio = Number(normValue) * 100 / (normValue46000 + normValue46001 + normValue46003)
      return ratio.toFixed(2)
    },
    jingDuiTip (row) {
      let normValue46000 = row.normValue_46000
      let normValue46001 = row.normValue_46001
      let normValue46003 = row.normValue_46003
      let normUnit = row.normUnit
      return '移动:' + normValue46000 + normUnit + ' 电信:' + normValue46003 + normUnit + ' 联通:' + normValue46001 + normUnit
    },
    jingDuiRatio (normValue, row) {
      let normValue46000 = Number(row.normValue_46000)
      let normValue46001 = Number(row.normValue_46001)
      let normValue46003 = Number(row.normValue_46003)
      let max = (normValue46000 > normValue46001 ? normValue46000 : normValue46001) > normValue46003 ? (normValue46000 > normValue46001 ? normValue46000 : normValue46001) : normValue46003
      let ratio = Number(normValue) * 100 / (max)
      return ratio.toFixed(2)
    }
  }
}
</script>

<style>

</style>
<style>
  @import "../../../static/scss/reset.css";
  .reset-table-swiper /deep/ .el-table .cell{
    line-height: 16px;
    padding: 0px 5px;
  }
  .reset-table-swiper /deep/ .el-table--small td{
    padding: 4px 0px;
  }

  .reset-table-swiper /deep/ .el-table--small th{
    padding: 6px 0px;
  }
</style>
<style scoped lang="scss">
  @import "../../../static/scss/com.css";
  .fa-exclamation-triangle {
    color: #ca0c16;
  }
  .grade-box{
    margin: 10px 0px 0px 0px;
    /*display: flex;*/
    /*display: -webkit-flex;*/
    /*justify-content:flex-end ;*/
  }
  .grade-item{
    padding: 2px 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
    /*width: 200px;*/
    div{
      padding: 10px 0px;
    }
  }
  .list-business {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .list-label {
      display: inline-block;
      width: 120px;
    }

    .list-content {
      display: inline-block;
      width: calc(100% - 130px);
      padding-left: 10px;
      word-break: break-word;
    }
  }
  p {
    color: #000;
    padding: 4px 0px;
  }
  .swiper-slide::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  .swiper-slide::-webkit-scrollbar:vertical {
    width: 6px;
  }

  .swiper-slide::-webkit-scrollbar:horizontal {
    height: 6px;
  }

  .swiper-slide::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, .5);
    border-radius: 6px;
    border: 1px solid gray;
  }

  .swiper-slide::-webkit-scrollbar-track {
    border-radius: 6px;
    background-color: gray;
  }
  .zc-header-box >div{
    padding: 3px 0px;
  }
  .zc-header-box, .zc-body-box{
    border: 1px solid #ddd;
    margin-top: -1px;
  }
  .zc-header-box > div, .zc-body-box > div{
    border-right: 1px solid #ddd;
    text-align: center;
    line-height: 22px;

  }
  .zc-header-box > div:last-child,
  .zc-body-box > div:last-child{
    border-right: none;
  }
</style>
