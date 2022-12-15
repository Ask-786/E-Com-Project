/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */

$(document).ready(async () => {
  const response = await axios.get("/admin/dash/getPieChartDetails");
  if (response.data.status) {
    const groupedOrderData = response.data.groupedOrderData;
    const pieConfig = {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: groupedOrderData.map((el) => {
              return el.quantity;
            }),
            /**
             * These colors come from Tailwind CSS palette
             * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
             */
            backgroundColor: [
              "#0694a2",
              "#1c64f2",
              "#7e3af2",
              "#1c64f2",
              "#7e3af2",
              "#7e3af2",
            ],
            label: "Dataset 1",
          },
        ],
        labels: groupedOrderData.map((el) => {
          return el.name;
        }),
      },
      options: {
        responsive: true,
        cutoutPercentage: 0,
        /**
         * Default legends are ugly and impossible to style.
         * See examples in charts.html to add your own legends
         *  */
        legend: {
          display: true,
          position: "bottom",
          boxWidth: 10,
        },
      },
    };

    // change this to the id of your chart element in HMTL
    const pieCtx = document.getElementById("pie");
    window.myPie = new Chart(pieCtx, pieConfig);
  } else {
    showPopupError(response.data.message);
  }
});

function showPopupSuccess(message) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  Toast.fire({
    icon: "success",
    title: message,
  });
}

function showPopupError(message) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  Toast.fire({
    icon: "error",
    title: message,
  });
}
