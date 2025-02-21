import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import maleimg from '../logo/malelogo.svg';
import femalimg from '../logo/femalelogo.svg';

import { BASE_URL } from "./config";

function AttendantModification_info() {
  const { id } = useParams();
  const [isActive, setIsActive] = useState(true);
  const [TransactionData, setTransactionData] = useState(null);
  const [reationldata, setRelationaldata] = useState(null);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const getinfo = async () => {

    const response = await fetch(`${BASE_URL}/attedentmodificationinfo/${id}`);
    const data = await response.json();
    setTransactionData(data);
  };

  useEffect(() => {
    getinfo(); 
    const relationdata = async () => {
      try {

        const response = await fetch(`${BASE_URL}/get_attdent`);
        const data = await response.json();
        setRelationaldata(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    relationdata();
  }, []);

  const latestRelation = reationldata
    ? reationldata
        .filter((getdata) => getdata.pid === id)  
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
    : null;

  const date = new Date().getTime();
  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div id="page-container" className={isActive ? "sidebar-open" : "sidebar-closed"}>
        <div className="section-card3">
      <div className="card1">
        {TransactionData && (
          <>
            <div className="profile-card1" style={{ height: "350px", }}>
              <div className="card-continer1">
                {TransactionData.gender === "Male" ? (
                  <img src={maleimg} alt="Male" className="resimg1" />
                ) : (
                  <img src={femalimg} alt="Female" className="resimg1" />
                )}
              </div>
              <div className="rightcard-container">
                <h3 className="card-titles1" style={{ marginTop: "0px" }}>Patient Details</h3>
                <div className="profile-details">
                  <div className="detail-row1">
                    <span className="label">Patient Name</span>
                    <span className="value">{TransactionData.patientname}</span>
                  </div>
                  <div className="detail-row1">
                    <span className="label">Mobile No.</span>
                    <span className="value">{TransactionData.prinumber}</span>
                  </div>
                  <div className="detail-row1">
                    <span className="label">Alternative No.</span>
                    <span className="value">{TransactionData.secnumber || "-"}</span>
                  </div>
                  <div className="detail-row1">
                    <span className="label">{TransactionData.idproof} No.</span>
                    <span className="value">{TransactionData.idnumber}</span>
                  </div>
                  <div className="detail-row1">
                    <span className="label">Address</span>
                    <span className="value">{TransactionData.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
       <center>
          {TransactionData && (
          <Link to={`/addattendant/${TransactionData._id}`}>
            <button className='continue-btn mt-3'>Add Attendance</button>
          </Link>
        )}
      </center>
      </div>

      <div className="card1">
        {latestRelation && (
          <>
            <div className="profile-card1" style={{ height: "350px", }}>
              <div className="card-continer1">
                {latestRelation.gender === "Male" ? (
                  <img src={maleimg} alt="Male" className="resimg1" />
                ) : (
                  <img src={femalimg} alt="Female" className="resimg1" />
                )}
              </div>
              <div className="rightcard-container">
                <h3 className="card-titles1" style={{ marginTop: "0px" }}>Attendant Details</h3>
                <div className="profile-details">
                  <div className="detail-row1">
                    <span className="label">Attendant Name</span>
                    <span className="value">{latestRelation.patientname}</span>
                  </div>
                  <div className="detail-row1">
                    <span className="label">Mobile No.</span>
                    <span className="value">{latestRelation.prinumber}</span>
                  </div>
                  <div className="detail-row1">
                    <span className="label">Alternative No.</span>
                    <span className="value">{latestRelation.secnumber || "-"}</span>
                  </div>
                  <div className="detail-row1">
                    <span className="label">{latestRelation.idproof} No.</span>
                    <span className="value">{latestRelation.idnumber}</span>
                  </div>
                  <div className="detail-row1">
                    <span className="label">Address</span>
                    <span className="value">{latestRelation.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
         <center>
        {latestRelation && (
          <Link to={`/update_attdence/${latestRelation.pid}`}>
            <button className='btn btn-info mt-3'>Change Attendance</button>
          </Link>
        )}
      </center>
      </div>
      </div>
      </div>
    </>
  );
}

export default AttendantModification_info;
