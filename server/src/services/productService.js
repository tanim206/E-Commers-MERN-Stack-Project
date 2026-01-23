const slugify = require("slugify");
const createErrors = require("http-errors");
const Product = require("../models/productModels");

const createProduct = async (productData, image) => {
  if (image && image.size > 1024 * 1024 * 5) {
    throw createErrors(400, "file to large . It must be less then 5 MB");
  }
  if (image) {
    productData.image = image;
  }
  // prodcut exists
  const productExists = await Product.exists({ name: productData.name });
  if (productExists) {
    throw createErrors(409, "Product with this name already existed.");
  }
  //  create products
  const product = await Product.create({
    ...productData,
    slug: slugify(productData.name),
  });
  return product;
};

module.exports = {
  createProduct,
};
