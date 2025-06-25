let liveChartInstance = null;
let applianceChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('applianceSelect').addEventListener('change', handleApplianceChange);
    document.getElementById('usageTypeSelect').addEventListener('change', handleUsageTypeChange);
    document.getElementById('downloadChartBtn').addEventListener('click', downloadChart);

    fetchLiveTotalUsage();
    setInterval(fetchLiveTotalUsage, 5000);
});

//  Fetch and show live total current usage
async function fetchLiveTotalUsage() {
    try {
        const res = await fetch('http://127.0.0.1:5000/readings');
        const data = await res.json();
        const recent = data.slice(-20);
        const timeMap = new Map();

        recent.forEach(d => {
            const time = new Date(d.timestamp).toLocaleTimeString();
            const amps = d.watts / 230;
            if (!timeMap.has(time)) timeMap.set(time, 0);
            timeMap.set(time, timeMap.get(time) + amps);
        });

        const labels = Array.from(timeMap.keys());
        const values = Array.from(timeMap.values());

        const ctx = document.getElementById('liveChart').getContext('2d');
        if (liveChartInstance) liveChartInstance.destroy();

        liveChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Live Current (Amps)',
                    data: values,
                    borderColor: '#0A74DA',
                    backgroundColor: 'rgba(10, 116, 218, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: ctx => `${ctx.raw.toFixed(2)} A`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amps'
                        }
                    }
                }
            }
        });

        document.getElementById('timestamp').innerText = `Last updated: ${new Date().toLocaleTimeString()}`;
    } catch (err) {
        console.error("Live usage fetch error:", err);
    }
}

//  When appliance is selected
function handleApplianceChange() {
    const selected = document.getElementById('applianceSelect').value;
    const usageTypeContainer = document.getElementById('usageTypeContainer');
    if (selected) {
        usageTypeContainer.style.display = 'block';
        handleUsageTypeChange(); // Auto-trigger view
    } else {
        usageTypeContainer.style.display = 'none';
    }
}

//  When usage type is selected
function handleUsageTypeChange() {
    const appliance = document.getElementById('applianceSelect').value;
    const type = document.getElementById('usageTypeSelect').value;

    if (!appliance || !type) return;

    const ctx = document.getElementById('applianceChart').getContext('2d');

    if (applianceChartInstance) applianceChartInstance.destroy();

    const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const values = labels.map(() => Math.floor(Math.random() * 1500));

    const colorMap = {
        AC: '#4caf50',
        Fridge: '#2196f3',
        TV: '#ff9800',
        'Washing Machine': '#9c27b0',
        Heater: '#f44336'
    };

    applianceChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: `${appliance} - ${type}`,
                data: values,
                backgroundColor: colorMap[appliance] || '#666',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.raw} W`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Watts' }
                }
            }
        }
    });

    document.getElementById('applianceTimestamp').innerText = `Last updated: ${new Date().toLocaleTimeString()}`;
}

// Download as image
function downloadChart() {
    if (!applianceChartInstance) {
        alert("Please generate a chart first.");
        return;
    }

    const appliance = document.getElementById('applianceSelect').value;
    const type = document.getElementById('usageTypeSelect').value;
    const link = document.createElement('a');
    link.href = applianceChartInstance.toBase64Image();
    link.download = `${appliance}_${type}_usage_chart.png`;
    link.click();
}
