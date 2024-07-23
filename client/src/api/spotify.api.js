import axios from "./base.api";
import axiosBase from "axios"

const getSpotifyUser = (accessToken) => {
    return axiosBase.get(`https://api.spotify.com/v1/me`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(rs => {
        return rs.data
    })
}
const getSpotifyCategoryPlaylist = (accessToken, categoryId, country = 'US') => {
    return axiosBase.get(`https://api.spotify.com/v1/browse/categories/${categoryId}/playlists?country=${country}&limit=10`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(rs => {
        return rs.data
    })
}
const getSpotifyUserPlaylist = (userId, accessToken) => {
    return axiosBase.get(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(rs => {
        return rs.data
    })
}
const getSpotifyPlayList = (playListId, accessToken) => {
    return axiosBase.get(`https://api.spotify.com/v1/playlists/${playListId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(rs => {
        return rs.data
    })
}

const playPlayList = (playListUri, deviceId, accessToken) => {
    return axiosBase.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {context_uri: playListUri}, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(rs => {
        return rs.data
    })
}

const getSpotifyLoginUrl = (state) => {
    return axios.get(`/spotify/get-spotify-login-url?state=${state}`).then(rs => {
        return rs.data
    })
}
const getSpotifyAccessToken = (code) => {
    return axios.get(`/spotify/get-spotify-access-token?code=${code}`).then(rs => {
        return rs.data
    })
}
const refreshSpotifyAccessToken = (refreshToken) => {
    return axios.get(`/spotify/refresh-spotify-access-token?refresh_token=${refreshToken}`).then(rs => {
        return rs.data
    })
}

const spotifyApi = {
    getSpotifyLoginUrl,
    getSpotifyAccessToken,
    refreshSpotifyAccessToken,
    getSpotifyUser,
    getSpotifyUserPlaylist,
    getSpotifyPlayList,
    playPlayList,
    getSpotifyCategoryPlaylist
} 
export default spotifyApi