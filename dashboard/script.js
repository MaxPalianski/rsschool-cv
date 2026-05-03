import { stats } from "./js/data";
import { renderStats } from "./js/ui";
import { renderSimpleChart } from "./js/charts";

document.addEventListener('DOMContentLoaded', () => {
    renderStats('dashboard-grid', stats);
    renderSimpleChart('chart-container');
});
