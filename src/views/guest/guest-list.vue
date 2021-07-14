<template>
  <div class="invite_list">
    <van-pull-refresh v-model="listState.refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="listState.loading"
        :finished="listState.finished"
        finished-text="-- 我是有底线的 --"
        @load="fetchList" >
        <div class="item_card" @click="$router.push({name: 'personDetail', params: item, query: {type: 'guest'}})" v-for="(item, index) in listState.list" :key="item.appid">
          <div class="__card_item __header">
            {{item.visitorName}} {{item.visitorTel}} <van-icon style="margin: 4px 0 0 6px;" size="16px" name="phone-circle-o" />
          </div>
          <div class="__card_item">
            <span class="__flex_1">{{item.visitorCompanyName}}</span>
            <span class="__align_r"></span>
          </div>
          <div class="__card_item __width_border">
            <span class="__flex_1"></span>
            <span class="__align_r">
              <span class="__btn" @click.stop="onDel(item, index)">删除</span>
              <span class="__btn" @click.stop="$router.push({name: 'inviteForm', params: item, query: {type: 'quickly'}})">预约</span>
              <span class="__btn __del_btn" @click.stop="$router.push(`/guest/form?id=${item.id}`)">编辑</span>
            </span>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <robot-back-home />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { List, PullRefresh, Icon, Dialog, Toast } from 'vant';
  import useList from '@/hooks/useList';
  import { visitorList, visitorDelete } from '@/apis/visitor'

  export default defineComponent({
    name: 'guest-list',
    components: {
      [List.name]: List,
      [PullRefresh.name]: PullRefresh,
      [Icon.name]: Icon,
      [Dialog.name]: Dialog
    },
    setup() {
      const listHooks = useList(visitorList)

      const onDel = ((item: iKeyString, index: number)=> {
        Dialog.confirm({
          message: '确定删除？',
        }).then(() => {
          visitorDelete(item.id).then((res: iKeyString)=> {
            if(res.code == 200) {
              Toast.success('删除成功')
              listHooks.listState.list.splice(index, 1)
            } else {
              Toast.fail('删除失败')
            }
          })
        })
      })

      return {
        onDel,
        ...listHooks
      }
    }
  });
</script>
<style lang="scss" scoped>
  .invite_list {
    background: #F7F7F7;
    padding-top: 8px;
    .item_card {
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
      .__width_border {
        border-top: 1px solid #F2F3F4;
        padding-top: 6px;
        .__btn {
          border: 1px solid #929397;
          border-radius: 4px;
          color: #929397;
          width: 48px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          font-size: 13px;
          padding: 4px 10px;
          margin-left: 6px;
        }
        .__del_btn {
          background-image: linear-gradient(0deg, #EE0016 0%, #FF3F59 100%);
          color: #FFF;
          border: 0;
        }
      }
    }
  }
</style>
