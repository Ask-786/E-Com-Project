async function deleteButton(id) {
  let response = await axios.get(`/favorites-item-delete?id=${id}`);
  if (response.data.status) {
    location.href = "/favorites";
    showPopupSuccess("Item Deleted");
  } else {
    location.href = "/favorites";
    showPopupError("Something went wrong");
  }
}

async function addToCart(id) {
  let response = await axios.get(`/shop/addtocart?id=${id}`);
  if (response.data.denied) {
    location.href = "/login";
  } else {
    if (response.data.alert) {
      showPopupSuccess("Added to Cart");
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
