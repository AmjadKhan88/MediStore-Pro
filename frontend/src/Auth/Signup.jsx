import React, { useState, useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { StoreContext } from "../Context/ContextApi";

function Signup() {
  const navigate = useNavigate();
  useEffect(()=>{
    if (localStorage.getItem("medicineToken")) {
      navigate("/");
    }
  },[])
  const [laoder, setLoader] = useState(false);
   const { ApiUrl } = useContext(StoreContext);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoader(true);
    try {
      const response = await axios.post(
        `${ApiUrl}/user/add`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("medicineToken", response.data.token);
        setLoader(false);
        navigate("/");
      }
    } catch (err) {
      setError(err.response.data.message);
      setLoader(false);
    }
  };

  const fullName = {
    required: { value: true, message: "The full name field is required" },
  };
  const email = {
    required: "Email is required",
    pattern: {
      value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      message: "Invalid email format",
    },
  };
  const matchPassword = watch("password", "");
  const password = {
    required: "Password is required",
    minLength: {
      value: 7,
      message: "Password must be at least 8 characters long",
    },
  };
  const confirm_password = {
    required: "Please confirm your password",
    validate: (value) =>
      value === matchPassword || "Password and confirm password do not match",
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#9A616D" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src={assets.Signup_Image}
                    alt="login form"
                    className="img-fluid"
                    style={{ borderRadius: "1rem 0 0 1rem" }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <i
                          className="fas fa-cubes fa-2x me-3"
                          style={{ color: "#ff6219" }}
                        ></i>
                        <span className="h3 fw-bold mb-0">
                          <img width={80} src={assets.logo} alt="" /> Medicine
                          Store
                        </span>
                      </div>

                      <h5
                        className="fw-normal mb-3 pb-3"
                        style={{ letterSpacing: "1px" }}
                      >
                        Register your account
                      </h5>
                        {error && <p className="alert alert-danger">{error}</p>};
                      <div className="form-outline mb-3">
                        <input
                          type="text"
                          id="fullname"
                          className={`form-control form-control-lg ${
                            errors.fullName && "is-invalid"
                          }`}
                          autoComplete="off"
                          placeholder="Full Name"
                          {...register("fullName", fullName)}
                        />
                        {errors.fullName && (
                          <span className="text-danger text-sm">
                            {errors.fullName.message}
                          </span>
                        )}
                      </div>
                      <div className="form-outline mb-3">
                        <input
                          type="text"
                          id="email"
                          className={`form-control form-control-lg ${
                            errors.email && "is-invalid"
                          }`}
                          placeholder="Email"
                          {...register("email", email)}
                        />
                        {errors.email && (
                          <span className="text-danger text-sm">
                            {errors.email.message}
                          </span>
                        )}
                      </div>

                      <div className="form-outline mb-3 ">
                        <input
                          type="password"
                          autoComplete="off"
                          id="password"
                          className={`form-control form-control-lg ${
                            errors.password && "is-invalid"
                          }`}
                          placeholder="Password"
                          {...register("password", password)}
                        />
                        {errors.password && (
                          <span className="text-danger text-sm">
                            {errors.password.message}
                          </span>
                        )}
                      </div>
                      <div className="form-outline mb-3">
                        <input
                          type="password"
                          id="confirmPassword"
                          autoComplete="off"
                          className={`form-control form-control-lg ${
                            errors.confirm_password && "is-invalid"
                          }`}
                          placeholder="Confirm Password"
                          {...register("confirm_password", confirm_password)}
                        />
                        {errors.confirm_password && (
                          <span className="text-danger text-sm">
                            {errors.confirm_password.message}
                          </span>
                        )}
                      </div>

                      <div className="pt-1 mb-4">
                        <button
                          className="btn btn-dark btn-lg btn-block"
                          type="submit"
                          disabled={laoder}
                        >
                          {laoder ? (
                            <div className="d-flex align-items-center">
                              <strong>Loading...</strong>
                              <div
                                className="spinner-border ms-auto"
                                role="status"
                                aria-hidden="true"
                              ></div>
                            </div>
                          ) : (
                            "Sign up"
                          )}
                        </button>
                      </div>

                      <a className="small text-muted" href="#!">
                        Forgot password?
                      </a>
                      <p className="mb-5 pb-lg-2 text-secondary">
                        A'Ready have an account?{" "}
                        <Link to="/login" className="text-info">
                          Login here
                        </Link>
                      </p>
                      <a href="#!" className="small text-muted">
                        Terms of use.
                      </a>
                      <a href="#!" className="small text-muted">
                        Privacy policy
                      </a>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;
