const { Schema } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "User name is required"],
    trim: true,
    minlength: [2, "User name must be at least 2 characters"],
    maxlength: [30, "User name can be maximum 30 characters"],
  },
  name: {
    type: String,
    required: [true, "User name is required"],
    trim: true,
    minlength: [2, "User name must be at least 2 characters"],
    maxlength: [30, "User name can be maximum 30 characters"],
  },
});
