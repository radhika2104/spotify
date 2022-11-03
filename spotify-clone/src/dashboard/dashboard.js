import { ENDPOINT, SECTIONTYPE } from "../common"
import { fetchRequest } from "../api"
import { logout } from "../common";

// const controller = new AbortController();
// const signal = controller.signal;

const audio = new Audio()
const nowPlayingPlayBtn = document.getElementById('play')

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
    `<header id="playlist-header" class="mx-8 py-4 border-secondary border-b-[0.5px] z-10">
    <nav  class="py-2">
       <ul class="grid grid-cols-[50px_1fr_1fr_50px]  justify-start items-center gap-4 text-secondary">
            <li class="justify-self-center">#</li>
            <li>TITLE</li>
            <li>ALBUM</li>
            <li>🕑</li>
       </ul> 
    </nav>
    </header>
    <section id="tracks" class="px-8 mt-4"></section>`;

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
const trackClickHandler = (event) => {
    console.log("function call countsss 128:: ", event.target)
    document.querySelectorAll(".track").forEach(trackItem =>{
        if (trackItem.id === event.target.id || trackItem.contains(event.target)){
            trackItem.classList.add("bg-gray", "selected")
            // trackItem.querySelector(".track-no").style.visibility = 'hidden'
            // trackItem.querySelector(".play").style.visibility = 'visible'
            // trackItem.querySelector(".album").style.color = 'text-primary'
            // trackItem.querySelector(".artist").style.color = 'text-primary'
        } else {
            trackItem.classList.remove("bg-gray", "selected")
            // trackItem.querySelector(".track-no").style.visibility = 'visible'
            // trackItem.querySelector(".play").style.visibility = 'hidden'

            // trackItem.querySelector(".album").style.color = 'text-secondary'
            // trackItem.querySelector(".artist").style.color = 'text-secondary'
        }

        if (trackItem.contains(event.target) && event.target.classList.contains("play")){
            // console.log("consoling event from 147:", event)
            // didnt understand the use of stop propagation to keep selection!
            // if (event?.stopPropagation){ 
            //     event.stopPropagation()
            // }
            playTrackHandler(event.target)
        }
    })
}

function updateIconsForPlayMode(selectedTrackID){
    
    nowPlayingPlayBtn.textContent = "pause_circle"
    const playBtnFromTracks = document.querySelector(`#play-track-${selectedTrackID}`);
    // console.log("logging eventTarget:",eventTarget)
    // eventTarget.innerHTML = `<span class="material-symbols-outlined">
    // pause
    // </span>`
    if (playBtnFromTracks){
        playBtnFromTracks.textContent = "pause"
    }
    
    // playBtnFromTracks.setAttribute("data-play","true")

}

function updateIconsForPauseMode(selectedTrackID){
    
    nowPlayingPlayBtn.textContent = "play_circle"
    // eventTarget.innerHTML = ""
    // eventTarget.textContent = "▶"
    const playBtnFromTracks = document.querySelector(`#play-track-${selectedTrackID}`);
    // eventTarget.textContent = "play_arrow"
    if (playBtnFromTracks){
        playBtnFromTracks.textContent = "play_arrow"
    }
    
}

function onSongDataLoaded(){
    const totalSongDuration = document.getElementById('total-song-duration')
    // console.log("duration coming from meta data loaded:",audio.duration)
    const durationInSecondsString = `0:${audio.duration.toFixed(0)}`
    // console.log("durationInSecondsString:",durationInSecondsString)
    totalSongDuration.textContent = durationInSecondsString
    
}

// function onNowPlayingPlayBtnClick(eventTarget){
//     if (audio.paused){
//         audio.play()
//         updateIconsForPlayMode(eventTarget)
//     } else {
//         audio.pause()
//         updateIconsForPauseMode(eventTarget)
        
//     }

// }

function togglePlay(){
    if (audio.src){
        if (audio.paused){
            audio.play()
            
        } else {
            audio.pause()
            
        }

    }
}

