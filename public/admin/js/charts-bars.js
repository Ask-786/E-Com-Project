/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */

const barConfig = {
  type: "bar",
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Shoes",
        backgroundColor: "#0694a2",
        borderWidth: 1,
        data: [14, 52, 74, 33, 90, 70],
      },
      {
        label: "Bags",
        backgroundColor: "#7e3af2",
        borderWidth: 1,
        data: [33, 43, 12, 54, 62, 84],
      },
    ],
  },
  options: {
    responsive: true,
    legend: {
      display: false,
    },
  },
};

const barsCtx = document.getElementById("bars");
window.myBar = new Chart(barsCtx, barConfig);

$(document).ready(async () => {
  const response = await axios.get("/admin/dash/getBarChartDetails");
  if (response.data.status) {
  }
});
