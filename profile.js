document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       1. INITIALIZE & LOAD ADMIN DATA
    ========================================== */
    const defaultAdmin = {
        name: "Administrator",
        role: "Hospital Admin",
        email: "admin@hospital.com",
        password: "admin123"
    };

    function getAdminData() {
        const stored = localStorage.getItem("hospitalAdmin");
        return stored ? JSON.parse(stored) : defaultAdmin;
    }

    function saveAdminData(data) {
        localStorage.setItem("hospitalAdmin", JSON.stringify(data));
        updateUI();
    }

    function updateUI() {
        const admin = getAdminData();

        const welcomeName = document.getElementById("welcomeAdminName");
        const headerName = document.getElementById("headerAdminName");
        const headerRole = document.getElementById("headerAdminRole");
        const dropdownName = document.getElementById("dropdownAdminName");
        const dropdownEmail = document.getElementById("dropdownAdminEmail");

        if (welcomeName) welcomeName.textContent = admin.name;
        if (headerName) headerName.textContent = admin.name;
        if (headerRole) headerRole.textContent = admin.role;
        if (dropdownName) dropdownName.textContent = admin.name;
        if (dropdownEmail) dropdownEmail.textContent = admin.email;
    }

    // Initialize UI on page load
    updateUI();

    /* =========================================
       2. TOGGLE DROPDOWN MENU
    ========================================== */
    const trigger = document.getElementById("adminProfileTrigger") || document.querySelector(".top-header .user-info");
    const dropdown = document.getElementById("profileDropdown");
    const container = document.querySelector(".admin-profile-container");

    if (trigger && dropdown) {
        trigger.addEventListener("click", function (e) {
            e.stopPropagation();
            dropdown.classList.toggle("show");
            if (container) container.classList.toggle("active");
        });

        // Close dropdown when clicking anywhere outside
        document.addEventListener("click", function (e) {
            if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove("show");
                if (container) container.classList.remove("active");
            }
        });
    }

    /* =========================================
       3. MODAL CONTROLS (VIEW / EDIT PROFILE)
    ========================================== */
    const profileModal = document.getElementById("profileModal");
    const btnViewProfile = document.getElementById("btnViewProfile");
    const closeProfileModal = document.getElementById("closeProfileModal");
    const cancelProfileBtn = document.getElementById("cancelProfileBtn");
    const adminProfileForm = document.getElementById("adminProfileForm");

    if (btnViewProfile && profileModal) {
        btnViewProfile.addEventListener("click", function (e) {
            e.preventDefault();
            if (dropdown) dropdown.classList.remove("show");

            const admin = getAdminData();
            const editName = document.getElementById("editAdminName");
            const editEmail = document.getElementById("editAdminEmail");
            const editRole = document.getElementById("editAdminRole");

            if (editName) editName.value = admin.name;
            if (editEmail) editEmail.value = admin.email;
            if (editRole) editRole.value = admin.role;

            profileModal.classList.add("show");
        });
    }

    const closeProfile = () => {
        if (profileModal) profileModal.classList.remove("show");
    };

    if (closeProfileModal) closeProfileModal.addEventListener("click", closeProfile);
    if (cancelProfileBtn) cancelProfileBtn.addEventListener("click", closeProfile);

    if (adminProfileForm) {
        adminProfileForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const admin = getAdminData();

            const nameVal = document.getElementById("editAdminName").value.trim();
            const emailVal = document.getElementById("editAdminEmail").value.trim();

            if (nameVal) admin.name = nameVal;
            if (emailVal) admin.email = emailVal;

            saveAdminData(admin);
            closeProfile();
        });
    }

    /* =========================================
       4. CHANGE PASSWORD LOGIC
    ========================================== */
    const passwordModal = document.getElementById("passwordModal");
    const btnChangePassword = document.getElementById("btnChangePassword");
    const closePasswordModal = document.getElementById("closePasswordModal");
    const cancelPasswordBtn = document.getElementById("cancelPasswordBtn");
    const changePasswordForm = document.getElementById("changePasswordForm");
    const passwordMsg = document.getElementById("passwordMsg");

    if (btnChangePassword && passwordModal) {
        btnChangePassword.addEventListener("click", function (e) {
            e.preventDefault();
            if (dropdown) dropdown.classList.remove("show");
            if (changePasswordForm) changePasswordForm.reset();
            if (passwordMsg) passwordMsg.textContent = "";
            passwordModal.classList.add("show");
        });
    }

    const closePassword = () => {
        if (passwordModal) passwordModal.classList.remove("show");
    };

    if (closePasswordModal) closePasswordModal.addEventListener("click", closePassword);
    if (cancelPasswordBtn) cancelPasswordBtn.addEventListener("click", closePassword);

    if (changePasswordForm) {
        changePasswordForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const admin = getAdminData();

            const currentPass = document.getElementById("currentPassword").value.trim();
            const newPass = document.getElementById("newPassword").value.trim();
            const confirmPass = document.getElementById("confirmPassword").value.trim();

            if (currentPass !== admin.password) {
                if (passwordMsg) {
                    passwordMsg.style.color = "#ef4444";
                    passwordMsg.textContent = "Current password is incorrect!";
                }
                return;
            }

            if (newPass.length < 6) {
                if (passwordMsg) {
                    passwordMsg.style.color = "#ef4444";
                    passwordMsg.textContent = "New password must be at least 6 characters!";
                }
                return;
            }

            if (newPass !== confirmPass) {
                if (passwordMsg) {
                    passwordMsg.style.color = "#ef4444";
                    passwordMsg.textContent = "New passwords do not mismatch!";
                }
                return;
            }

            admin.password = newPass;
            saveAdminData(admin);

            if (passwordMsg) {
                passwordMsg.style.color = "#10b981";
                passwordMsg.textContent = "Password updated successfully!";
            }

            setTimeout(closePassword, 1200);
        });
    }

    /* =========================================
       5. LOGOUT LOGIC
    ========================================== */
    function handleLogout(e) {
        if (e) e.preventDefault();
        localStorage.removeItem("isLoggedIn");
        window.location.href = "index.html";
    }

    const btnLogout = document.getElementById("btnLogout");
    const sidebarLogout = document.getElementById("sidebarLogout");

    if (btnLogout) btnLogout.addEventListener("click", handleLogout);
    if (sidebarLogout) sidebarLogout.addEventListener("click", handleLogout);

});