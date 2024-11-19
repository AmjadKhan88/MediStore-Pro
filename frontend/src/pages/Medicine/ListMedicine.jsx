import React, { useContext } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { VscError } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../Context/ContextApi";

function ListMedicine({ data,getMedicine }) {
 const { ApiUrl } = useContext(StoreContext);
    const token = localStorage.getItem("medicineToken");
    const navigate = useNavigate();

    const deleteMedicine = async (id) => {
      if (window.confirm("Are you sure you want to delete")) {
        try {
          const response = await axios.post(
            `${ApiUrl}/medicine/delete/${id}`,
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
            getMedicine();
          }
        } catch (error) {
          toast.error(error.response.data.message);
        }
      }
    };

  return (
    <tr>
      <td>{data._id}</td>
      <td>{data.name}</td>
      <td>{data.qty}</td>
      <td>{data.price}</td>
      <td>{data.expiry_date}</td>
      <td className="text-center">
        {data.status === "true" ? (
          <GrStatusGood className="text-success" />
        ) : (
          <VscError className="text-danger" />
        )}
      </td>
      <td>
        <FiEdit
          onClick={() => navigate(`/medicine/update/${data._id}`)}
          className="mx-2 text-info cursor-pointer fs-5"
        />
        <MdDelete
          onClick={() => deleteMedicine(data._id)}
          id={`${data._id}`}
          className="ms-3 text-danger cursor-pointer fs-4"
        />
      </td>
    </tr>
  );
}

export default ListMedicine;
