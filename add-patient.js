document.addEventListener("DOMContentLoaded", function () {

    const patientForm = document.getElementById("patientForm");
    const patientMessage = document.getElementById("patientMessage");
    const messageTitle = document.getElementById("messageTitle");
    const messageText = document.getElementById("messageText");
    const viewPatientsBtn = document.getElementById("viewPatientsBtn");
    const closeMessageBtn = document.getElementById("closeMessageBtn");

    if (patientForm) {
        patientForm.addEventListener("submit", function (event) {
            event.preventDefault();

            // 1. Load existing patients using the correct key
            let patients = JSON.parse(
                localStorage.getItem("hospitalPatients")
            ) || [];

            // Helper to get trimmed input values safely
            const getValue = (id) => {
                const el = document.getElementById(id);
                return el ? el.value.trim() : "";
            };

            // 2. Create patient object with matching property names
            let patient = {
                id: getValue("patientId"),
                name: getValue("patientName"),
                age: getValue("patientAge"),
                gender: getValue("patientGender"),
                bloodGroup: getValue("bloodGroup"), // Fixed key name
                phone: getValue("phone"),
                guardianName: getValue("guardianName"),
                guardianRelation: getValue("guardianRelation"),
                guardianPhone: getValue("guardianPhone"),
                department: getValue("department"),
                status: getValue("status"),
                address: getValue("address"),
                createdDate: new Date().toISOString()
            };

            // Check for duplicate Patient ID
            const duplicate = patients.some(
                (p) => String(p.id).toLowerCase() === patient.id.toLowerCase()
            );

            if (duplicate) {
                alert("Patient ID already exists! Please use a unique ID.");
                return;
            }

            // 3. Save to hospitalPatients key
            patients.push(patient);
            localStorage.setItem("hospitalPatients", JSON.stringify(patients));

            // Show success modal/popup
            if (patientMessage) {
                patientMessage.style.display = "flex";
                patientMessage.classList.add("show");
            }

            if (messageTitle) {
                messageTitle.textContent = "Patient Added Successfully";
            }

            if (messageText) {
                messageText.textContent = `${patient.name} (${patient.id}) has been successfully registered.`;
            }

            patientForm.reset();
        });
    }

    // View patients navigation button
    if (viewPatientsBtn) {
        viewPatientsBtn.addEventListener("click", function () {
            window.location.href = "patients.html";
        });
    }

    // Close modal / Add another patient button
    if (closeMessageBtn) {
        closeMessageBtn.addEventListener("click", function () {
            if (patientMessage) {
                patientMessage.style.display = "none";
                patientMessage.classList.remove("show");
            }
        });
    }

});