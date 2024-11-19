import { createBrowserRouter} from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import Medicine from "../pages/Medicine/Medicine";
import Patients from "../pages/Patients/Patients"
import Expiry from "../pages/Expiry/Expiry";
import Fininshed from "../pages/Finished/Fininshed";
import CreateMedicine from "../pages/Medicine/CreateMedicine";
import UpdateMedicine from "../pages/Medicine/UpdateMedicine";
import Category from "../pages/Category/Category";
import CreateCategory from "../pages/Category/CreateCategory";
import UpdateCategory from "../pages/Category/UpdateCategory";
import AddPatients from "../pages/Patients/AddPatients";
import UpdatePatients from "../pages/Patients/UpdatePatients";
import Signup from "../Auth/Signup";
import Login from "../Auth/Login";
import { useEffect } from "react";
import Headman from "../pages/Headman/Headman";
import CreateHeadman from "../pages/Headman/CreateHeadman";
import UpdateHeadman from "../pages/Headman/UpdateHeadman";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },

      // ******* Patients Routes *******
      {
        path: "patients",
        element: <Patients />,
      },
      {
        path: "patients/create",
        element: <AddPatients />,
      },
      {
        path: "patients/update/:id",
        element: <UpdatePatients />,
      },

      // ******* headmans Routes *******
      {
        path: "headmans",
        element: <Headman/>,
      },
      {
        path: "headmans/create",
        element: <CreateHeadman/>,
      },
      {
        path: "headmans/update/:id",
        element: <UpdateHeadman/>,
      },

      // ******* Expiry Routes *******
      {
        path: "expiry",
        element: <Expiry />,
      },

      // ******* Finished medicine Routes *******
      {
        path: "finished",
        element: <Fininshed />,
      },

      // ******* medicine Routes *******
      {
        path: "medicine",
        element: <Medicine />,
      },
      {
        path: "medicine/create",
        element: <CreateMedicine />,
      },
      {
        path: "medicine/update/:id",
        element: <UpdateMedicine />,
      },

      // ******* Category Routes *******
      {
        path: "category",
        element: <Category />,
      },
      {
        path: "category/create",
        element: <CreateCategory />,
      },
      {
        path: "category/update/:id",
        element: <UpdateCategory />,
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
