const input0 = $("#input-image0");
$("#input-image0").change(function () {
  const img_data = input0[0].files[0];
  const url = URL.createObjectURL(img_data);
  $("#image0").html(`<img src="${url}" id="toCropImage0" style="width:100%;">`);
  const image = $("#toCropImage0");

  $("#image0").css("display", "block");
  $("#btnCrop0").css("display", "block");

  const cropper = new Cropper(image[0], {
    aspectRatio: 37 / 52,
    autoCropArea: 1,
    viewMode: 1,
    scalable: false,
    zoomable: false,
    movable: false,
    minCropBoxWidth: 200,
    minCropBoxHeight: 200,
  });
  $("#btnCrop0").click(function () {
    cropper.getCroppedCanvas().toBlob((blob) => {
      let fileInputElement = $("#input-image0");

      let file = new File([blob], img_data.name, {
        type: "image/",
        lastModified: new Date().getTime(),
      });

      let container = new DataTransfer();

      container.items.add(file);

      fileInputElement[0].files = container.files;

      $("#image0").css("display", "none");
      $("#btnCrop0").css("display", "none");
    });
  });
});
