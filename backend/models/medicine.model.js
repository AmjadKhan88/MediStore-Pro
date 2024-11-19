import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: "true",
    },
    expiry_date: {
      type: String,
      required: true,
    },
    used_for: {
      type: String,
      required: false,
    },
    miligram: {
      type: Number,
    },
    registry_no: {
      type: Number,
    },
    safety_info: {
      type: String,
      required: false,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

const medicineModel =mongoose.models.Medicine || mongoose.model('Medicine',medicineSchema)

export default medicineModel;