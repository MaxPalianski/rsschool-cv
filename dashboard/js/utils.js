function getStorageKey() {
    const period = localStorage.getItem('currentPeriod') || '2026-05';
    return `data_${period}`;
}

export function saveData(employees, projects) {
    const data = {
        employees: employees,
        projects: projects
    };
    localStorage.setItem('companyData', JSON.stringify(data));
}

export function loadData() {
    const data = localStorage.getItem('companyData');
    return data ? JSON.parse(data) : { employees: [], projects: []};
}