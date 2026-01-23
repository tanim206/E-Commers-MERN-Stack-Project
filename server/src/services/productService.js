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

const getProducts = async (page = 1, limit = 4) => {
  const products = await Product.find({})
    .populate("category")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  if (!products) throw createErrors(404, "No Products Found");
  const countProducts = await Product.find({}).countDocuments();
  return {
    products,
    countProducts,
    totalPages: Math.ceil(countProducts / limit),
    currentPage: page,
  };
};
const getProduct = async (slug) => {
  const product = await Product.findOne({ slug }).populate("category");
  if (!product) throw createErrors(404, "No Product Found");
  return product;
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
};
