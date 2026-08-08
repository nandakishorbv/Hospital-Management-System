document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
        DOM ELEMENTS
    ========================================== */
    const billingForm = document.getElementById("billingForm");
    const billingTableBody = document.getElementById("billingTableBody");
    const billSearch = document.getElementById("billSearch");
    const noBillsMessage = document.getElementById("noBillsMessage");
    const billingMessage = document.getElementById("billingMessage");
    const closeBillingMessage = document.getElementById("closeBillingMessage");

    // Summary Card Counters
    const totalBillsEl = document.getElementById("totalBills");
    const totalBilledEl = document.getElementById("totalBilled");
    const paidAmountEl = document.getElementById("paidAmount");
    const pendingAmountEl = document.getElementById("pendingAmount");

    /* =========================================
        LOAD BILLS FROM LOCALSTORAGE
    ========================================== */
    let bills = [];
    try {
        bills = JSON.parse(localStorage.getItem("hospitalBills")) || [];
    } catch (error) {
        console.error("Error loading hospitalBills from localStorage:", error);
        bills = [];
    }

    /* =========================================
        DEFAULT INITIAL DATA
    ========================================== */
    if (bills.length === 0) {
        bills = [
            { id: "BILL001", patient: "Rajesh Sharma", patientId: "P001", doctor: "Dr. Ananya Rao", service: "Consultation", amount: 800, date: "2026-03-01", status: "Paid" },
            { id: "BILL002", patient: "Priya Patel", patientId: "P002", doctor: "Dr. Vikram Singh", service: "Laboratory Test", amount: 2500, date: "2026-03-02", status: "Pending" },
            { id: "BILL003", patient: "Amit Verma", patientId: "P003", doctor: "Dr. Meera Nair", service: "X-Ray", amount: 1500, date: "2026-03-03", status: "Paid" },
            { id: "BILL004", patient: "Suresh Reddy", patientId: "P004", doctor: "Dr. Kiran Kumar", service: "Surgery", amount: 45000, date: "2026-03-04", status: "Partial" }
        ];
        saveBills();
    }

    /* =========================================
        HELPER FUNCTIONS
    ========================================== */
    function saveBills() {
        localStorage.setItem("hospitalBills", JSON.stringify(bills));
    }

    function formatCurrency(amount) {
        const num = parseFloat(amount) || 0;
        return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }

    /* =========================================
        UPDATE SUMMARY CARDS
    ========================================== */
    function updateStatistics() {
        const totalCount = bills.length;
        
        const totalBilled = bills.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
        
        const paidTotal = bills.reduce((sum, b) => {
            const status = String(b.status).toLowerCase();
            if (status === "paid") {
                return sum + (parseFloat(b.amount) || 0);
            }
            return sum;
        }, 0);

        const pendingTotal = bills.reduce((sum, b) => {
            const status = String(b.status).toLowerCase();
            if (status === "pending" || status === "partial") {
                return sum + (parseFloat(b.amount) || 0);
            }
            return sum;
        }, 0);

        if (totalBillsEl) totalBillsEl.textContent = totalCount;
        if (totalBilledEl) totalBilledEl.textContent = formatCurrency(totalBilled);
        if (paidAmountEl) paidAmountEl.textContent = formatCurrency(paidTotal);
        if (pendingAmountEl) pendingAmountEl.textContent = formatCurrency(pendingTotal);
    }

    /* =========================================
        DISPLAY TABLE ROWS
    ========================================== */
    function displayBills(searchText = "") {
        if (!billingTableBody) return;

        billingTableBody.innerHTML = "";
        const query = searchText.toLowerCase().trim();

        const filteredBills = bills.filter(bill => {
            return (
                String(bill.id || "").toLowerCase().includes(query) ||
                String(bill.patient || "").toLowerCase().includes(query) ||
                String(bill.patientId || "").toLowerCase().includes(query) ||
                String(bill.doctor || "").toLowerCase().includes(query) ||
                String(bill.service || "").toLowerCase().includes(query) ||
                String(bill.status || "").toLowerCase().includes(query)
            );
        });

        if (filteredBills.length === 0) {
            if (noBillsMessage) noBillsMessage.classList.add("show");
            return;
        }

        if (noBillsMessage) noBillsMessage.classList.remove("show");

        filteredBills.forEach(bill => {
            const row = document.createElement("tr");

            // Define status badge class
            const status = bill.status || "Pending";
            let statusClass = "pending"; 
            if (status === "Paid") statusClass = "completed"; // Green badge
            if (status === "Partial") statusClass = "confirmed"; // Orange/Yellow badge

            row.innerHTML = `
                <td>${bill.id || "-"}</td>
                <td>${bill.patient || "-"}</td>
                <td>${bill.patientId || "-"}</td>
                <td>${bill.doctor || "-"}</td>
                <td>${bill.service || "-"}</td>
                <td><strong>${formatCurrency(bill.amount)}</strong></td>
                <td>${bill.date || "-"}</td>
                <td>
                    <span class="status ${statusClass}">
                        ${status}
                    </span>
                </td>
            `;

            billingTableBody.appendChild(row);
        });
    }

    /* =========================================
        CREATE NEW BILL HANDLER
    ========================================== */
    if (billingForm) {
        billingForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const getValue = (id) => {
                const el = document.getElementById(id);
                return el ? el.value.trim() : "";
            };

            const billId = getValue("billId").toUpperCase();
            const patient = getValue("billPatient");
            const patientId = getValue("billPatientId").toUpperCase();
            const doctor = getValue("billDoctor");
            const service = getValue("billService");
            const amount = parseFloat(getValue("billAmount")) || 0;
            const date = getValue("billDate");
            const status = getValue("billStatus");

            // Prevent Duplicate Bill IDs
            const isDuplicate = bills.some(
                b => String(b.id || "").toLowerCase() === billId.toLowerCase()
            );

            if (isDuplicate) {
                alert(`Bill ID "${billId}" already exists. Please enter a unique Bill ID.`);
                return;
            }

            const newBill = {
                id: billId,
                patient: patient,
                patientId: patientId,
                doctor: doctor,
                service: service,
                amount: amount,
                date: date,
                status: status,
                createdAt: new Date().toISOString()
            };

            bills.push(newBill);
            saveBills();

            // Refresh Interface
            updateStatistics();
            displayBills();
            billingForm.reset();

            // Show Confirmation Modal
            if (billingMessage) {
                billingMessage.classList.add("show");
            }
        });
    }

    /* =========================================
        CLOSE POPUP HANDLER
    ========================================== */
    if (closeBillingMessage) {
        closeBillingMessage.addEventListener("click", function () {
            if (billingMessage) {
                billingMessage.classList.remove("show");
            }
        });
    }

    /* =========================================
        SEARCH FILTER HANDLER
    ========================================== */
    if (billSearch) {
        billSearch.addEventListener("input", function () {
            displayBills(this.value);
        });
    }

    /* =========================================
        INITIAL LOAD
    ========================================== */
    updateStatistics();
    displayBills();
});