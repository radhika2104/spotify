import { ENDPOINT, SECTIONTYPE } from "../common"
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

const navigateToSelectedPlaylist = (event,id) => {
    
    // console.log("grid playlist:",event.target)
    // console.log("playlist id:",id)
    const section = {type: SECTIONTYPE.PLAYLIST, playlist: id}
    history.pushState(section,"",`playlist/${id}`)
    loadSection(section);
    
}

const loadPlaylist = async (endpoint,elementID) => {
    const featuredPlaylistInfo = await fetchRequest(endpoint)
    // console.log("api call json data:",featuredPlaylistInfo)
    const featuredPlaylistItems = document.getElementById(`${elementID}`);
    
    const {playlists: {items}} = featuredPlaylistInfo;
    // console.log('items:',items)
    for (let item of items){
        const {images, name, description, id } = item;
        const playlistItem = document.createElement("section");
        playlistItem.className = "bg-black-secondary rounded p-4 hover:cursor-pointer hover:bg-light-black transition duration-150 hover:ease-in"
        playlistItem.id = id;
        playlistItem.setAttribute("data-type","playlist");
        playlistItem.addEventListener("click",(event)=>navigateToSelectedPlaylist(event,id))
        playlistItem.innerHTML =
    `   <img src="${images[0].url}" alt="${name}" class="rounded mb-2 object-contain drop-shadow">
        <h2 class="text-base font-semibold mb-4 truncate">${name}</h2>
        <h3 class="text-sm text-secondary line-clamp-2">${description}</h3>
    `
    featuredPlaylistItems.appendChild(playlistItem);
    }
}

const loadPlaylistSectionData = () => {
    loadPlaylist(ENDPOINT.featuredPlaylist,'featured-playlist-items' )
    loadPlaylist(ENDPOINT.topPlaylist,'toplist-playlist-items' )
}

const fillDashboardMainContent = () => {
    const pageContent = document.getElementById('page-content')
    const contentMap = new Map([['Featured','featured-playlist-items'],['Top Playlists','toplist-playlist-items']])
    let innerHTMLdata="";
    for (let [name,id] of contentMap){
        innerHTMLdata += 
        `<article class="p-4">
                <h1 class="mb-4 text-2xl font-bold capitalize">${name}</h1>
                <section class="featured-songs gap-4 grid grid-cols-auto-fill-cards" id="${id}">
                </section>
            </article>
        `    
    }
    // console.log(innerHTMLdata)
    pageContent.innerHTML = innerHTMLdata
}

const fillPlaylistItemContent = () => {
    const pageContent = document.getElementById("page-content");
    pageContent.innerHTML = 
    `<header id="playlist-header" class="px-8 py-4">
    <nav>
       <ul class="grid grid-cols-[50px_2fr_1fr_50px]  justify-start items-center gap-4 text-secondary">
            <li class="justify-self-center">#</li>
            <li>TITLE</li>
            <li>ALBUM</li>
            <li>🕑</li>
       </ul> 
    </nav>
    </header>
    <section id="tracks" class="px-8"></section>`;

}

function formatDuration(duration){
    
    const sec = Math.floor(duration/1000)
    const min = Math.floor(sec/60)
    const secleft = (sec%60).toFixed(0)
    if (Number(secleft) < 10){
        // console.log('secleft:',secleft)
        return `${min}:0${secleft}`
    } else if (secleft === "60"){
        return `${min+1}:00`
    } else {
        return `${min}:${secleft}`
    }
}


const loadPlaylistTracks = async (playlist_id) => {
    // endpoint - 	https://api.spotify.com/v1/playlists/{playlist_id}/tracks
    // playlistTracks: "playlists/{playlist_id}/tracks"
    const tracksSection = document.getElementById('tracks');
    const playlistTracksData = await fetchRequest(`${ENDPOINT.playlists}/${playlist_id}`)
    console.log("playlistTracksData:" ,playlistTracksData)
    // data to be fetched, index,title,artist names, album,date added, length of song
    const trackItems = playlistTracksData.tracks.items;
    // console.log("track items:" ,trackItems)
    let trackCounter = 0
    for (let trackItem of trackItems){
        // const {track:{id,artists:[{name:artistName}],name:title,album:{name:albumName},duration_ms:duration}} = trackItem;
        const {track:{id,artists,name:title,album,duration_ms:duration}} = trackItem;
        // console.log("album and artist object :",album, artists)
        let image = album.images.find(img=>img.height===64)
        // console.log("printing object of items(added_at,artistName,title,duration):",id,artists,name,album,duration)
        trackCounter++;
        tracksSection.innerHTML += 
        `<article id="${id}" class="track p-1 grid grid-cols-[50px_2fr_1fr_50px] gap-4 justify-items-start items-center hover:bg-light-black rounded-md">
        <p class="justify-self-center text-secondary">${trackCounter}</p>
        <section class="grid grid-cols-[auto_1fr] gap-4 place-items-center">
            <img src="${image.url}" alt="${title}" class="h-10 w-10 ">
            <article class="flex flex-col">
                <h2 class="text-primary text-xl">${title}</h2>
                <h3 class="text-secondary text-sm">${Array.from(artists,(artists)=>artists.name).join(", ")}</h3>
            </article>
        </section>
        <p class="text-secondary">${album.name}</p>
        <p class="text-secondary">${formatDuration(duration)}</p>
    </article>`
    }
    
}

const scrollEventHandler = (event) =>{
    let {scrollTop} = event.target;
    const header = document.querySelector(".header");
    if (scrollTop >= header.offsetHeight){
        header.classList.add("sticky","top-0","bg-dark","z-[2]")
        header.classList.remove("bg-transparent")
    } else {
        header.classList.remove("sticky","top-0","bg-dark","z-[2]")
        header.classList.add("bg-transparent")
    }
    if (history.state.type === SECTIONTYPE.PLAYLIST){
        const playlistHeader = document.getElementById('playlist-header')
        // console.log('playlistHeader',playlistHeader)
        if (scrollTop >= playlistHeader.offsetTop){
            console.log("playlistHeader.offsetTop:",playlistHeader.offsetTop)
            playlistHeader.classList.add("relative",`top-${header.offsetHeight}px`)
        } else {
            playlistHeader.classList.remove("relative",`top-${header.offsetHeight}px`)
        }
    }

}
const loadSection = (section) => {
    if (section.type === SECTIONTYPE.DASHBOARD){
        // section = {type: dashboard}
        fillDashboardMainContent()
        loadPlaylistSectionData()
    } else if (section.type === SECTIONTYPE.PLAYLIST){
        // section = {type: playlist}
        fillPlaylistItemContent(section.playlist)
        loadPlaylistTracks(section.playlist)  
    }
    document.querySelector(".content").removeEventListener("scroll",scrollEventHandler)
    document.querySelector(".content").addEventListener("scroll",scrollEventHandler)
}

document.addEventListener("DOMContentLoaded",()=>{
    loadUserProfile()
    const section = {type: SECTIONTYPE.DASHBOARD}
    history.pushState(section,"","")
    loadSection(section)
    // fillDashboardMainContent()
    // loadPlaylistSectionData()
    document.addEventListener("click", function(){
        if (!profileMenu.classList.contains("hidden")){
            profileMenu.classList.add("hidden");
        }
    })
    

})

window.addEventListener("popstate",function(event){
    // console.log("popstate event: ",event)
    // event.state = {type:dashboard}/{type:playlist}
    loadSection(event.state)
})