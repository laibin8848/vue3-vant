<template>
  <div class="invite_form">
    <van-form class="_form_con" ref="configForm" @submit="onSubmit">
      <van-field
        label="访客姓名"
        v-model="formModel.visitorName"
        placeholder="请输入"
        required
        :rules="[{ required: true, message: '请输入访客姓名' }]"
      >
      </van-field>
      <van-field
        label="访客手机号"
        v-model="formModel.visitorTel"
        placeholder="请输入"
        required
        type="number"
        :rules="[{ required: true, message: '请输入访客手机号' }, { validator: isPhone, message: '请输入正确的手机号' }]"
      >
      </van-field>
      <van-field
        v-model="formModel.visitorCompanyName"
        label="访客公司"
        placeholder="请输入"
        readonly
        required
        @focus="$refs.comList.tiggerShow()"
        :rules="[{ required: true, message: '请输入访客公司' }]"
      />
    </van-form>
    <div class="btn_con">
      <div class="_opt_btn_item" @click="$router.back()">取消</div>
      <div class="_opt_btn_item __submit" @click="$refs.configForm.submit()">提交</div>
    </div>
    <robot-company-list @select-company="onSelectCompany" v-model="formModel.visitorCompanyName" ref="comList" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, Ref, UnwrapRef } from 'vue';
  import { Field, Form, Toast } from 'vant';
  import robotCompanyList from '@/components/business/company-list.vue';
  import { useRouter, useRoute }  from 'vue-router';
  import { isPhone } from '@/utils/validator';
  import { visitorDetail, visitorUpdate } from '@/apis/visitor';
  import { setSaveFlag } from '@/utils/util';

  export default defineComponent({
    name: 'guest-form',
    components: {
      [Field.name]: Field,
      [Form.name]: Form,
      [robotCompanyList.name]: robotCompanyList
    },
    setup() {
      const $router = useRouter()
      const $route: iKeyString = useRoute()

      const formModel: UnwrapRef<iKeyString> = reactive({
          id: '',
          visitorCompanyCode: '',
          visitorCompanyName: '',
          visitorName: '',
          visitorTel: ''
      })

      const onSubmit = () => {
        visitorUpdate(formModel).then((res: iKeyString) => {
          if(res.code == 200) {
            Toast.success('访客信息更新成功')
            setTimeout(()=> {
              setSaveFlag()
              $router.push('/guest/list')
            }, 500)
          }
        })
      }

      const onSelectCompany = (item: iKeyString) => {
        formModel.visitorCompanyName = item.cstName
        formModel.visitorCompanyCode = item.cstCode
      }

      visitorDetail($route.query.id || 0).then((res: iKeyString)=> {
        if(res.code == 200) {
          formModel.id = res.result.id
          formModel.visitorCompanyName = res.result.visitorCompanyName
          formModel.visitorCompanyCode = res.result.visitorCompanyCode
          formModel.visitorName = res.result.visitorName
          formModel.visitorTel = res.result.visitorTel
        }
      })

      return {
        onSelectCompany,
        formModel,
        onSubmit,
        isPhone
      }
    }
  });
</script>
<style lang="scss" scoped>
  .invite_form {
    ._form_con {
      margin-bottom: 58px;
      padding-bottom: 10px;
      background: #fff;
      border: 1px #fff solid;
      padding-top: 20px;
      .__save_con {
        margin: 20px 0 20px 10px;
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
