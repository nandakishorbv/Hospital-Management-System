// ======================================================
// HOSPITAL MANAGEMENT SYSTEM - APPOINTMENTS MODULE
// ======================================================

document.addEventListener("DOMContentLoaded", function () {
    loadAppointments();
    setupAppointmentModal();
});

/* ======================================================
   1. LOAD AND RENDER APPOINTMENTS
====================================================== */
function loadAppointments() {
    const tableBody = document.getElementById("appointmentsTableBody");
    const noAppointmentsMsg = document.getElementById("noAppointmentsMsg");

    if (!tableBody) return;

    const appointments = getItemFromStorage("hospitalAppointments");
    tableBody.innerHTML = "";

    if (appointments.length === 0) {
        if (noAppointmentsMsg) noAppointmentsMsg.style.display = "block";
        return;
    }

    if (noAppointmentsMsg) noAppointmentsMsg.style.display = "none";

    appointments.forEach(function (apt, index) {
        const row = document.createElement("tr");

        // Appointment ID
        const idCell = document.createElement("td");
        idCell.textContent = apt.appointmentId || apt.id || "APT00" + (index + 1);

        // Patient Name
        const patientCell = document.createElement("td");
        patientCell.textContent = apt.patientName || apt.patient || "-";

        // Doctor Name
        const doctorCell = document.createElement("td");
        doctorCell.textContent = apt.doctorName || apt.doctor || "-";

        // Department
        const deptCell = document.createElement("td");
        deptCell.textContent = apt.department || "-";

        // Date & Time
        const dateTimeCell = document.createElement("td");
        dateTimeCell.textContent = `${apt.date || ""} ${apt.time || ""}`;

        // Status
        const statusCell = document.createElement("td");
        const statusSpan = document.createElement("span");
        statusSpan.classList.add("status");
        const status = apt.status || "Pending";
        statusSpan.textContent = status;

        const statusLower = status.toLowerCase();
        if (statusLower === "confirmed" || statusLower === "completed") {
            statusSpan.classList.add("confirmed");
        } else if (statusLower === "pending") {
            statusSpan.classList.add("pending");
        } else if (statusLower === "cancelled") {
            statusSpan.classList.add("cancelled");
        }
        statusCell.appendChild(statusSpan);

        // Actions Cell (Edit Button)
        const actionCell = document.createElement("td");
        const editBtn = document.createElement("button");
        editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit`;
        editBtn.style.cssText = "padding: 6px 12px; background: #0284c7; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;";
        
        editBtn.addEventListener("click", function () {
            openEditModal(apt, index);
        });
        
        actionCell.appendChild(editBtn);

        // Append cells to row
        row.appendChild(idCell);
        row.appendChild(patientCell);
        row.appendChild(doctorCell);
        row.appendChild(deptCell);
        row.appendChild(dateTimeCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

/* ======================================================
   2. MODAL & FORM HANDLING (ADD / EDIT)
====================================================== */
let editingIndex = null;

function setupAppointmentModal() {
    const modal = document.getElementById("appointmentModal");
    const openBtn = document.getElementById("openAddAppointmentModal");
    const closeBtn = document.getElementById("closeAppointmentModal");
    const cancelBtn = document.getElementById("cancelAppointmentBtn");
    const form = document.getElementById("addAppointmentForm");

    if (!modal) return;

    if (openBtn) {
        openBtn.addEventListener("click", function () {
            editingIndex = null; // Reset for adding new
            document.querySelector("#appointmentModal h2").textContent = "Schedule New Appointment";
            form.reset();
            modal.style.display = "flex";
        });
    }

    function closeModal() {
        modal.style.display = "none";
        form.reset();
        editingIndex = null;
    }

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    // Handle Form Submit (Add or Update)
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const patientName = document.getElementById("modalPatientName").value;
        const doctorName = document.getElementById("modalDoctorName").value;
        const department = document.getElementById("modalDepartment").value;
        const date = document.getElementById("modalDate").value;
        const time = document.getElementById("modalTime").value;

        let appointments = getItemFromStorage("hospitalAppointments");

        if (editingIndex !== null) {
            // Update existing appointment
            appointments[editingIndex].patientName = patientName;
            appointments[editingIndex].patient = patientName;
            appointments[editingIndex].doctorName = doctorName;
            appointments[editingIndex].doctor = doctorName;
            appointments[editingIndex].department = department;
            appointments[editingIndex].date = date;
            appointments[editingIndex].time = time;
        } else {
            // Add new appointment
            const newId = "APT" + String(appointments.length + 1).padStart(3, '0');
            const newAppointment = {
                id: newId,
                appointmentId: newId,
                patientName: patientName,
                patient: patientName,
                doctorName: doctorName,
                doctor: doctorName,
                department: department,
                date: date,
                time: time,
                status: "Confirmed"
            };
            appointments.push(newAppointment);
        }

        // Save back to storage and refresh table
        localStorage.setItem("hospitalAppointments", JSON.stringify(appointments));
        localStorage.setItem("appointments", JSON.stringify(appointments));
        
        closeModal();
        loadAppointments();
    });
}

function openEditModal(apt, index) {
    editingIndex = index;
    const modal = document.getElementById("appointmentModal");
    
    document.querySelector("#appointmentModal h2").textContent = "Edit Appointment Details";
    
    document.getElementById("modalPatientName").value = apt.patientName || apt.patient || "";
    document.getElementById("modalDoctorName").value = apt.doctorName || apt.doctor || "";
    document.getElementById("modalDepartment").value = apt.department || "Cardiology";
    document.getElementById("modalDate").value = apt.date || "";
    document.getElementById("modalTime").value = apt.time || "";

    modal.style.display = "flex";
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