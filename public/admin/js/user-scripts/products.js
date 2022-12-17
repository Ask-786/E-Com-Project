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
function goToNext(page, limit) {
  alert(page, limit);
  location.href(`/admin/dash/products?page=${page}&limit=${limit}`);
}
function goToPrevious(page, limit) {
  axios.get(`/admin/dash/products?page=${page}&limit=${limit}`);
}
