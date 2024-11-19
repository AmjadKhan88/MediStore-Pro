import React, { useState, useEffect, useContext } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ListHeadman from "./ListHeadman";
import { StoreContext } from "../../Context/ContextApi";
function Headman() {
  const token = localStorage.getItem("medicineToken");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(8);
  const navigate = useNavigate();
 const { ApiUrl } = useContext(StoreContext);
  const getHeadman = async (keywords = "", page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          ApiUrl
        }/headman/all/${keywords}?page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setData(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setCurrentPage(response.data.pagination.currentPage);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getHeadman();
  }, []);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getHeadman("", currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getHeadman("", currentPage - 1);
    }
  };

  return (
    <div className="p-5 p-md-3 p-sm-2 mx-auto" style={{ maxWidth: "1000px" }}>
      <div className="d-flex justify-content-between align-items-center">
        <span className="h4">Headman</span>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/headmans/create")}
        >
          add
        </button>
      </div>
      <div
        className="form-control mt-4 mb-2 d-flex align-items-center search-bar"
        style={{ maxWidth: "300px", float: "right" }}
      >
        <input
          type="text"
          placeholder="Search here"
          className="bg-transperent w-100"
          style={{ outline: "none", border: "none" }}
          onKeyUp={(e) => getHeadman(e.target.value)}
        />
        <CiSearch className="fs-3" style={{ width: "50px" }} />
      </div>
      <table className="mt-5 border table table-striped">
        <thead className="border" style={{ backgroundColor: "#F5BCBA" }}>
          <th className="p-3">Id</th>
          <th className="p-3">Name</th>
          <th className="p-3">contact</th>
          <th className="p-3">address</th>
          <th className="p-3">Gender</th>
          <th className="p-3">Payment</th>
          <th className="p-3">Action</th>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <ListHeadman key={index} data={item} getHeadman={getHeadman} />
            ))
          )}
        </tbody>
      </table>
      <nav aria-label="Page navigation example my-4">
        <ul className="pagination">
          <li className="page-item">
            <button
              className="page-link"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">
              Page {currentPage} of {totalPages}
            </span>
          </li>
          <li className="page-item">
            <button
              className="page-link"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Headman;