function playTrackHandler(eventTarget){
    // const btnWithDataPlay = document.querySelector("[data-play='true']")
    // console.log("playBtnTrackDetails:: ", eventTarget)
    const playBtnTrackDetails = eventTarget.attributes.trackdetails.value;
    // console.log("playBtnTrackDetails:: ", playBtnTrackDetails)
    const [imageURL,artistNames,title,duration,id,previewURL] = playBtnTrackDetails.split("@,")
    console.log("line 222 audio.src and previewurl:",audio.src, previewURL)
    if (audio?.src === previewURL){
        togglePlay()
        
    } else {
        // document.querySelectorAll("[data-play]").forEach(btn=>btn.setAttribute("data-play","false"))
        // btnWithDataPlay?.setAttribute("data-play","false")
        // console.log("hello")
        const nowPlayingSongEl = document.getElementById('now-playing-song');
        const nowPlayingArtistEl = document.getElementById('now-playing-artists');
        const nowPlayingImageEl = document.getElementById('now-playing-image');
        const audioControl = document.getElementById('audio-control')
        // console.log("check audio",audioControl)
        audioControl.setAttribute("data-track-id",id);
        // console.log("auudio 235")
        nowPlayingImageEl.src = imageURL
        nowPlayingArtistEl.textContent = artistNames
        nowPlayingSongEl.textContent = title
        audio.src = previewURL;
        // console.log("line 238 audio.src:",audio.src)
        audio.play()
        // console.log("auudio play?")
    }

}

const loadPlaylistTracks = async (playlist_id) => {
    // endpoint - 	https://api.spotify.com/v1/playlists/{playlist_id}/tracks
    // playlistTracks: "playlists/{playlist_id}/tracks"
    const tracksSection = document.getElementById('tracks');
    const playlistTracksData = await fetchRequest(`${ENDPOINT.playlists}/${playlist_id}`)
    console.log("playlistTracksData:" ,playlistTracksData)
    const coverElement = document.querySelector("#cover-content");
    coverElement.innerHTML =    `<section class="grid grid-cols-[auto_1fr] gap-4 pt-18">
            <img src="${playlistTracksData.images[0].url}" alt="" class="object-contain h-44 w-44">
            <section>
                <small>PLAYLIST</small>
                <h2 id="playlist-name" class="text-4xl">${playlistTracksData.name}</h2>
                <p id="playlist-details">${playlistTracksData.tracks.items.length} songs</p>
            </section>
        </section>`
    // data to be fetched, index,title,artist names, album,date added, length of song
    const trackItems = playlistTracksData.tracks.items;
    // console.log("track items:" ,trackItems)
    let trackCounter = 0
    for (let trackItem of trackItems){
        // const {track:{id,artists:[{name:artistName}],name:title,album:{name:albumName},duration_ms:duration}} = trackItem;
        const {track:{id,artists,name:title,album,duration_ms:duration,preview_url:previewURL}} = trackItem;
        // console.log("album and artist object :",album, artists)
        let image = album.images.find(img=>img.height===64)
        let artistNames = Array.from(artists,(artists)=>artists.name).join(", ")
        // console.log("printing object of items(added_at,artistName,title,duration):",id,artists,name,album,duration)
        trackCounter++;
        tracksSection.innerHTML += 
        `<article id="${id}" class="track p-1 grid grid-cols-[50px_1fr_1fr_50px] gap-4 justify-items-start items-center hover:bg-light-black  rounded-md">
        <p class="relative w-full flex items-center justify-center text-secondary">
        <span class="track-no">${trackCounter}</span>
        <button trackdetails="${image.url}@,${artistNames}@,${title}@,${duration}@,${id}@,${previewURL}" id="play-track-${id}" class="play absolute w-full invisible text-primary material-symbols-outlined">play_arrow</button>
        </p>
        <section class="grid grid-cols-[auto_1fr] gap-4 place-items-center">
            <img src="${image.url}" alt="${title}" class="h-10 w-10">
            <article class="flex flex-col gap-2 justify-center">
                <h2 class="song-title text-primary text-base line-clamp-1">${title}</h2>
                <h3 class="artist text-secondary text-xs line-clamp-1">${artistNames}</h3>
            </article>
        </section>
        <p class="album text-secondary text-sm">${album.name}</p>
        <p class="text-secondary text-sm">${formatDuration(duration)}</p>
        </article>`;
        
    }
    tracksSection.addEventListener("click", trackClickHandler)
    
}

