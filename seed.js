// Automatically seed data if not already present or force reset
function autoSeedHospitalData() {
    // Check if data already exists, if not, generate it
    if (!localStorage.getItem("hospitalPatients") || JSON.parse(localStorage.getItem("hospitalPatients")).length === 0) {
        
        const departments = ["Cardiology", "Neurology", "Orthopedics", "General Medicine", "Pediatrics", "Dermatology", "Ophthalmology", "ENT"];
        const specializationsList = {
            "Cardiology": "Cardiologist", "Neurology": "Neurologist", "Orthopedics": "Orthopedic",
            "General Medicine": "General Physician", "Pediatrics": "Pediatrician", "Dermatology": "Dermatologist",
            "Ophthalmology": "Surgeon", "ENT": "Surgeon"
        };
        const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Ananya", "Aadhya", "Diya", "Saanvi", "Priya", "Neha", "Pooja", "Kavya", "Rohan", "Rahul", "Amit", "Suresh", "Ramesh", "Deepak", "Sunita", "Anita", "Geeta", "Pankaj", "Manoj", "Sanjay"];
        const lastNames = ["Sharma", "Verma", "Gupta", "Malhotra", "Mehra", "Patel", "Reddy", "Rao", "Nair", "Iyer", "Pillai", "Das", "Bose", "Sen", "Chatterjee", "Bhattacharya", "Joshi", "Kulkarni", "Deshmukh", "Choudhury"];
        const bloodGroups = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];
        const patientStatuses = ["Admitted", "Consultation", "Discharged", "Critical", "Observation", "Recovery"];
        const appointmentStatuses = ["Confirmed", "Pending", "Completed", "Cancelled"];

        function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
        function num(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

        // Doctors
        let doctors = [];
        for (let i = 1; i <= 30; i++) {
            let dept = rnd(departments);
            let docName = "Dr. " + rnd(firstNames) + " " + rnd(lastNames);
            doctors.push({
                id: "DOC" + String(i).padStart(3, '0'), doctorId: "DOC" + String(i).padStart(3, '0'),
                name: docName, doctorName: docName, specialization: specializationsList[dept],
                department: dept, phone: "9" + num(100000000, 999999999), email: "doctor" + i + "@hospital.com",
                experience: num(2, 25), status: Math.random() > 0.15 ? "Available" : "Unavailable"
            });
        }

        // Patients
        let patients = [];
        let indices = Array.from({ length: 130 }, (_, index) => index + 1).sort(() => Math.random() - 0.5);
        let youngPatientIds = new Set(indices.slice(0, 45));
        for (let i = 1; i <= 130; i++) {
            let dept = rnd(departments);
            let patName = rnd(firstNames) + " " + rnd(lastNames);
            let patId = "P" + String(i).padStart(3, '0');
            patients.push({
                id: patId, patientId: patId, name: patName, patientName: patName,
                age: youngPatientIds.has(i) ? num(1, 29) : num(30, 85),
                gender: Math.random() > 0.5 ? "Male" : "Female", bloodGroup: rnd(bloodGroups),
                department: dept, phone: "8" + num(100000000, 999999999), contact: "8" + num(100000000, 999999999),
                assignedDoctor: rnd(doctors).name, admissionDate: "2026-08-" + String(num(1, 7)).padStart(2, '0'),
                status: rnd(patientStatuses)
            });
        }

        // Appointments
        let appointments = [];
        for (let i = 1; i <= 80; i++) {
            let p = rnd(patients), d = rnd(doctors);
            let aptId = "APT" + String(i).padStart(3, '0');
            appointments.push({
                id: aptId, appointmentId: aptId, patientName: p.name, patient: p.name, patientId: p.id,
                doctorName: d.name, doctor: d.name, department: d.department,
                date: "2026-08-" + String(num(1, 10)).padStart(2, '0'),
                time: String(num(9, 17)).padStart(2, '0') + ":" + (Math.random() > 0.5 ? "00" : "30"),
                status: rnd(appointmentStatuses)
            });
        }

        // Pharmacy
        let pharmacy = [];
        const baseMedNames = ["Paracetamol", "Amoxicillin", "Azithromycin", "Ibuprofen", "Cetirizine", "Pantoprazole", "Omeprazole", "Metformin", "Amlodipine", "Atorvastatin"];
        for (let i = 1; i <= 500; i++) {
            let medId = "MED" + String(i).padStart(3, '0');
            pharmacy.push({
                id: medId, medicineId: medId, name: rnd(baseMedNames) + " " + num(5, 1000) + "mg",
                category: "Tablet", stock: num(25, 800), price: num(30, 2000), manufacturer: "Sun Pharma", expiryDate: "2029-12-31"
            });
        }

        // Beds
        let beds = [];
        const wards = ["General Ward", "ICU", "Emergency", "Pediatric Ward", "Private Suite"];
        for (let i = 1; i <= 120; i++) {
            let bedId = "BED" + String(i).padStart(3, '0');
            let w = rnd(wards), stat = rnd(["Available", "Occupied", "Under Maintenance"]);
            beds.push({
                id: bedId, bedId: bedId, bedNumber: "B-" + i, ward: w,
                type: w === "ICU" ? "Specialized" : "Standard", status: stat,
                patientName: stat === "Occupied" ? rnd(patients).name : "None"
            });
        }

        // Save everything
        localStorage.setItem("hospitalDoctors", JSON.stringify(doctors));
        localStorage.setItem("doctors", JSON.stringify(doctors));
        localStorage.setItem("hospitalPatients", JSON.stringify(patients));
        localStorage.setItem("patients", JSON.stringify(patients));
        localStorage.setItem("hospitalAppointments", JSON.stringify(appointments));
        localStorage.setItem("appointments", JSON.stringify(appointments));
        localStorage.setItem("hospitalPharmacy", JSON.stringify(pharmacy));
        localStorage.setItem("pharmacy", JSON.stringify(pharmacy));
        localStorage.setItem("hospitalBeds", JSON.stringify(beds));
        localStorage.setItem("beds", JSON.stringify(beds));
        
        console.log("Mock data injected automatically!");
    }
}
autoSeedHospitalData();