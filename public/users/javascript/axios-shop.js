async function addToCart(id) {
  let response = await axios.get(`/shop/addtocart?id=${id}`);
  if (response.data.denied) {
    location.href = "/login";
  } else {
    if (response.data.alert) {
      showPopupSuccess("Item Added to cart");
    } else {
      showPopupError(response.data.message);
    }
  }
}

async function addToFavorites(id) {
  let response = await axios.get(`/shop/addtofavorites?id=${id}`);
  if (response.data.denied) {
    location.href = "/login";
  } else {
    if (response.data.status) {
      showPopupSuccess("Added to Favorites Successfully");
    } else {
      showPopupError("Already Exists in Favorites");
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