const scrollEventHandler = (event) =>{
    let {scrollTop} = event.target;
    const header = document.querySelector(".header");
    if (scrollTop >= header.offsetHeight){
        header.classList.add("sticky","top-0","bg-black","z-[2]")
        header.classList.remove("bg-transparent")
    } else {
        header.classList.remove("sticky","top-0","bg-black","z-[2]")
        header.classList.add("bg-transparent")
    }
    if (history.state.type === SECTIONTYPE.PLAYLIST){
        const playlistHeader = document.getElementById('playlist-header')
        const coverContent = document.querySelector('#cover-content')
        // console.log('playlistHeader',playlistHeader)
        if (scrollTop >= (coverContent.offsetHeight - header.offsetHeight)){
            // console.log("playlistHeader.offsetTop:",playlistHeader.offsetTop)
            playlistHeader.classList.add("sticky", "bg-black-secondary","px-8")
            playlistHeader.classList.remove("mx-8")
            playlistHeader.style.top = `${header.offsetHeight}px`
        } else {
            playlistHeader.classList.remove("sticky", "bg-black-secondary","px-8")
            playlistHeader.classList.add("mx-8")
            playlistHeader.style.top = `revert`
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
        // let tracksArray = document.querySelector("#tracks").childNodes
        // console.log("tracksArrays::",tracksArray)
        // for (let trackItem in tracksArray){
        //     console.log("trackitem in tracksArray::",tracksArray[trackItem])
        //     const playBtn= tracksArray[trackItem].querySelector(".play")
        //     console.log("playBtn inside a trackitem in tracksArray::",playBtn)
        //     playBtn.addEventListener("click", playTrackHandler)
        // }
        
    }
    document.querySelector(".content").removeEventListener("scroll",scrollEventHandler)
    document.querySelector(".content").addEventListener("scroll",scrollEventHandler)
}

document.addEventListener("DOMContentLoaded",()=>{
    
    const nowPlayingProgress = document.getElementById('progress')
    const songDurationCompleted = document.getElementById('song-duration-completed')
    const audioControl = document.getElementById('audio-control')
    const volume = document.getElementById('volume')
    const timeline = document.getElementById('timeline')
    let progressInterval;
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

    audio.addEventListener("play", ()=>{
        const selectedTrackID = audioControl.getAttribute("data-track-id");
        console.log("selectedTrackID", selectedTrackID)
        const tracksSection = document.getElementById('tracks');
        const playingTrack = tracksSection?.querySelector("article.playing");
        const selectedTrack = tracksSection?.querySelector(`[id="${selectedTrackID}"]`)
        console.log('playingTrack,selectedTrack:',playingTrack,selectedTrack)
        if (playingTrack !== null && playingTrack?.id !== selectedTrack?.id){
            playingTrack.classList.remove("playing")
            console.log("playing track and selected track not same. so remove green from playing and add to selected")
        } else {
            console.log("playing track and selected track same. so let green")
        }
        selectedTrack?.classList.add("playing")
        console.log("selectedTrack: ", selectedTrack)
        progressInterval = setInterval(() =>{
            if (audio.paused){
                return
            } 
            let currentSongTime = `${audio.currentTime.toFixed(0)<10 ? "0:0" + audio.currentTime.toFixed(0): "0:" + audio.currentTime.toFixed(0)}`
            songDurationCompleted.textContent = currentSongTime;
            nowPlayingProgress.style.width = `${(audio.currentTime/audio.duration)*100}%`;
        } ,100);
        updateIconsForPlayMode(selectedTrackID)
    })

    audio.addEventListener("pause",()=>{
        const selectedTrackID = audioControl.getAttribute("data-track-id");
        if (progressInterval) {
            clearInterval(progressInterval)
            
        }
        updateIconsForPauseMode(selectedTrackID)
    })
    
    audio.addEventListener("loadedmetadata",onSongDataLoaded)
    nowPlayingPlayBtn.addEventListener("click",togglePlay)

    volume.addEventListener("change",()=>{
        console.log("volume.value",volume.value);
        audio.volume = volume.value/100;
    })

    timeline.addEventListener("click", function(event){
        const timelineWidth = window.getComputedStyle(timeline).width
        const timeToSeek = (event.offsetX/parseInt(timelineWidth))*audio.duration
        audio.currentTime = timeToSeek;
        nowPlayingProgress.style.width = `${(audio.currentTime/audio.duration)*100}%`;
    })
})

window.addEventListener("popstate",function(event){
    // console.log("popstate event: ",event)
    // event.state = {type:dashboard}/{type:playlist}
    loadSection(event.state)
})