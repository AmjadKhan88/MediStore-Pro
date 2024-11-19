import React, { useContext } from 'react'
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { VscError } from "react-icons/vsc";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { StoreContext } from '../../Context/ContextApi';
function ListCategory({ data, getCategory }) {
  const token = localStorage.getItem("medicineToken");
  const navigate = useNavigate();
 const { ApiUrl } = useContext(StoreContext);
  const deleteCategory = async (id) => {
    if(window.confirm("Are you sure you want to delete")){
    try {
      const response = await axios.post(
        `${ApiUrl}/category/delete/${id}`,
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
        getCategory();
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
      <td>{data.slug}</td>
      <td className="text-center">
        {data.status === "true" ? (
          <GrStatusGood className="text-success" />
        ) : (
          <VscError className="text-danger" />
        )}
      </td>
      <td>
        <FiEdit
          onClick={() => navigate(`/category/update/${data._id}`)}
          className="mx-2 text-info cursor-pointer fs-5"
        />
        <MdDelete
          onClick={() => deleteCategory(data._id)}
          id={`${data._id}`}
          className="ms-3 text-danger cursor-pointer fs-4"
        />
      </td>
    </tr>
  );
}

export default ListCategory
