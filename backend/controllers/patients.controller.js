import patientsModel from "../models/patients.model.js";
import fs from "fs";
import slugify from "slugify";
import path from "path";

// get all patients
const allPatients =async (req, res) => {
  const user_id = req.body.userId;
  const keywords = req.params.keywords || "";
  const page = parseInt(req.query.page) || 1; // Current page, default is 1
  const limit = parseInt(req.query.limit) || 6; // Number of items per page, default is 10
  try {
    // Define the search query based on the presence of keywords
    const searchQuery = keywords
      ? { user_id, name: { $regex: keywords, $options: "i" } } // Case-insensitive search on name
      : { user_id };

    // Fetch the data with pagination
    const patients = await patientsModel
      .find(searchQuery).populate('headman_id','name')
      .skip((page - 1) * limit)
      .limit(limit);
    // Get total count of documents for the query to calculate total pages
    const totalPatients = await patientsModel.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalPatients / limit);

    return res.status(200).json({
      success: true,
      data: patients,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalPatients,
      },
    });
  } catch (error) {
     console.error(error);
     return res.status(500).json({ success: false, message: error.message });
  }
}

// add patients item 
const addPatients = async (req, res) => {
  const user_id = req.body.userId;
  const {
    name,
    age,
    description,
    allergies,
    address,
    notes,
    gender,
    bp,
    total_charges,
    amount_paid,
    payment_status,
    medicine_id,
    headman_id,
  } = req.body;

  // Check if required fields are present
  if (!name || !age || !total_charges || !amount_paid || !medicine_id) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // Generate slug only if `name` is a string
  const slug = typeof name === 'string' ? slugify(name + Date.now()) : null;

  // Calculate remaining balance
  let remaining_price = 0;
  if (amount_paid < total_charges) {
    remaining_price = total_charges - amount_paid;
  }

  const patient = new patientsModel({
    name,
    slug,
    age,
    description,
    allergies,
    address,
    notes,
    gender,
    bp,
    total_charges,
    amount_paid,
    balance_due: remaining_price,
    payment_status,
    medicine_id,
    headman_id,
    user_id,
  });

  try {
    await patient.save();
    res.status(200).json({ success: true, message: "Patient saved successfully" });
  } catch (error) {
    console.error("Error saving patient:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// update patients item 
const updatePatients = async (req, res) => {
  const _id = req.params.id;
  const user_id = req.body.userId;
  const {
    name,
    age,
    description,
    allergies,
    address,
    notes,
    gender,
    bp,
    total_charges,
    amount_paid,
    payment_status,
    medicine_id,
    headman_id,
  } = req.body;

  try {
    // Check if required fields are present
    if (!name || !age || !total_charges || !amount_paid || !medicine_id) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Generate slug only if `name` is a string
    const slug = typeof name === "string" ? slugify(name + Date.now()) : null;

    // Calculate remaining balance
    let remaining_price = 0;
    if (amount_paid < total_charges) {
      remaining_price = total_charges - amount_paid;
    }

    // Update patients in the database
    const updatePatients = await patientsModel.findByIdAndUpdate(
      _id,
      {
        name,
        slug,
        age,
        description,
        allergies,
        address,
        notes,
        gender,
        bp,
        total_charges,
        amount_paid,
        balance_due: remaining_price,
        payment_status,
        medicine_id,
        headman_id,
        user_id,
      },
      { new: true } // Return the updated document
    );

    if (updatePatients) {
      return res
        .status(200)
        .json({
          success: true,
          message: "Patients updated successfully",
          data: updatePatients,
        });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Patients not found or not updated" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get single patients item
const singlePatients = async (req,res) => {
  const _id = req.params.id;
  const user_id = req.body.userId;
  try {
    const patients = await patientsModel
      .findOne({ _id, user_id })
      .populate("medicine_id",'name _id');
    if(patients){
      console.log('single patients renders successfully')
      return res.status(200).json({success:true,data:patients});
    }else{
      return res.status(404).json({success:false,message:`Could not find patients for ${user_id}`});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({success: false,message: error.message});
  }
}

// delete patients from database
const deletePatients =async (req, res) => { 
  const user_id = req.body.userId;
  const _id = req.params.id;
  try {
    const patient = await patientsModel.findOneAndDelete({_id,user_id});
    if(patient){
          res.status(200).json({ success: true, message: "Patient delete successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}


export {addPatients,allPatients,singlePatients,updatePatients,deletePatients};
