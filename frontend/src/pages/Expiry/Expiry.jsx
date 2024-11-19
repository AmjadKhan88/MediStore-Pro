import React, { useContext, useEffect, useState } from "react";
import "./Expiry.css";
import { toast } from "react-toastify";
import axios from "axios";
import Accordion from "react-bootstrap/Accordion";
import { differenceInBusinessDays, parseISO } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/ContextApi";

function Expiry() {
  const token = localStorage.getItem("medicineToken");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
 const { ApiUrl } = useContext(StoreContext);
  // Fetch all medicine data from database to check expiry
  const expire_medicine = async () => {
    try {
      const response = await axios.get(
        `${ApiUrl}/dashboard/expired_medicine`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        console.log(response.data.data);
        setData(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    expire_medicine();
  }, []);

  return (
    <div className="col-md-8 mx-auto">
      <h1 className="text-center fs-5 my-3 text-secondary">
        Details of medicine close to expiry or expired
      </h1>
      
      <Accordion className="mt-5">
        <Accordion.Item eventKey="1" className="border border-warning">
          <Accordion.Header>
            <span className="text-warning">Medicine close to expiry</span>
          </Accordion.Header>
          <Accordion.Body>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th className="text-sm text-warning text-center">Expiry</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((value) =>
                  differenceInBusinessDays(
                    new Date(),
                    parseISO(value.expiry_date)
                  ) < 0 &&
                  differenceInBusinessDays(
                    new Date(),
                    parseISO(value.expiry_date)
                  ) > -30 ? (
                    <tr key={value._id}>
                      <td>{value._id}</td>
                      <td>{value.name}</td>
                      <td className="text-center text-warning">
                        {Math.abs(
                          differenceInBusinessDays(
                            new Date(),
                            parseISO(value.expiry_date)
                          )
                        )}{" "}
                        <small> remining days</small>
                      </td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            navigate("/medicine/update/" + value._id)
                          }
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="0" className="mt-5 border border-danger">
          <Accordion.Header>
            <span className="text-danger">Expired Medicine</span>
          </Accordion.Header>
          <Accordion.Body>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th className="text-danger text-center">Expired</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((value) =>
                  differenceInBusinessDays(
                    new Date(),
                    parseISO(value.expiry_date)
                  ) > 0 ? (
                    <tr key={value._id}>
                      <td>{value._id}</td>
                      <td>{value.name}</td>
                      <td className="text-danger text-center">
                        {Math.abs(
                          differenceInBusinessDays(
                            new Date(),
                            parseISO(value.expiry_date)
                          )
                        )}{" "}
                        <small>days ago</small>
                      </td>
                      <td>
                        {" "}
                        <button
                          type="button"
                          class="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            navigate("/medicine/update/" + value._id)
                          }
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default Expiry;
