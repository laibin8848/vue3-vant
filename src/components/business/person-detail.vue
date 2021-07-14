<template>
  <div class="person_detail">
    <template v-if="$route.query.type == 'invite'">
      <span style="text-align: center;border: 0; margin-bottom: 20px;">
        <img width="100" src="@/static/face.svg" />
      </span>
      <span class="__item"><span class="__label">接待状态：</span><span class="__con">{{statusMap[detail.visitStatus] || '--'}}</span></span>
      <span class="__item"><span class="__label">来访时间：</span><span class="__con">{{detail.visitTime}}</span></span>
      <span class="__item"><span class="__label">访客姓名：</span><span class="__con">{{detail.visitorName}}</span></span>
      <span class="__item"><span class="__label">访客电话：</span><span class="__con">{{detail.visitorTel}}</span></span>
      <span class="__item"><span class="__label">访客公司：</span><span class="__con">{{detail.visitorCompanyName}}</span></span>
      <span class="__item"><span class="__label">预约人：</span><span class="__con">{{detail.employeeName}}</span></span>
      <span class="__item"><span class="__label">预约码：</span><span class="__con">{{detail.inviteCode}}</span></span>
      <span class="__item"><span class="__label">来访目的：</span><span class="__con">{{dicPurpose[detail.visitorPurpose] || '--'}}</span></span>
    </template>
    <template v-if="$route.query.type == 'guest'">
      <span style="text-align: center;border: 0; margin-bottom: 20px;">
        <img width="100" src="@/static/face.svg" />
      </span>
      <span class="__item"><span class="__label">访客姓名：</span><span class="__con">{{detail.visitorName}}</span></span>
      <span class="__item"><span class="__label">访客电话：</span><span class="__con">{{detail.visitorTel}}</span></span>
      <span class="__item"><span class="__label">访客公司：</span><span class="__con">{{detail.visitorCompanyName}}</span></span>
    </template>
    <robot-back-home />
  </div>
</template>

<script lang="ts">
  import { defineComponent, Ref, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { getDictionarie } from '@/apis/invite';

  export default defineComponent({
    name: 'robot-person-detail',
    setup() {
      const $route = useRoute()
      const dicPurpose: Ref<any> = ref({})

      $route.query.type == 'invite'
        && getDictionarie('invite_purpose', true).then(map=> {
          dicPurpose.value = map
        })

      const statusMap: Ref<any> = ref({})

      $route.query.type == 'invite'
        && getDictionarie('invite_status', true).then(map=> {
        statusMap.value = map
      })
      return {
        statusMap,
        detail: $route.params,
        dicPurpose
      }
    }
  });
</script>
<style lang="scss" scoped>
  .person_detail {
    width: 90%;
    height: auto;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    .__item {
      width: 95%;
      line-height: 28px;
      padding: 8px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #535455;
      display: flex;
      .__label {
        width: 80px;
        margin-right: 10px;
        text-align: right;
        font-family: PingFangSC-Regular;
        color: #929397;
      }
      .__con { flex: 1; }
    }
  }
</style>