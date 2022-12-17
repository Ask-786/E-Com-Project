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

async function categorySearch(id) {
  const response = await axios.get(`/shop?category=${id}`);
  if (response.data.status) {
    const product = response.data.products;
    $("#all-products").empty();
    for (let i = 0; i < product.length; i++) {
      $("#all-products").append(`<div class="col-lg-4 col-sm-6">
          <div class="l_product_item">
          <div class="l_p_img">
              <a href="/shop/product?id=${product[i]._id}">
              <img src="/products-images/${product[i].images[0]}" alt="" height="100%" width="100%">
              <h5 class="new">New</h5>
              </a>
          </div>
          <div class="l_p_text">
              <ul>
              <li class="p_icon"><a style="cursor: pointer;"><i class="icon_piechart"></i></a></li>

              <li><button class="add_cart_btn" onclick="addToCart('${product[i]._id}')"
                  style="cursor: pointer;">Add To Cart</button>
              </li>

              <li class="p_icon"><a onclick="addToFavorites('${product[i]._id}')"><i
                      class="icon_heart_alt"></i></a></li>
              </ul>
              <h4>
                  ${product[i].title}
              </h4>
          </div>
          </div>
      </div>`);
    }
    $("#pagination_area").hide();
  } else {
    showPopupError("No Products in That Category ");
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
