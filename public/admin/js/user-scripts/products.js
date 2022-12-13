function deleteAlert(array) {
  document.getElementById(
    "button-delete"
  ).href = `/admin/dash/products/disable-product?id=${array[0]}`;
  document.getElementById("model-header").innerHTML = `Delete ${array[1]} ?`;
  document.getElementById("model-body").innerHTML = `Are You Sure?`;
  document.getElementById("model-sub-1").style.display = "none";
  document.getElementById("model-sub-2").style.display = "none";
  document.getElementById("model-sub-3").style.display = "none";
  document.getElementById("model-sub-4").style.display = "none";
  document.getElementById("model-price").style.display = "none";
}
function showDetails(ob) {
  document.getElementById("model-header").innerHTML = ob[0];
  document.getElementById("model-body").innerHTML = ob[1];
  document.getElementById("model-sub-1").innerHTML = `Size : ${ob[3]}`;
  document.getElementById("model-sub-2").innerHTML = `Stock : ${ob[4]}`;
  document.getElementById("model-sub-3").innerHTML = `createdAt : ${ob[5]}`;
  document.getElementById("model-sub-4").innerHTML = `updatedAt : ${ob[6]}`;
  document.getElementById("model-price").innerHTML = `Price : ${ob[2]}`;
  document.getElementById("model-image-1").src = `/products-images/${ob[7]}`;
  document.getElementById("model-image-2").src = `/products-images/${ob[8]}`;
  document.getElementById("model-image-3").src = `/products-images/${ob[9]}`;
  document.getElementById("model-image-4").src = `/products-images/${ob[10]}`;
}
function goToNext(page, limit) {
  alert(page, limit);
  location.href(`/admin/dash/products?page=${page}&limit=${limit}`);
}
function goToPrevious(page, limit) {
  axios.get(`/admin/dash/products?page=${page}&limit=${limit}`);
}
