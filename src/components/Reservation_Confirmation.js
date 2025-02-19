import React, { useState,useEffect } from 'react';
import Sidebar from './Sidebar';
import maleimg from '../logo/malelogo.svg';
import femalimg from '../logo/femalelogo.svg';
import { Link,useParams } from 'react-router-dom';
import { BASE_URL } from "../components/config";

function Reservation_Confirmation() {
  const [isActive, setIsActive] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState("");
  const { roomId } = useParams();
  const [reservationstatus, setStatus] = useState();
  const [id, setId] = useState();

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const serchinfo = async () => {
    if (!search.trim()) {
      setError("Please enter a patient's name.");
      setSearchResult(null);
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/resconfiguration/${search}`);
      const result = await response.json();
      const getid = result.map((item) => item._id)[0];
      setId(getid);
      if (response.ok) 
      {
        if (result && result.length > 0) {
          setSearchResult(result);
          setError(null);
        } else {
          setSearchResult(null);
          setError("Please search for registered Patients only.");
        }
      } else {
        setSearchResult(null);
        setError("No record found.");
      }
    } catch (error) {
      setError("Error fetching data. Please try again later.");
      setSearchResult(null);
    }
  };

  useEffect(() => {
    const getreservation = async () => {
      let data = await fetch(`${BASE_URL}/checkout_transctiondetails`);
      const response = await data.json();
      const status = response.map((item) => item.ReservationStatus)[0];
      const pid = response.map((item) => item.patientid)[0];
      if (id && pid && id === pid) {
        setStatus(status);
      }
    };
    getreservation();
  }, [id]);
  
  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div id="page-container" className={isActive ? 'sidebar-open' : 'sidebar-closed'}>
        <div className="container transction">
          <div className="row justify-content-center trscard">
            <div className="col-md-9">
              <h4>Reservation Confirmation</h4>
              <label> Please search by the patient's name, mobile number, or any document number
              </label>
              <div className="trscontent">
                <div className="trssec">
                  <i className="fa fa-search transctionserch" aria-hidden="true"></i>
                  <input type="text"  value={search} onChange={(e) => setSearch(e.target.value)}
                    className="form-control"  placeholder="Search..." />
                </div>
                <button className="trabutton" onClick={serchinfo}> Search</button>
              </div>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
          </div>
        </div> 
      <div className="container">
        <div className="resconfcard">
          <div className="row justify-content-center res-cards-container">
            {searchResult && searchResult.length > 0 ? (
              searchResult.map((result, index) => (
                <section className="section-card4" key={index}>
                  <div className="card1">
                    <div className="profile-card1" style={{ height: "300px" }}>
                      <div className="card-continer1">
                        {result.gender === "Male" ? (
                          <img src={maleimg} alt="Male" className="resimg1" />
                        ) : (
                          <img src={femalimg} alt="Female" className="resimg1" />
                        )}
                      </div>

                      <div className="rightcard-container">
                        <h3 className="restitle">
                          Patient Details
                        </h3>

                        <div className="profile-details">
                          <div className="detail-row1">
                            <span className="label">Patient Name </span>
                            <span className="value"> {result.patientname}</span>
                          </div>
          
                          <div className="detail-row1">
                            <span className="label">Mobile No</span>
                            <span className="value"> {result.prinumber}</span>
                          </div>

                          <div className="detail-row1">
                            <span className="label">Alternative Mo. No.</span>
                            <span className="value">{result.secnumber || '-'}</span>
                          </div>

                          <div className="detail-row1">
                            <span className="label">Aadhaar No.</span>
                            <span className="value">{result.idnumber}</span>
                          </div>

                          <div className="detail-row1">
                            <span className="label">Address</span>
                            <span className="value"> {result.address}</span>
                          </div>
                        </div>

                        <div className="tablebutton mt-3 mb-3 d-flex justify-content-center gap-3">
                      <Link to="/">
                        <button className="btn btn-primary">Go to Home</button>
                      </Link>
                      <Link to={`/reservation_charges/${roomId}/${result._id}`}>
                        <button className="btn btn-info">New Reservation</button>
                      </Link>
                    </div>
                      </div>
                    </div>
                  </div>
                </section>
              ))
            ) : (
              <p>''</p>
            )}
          </div>
        </div>
      </div>

      </div>   
    </>
  );
}

export default Reservation_Confirmation;
