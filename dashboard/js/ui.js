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
        const totalElement = document.getElementById('total-income');
        if (totalElement) totalElement.textContent = '$0';
        return;
    }

    projectsArray.forEach((project, index) => {
        const profit = project.revenue - project.cost;
        const profitClass = profit >= 0 ? 'text-green' : 'text-red';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${project.name}</td>
            <td>${project.revenue.toLocaleString()}</td>
            <td>${project.cost.toLocaleString()}</td>
            <td style="color: ${project.revenue - project.cost >= 0 ? 'var(--success)' : 'var(--danger)'}">
                $${(project.revenue - project.cost).toLocaleString()}
            </td>
            <td><span class="status-badge">${project.status}</span></td>
            <td>${getActionButtons(index, 'delete-project-btn')}</td> 
        `;
        container.appendChild(tr);
    });
    const totalIncome = projectsArray.reduce((sum, p) => sum + (p.revenue - p.cost), 0);
    const totalElement = document.getElementById('total-income');
    if (totalElement) {
        totalElement.textContent = `$${totalIncome.toLocaleString()}`;
        totalElement.style.color = totalIncome >= 0 ? 'text-green' : 'text-red'
    }

    updateTotalIncome(projectsArray);
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

function updateTotalIncome(projectsArray) {
    const totalIncome = projectsArray.reduce((sum, p) => sum + (p.revenue - p.cost), 0);
    const totalElement = document.getElementById('total-income');
    if (totalElement) {
        totalElement.textContent = `$${totalIncome.toLocaleString()}`;
        totalElement.className = totalIncome >= 0 ? 'text-green' : 'text-red';
    }
}