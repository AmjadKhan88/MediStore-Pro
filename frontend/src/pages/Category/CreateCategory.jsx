// CreateCategory.js
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import slugify from "react-slugify";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../Context/ContextApi";

function CreateCategory() {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("medicineToken");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
 const { ApiUrl } = useContext(StoreContext);
  const getSlug = (e) => {
    setValue("slug", slugify(e.target.value));
  };

  const name = {
    required: { value: true, message: "The category name field is required" },
  };
  const slug = {
    required: { value: true, message: "The slug field is required" },
  };

  const onSubmit = async (data) => {
    setLoader(true);

    try {
      const response = await axios.post(
        `${ApiUrl}/category/add`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Category created successfully!");
        setLoader(false);
        navigate("/category");
      } else {
        throw new Error(response.data.message || "Failed to create category.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setLoader(false);
      toast.error(err.response?.data?.message || "An error occurred.");
    }
  };

  const CancelForm = () => {
    if (window.confirm("Are you sure you want to cancel?")) {
      navigate("/category");
    }
  };

  return (
    <div className="p-5 p-md-3 p-sm-2 mx-auto" style={{ maxWidth: "1200px" }}>
      <div className="d-flex justify-content-between align-items-center">
        <span className="h4">Medicine Category Create</span>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/category")}
        >
          Back
        </button>
      </div>
      <form className="card p-4 mt-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Category Name"
              className={`form-control ${errors.name && "is-invalid"}`}
              {...register("name", name)}
              onKeyUp={getSlug}
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Slug"
              className={`form-control ${errors.slug && "is-invalid"}`}
              {...register("slug", slug)}
              disabled
            />
            {errors.slug && (
              <p className="text-danger">{errors.slug.message}</p>
            )}
          </div>
          <div className="col-md-6 my-3">
            <select
              className="form-control text-secondary"
              defaultValue="true"
              {...register("status")}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        </div>
        <div className="row">
          <button
            type="submit"
            className="btn btn-primary col-md-3"
            disabled={loader}
          >
            {loader ? (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Save"
            )}
          </button>
          <button
            type="button"
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

export default CreateCategory;
