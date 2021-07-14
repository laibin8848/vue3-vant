<template>
  <div class="invite_form">
    <div class="_notify_con" v-if="notice != ''">
      <span v-html="notice"></span><br />
      <van-checkbox v-model="formModel.confirmNotify" icon-size="14px" shape="square" checked-color="#535455"> <span style="color: red;">*</span>我已阅读并理解</van-checkbox>
    </div>
    <van-form class="_form_con" ref="inviteForm" @submit="onSubmit">
      <van-field
        v-model="formModel.employeeNameShow"
        label="预约人"
        readonly
      />
      <van-field
        v-model="formModel.receptionLevelLabel"
        label="接待级别"
        placeholder="请选择"
        required
        readonly
        right-icon="arrow-down"
        @click="sheetBeforeShow('level')"
        :rules="[{ required: true, message: '请选择接待级别', trigger:'onChange' }]"
      />
      <van-field
        v-model="formModel.visitorTypeLabel"
        label="访问类型"
        placeholder="请选择"
        right-icon="arrow-down"
        readonly
        @click="sheetBeforeShow('type')"
        required
        :rules="[{ required: true, message: '请选择访问类型', trigger:'onChange' }]"
      />
      <van-field
        v-model="formModel.visitorPurposeLabel"
        label="访问目的"
        placeholder="请选择"
        right-icon="arrow-down"
        readonly
        @click="sheetBeforeShow('purpose')"
        required
        :rules="[{ required: true, message: '请选择访问目的', trigger:'onChange' }]"
      />
      <van-field
        v-model="formModel.visitorName"
        placeholder="请输入"
        required
        :rules="[{ required: true, message: '请输入访客姓名' }]"
      >
        <template #label><span>访客姓名<i v-show="formModel.visitorTypeLabel == '团体'">(领队姓名)</i></span></template>
      </van-field>
      <van-field
        v-model="formModel.visitorTel"
        placeholder="请输入"
        required
        type="number"
        :rules="[{ required: true, message: '请输入访客手机号' }, { validator: isPhone, message: '请输入正确的手机号' }]"
      >
        <template #label><span>访客手机号<i v-show="formModel.visitorTypeLabel == '团体'">(领队手机号)</i></span></template>
      </van-field>
      <van-field
        v-model="formModel.visitorCompanyName"
        label="访客公司"
        placeholder="请输入"
        readonly
        :required="companyNameRequire"
        @focus="$refs.comList.tiggerShow()"
        :rules="[{ required: companyNameRequire, message: '请输入访客公司' }]"
      />
      <van-field
        v-model="formModel.visitorTeamName"
        v-if="formModel.visitorTypeLabel == '团体'"
        label="团队名称"
        placeholder="请输入"
        required
        :rules="[{ required: true, message: '请输入团队名称' }]"
      />
      <van-field
        v-if="formModel.visitorTypeLabel == '团体'"
        v-model="formModel.visitorTeamCount"
        label="团队人数"
        placeholder="请输入"
        required
        type="number"
        :rules="[{ required: true, message: '请输入团队人数' }]"
      >
        <template #label><span>团队人数<i>(2-999)</i></span></template>
      </van-field>
      <van-field
        v-model="formModel.visitTimeS"
        label="到访日期"
        placeholder="请选择"
        right-icon="arrow-down"
        required
        readonly
        @focus="showCalendar = true"
        :rules="[{ required: true, message: '请选择到访日期', trigger:'onChange' }]"
      />
      <van-field
        v-model="formModel.visitTimeE"
        label="到访时间"
        placeholder="到访时间"
        right-icon="arrow-down"
        required
        readonly
        @focus="$refs.timeRange.tiggerShow()"
        :rules="[{ required: true, message: '到访时间', trigger:'onChange' }]"
      />
      <van-field
        v-model="formModel.visitAddressCodeLabel"
        label="拜访地址"
        placeholder="请选择"
        right-icon="arrow-down"
        @click="sheetBeforeShow('addr')"
        required
        readonly
        :rules="[{ required: true, message: '请选择拜访地址', trigger:'onChange' }]"
      />
      <div class="__save_con">
        <van-checkbox v-model="formModel.frequentVisitor" icon-size="14px" shape="square" checked-color="#535455"> 保存到常用访客</van-checkbox>
      </div>
    </van-form>
    <div class="btn_con">
      <div class="_opt_btn_item" @click="$router.back()">取消</div>
      <div class="_opt_btn_item __submit" @click="$refs.inviteForm.submit()">提交</div>
    </div>
    <van-action-sheet :safe-area-inset-bottom="true" title="请选择" closeable v-model:show="sheetConfig.sheetShow" :actions="sheetConfig.sheetItems" @select="onSheetSelect" />
    <van-calendar :safe-area-inset-bottom="true" v-model:show="showCalendar" @confirm="onCalendarConfirm" />
    <robot-company-list @select-company="onSelectCompany" v-model="formModel.visitorCompanyName" ref="comList" />
    <robot-time-range v-model="formModel.visitTimeE" ref="timeRange" />
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, reactive, ref, Ref, UnwrapRef } from 'vue';
  import { Field, Form, ActionSheet, Calendar, Checkbox, Toast, Dialog } from 'vant';
  import robotCompanyList from '@/components/business/company-list.vue';
  import timeRange from '@/components/business/time-range.vue';
  import { createInvite, getDictionarie } from '@/apis/invite';
  import { useRouter, useRoute }  from 'vue-router';
  import { isPhone } from '@/utils/validator';
  import { getNotice } from '@/apis/configuration';
  import { setSaveFlag } from '@/utils/util';

  export default defineComponent({
    name: 'invite-form',
    components: {
      [Field.name]: Field,
      [Form.name]: Form,
      [ActionSheet.name]: ActionSheet,
      [Calendar.name]: Calendar,
      [robotCompanyList.name]: robotCompanyList,
      [timeRange.name]: timeRange,
      [Checkbox.name]: Checkbox
    },
    setup() {
      const Cookies = require('js-cookie')
      const $router = useRouter()
      const $route = useRoute()

      const formModel: UnwrapRef<iKeyString> = reactive({
          employeeNameShow: `${Cookies.get('userName')} (${Cookies.get('userId')})`,
        	employeeCode: Cookies.get('userId'),
          employeeName: Cookies.get('userName'),
          frequentVisitor: 0,
          receptionLevel: '',
          receptionLevelLabel: '',
          visitTime: '',
          visitorCompanyCode: '',
          visitorCompanyName: '',
          visitorName: '',
          visitorPurpose: '',
          visitorPurposeLabel: '',
          visitorTeamCount: 0,
          visitorTeamName: '',
          visitorTel: '',
          visitorType: '',
          visitorTypeLabel: '',
          visitTimeS: '',
          visitTimeE: '',
          confirmNotify: false,
          visitAddressCode: '1',
          visitAddressCodeLabel: '鸿安国际大厦'
      })
      
      if($route.query.type == 'quickly') {
        console.log('$route.params', $route.params)
        formModel.visitorTel = $route.params.visitorTel || ''
        formModel.visitorName = $route.params.visitorName || ''
        formModel.visitorCompanyCode = $route.params.visitorCompanyCode || ''
        formModel.visitorCompanyName = $route.params.visitorCompanyName || ''
      }

      const sheetConfig: Ref<iKeyString> = ref({
        curType: '',
        sheetShow: false,
        sheetItems: [],
      })

      const dicObj: Ref<any> = ref({
        inviteLevel: [],
        inviteType: [],
        invitePurpose: [],
        inviteAddress: []
      })

      //get dics
      getDictionarie('invite_type').then(arr=> {
        dicObj.value.inviteType = arr
      })
      
      getDictionarie('invite_level').then(arr=> {
        dicObj.value.inviteLevel = arr
      })
      
      getDictionarie('invite_purpose').then(arr=> {
        dicObj.value.invitePurpose = arr
      })
      
      getDictionarie('invite_address').then(arr=> {
        dicObj.value.inviteAddress = arr
      })

      const onSubmit = () => {
        if(!formModel.confirmNotify) {
          Toast.fail('请确认已阅读公告！')
          return
        }
        formModel.visitTime = new Date(`${formModel.visitTimeS} ${formModel.visitTimeE}:00`)
        formModel.frequentVisitor = formModel.frequentVisitor ? 1 : 0
        createInvite(formModel).then((res: iKeyString) => {
          if(res.code == 200) {
            Toast.success('预约创建成功！')
            setTimeout(()=> {
              setSaveFlag()
              $router.push('/invite/list')
            }, 200)
          }
        })
      }

      //show select panel logic
      const onSheetSelect = (item: iKeyString) => {
        switch(sheetConfig.value.curType) {
          case 'level':
            formModel.receptionLevel = item.value
            formModel.receptionLevelLabel = item.name
            break;
          case 'type':
            formModel.visitorType = item.value
            formModel.visitorTypeLabel = item.name
            break;
          case 'purpose':
            formModel.visitorPurpose = item.value
            formModel.visitorPurposeLabel = item.name
            break;
          case 'addr':
            formModel.visitAddressCode = item.value
            formModel.visitAddressCodeLabel = item.name
            break;
        }
        sheetConfig.value.sheetShow = false
        sheetConfig.value.curType = ''
        sheetConfig.value.sheetItems = []
      }

      const sheetBeforeShow = (type: string) => {
        sheetConfig.value.sheetShow = true
        sheetConfig.value.curType = type
        switch(type) {
          case 'level':
            sheetConfig.value.sheetItems = dicObj.value.inviteLevel || []
            break;
          case 'type':
            sheetConfig.value.sheetItems = dicObj.value.inviteType || []
            break;
          case 'purpose':
            sheetConfig.value.sheetItems = dicObj.value.invitePurpose || []
            break;
          case 'addr':
            sheetConfig.value.sheetItems = dicObj.value.inviteAddress || []
            break;
        }
      }
      
      //calendar logic
      const showCalendar: Ref<boolean> = ref(false)
      const onCalendarConfirm = (val: any) => {
        const date = new Date(val)
          const Y = date.getFullYear()
          const M = date.getMonth() + 1
          const D = date.getDate()
        formModel.visitTimeS = `${Y}/${M < 10 ? '0'+M : M}/${D}`
        showCalendar.value = false
      }

      const onSelectCompany = (item: iKeyString) => {
        formModel.visitorCompanyName = item.cstName
        formModel.visitorCompanyCode = item.cstCode
      }

      const notice: Ref<string> = ref('')
      getNotice().then((res: iKeyString)=> {
        if(res.code == 200) {
          notice.value = res.result.notice
        }
      })

      const onCalcelPage = () => {
        Dialog.confirm({
          message: '是否确定离开页面？',
        }).then(() => {
          $router.back()
        })
      }

      const companyNameRequire: Ref<boolean> = computed(()=> {
        return ['开会','商务合作','考察','拜访'].includes(formModel.visitorPurposeLabel)
      })

      return {
        companyNameRequire,
        onSelectCompany,
        formModel,
        onSubmit,
        sheetConfig,
        onSheetSelect,
        sheetBeforeShow,
        showCalendar,
        onCalendarConfirm,
        isPhone,
        notice,
        onCalcelPage
      }
    }
  });
</script>
<style lang="scss" scoped>
  .invite_form {
    margin: 0 auto;
    ::v-deep(.van-checkbox__label) {
      color: #535455;
      font-size: 14px;
    }
    ._notify_con {
      padding: 10px;
      background: #F6F8FE;
      height: auto;
      line-height: 24px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #535455;
      letter-spacing: 0.3px;
      a { color: #1677FF; }
    }
    ._form_con {
      margin-bottom: 58px;
      ::v-deep(.van-field__label) {
        font-weight: bold !important;
        font-size: 14px !important;
        color: #535455;
        i {
          display: block;
          font-style: normal;
          color: #999;
          font-size: 12px;
          font-weight: normal;
        }
      }
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
