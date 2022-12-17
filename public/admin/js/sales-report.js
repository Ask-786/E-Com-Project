$("#get-button").click(async () => {
  const from = $("#from-date").val();
  const to = $("#to-date").val();
  if (from !== "" && to !== "") {
    if (from < to) {
      const response = await axios.post("/admin/dash/queried-sales-report", {
        from,
        to,
      });
      if (response.data.status === true) {
        const orders = response.data.orders;
        const total = response.data.totalPrice;
        if (orders.length > 0) {
          $("#orders-table-div").show();
          $("#orders-table-body").empty();
          for (let i = 0; i < orders.length; i++) {
            $("#orders-table-body")
              .append(`<tr class="text-gray-700 dark:text-gray-400">
            <td class="px-4 py-3">
                <a
                    href="/admin/dash/orders/order-details?id=${orders[i]._id}">
                    <div class="flex items-center text-sm">
                        <p class="font-semibold" style="overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis; max-width:20em;">
                    ${orders[i].user.fullname}
                        </p>
                    </div>
                </a>
            </td>
            <td class="px-4 py-3 text-sm">
            ${orders[i].orderStatus}
            </td>
            <td class="px-4 py-3 text-sm">
            ${orders[i].paymentDetails.paymentType}/${orders[i].paymentDetails.paymentStatus}

            </td>
            <td class="px-4 py-3 text-sm">
            ${orders[i].createdAt}
            </td>
            <td class="px-4 py-3 text-sm">
            ${orders[i].finalPrice}
            </td>
        </tr>`);
          }
          $("#orders-table-body").append(`<tr
          class="text-xs mt-1 font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
          <th class="px-4 py-3">Total</th>
          <th class="px-4 py-3"></th>
          <th class="px-4 py-3"></th>
          <th class="px-4 py-3"></th>
          <th class="px-4 py-3">
              ${total}
          </th>
      </tr>`);
          $("#orders-heading").text(`Orders From ${from} to ${to}`);
          $("#pagination-div").hide();
        } else {
          $("#orders-heading").text("No Orders inside the selected Date");
          $("#orders-table-div").hide();
          $("#btnExport").hide();
        }
      } else {
        showPopupError("Choose a To Date Less Than Now");
      }
    } else {
      showPopupError("From Should be less than to");
    }
  } else {
    showPopupError("Select Both fields");
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
