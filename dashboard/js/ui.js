export function renderStats(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.map(item => `
        <div class="card">
        <h2>${item.title}</h2>
        <p class="value">${item.value}</p>
        <span class="trend">${item.trend}</spam>
        </div>
        `).join('');
}