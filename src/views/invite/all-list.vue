<template>
  <div class="invite_list">
    <van-pull-refresh v-model="listState.refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="listState.loading"
        :finished="listState.finished"
        finished-text="-- 我是有底线的 --"
        @load="fetchList"
      >
        <div class="item_card" @click="$router.push({name: 'personDetail', params: item, query: {type: 'invite'}})" v-for="item in listState.list" :key="item.appid">
          <div class="__card_item __header">
            {{item.visitorName}} {{item.visitorTel}} <van-icon style="margin: 4px 0 0 6px;" size="16px" name="phone-circle-o" />
          </div>
          <div class="__card_item">
            <span class="__flex_1">{{item.visitorCompanyName}}</span>
            <span class="__align_r"><van-tag round type="primary" :color="statusColorMap[item.visitStatus] || '#07c160'"> {{statusMap[item.visitStatus] || '--'}} </van-tag><br />{{item.visitTime}}</span>
          </div>
          <div class="__card_item">
            {{item.employeeName}}
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <robot-back-home />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { List, PullRefresh, Tag, Icon } from 'vant';
  import useList from '@/hooks/useList';
  import { allInvite } from '@/apis/configuration';
  import useStatus from '@/hooks/useStatus';

  export default defineComponent({
    name: 'invite-list',
    components: {
      [List.name]: List,
      [PullRefresh.name]: PullRefresh,
      [Tag.name]: Tag,
      [Icon.name]: Icon
    },
    setup() {
      return {
        ...useStatus(),
        ...useList(allInvite)
      }
    }
  });
</script>
<style lang="scss" scoped>
  .invite_list {
    padding-top: 8px;
    background: #F7F7F7;
    .item_card {
      ::v-deep(.van-tag) {
        padding: 2px 5px;
      }
      cursor: pointer;
      background: #FFF;
      height: auto;
      margin: 0 auto 10px auto;
      padding: 10px;
      color: #929397;
      font-size: 13px;
      .__header {
        font-size: 16px;
        font-weight: bold;
        line-height: 28px;
        color: #535455;
      }
      .__card_item {
        line-height: 22px;
        display: flex;
      }
    }
  }
</style>
