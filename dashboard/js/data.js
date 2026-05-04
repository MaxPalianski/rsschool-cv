export function getCurrentStats(employees, projects) {
    return [
        {
            title: 'Total Profit',
            value: `$${projects.reduce((sum, p) => sum + (p.revenue - p.cost), 0).toLocaleString()}`,
            trend: '+15%'
        },
        {
            title: 'Total Employees',
            value: employees.length,
            trend: 'Active'
        },
        {
            title: 'Active Projects',
            value: projects.length,
            trend: 'In Progress'
        }
    ];
}

export const orders = [
    { name: 'John Marston', position: 'Project Manager', salary: 5000, status: 'Active' },
    { name: 'Vi', position: 'Security Chief', salary: 4200, status: 'Active' },
    { name: 'Thrall', position: 'Senior Developer', salary: 4800, status: 'On Leave' },
    { name: 'Sylvanas Windrunner', position: 'QA Engineer', salary: 3900, status: 'Active' }
];

export let currentPeriod = {
    month: new Date().getMonth(),
    year: 2026
};

export function loadData() {
    const allData = JSON.parse(localStorage.getItem('monthlyData')) || {};
    const monthData = allData[getStorageKey()];

    return monthData || { employees: [], projects: [] };
}

export function saveData(employees, projects) {
    const allData = JSON.parse(localStorage.getItem('monthlyData')) || {};
    allData[getStorageKey()] = { employees, projects };
    localStorage.setItem('monthlyData', JSON.stringify(allData));

}

const getStorageKey = () => `${currentPeriod.year}-${currentPeriod.month}`;
export const initialProjects = [
    { name: 'SkyDash Redesign', revenue: 15000, cost: 5000, status: 'In Progress' },
    { name: 'Mobile App', revenue: 8000, cost: 10000, status: 'On Hold' },
    { name: 'Backend API', revenue: 25000, cost: 12000, status: 'Completed' }
];