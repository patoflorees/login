var token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

var headerContainer = document.getElementById("headerContainer");
var footerContainer = document.getElementById("footerContainer");

fetch("header.html")
.then(function(res) {
    return res.text();
})
.then(function(data) {
    headerContainer.innerHTML = data;

    var user = localStorage.getItem("currentUser");
    if (user) {
        document.getElementById("userSection").textContent = "Usuario: " + user;
    }
});

fetch("footer.html")
.then(function(res) {
    return res.text();
})
.then(function(data) {
    footerContainer.innerHTML = data;
});

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}