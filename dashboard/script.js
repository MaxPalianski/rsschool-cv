import { updateDateTime } from "./js/ui.js";
import { orders, getCurrentStats } from "./js/data.js";
import { renderStats } from "./js/ui.js";
import { renderOrders } from "./js/ui.js";
import { renderSimpleChart } from "./js/charts.js";
import { currentPeriod, loadData, initialProjects, saveData } from "./js/data.js";
import { renderEmployeesTable, renderProjectsTable } from "./js/ui.js";

let currentProjects = [];
let currentEmployees = [];

function updateDashboard() {
    const data = loadData();
    const employees = data.employees || [];
    const projects = data.projects || [];
    renderEmployeesTable(employees);
    renderProjectsTable(projects);
    const statsData = getCurrentStats(employees, projects);

    renderStats('stats-container', statsData);
}

document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    renderOrders('orders-body', orders)

    const navLinks = document.querySelectorAll('.sidebar-nav li');
    const dashboardSection = document.getElementById('dashboard-section');
    const employeesSection = document.getElementById('employees-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            navLinks.forEach(el => el.classList.remove('active'));
            link.classList.add('active');

            const linkText = link.innerText;

            if (link.innerText.includes('Dashboard')) {
                dashboardSection.style.display = 'contents';
                employeesSection.style.display = 'none';
            } else if (link.innerText.includes('Employees')) {
                dashboardSection.style.display = 'none';
                employeesSection.style.display = 'block';
                renderEmployeesTable(currentEmployees);
            }
        });
    });

    renderSimpleChart('chart-container');

    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');

    if (monthSelect) {
        monthSelect.addEventListener('change', (e) => {
            currentPeriod.month = parseInt(e.target.value);
            updateDashboard();
        });
    }

    if (yearSelect) {
        yearSelect.addEventListener('change', (e) => {
            currentPeriod.year = parseInt(e.target.value);
            updateDashboard();
        });
    }

    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        const icon = toggleBtn.querySelector('i');
        icon.classList.toggle('fa-chevron-left');
        icon.classList.toggle('fa-chevron-right');
    });

    function setupProjectTable() {
        const tableHead = document.getElementById('table-head');
        const tableTitle = document.getElementById('table-title');

        tableTitle.textContent = 'Projects';
        tableHead.innerHTML = `
        <tr>
        <th>Project Name</th>
        <th>Revenue</th>
        <th>Cost</th>
        <th>Profit</th>
        <th>Status</th>
        <th>Actions</th>
        </tr>
        `;
    }
    setupProjectTable();

    const modal = document.getElementById('modal');
    const addBtn = document.getElementById('add-item-btn');
    const closeBtn = document.getElementById('close-modal');

    addBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
        if (e.target === empModal) {
            empModal.style.display = 'none';
        }
    });

    const empModal = document.getElementById('modal-employee');
    const addEmpBtn = document.getElementById('add-employee-btn');
    const closeEmpBtn = document.getElementById('close-modal-employee');
    const empForm = document.getElementById('employee-form');
    const saveEmpBtn = empForm.querySelector('.save-btn');
    const projectForm = document.getElementById('project-form');
    const saveProjBtn = projectForm.querySelector('.save-btn');

    saveEmpBtn.disabled = true;
    saveEmpBtn.style.opacity = "0.5";
    saveProjBtn.disabled = true;
    saveProjBtn.style.opacity = "0.5";

    addEmpBtn.addEventListener('click', () => {
        empModal.style.display = 'flex';
    });
    closeEmpBtn.addEventListener('click', () => {
        empModal.style.display = 'none';
    });

    empForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const dobValue = document.getElementById('e-dob').value;
        if (!dobValue) return;

        const dob = new Date(dobValue);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        if (age < 18) {
            alert("The employee must be over 18 years old!");
            return;
        }

        const newEmp = {
            name: document.getElementById('e-name').value,
            position: document.getElementById('e-position').value,
            salary: Number(document.getElementById('e-salary').value),
            status: document.getElementById('e-status').value,
            dob: dobValue
        };
        currentEmployees.push(newEmp);

        saveData(currentEmployees, currentProjects);
        renderEmployeesTable(currentEmployees);
        empModal.style.display = 'none';
        empForm.reset();

    });

    function checkAge(dobValue) {
        if (!dobValue) return false;
        const dob = new Date(dobValue)
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        return age >= 18;
    }

    empForm.addEventListener('input', () => {
        const dobValue = document.getElementById('e-dob').value;
        const isValid = empForm.checkValidity() && checkAge(dobValue);

        saveEmpBtn.disabled = !isValid;
        saveEmpBtn.style.opacity = isValid ? "1" : "0.5";
    });

    projectForm.addEventListener('input', () => {
        const isValid = projectForm.checkValidity();
        saveProjBtn.disabled = !isValid;
        saveProjBtn.style.opacity = isValid ? "1" : "0.5";
    });

    const empThead = document.querySelector('.order-table thead');

    if (empThead) {
        empThead.addEventListener('click', (e) => {
            const key = e.target.dataset.key;
            if (e.target.tagName === 'TH' && key && key !== 'Actions') {
                currentEmployees.sort((a, b) => {
                    const valA = a[key];
                    const valB = b[key];
                    if (typeof valA === 'number') {
                        return valA - valB;
                    } else {
                        return String(valA).localeCompare(String(valB));
                    }
                });
                renderEmployeesTable(currentEmployees);
    }
})
    }


const loadedData = loadData();
if (loadedData.employees.length === 0 && loadedData.projects.length === 0) {
    console.log("LocalStorage is empty.");
    currentEmployees = [...orders];
    currentProjects = [...initialProjects];
    saveData(currentEmployees, currentProjects);
} else {
    console.log("Loading data from localStorage...");
    currentEmployees = loadedData.employees;
    currentProjects = loadedData.projects;
}

projectForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newObj = {
        name: document.getElementById('p-name').value,
        revenue: Number(document.getElementById('p-revenue').value),
        cost: Number(document.getElementById('p-cost').value),
        status: document.getElementById('p-status').value
    };

    currentProjects.push(newObj);
    saveData(currentEmployees, currentProjects);

    renderProjectsTable(currentProjects);
    modal.style.display = 'none';
    projectForm.reset();
});

const tableBody = document.getElementById('table-body');
if (tableBody) {
    tableBody.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            const index = deleteBtn.dataset.index;
            currentProjects.splice(index, 1);
            saveData(currentEmployees, currentProjects);
            renderProjectsTable(currentProjects);
        }
    });
}
const empTableBody = document.getElementById('employees-body');
if (empTableBody) {
    empTableBody.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            const index = deleteBtn.dataset.index;
            currentEmployees.splice(index, 1);
            saveData(currentEmployees, currentProjects);
            renderEmployeesTable(currentEmployees);
        }
    });
}
const empTableContainer = document.getElementById('orders-body');
if (empTableContainer) {
    empTableContainer.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            const index = deleteBtn.dataset.index;
            currentEmployees.splice(index, 1);
            saveData(currentEmployees, currentProjects);
            renderEmployeesTable(currentEmployees);
        }
    });
}
updateDashboard();
});

