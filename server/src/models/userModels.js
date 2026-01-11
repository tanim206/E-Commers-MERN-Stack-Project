const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { defaultImagePath } = require("../secret");
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minlength: [3, "User name must be at least 3 characters"],
      maxlength: [31, "User name can be maximum 30 characters"],
    },
    email: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (v) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
        },
      },
      message: "enter a valid email",
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minlength: [6, "User name must be at least 6 characters"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      type: Buffer,
      default: defaultImagePath,
      // contentType: String,
      // require: [true, "User image  is required"],
    },
    address: {
      type: String,
      require: [true, "User address is required"],
      minlength: [3, " the length of user address can be minimun 3 charecter"],
    },
    phone: {
      type: String,
      require: [true, "User phone is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
