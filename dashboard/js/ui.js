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

export function renderProjectsTable(projectsArray, employeesArray = []) {
    const container = document.getElementById('table-body');
    if (!container) return;
    container.innerHTML = '';

    if (projectsArray.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align:center;">No projects active.</td></tr>';
        return;
    }

    projectsArray.forEach((project, index) => {
        const projectCost = employeesArray.reduce((sum, emp) => {
            const assignment = emp.assignments?.find(a => a.projectName === project.name);
            return sum + (assignment ? (emp.salary * assignment.capacity) : 0);
        }, 0);

        const revenue = project.revenue || 0;
        const profit = revenue - projectCost;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${project.name}</td>
            <td>${revenue.toLocaleString()}</td>
            <td>${projectCost.toLocaleString()}</td>
            <td style="color: ${profit >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: bold;">
            $${profit.toLocaleString()}
            </td>
            <td><span class="status-badge" data-status="${project.status}">${project.status}</span></td>
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
    updateTotalIncome(projectsArray, employeesArray);
}

export function updateTotalIncome(projectsArray, employeesArray = []) {
    const totalElement = document.getElementById('total-income');
    if (!totalElement) return;

    const total = (projectsArray || []).reduce((sum, project) => {
        const projectCost = (employeesArray || []).reduce((eSum, emp) => {
            const assignment = emp.assignments?.find(a => 
                a.projectName.trim().toLowerCase() === project.name.trim().toLowerCase());
            const salary = Number(emp.salary) || 0;
            const capacity = Number(assignment?.capacity) || 0;
            return eSum + (salary * capacity);
        }, 0);
        const revenue = Number(project.revenue) || 0;
        const profit = revenue - projectCost;
        return sum + profit;
    }, 0);
    totalElement.textContent = `$${total.toLocaleString()}`;
    totalElement.style.color = total >= 0 ? 'var(--success)' : 'var(--danger)';
}

export function renderEmployeesTable(empArray) {
    const title = document.querySelector('#employees-section h2');
    if (title) title.textContent = `Team Management (${empArray.length})`;
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

        const safeAssignments = (emp && Array.isArray(emp.assignments)) ? emp.assignments : [];
        const totalCapacity = safeAssignments.reduce((sum, ass) => {
            const cap = (ass && typeof ass.capacity === 'number') ? ass.capacity : 0;
            return sum + cap;
        }, 0);
        const isMaxed = totalCapacity >= 1.5;
        const projectsCount = safeAssignments.length;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${emp.name}</td>
            <td>${emp.position}</td>
            <td>${age}</td>
            <td class="salary-amount" 
            contenteditable="true"
            data-index="${index}"
            >$${emp.salary.toLocaleString()}</td>
            <td><span class="status-badge" data-status="${emp.status}">${emp.status}</span></td>
            <td>
            <div class="action-cell">
            ${getActionButtons(index, 'delete-employee-btn')}
            <button class="assign-btn btn" data-index="${index}" title="${isMaxed ? 'Max capacity reached' : 'Assign to Project'}"
            ${isMaxed ? 'disabled style="opacity: 0.3; cursor: not-allowed;"' : ''}>
            <i class="fas fa-user-plus"></i>
            </button>
            </div>
            </td>
            <td>
            <div class="projects-badge">
            <i class="fas fa-briefcase"></i> ${projectsCount}
            </div>
            <div class="capacity-bar-wrapper">
            <div class="capacity-bar ${totalCapacity > 1.5 ? 'overload' : ''}"
            style="width: ${Math.min((totalCapacity / 1.5) * 100, 100)}%"></div>
            <span class="capacity-text">${totalCapacity.toFixed(1)} / 1.5</span>
            </div>
            </td>
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