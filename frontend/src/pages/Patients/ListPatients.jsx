import React, { useContext } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { VscError } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../Context/ContextApi";
function ListPatients({ data, getPatients }) {
  const token = localStorage.getItem("medicineToken");
  const navigate = useNavigate();
 const { ApiUrl } = useContext(StoreContext);

  const deletePatients = async (id) => {
    if (window.confirm("Are you sure you want to delete")) {
      try {
        const response = await axios.post(
          `${ApiUrl}/patients/delete/${id}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          toast.success(response.data.message);
          getPatients();
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <tr>
      <td>{data._id.slice(0,5)}</td>
      <td>{data.name}</td>
      <td>{data.address.slice(0, 30)}</td>
      <td
        className={`text-center ${ 
          data.payment_status === "Paid" ? "text-success" : "text-danger"
        }`}
      >
        {data.payment_status}
      </td>
      <td>{data.headman_id.name}</td>
      <td className="text-center">{data.total_charges}</td>
      <td>
        <FiEdit
          onClick={() => navigate(`/patients/update/${data._id}`)}
          className="mx-2 text-info cursor-pointer fs-5"
        />
        <MdDelete
          onClick={() => deletePatients(data._id)}
          id={`${data._id}`}
          className="ms-3 text-danger cursor-pointer fs-4"
        />
      </td>
    </tr>
  );
}

export default ListPatients;
