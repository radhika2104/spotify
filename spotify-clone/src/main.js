import './style.css'


document.addEventListener("DOMContentLoaded", function() {
  const APP_URL = import.meta.env.VITE_APP_URL;
  if (localStorage.getItem("accessToken")) {
    console.log("have access token");
    window.location.href = `${APP_URL}/dashboard/dashboard.html`;
  } else {
    console.log("do not have access token");
    window.location.href = `${APP_URL}/login/login.html`;
  }
})


