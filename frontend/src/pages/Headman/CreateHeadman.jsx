import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import { useForm } from "react-hook-form";
import { FileUploader } from "react-drag-drop-files";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../Context/ContextApi";


function CreateHeadman() {
  const token = localStorage.getItem("medicineToken");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const fileTypes = ["JPG", "PNG", "GIF"];
  const [file, setFile] = useState(null);
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
  const address = {
    required: { value: true, message: "The address field is required" },
  
  };

  // Submit form data
  const onSubmit = async (data) => {
    setLoader(true);
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    formData.append("image", file);
    try {
      const response = await axios.post(
        `${ApiUrl}/headman/add`,
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
        navigate("/headmans");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(err.response.data.message);
      setLoader(false);
    }
  };

  const CancelForm = () => {
    if (confirm("Are you sure want to cancel")) {
      navigate("/headmans");
    }
  };

  return (
    <div className="p-5 p-md-3 p-sm-2 mx-auto" style={{ maxWidth: "1200px" }}>
      <div className="d-flex justify-content-between align-items-center">
        <span className="h4">Headman Create</span>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/headmans")}
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
              placeholder="Headman Name"
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
            <input
              type="text"
              {...register("contact")}
              className="form-control"
              placeholder="phone number"
            />
          </div>
        </div>
        <div className="row mt-3">
          {/* payment status  */}
          <div className="col-md-6">
            <select
              name="status"
              id="status"
              className="form-control text-secondary"
              defaultValue={"Paid"}
              {...register("payment_status")}
            >
              <option>Select Status</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">UnPaid</option>
            </select>
          </div>
          {/* Gender  */}
          <div className="col-md-6">
            <select
              {...register("gender")}
              defaultValue={"Male"}
              className="form-control"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="row mt-3">

          {/* address  */}
          <div className="col-md-12">
            <input
              type="text"
              placeholder="headman address"
              className="form-control"
              id="address"
              {...register("address")}
            />
            {errors.address && (
              <span className="text-danger">{errors.address.message}</span>
            )}
          </div>
        </div>

        <Accordion className="mt-3">
          <div className="row">
            <div className="col-md-6">
              <Accordion.Item eventKey="0">
                <Accordion.Header className="text-secondary">
                  Notes (optional)
                </Accordion.Header>
                <Accordion.Body>
                  <div className="col-md-12 textarea-style">
                    <textarea
                      name="description"
                      placeholder="Write Medicine Description"
                      rows={5}
                      id="default"
                      className="form-control"
                      {...register("notes")}
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
        </Accordion>
        <div className="row m-3">
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

export default CreateHeadman;
