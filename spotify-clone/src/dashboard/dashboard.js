import { ENDPOINT } from "../common"
import { fetchRequest } from "../api"
import { logout } from "../common";

const profileMenu = document.getElementById('profile-menu');
const profileBtnHandler = (event) =>{
    // stop the clickevent on document from working as it is adding hidden class to profileMenu
    event.stopPropagation()
    const logoutBtn = document.getElementById('logout');
    if (profileMenu.classList.contains("hidden")){
        profileMenu.classList.remove("hidden")
        logoutBtn.addEventListener("click", ()=> logout())
    } else {
        profileMenu.classList.add("hidden")
    }
    

}
const loadUserProfile = async () => {
    const profileImage = document.getElementById('profile-image')
    const profileName = document.getElementById('profile-name')
    const profileBtn = document.getElementById('profile-btn')

    const UserProfileInfo = await fetchRequest(ENDPOINT.userInfo)
    const {display_name,images} = UserProfileInfo;
    // console.log("api call json data:",UserProfileInfo)
    profileName.textContent = display_name;
    if (images?.length){
        profileImage.classList.add("hidden")
    } else {
        profileImage.classList.remove("hidden")
    }

    profileBtn.addEventListener("click", profileBtnHandler)
}

const navigateToSelectedPlaylist = (event) => {
    console.log("grid playlist:",event.target)
}

const loadFeaturedPlaylist = async () => {
    const featuredPlaylistInfo = await fetchRequest(ENDPOINT.featuredPlaylist)
    console.log("api call json data:",featuredPlaylistInfo)
    const featuredPlaylistItems = document.getElementById('featured-playlist-items');
    
    const {playlists: {items}} = featuredPlaylistInfo;
    console.log('items:',items)
    for (let item of items){
        const {images, name, description, id } = item;
        const playlistItem = document.createElement("section");
        playlistItem.className = "rounded p-4 border-2 border-solid hover:cursor-pointer hover:bg-light-black transition duration-150 hover:ease-in"
        playlistItem.id = id;
        playlistItem.setAttribute("data-type","playlist");
        playlistItem.addEventListener("click",navigateToSelectedPlaylist)
        playlistItem.innerHTML =
    `   <img src="${images[0].url}" alt="${name}" class="rounded mb-2 object-contain drop-shadow">
        <h2 class="text-sm">${name}</h2>
        <h3 class="text-xs">${description}</h3>
    `
    featuredPlaylistItems.appendChild(playlistItem);
    
    }
    
    
}

document.addEventListener("DOMContentLoaded",()=>{
    loadUserProfile()
    loadFeaturedPlaylist()
    document.addEventListener("click", function(){
        if (!profileMenu.classList.contains("hidden")){
            profileMenu.classList.add("hidden");
        }
    })
})