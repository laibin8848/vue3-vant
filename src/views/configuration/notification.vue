<template>
  <div class="_form">
    <van-form class="_form_con" ref="config_Form" @submit="onSubmit">
      <van-field
        v-model="notification.notice"
        label="公告内容"
        type="textarea"
        rows="10"
        required
        :rules="[{ required: true, message: '公告内容不能为空' }]"
      />
    </van-form>
    <div class="btn_con">
      <div class="_opt_btn_item" @click="$router.back()">取消</div>
      <div class="_opt_btn_item __submit" @click="$refs.config_Form.submit()">保存</div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, Ref } from 'vue';
  import { Field, Form, Toast, Dialog } from 'vant';
  import { getNotice, updateNotice } from '@/apis/configuration';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'notification',
    components: {
      [Field.name]: Field,
      [Form.name]: Form
    },
    setup(props: iKeyString, cxt: iKeyString) {
      const notification: Ref<iKeyString> = ref({
        id: '',
        notice: ''
      })

      getNotice().then((res: iKeyString)=> {
        if(res.code == 200) {
          notification.value.id = res.result.id
          notification.value.notice = res.result.notice
        }
      })

      const onSubmit = () => {
        updateNotice(notification.value).then((res: iKeyString)=> {
          if(res.code == 200) {
            Toast.success('公告更新成功')
          }
        })
      }

      const $router = useRouter()
      const onCalcelPage = () => {
        Dialog.confirm({
          message: '是否确定离开页面？',
        }).then(() => {
          $router.back()
        })
      }

      return {
        onSubmit,
        notification,
        onCalcelPage
      }
    }
  });
</script>
<style lang="scss" scoped>
  ._form {
    ._form_con {
      padding-bottom: 10px;
      padding-top: 20px;
      ::v-deep(.van-cell) {
        display: flex;
        flex-direction: column;
      }
      ::v-deep(.van-field__control) {
        border: 1px solid #c7ccd1;
        padding: 6px;
      }
    }
    .btn_con {
      position: fixed;
      bottom: 0;
      width: 100%;
      margin: 0;
      display: flex;
      background: #fff;
      ._opt_btn_item {
        flex: 1;
        border: 1px solid #F2F3F4;
        height: 58px;
        line-height: 58px;
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #FA2E47;
        letter-spacing: 0;
        text-align: center;
        cursor: pointer;
        border-left: 0;
        border-right: 0;
      }
      .__submit {
        background-image: linear-gradient(0deg, #EE0016 0%, #FF3F59 100%);
        color: #fff;
      }
    }
  }
</style>
