if (localStorage.getItem("logged") !== "true") {
    window.location.href = "login.html";
}

function logout() {
    localStorage.removeItem("logged");
    window.location.href = "login.html";
}