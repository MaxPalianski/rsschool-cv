function getActionButtons(index, customDeleteClass = '') {
    return `
    <div class="actions-cell">
        <button class="edit-btn" title="Edit">
            <i class="fas fa-edit"></i>
        </button>
        <button class="delete-btn ${customDeleteClass}" data-index="${index}" title="Delete">
            <i class="fas fa-trash"></i>
        </button>
    </div>
    `;
}

export function renderProjectsTable(projectsArray) {
    const container = document.getElementById('table-body');
    if (!container) return;
    container.innerHTML = '';

    projectsArray.forEach((project, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${project.name}</td>
            <td>${project.revenue.toLocaleString()}</td>
            <td>${project.cost.toLocaleString()}</td>
            <td style="color: ${project.revenue - project.cost >= 0 ? 'var(--success)' : 'var(--danger)'}">
                $${(project.revenue - project.cost).toLocaleString()}
            </td>
            <td><span class="status-badge">${project.status}</span></td>
            <td>${getActionButtons(index)}</td> 
        `;
        container.appendChild(tr);
    });
}

export function renderEmployeesTable(empArray) {
    const container = document.getElementById('employees-body');
    if (!container) return;
    container.innerHTML = '';

    empArray.forEach((emp, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${emp.name}</td>
            <td>${emp.position}</td>
            <td>$${emp.salary.toLocaleString()}</td>
            <td><span class="status-badge">${emp.status}</span></td>
            <td>${getActionButtons(index, 'delete-employee-btn')}</td>
        `;
        container.appendChild(tr);
    });
}

export function renderStats(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.map(item => `
        <div class="card">
        <h2>${item.title}</h2>
        <p class="value">${item.value}</p>
        <span class="trend">${item.trend}</span>
        </div>
        `).join('');
}

export function updateDateTime() {
    const dateElement = document.getElementById('current-date');
    if (!dateElement) return;

    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-GB', options);
}

export function renderOrders(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.map(order => {
        let statusClass = order.status.toLowerCase();
        
        return `
        <tr>
        <td>${order.name}</td>
        <td>${order.product}</td>
        <td>${order.date}</td>
        <td><span class="badge badge-${order.status.toLowerCase()}">${order.status}</span></td>
        </tr>`;
    }).join('');
}