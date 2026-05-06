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

    if (projectsArray.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align:center;">No projects active.</td></tr>';
        updateTotalIncome([]);
        return;
    }

    projectsArray.forEach((project, index) => {
        const profit = (project.revenue || 0) - (project.cost || 0);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${project.name}</td>
            <td>${(project.revenue || 0).toLocaleString()}</td>
            <td>${(project.cost || 0).toLocaleString()}</td>
            <td style="color: ${profit >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: bold;">
            $${profit.toLocaleString()}
            </td>
            <td><span class="status-badge">${project.status}</span></td>
            <td>
            <div class="action-cell">
            <button class="delete btn delete-project-btn" data-index="${index}">
            <i class="fas fa-trash"></i>
            </button>
            </div>
            </td>
        `;
        container.appendChild(tr);
    });
    updateTotalIncome(projectsArray);
}

export function updateTotalIncome(projectsArray) {
    const totalElement = document.getElementById('total-income');
    if (!totalElement) return;
    const total = (projectsArray || []).reduce((sum, proj) => {
        return sum + ((proj.revenue || 0) - (proj.cost || 0));
    }, 0);
    totalElement.textContent = `$${total.toLocaleString()}`;
    totalElement.style.color = total >= 0 ? 'var(--success)' : 'var(--danger)';
}

export function renderEmployeesTable(empArray) {
    const container = document.getElementById('employees-body');
    if (!container) return;
    container.innerHTML = '';

    if (empArray.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align:center;">No employees found. Add your first team member!</td></tr>';
        return;
    }

    empArray.forEach((emp, index) => {
        const birthDate = new Date(emp.dob);
        const age = isNaN(birthDate) ? "N/A" : new Date().getFullYear() - birthDate.getFullYear();

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${emp.name}</td>
            <td>${emp.position}</td>
            <td>${age}</td>
            <td class="salary-amount">$${emp.salary.toLocaleString()}</td>
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

