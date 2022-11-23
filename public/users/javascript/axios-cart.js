async function incrementButton(index, id, price) {
  var result = document.getElementById(`sst${index}`);
  var sst = result.value;
  if (!isNaN(sst)) {
    let response = await axios.get(`/cart-item-increment?id=${id}`);
    document.getElementById(
      `sub-total-per-item${index}`
    ).innerHTML = `$ ${response.data.subtotal}`;

    if (response.data.denied) {
      location.href = "/login";
    } else {
      result.value = response.data.count;
      changeTotalPrice(response.data.grandtotal);
    }
  }
  return false;
}

async function decrementButton(index, id, price) {
  var result = document.getElementById(`sst${index}`);
  var sst = result.value;
  if (!isNaN(sst) && sst > 1) {
    var response = await axios.get(`/cart-item-decrement?id=${id}`);
    document.getElementById(
      `sub-total-per-item${index}`
    ).innerHTML = `$ ${response.data.subtotal}`;

    if (response.data.denied) {
      location.href = "/login";
    } else {
      result.value = response.data.count;
      changeTotalPrice(response.data.grandtotal);
    }
  }
  return false;
}

async function deleteButton(id) {
  var response = await axios.get(`/cart-item-delete?id=${id}`);
  changeTotalPrice(response.data.grandtotal);
  location.href = "/cart";
}

function changeTotalPrice(grandtotal) {
  document.getElementById("cart-total-price").innerHTML = `$ ${grandtotal}`;
}
