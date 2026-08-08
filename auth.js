document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginMessage = document.getElementById("loginMessage");
    const loadingScreen = document.getElementById("loadingScreen");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            // 1. STOP THE DEFAULT FORM PAGE RELOAD
            e.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // 2. CHECK CREDENTIALS (You can change "admin" / "admin123" to anything you like)
            if (username === "admin" && password === "admin123") {
                
                // Display success message
                loginMessage.style.color = "#4ade80"; // Crisp Green
                loginMessage.textContent = "✓ Authentication successful!";

                // Show the smooth loading screen overlay
                if (loadingScreen) {
                    loadingScreen.style.display = "flex";
                }

                // Store a simple login token in localStorage
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("username", username);

                // 3. REDIRECT TO DASHBOARD AFTER 1.2 SECONDS
                setTimeout(function () {
                    window.location.href = "dashboard.html";
                }, 1200);

            } else {
                // Display error message
                loginMessage.style.color = "#f87171"; // Warm Red
                loginMessage.textContent = "Invalid username or password!";
            }
        });
    }
});