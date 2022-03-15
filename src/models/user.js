const mongoose = require('mongoose');
const isImageUrl = require('is-image-url');

const validator = (url) => isImageUrl(url);
const imageValidator = [validator, 'Please enter a valid image URL!'];
const { Schema } = mongoose;
// raters schema to be embedded in user schema
const rates = {
  rate: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  rater: {
    type: Schema.Types.ObjectId,
    ref: process.env.USER_MODEL_NAME,
    required: true,
  },
};
const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password_hash: {
    type: String,
    required: [true, 'Password is required'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    validate: imageValidator,
    default:
      'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
  },
  acceptTerms: {
    type: Boolean,
  },
  posts: [{ type: Schema.Types.ObjectId, ref: process.env.POST_MODEL_NAME }],
  rates: [rates],
});

const modelName = process.env.USER_MODEL_NAME;
module.exports = mongoose.model(modelName, userSchema);
