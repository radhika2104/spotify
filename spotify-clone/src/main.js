import './style.css'


document.addEventListener("DOMContentLoaded", function() {
  if (localStorage.getItem("accessToken")) {
    console.log("have access token");
    window.location.href = "dashboard/dashboard.html";
  } else {
    console.log("do not have access token");
    window.location.href = "login/login.html";
  }
})


