// =========================================
// PATIENT MANAGEMENT MODULE
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    const patientTableBody = document.getElementById("patientTableBody");
    const totalPatients = document.getElementById("totalPatients");
    const newPatients = document.getElementById("newPatients");
    const admittedPatients = document.getElementById("admittedPatients");
    const dischargedPatients = document.getElementById("dischargedPatients");
    const patientSearch = document.getElementById("patientSearch");
    const noPatientsMessage = document.getElementById("noPatientsMessage");
    const filterCards = document.querySelectorAll(".patient-filter-card");

    let currentStatusFilter = "All";

    /* =========================================
       LOAD PATIENTS FROM LOCAL STORAGE
    ========================================== */
    let patients = [];
    try {
        patients = JSON.parse(localStorage.getItem("hospitalPatients")) || [];
    } catch (e) {
        console.error("Error loading patients from localStorage:", e);
        patients = [];
    }

    /* =========================================
       DISPLAY PATIENTS
    ========================================== */
    function displayPatients(data) {
        if (!patientTableBody) return;

        patientTableBody.innerHTML = "";

        if (!data || data.length === 0) {
            if (noPatientsMessage) noPatientsMessage.style.display = "block";
            return;
        }

        if (noPatientsMessage) noPatientsMessage.style.display = "none";

        data.forEach(function (patient) {
            const row = document.createElement("tr");

            // Format status badge CSS class
            let statusClass = "status";
            const pStatus = patient.status || "Active";
            
            if (pStatus === "Active" || pStatus === "New") {
                statusClass += " confirmed";
            } else if (pStatus === "Admitted") {
                statusClass += " pending";
            } else if (pStatus === "Discharged") {
                statusClass += " completed";
            }

            row.innerHTML = `
                <td>${patient.id || "N/A"}</td>
                <td>${patient.name || "N/A"}</td>
                <td>${patient.age || "N/A"}</td>
                <td>${patient.gender || "N/A"}</td>
                <td>${patient.bloodGroup || patient.blood || "N/A"}</td>
                <td>${patient.department || "N/A"}</td>
                <td>
                    <span class="${statusClass}">
                        ${pStatus}
                    </span>
                </td>
                <td>
                    <button class="btn-view" onclick="viewPatient('${patient.id}')">
                        View
                    </button>
                </td>
            `;

            patientTableBody.appendChild(row);
        });
    }

    /* =========================================
       UPDATE STATISTICS
    ========================================== */
    function updateStatistics() {
        if (totalPatients) totalPatients.textContent = patients.length;

        if (newPatients) {
            newPatients.textContent = patients.filter(
                (p) => p.status === "New" || p.status === "Active"
            ).length;
        }

        if (admittedPatients) {
            admittedPatients.textContent = patients.filter(
                (p) => p.status === "Admitted"
            ).length;
        }

        if (dischargedPatients) {
            dischargedPatients.textContent = patients.filter(
                (p) => p.status === "Discharged"
            ).length;
        }
    }

    /* =========================================
       FILTER & SEARCH COMBINED LOGIC
    ========================================== */
    function filterAndRender() {
        const searchValue = patientSearch ? patientSearch.value.toLowerCase().trim() : "";

        const filtered = patients.filter(function (patient) {
            const pName = (patient.name || "").toLowerCase();
            const pId = (patient.id || "").toLowerCase();
            const pDept = (patient.department || "").toLowerCase();
            const pStatus = patient.status || "Active";

            // Search query check
            const matchesSearch = pName.includes(searchValue) || pId.includes(searchValue) || pDept.includes(searchValue);

            // Filter card check
            let matchesFilter = true;
            if (currentStatusFilter === "New") {
                matchesFilter = (pStatus === "New" || pStatus === "Active");
            } else if (currentStatusFilter === "Admitted") {
                matchesFilter = (pStatus === "Admitted");
            } else if (currentStatusFilter === "Discharged") {
                matchesFilter = (pStatus === "Discharged");
            }

            return matchesSearch && matchesFilter;
        });

        displayPatients(filtered);
    }

    /* =========================================
       SEARCH INPUT LISTENER
    ========================================== */
    if (patientSearch) {
        patientSearch.addEventListener("input", filterAndRender);
    }

    /* =========================================
       FILTER CARD CLICK LISTENERS
    ========================================== */
    filterCards.forEach(function (card) {
        card.addEventListener("click", function () {
            filterCards.forEach((c) => c.classList.remove("active-card"));
            this.classList.add("active-card");

            currentStatusFilter = this.getAttribute("data-filter") || "All";
            filterAndRender();
        });
    });

    /* =========================================
       VIEW PATIENT DETAILS (ID-BASED)
    ========================================== */
    window.viewPatient = function (patientId) {
        const selected = patients.find((p) => String(p.id) === String(patientId));

        if (selected) {
            localStorage.setItem("selectedPatient", JSON.stringify(selected));
            window.location.href = "patient-details.html";
        } else {
            alert("Patient details not found.");
        }
    };

    /* =========================================
       INITIAL LOAD
    ========================================== */
    displayPatients(patients);
    updateStatistics();
});