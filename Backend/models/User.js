import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  classesAttempted: {
    type: Number,
    default: 0,
  },

  averageAttentiveness: {
    type: Number,
    default: 0,
  },

  lastClassAttentiveness: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model('User', userSchema);