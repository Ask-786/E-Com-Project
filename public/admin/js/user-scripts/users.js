const {
  checkAuthenticatedAxios,
} = require("../../../../middlwares/userMiddlewares");

function blockAlert(id, name, page, limit) {
  document.getElementById(
    "button-delete"
  ).href = `/admin/dash/users/block-user?id=${id}&page=${page}&limit=${limit} `;
  document.getElementById("model-header").innerHTML = `Block ${name} ?`;
  document.getElementById("model-body").innerHTML = `Are You Sure?`;
  document.getElementById("model-br").style.display = "none";
}
function unblockAlert(id, name, page, limit) {
  document.getElementById(
    "button-delete"
  ).href = `/admin/dash/users/unblock-user?id=${id}&page=${page}&limit=${limit} `;
  document.getElementById("model-header").innerHTML = `Unblock ${name} ?`;
  document.getElementById("model-body").innerHTML = `Are You Sure?`;
}
