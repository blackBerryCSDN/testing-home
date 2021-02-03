<template>
    <div class="bg-wrap">
      <div style="position: absolute;top: 150px;width: 60%;padding: 0px 20%;">
        <div style="padding-bottom: 50px;text-align: center;">
          <h1>四川拨测之家</h1>
        </div>
        <el-form :model="loginForm" status-icon :rules="rules2" ref="loginForm" label-width="100px" class="set-item-content">
          <!--<div class="el-item-input" prop="username">-->
            <!--<i class="fa fa-key fa-fw"></i>-->
            <!--<input type="text" v-model="loginForm.username" placeholder="">-->
          <!--</div>-->
          <el-form-item label="" prop="username">
            <el-input  size="medium" prefix-icon="fa fa-user-o" placeholder="请输入账号"  v-model="loginForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="" prop="pass">
            <el-input  size="medium"  prefix-icon="fa fa-key fa-fw" placeholder="请输入密码" type="password" v-model="loginForm.pass"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitForm('loginForm')" style="width: 100%;margin-top: 15px;padding: 12px 15px;font-size: 14px;" type="primary" round>登 录</el-button>
            <!--<el-button type="primary" @click="submitForm('loginForm')">提交</el-button>-->
            <!--<el-button @click="resetForm('loginForm')">重置</el-button>-->
          </el-form-item>
        </el-form>
      </div>
      <div style="position:absolute;bottom: 4%;padding: 0px 20%;text-align: center;color: #999;">
        个人账号只能自用，不可外传，若需申请账号请与各地市管理员联系。
      </div>
    </div>
</template>

<script>
import {getCookie, setCookie} from '../../util/util'

export default {
  name: 'login',
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } if (value.length < 3) {
        callback(new Error('密码不能少于3位'))
      } else {
        if (this.loginForm.checkPass !== '') {
          this.$refs.loginForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('账号不能为空'))
      } else {
        if (this.loginForm.checkPass !== '') {
          this.$refs.loginForm.validateField('checkPass')
        }
        callback()
      }
    }
    return {
      loginForm: {
        pass: '',
        username: ''
      },
      rules2: {
        username: [
          { validator: validateName, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {

  },
  methods: {
    submitForm (formName) {
      var self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            account: this.loginForm.username,
            pwd: this.loginForm.pass,
            wcsId: window.sessionStorage.getItem('wcsId')
          }
          this.$axios({
            url: this.GLOBAL.BASE_URL + '/api/user/login',
            method: 'post',
            data: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function (res) {
            console.log('res', JSON.stringify(res))
            if (res.data.code === 0) {
              // 设置token到cookie,跳转到相应页面
              setCookie('loginToken', res.data.data.loginToken)
              console.log(res.data.data.role);
              window.sessionStorage.setItem('wcsId', res.data.data.wcsId)
              window.sessionStorage.setItem('role', res.data.data.role)
              if (getCookie('toUrl') === '/' || getCookie('toUrl') === null || getCookie('toUrl') === '/login') {
                self.$router.push({ path: '/comprehensive' })
              } else {
                self.$router.push({ path: getCookie('toUrl') })
              }
            } else {
              alert('账号/密码错误...请重新输入')
              console.log(res.data)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style>
  @import "../../../static/plugins/font-awesome-4.7.0/css/font-awesome.css";
</style>
<style>
  .set-item-content .el-form-item__content{
    width: 100%;
  }
  .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label {
    line-height: 32px;
    margin-left: 0px !important;
    border-bottom: 1px solid #698890;
    padding-bottom: 6px;
    margin-bottom: 4px;
  }
  .el-form-item--small:last-child .el-form-item__content, .el-form-item--small:last-child .el-form-item__label{
    border-bottom: none;
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    /*width: 60%;*/
    margin-bottom: 18px;
    /*padding: 0px 20%;*/
  }

  .el-form-item__error{
    margin-top: 4px;
  }
  .el-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 100%;
  }
  .el-input--prefix .el-input__inner {
    background: rgba(0 ,0, 0, 0);
    /*color: #eaf7f8;*/
    border: none;
    font-size: 15px;
    padding-left: 45px;
  }
  .fa{
    font-size: 18px;
    /*color: #eaf7f8;*/
  }
</style>
<style lang="css" scoped>
  .bg-wrap{
    height: 100%;
    /*background: url(../../../static/img/bg.png) 100% 100%;*/
    /*background: red;*/
  }
  .demo-ruleForm{
  }
</style>
