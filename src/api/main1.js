import request from '../utils/request';

// 巡检配置查询
export const maintenancepage = query => {
    return request({
        url: `/api/maintain/inspectionConfig/list`,
        method: 'get',
        params: query
    });
};

// 新增巡检配置
export const inspectionConfig = query => {
    return request({
        url: `/api/maintain/inspectionConfig`,
        method: 'post',
        data: query
    });
};

//巡检录分页查询
export const mainrecordpage = query => {
    return request({
        url: `/api/maintain/deviceInspectionRecord/page`,
        method: 'get',
        params: query,
        headers: {
            // userId: sessionStorage.getItem('userId')
        }
    });
};

// 查看保养计划详情
export const mainrecordDetail = query => {
    return request({
        url: `/api/maintain/inspectionConfig/${query.id}`,
        method: 'get',
        params: query
    });
};

//修改
export const maintenanceput = query => {
    return request({
        url: `/api/maintain/maintenance`,
        data: query,
        method: 'put'
    });
};
// 删除
export const maintenancedelete = query => {
    return request({
        url: `/api/maintain/maintenance/${query.id}`,
        data: query,
        method: 'delete'
    });
};