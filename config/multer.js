const multer = require("multer");

const productImageStorage = multer.diskStorage({
  destination: (req, file, callback) => {
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

const uploadProductImgs = multer({ storage: productImageStorage }).fields([
  {
    name: "image0",
    maxCount: 1,
  },
  {
    name: "image1",
    maxCount: 1,
  },
  {
    name: "image2",
    maxCount: 1,
  },
  {
    name: "image3",
    maxCount: 1,
  },
]);
const uploadCategoryImg = multer({ storage: categoryImageStorage }).single(
  "image"
);

module.exports = { uploadProductImgs, uploadCategoryImg };
