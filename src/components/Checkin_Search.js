
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import maleimg from '../logo/malelogo.svg';
import femalimg from '../logo/femalelogo.svg'
import notfound from '../logo/notfound.svg'
import {Link} from 'react-router-dom';
import { BASE_URL } from "./config";

function Checkin_Search() {
  const [isActive, setIsActive] = useState(true);
  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const [search, setSearch] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState(null);
  const [getgender, setgender] = useState();


  const serchinfo = async () => {
    if (!search.trim()) {
      setError("Please enter a patient's name.");
      setPatientData(null);
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/checkin_search/${encodeURIComponent(search)}`);
      const result = await response.json();
      const patientid = result.map((item) => item.patientid);
      const reservedPatients = result.filter((item) => item.checkStatus !== "Check In");
      if (reservedPatients.length > 0) {
        setPatientData(reservedPatients);
        setError(null);
      } else {
        setError('No Record Found.');
        setPatientData(null);
      }
  
      if (patientid.length > 0) {
        const response2 = await fetch(`${BASE_URL}/search_registration/${patientid[0]}`);
        const data = await response2.json();
        const gender = data.map((item)=>item.gender)[0]
        setgender(gender);
      }
    } catch (error) {
      setError('Something went wrong while fetching data.');
      setPatientData(null);
    }
  };
  
  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div id="page-container" className={isActive ? 'sidebar-open' : 'sidebar-closed'}>
        <div className="container transction ">
          <div className="row justify-content-center trscard">
            <div className="col-md-8">
              <h4>Check-In </h4>
              <p>Please search by patient's name</p>
              <div className="trscontent">
                <div className="trssec">
                  <i className="fa fa-search transctionserch" aria-hidden="true"></i>
                  <input type="text" value={search}  onChange={(e) => setSearch(e.target.value)}
                    className="form-control" placeholder="Search..." />
                </div>
                <button className="trabutton" onClick={serchinfo}> Search </button>
              </div>
            </div>
          </div>
         
        </div>
        <center>{error && <div className="" style={{color:"#94a3b8"}}>
          <img src={notfound} alt="" width={300} height={300} />
          <h4>No matching results</h4>
          <p>Looks like we couldn't find any matching results<br/> for your search terms. Try other search terms.</p>
          </div>}</center>
        {patientData && (
          <div className="mt-3 patient-cards">
            <h3>Patient Details</h3>
            <div className="patient-cards-container ">
              {patientData.map((patient, index) =>
               (
                <div key={index} className="patient-card ">
                  <div className="patient-card-header">
                  <div className="patient-image justify-content-center">
                    {getgender === 'Male' ? (
                      <img src={maleimg} alt="Male" />
                    ) : (
                      <img src={femalimg} alt="Female" />
                    )}
                  </div>
                  </div>
                  <div className="patient-card-body">
                  <h4 style={{display: "none"}}>{index + 1}</h4>
                  <h4>{patient.patientname}</h4>
                  <h4>{patient.prinumber}</h4>
                  </div>
                  <Link to={"/checkin/"+patient._id}><button className='viewprobtn'>View Profile</button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Checkin_Search;
