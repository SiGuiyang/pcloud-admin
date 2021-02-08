<template>
  <div class="login-container">
    <el-row>
      <el-col :xs="24"
              :sm="24"
              :md="12"
              :lg="16"
              :xl="16">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :xs="24"
              :sm="24"
              :md="12"
              :lg="8"
              :xl="8">
        <el-form ref="loginForm"
                 :model="loginForm"
                 :rules="loginRules"
                 class="login-form"
                 auto-complete="on"
                 label-position="top">

          <div class="title-container">
            <h3 class="title">PCloud 微服务平台</h3>
          </div>

          <el-form-item prop="phone">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input v-model="loginForm.phone"
                      placeholder="手机号码"
                      name="phone"
                      type="text"
                      auto-complete="on" />
          </el-form-item>

          <el-form-item prop="password">
            <template>
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input v-model="loginForm.password"
                        :type="passwordType"
                        placeholder="密码"
                        name="password"
                        auto-complete="on"
                        @keyup.enter.native="handleLogin" />
              <span class="show-pwd"
                    @click="showPwd">
                <svg-icon icon-class="eye" />
              </span>
            </template>
          </el-form-item>
          <el-button :loading="loading"
                     :disabled="loginBtnDisabled"
                     type="primary"
                     style="width: 100%;"
                     @click.native.prevent="handleLogin">
            登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;陆
          </el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('用户名只能是字母与数字的组合'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      placeholder: {
        phone: '手机号码',
        password: '密码'
      },
      loginForm: {
        phone: '13813145021',
        password: '111111'
      },
      loginRules: {
        phone: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loginBtnDisabled: false,
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }

  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin () { // 密码登陆
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '登陆成功'
            })
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@supports (-webkit-mask: none) and (not (cater-color: #fff)) {
  .login-container .el-input input {
    color: #000;

    &::first-line {
      // color: $light_gray;
    }
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #000;
      height: 47px;
      caret-color: #000;

      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #eee inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url("~@/assets/background.jpg") center center fixed no-repeat;

  .login-form {
    position: relative;
    max-width: 100%;
    margin: calc((100vh - 425px) / 2) 10% 10%;
    overflow: hidden;
  }
  .title-change {
    color: #fff;
    position: absolute;
    top: 3px;
    font-size: 18px;
    right: 0;
    cursor: pointer;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
}
</style>
