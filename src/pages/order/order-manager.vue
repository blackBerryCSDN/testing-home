<template>
  <div style="height: 100%;">
    <div class="top-wrap">
      <div class="top-title">
        返修管理
      </div>
      <div class="top-tabs-box"
           style="line-height: 40px;padding-top: 3px;color: #000;font-size: 15px;padding-left: 10px;">
        返修工单管理
      </div>
    </div>
    <div class="content-wrap"
         style="position: relative;top: 54px;overflow-y: auto;height: calc(100% - 110px);max-height: calc(100% - 110px);">
      <div class="chart-wrap ">
        <div class="item-box">
          <div class="left-name">返修设备</div>
          <div class="right-val">{{ repairInfo.device }}</div>
        </div>
        <div class="item-box">
          <div class="left-name">设备序列号</div>
          <div class="right-val">{{ repairInfo.number }}</div>
        </div>
        <div class="item-box">
          <div class="left-name">返修清单</div>
          <div class="right-val">{{ listFun(repairInfo.list) }}</div>
        </div>
        <div class="item-box">
          <div class="left-name">物流单号</div>
          <div class="right-val">{{ repairInfo.logNumber }}</div>
        </div>
        <div class="item-box">
          <div class="left-name">寄件人信息</div>
          <div class="right-val">
            <div>姓名：{{ repairInfo.opeator.name }}</div>
            <div>电话：{{ repairInfo.opeator.number }}</div>
          </div>
        </div>
        <div class="item-box">
          <div class="left-name">返修状态</div>
          <div class="right-val">
            <span style="color: red;font-weight: bold;">{{ repairInfo.state.desc }}</span>
          </div>
        </div>
        <!--
          1、地市返修中
        -->
        <div v-if="accountType === 1">
          <!-- 点击地市返修中 --- 地市账号-->
          <div class="item-box">
            <div class="left-name">物流信息</div>
            <div class="right-val">
              <div>类型： {{ repairInfo.logInfo.type }}</div>
              <div>单号： {{ repairInfo.logInfo.number }}</div>
              <div style="margin-bottom: 6px" :key="index" v-for="(item, index) in repairInfo.logInfo.data">
                <div>{{ item.date }} &nbsp; ({{ item.city }})</div>
                <div>{{ item.operator }} &nbsp; ({{ item.tel }})</div>
                <div></div>
              </div>
            </div>
          </div>
          <!-- 点击地市返修中 ---  管理员账号-->
          <div class="item-box city-fix-admin">
            <div class="cadmin-left" style="border-right: 1px solid #ddd;text-align: center;">
              <el-upload
                style="border: 1px solid #ddd;text-align: center;"
                class="avatar-uploader avatar"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="cityAminImageUrl" :src="cityAminImageUrl" class="avatar">
                <span  style="color: #999;" v-else><i class="el-icon-plus avatar-uploader-icon"></i>上传签收照片</span>
              </el-upload>
            </div>
            <div class="cadmin-right" style="text-align: center;">
              <el-button type="primary" size="mini">厂家确认签收</el-button>
            </div>
          </div>
        </div>

        <!--
        2、厂家检修中
        -->
        <div v-if="accountType === 2">
          <!--厂家检修中 -- 地市账号-->
          <div>
            <div class="item-box">
              <div class="left-name">维修人员</div>
              <div class="right-val">王卫</div>
            </div>
            <div class="item-box">
              <div class="left-name">寄件地址</div>
              <div class="right-val">四川省成都市天府新区</div>
            </div>
            <div class="item-box">
              <div class="left-name">检修结果</div>
              <div class="right-val">
                <div v-for="(item, index) in repairInfo.result.desc">{{index+1}} 、 {{item}}</div>
              </div>
            </div>
            <div class="item-box">
              <div class="left-name">检修照片</div>
              <div class="right-val">
                <img
                  style="width: 40px;height: 40px;margin-right: 5px;margin-bottom: 0px;"
                  @click="showScaleImg(item)"
                  :src="item"
                  :key="index"
                  v-for="(item, index) in repairInfo.result.img" />
              </div>
            </div>
          </div>
          <!--厂家检修中 -- 管理账号账号-->
          <div class="item-box" style="display: flex;">
            <div style="width: 50%;padding: 20px;text-align: center;border-right: 1px solid #ddd;">
              <el-upload
                style="border: 1px solid #ddd;text-align: center;"
                class="avatar-uploader avatar"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="fixAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="fixImageUrl" :src="fixImageUrl" class="avatar">
                <span v-else style="color: #999;"><i class="el-icon-plus avatar-uploader-icon"></i>返修设备照片 <br>【必选】</span>
              </el-upload>
            </div>
            <div style="width: 50%;padding: 20px;text-align: center;">
              <el-upload
                style="border: 1px solid #ddd;text-align: center;"
                class="avatar-uploader avatar"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="fixAdminAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="fixAminImageUrl" :src="fixAminImageUrl" class="avatar">
                <span v-else style="color: #999;"><i class="el-icon-plus avatar-uploader-icon"></i>物流信息照片 <br> 【必选】</span>
              </el-upload>
            </div>
          </div>
          <div align="center" style="padding: 10px 0px">
            <el-button size="mini" type="primary">送检合格</el-button>
            <el-button size="mini" type="warning">送检不合格</el-button>
            <el-button size="mini" type="success">维修完成</el-button>
          </div>
        </div>

        <!--
         3、已维修，返回中
         -->
        <div v-if="accountType === 3">
          <!--地市账号-->
          <div class="item-box">
            <div class="left-name">物流信息</div>
            <div class="right-val">
              <div>类型： {{ repairInfo.logInfo.type }}</div>
              <div>单号： {{ repairInfo.logInfo.number }}</div>
              <div style="margin-bottom: 6px" :key="index" v-for="(item, index) in repairInfo.logInfo.data">
                <div>{{ item.date }} &nbsp; ({{ item.city }})</div>
                <div>{{ item.operator }} &nbsp; ({{ item.tel }})</div>
                <div></div>
              </div>
            </div>
          </div>
          <!--地市账号-->
          <div class="item-box" style="display: flex;align-items: center;">
            <div style="padding: 10px;width: 50%;border-right: 1px solid #ddd;">
              <el-upload
                style="border: 1px solid #ddd;text-align: center;"
                class="avatar-uploader avatar"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="backAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="fixOkImageUrl" :src="fixOkImageUrl" class="avatar">
                <span  style="color: #999;" v-else><i class="el-icon-plus avatar-uploader-icon"></i>上传照片</span>
              </el-upload>
            </div>
            <div style="padding: 10px;width: 50%;text-align: center;">
              <el-button type="primary" size="mini">确认签收</el-button>
            </div>
          </div>

          <div style="padding: 20px;text-align: center">
            <el-button type="primary" size="mini">提醒地市签收</el-button>
          </div>
          <!--管理账号-->
          <div>

          </div>

        </div>

      </div>
    </div>
    <tabbar></tabbar>
    <div
      style="position: fixed;top: 0px;text-align: center;background: rgba(0,0,0,.5);height: 100vh;z-index: 9999;"
      v-if="scaleImgInfo.show"
      @click="scaleImgInfo.show = false">
      <img :src="scaleImgInfo.src" alt="" width="80%" style="margin-top: 100px;border-radius: 10px;">
    </div>
  </div>
