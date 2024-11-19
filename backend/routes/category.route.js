import express from "express";
import {
  activeCategory,
  addCategory,
  allCategory,
  deleteCategory,
  singleCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import authMiddleware from "../middlewares/auth.js";

const categoryRoute = express.Router();

// get all categories
categoryRoute.get("/all/:keywords?", authMiddleware, allCategory);

// get all active categories
categoryRoute.get("/active", authMiddleware, activeCategory);

// get single category by ID
categoryRoute.get("/single/:id", authMiddleware, singleCategory);

// add category
categoryRoute.post("/add", authMiddleware, addCategory);

// update category by ID
categoryRoute.put("/update/:id", authMiddleware, updateCategory);

// delete category by ID
categoryRoute.post("/delete/:id", authMiddleware, deleteCategory);

export default categoryRoute;
