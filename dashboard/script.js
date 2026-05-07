import { updateDateTime } from "./js/ui.js";
import { renderStats } from "./js/ui.js";
import { renderOrders } from "./js/ui.js";
import { renderSimpleChart } from "./js/charts.js";
import { saveData, loadData, orders, initialProjects, currentPeriod, getCurrentStats } from "./js/data.js";
import { renderEmployeesTable, renderProjectsTable } from "./js/ui.js";

let currentProjects = [];
let currentEmployees = [];
let selectedEmployeeIndex = null;

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
            syncLocalData();
            updateDashboard();
        });
    }

    if (yearSelect) {
        yearSelect.addEventListener('change', (e) => {
            currentPeriod.year = parseInt(e.target.value);
            syncLocalData();
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
        <th data-key="name">Project Name<i class = "fas fa-sort"></i></th>
        <th data-key="revenue">Revenue<i class = "fas fa-sort"></i></th>
        <th data-key="cost">Cost<i class = "fas fa-sort"></i></th>
        <th>Profit</th>
        <th data-key="status">Status<i class = "fas fa-sort"></i></th>
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
        console.log("data", dobValue);
        if (!dobValue) {
            alert("Select a date of birth");
            return;
        }

        const dob = new Date(dobValue);
        const today = new Date();

        if (dob > today) {
            alert("Date of birth cannot be in thefuture")
        }

        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        if (age < 18 || age > 65) {
            alert("The employee must be between 18 and 65 years old");
            return;
        }

        const newEmp = {
            name: document.getElementById('e-name').value,
            position: document.getElementById('e-position').value,
            salary: Number(document.getElementById('e-salary').value),
            status: document.getElementById('e-status').value,
            dob: dobValue,
            assignments: []
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

    let sortDirections = {};

    document.querySelectorAll('.order-table').forEach(table => {
        const thead = table.querySelector('thead');
        if (!thead) return;

        thead.addEventListener('click', (e) => {
            const th = e.target.closest('th');
            if (!th || !th.dataset.key || th.dataset.key === 'actions') return;

            const key = th.dataset.key.toLowerCase();

            sortDirections[key] = sortDirections[key] === 'asc' ? 'desc' : 'asc';

            const isEmployees = table.querySelector('#employees-body, #orders-body');
            const targetArray = isEmployees ? currentEmployees : currentProjects;
            const renderFn = isEmployees ? renderEmployeesTable : renderProjectsTable;

            targetArray.sort((a, b) => {
                let valA, valB;

                if (key === 'age') {
                    const getAge = (dob) => {
                        const birth = new Date(dob);
                        if (isNaN(birth)) return 0;
                        return new Date().getFullYear() - birth.getFullYear();
                    };
                    valA = getAge(a.dob);
                    valB = getAge(b.dob);
                } else {
                    valA = a[key];
                    valB = b[key];
                }

                if (typeof valA === 'number' || key === 'age') {
                    const numA = parseFloat(valA) || 0;
                    const numB = parseFloat(valB) || 0;
                    return sortDirections[key] == 'asc' ? numA - numB : numB - numA;
                }
                const straA = String(valA || "");
                const strB = String(valB || "");
                const compare = straA.localeCompare(strB);
                return sortDirections[key] === 'asc' ? compare : -compare;
            });

            thead.querySelectorAll('i.fas').forEach(icon => {
                icon.classList.remove('fa-sort-up', 'fa-sort-down');
                icon.classList.add('fa-sort');
            });

            const icon = th.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-sort');
                icon.classList.add(sortDirections[key] === 'asc' ? 'fa-sort-up' : 'fa-sort-down');
            }

            renderFn(targetArray);
        });
    });

    function syncLocalData() {
        const loadedData = loadData();

        if (loadedData.employees.length === 0 && loadedData.projects.length === 0) {
            currentEmployees = [...orders];
            currentProjects = [...initialProjects];
            saveData(currentEmployees, currentProjects);
        } else {
            currentEmployees = loadedData.employees;
            currentProjects = loadedData.projects;
        }
    }
    syncLocalData();
    updateDashboard();

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
            const deleteBtn = e.target.closest('.delete-project-btn') || e.target.closest('.delete-btn');
            if (deleteBtn) {
                const index = deleteBtn.dataset.index;
                currentProjects.splice(index, 1);
                saveData(currentEmployees, currentProjects);
                renderProjectsTable(currentProjects);
                updateDashboard();
            }
        });
    }
    const empTableBody = document.getElementById('employees-body');
    if (empTableBody) {
        empTableBody.addEventListener('blur', (e) => {
            if (e.target.classList.contains('salary-amount')) {
                const index = e.target.dataset.index;
                const cleanValue = e.target.textContent.replace(/[^0-9.]/g, '');
                const newSalary = Number(cleanValue);

                if (!isNaN(newSalary) && cleanValue !== "") {
                    currentEmployees[index].salary = newSalary;
                    saveData(currentEmployees, currentProjects);

                    renderEmployeesTable(currentEmployees);
                } else {
                    renderEmployeesTable(currentEmployees);
                }
            }
        }, true);
    }
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

    const empBody = document.getElementById('employees-body');
    if (empBody) {
        empBody.addEventListener('click', (e) => {
            const btn = e.target.closest('.assign-btn');
            if (btn) {
                selectedEmployeeIndex = btn.dataset.index;
                const modalAssign = document.getElementById('modal-assign');
                const projectSelect = document.getElementById('assign-project-list');

                projectSelect.innerHTML = currentProjects.map(p =>
                    `<option value="${p.name}">${p.name}</option>`
                ).join('');
                modalAssign.style.display = 'flex';
            }
        });
    }

    const confirmBtn = document.getElementById('confirm-assign');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const projectName = document.getElementById('assign-project-list').value;
            const capacityInput = document.getElementById('assign-capacity');
            const val = capacityInput ? parseFloat(capacityInput.value) : 0;

            if (!projectName || isNaN(val) || val <= 0) {
                alert("Fill all fields correctly");
                return;
            }

            const employee = currentEmployees[selectedEmployeeIndex];
            if (!employee) return;
            if (!employee.assignments) employee.assignments = [];
            const currentTotal = employee.assignments.reduce((sum, a) => sum + (a.capacity || 0), 0);
            if (currentTotal + val > 1.5) {
                alert(`Limit exceeded.Current load: ${currentTotal.toFixed(1)}. You're trying to add: ${val}. Max allowed: 1.5`);
                return;
            }
            employee.assignments.push({
                projectName: projectName,
                capacity: val
            });
            saveData(currentEmployees, currentProjects);
            document.getElementById('modal-assign').style.display = 'none';
            capacityInput.value = '';
            renderEmployeesTable(currentEmployees);
            alert(`Successfully assigned to ${projectName}!`);
        });
    }

    const closeAssignBtn = document.getElementById('close-assign-modal');
    if(closeAssignBtn) {
        closeAssignBtn.addEventListener('click', () => {
            document.getElementById('modal-assign').style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        const modalAssign = document.getElementById('modal-assign');
        if(e.target === modalAssign) {
            modalAssign.style.display = 'none';
        }
    });

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