</template>

<script>
/* eslint-disable no-trailing-spaces */

import tabbar from '../../components/tabbar'
import $ from 'jquery'

export default {
  name: 'order-manager',
  components: {
    tabbar
  },
  data () {
    return {
      accountType: 2, // 1 地市返修; 2 厂家检修； 3 返修返回
      repairInfo: {
        device: '成都市天府区00210',
        number: '200908120910',
        list: ['主机', '适配器'],
        logNumber: 'SF2020090912023',
        opeator: {
          name: '王卫',
          number: '18888886666',
        },
        state: {
          type: 'city',
          desc: '地市返修中'
        },
        logInfo: {
          type: '顺丰',
          number: 'SF2020090912023',
          data: [
            {
              date: '09-90 12:12',
              city: '浙江省宁波市海曙区',
              operator: '王卫',
              tel: '18833388833'
            },
            {
              date: '09-90 12:12',
              city: '浙江省宁波市海曙区',
              operator: '王卫',
              tel: '18833388833'
            }
          ]
        },
        result: {
          desc: ['厂家未点击检测结果，显示厂家正在维修', '送检不合格'],
          img: ['https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100']
        }
      },
      // 地市图片
      cityAminImageUrl: '',
      // 厂家检修图片
      fixImageUrl: '',
      fixAminImageUrl: '',
      // 返修完成照片
      fixOkImageUrl: '',
      // 图片放大展示
      scaleImgInfo: {
        show: false,
        src: ''
      }
    }
  },
  updated: function () {

  },
  created () {

  },
  mounted: function () {

  },
  methods: {
    listFun (arr) {
      return arr.join(' + ')
    },
    handleAvatarSuccess (res, file) {
      this.cityAminImageUrl = URL.createObjectURL(file.raw)
    },
    backAvatarSuccess (res, file) {
      this.fixOkImageUrl = URL.createObjectURL(file.raw)
    },
    fixAvatarSuccess(res, file) {
      this.fixImageUrl = URL.createObjectURL(file.raw)
    },
    fixAdminAvatarSuccess(res, file) {
      this.fixAminImageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
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
    // 放大图片
    showScaleImg(src) {
      this.scaleImgInfo.show = true
      this.scaleImgInfo.src = src
    },
  }
}
</script>

<style>
@import "../../../static/scss/reset.css";

.fa-box .fa {
  font-size: 11px;
  /*color: #eaf7f8;*/
}

</style>
<style scoped lang="scss">
@import "../../../static/scss/com.css";

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
  height: 50px;
  line-height: 70px;
  text-align: center;
  //border: 1px border #d9d9d9;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  margin: 0px auto;
}

.item-box {
  border: 1px solid #ddd;
  /*border*/
  display: flex;
  align-items: center;
  margin-top: -1px;
  font-size: 12px;
}

.item-box > div {
  padding: 4px 4px;
}

.left-name {
  width: 80px;
  font-weight: bold;
  //text-align: center;
}

.right-val {
  border-left: 1px solid #ddd;
  min-height: 16px;
}

// 厂家地市管理员
.city-fix-admin {
  > div {
    width: 50%;
  }
}

.cadmin-left {

}
</style>
