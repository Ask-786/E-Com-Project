async function submitCheckout(cartId) {
  const addressId = $("a[aria-expanded |= 'true']#address").data("id");
  const payType = $("a[aria-expanded |= 'true']#payment").data("payment");
  if (addressId === undefined || payType === undefined) {
    showPopupErr("please select all fields");
  } else {
    let response = await axios.post("/cart/checkout", {
      address: addressId,
      payType,
      cartId,
    });
    if (response.data.denied) {
      location.href = "/login";
    } else {
      if (response.data.codStatus) {
        location.href = `/cart/checkout/order-confirmation?id=${response.data.order._id}`;
      } else if (response.data.rzSuccess) {
        checkoutOptions(
          response.data.order,
          response.data.keyId,
          response.data.user,
          response.data.address,
          response.data.payType
        );
      } else {
        showPopupErr("Something went wrong !");
      }
    }
  }
}

async function checkoutOptions(order, keyId, user, addressId, payType) {
  var options = {
    key: keyId,
    amount: order.amount,
    currency: "INR",
    name: "PERSUIT",
    description: "Product Purchase",
    image: "https://example.com/your_logo",
    order_id: order.id,
    handler: async function (response) {
      await verifyPayment(response, order, addressId, payType);
    },
    prefill: {
      name: user.fullname,
      email: user.email,
      contact: user.phone,
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };
  var rzp1 = new Razorpay(options);
  rzp1.on("payment.failed", function (response) {
    showPopupErr(response.error.description);
  });
  rzp1.open();
}

async function verifyPayment(response, order, addressId, payType) {
  await axios
    .post("/cart/checkout/verify-payment", {
      response,
      order,
      addressId,
      payType,
    })
    .then((response) => {
      if (response.data.rzStatus) {
        location.href = `/cart/checkout/order-confirmation?id=${response.data.order._id}`;
      } else {
        showPopupErr("Something went wrong !");
      }
    });
}

function showPopupErr(message) {
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
