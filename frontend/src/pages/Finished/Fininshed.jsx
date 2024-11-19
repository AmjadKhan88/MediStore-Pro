import React, { useContext, useEffect, useState } from 'react'
import './Finished.css'
import {toast} from 'react-toastify'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/ContextApi';
function Fininshed() {
  const navigate = useNavigate();
  const token = localStorage.getItem("medicineToken");
  const [data, setData] = useState([]);
 const { ApiUrl } = useContext(StoreContext);
  // Fetch all medicine data from database to check expiry
  const finished_medicine = async () => {
    try {
      const response = await axios.get(
        `${ApiUrl}/dashboard/finished_medicine`,
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
    finished_medicine();
  }, []);

  return (
    <div className='col-md-8 mx-auto'>
      <h1 className="my-4 fs-4 text-center"> Finished Medicines</h1>
      <div className="my-5">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th className='text-center'>Name</th>
              <th className="text-sm text-warning text-center text-center">items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((value) => (
              <tr key={value._id}>
                  <td>{value._id}</td>
                  <td className='text-center'>{value.name}</td>
                  <td className='text-danger text-center'>{value.qty} <small> remining</small></td>
                  <td><button
                          type="button"
                          class="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            navigate("/medicine/update/" + value._id)
                          }
                        >Details</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Fininshed
