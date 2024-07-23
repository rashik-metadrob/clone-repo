export const getStorageToken = () => getLocalStorageItemSafety('MetadrobUserToken');
export const getStorageUserDetail = () => getLocalStorageItemSafety('MetadrobUser');
export const getStorageRefreshToken = (value) => getLocalStorageItemSafety("MetadrobUserRefreshToken")

export const setStorageUserDetail = (value) => setLocalStorageItemSafety("MetadrobUser", value)
export const setStorageToken = (value) => setLocalStorageItemSafety("MetadrobUserToken", value)
export const setStorageRefreshToken = (value) => setLocalStorageItemSafety("MetadrobUserRefreshToken", value)

export const removeAllUserData = () => {
    localStorage.removeItem("MetadrobUser")
    localStorage.removeItem("MetadrobUserToken")
    localStorage.removeItem("MetadrobUserRefreshToken")
}

const getLocalStorageItemSafety = (key) => {
    const value = localStorage.getItem(key);
    return value !== 'undefined' ? JSON.parse(value) : undefined;
};

const setLocalStorageItemSafety = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}