import mongoose from "mongoose";

const headmanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: false,
    },
    address: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },
    image: {
      type: String,
      required: false,
    },
    payment_status: {
      type: String,
      enum: ["Paid", "Partial", "Unpaid"],
      default: "Paid",
    },
    user_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
  },
  { timestamps: true }
);

const headmanModel =
  mongoose.models.Headman || mongoose.model("Headman", headmanSchema);

export default headmanModel;
