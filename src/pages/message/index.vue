<template>
  <div class="offline-warning">
    <div class="warning">
      <div class="warning-title">
         通知消息
      </div>
      <div class="warning-content">
          <ul>
            <li>
              <div class="item-title">标题：</div>
              <div class="item-content">{{ info.title}}</div>
            </li>
            <li>
              <div class="item-title">内容：</div>
              <div class="item-content">{{ info.content}}</div>
            </li>
            <li>
              <div class="item-title">发布时间：</div>
              <div class="item-content">{{ info.pubDate}}</div>
            </li>
            <li>
              <div class="item-title">发布人：</div>
              <div class="item-content">{{ info.punUserName}}</div>
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
  name: 'index',
  data () {
    return {
      cityName: '',
      info: {
        title: '我是标题',
        content: '标题内容',
        pubDate: '发布时间',
        punUserName: '发布人'
      }
    }
  },
  mounted () {
    this.showMessage()
  },
  methods: {
    showMessage: async function () {
      var id = getHttpParams('id')
      var self = this
      let res = await api.get(this.GLOBAL.BASE_URL + '/api/show/showMessage', {id: id})
      if (res.data.code === 0) {
        self.info = []
        self.info.push({
          title: res.data.data.title,
          content: res.data.data.Content,
          pubDate: res.data.data.PubDate,
          punUserName: res.data.data.PubUserName
        })
      }
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
        /*color: #e0fa02;*/
      }
    }
    .warning-content{
      padding: 10px;
      ul{
        background: rgba(0,0,0,0.3);
        padding: 0px ;
        margin: 0px;
        li{
          display: flex;
          display: -webkit-flex;
          justify-content:space-around;
          align-items: center;
          margin-bottom: 2px;
          list-style: none;
          border-bottom: 1px solid gray;
          .item-title{
            font-size: 14px;
            padding: 5px;
            width: 80px;
          }
          .item-content{
            width: calc(100% - 80px);
            font-size: 14px;
            padding:0px 5px 5px 5px;
            color: #eee;
          }
        }
      }
    }
  }
</style>
