export const ACCESS_TOKEN = "ACCESS_TOKEN";
export const TOKEN_TYPE = "TOKEN_TYPE";
export const EXPIRES_IN = "EXPIRES_IN";
export const LOADED_TRACKS = "LOADED_TRACKS";
const APP_URL = import.meta.env.VITE_APP_URL;

export const ENDPOINT = {
    userInfo : "me",
    featuredPlaylist: "browse/featured-playlists?limit=5",
    topPlaylist: "browse/categories/toplists/playlists?limit=10",
    playlists :"playlists",
    userPlaylist: "me/playlists"
}
// category playlist >> browse/categories/{category_id}/playlists
export const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(EXPIRES_IN);
    localStorage.removeItem(TOKEN_TYPE);
    window.location.href = APP_URL;
}

export const SECTIONTYPE = {
    DASHBOARD : "DASHBOARD",
    PLAYLIST : "PLAYLIST"
}

export const setItemsInLocalStorage = (key,value) => {
    // stringify becoz we are sending an object
    localStorage.setItem(key,JSON.stringify(value))
}

export const getItemsInLocalStorage = (key) => {
    // stringify becoz we are sending an object
    return JSON.parse(localStorage.getItem(key))
}