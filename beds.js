document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
        DOM ELEMENTS
    ========================================== */
    const bedForm = document.getElementById("bedForm");
    const bedTableBody = document.getElementById("bedTableBody");
    const bedSearch = document.getElementById("bedSearch");
    const noBedsMessage = document.getElementById("noBedsMessage");
    const bedMessage = document.getElementById("bedMessage");
    const closeBedMessage = document.getElementById("closeBedMessage");

    // Summary Card Counters
    const totalBedsEl = document.getElementById("dashboardAvailableBeds");
    const availableBedsEl = document.getElementById("availableBeds");
    const occupiedBedsEl = document.getElementById("occupiedBeds");
    const maintenanceBedsEl = document.getElementById("maintenanceBeds");

    /* =========================================
        LOAD BEDS FROM LOCALSTORAGE
    ========================================== */
    let beds = [];
    try {
        beds = JSON.parse(localStorage.getItem("hospitalBeds")) || [];
    } catch (error) {
        console.error("Error reading hospitalBeds from localStorage:", error);
        beds = [];
    }

    /* =========================================
        DEFAULT INITIAL DATA
    ========================================== */
    if (beds.length === 0) {
        beds = [
            { id: "B001", ward: "General Ward", room: "G-101", type: "General", patient: "-", status: "Available" },
            { id: "B002", ward: "ICU", room: "ICU-01", type: "ICU", patient: "John Doe", status: "Occupied" },
            { id: "B003", ward: "Private Ward", room: "P-201", type: "Private", patient: "-", status: "Maintenance" },
            { id: "B004", ward: "Emergency Ward", room: "E-102", type: "Emergency", patient: "Jane Smith", status: "Occupied" }
        ];
        saveBeds();
    }

    /* =========================================
        SAVE TO LOCALSTORAGE
    ========================================== */
    function saveBeds() {
        localStorage.setItem("hospitalBeds", JSON.stringify(beds));
    }

    /* =========================================
        UPDATE STATISTICS
    ========================================== */
    function updateStatistics() {
        const total = beds.length;
        const available = beds.filter(b => String(b.status).toLowerCase() === "available").length;
        const occupied = beds.filter(b => String(b.status).toLowerCase() === "occupied").length;
        const maintenance = beds.filter(b => String(b.status).toLowerCase() === "maintenance").length;

        if (totalBedsEl) totalBedsEl.textContent = total;
        if (availableBedsEl) availableBedsEl.textContent = available;
        if (occupiedBedsEl) occupiedBedsEl.textContent = occupied;
        if (maintenanceBedsEl) maintenanceBedsEl.textContent = maintenance;
    }

    /* =========================================
        DISPLAY BEDS TABLE
    ========================================== */
    function displayBeds(searchText = "") {
        if (!bedTableBody) return;

        bedTableBody.innerHTML = "";
        const query = searchText.toLowerCase().trim();

        const filteredBeds = beds.filter(bed => {
            return (
                String(bed.id || "").toLowerCase().includes(query) ||
                String(bed.ward || "").toLowerCase().includes(query) ||
                String(bed.room || "").toLowerCase().includes(query) ||
                String(bed.patient || "").toLowerCase().includes(query) ||
                String(bed.status || "").toLowerCase().includes(query)
            );
        });

        if (filteredBeds.length === 0) {
            if (noBedsMessage) noBedsMessage.classList.add("show");
            return;
        }

        if (noBedsMessage) noBedsMessage.classList.remove("show");

        filteredBeds.forEach(bed => {
            const row = document.createElement("tr");

            // Define badge styling based on bed status
            const status = bed.status || "Available";
            let statusClass = "completed"; // Available (Green)
            if (status === "Occupied") statusClass = "confirmed"; // Red
            if (status === "Maintenance") statusClass = "pending"; // Yellow/Orange

            row.innerHTML = `
                <td>${bed.id || "-"}</td>
                <td>${bed.ward || "-"}</td>
                <td>${bed.room || "-"}</td>
                <td>${bed.type || "-"}</td>
                <td>${bed.patient && bed.patient.trim() !== "" ? bed.patient : "-"}</td>
                <td>
                    <span class="status ${statusClass}">
                        ${status}
                    </span>
                </td>
            `;

            bedTableBody.appendChild(row);
        });
    }

    /* =========================================
        ADD BED FORM SUBMISSION
    ========================================== */
    if (bedForm) {
        bedForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const getValue = (id) => {
                const el = document.getElementById(id);
                return el ? el.value.trim() : "";
            };

            const bedId = getValue("bedId").toUpperCase();
            const ward = getValue("bedWard");
            const room = getValue("bedRoom");
            const type = getValue("bedType");
            const status = getValue("bedStatus");
            let patient = getValue("bedPatient");

            // Check duplicate Bed ID
            const isDuplicate = beds.some(
                bed => String(bed.id || "").toLowerCase() === bedId.toLowerCase()
            );

            if (isDuplicate) {
                alert(`Bed ID "${bedId}" already exists. Please use a unique Bed ID.`);
                return;
            }

            // Force patient field logic based on status
            if (status === "Occupied" && !patient) {
                alert("Please enter a patient name for an Occupied bed.");
                return;
            }
            if (status !== "Occupied") {
                patient = "-";
            }

            const newBed = {
                id: bedId,
                ward: ward,
                room: room,
                type: type,
                status: status,
                patient: patient
            };

            beds.push(newBed);
            saveBeds();

            // Refresh view and reset form
            updateStatistics();
            displayBeds();
            bedForm.reset();

            // Show success modal
            if (bedMessage) {
                bedMessage.classList.add("show");
            }
        });
    }

    /* =========================================
        CLOSE POPUP HANDLER
    ========================================== */
    if (closeBedMessage) {
        closeBedMessage.addEventListener("click", function () {
            if (bedMessage) {
                bedMessage.classList.remove("show");
            }
        });
    }

    /* =========================================
        SEARCH FILTER HANDLER
    ========================================== */
    if (bedSearch) {
        bedSearch.addEventListener("input", function () {
            displayBeds(this.value);
        });
    }

    /* =========================================
        INITIAL LOAD
    ========================================== */
    updateStatistics();
    displayBeds();
});