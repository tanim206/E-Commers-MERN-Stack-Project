const slugify = require("slugify");
const createErrors = require("http-errors");
const Product = require("../models/productModels");

const createProduct = async (productData) => {
  const {
    name,
    description,
    price,
    quantity,
    shipping,
    category,
    imageBufferString,
  } = productData;
  // user exists
  const productExists = await Product.exists({ name: name });
  if (productExists) {
    throw createErrors(409, "Product with this name already existed.");
  }
  //  create products
  const product = await Product.create({
    name: name,
    slug: slugify(name),
    description: description,
    price: price,
    quantity: quantity,
    shipping: shipping,
    image: imageBufferString,
    category: category,
  });
  return product;
};

module.exports = {
  createProduct,
};
