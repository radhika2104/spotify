# Spotify Clone

Spotify clone implemented using Spotify's API. 

🔗Live Link: [https://spotify-clone-rm.netlify.app/](https://spotify-clone-rm.netlify.app/)

## Features and App Design 💫

- Spotify API's have been used for:
  - Guest User Login with user's registered Email ID
  - Rendering User's personalised spotify playlists in side navigation bar
  - Displaying Featured and Top Playlists on Dashboard
  - Fetching Tracks, preview music and relevant data for all playlists
  
- Use of environment variables to encapsulate app configuration data in development and production
- Personalised playlists can be accessed through side navigation bar
- Navigation between playlist and dashboard through window's back button
- User Profile details access and Logout possible through Header
- For Each Track, album, artist, duration and its preview music is fetched inside playlist
- Controls given on currently playing track include pause, play, navigation of next and prev and volume control
- Local Storage used to keep user logged in for an hour and navigate between next,prev and current tracks
- Tablet/Desktop Responsive Design through use of Grid and Flexbox

## Technologies Used 🛠️
- Vanilla Javascript
- HTML
- CSS
- Tailwind
- Vite
- Netlify

## User Registeration
By default only those users which are allowed by developer in spotify's developer app's user access are allowed to access the app.To know more follow - https://developer.spotify.com/documentation/web-api/guides/development-extended-quota-modes
