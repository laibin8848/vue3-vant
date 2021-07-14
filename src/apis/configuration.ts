import request from "@/apis/request";

export const getNotice = () => {
    return request.get('/apixxx-invite/invite/notice')
}

export const updateNotice = (data: object) => {
    return request.put('/apixxx-invite/admin/notice', data)
}

export const allInvite = (pageNo: number, pageSize: number) => {
    return request.get(`/apixxx-invite/admin/invite/all?pageNo=${pageNo}&pageSize=${pageSize}`)
}
