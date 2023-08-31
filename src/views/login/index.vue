<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Hello</h1>
          <h2>欢迎来到甄选</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary" size="default" class="login_btn" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang='ts'>
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { ElNotification } from 'element-plus';
// 引入获取当前时间的函数
import { getTime } from '@/utils/time'

// 引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
let $router = useRouter()
let $route = useRoute()
// 获取el-form组件
let loginForms = ref()
// 控制加载
let loading = ref(false)
// 收集账号与密码的数据
let loginForm = reactive({ username: 'admin', password: 'atguigu123' })
// 登录按钮回调
const login = async () => {

  // 保证全部表单校验通过再发请求
  await loginForms.value.validate()

  loading.value = true
  try {
    await userStore.userLogin(loginForm)
    // 判断登录时是否有query参数，有就跳到query参数，没有的话就跳到首页
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || "/" })
    // 登录成功
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `HI,${getTime()}好`
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    // 登陆失败
    ElNotification({
      type: 'error',
      message: (error as Error).message
    })
  }
}


// 自定义校验规则函数
const validatorUsername = (rule: any, value: any, callback: any) => {
  // rule :即为校验规则对象
  // value ：即为表单元素文本内容
  // callback ： 如果符合条件callback放行通过，不符合注入错误信息
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error("账号长度至少五位"))
  }
}

const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error("密码长度至少六位"))
  }
  // console.log(rule);

}


// 定义表单校验需要配置对象
const rules = {
  username: [
    // { required: true, min: 5, max: 10, message: '账号长度最小六位', trigger: 'change' }
    { trigger: 'change', validator: validatorUsername }
  ],
  password: [
    // { required: true, min: 6, max: 10, message: '密码长度最小六位', trigger: 'change' }
    { trigger: 'change', validator: validatorPassword }
  ],
}

</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0px;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>