<template>
  <div class="demo_page">
    <van-cell-group>
      <van-cell title="获取当前登录人信息">
        <van-button type="primary" size="small" @click="getToken">获取Token</van-button>
      </van-cell>
      <van-cell title="查看通讯录列表">
        <van-button type="primary" size="small" @click="dialogShow = true;dialogModel = 'show'">通讯录</van-button>
      </van-cell>
      <van-cell title="测试发送信息">
        <van-button type="primary" size="small" @click="dialogShow = true;dialogModel = 'select'">发送信息</van-button>
      </van-cell>
      <!-- <van-cell title="测试图片">
        <img width="80" src="@/static/1.jpg" />
      </van-cell> -->
    </van-cell-group>

    <van-dialog :show-cancel-button="false" :show-confirm-button="false" close-on-click-overlay v-model:show="dialogShow" title="部门信息" show-cancel-button message-align="left">
      <van-list>
        <van-checkbox-group v-model="partyChecked">
          <van-cell v-for="item in partyList" :key="'g_'+item.id">
            <div class="group_cell">
              <div><van-checkbox v-show="dialogModel == 'select'" :name="item.id"></van-checkbox></div>
              <div @click="showGroupDetail(item.id)" class="__name">{{item.name}}</div>
            </div>
          </van-cell>
        </van-checkbox-group>
      </van-list>
      <div class="__message_box" v-show="dialogModel == 'select'">
        <van-field
          v-model="messageSend"
          rows="3"
          autosize
          type="textarea"
          placeholder="请输入信息"
        />
        <van-button round block type="primary" native-type="submit" @click="onSendMessage">提交</van-button>
      </div>
    </van-dialog>

    <van-dialog v-model:show="dialogMemberShow" title="成员信息" show-cancel-button>
      <van-list>
        <van-checkbox-group v-model="userChecked">
          <van-cell v-for="item in userList" :key="'m_'+item.userId">
            <div class="group_cell">
              <div><van-checkbox v-show="dialogModel == 'select'" :name="item.userId"></van-checkbox></div>
              <div class="__name">{{item.name}}</div>
            </div>
          </van-cell>
        </van-checkbox-group>
      </van-list>
    </van-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, Ref, ref, watch } from 'vue';
  import { getUserInfo, departmentList, departmentUserList, wxMessageSend } from '@/apis/qywx';
  import { Button, Cell, CellGroup, Dialog, 
    List, Checkbox, CheckboxGroup, Toast, Field } from 'vant';

  export default defineComponent({
    name: 'demo',
    components: {
      [Button.name]: Button,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [Dialog.Component.name]: Dialog.Component,
      [List.name]: List,
      [Checkbox.name]: Checkbox,
      [CheckboxGroup.name]: CheckboxGroup,
      [Toast.name]: Toast,
      [Field.name]: Field
    },
    setup() {
      const partyList: Ref<Array<iKeyString>> = ref([])
      const userList: Ref<Array<iKeyString>> = ref([])
      const dialogShow: Ref<boolean> = ref(false)
      const dialogMemberShow: Ref<boolean> = ref(false)
      const partyChecked: Ref<Array<string>> = ref([])
      const userChecked: Ref<Array<string>> = ref([])
      const dialogModel: Ref<string> = ref('')
      const messageSend: Ref<string> = ref('')

      const getToken = ()=> {
        Dialog.alert({
          message: '当前Token信息为：' + getUserInfo(),
        }).then(() => {
          // on close
        });
      }

      const showGroupDetail = (groupId: string) => {
        departmentUserList(groupId).then((res: iKeyString)=> {
          if(res.result.length == 0) {
            Toast.fail('分组成员为空！')
            return
          }
          dialogMemberShow.value = true
          userList.value = res.result
        })
      }

      const onSendMessage = () => {
        if(partyChecked.value.length === 0 && userChecked.value.length === 0) {
          Toast.fail('请至少选择一个部门或一个成员！')
          return
        }
        if(messageSend.value === '') {
          Toast.fail('请输入需要发送的信息！')
          return
        }

        wxMessageSend({
          appId: 'wx91528e07d6d94f3e',
          content: messageSend.value,
          toParty: partyChecked.value.join('|'),
          toUser: userChecked.value.join('|'),
          msgType: 'text'
        }).then(()=> {
          dialogShow.value = false
          Toast.success('消息发送成功！')
        })
      }

      watch(dialogShow, ()=> {
        if(dialogShow.value) {
          departmentList().then((res: iKeyString)=> {
            partyList.value = res.result
          })
        } else {
          partyList.value = []
        }
      })

      return {
        getToken,
        dialogShow,
        dialogMemberShow,
        showGroupDetail,
        partyChecked,
        userChecked,
        dialogModel,
        onSendMessage,
        messageSend,
        partyList,
        userList
      }
    }
  });
</script>
<style lang="scss" scoped>
  .demo_page {
    .group_cell {
      display: flex;
      flex-direction: row;
      align-items: center;
      .__name {
        flex: 1;
        margin-left: 10px;
      }
    }
    .__message_box {
      padding: 10px;
    }
  }
</style>
