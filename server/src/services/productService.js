const slugify = require("slugify");
const createErrors = require("http-errors");
const Product = require("../models/productModels");
const { deleteImage } = require("../helper/deleteImage");

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

const getProducts = async (page = 1, limit = 4, filter = {}) => {
  const products = await Product.find(filter)
    .populate("category")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  if (!products) throw createErrors(404, "No Products Found");
  const countProducts = await Product.find(filter).countDocuments();
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
const deleteProduct = async (slug) => {
  const product = await Product.findOneAndDelete({ slug });
  if (!product) throw createErrors(404, "No Product Found");
  if (product.image) {
    await deleteImage(product.image);
  }
  return product;
};
const updateProduct = async (slug, req) => {
  try {
    const product = await Product.findOne({ slug: slug });
    if (!product) {
      throw createErrors(404, "Product not found");
    }
    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates = {};
    const allowedFields = [
      "name",
      "description",
      "price",
      "sold",
      "quantity",
      "shipping",
    ];
    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        if (key === "name") {
          updates.slug = slugify(req.body[key]);
        }
        updates[key] = req.body[key];
      }
    }
    const image = req.file?.path;
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw new Error("File too large. It must be less then 2mb");
      }
      updates.image = image;
      product.image !== "default.png" && deleteImage(product.image);
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { slug },
      updates,
      updateOptions,
    );
    if (!updatedProduct) {
      throw createErrors(404, "Product updated not possible");
    }
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
