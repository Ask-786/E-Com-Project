function deleteAddress(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let response = await axios.get(`/userprofile/delete-address?id=${id}`);
      if (response.data.denied) {
        location.href = "/login";
      } else {
        if (response.data.status) {
          location.href = "/userprofile";
        }
      }
    }
  });
}
