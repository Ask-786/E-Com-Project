async function incrementButton(index, id) {
  var result = document.getElementById(`sst${index}`);
  var sst = result.value;
  if (!isNaN(sst)) {
    let response = await axios.get(`/cart-item-increment?id=${id}`);
    if (response.data.denied) {
      location.href = "/login";
    } else {
      if (response.data.noStock) {
        showPopupError("No stock more than the limit");
      } else {
        if (response.data.type === "percentage") {
          if (response.data.max) {
            $("#cart-discount-price p").text(
              `${response.data.discount} (MAX!!)`
            );
            $("#cart-total-price").text(response.data.grandtotal);
            result.value = response.data.count;
            $(`#sub-total-per-item${index}`).text(
              `₹ ${response.data.subtotal}`
            );
            $("#products-only-total p").text(response.data.grandtotal);
            changeTotalPrice(response.data.total);
          } else {
            $("#cart-discount-price p").text(
              `${response.data.discount} (${response.data.deduction}%)`
            );
            $("#cart-total-price").text(response.data.grandtotal);
            result.value = response.data.count;
            $(`#sub-total-per-item${index}`).text(
              `₹ ${response.data.subtotal}`
            );
            $("#products-only-total p").text(response.data.grandtotal);
            changeTotalPrice(response.data.total);
          }
        } else if (response.data.type === "amount") {
          $("#products-only-total p").text(response.data.grandtotal);
          $("#cart-discount-price p").text(`₹ ${response.data.deduction}`);
          $("#cart-total-price").text(response.data.grandtotal);
          result.value = response.data.count;
          $(`#sub-total-per-item${index}`).text(`₹ ${response.data.subtotal}`);
          changeTotalPrice(response.data.total);
        } else {
          result.value = response.data.count;
          $(`#sub-total-per-item${index}`).text(`₹ ${response.data.subtotal}`);
          $("#products-only-total p").text(response.data.grandtotal);
          changeTotalPrice(response.data.grandtotal);
        }
      }
    }
  }
  return false;
}

async function decrementButton(index, id, price) {
  var result = document.getElementById(`sst${index}`);
  var sst = result.value;
  if (!isNaN(sst) && sst > 1) {
    var response = await axios.get(`/cart-item-decrement?id=${id}`);
    if (response.data.denied) {
      location.href = "/login";
    } else {
      if (response.data.status === true) {
        if (response.data.type === "percentage") {
          if (response.data.max) {
            $("#cart-discount-price p").text(
              `${response.data.discount} (MAX!!)`
            );
            $("#cart-total-price").text(response.data.grandtotal);
            result.value = response.data.count;
            $(`#sub-total-per-item${index}`).text(
              `₹ ${response.data.subtotal}`
            );
            $("#products-only-total p").text(response.data.grandtotal);
            changeTotalPrice(response.data.total);
          } else {
            $("#cart-discount-price p").text(
              `${response.data.discount} (${response.data.deduction}%)`
            );
            $("#cart-total-price").text(response.data.grandtotal);
            result.value = response.data.count;
            $(`#sub-total-per-item${index}`).text(
              `₹ ${response.data.subtotal}`
            );
            $("#products-only-total p").text(response.data.grandtotal);
            changeTotalPrice(response.data.total);
          }
        } else if (response.data.type === "amount") {
          $("#products-only-total p").text(response.data.grandtotal);
          $("#cart-discount-price p").text(`₹ ${response.data.discount}`);
          result.value = response.data.count;
          $(`#sub-total-per-item${index}`).text(`₹ ${response.data.subtotal}`);
          changeTotalPrice(response.data.total);
        } else {
          result.value = response.data.count;
          $(`#sub-total-per-item${index}`).text(`₹ ${response.data.subtotal}`);
          $("#products-only-total p").text(response.data.grandtotal);
          changeTotalPrice(response.data.grandtotal);
        }
      } else {
        showPopupError(response.data.message);
      }
    }
  } else {
    showPopupError("Minimum value is 1. Deleted the item instead");
  }
  return false;
}

async function deleteButton(id) {
  var response = await axios.get(`/cart-item-delete?id=${id}`);
  if (response.data.status) {
    changeTotalPrice(response.data.grandtotal);
    location.href = "/cart";
    showPopupSuccess("Cart Item Deleted Successfully");
  } else {
    showPopupError(response.data.message);
  }
}

function changeTotalPrice(grandtotal) {
  document.getElementById("cart-total-price").innerHTML = `₹ ${grandtotal}`;
}

async function addCoupon() {
  const couponCode = $("#coupon-input").val();
  const response = await axios.post("/cart/verify-coupon", { couponCode });
  const type = response.data.type;
  if (response.data.status === true) {
    if (type === "percentage") {
      if (response.data.max) {
        $("#cart-discount-price p").text(`${response.data.discount} (MAX!!)`);
        $("#cart-total-price").text(response.data.total);
        $("#error-msg").text("Coupon Applied").css("color", "green");
        $("#btn-add-coupon").hide();
        $("#btn-remove-coupon").show();
      } else {
        $("#cart-discount-price p").text(
          `${response.data.discount} (${response.data.deduction}%)`
        );
        $("#cart-total-price").text(response.data.total);
        $("#error-msg").text("Coupon Applied").css("color", "green");
        $("#btn-add-coupon").hide();
        $("#btn-remove-coupon").show();
      }
    } else {
      $("#error-msg").text("Coupon Applied").css("color", "green");
      $("#cart-discount-price p").text(`₹ ${response.data.deduction}`);
      $("#cart-total-price").text(response.data.total);
      $("#btn-add-coupon").hide();
      $("#btn-remove-coupon").show();
    }
  } else {
    const error = $("#error-msg");
    error.text(response.data.message).css("color", "red");
  }
}

async function removeCoupon() {
  const couponCode = $("#coupon-input").val();
  const response = await axios.patch("/cart/remove-coupon", { couponCode });
  if (response.data.denied) {
    location.href = "/login";
  } else {
    if (response.data.removeStatus === true) {
      location.href = "";
    } else {
      showPopupError(response.data.message);
    }
  }
}

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
