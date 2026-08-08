// =========================================
// PATIENT DETAILS MODULE (LocalStorage Driven)
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    // 1. Safely retrieve selected patient from LocalStorage
    let selectedPatient = null;
    try {
        selectedPatient = JSON.parse(localStorage.getItem("selectedPatient"));
    } catch (error) {
        console.error("Error loading selected patient from localStorage:", error);
    }

    // 2. Redirect to main list if no patient is selected
    if (!selectedPatient || !selectedPatient.id) {
        alert("No patient selected! Redirecting to patients list.");
        window.location.href = "patients.html";
        return;
    }

    // 3. Helper to set form input values with fallbacks
    const setFieldValue = function (id, value, fallback = "N/A") {
        const el = document.getElementById(id);
        if (el) {
            el.value = (value !== undefined && value !== null && value !== "") 
                ? value 
                : fallback;
        }
    };

    // 4. Populate Patient Details
    setFieldValue("detailPatientId", selectedPatient.id);
    setFieldValue("detailPatientName", selectedPatient.name);
    setFieldValue(
        "detailPatientAge", 
        selectedPatient.age ? selectedPatient.age + " years" : "N/A"
    );
    setFieldValue("detailPatientGender", selectedPatient.gender);
    
    // Handles both `bloodGroup` and legacy `blood` keys
    setFieldValue(
        "detailBloodGroup", 
        selectedPatient.bloodGroup || selectedPatient.blood
    );
    
    setFieldValue("detailDepartment", selectedPatient.department);
    setFieldValue("detailPhone", selectedPatient.phone);
    setFieldValue("detailStatus", selectedPatient.status);
    setFieldValue("detailDoctor", selectedPatient.doctor, "Not Assigned");

    // 5. Format Admission / Registration Date
    let rawDate = selectedPatient.date || selectedPatient.admissionDate || selectedPatient.createdDate;
    let formattedDate = "Not Available";

    if (rawDate) {
        const parsedDate = new Date(rawDate);
        if (!isNaN(parsedDate.getTime())) {
            formattedDate = parsedDate.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } else {
            formattedDate = rawDate; // Fallback to raw string if already formatted
        }
    }

    setFieldValue("detailAdmissionDate", formattedDate);

    // 6. Clean up LocalStorage when clicking "Back to Patients"
    const backBtn = document.querySelector(".cancel-btn");
    if (backBtn) {
        backBtn.addEventListener("click", function () {
            localStorage.removeItem("selectedPatient");
        });
    }

});