<template>
  <van-popup :safe-area-inset-bottom="true" v-model:show="timeRangeShow" position="bottom">
      <van-picker title="" @change="onTimeRangeChange" @cancel="timeRangeShow = false" @confirm="onTimeRangeConfirm" :columns="timeRange" />
    </van-popup>
</template>

<script lang="ts">
  import { defineComponent, Ref, ref } from 'vue';
  import { Popup, Picker } from 'vant';
  import { genTimeRange } from '@/utils/timeFormater';

  export default defineComponent({
    name: 'robot-time-range',
    components: {
      [Popup.name]: Popup,
      [Picker.name]: Picker
    },
    props: {
      modelValue: {
        type: String,
        default: ''
      },
      singleColumns: {
        type: Boolean,
        default: true
      }
    },
    setup(props: iKeyString, {
      emit
    }) {
      const timeRangeShow: Ref<boolean> = ref(false)
      const hour = new Date().getHours()

      const timeRange: Ref<Array<iKeyString>> = ref([
        { values: genTimeRange(), defaultIndex: hour * 2, },
        // { values: genTimeRange(), defaultIndex: 0, }
      ])
      const onTimeRangeConfirm = (val: any) => {
        timeRangeShow.value = false
        emit('update:modelValue', val.join('~'))
      }
      const onTimeRangeChange = (val: any) => {
        if(props.singleColumns) {
          return
        }
        const start = val[0].split(':')
        const starth = parseInt(start[0])
        const startm = parseInt(start[1])
        timeRange.value[1].values = genTimeRange(false, starth, startm)
      }

      const tiggerShow = () => {
        timeRangeShow.value = true
      }

      return {
        timeRange,
        timeRangeShow,
        tiggerShow,
        onTimeRangeConfirm,
        onTimeRangeChange
      }
    }
  });
</script>