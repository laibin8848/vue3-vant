import request from "@/apis/request";

export const visitorList  = (pageNo: number, pageSize: number) => {
    return new Promise((reslove, reject) => {
        return request.get(`/apixxx-invite/visitor/list?pageNo=${pageNo}&pageSize=${pageSize}`).then((res)=> {
            reslove(res)
        })
    })
}

export const visitorDelete  = (id: number) => {
    return request.delete(`/apixxx-invite/visitor/${id}`)
}

export const visitorDetail  = (id: number) => {
    return request.get(`/apixxx-invite/visitor/${id}`)
}

export const visitorUpdate  = (data: object) => {
    return request.put('/apixxx-invite/visitor', data)
}