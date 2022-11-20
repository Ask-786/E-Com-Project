const multer = require("multer");

const productImageStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log("hellopro");
    callback(null, "./public/products-images");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const categoryImageStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/category-images");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const uploadProductImgs = multer({ storage: productImageStorage }).array(
  "image",
  4
);
const uploadCategoryImg = multer({ storage: categoryImageStorage }).single(
  "image"
);

module.exports = { uploadProductImgs, uploadCategoryImg };
