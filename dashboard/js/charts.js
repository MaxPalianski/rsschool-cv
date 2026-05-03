export function renderSimpleChart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const bars = [40, 70, 45, 90, 65, 80, 50];

    container.innerHTML = `
    <h2>Sales Analytics</h2>
    <div style="display: flex, align-items: flex-end; gap: 10px; height: 150px; padding-top: 20px;">
    ${bars.map(height => `
        <div style="flex: 1; background: var(--primary); height: ${height}%; border-radius: 4px 4px 0 0;"></div>
        `).join('')}
        </div>
        `;
}