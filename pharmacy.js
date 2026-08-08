// =========================================
// PHARMACY MANAGEMENT MODULE
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    // Form & Input Elements
    const medicineForm = document.getElementById("medicineForm");
    const medicineIdInput = document.getElementById("medicineId");
    const medicineNameInput = document.getElementById("medicineName");
    const medicineCategoryInput = document.getElementById("medicineCategory");
    const medicineQuantityInput = document.getElementById("medicineQuantity");
    const medicinePriceInput = document.getElementById("medicinePrice");
    const medicineExpiryInput = document.getElementById("medicineExpiry");
    const medicineSupplierInput = document.getElementById("medicineSupplier");
    const medicineMinimumStockInput = document.getElementById("medicineMinimumStock");

    // Table & Message Elements
    const medicineTableBody = document.getElementById("medicineTableBody");
    const medicineSearch = document.getElementById("medicineSearch");
    const noMedicinesMessage = document.getElementById("noMedicinesMessage");

    // Summary Metric Elements
    const totalMedicinesEl = document.getElementById("totalMedicines");
    const availableStockEl = document.getElementById("availableStock");
    const lowStockEl = document.getElementById("lowStock");
    const expiredMedicinesEl = document.getElementById("expiredMedicines");

    // Modal / Popup Elements
    const medicineMessageOverlay = document.getElementById("medicineMessage");
    const closeMedicineMessageBtn = document.getElementById("closeMedicineMessage");

    /* =========================================
       1. LOCALSTORAGE DATA MANAGEMENT
    ========================================== */
    function getMedicines() {
        try {
            return JSON.parse(localStorage.getItem("hospitalMedicines")) || [];
        } catch (error) {
            console.error("Error reading hospitalMedicines from localStorage:", error);
            return [];
        }
    }

    function saveMedicines(medicines) {
        try {
            localStorage.setItem("hospitalMedicines", JSON.stringify(medicines));
        } catch (error) {
            console.error("Error saving hospitalMedicines to localStorage:", error);
        }
    }

    /* =========================================
       2. STATUS EVALUATOR HELPERS
    ========================================== */
    function getMedicineStatus(quantity, minStock, expiryDateStr) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expiryDate = new Date(expiryDateStr);

        // Priority 1: Expired
        if (!isNaN(expiryDate.getTime()) && expiryDate < today) {
            return { label: "Expired", class: "status cancelled" }; // Red badge
        }

        // Priority 2: Low Stock
        if (Number(quantity) <= Number(minStock)) {
            return { label: "Low Stock", class: "status pending" }; // Yellow/Warning badge
        }

        // Priority 3: In Stock / Available
        return { label: "In Stock", class: "status confirmed" }; // Green badge
    }

    /* =========================================
       3. RENDER TABLE & UPDATE METRICS
    ========================================== */
    function renderPharmacy() {
        const medicines = getMedicines();
        const searchTerm = medicineSearch ? medicineSearch.value.toLowerCase().trim() : "";

        // Filter based on search query
        const filtered = medicines.filter(function (med) {
            const name = (med.name || "").toLowerCase();
            const id = (med.id || "").toLowerCase();
            const cat = (med.category || "").toLowerCase();
            const supp = (med.supplier || "").toLowerCase();

            return name.includes(searchTerm) || id.includes(searchTerm) || cat.includes(searchTerm) || supp.includes(searchTerm);
        });

        // Clear existing rows
        medicineTableBody.innerHTML = "";

        if (filtered.length === 0) {
            if (noMedicinesMessage) noMedicinesMessage.style.display = "block";
        } else {
            if (noMedicinesMessage) noMedicinesMessage.style.display = "none";

            filtered.forEach(function (med) {
                const statusObj = getMedicineStatus(med.quantity, med.minStock, med.expiry);
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td><strong>${med.id}</strong></td>
                    <td>${med.name}</td>
                    <td>${med.category}</td>
                    <td>${med.quantity}</td>
                    <td>$${Number(med.price).toFixed(2)}</td>
                    <td>${med.expiry}</td>
                    <td>${med.supplier}</td>
                    <td><span class="${statusObj.class}">${statusObj.label}</span></td>
                    <td>
                        <button class="cancel-btn" style="padding: 4px 8px; font-size: 0.8rem;" onclick="deleteMedicine('${med.id}')">
                            🗑️ Delete
                        </button>
                    </td>
                `;

                medicineTableBody.appendChild(row);
            });
        }

        updateMetrics(medicines);
    }

    /* =========================================
       4. UPDATE SUMMARY CARDS
    ========================================== */
    function updateMetrics(medicines) {
        let total = medicines.length;
        let available = 0;
        let low = 0;
        let expired = 0;

        medicines.forEach(function (med) {
            const statusObj = getMedicineStatus(med.quantity, med.minStock, med.expiry);

            if (statusObj.label === "Expired") {
                expired++;
            } else if (statusObj.label === "Low Stock") {
                low++;
            } else {
                available++;
            }
        });

        if (totalMedicinesEl) totalMedicinesEl.textContent = total;
        if (availableStockEl) availableStockEl.textContent = available;
        if (lowStockEl) lowStockEl.textContent = low;
        if (expiredMedicinesEl) expiredMedicinesEl.textContent = expired;
    }

    /* =========================================
       5. FORM SUBMISSION (ADD MEDICINE)
    ========================================== */
    if (medicineForm) {
        medicineForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const newId = medicineIdInput.value.trim().toUpperCase();
            const medicines = getMedicines();

            // Check duplicate ID
            const exists = medicines.some(function (med) {
                return med.id.toUpperCase() === newId;
            });

            if (exists) {
                alert(`Medicine with ID "${newId}" already exists! Please use a unique ID.`);
                return;
            }

            const newMedicine = {
                id: newId,
                name: medicineNameInput.value.trim(),
                category: medicineCategoryInput.value,
                quantity: Number(medicineQuantityInput.value),
                price: Number(medicinePriceInput.value),
                expiry: medicineExpiryInput.value,
                supplier: medicineSupplierInput.value.trim(),
                minStock: Number(medicineMinimumStockInput.value)
            };

            medicines.push(newMedicine);
            saveMedicines(medicines);

            // Reset form
            medicineForm.reset();

            // Refresh UI
            renderPharmacy();

            // Show Success Modal
            if (medicineMessageOverlay) {
                medicineMessageOverlay.style.display = "flex";
            }
        });
    }

    /* =========================================
       6. DELETE MEDICINE
    ========================================== */
    window.deleteMedicine = function (id) {
        if (confirm(`Are you sure you want to delete medicine ID: ${id}?`)) {
            let medicines = getMedicines();
            medicines = medicines.filter(function (med) {
                return med.id !== id;
            });
            saveMedicines(medicines);
            renderPharmacy();
        }
    };

    /* =========================================
       7. SEARCH EVENT LISTENER
    ========================================== */
    if (medicineSearch) {
        medicineSearch.addEventListener("input", renderPharmacy);
    }

    /* =========================================
       8. MODAL CLOSE EVENT
    ========================================== */
    if (closeMedicineMessageBtn) {
        closeMedicineMessageBtn.addEventListener("click", function () {
            if (medicineMessageOverlay) {
                medicineMessageOverlay.style.display = "none";
            }
        });
    }

    /* =========================================
       9. INITIAL LOAD
    ========================================== */
    renderPharmacy();
});