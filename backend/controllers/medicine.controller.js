import medicineModel from "../models/medicine.model.js";
import fs from 'fs';
import slugify from "slugify";
import path from "path";
// get all medicine
const allMedicine =async (req, res) => {
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
    const medicine = await medicineModel
      .find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit);
    // Get total count of documents for the query to calculate total pages
    const totalMedicine = await medicineModel.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalMedicine / limit);

    return res.status(200).json({
      success: true,
      data: medicine,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalMedicine,
      },
    });
  } catch (error) {
     console.error(error);
     return res.status(500).json({ success: false, message: error.message });
  }
}

// add medicine item 
const addMedicine = async (req,res) => {
  let image_filename = `${req.file.filename}`;
  const user_id = req.body.userId;
  const {
    name,
    description,
    price,
    qty,
    status,
    expiry_date,
    used_for,
    miligram,
    safety_info,
    category,
    registry_no,
  } = req.body;
  const slug = slugify(req.body.name + Date.now());
  // validate the value
  if (!name || !price || !qty || !expiry_date || !miligram || !category) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // Check if medicine already exists

  // Check if the medicine already exists
  const existingMedicine = await medicineModel.findOne({ name, miligram,user_id });
  if (existingMedicine) {
    return res
      .status(400)
      .json({ success: false, message: "This medicine already exists" });
  }

  const medicine = new medicineModel({
    name: name,
    slug: slug,
    description: description,
    price: price,
    qty: qty,
    category_id: category,
    image: image_filename,
    status: status,
    expiry_date: expiry_date,
    used_for: used_for,
    miligram: miligram,
    safety_info: safety_info,
    user_id,
    registry_no: registry_no,
  });


  try {
    await medicine.save();
    res.status(200).json({ success: true, message: "medicine saved successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// update medicine item 
const updateMedicine = async (req, res) => {
  // Set image filename if new image is uploaded, or use the existing one from req.body
  let image_filename = req.file?.filename || req.body.old_image;
  const _id = req.params.id;
  const user_id = req.body.userId;
  const {
    name,
    description,
    price,
    qty,
    status,
    expiry_date,
    used_for,
    miligram,
    safety_info,
    category,
    registry_no,
  } = req.body;

  try {
    // Validate required fields
    if (!name || !price || !qty || !expiry_date || !miligram || !category) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const slug = slugify(req.body.name + Date.now());

    // If a new file is uploaded, delete the old image file
    if (req.file && req.body.old_image) {
      const oldImagePath = path.join('uploads', req.body.old_image);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error("Error deleting old image:", err.message);
      });
    }

    // Update medicine in the database
    const updatedMedicine = await medicineModel.findByIdAndUpdate(
      _id,
      {
        name: name,
        slug: slug,
        description: description,
        price: price,
        qty: qty,
        category_id: category,
        image: image_filename,
        status: status,
        expiry_date: expiry_date,
        used_for: used_for,
        miligram: miligram,
        safety_info: safety_info,
        user_id,
        registry_no: registry_no,
      },
      { new: true } // Return the updated document
    );

    if (updatedMedicine) {
      return res
        .status(200)
        .json({ success: true, message: 'Medicine updated successfully', data: updatedMedicine });
    } else {
      return res
        .status(404)
        .json({ success: false, message: 'Medicine not found or not updated' });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get single medicine item
const singleMedicine = async (req,res) => {
  const _id = req.params.id;
  const user_id = req.body.userId;
  try {
    const medicine = await medicineModel.findOne({_id,user_id});
    if(medicine){
      console.log('single medicine renders successfully')
      return res.status(200).json({success:true,data:medicine});
    }else{
      return res.status(404).json({success:false,message:`Could not find medicine for ${user_id}`});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({success: false,message: error.message});
  }
}

// delete medicine from database
const deleteMedicine =async (req, res) => { 
  const user_id = req.body.userId;
  const _id = req.params.id;
  try {
    const medicineData = await medicineModel.findOne(_id,user_id);
    if(medicineData.image){
        const oldImagePath = path.join("uploads", medicineData.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting old image:", err.message);
        });
    }
    const medicine = await medicineModel.findOneAndDelete({_id,user_id});
    if(medicine){
          res.status(200).json({ success: true, message: "Medicine delete successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}



export {
  addMedicine,
  allMedicine,
  singleMedicine,
  updateMedicine,
  deleteMedicine,
};