async function sayHello(id) {
  let response = await axios.get(`/userprofile/delete-address?id=${id}`);
  if (response.data.denied) {
    location.href = "/login";
  } else {
    if (response.data.status) {
      location.href = "/userprofile";
    } else {
      location.href = "/home";
    }
  }
}
