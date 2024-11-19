import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import { useForm } from "react-hook-form";
import { FileUploader } from "react-drag-drop-files";
import { toast } from "react-toastify";
import axios from "axios";
import Select from "react-select";
import { StoreContext } from "../../Context/ContextApi";

function UpdatePatients() {
  const token = localStorage.getItem("medicineToken");
  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState([]);
  const [headman, setHeadman] = useState([]);
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
  const age = {
    required: { value: true, message: "The age field is required" },
  };
  const total_charges = {
    required: { value: true, message: "The price field is required" },
    pattern: {
      value: /^[0-9]+$/,
      message: "The price must be an integer",
    },
  };
  const amount_paid = {
    required: { value: true, message: "The price field is required" },
    pattern: {
      value: /^[0-9]+$/,
      message: "The price must be an integer",
    },
  };
  const gender = {
    required: { value: true, message: "The gender field is required" },
  };

  // Submit form data
  const onSubmit = async (data) => {
    setLoader(true);
    console.log(selectedMedicine);
    // Map selectedMedicine to an array of IDs
    data.medicine_id = selectedMedicine.map((medicine) => medicine.value);

    try {
      const response = await axios.post(
        `${ApiUrl}/patients/update/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log(response.data.message);
        toast.success(response.data.message);
        setLoader(false);
        navigate("/patients");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(err.response.data.message);
      setLoader(false);
    }
  };

  const CancelForm = () => {
    if (confirm("Are you sure want to cancel")) {
      navigate("/patients");
    }
  };

  // get all medicine
  const getMedicine = async () => {
    try {
      const response = await axios.get(
        `${ApiUrl}/medicine/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        const formattedOptions = response.data.data.map((medicine) => ({
          value: medicine._id,
          label: medicine.name, // Adjust based on the actual name field
        }));
        setMedicineOptions(formattedOptions);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // get all headman
  const getHeadman = async () => {
    try {
      const response = await axios.get(
        `${ApiUrl}/headman/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setHeadman(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // get old record of patient to update
  const getPatient = async ()=> {
    try {
      const response = await axios.get(
        `${ApiUrl}/patients/single/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(response.data.success) {
        const patient = response.data.data;
        const formattedOptions = response.data.data.medicine_id.map((medicine) => ({
          value: medicine._id,
          label: medicine.name, // Adjust based on the actual name field
        }));
        setSelectedMedicine(formattedOptions);
        setValue('name', patient.name);
        setValue('age', patient.age);
        setValue("allergies", patient.allergies);
        setValue("gender", patient.gender);
        setValue("bp", patient.bp);
        setValue("payment_status", patient.payment_status);
        setValue("address", patient.address);
        setValue("total_charges", patient.total_charges);
        setValue("amount_paid", patient.amount_paid);
        setValue("headman_id", patient.headman_id);
        // setSelectedMedicine(patient.medicine_id);
        setValue("notes", patient.notes);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    getMedicine();
    getHeadman();
    getPatient();
  }, []);

  return (
    <div className="p-5 p-md-3 p-sm-2 mx-auto" style={{ maxWidth: "1200px" }}>
      <div className="d-flex justify-content-between align-items-center">
        <span className="h4">Medicine Update</span>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/patients")}
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
              placeholder="Patient Name"
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
              id="age"
              {...register("age", age)}
              className="form-control"
              placeholder="Patient age"
            />
            {errors.age && <span className="text-danger">{errors.age}</span>}
          </div>
        </div>
        <div className="row mt-3">
          {/* price  */}
          <div className="col-md-6 d-flex gap-2">
            <div className="form-group w-50">
              <label htmlFor="allergies" className="form-lable text-secondary">
                allergies
              </label>
              <select
                {...register("allergies")}
                defaultValue={"No"}
                className="form-select text-secondary"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group w-50">
              <label
                htmlFor="gender"
                className="form-label mb-0 text-secondary"
              >
                gender
              </label>
              <select
                {...register("gender")}
                defaultValue={"Male"}
                className="form-select text-secondary"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <span className="text-danger"> {errors.gender.message}</span>
              )}
            </div>
          </div>
          {/* Qty  */}
          <div className="col-md-6 d-flex gap-2">
            <div className="form-group w-50">
              <label htmlFor="bp" className="form-label mb-0 text-secondary">
                Blood Presure
              </label>
              <select
                {...register("bp")}
                defaultValue={"Good"}
                id="bp"
                className="form-select text-secondary"
              >
                <option value="High">High</option>
                <option value="Good">Good</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="form-group w-50">
              <label
                htmlFor="payment_status"
                className="form-label mb-0 text-secondary"
              >
                Payment Satus
              </label>
              <select
                {...register("payment_status")}
                defaultValue={"Normal"}
                id="payment_status"
                className="form-select text-secondary"
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          {/* Expiry Date  */}
          <div className="col-md-6">
            <input
              type="text"
              {...register("address")}
              placeholder="Patient address"
              className="form-control"
            />
          </div>
          {/* Status  */}
          <div className="col-md-6 d-flex gap-2">
            <input
              type="number"
              {...register("total_charges")}
              placeholder="Total charge"
              className="form-control w-50"
            />
            <input
              type="number"
              {...register("amount_paid")}
              placeholder="Amount paid"
              className="form-control w-50"
            />
          </div>
        </div>
        <div className="row mt-3">
          {/* Registry No  */}
          <div className="col-md-6">
            <Select
              isMulti
              name="medicine_id"
              options={medicineOptions}
              value={selectedMedicine}
              onChange={(selected) => setSelectedMedicine(selected)}
              className="basic-multi-select"
              classNamePrefix="select"
            />
            {selectedMedicine.length === 0 && (
              <span className="text-danger">
                Select medicines for the patient
              </span>
            )}
          </div>
          {/* Miligram  */}
          <div className="col-md-6">
            <select
              id="headman"
              className="form-control text-secondary"
              {...register("headman_id")}
            >
              <option value="">Select Headman</option>
              {headman.map((headman) => (
                <option key={headman._id} value={headman._id}>
                  {headman.name}
                </option>
              ))}
            </select>
            {errors.miligram && (
              <span className="text-danger">{errors.miligram.message}</span>
            )}
          </div>
        </div>
        <Accordion className="mt-3">
          <div className="row">
            <div className="col-md-12">
              <Accordion.Item eventKey="0">
                <Accordion.Header className="text-secondary">
                  Notes (optional)
                </Accordion.Header>
                <Accordion.Body>
                  <div className="col-md-12 textarea-style">
                    <textarea
                      name="notes"
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
          </div>
        </Accordion>
        <div className="row mt-3">
          <button
            disabled={loader}
            type="submit"
            className="btn btn-primary col-md-3"
          >
            {loader ? "Loading..." : "Update"}
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

export default UpdatePatients;
