import {service} from '@/api/index'

// 心跳检测api
export const getHeartbeat = params => {
    return service
        .get('/heartbeat')
        .then(res => res.data)
}

// 获取节点的系统信息api
export const getNodeSystemInfo = (params) => {
    return service
        .get('/nodeSystemInfo/' + params)
        .then(res => res)
}

// 获取桶列表
export const getBucketList = (params, bucket) => {
    return service
        .request({
            url: '/bucket/' + params,
            method: 'GET',
            headers: {
                'bucket': bucket
            },
        })
        .then(res => res)
}

// head查询桶是否存在
export const searchBucket = params => {
    return service
        .request({
            url: '/bucket/',
            method: 'head',
            headers: {
                'bucket': params
            },
        })
        .then(res => res)
}

// 新增桶
export const addBucket = params => {
    return service
        .request({
            url: '/bucket/',
            method: 'PUT',
            headers: {
                'bucket': params
            },
        })
        .then(res => res)
}

// 删除桶
export const delBucket = params => {
    return service
        .request({
            url: '/bucket/',
            method: 'DELETE',
            headers: {
                'bucket': params
            },
        })
        .then(res => res)
}

// 对象最新版本分页列表api
export const getObjLists = (params, bucket) => {
    return service
        .request({
            url: '/allVersions/' + bucket + "/" + params,
            method: 'GET'
        })
        .then(res => res)
}

// 单个对象其它版本列表api
export const getObjOtherLists = (params, bucket) => {
    return service
        .request({
            url: '/versions/' + bucket + "/" + params,
            method: 'GET'
        })
        .then(res => res)
}

// 下载对象api
export const getObj = (params, bucket) => {
    return service
        .request({
            url: '/objects/' + bucket + "/" + params,
            method: 'GET',
            responseType: 'blob'
        })
        .then(res => res)
}

// 普通上传api
export const uploadObj = (params, data, hash, bucket, onUploadProgress) => {
    return service
        .request({
            url: '/objects/' + bucket + "/" + params,
            method: 'PUT',
            data: data,
            headers: {
                'Digest': 'SHA-256=' + hash
            },
            onUploadProgress
        })
        .then(res => res)
}

// 分片请求 获取token api
export const getSliceUploadToken = (params, hash, size, bucket) => {
    return service
        .request({
            url: '/objects/' + bucket + "/" + params,
            method: 'POST',
            headers: {
                'Digest': 'SHA-256=' + hash,
                'Size': size
            }
        })
        .then(res => res)
}

// 获取上传进度api
export const headUploadSliceProgress = (params) => {
    return service
        .head(params)
        .then(res => res)
}

// 分片上传对象api
export const uploadSlice = (params, data, range, ) => {
    return service
        .request({
            url: params,
            method: 'put',
            data: data,
            headers: {
                'range': range
            }
        })
        .then(res => res)
}

// 删除对象api
export const deleteObj = (params, bucket) => {
    return service
        .request({
            url: '/objects/' + bucket + "/" + params,
            method: 'delete'
        })
        .then(res => res)
}

// 获取系统信息api
export const systemInfo = (params) => {
    return service
        .get('/systemInfo/' + params)
        .then(res => res)
}

// 扫描修复api
export const objectScanner = () => {
    return service
        .get('/objectScanner/')
        .then(res => res)
}

// 删除无引用数据的api
export const deleteOrphan = () => {
    return service
        .get('/deleteOrphanServer/')
        .then(res => res)
}

// 保留版本api
export const deleteOldMetadata = (params) => {
    return service
        .get('/deleteOldMetadata/' + params)
        .then(res => res)
}

// 全部日志
export const getLog = (params, data) => {
    return service
        .request({
            url: "/getLog/" + params,
            method: 'post',
            data: data
        })
        .then(res => res)
}
