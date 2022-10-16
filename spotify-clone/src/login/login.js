// App uses Implicit Grant flow to access WEB APIs = https://developer.spotify.com/documentation/general/guides/authorization/implicit-grant/
// step1: authorise user by sending params: client_id, response_type, redirect_uri and scope to url - prompts if user is not logged in
// step2: after login and authorisation,  the final URL will contain a hash fragment with the following data encoded as a query string -access_token, token_type, expires_in and state.
// step2(i): If the user denies access, access token is not included and the final URL includes a query string containing the following parameters: error and state
// step4: redirect user to application passing access token
// step5: use access token in call web APIs which return JSON objects



const client_id = '278165e4182342b5864717c6ce165e8f'
const loginBtn = document.querySelector("#login-btn")
const scopes = 'user-top-read user-follow-read playlist-read-private user-library-read'
const redirect_uri= "http://localhost:8080/login/login.html"
const ACCESS_TOKEN_KEY = "accessToken"
const APP_URL = "http://localhost:8080"

const authorizeUser = () => {
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + client_id;
    url += '&scope=' + scopes;
    url += '&redirect_uri=' + redirect_uri;
    url += '&show_dialog=true';
    // new window for user to agree to terms and grant access
    window.open(url,"login","width=800,height=600");
}

document.addEventListener("DOMContentLoaded",function(){
    loginBtn.addEventListener("click",authorizeUser)
})

// If the user grants access, the final URL will contain a hash fragment with the following data encoded as a query string -access_token, token_type, expires_in and state.
// example - https://example.com/callback#access_token=NwAExz...BV3O2Tk&token_type=Bearer&expires_in=3600&state=123
// If the user denies access, access token is not included and the final URL includes a query string containing the following parameters: error and state
//  example - https://example.com/callback?error=access_denied&state=123


// helper function to set local storage
window.setItemsInLocalStorage = (accessToken, tokenType, expiresIn) =>{
    localStorage.setItem("accessToken",accessToken)
    localStorage.setItem("tokenType",tokenType)
    localStorage.setItem("expiresIn",expiresIn)
    // redirect window to dashboard
    window.location.href = APP_URL;
}

// step4:redirect user to application passing access token
window.addEventListener("load",function(){
    // if local storage has accesstoken coming from hash fragment on final load of url, redirect to user's dashboard
    const accessToken = this.localStorage.getItem(ACCESS_TOKEN_KEY)
    if (accessToken){
        window.location.href = `${APP_URL}/dashboard/dashboard.html`;
    }
    // incase acesss token is not there(i.e. first time obtaining URL so no local storage), and check if window pop is still exists - window.opener !-null, and if opened window is not closed !window.opener.closed 
    // The Window interface's opener property returns a reference to the window that opened the window
    if (window.opener != null && !window.opener.closed){
        window.focus();
        // check if this pop window contains error(will be contained in URL)
        if (window.location.href.includes("error")){
            this.window.close();
        }
        // if no error, hash will contain params to save into localstorage
        console.log("hash fragment: ",window.location.hash) // #access_token=BQA5HMJ1F3k7kKXjnX.....&token_type=Bearer&expires_in=3600
        // get all values from hash by parsing URL for parameters and store them in lcoal storage

        // The URLSearchParams interface defines utility methods to work with the query string of a URL.
        // URLSearchParams.get() - Returns the first value associated with the given search parameter.
        // window.location.hash returns a string that contains a # along with the fragment identifier of the URL. The fragment identifier of the URL starts with a # followed by an identifier that uniquely identifies a section in an HTML document.
        const hash = window.location.hash;
        const searchParameters = new URLSearchParams(hash)
        const accessToken = searchParameters.get("#access_token");
        const tokenType = searchParameters.get("token_type")
        const expiresIn =searchParameters.get("expires_in")
        if (accessToken){
            // if we have to accessToken, we can close pop Up now
            window.close()
            window.opener.console.log('got hash params successfully..',hash, accessToken,tokenType,expiresIn)
            // for the main window (which is opener for pop-up) - call function to set local storage
            window.opener.setItemsInLocalStorage(accessToken,tokenType,expiresIn)
        } else{
            window.close()
        }
    }
})