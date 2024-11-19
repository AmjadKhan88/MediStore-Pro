import categoryModel from "../models/category.model.js";

// show categories
const allCategory = async (req, res) => {
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
    const categories = await categoryModel
      .find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count of documents for the query to calculate total pages
    const totalCategories = await categoryModel.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalCategories / limit);

    return res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCategories,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// show all active categories
const activeCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({
      status: "true",
      user_id: req.body.userId,
    });
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Active categories not fetched" });
  }
};

// show single category
const singleCategory = async (req, res) => {
    const post_id = req.params.id;
  const {userId: user_id } = req.body;
  try {
    const category = await categoryModel.findOne({ _id: post_id, user_id });
    if (category) {
      return res.status(200).json({ success: true, data: category });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Category not Found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(404).json({ success: false, message: error.message });
  }
};

// add category
const addCategory = async (req, res) => {
  const { userId, name, slug, status } = req.body;
  try {
    // check if the category already exists
    const existingCategory = await categoryModel.findOne({ slug });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }
    const newCategory = new categoryModel({
      name,
      slug,
      status,
      user_id: userId,
    });
    await newCategory.save();
    return res
      .status(200)
      .json({ success: true, message: "Category saved successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// update category
const updateCategory = async (req, res) => {
    const _id = req.params.id;
  const { userId, name, slug,status} = req.body;

  try {
    if (!userId || !name || !slug) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const updatedCategory = await categoryModel.findByIdAndUpdate(_id, {
      name,
      slug,
      status,
    });
    if (updatedCategory) {
      return res
        .status(200)
        .json({ success: true, message: "Category updated successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Category not found & not updated" });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// delete category
const deleteCategory = async (req, res) => {
  const post_id = req.params.id;
  const { userId} = req.body;
  try {
    const category = await categoryModel.findOne({
      _id: post_id,
      user_id: userId,
    });
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "No category found" });
    }
    await category.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  allCategory,
  activeCategory,
  singleCategory,
  addCategory,
  updateCategory,
  deleteCategory,
};
