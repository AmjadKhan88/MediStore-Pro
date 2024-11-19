import express from "express";
import authMiddleware from "../middlewares/auth.js";

import multer from "multer";
import { addHeadman, allHeadman, deleteHeadman, singleHeadman, updateHeadman } from "../controllers/headman.controller.js";

const headmanRoute = express.Router();
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}`);
  },
});

// initialize storage to multer
const upload = multer({ storage: storage });

// get all patients
headmanRoute.get("/all/:keywords?", authMiddleware, allHeadman);

// get single patien
headmanRoute.get("/single/:id", authMiddleware, singleHeadman);

// save single patients
headmanRoute.post(
  "/add",
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
  addHeadman
);

// update single medicine
headmanRoute.post(
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
  updateHeadman
);

// delete Headman route 
headmanRoute.post('/delete/:id',authMiddleware,deleteHeadman);

export default headmanRoute;
