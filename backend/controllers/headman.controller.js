import headmanModel from "../models/headman.model.js";
import medicineModel from "../models/medicine.model.js"
import fs from "fs";
import slugify from "slugify";
import path from "path";

// get all patients
const allHeadman = async (req, res) => {
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
    const headmans = await headmanModel
      .find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit);
    // Get total count of documents for the query to calculate total pages
    const totalHeadman = await headmanModel.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalHeadman / limit);

    return res.status(200).json({
      success: true,
      data: headmans,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalHeadman,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// add patients item
const addHeadman = async (req, res) => {
  let image_filename = req.file ? req.file.filename : null;
  const user_id = req.body.userId;
  const { name, contact, address, notes, gender, image, payment_status } =
    req.body;
   
  const slug = slugify(req.body.name + Date.now());
  // validate the value
  if (!name || !address || !payment_status) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // cheack if the already exists 
//   const HeadmanExists = headmanModel.findOne({name,user_id});

//   if(HeadmanExists){
//     return res.status(400).json({success: false, message:`Headman ${name} Already exists`});
//   }

  const headman = new headmanModel({
    name: name,
    slug:slug,
    contact: contact,
    address: address,
    notes: notes,
    gender: gender,
    image: image_filename,
    payment_status: payment_status,
    user_id: user_id,
  });

  try {
    await headman.save();
    res
      .status(200)
      .json({ success: true, message: "headman saved successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update patients item
const updateHeadman = async (req, res) => {
  // Set image filename if new image is uploaded, or use the existing one from req.body
  let image_filename = req.file?.filename || req.body.old_image;
  const _id = req.params.id;
  const user_id = req.body.userId;
  const { name, contact, address, notes, gender, image, payment_status } =
    req.body;

  try {
    // Validate required fields
    if (!name || !address || !payment_status) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const slug = slugify(req.body.name + Date.now());

    // If a new file is uploaded, delete the old image file
    if (req.file && req.body.old_image) {
      const oldImagePath = path.join("uploads", req.body.old_image);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error("Error deleting old image:", err.message);
      });
    }

    // Update patients in the database
    const updateHeadmans = await headmanModel.findByIdAndUpdate(
      _id,
      {
        name: name,
        slug: slug,
        contact: contact,
        address: address,
        notes: notes,
        gender: gender,
        image: image_filename,
        payment_status: payment_status,
        user_id: user_id
      },
      { new: true } // Return the updated document
    );

    if (updateHeadmans) {
      return res
        .status(200)
        .json({
          success: true,
          message: "Headman updated successfully",
          data: updateHeadmans,
        });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Headman not found or not updated" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get single patients item
const singleHeadman = async (req, res) => {
  const _id = req.params.id;
  const user_id = req.body.userId;
  try {
    const headman = await headmanModel.findOne({ _id, user_id });
    if (headman) {
      console.log("single headman renders successfully");
      return res.status(200).json({ success: true, data: headman });
    } else {
      return res
        .status(404)
        .json({
          success: false,
          message: `Could not find headman for ${user_id}`,
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete headman
// delete patients from database
const deleteHeadman =async (req, res) => { 
  const user_id = req.body.userId;
  const _id = req.params.id;
  try {
    const headman = await headmanModel.findOneAndDelete({_id,user_id});
    if(headman){
     
          res.status(200).json({ success: true, message: "Headman delete successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}
export { addHeadman, allHeadman, singleHeadman, updateHeadman, deleteHeadman };
