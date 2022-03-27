const mongoose = require('mongoose');
const isImageUrl = require('is-image-url');

const validator = (url) => isImageUrl(url);
const imageValidator = [validator, 'Please enter a valid image URL!'];

const { Schema } = mongoose;

// comment schema to be embedded in post schema
const comments = {
  text: { type: String, required: true },
  creator: {
    type: Schema.Types.ObjectId,
    ref: process.env.USER_MODEL_NAME,
    required: true,
  },
};
const postSchema = new Schema(
  {
    title: {
      type: String,
      maxLength: [
        30,
        'Item name should have max length of 30 characters only.',
      ],
      required: [true, 'Item title is required'],
    },
    type: [
      {
        type: String,
        required: [true, 'Type is required'],
      },
    ],
    description: {
      type: Object,
      required: [true, 'Description is required'],
    },
    isSold: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      required: [true, 'Item photo is required'],
      validate: imageValidator,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price should be greater than 0'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: process.env.USER_MODEL_NAME,
      required: [true, 'Owner reference is required'],
    },
    comments: [comments],
  },
  { timestamps: true }
);

const modelName = process.env.POST_MODEL_NAME;
module.exports = mongoose.model(modelName, postSchema);
