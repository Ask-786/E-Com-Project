const { response } = require("express");
const fs = require("fs");
const { promisify } = require("util");
const unLink = promisify(fs.unlink);

const deleteCategoryImage = async (fileName) => {
  return new Promise(async (resolve, reject) => {
    await unLink(`./public/category-images/${fileName}`);
    resolve(true);
  });
};

const deleteProductImages = (files) => {
  return new Promise(async (resolve, reject) => {
    for (i = 0; i < files.length; i++) {
      await unLink(`./public/products-images/${files[i]}`);
    }
    resolve(true);
  });
};

module.exports = { deleteCategoryImage, deleteProductImages };
