import headmanModel from "../models/headman.model.js";
import patientModel from "../models/patients.model.js";
import medicineModel from "../models/medicine.model.js";
import categoryModel from "../models/category.model.js";

// Get info of patient, category, headman, and medicine
const storeInfo = async (req, res) => {
  const user_id = req.body.userId;

  try {
    // headman info
    const total_headman = await headmanModel.countDocuments({ user_id });
    const not_pay_headman = await headmanModel.countDocuments({
      user_id,
      payment_status: { $ne: "Paid" }, // Not equal to "Paid"
    });
    const headman = { total_headman, not_pay_headman };

    // patient info
    const total_patient = await patientModel.countDocuments({ user_id });
    const not_pay_patient = await patientModel.countDocuments({
      user_id,
      payment_status: { $ne: "Paid" },
    });
    const patient = { total_patient, not_pay_patient };

    // medicine info
    const total_medicine = await medicineModel.countDocuments({ user_id });
    const expire_medicine = await medicineModel.countDocuments({
      user_id,
      expiryDate: {
        $lte: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      }, // Expiry within 1 month
    });
    const medicine = { total_medicine, expire_medicine };

    // category info
    const total_category = await categoryModel.countDocuments({ user_id });
    const category = { total_category };

    const data = {
      headman,
      patient,
      medicine,
      category,
    };

    res.status(200).json({success:true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// show all expire medicine and close to expiry 

const expire_medicine = async (req, res) => {
  const user_id = req.body.userId;
  try {
    const medicine = await medicineModel.find({user_id},'expiry_date _id name');
   return res.status(200).json({success:true, data:medicine});
  } catch (error) {
    console.log(error);
   return res.status(500).json({success: false,message: error.message});
  }
};


// finshed medicine

const finished_medicine = async (req, res) => {
  const user_id = req.body.userId;
  try {
    const data = await medicineModel.find({user_id, qty:0});
    res.status(200).json({success: true, data});
  } catch (error) {
    console.log(error);
    res.status(500).json({success: false,message: error.message});
  }
};

export { storeInfo, expire_medicine, finished_medicine };
