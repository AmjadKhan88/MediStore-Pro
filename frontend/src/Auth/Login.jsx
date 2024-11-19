import React, { useContext, useEffect, useState } from "react";
import {assets} from "../assets/assets";
import {Link, useNavigate} from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from "axios";
import { StoreContext } from "../Context/ContextApi";

function Login() {
    const navigate = useNavigate();
    useEffect(() => {
      if (localStorage.getItem("medicineToken")) {
        navigate("/");
      }
    }, []);
   const [laoder, setLoader] = useState(false);
   const { ApiUrl } = useContext(StoreContext);
   const [error, setError] = useState("");
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
        `${ApiUrl}/user/login`,
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

  const email = {
    required: "Email is required",
    pattern: {
      value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      message: "Invalid email format",
    },
  };
  const password = {
    required: "Password is required",
    minLength: {
      value: 7,
      message: "Password must be at least 8 characters long",
    },
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
                        Sign into your account
                      </h5>
                      {error && <p className="alert alert-danger">{error}</p>}
                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="form2Example17"
                          className="form-control form-control-lg"
                          {...register("email", email)}
                        />
                        {errors.email && (
                          <span className="text-danger">
                            {errors.email.message}
                          </span>
                        )}
                      </div>
                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="form2Example27"
                          className="form-control form-control-lg"
                          {...register("password", password)}
                        />
                        {errors.password && (
                          <span className="text-danger">
                            {errors.password.message}
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
                            "Login"
                          )}
                        </button>
                      </div>
                      <a className="small text-muted" href="#!">
                        Forgot password?
                      </a>
                      <p className="mb-5 pb-lg-2 text-secondary">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-info">
                          Register here
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

export default Login;
