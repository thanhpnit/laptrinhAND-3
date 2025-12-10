const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
