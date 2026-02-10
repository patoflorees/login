function login() {
    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;
    const error = document.getElementById("error");

    // Usuario y contraseña
    if (user === "admin" && pass === "1234") {
        localStorage.setItem("logged", "true");
        window.location.href = "dashboard.html";
    } else {
        error.textContent = "Usuario o contraseña incorrectos";
    }
}
