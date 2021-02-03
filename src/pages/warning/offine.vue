<template>
  <div class="offline-warning">
    <div class="warning">
      <div class="warning-title">
        <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
        {{cityName}} 大面积离线告警
      </div>
      <div class="warning-content">
        <ul v-for="(item, index) in warningArr" :key="index">
          <li class="offline-title">
            {{item.title}}
          </li>
          <li class="flex-wrap">
            <div>探针名称</div>
            <div>{{item.name}}</div>
          </li>
          <li class="flex-wrap">
            <div>告警级别</div>
            <div> [ {{ item.rank }} ]</div>
          </li>
          <li class="flex-wrap">
            <div>离线时间</div>
            <div>{{item.time}}</div>
          </li>
          <li class="flex-wrap">
            <div>告警描述</div>
            <div>{{item.desc}}</div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import api from '../../util/api'
import {getHttpParams} from '../../util/util'
export default {
  name: 'offline',
  data () {
    return {
      cityName: '',
      warningArr: [
      ]
    }
  },
  mounted () {
    this.showAlarm()
  },
  methods: {
    showAlarm: async function () {
      var id = getHttpParams('id')
      console.log(id)
      var inTime = getHttpParams('inTime')
      console.log(inTime)
      var self = this
      let res = await api.get(this.GLOBAL.BASE_URL + '/api/show/showAlarm', {id: id, inTime: inTime})
      if (res.data.code === 0) {
        console.log(res.data.data)
        var alarmLevel
        if (res.data.data.alarmLevel === 1) {
          alarmLevel = '一般告警'
        }
        if (res.data.data.alarmLevel === 2) {
          alarmLevel = '次要告警'
        }
        if (res.data.data.alarmLevel === 3) {
          alarmLevel = '重要告警'
        }
        if (res.data.data.alarmLevel === 4) {
          alarmLevel = '严重告警'
        }
        self.warningArr = []
        self.warningArr.push({
          title: res.data.data.alarmTypeName,
          name: res.data.data.tsName,
          rank: alarmLevel,
          time: this.renderTime(res.data.data.inTime),
          desc: res.data.data.alarmNote
        })
        self.cityName = res.data.data.cityName
      }
    },
    renderTime: function (date) {
      var date1 = new Date(date).toJSON()
      return new Date(+new Date(date1) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    }
  }
}
</script>
<style>
  @import "../../../static/scss/reset.css";
</style>
<style scoped lang="scss">
  @import "../../../static/scss/com.css";
  .offline-warning{
    .warning-title{
      font-size: 16px;
      font-weight: bold;
      padding: 15px 10px  15px 10px;
      background: rgba(0,0,0,0.5);
      i{
        color: #e0fa02;
      }
    }
    .warning-content{
      padding: 10px;
      ul{
        background: rgba(0,0,0,0.3);
        margin: 0px 0px 10px 0px;
        padding: 10px;
        li{
          list-style: none;
        }
        .offline-title{
          font-size: 15px;
        }
        .flex-wrap{
          display: flex;
          display: -webkit-flex;
          /*justify-content:space-around;*/
          /*text-align: left;*/
          align-items: center;
          border-bottom: 1px solid gray;
          padding: 5px;
          margin-bottom: 5px;
          div:first-child{
            display: inline-block;
            min-width: 80px;
          }
        }
      }
    }
  }
</style>
