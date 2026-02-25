function login() {
    var user = document.getElementById("user").value;
    var pass = document.getElementById("pass").value;
    var error = document.getElementById("error");

    var users = localStorage.getItem("users");

    if (users) {
        users = JSON.parse(users);
    } else {
        users = [];
    }

    var acceso = false;

    for (var i = 0; i < users.length; i++) {
        if (users[i].user === user && users[i].pass === pass) {
            acceso = true;
        }
    }

    if (acceso) {
        localStorage.setItem("token", "activo");
        localStorage.setItem("currentUser", user);
        window.location.href = "dashboard.html";
    } else {
        error.textContent = "Credenciales incorrectas";
    }
}