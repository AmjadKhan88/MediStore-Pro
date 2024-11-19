import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import slugify from "react-slugify";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../Context/ContextApi";
function UpdateCategory() {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("medicineToken");
   const { ApiUrl } = useContext(StoreContext);
  const {id} = useParams();
  const [oldCategory,setOldCategory] = useState();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const getSlug = (e)=> {
    setValue('slug', slugify(e.target.value));
  }

  // Frontend validation
  const name = {
    required: { value: true, message: "The category name field is required" },
  };
  const slug = {
    required: { value: true, message: "The slug field is required" },
  };

  // Submit form data
  const onSubmit = async (data) => {
    setLoader(true);  
    try {
      const response = await axios.put(
        `${ApiUrl}/category/update/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setLoader(false);
        toast.success(response.data.message);
        navigate("/category");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(err.response.data.message);
      setLoader(false);
    }
  };

  const CancelForm = () => {
    if (confirm("Are you sure want to cancel")) {
      navigate("/category");
    }
  };

  // get old category
  const getOldCategory =async () => {
      try {
        const response = await axios.get(
          `${ApiUrl}/category/single/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if(response.data.success){
          setValue('name', response.data?.data?.name);
          setValue('slug', response.data?.data?.slug);
          setValue('status', response.data?.data?.status);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
  };

  useEffect(()=> {
    getOldCategory();
  },[])

  return (
    <div className="p-5 p-md-3 p-sm-2 mx-auto" style={{ maxWidth: "1200px" }}>
      <div className="d-flex justify-content-between align-items-center">
        <span className="h4">Medicine Category Update</span>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/category")}
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
              placeholder="Category Name"
              className={`form-control ${errors.name && "is-invalid"}`}
              {...register("name", name)}
              id="name"
              onKeyUp={getSlug}
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>
          {/* slug  */}

          <div className="col-md-6">
            <input
              type="text"
              placeholder="Slug"
              className={`form-control ${errors.slug && "is-invalid"}`}
              id="slug"
              {...register("slug", slug)}
              disabled
            />
            {errors.slug && (
              <p className="text-danger">{errors.slug.message}</p>
            )}
          </div>

          {/* Status  */}
          <div className="col-md-6 my-3">
            <select
              name="status"
              id="status"
              className="form-control text-secondary"
              defaultValue="true"
              {...register("status")}
            >
              <option value="true">True</option>
              <option value="false">false</option>
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
              "update"
            )}
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

export default UpdateCategory;
