import { Ref, ref } from 'vue';
import { getDictionarie } from '@/apis/invite';

const useStatus = () => {
    const statusMap: Ref<any> = ref({})

    getDictionarie('invite_status', true).then(map=> {
      statusMap.value = map
    })

    const statusColorMap = ['', '#ee0a24', '#07c160', '#CCCCCC']

    return {
        statusMap,
        statusColorMap
    }
}

export default useStatus