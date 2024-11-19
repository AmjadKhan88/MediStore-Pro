import mongoose from 'mongoose';


const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    age: {
      type: Number,
    },
    desciption: {
      type: String,
    },
    allergies: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    address: {
      type: String,
      required: false,
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
    bp: {
      type: String,
      enum: ["High", "Good", "Low"],
    },
    total_charges: {
      type: Number,
      required: true,
    },
    amount_paid: {
      type: Number,
      required: true,
    },
    balance_due: {
      type: Number,
      default: 0,
    },
    payment_status: {
      type: String,
      enum: ["Paid", "Partial", "Unpaid"],
      default: "Paid",
    },
    medicine_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
      },
    ],
    headman_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Headman",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);



const patientsModel = mongoose.models.Patient || mongoose.model('Patient',patientSchema);

export default patientsModel;