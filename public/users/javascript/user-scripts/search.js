$("#search-form").submit((e) => {
  e.preventDefault();
});

document.getElementById("search-button").onclick = () => {
  const searchData = $("#searchData").val();
  if (window.location.pathname == "/shop") {
    productSearch();
  } else {
    location.href = `/shop?searchData=${searchData}`;
  }
};
async function productSearch() {
  const searchData = $("#searchData").val();
  if (searchData.length > 2) {
    const response = await axios.get(`/shop/search?searchData=${searchData}`);
    if (response.data.status) {
      const product = response.data.products;
      if (product.length > 0) {
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
                    <h5>
                    ₹ ${product[i].price}
                    </h5>
                </div>
                </div>
            </div>`);
        }
        $("#pagination_area").hide();
      } else {
        showPopupError("No results!!");
      }
    }
  }
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
