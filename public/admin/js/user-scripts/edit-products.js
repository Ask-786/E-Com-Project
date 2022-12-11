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

const input1 = $("#input-image1");
$("#input-image1").change(function () {
  const img_data = input1[0].files[0];
  const url = URL.createObjectURL(img_data);
  $("#image1").html(`<img src="${url}" id="toCropImage1" style="width:100%;">`);
  const image = $("#toCropImage1");

  $("#image1").css("display", "block");
  $("#btnCrop1").css("display", "block");

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
  $("#btnCrop1").click(function () {
    cropper.getCroppedCanvas().toBlob((blob) => {
      let fileInputElement = $("#input-image1");

      let file = new File([blob], img_data.name, {
        type: "image/",
        lastModified: new Date().getTime(),
      });

      let container = new DataTransfer();

      container.items.add(file);

      fileInputElement[0].files = container.files;

      $("#image1").css("display", "none");
      $("#btnCrop1").css("display", "none");
    });
  });
});

const input2 = $("#input-image2");
$("#input-image2").change(function () {
  const img_data = input2[0].files[0];
  const url = URL.createObjectURL(img_data);
  $("#image2").html(`<img src="${url}" id="toCropImage2" style="width:100%;">`);
  const image = $("#toCropImage2");

  $("#image2").css("display", "block");
  $("#btnCrop2").css("display", "block");

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
  $("#btnCrop2").click(function () {
    cropper.getCroppedCanvas().toBlob((blob) => {
      let fileInputElement = $("#input-image2");

      let file = new File([blob], img_data.name, {
        type: "image/",
        lastModified: new Date().getTime(),
      });

      let container = new DataTransfer();

      container.items.add(file);

      fileInputElement[0].files = container.files;

      $("#image2").css("display", "none");
      $("#btnCrop2").css("display", "none");
    });
  });
});

const input3 = $("#input-image3");
$("#input-image3").change(function () {
  const img_data = input3[0].files[0];
  const url = URL.createObjectURL(img_data);
  $("#image3").html(`<img src="${url}" id="toCropImage3" style="width:100%;">`);
  const image = $("#toCropImage3");

  $("#image3").css("display", "block");
  $("#btnCrop3").css("display", "block");

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
  $("#btnCrop3").click(function () {
    cropper.getCroppedCanvas().toBlob((blob) => {
      let fileInputElement = $("#input-image3");

      let file = new File([blob], img_data.name, {
        type: "image/",
        lastModified: new Date().getTime(),
      });

      let container = new DataTransfer();

      container.items.add(file);

      fileInputElement[0].files = container.files;

      $("#image3").css("display", "none");
      $("#btnCrop3").css("display", "none");
    });
  });
});
