import express from "express";
import cors from "cors";
import { connectDB } from "./db/db.js";
import userRoute from "./routes/user.route.js";
import medicineRoute from "./routes/medicine.route.js";
import bodyParser from "body-parser";
import categoryRoute from "./routes/category.route.js";
import patientsRoute from "./routes/patients.route.js";
import headmanRoute from "./routes/headman.route.js";
import dashboardRoute from "./routes/dashboard.route.js";
// Uncomment if you need to use environment variables
// import dotenv from "dotenv";
// dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cors()); // Allow all origins
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/images", express.static("uploads"));
// db connection
connectDB();

// api endpoints
app.use("/api/medicine", medicineRoute);
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/patients", patientsRoute);
app.use("/api/headman", headmanRoute);
app.use("/api/dashboard", dashboardRoute);

app.get("/", (req, res) => {
  res.send("API is working");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
