// =========================================
// DOCTOR MANAGEMENT SYSTEM
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // ELEMENTS
    // =========================================
    const doctorForm = document.getElementById("doctorForm");
    const doctorTableBody = document.getElementById("doctorTableBody");
    const doctorSearch = document.getElementById("doctorSearch");
    const noDoctorsMessage = document.getElementById("noDoctorsMessage");

    // =========================================
    // GET DOCTORS
    // =========================================
    function getDoctors() {
        try {
            return JSON.parse(localStorage.getItem("hospitalDoctors")) || [];
        } catch (error) {
            console.error("Error reading hospitalDoctors from localStorage:", error);
            return [];
        }
    }

    // =========================================
    // SAVE DOCTORS
    // =========================================
    function saveDoctors(doctors) {
        localStorage.setItem("hospitalDoctors", JSON.stringify(doctors));
    }

    // =========================================
    // DISPLAY DOCTORS
    // =========================================
    function displayDoctors() {
        if (!doctorTableBody) {
            return;
        }

        const doctors = getDoctors();
        const searchValue = doctorSearch
            ? doctorSearch.value.toLowerCase().trim()
            : "";

        doctorTableBody.innerHTML = "";

        const filteredDoctors = doctors.filter(function (doctor) {
            if (searchValue === "") {
                return true;
            }

            const id = (doctor.id || "").toLowerCase();
            const name = (doctor.name || "").toLowerCase();
            const specialization = (doctor.specialization || "").toLowerCase();
            const department = (doctor.department || "").toLowerCase();

            return (
                id.includes(searchValue) ||
                name.includes(searchValue) ||
                specialization.includes(searchValue) ||
                department.includes(searchValue)
            );
        });

        // =====================================
        // EMPTY MESSAGE
        // =====================================
        if (filteredDoctors.length === 0) {
            if (noDoctorsMessage) {
                noDoctorsMessage.style.display = "block";
            }
            return;
        }

        if (noDoctorsMessage) {
            noDoctorsMessage.style.display = "none";
        }

        // =====================================
        // CREATE ROWS
        // =====================================
        filteredDoctors.forEach(function (doctor) {
            const row = document.createElement("tr");

            // Doctor ID
            const idCell = document.createElement("td");
            idCell.textContent = doctor.id || "-";

            // Name
            const nameCell = document.createElement("td");
            nameCell.textContent = doctor.name || "-";

            // Specialization
            const specializationCell = document.createElement("td");
            specializationCell.textContent = doctor.specialization || "-";

            // Department
            const departmentCell = document.createElement("td");
            departmentCell.textContent = doctor.department || "-";

            // Phone
            const phoneCell = document.createElement("td");
            phoneCell.textContent = doctor.phone || "-";

            // Experience
            const experienceCell = document.createElement("td");
            experienceCell.textContent = doctor.experience
                ? doctor.experience + " years"
                : "-";

            // Status
            const statusCell = document.createElement("td");
            const statusSpan = document.createElement("span");

            statusSpan.classList.add("status");
            const status = doctor.status || "Unavailable";
            statusSpan.textContent = status;

            if (status === "Available") {
                statusSpan.classList.add("confirmed");
            } else {
                statusSpan.classList.add("pending");
            }

            statusCell.appendChild(statusSpan);

            // Add cells to row
            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(specializationCell);
            row.appendChild(departmentCell);
            row.appendChild(phoneCell);
            row.appendChild(experienceCell);
            row.appendChild(statusCell);

            doctorTableBody.appendChild(row);
        });
    }

    // =========================================
    // UPDATE STATISTICS
    // =========================================
    function updateDoctorStatistics() {
        const doctors = getDoctors();

        // Support multiple possible element IDs across different HTML templates
        const totalDoctors = document.getElementById("dashboardTotalDoctors") || 
                             document.getElementById("totalDoctorsCount") || 
                             document.getElementById("totalDoctors");
        
        const availableDoctors = document.getElementById("availableDoctors");
        const unavailableDoctors = document.getElementById("unavailableDoctors");
        const doctorDepartments = document.getElementById("doctorDepartments");

        // TOTAL
        if (totalDoctors) {
            totalDoctors.textContent = doctors.length;
        }

        // AVAILABLE
        const available = doctors.filter(function (doctor) {
            return String(doctor.status || "").toLowerCase() === "available";
        }).length;

        if (availableDoctors) {
            availableDoctors.textContent = available;
        }

        // UNAVAILABLE
        const unavailable = doctors.filter(function (doctor) {
            return String(doctor.status || "").toLowerCase() !== "available";
        }).length;

        if (unavailableDoctors) {
            unavailableDoctors.textContent = unavailable;
        }

        // UNIQUE DEPARTMENTS
        const departments = new Set(
            doctors
                .map(function (doctor) {
                    return doctor.department;
                })
                .filter(Boolean)
        );

        if (doctorDepartments) {
            doctorDepartments.textContent = departments.size;
        }
    }

    // =========================================
    // ADD DOCTOR
    // =========================================
    if (doctorForm) {
        doctorForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const getValue = function (id) {
                const el = document.getElementById(id);
                return el ? el.value.trim() : "";
            };

            const doctor = {
                id: getValue("doctorId"),
                name: getValue("doctorName"),
                specialization: getValue("specialization"),
                department: getValue("doctorDepartment"),
                phone: getValue("doctorPhone"),
                email: getValue("doctorEmail"),
                experience: getValue("doctorExperience"),
                status: getValue("doctorStatus"),
                createdDate: new Date().toISOString()
            };

            const doctors = getDoctors();

            // DUPLICATE ID CHECK
            const duplicate = doctors.some(function (existingDoctor) {
                return (
                    (existingDoctor.id || "").toLowerCase() ===
                    doctor.id.toLowerCase()
                );
            });

            if (duplicate) {
                showDoctorMessage(
                    "Doctor ID Already Exists",
                    "A doctor with this ID already exists. Please use a different Doctor ID."
                );
                return;
            }

            // SAVE DOCTOR
            doctors.push(doctor);
            saveDoctors(doctors);

            // UPDATE PAGE
            displayDoctors();
            updateDoctorStatistics();

            // SUCCESS MESSAGE
            showDoctorMessage(
                "Doctor Added Successfully",
                doctor.name + " has been successfully registered."
            );

            // RESET FORM
            doctorForm.reset();
        });
    }

    // =========================================
    // SEARCH
    // =========================================
    if (doctorSearch) {
        doctorSearch.addEventListener("input", function () {
            displayDoctors();
        });
    }

    // =========================================
    // SUCCESS POPUP
    // =========================================
    function showDoctorMessage(title, text) {
        const message = document.getElementById("doctorMessage");
        const messageTitle = document.getElementById("doctorMessageTitle");
        const messageText = document.getElementById("doctorMessageText");

        if (!message || !messageTitle || !messageText) {
            return;
        }

        messageTitle.textContent = title;
        messageText.textContent = text;
        message.classList.add("show");
    }

    // =========================================
    // CLOSE POPUP
    // =========================================
    const closeDoctorMessage = document.getElementById("closeDoctorMessage");
    if (closeDoctorMessage) {
        closeDoctorMessage.addEventListener("click", function () {
            const message = document.getElementById("doctorMessage");
            if (message) {
                message.classList.remove("show");
            }
        });
    }

    // =========================================
    // INITIAL LOAD
    // =========================================
    displayDoctors();
    updateDoctorStatistics();
});