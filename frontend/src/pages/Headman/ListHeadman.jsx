import React, { useContext } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { VscError } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../Context/ContextApi";

function ListHeadman({ data, getHeadman }) {
  const token = localStorage.getItem("medicineToken");
  const navigate = useNavigate();
 const { ApiUrl } = useContext(StoreContext);
  const deleteHeadman = async (id) => {
    if (window.confirm("Are you sure you want to delete")) {
      try {
        const response = await axios.post(
          `${ApiUrl}/headman/delete/${id}`,
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
          getHeadman();
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
      <td>{data.contact}</td>
      <td>{data.address.slice(0, 20)}</td>
      <td className="text-center">{data.gender}</td>
      <td className={`text-center ${data.payment_status === 'Paid'?'text-success':'text-danger'}`}>
       {data.payment_status}
      </td>
      <td>
        <FiEdit
          onClick={() => navigate(`/headmans/update/${data._id}`)}
          className="mx-2 text-info cursor-pointer fs-5"
        />
        <MdDelete
          onClick={() => deleteHeadman(data._id)}
          id={`${data._id}`}
          className="ms-3 text-danger cursor-pointer fs-4"
        />
      </td>
    </tr>
  );
}

export default ListHeadman;
