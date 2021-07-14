<template>
  <van-popup :safe-area-inset-bottom="true" v-model:show="popupShow" position="left" :style="{ height: '100%', width: '100%', background: '#F9FAFB' }" >
    <div class="top_bar">
      <span class="__icon" @click="popupShow = false"><van-icon size="18px" name="arrow-left" /></span>
      <span class="__flex_1"><van-search v-model="searchVal" placeholder="请输入搜索关键词"></van-search></span>
      <span class="__btn" @click="onConfirmUse">输入</span>
    </div>
    <div class="user_list">
      <van-list
        v-model:loading="listState.loading"
        :finished="listState.finished"
        finished-text="-- 我是有底线的 --"
        @load="fetchList"
        :immediate-check="false"
      >
        <div v-for="item in listState.list" :key="item.name" @click="onSelect(item)" class="__item">{{item.cstName}}</div>
      </van-list>
    </div>
  </van-popup>
</template>

<script lang="ts">
  import { defineComponent, Ref, ref, watch } from 'vue';
  import { Search, Popup, Button, Toast, List, Icon } from 'vant';
  import { getCompanyList } from '@/apis/invite';
  import useList from '@/hooks/useList';

  export default defineComponent({
    name: 'robot-company-list',
    components: {
      [List.name]: List,
      [Search.name]: Search,
      [Popup.name]: Popup,
      [Button.name]: Button,
      [Icon.name]: Icon
    },
    props: {
      modelValue: {
        type: String,
        default: ''
      }
    },
    setup(props: iKeyString, {
      emit
    }) {
      const searchVal: Ref<string> = ref('')

      const popupShow: Ref<boolean> = ref(false)

      watch(popupShow, ()=> {
        popupShow.value && (searchVal.value = props.modelValue)
      })

      const tiggerShow = () => {
        popupShow.value = true
      }

      const onSelect = (item: iKeyString) => {
        // emit('update:modelValue', val)
        emit('select-company', item)
        popupShow.value = false
      }

      const onConfirmUse = () => {
        if(searchVal.value == '') {
          Toast.fail('公司名称不能为空！')
          return
        }
        emit('select-company', {cstName: searchVal.value, cstCode: "-1"})
        // emit('update:modelValue', searchVal.value)
        popupShow.value = false
      }
      const listHooks = useList(undefined)

      //debounce to get company list
      let changeTimer: number = 0
      function debounce() {
        clearTimeout(changeTimer)
        changeTimer = setTimeout(()=> {
          if(searchVal.value) {
            listHooks.listState.list = []
            listHooks.listState.pageNo = 1
            listHooks.listState.finished = false
            fetchList()
          }
        }, 1000)
      }

      watch(searchVal, ()=> {
        debounce()
      })

      const fetchList = ()=> {
        listHooks.listState.loading = true
        getCompanyList(searchVal.value, listHooks.listState.pageNo).then((res: iKeyString)=> {
          if(res.code == 200) {
            if(res.result.companyList && res.result.companyList.length > 0) {
              listHooks.listState.list.push(...res.result.companyList)
              listHooks.listState.pageNo = res.result.pageNo + 1
              listHooks.listState.list.length >= res.result.rowCount  && (listHooks.listState.finished = true)
            } else {
              listHooks.listState.finished = true
            }
          } else {
              listHooks.listState.finished = true
          }
          listHooks.listState.loading = false
        })
      }

      return {
        searchVal,
        popupShow,
        tiggerShow,
        onSelect,
        onConfirmUse,
        ...listHooks,
        fetchList
      }
    }
  })
</script>
<style lang="scss" scoped>
  .top_bar {
    margin-top: 18px;
    width: 100vw;
    height: 56px;
    line-height: 56px;
    background: #F9FAFB;
    display: flex;
    align-items: center;
    ::v-deep(.van-search) {
      padding: 0;
      border: 1px #000 solid;
      border-radius: 4px;
      flex: 1;
      margin: 0 10px;
    }
    .__icon { margin-left: 10px; }
    .__btn {
      background-image: linear-gradient(180deg, #EE0016 0%, #FF3F59 100%);
      border-radius: 12px;
      width: 49px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      color: #FFF;
      font-size: 12px;
      margin-right: 10px;
    }
  }
  .user_list {
    padding: 10px;
    background: #fff;
    .__item {
      line-height: 32px;
      cursor: pointer;
      margin-bottom: 10px;
      border-bottom: 1px solid #F2F3F4;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #535455;
    }
  }
</style>
