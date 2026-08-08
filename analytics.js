// ======================================================
// HOSPITAL MANAGEMENT SYSTEM - ANALYTICS MODULE
// ======================================================

document.addEventListener("DOMContentLoaded", function () {
    initLiveClock();
    loadAnalyticsMetrics();
    renderAnalyticsCharts();
});

/* ======================================================
   1. LIVE CLOCK INTEGRATION
====================================================== */
function initLiveClock() {
    const currentDateEl = document.getElementById("currentDate");
    const currentTimeEl = document.getElementById("currentTime");

    function updateClock() {
        const now = new Date();
        if (currentDateEl) {
            currentDateEl.textContent = now.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
        }
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
   2. DATA RETRIEVAL & METRICS CALCULATION
====================================================== */
function getStorageData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
        console.error("Error reading " + key + " from LocalStorage", e);
        return [];
    }
}

function loadAnalyticsMetrics() {
    const patients = getStorageData("hospitalPatients");
    const doctors = getStorageData("hospitalDoctors");
    const appointments = getStorageData("hospitalAppointments");
    const beds = getStorageData("hospitalBeds");
    const bills = getStorageData("hospitalBills");

    // Update Summary Numbers
    const totalPatientsEl = document.getElementById("analyticsTotalPatients");
    if (totalPatientsEl) totalPatientsEl.textContent = patients.length;

    const totalDoctorsEl = document.getElementById("analyticsTotalDoctors");
    if (totalDoctorsEl) totalDoctorsEl.textContent = doctors.length;

    const totalAppointmentsEl = document.getElementById("analyticsTotalAppointments");
    if (totalAppointmentsEl) totalAppointmentsEl.textContent = appointments.length;

    // Available Beds calculation
    const availableBedsCount = beds.length > 0 
        ? beds.filter(b => String(b.status || "").toLowerCase() === "available").length 
        : 0;
    const availableBedsEl = document.getElementById("analyticsAvailableBeds");
    if (availableBedsEl) availableBedsEl.textContent = availableBedsCount;

    // Total Revenue calculation
    let totalRevenue = 0;
    if (bills.length > 0) {
        totalRevenue = bills.reduce((sum, bill) => {
            const cleanAmt = parseFloat(String(bill.total || bill.amount || 0).replace(/[^0-9.-]+/g, "")) || 0;
            return sum + cleanAmt;
        }, 0);
    } else {
        totalRevenue = patients.length * 1500; 
    }
    
    const totalRevenueEl = document.getElementById("analyticsTotalRevenue");
    if (totalRevenueEl) totalRevenueEl.textContent = "₹" + totalRevenue.toLocaleString("en-IN");
}

/* ======================================================
   3. RENDER CHART.JS CHARTS WITH ANIMATIONS
====================================================== */
function renderAnalyticsCharts() {
    renderPatientGrowthChart();
    renderDepartmentBarChart();
    renderBedOccupancyChart();
    renderRevenueAnalysisChart();
}

/* 1. Patient Growth Line Chart */
function renderPatientGrowthChart() {
    const ctx = document.getElementById("patientGrowthChart");
    if (!ctx || typeof Chart === "undefined") return;

    const patients = getStorageData("hospitalPatients");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = [5, 12, 18, 25, 30, 42, Math.max(50, patients.length), 0, 0, 0, 0, 0];

    const gradient = ctx.getContext("2d").createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(2, 132, 199, 0.4)");
    gradient.addColorStop(1, "rgba(2, 132, 199, 0.0)");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: months,
            datasets: [{
                label: "Patient Registrations",
                data: monthlyData,
                borderColor: "#0284c7",
                borderWidth: 3,
                fill: true,
                backgroundColor: gradient,
                tension: 0.4,
                pointBackgroundColor: "#0284c7",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1500, easing: "easeInOutQuart" },
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: "#f1f5f9" } },
                x: { grid: { display: false } }
            }
        }
    });
}

/* 2. Department-wise Patient Bar Chart */
function renderDepartmentBarChart() {
    const ctx = document.getElementById("departmentBarChart");
    if (!ctx || typeof Chart === "undefined") return;

    const patients = getStorageData("hospitalPatients");
    const deptCounts = {
        "Cardiology": 0,
        "Neurology": 0,
        "Orthopedics": 0,
        "General Medicine": 0,
        "Pediatrics": 0
    };

    patients.forEach(p => {
        const dept = p.department || "General Medicine";
        if (deptCounts.hasOwnProperty(dept)) {
            deptCounts[dept]++;
        } else {
            deptCounts["General Medicine"]++;
        }
    });

    if (patients.length === 0) {
        deptCounts["Cardiology"] = 8;
        deptCounts["Neurology"] = 6;
        deptCounts["Orthopedics"] = 10;
        deptCounts["General Medicine"] = 15;
        deptCounts["Pediatrics"] = 7;
    }

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(deptCounts),
            datasets: [{
                label: "Patients",
                data: Object.values(deptCounts),
                backgroundColor: [
                    "rgba(2, 132, 199, 0.85)",
                    "rgba(13, 148, 136, 0.85)",
                    "rgba(16, 185, 129, 0.85)",
                    "rgba(139, 92, 246, 0.85)",
                    "rgba(245, 158, 11, 0.85)"
                ],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1500, easing: "easeOutBounce" },
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: "#f1f5f9" } },
                x: { grid: { display: false } }
            }
        }
    });
}

/* 3. Bed Occupancy Doughnut Chart */
function renderBedOccupancyChart() {
    const ctx = document.getElementById("bedOccupancyChart");
    if (!ctx || typeof Chart === "undefined") return;

    const rawBeds = getStorageData("hospitalBeds");
    let occupied = 14;
    let available = 6;

    if (rawBeds.length > 0) {
        occupied = rawBeds.filter(b => String(b.status || "").toLowerCase() === "occupied").length;
        available = rawBeds.filter(b => String(b.status || "").toLowerCase() === "available").length;
        if (occupied === 0 && available === 0) available = rawBeds.length;
    }

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Occupied Beds", "Available Beds"],
            datasets: [{
                data: [occupied, available],
                backgroundColor: ["#0284c7", "#10b981"],
                borderWidth: 4,
                borderColor: "#ffffff"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "70%",
            animation: { animateRotate: true, animateScale: true, duration: 1800 },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: { font: { size: 12, weight: "600" }, padding: 16, usePointStyle: true }
                }
            }
        }
    });
}

/* 4. Revenue Analysis Chart */
function renderRevenueAnalysisChart() {
    const ctx = document.getElementById("revenueAnalysisChart");
    if (!ctx || typeof Chart === "undefined") return;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueData = [45000, 52000, 61000, 75000, 88000, 95000, 110000, 125000, 0, 0, 0, 0];

    const revGradient = ctx.getContext("2d").createLinearGradient(0, 0, 0, 300);
    revGradient.addColorStop(0, "rgba(16, 185, 129, 0.85)");
    revGradient.addColorStop(1, "rgba(16, 185, 129, 0.1)");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: months,
            datasets: [{
                label: "Monthly Revenue (₹)",
                data: revenueData,
                backgroundColor: revGradient,
                borderColor: "#10b981",
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1600, easing: "easeOutCubic" },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return " Revenue: ₹" + context.raw.toLocaleString("en-IN");
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: "#f1f5f9" },
                    ticks: {
                        callback: function(value) {
                            return "₹" + value / 1000 + "k";
                        }
                    }
                },
                x: { grid: { display: false } }
            }
        }
    });
}