/** 这是一个抽象可复用逻辑，根据不同的列表页面加载数据*/
import { reactive, UnwrapRef } from 'vue';

const useList = (loadFun: any) => {
    const listState: UnwrapRef<iKeyString> = reactive({
        pageNo: 1,
        pageSize: 20,
        list: [],
        loading: false,
        finished: false,
        refreshing: false
    })

    const fetchList = ()=> {
        listState.loading = true
        if (listState.refreshing) {
            listState.list = []
            listState.refreshing = false
        }
        loadFun(listState.pageNo, listState.pageSize).then((res: iKeyString)=> {
            if(res.code == 200) {
                if(res.result.records.length == 0) {
                    listState.finished = true
                } else {
                    listState.list.push(...res.result.records)
                    listState.pageNo = res.result.current + 1
                    listState.list.length >= res.result.total  && (listState.finished = true)
                }
            } else {
                listState.finished = true
            }
            listState.loading = false
        })
    }

    const onRefresh = ()=> {
        listState.loading = false
        listState.finished = false
        listState.pageNo = 1
        fetchList()
    }

    return {
        listState,
        fetchList,
        onRefresh
    }
}

export default useList