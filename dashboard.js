// ======================================================
// HOSPITAL MANAGEMENT SYSTEM - DASHBOARD MODULE
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    // Initialize all dashboard functions
    initLiveClock();
    loadDashboardMetrics();
    loadRecentAppointments();
    setupCardNavigation();

});

/* ======================================================
   1. LIVE DATE & TIME CLOCK
====================================================== */
function initLiveClock() {
    const currentDateEl = document.getElementById("currentDate");
    const currentTimeEl = document.getElementById("currentTime");

    function updateClock() {
        const now = new Date();

        // Format Date (e.g., "Friday, 07 Aug 2026")
        if (currentDateEl) {
            currentDateEl.textContent = now.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
        }

        // Format Time (e.g., "06:03:02 PM")
        if (currentTimeEl) {
            currentTimeEl.textContent = now.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            });
        }
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/* ======================================================
   2. DASHBOARD METRICS & SUMMARY CARDS
====================================================== */
function loadDashboardMetrics() {
    // Total Patients
    const totalPatientsEl = document.getElementById("dashboardTotalPatients");
    if (totalPatientsEl) {
        const patients = getItemFromStorage("hospitalPatients");
        totalPatientsEl.textContent = patients.length;
    }

    // Total Doctors
    const totalDoctorsEl = document.getElementById("dashboardTotalDoctors");
    if (totalDoctorsEl) {
        const doctors = getItemFromStorage("hospitalDoctors");
        totalDoctorsEl.textContent = doctors.length;
    }

    // Appointments Count
    const appointmentCountEl = document.getElementById("dashboardAppointmentCount");
    if (appointmentCountEl) {
        const appointments = getItemFromStorage("hospitalAppointments");
        appointmentCountEl.textContent = appointments.length;
    }

    // Available Beds Count
    const availableBedsEl = document.getElementById("dashboardAvailableBeds");
    if (availableBedsEl) {
        const beds = getItemFromStorage("hospitalBeds");
        // Count beds marked as "Available" or fallback to available count property
        const availableCount = beds.length > 0 
            ? beds.filter(bed => String(bed.status || "").toLowerCase() === "available").length 
            : 0;
        availableBedsEl.textContent = availableCount;
    }
}

/* ======================================================
   3. RECENT APPOINTMENTS TABLE
====================================================== */
function loadRecentAppointments() {
    const tableBody = document.getElementById("dashboardAppointmentTableBody");
    const noAppointmentsMsg = document.getElementById("dashboardNoAppointments");

    if (!tableBody) return;

    const appointments = getItemFromStorage("hospitalAppointments");
    tableBody.innerHTML = "";

    if (appointments.length === 0) {
        if (noAppointmentsMsg) noAppointmentsMsg.style.display = "block";
        return;
    }

    if (noAppointmentsMsg) noAppointmentsMsg.style.display = "none";

    // Sort appointments: newest first
    const sortedAppointments = [...appointments].reverse().slice(0, 5);

    sortedAppointments.forEach(function (appointment) {
        const row = document.createElement("tr");

        // Patient Cell
        const patientCell = document.createElement("td");
        patientCell.textContent = appointment.patientName || appointment.patient || "-";

        // Doctor Cell
        const doctorCell = document.createElement("td");
        doctorCell.textContent = appointment.doctor || "-";

        // Department Cell
        const departmentCell = document.createElement("td");
        departmentCell.textContent = appointment.department || "-";

        // Status Cell
        const statusCell = document.createElement("td");
        const statusSpan = document.createElement("span");
        statusSpan.classList.add("status");

        const status = appointment.status || "Pending";
        statusSpan.textContent = status;

        // Apply status styles
        const statusLower = status.toLowerCase();
        if (statusLower === "confirmed" || statusLower === "completed") {
            statusSpan.classList.add("confirmed");
        } else if (statusLower === "pending") {
            statusSpan.classList.add("pending");
        } else if (statusLower === "cancelled") {
            statusSpan.classList.add("cancelled");
        }

        statusCell.appendChild(statusSpan);

        // Append cells to row
        row.appendChild(patientCell);
        row.appendChild(doctorCell);
        row.appendChild(departmentCell);
        row.appendChild(statusCell);

        tableBody.appendChild(row);
    });
}

/* ======================================================
   4. INTERACTIVE CARD NAVIGATION
====================================================== */
function setupCardNavigation() {
    const cardRoutes = {
        "patientsCard": "patients.html",
        "doctorsCard": "doctors.html",
        "appointmentsCard": "appointments.html",
        "bedsCard": "beds.html"
    };

    Object.keys(cardRoutes).forEach(function (cardId) {
        const cardEl = document.getElementById(cardId);
        if (cardEl) {
            cardEl.style.cursor = "pointer";
            // Using capture phase and stopPropagation to ensure clean direct routing without interference
            cardEl.addEventListener("click", function (event) {
                event.stopPropagation();
                window.location.href = cardRoutes[cardId];
            }, true);
        }
    });
}

/* ======================================================
   HELPER FUNCTIONS
====================================================== */
function getItemFromStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        console.error("Error reading " + key + " from localStorage:", error);
        return [];
    }
}