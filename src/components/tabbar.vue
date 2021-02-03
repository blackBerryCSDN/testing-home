<template>
    <div class="tabbar-box">
      <div class="item-tabbar" :key="index" v-for="(item, index) in tabbarArr">
        <el-dropdown trigger="click" placement="bottom" @command="toRouter">
          <span class="el-dropdown-link" @click="toChangeROuter(index)">
            {{item.name}} <i v-if="item.list.length != 0" class="el-icon-arrow-up el-icon&#45;&#45;right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :key="indexs"
              v-show="index === 2 && indexs ===0 && roleNum === '8' || index === 2 && indexs ===0 && roleNum === '9' ? 0 : 1" :command="list.router"
              v-for="(list, indexs) in item.list">
              {{list.name}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!--<div id="tabbar" class="item-tabbar">
        <el-dropdown trigger="click" placement="bottom">
          <span class="el-dropdown-link">
            探针概况<i class="el-icon-arrow-up el-icon&#45;&#45;right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>全网概况</el-dropdown-item>
            <el-dropdown-item>在网查询</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div  class="item-tabbar">
        <el-dropdown trigger="click" placement="bottom">
          <span class="el-dropdown-link">
            拨测质量<i class="el-icon-arrow-up el-icon&#45;&#45;right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>拨测质量评估</el-dropdown-item>
            <el-dropdown-item>业务体验</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div  class="item-tabbar">
        <el-dropdown trigger="click" placement="bottom">
          <span class="el-dropdown-link">
            返修管理<i class="el-icon-arrow-up el-icon&#45;&#45;right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" >
            <el-dropdown-item>新建返修工单</el-dropdown-item>
            <el-dropdown-item>返修状态查询</el-dropdown-item>
            <el-dropdown-item>返修代办工单</el-dropdown-item>
            <el-dropdown-item>返修统计</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>-->
    </div>
</template>

<script>
export default {
  name: 'tabbar',
  data () {
    return {
      roleNum: '',
      tabbarArr: [
        {
          name: '拨测质量',
          sign: 1,
          router: '/comprehensive',
          list: [
            {name: '综合质量', router: '/comprehensive'},
            {name: '业务体验', router: '/business'},
            {name: '故障分析', router: '/fault'}
          ]
        },
        {
          name: '探针概况',
          sign: 2,
          router: '/probe',
          list: [
            {name: '全网概况', router: '/probe'},
            {name: '探针在线情况', router: '/online'}
          ]
        },
        {
          name: '返修管理',
          sign: 2,
          router: '/add',
          list: [
          ]
        },
        // 由大面积离线告警消息推送、业务质量异常提醒推送、管理端内容推送及交互查询
        // {
        //   name: '内容显示',
        //   sign: 2,
        //   router: '/content',
        //   list: [
        //     {name: '大面积离线告警', router: '/'},
        //     {name: '业务质量异常提醒', router: '/'},
        //     {name: '交互查询', router: '/'},
        //     {name: '管理端内容', router: '/'}
        //   ]
        // }
      ]
    }
  },
  created () {
    let _this = this
    // 8厂家  9省  10 地市
    let role = window.sessionStorage.getItem('role')
    // console.log(role)
    _this.roleNum = role
    if (role === 9) {
      // _this.tabbarArr[2].list.push({name: '返修状态查询', router: '/query'})
      _this.tabbarArr[2].list.push({name: '返修工单统计', router: '/statistics'})
      _this.tabbarArr[2].list.push({name: '返修工单管理', router: '/repair-manage'})
      _this.tabbarArr[2].list.push({name: '关于', router: '/order-about'})
    }
    // _this.tabbarArr[2].list.push({name: '返修状态查询', router: '/query'})
    _this.tabbarArr[2].list.push({name: '新建返修工单', router: '/add'})
    _this.tabbarArr[2].list.push({name: '返修工单管理', router: '/repair-manage'})
    _this.tabbarArr[2].list.push({name: '返修工单统计', router: '/statistics'})
    _this.tabbarArr[2].list.push({name: '关于', router: '/order-about'})
    // _this.tabbarArr[2].list.push({name: '返修待办工单', router: '/transact'})
    // _this.tabbarArr[2].list.push({name: '返修统计', router: '/statistics'})
    // _this.tabbarArr[2].list.push({name: '返修工单管理', router: '/order-manager'})
  },
  methods: {
    toRouter: function (router) {
      this.$router.push({ path: router })
    },
    toChangeROuter: function (router, index) {
      // console.log(index)
      if (index === 1) {
        this.$router.push({ path: router })
      }
    }
  }
}
</script>
<style >
  .el-dropdown-menu--small .el-dropdown-menu__item {
     padding: 5px 10px;
    min-width: 70px;
    border-bottom: 1px solid #ccc;
  }
  .el-popper[x-placement^=top] .popper__arrow{
    background: transparent;
    border-top-color: transparent;
  }
  .el-dropdown-menu{
    margin-top: -10px;
    border-radius: 0px;
  }
  .el-popper[x-placement^=top] .popper__arrow::after{
    background: transparent;
    border-top-color: transparent;
  }
  .el-dropdown-menu--small{
    padding: 0px;
  }
   .el-dropdown-menu__item:last-child{
    border-bottom: none;
  }
</style>

<style lang="scss" scoped>
  .tabbar-box{
    /*display: flex;*/
    /*display: -webkit-flex;*/
    /*justify-content:space-around;*/
    position: fixed;
    bottom: 0px;
    background: #fff;
    height: 50px;
    width: 100%;
    border-top: 1px solid #999;
    z-index: 999;
    display: flex;
    align-items: center;
    .item-tabbar{
      display: inline-block;
      width: 33.333%;
      margin: 10px 0px;
      /*height: 30px;*/
      line-height: 30px;
      text-align: center;
      border-right: 1px solid #999;
      .el-dropdown-link{
        color: #999;
      }
    }
    .item-tabbar:last-child{
      border-right: none
    }
  }
</style>
