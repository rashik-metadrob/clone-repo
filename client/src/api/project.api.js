import axios from './base.api';

export const createProject = (data) => {
    return axios.post(`/project/create`, data).then(rs => {
        return rs.data
    })
}

export const createProjectTemplate = (data) => {
    return axios.post(`/project/create-template`, data).then(rs => {
        return rs.data
    })
}

export const getProjectById = (id, isPublishMode = false) => {
    return axios.get(`/project/project/${id}?isPublishMode=${isPublishMode}`).then(rs => {
        return rs.data
    })
}

export const getListProject = (params) => {
    return axios.get(`/project/get-projects`, {params}).then(rs => {
        return rs.data
    })
}

export const getListProjectByAdmin = (params) => {
    return axios.get(`/project/get-projects-by-admin`, {params}).then(rs => {
        return rs.data
    })
}

export const updateProjectById  = (id, data) => {
    return axios.put(`/project/project/${id}`, data).then(rs => {
        return rs.data
    })
}
const updateProjectMode  = (id, data) => {
    return axios.put(`/project/project/change-project-mode/${id}`, data).then(rs => {
        return rs.data
    })
}

const syncPublishStoreWithLive  = (id) => {
    return axios.put(`/project/project/sync-with-live/${id}`).then(rs => {
        return rs.data
    })
}

export const getListPublishProject = (params) => {
    return axios.get(`/project/get-list-publish-project`, {params}).then(rs => {
        return rs.data
    })
}

export const deleteProject = (id) => {
    return axios.delete(`/project?id=${id}`).then(rs => {
        return rs.data
    })
}

const projectApi = {
    updateProjectMode,
    syncPublishStoreWithLive
}

export default projectApi