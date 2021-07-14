import request from "@/apis/request";

export const getDictionarie = (tag: string, toMap = false) => {
    return new Promise((reslove, reject) => {
        request.get(`citic-robot-system/system/sys-dict/getDictItemList?dictCode=${tag}`)
            .then((res: iKeyString)=> {
                if(toMap) {
                    if(res.code == 200) {
                        const dictionaries: iKeyString = {}
                        res.result.map((item: iKeyString)=> {
                            dictionaries[item.itemValue] = item.itemName
                        })
                        reslove(dictionaries)
                    } else {
                        reslove({})
                    }
                }
                if(res.code == 200) {
                    const dictionaries: Array<iKeyString> = []
                    res.result.map((item: iKeyString)=> {
                        dictionaries.push({
                            name: item.itemName,
                            value: item.itemValue
                        })
                    })
                    reslove(dictionaries)
                } else {
                    reslove([])
                }
            })
    })
    
}

export const dictionaries = (code: string) => {
    return new Promise((reslove, reject) => {
        const dictionaries: iKeyString = {}
        request.get(`/apixxx-invite/dictionaries/${code}`).then((res: iKeyString) => {
            if(res.code == 200) {
                for(const key in res.result) {
                    const arr = []
                    for(const itemkey in res.result[key]) {
                        arr.push({
                            name: itemkey,
                            value: res.result[key][itemkey]
                        })
                    }
                    dictionaries[key] = arr
                }
            }
            reslove(dictionaries)
        })
    })
}

export const dictionariesOriginal = (code: string) => {
    return request.get(`/apixxx-invite/dictionaries/${code}`)
}

export const createInvite  = (data: object) => {
    return request.post('/apixxx-invite/invite', data)
}

export const inviteList  = (pageNo: number, pageSize: number) => {
    return new Promise((reslove, reject) => {
        return request.get(`/apixxx-invite/invite?pageNo=${pageNo}&pageSize=${pageSize}`).then((res)=> {
            reslove(res)
        })
    })
}

export const getCompanyList  = (companyName: string, pageNo: number, pageSize = 30) => {
    return request.get(`/apixxx-invite/invite/company?pageNo=${pageNo}&pageSize=${pageSize}&companyName=${companyName}`)
}
