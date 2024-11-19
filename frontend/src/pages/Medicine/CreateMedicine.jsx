import React, { useContext, useEffect, useState } from "react";
import "./Medicine.css";
import { useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import {useForm } from "react-hook-form";
import { FileUploader } from "react-drag-drop-files";
import {toast} from "react-toastify";
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { StoreContext } from "../../Context/ContextApi";

function CreateMedicine() {
  const token = localStorage.getItem('medicineToken');
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
const fileTypes = ["JPG", "PNG", "GIF"];
 const [file, setFile] = useState(null);
 const [category, setCategory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
 const handleChange = (file) => {
   setFile(file);
 };
  const { ApiUrl } = useContext(StoreContext);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  // Frontend validation
  const name = {
    required: { value: true, message: "The name field is required" },
  };
  const price = {
    required: { value: true, message: "The price field is required" },
    pattern: {
      value: /^[0-9]+$/,
      message: "The price must be an integer",
    },
  };

  const miligram = {
    required: { value: true, message: "The miligram field is required" },
  };

  const qty = {
    required: { value: true, message: "The qty field is required" },
  }

  const expiry_date = {
    required: { value: true, message: "The expiry date field is required" },
  }

  const registry_no = {
    required: { value: true, message: "The registry_no field is required" },
  }

  const categoryRe = {
  required: {value: true, message: "The category field is required"},
  };
  // Submit form data
  const onSubmit = async (data) => {
    setLoader(true);
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    formData.append('image',file);
    formData.append('expiry_date',selectedDate);
    try {
      const response = await axios.post(
        `${ApiUrl}/medicine/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log(response.data.message);
        toast.success(response.data.message);
        setLoader(false);
        navigate("/medicine");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(err.response.data.message);
      setLoader(false);
    }
  };

  const CancelForm = ()=> {
      if(confirm("Are you sure want to cancel")){
        navigate("/medicine");
      }
  }

    const handleDateChange = (date) => {
      // Strip the time and format it as YYYY-MM-DD
      const formattedDate = format(date, "yyyy-MM-dd"); // Example format: '2024-11-01'
      setSelectedDate(formattedDate);
    };

  // get active category
  const activeCategory = async ()=> {
      try {
        const response = await axios.get(
          `${ApiUrl}/category/active`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if(response.data.success){
          setCategory(response.data.data);
        }
      } catch (error) {
        toast.error(error.response.data.message)
      }
  }

  useEffect(()=> {
    activeCategory();
  },[]);
  return (
    <div className="p-5 p-md-3 p-sm-2 mx-auto" style={{ maxWidth: "1200px" }}>
      <div className="d-flex justify-content-between align-items-center">
        <span className="h4">Medicine Create</span>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/medicine")}
        >
          back
        </button>
      </div>
      <form className="card p-4 mt-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          {/* name  */}
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Medicine Name"
              className="form-control"
              id="name"
              {...register("name", name)}
            />
            {errors.name && (
              <span className="text-danger">{errors.name.message}</span>
            )}
          </div>
          {/* slug  */}
          <div className="col-md-6">
            <select
              name="category"
              id="category"
              className="form-control text-secondary"
              {...register("category", categoryRe)}
              defaultValue=""
            >
              <option value="">Select Category</option>
              {category?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.categoryRe && (
              <span className="text-danger">{errors.categoryRe}</span>
            )}
          </div>
        </div>
        <div className="row mt-3">
          {/* price  */}
          <div className="col-md-6">
            <input
              type="number"
              placeholder="Medicine Price"
              className="form-control"
              id="price"
              {...register("price", price)}
            />
            {errors.price && (
              <span className="text-danger">{errors.price.message}</span>
            )}
          </div>
          {/* Qty  */}
          <div className="col-md-6">
            <input
              type="number"
              placeholder="Medicine Quantity"
              className="form-control"
              id="quantity"
              {...register("qty", qty)}
            />
            {errors.qty && (
              <span className="text-danger"> {errors.qty.message}</span>
            )}
          </div>
        </div>
        <div className="row mt-3">
          {/* Expiry Date  */}
          <div className="col-md-6">
            <DatePicker
              selected={selectedDate ? new Date(selectedDate) : null}
              onChange={(date) => {
                const formattedDate = date.toISOString().split("T")[0];
                handleDateChange(formattedDate);
              }}
              dateFormat="yyyy-MM-dd"
              isClearable
              placeholderText="Select a date"
            />
            {!selectedDate && (
              <span className="text-danger">the expiry date is required</span>
            )}
          </div>
          {/* Status  */}
          <div className="col-md-6">
            <select
              name="status"
              id="status"
              className="form-control text-secondary"
              defaultValue={"true"}
              {...register("status")}
            >
              <option>Select Status</option>
              <option value="true">True</option>
              <option value="false">false</option>
            </select>
          </div>
        </div>
        <div className="row mt-3">
          {/* Registry No  */}
          <div className="col-md-6">
            <input
              type="number"
              placeholder="Registry No"
              className="form-control"
              id="registry_no"
              {...register("registry_no", registry_no)}
            />
            {errors.registry_no && (
              <span className="text-danger">{errors.registry_no.message}</span>
            )}
          </div>
          {/* Miligram  */}
          <div className="col-md-6">
            <select
              name="miligram"
              id="miligram"
              className="form-control text-secondary"
              defaultValue=""
              {...register("miligram", miligram)}
            >
              <option value="">Select Miligram</option>
              <option value="10">10mg</option>
              <option value="20">20mg</option>
              <option value="30">30mg</option>
              <option value="40">40mg</option>
              <option value="50">50mg</option>
              <option value="60">60mg</option>
              <option value="70">70mg</option>
              <option value="80">80mg</option>
              <option value="90">90mg</option>
              <option value="100">100mg</option>
              <option value="110">110mg</option>
              <option value="120">120mg</option>
            </select>
            {errors.miligram && (
              <span className="text-danger">{errors.miligram.message}</span>
            )}
          </div>
        </div>
        <Accordion className="mt-3">
          <div className="row">
            <div className="col-md-6">
              <Accordion.Item eventKey="0">
                <Accordion.Header className="text-secondary">
                  Description (optional)
                </Accordion.Header>
                <Accordion.Body>
                  <div className="col-md-12 textarea-style">
                    <textarea
                      name="description"
                      placeholder="Write Medicine Description"
                      rows={5}
                      id="default"
                      className="form-control"
                      {...register("description")}
                    ></textarea>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </div>
            <div className="col-md-6">
              <FileUploader
                handleChange={handleChange}
                name="image"
                types={fileTypes}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <Accordion.Item eventKey="1" className="my-3">
                <Accordion.Header className="text-secondary">
                  Used for description (optional)
                </Accordion.Header>
                <Accordion.Body>
                  <div className="col-md-12 textarea-style">
                    <textarea
                      name="used_for"
                      placeholder="Write Medicine Description"
                      rows={5}
                      id="default"
                      className="form-control"
                      {...register("used_for")}
                    ></textarea>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </div>
            <div className="col-md-6">
              <Accordion.Item eventKey="1" className="my-3">
                <Accordion.Header className="text-secondary">
                  Safty Info (optional)
                </Accordion.Header>
                <Accordion.Body>
                  <div className="col-md-12 textarea-style">
                    <textarea
                      name="safty_info"
                      placeholder="Write Medicine Description"
                      rows={5}
                      id="default"
                      className="form-control"
                      {...register("safty_info")}
                    ></textarea>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </div>
          </div>
        </Accordion>
        <div className="row">
          <button
            disabled={loader}
            type="submit"
            className="btn btn-primary col-md-3"
          >
            {loader ? "Loading..." : "Save"}
          </button>
          <button
            type="submit"
            onClick={CancelForm}
            className="ms-3 btn btn-outline-secondary col-md-3"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateMedicine;
