import React, { useState, useEffect } from "react";
import axios from "axios";
import gsap from "gsap";
import { validateLeaveRequestForm } from "./validation";

function LeaveRequest() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    gsap.from(".fade-in", { opacity: 0, duration: 1, y: -30, stagger: 0.2 });

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/leaveRequest/all`)
      .then((response) => {
        setLeaveRequests(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [errors]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const errors = validateLeaveRequestForm(formData);
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      const leaveRequest = {
        studentName: formData.get("studentName"),
        studentID: formData.get("studentID"),
        fromDate: formData.get("fromDate"),
        toDate: formData.get("toDate"),
        reason: formData.get("reason"),
      };

      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/leaveRequest/submit`,
          leaveRequest
        )
        .then((response) => {
          event.currentTarget.reset();
          gsap.to(".fade-in", { opacity: 1, duration: 1, y: 0 });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleDeleteRequest = (id) => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/leaveRequest/${id}`)
      .then((response) => {
        setLeaveRequests(leaveRequests.filter((request) => request._id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="flex flex-col container mx-auto p-4 space-y-8">
      {/* Leave Request Form */}
      <form
        onSubmit={handleSubmit}
        className="fade-in max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-700 mb-6">
          Submit Leave Request
        </h2>

        <div className="space-y-4">
          {/* Student Name and ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Student Name
              </label>
              <input
                type="text"
                name="studentName"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Student ID
              </label>
              <input
                type="text"
                name="studentID"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter your ID"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                From Date
              </label>
              <input
                type="date"
                name="fromDate"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                To Date
              </label>
              <input
                type="date"
                name="toDate"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reason
            </label>
            <textarea
              name="reason"
              rows="4"
              className="mt-2 p-2 w-full border border-gray-300 rounded-md shadow-sm"
              placeholder="Enter your reason"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Proof
            </label>
            <input
              type="file"
              name="proof"
              className="mt-2 p-2 w-full border border-gray-300 rounded-md shadow-sm"
              accept="image/*,application/pdf"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
            >
              Submit
            </button>
            <button
              type="reset"
              className="py-2 px-6 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Error Messages */}
        <div className="text-red-500 text-sm mt-4">
          {errors.studentName && <div>{errors.studentName}</div>}
          {errors.studentID && <div>{errors.studentID}</div>}
          {errors.fromDate && <div>{errors.fromDate}</div>}
          {errors.toDate && <div>{errors.toDate}</div>}
          {errors.reason && <div>{errors.reason}</div>}
          {errors.proof && <div>{errors.proof}</div>}
        </div>
      </form>

      {/* Leave Requests Table */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg fade-in">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Leave Requests
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Student Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Student ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  From Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  To Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Reason
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{request.studentName}</td>
                  <td className="py-3 px-4">{request.studentID}</td>
                  <td className="py-3 px-4">
                    {new Date(request.fromDate).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(request.toDate).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-4">{request.reason}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                      onClick={() => handleDeleteRequest(request._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LeaveRequest;
