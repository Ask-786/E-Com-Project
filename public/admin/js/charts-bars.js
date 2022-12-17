/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */

$(document).ready(async () => {
  const response = await axios.get("/admin/dash/getBarChartDetails");
  if (response.data.status) {
    const barConfig = {
      type: "bar",
      data: {
        labels: response.data.months,
        datasets: [
          {
            label: "Shoes",
            backgroundColor: getRandomColor(),
            borderWidth: 1,
            data: response.data.dataset,
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
  }
});

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
