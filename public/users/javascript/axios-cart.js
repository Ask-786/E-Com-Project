async function incrementButton(index, id, price) {
  let response = await axios.get(`/cart-item-increment?id=${id}`);
  var result = document.getElementById(`sst${index}`);

  document.getElementById(
    `sub-total-per-item${index}`
  ).innerHTML = `$ ${response.data.subtotal}`;

  var sst = result.value;
  if (!isNaN(sst)) {
    result.value = response.data.count;
  }
  changeTotalPrice(response.data.grandtotal);
  return false;
}

async function decrementButton(index, id, price) {
  var response = await axios.get(`/cart-item-decrement?id=${id}`);
  var result = document.getElementById(`sst${index}`);
  document.getElementById(
    `sub-total-per-item${index}`
  ).innerHTML = `$ ${response.data.subtotal}`;
  var sst = result.value;
  if (!isNaN(sst) && sst > 1) {
    result.value = response.data.count;
  }
  changeTotalPrice(response.data.grandtotal);
  return false;
}

async function deleteButton(index, id) {
  var response = await axios.get(`/cart-item-delete?id=${id}`);
  changeTotalPrice(response.data.grandtotal);
  location.href = "/cart";
}

function changeTotalPrice(grandtotal) {
  document.getElementById("cart-total-price").innerHTML = `$ ${grandtotal}`;
}
