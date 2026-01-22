const { Schema, model } = require("mongoose");
// name-slug-description-price-quantity-sold-shoping-iamge
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      unique: true,
      minlength: [3, "Product name must be at least 3 characters long"],
      maxlength: [150, "Product name must not exceed 105 characters"],
    },

    slug: {
      type: String,
      required: [true, "Product slug is required"],
      lowercase: true,
      unique: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [3, "Product description must be at least 3 characters long"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      validate: {
        validator: (v) => v >= 0,
        message: (props) =>
          `Product price cannot be negative. Received value: ${props.value}`,
      },
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      trim: true,
      validate: {
        validator: (v) => v >= 0,
        message: (props) =>
          `Product quantity cannot be negative. Received value: ${props.value}`,
      },
    },
    sold: {
      type: Number,
      required: [true, "Product sold is required"],
      trim: true,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0, //  Shipping Free "0" or paid something Ammount
    },
    image: {
      type: Buffer,
      contentType: String,
      require: [true, "Product image  is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
  },
  { timestamps: true },
);

const Product = model("Product", productSchema);

module.exports = Product;
