import express from 'express';
import multer from "multer";
import {
  addMedicine,
  allMedicine,
  deleteMedicine,
  singleMedicine,
  updateMedicine,
} from "../controllers/medicine.controller.js";
import authMiddleware from '../middlewares/auth.js';

// multer configuration settings 
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}`);
  },
});

// initialize storage to multer
const upload = multer({ storage: storage });

// defaine medicine route
const medicineRoute = express.Router();

// get all medicine 
medicineRoute.get("/all/:keywords?",authMiddleware,allMedicine);

// add medicine
medicineRoute.post("/add",upload.single("image"),authMiddleware , addMedicine);

// get single medicine
medicineRoute.get("/single/:id",authMiddleware,singleMedicine);

// update single medicine 
medicineRoute.post(
  "/update/:id",
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // handle multer-specific errors
        return res.status(500).json({ error: err.message });
      } else if (err) {
        // handle other errors
        return res.status(500).json({ error: err.message });
      }
      // proceed if no error
      next();
    });
  },
  authMiddleware,
  updateMedicine
);

// delete medicine from database
medicineRoute.post('/delete/:id',authMiddleware,deleteMedicine);

// exproting route
export default medicineRoute;