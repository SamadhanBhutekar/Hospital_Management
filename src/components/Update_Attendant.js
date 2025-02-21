import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
<<<<<<< HEAD
import { useParams} from "react-router-dom";
import { useNavigate } from "react-router";
import { BASE_URL } from "./config";
=======
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router";
import {BASE_URL} from './config';
>>>>>>> 06e608edbc620353fb95abb3d4b3aef2a8f074c7

function Update_Attendant() {
  const [isActive, setIsActive] = useState(true);
  const [attendants, setAttendants] = useState([]);
  const [selectedAttendant, setSelectedAttendant] = useState(null);
  const Navigate = useNavigate();
  const { id } = useParams();

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleSelectAttendant = (e) => {
    const selectedId = e.target.value;
    const attendant = attendants.find((item) => item._id === selectedId);
    setSelectedAttendant(attendant);
  };

  useEffect(() => {
    if (!id) {
      console.error("ID parameter from URL is missing!");
      return;
    }

    const fetchAttendants = async () => {
      try {
<<<<<<< HEAD
        let response = await fetch(`${BASE_URL}/patientdata`);
=======
        let response = await fetch(`${BASE_URL}patientdata`);
>>>>>>> 06e608edbc620353fb95abb3d4b3aef2a8f074c7
        let result = await response.json();
        const filteredAttendants = result.filter(
          (item) => String(item.pid) === String(id)
        );
        setAttendants(filteredAttendants);
      } catch (error) {
        console.error("Error fetching attendants:", error);
      }
    };

    fetchAttendants();
  }, [id]);

  const handleSave = async () => {
    const response = await fetch(
<<<<<<< HEAD
      `${BASE_URL}/update-attendant/${selectedAttendant._id}`,
=======
      `${BASE_URL}update-attendant/${selectedAttendant._id}`,
>>>>>>> 06e608edbc620353fb95abb3d4b3aef2a8f074c7
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    if (result.success) {
      Navigate("/attedence_modification");
    } else {
      alert("Failed to update timestamp.");
    }
  };
  const cancal = () => {
    Navigate(`/attendantinfo/${id}`);
  };
  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div
        id="page-container"
        className={isActive ? "sidebar-open" : "sidebar-closed"}>
        <div className="container updateattdence">
          <div className="row trscard">
            <center>
              <h4>Attendant</h4>
            </center>
            <form>
              <div className="row">
                <div className="from_section">
                  <label>
                    Select Attendant<label className="star">*</label>
                  </label>
                  <div className="input_field select_option">
                    <select required onChange={handleSelectAttendant}>
                      <option value="">Select Attendant Name</option>
                      {attendants.length > 0 ? (
                        attendants.map((attendant, index) => (
                          <option key={index} value={attendant._id}>
                            {attendant.patientname}
                          </option>
                        ))
                      ) : (
                        <option disabled>
                          No attendants found for this patient
                        </option>
                      )}
                    </select>
                    <div className="select_arrow"></div>
                  </div>
                </div>
              </div>
            </form>
            {selectedAttendant && (
              <>
                <div className="attendant-info">
                  <table>
                    <tbody>
                      <tr>
                        <td>Attendant Name </td>
                        <td>
                          <label>{selectedAttendant.patientname}</label>
                        </td>
                      </tr>
                      <tr>
                        <td>Gender</td>
                        <td>
                          <label>{selectedAttendant.gender}</label>
                        </td>
                      </tr>
                      <tr>
                        <td>Mobile Number</td>
                        <td>
                          <label>{selectedAttendant.prinumber}</label>
                        </td>
                      </tr>
                      <tr>
                        <td>Aadhaar Number</td>
                        <td>
                          <label>{selectedAttendant.idnumber}</label>
                        </td>
                      </tr>
                      <tr>
                        <td>Address</td>
                        <td>
                          <label>{selectedAttendant.address}</label>
                        </td>
                      </tr>
                      <tr>
                        <td>Relation with Patient </td>
                        <td>
                          <label>{selectedAttendant.relation}</label>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  className="update_attbtn justify-content-center"
                  style={{ display: "inline-block" }}>
                  <button className="btn btn-success" onClick={cancal}>
                    Cancal
                  </button>
                  <button className="btn btn-info" onClick={handleSave}>
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Update_Attendant;
