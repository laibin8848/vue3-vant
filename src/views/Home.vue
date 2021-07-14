<template>
  <div class="home_page">
    <div class="logo">
      <robot-logo />
    </div>
    <div class="btn_list">
      <template v-if="$route.query.role != 'setting'">
        <div class="btn_item" @click="$router.push('/invite/form')">
          <img class="__icon" src="../static/icon_create.svg" /> 新建预约
        </div>
        <div class="btn_item" @click="$router.push('/invite/list')">
          <img class="__icon" src="../static/icon_mine.svg" /> 我的预约
        </div>
        <div class="btn_item" @click="$router.push('/guest/list')">
          <img class="__icon" src="../static/icon_offen.svg" /> 常用访客
        </div>
        <div v-if="isAdmin" class="btn_item" @click="$router.push('/?role=setting')">
          <img class="__icon" src="../static/icon_setting.svg" /> 管理
        </div>
      </template>
      <template v-if="$route.query.role == 'setting'">
        <div class="btn_item" @click="$router.push('/invite/list/all')">
          <img class="__icon" src="../static/icon_mine.svg" /> 所有预约
        </div>
        <div class="btn_item" @click="$router.push('/configuration/notification')">
          <img class="__icon" src="../static/icon_setting.svg" /> 公告配置
        </div>
      </template>
    </div>
    <div class="footer"></div>
  </div>
</template>
<script> 
import { ref } from 'vue';
import { getUserInfo } from '@/apis/auth';

export default {
  setup() {
    const isAdmin = ref(false)
    const Cookies = require('js-cookie')

    getUserInfo().then(res=> {
      if(res.code == 200) {
        Cookies.set('isAdmin', res.result.isAdmin)
        Cookies.set('userName', res.result.name)
        Cookies.set('userId', res.result.userId)
        isAdmin.value = res.result.isAdmin
      }
    })
    
    return {
      isAdmin
    }
  }
}
</script>


<style lang="scss" scoped>
  .home_page {
    width: 100%;
    .logo {
      height: 291px;
      background: no-repeat center -40px url('../static/top_bg.svg');
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .btn_list {
      width: 100%;
      margin: 0 auto;
      .btn_item {
        cursor: pointer;
        background: #FFFFFF;
        box-shadow: 0 1px 7px 0 #E2E0E0;
        border-radius: 37.5px;
        width: 280px;
        height: 60px;
        line-height: 60px;
        margin: 10px auto 20px auto;
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #535455;
        letter-spacing: 0;
        display: flex;
        align-items: center;
        font-weight: bold;
        .__icon {
          margin: 0 20px 0 60px;
        }
      }
      .van-button {
        margin-bottom: 15px;
      }
    }
    .footer {
      width: 100%;
      height: 100px;
      background: no-repeat url('../static/bottom_bg.svg');
      background-size: 100% 100%;
      background-position: center 20px;
      position:fixed;
      bottom: 0;
      z-index: -1;
    }
  }
</style>
