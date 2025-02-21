import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./css/registration.css";
import { useParams } from "react-router";
import { useNavigate } from 'react-router-dom';
import checkicon from '../logo/checkbox-icon.svg';
import {BASE_URL} from './config';

function Registration() {
  const [isActive, setIsActive] = useState(true);
  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const { id } = useParams();
  const navigate = useNavigate();

  const [patientname, setPatientname] = useState("");
  const [gender, setGender] = useState("");
  const [prinumber, setPrinumber] = useState("");
  const [secnumber, setSecnumber] = useState("");
  const [idproof, setIdproof] = useState("");
  const [address, setAddress] = useState("");
  const [assign, setAssign] = useState("");
  const [idnumber, setIdNumber] = useState("");
  const [IdImage, SetIdImage] = useState(null);
  const [relation, SetrRelation] = useState("");
  const [pid, setPid] = useState(id || "");
  const [currentdate, setCurrentDate] = useState("");
  const [errors, setErrors] = useState({});
  const [showModal, setModel] = useState(false);


  useEffect(() => {
    const date = new Date().toLocaleString();
    setCurrentDate(date);
  }, []);

const [errorMessage, setErrorMessage] = useState(""); 
const [secErrorMessage, setSecErrorMessage] = useState(""); 
const [idError, setIdError] = useState("");

const handleIdNumberChange = async (e) => 
{
  const newIdNumber = e.target.value;
  setIdNumber(newIdNumber);

  if (idproof && newIdNumber.length > 4) { 
    const response = await fetch(`${BASE_URL}check_idproof?idproof=${idproof}&idnumber=${newIdNumber}`);
    const data = await response.json();

    if (data.exists) {
      setIdError("This ID number are already Exists.");
    } else {
      setIdError("");
    }
  }
};
const checkNumber = async (number, type) => {

  try {
    let response = await fetch(`${BASE_URL}check_patient?number=${number}`);
    let data = await response.json();

    if (data.exists) {
      if (type === "primary") {
        setErrorMessage("This Mobile number is already Exists!");
      } else {
        setSecErrorMessage("This Mobile number is already Exists!");
      }
    } else {
      if (type === "primary") setErrorMessage("");
      else setSecErrorMessage("");
    }
  } catch (error) {
    console.error("Error checking number:", error);
  }
};

  const submit = async (e) => {
    e.preventDefault();
    if(idError)
    {
      alert("This ID number are already Exists.");
      return;
    }
    if (errorMessage || secErrorMessage) {
      alert("This Mobile number is already Exists!");
      return;
    }
  
    if (!validateForm()) return;
  
    const formData = new FormData();
    formData.append("patientname", patientname);
    formData.append("gender", gender);
    formData.append("prinumber", prinumber);
    formData.append("secnumber", secnumber);
    formData.append("idproof", idproof);
    formData.append("address", address);
    formData.append("assign", assign);
    formData.append("idnumber", idnumber);
    formData.append("file", IdImage);
  
    let result = await fetch(`${BASE_URL}patient_registration`, {
      method: "POST",
      body: formData,
    });
  
    result = await result.json();
    if (result.success) {
      setModel(true);
    } else {
      alert("Registration failed. Please try again.");
    }
  };
  

  const addattdent = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const formData = new FormData();
    formData.append("patientname", patientname);
    formData.append("gender", gender);
    formData.append("prinumber", prinumber);
    formData.append("secnumber", secnumber);
    formData.append("idproof", idproof);
    formData.append("relation", relation);
    formData.append("address", address);
    formData.append("idnumber", idnumber);
    formData.append("file", IdImage);
    formData.append("pid", id);

    let result = await fetch(`${BASE_URL}add_attdent`, {
      method: "POST",
      body: formData,
    });

    result = await result.json();
    if (result.success) {
      navigate('/attedence_modification');
    } else {
      alert("Registration failed. Please try again.");
    }
  };

  const cancel = () => {
    const anyFieldFilled = patientname || gender || prinumber || secnumber || idproof || address || assign;
    if (anyFieldFilled) {
      const confirmCancel = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      );
      if (!confirmCancel) return;
      navigate('/');
    }

    setPatientname(""); setGender(""); setPrinumber(""); setSecnumber(""); setIdproof(""); setAddress(""); setAssign("");
  };

  const validateForm = () => {
    let errors = {};
  
    // Mobile number validation (exactly 10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!prinumber.trim()) {
      errors.prinumber = "Primary contact number is required.";
    } else if (!mobileRegex.test(prinumber)) {
      errors.prinumber = "Enter a valid 10-digit mobile number.";
    }
   
    // ID proof validation
    if (!idproof) {
      errors.idproof = "ID proof is required.";
    }
  
    // Common ID number validation based on type
    if (idproof === "PAN") {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!idnumber.trim()) {
        errors.idnumber = "PAN number is required.";
      } else if (!panRegex.test(idnumber)) {
        errors.idnumber = "Invalid PAN format Check Number.";
      }
    } else if (idproof === "VoterId") {
      const voterIdRegex = /^[A-Z0-9]{10}$/;
      if (!idnumber.trim()) {
        errors.idnumber = "Voter ID number is required.";
      } else if (!voterIdRegex.test(idnumber)) {
        errors.idnumber = "Invalid Voter ID format.";
      }
    } else if (idproof === "Passport") {
      const passportRegex = /^[A-Z][0-9]{7}$/;
      if (!idnumber.trim()) {
        errors.idnumber = "Passport number is required.";
      } else if (!passportRegex.test(idnumber)) {
        errors.idnumber = "Invalid Passport format  Check Number.";
      }
    } else if (idproof === "Driving License") {
      const dlRegex = /^[A-Z]{2}[0-9]{2}[0-9A-Z]{1,11}$/;
      if (!idnumber.trim()) {
        errors.idnumber = "Driving License number is required.";
      } else if (!dlRegex.test(idnumber)) {
        errors.idnumber = "Invalid Driving License format.";
      }
    } else if (idproof === "Aadhaar") {
      const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
      if (!idnumber.trim()) {
        errors.idnumber = "Aadhaar number is required.";
      } else if (!aadhaarRegex.test(idnumber)) {
        errors.idnumber = "Invalid Aadhaar number allowed only number (12 digits).";
      }
    }
  
    // ID Image Validation
    if (!IdImage) {
      errors.IdImage = "ID image is required.";
    }
  
    // General field validations
    if (!patientname.trim()) errors.patientname = "Patient name is required.";
    if (!gender) errors.gender = "Please select a gender.";
    if (!address.trim()) errors.address = "Please enter an address.";
  
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleCloseModal = () => {
    navigate('/');
  };

  const toDate = new Date();
  const chckedDate = toDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div id="page-container" className={isActive ? "sidebar-open" : "sidebar-closed "} >
        <div className="form_wrapper">
          <div className="form_container">
            <div className="title_container">
             <h2>Personal Information</h2>
            </div>
            <div className="row">
              <div>
                <form>
                  <div className="row">
                    <div className="from_section">
                      <label className="formlabel">
                        Patient Name (as on Aadhaar) <label className="star">*</label>
                        {pid && (
                          <>
                            <input type="text" value={pid} onChange={(e) => setPid(e.target.value)} placeholder="Patient Id" style={{ display: 'none' }} required />
                            <input type="text" value={currentdate} onChange={(e) => setCurrentDate(e.target.value) } placeholder="Current date" style={{ display: 'none' }} required />
                          </>
                        )}
                      </label>

                      <div className="input_field">
                        <span> <i aria-hidden="true" className="fa fa-user"></i></span>
                        <input type="text" value={patientname} onChange={(e) => {setPatientname(e.target.value);if (e.target.value.trim()) {setErrors((prevErrors) => ({ ...prevErrors, patientname: "" }));}}} placeholder="First Name"required/>
                        {errors.patientname && <p className="error">{errors.patientname}</p>}
                      </div>
                    </div>

                    <div className="from_section">
                      <label className="formlabel">
                        Gender <label className="star">*</label>
                      </label>
                      <div className="input_field select_option">
                      <select value={gender} onChange={(e) => { setGender(e.target.value);if (e.target.value.trim()) {setErrors((prevErrors) => ({ ...prevErrors, gender: "" }));}}}required>
                          <option selected hidden value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="select_arrow"></div>
                        {errors.gender && <p className="error">{errors.gender}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="from_section">
                      <label className="formlabel">
                        Primary Contact Number <label className="star">*</label>
                      </label>
                      <div className="input_field">
                        <span><i className="fa fa-mobile"  aria-hidden="true"></i></span>
                        <input type="tel" inputMode="numeric" pattern="[0-9]*" maxLength={10}
                        minLength={10} value={prinumber} onChange={(e) => {const onlyNums = e.target.value.replace(/\D/g, ""); setPrinumber(onlyNums); checkNumber(onlyNums, "primary"); if (/^[6-9]\d{9}$/.test(onlyNums)) {
                          setErrors((prevErrors) => ({ ...prevErrors, prinumber: "" }));
                        }}}placeholder="Enter Mobile no"required
                        />
                         {errorMessage && <p className="error">{errorMessage}</p>}
                        {errors.prinumber && <p className="error">{errors.prinumber}</p>}
                      </div>
                    </div>

                    <div className="from_section">
                      <label className="formlabel">Secondary Contact Number</label>
                      <div className="input_field">
                        <span><i className="fa fa-mobile" aria-hidden="true"></i></span>
                        <input type="text" inputMode="numeric" pattern="[0-9]*"  maxLength={10} minLength={10} value={secnumber}  onChange={(e) => 
                        {const onlyNums = e.target.value.replace(/\D/g, ""); 
                          setSecnumber(onlyNums);checkNumber(onlyNums, "secondary");}} 
                          placeholder="Enter Mobile no (Optional)" />
                           {secErrorMessage && <p className="error">{secErrorMessage}</p>}
                           {errors.secnumber && <p className="error">{errors.secnumber}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {pid && (
                      <div className="from_section">
                        <label className="formlabel">
                          Relation With Patient<label className="star">*</label>
                        </label>
                        <div className="input_field select_option">
                          <select value={relation} onChange={(e) => SetrRelation(e.target.value)} required>
                            <option selected hidden value="">Relation With Patient</option>
                            <option value="Parent">Parent</option>
                            <option value="Husband">Husband</option>
                            <option value="Wife">Wife</option>
                            <option value="Child">Child</option>
                            <option value="Sibling">Sibling</option>
                            <option value="Friend">Friend</option>
                          </select>
                          <div className="select_arrow"></div>
                        </div>
                      </div>
                    )}

                    <div className="from_section">
                      <label className="formlabel">
                        Valid ID Proof <label className="star">*</label>
                      </label>
                      <div className="input_field select_option">
                          <select value={idproof} onChange={(e) => { setIdproof(e.target.value);
                          if (e.target.value.trim()) {setErrors((prevErrors) => ({ ...prevErrors, idproof: "" }));}}}required>
                          <option selected hidden value="">Select Valid ID Proof</option>
                          <option value="PAN">PAN</option>
                          <option value="VoterId">VoterId</option>
                          <option value="Passport">Passport</option>
                          <option value="Driving License">Driving License</option>
                          <option value="Aadhaar">Aadhaar</option>
                        </select>
                        <div className="select_arrow"></div>
                        {errors.idproof && <p className="error">{errors.idproof}</p>}
                      </div>
                    </div>

                    {idproof === "PAN" && (
                      <>
                        <div className="from_section">
                          <label className="formlabel">
                            PAN Number <label className="star">*</label>
                          </label>
                          <div className="input_field">
                          <span style={{padding:"2px"}}><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                            <input type="text" value={idnumber} onChange={handleIdNumberChange} placeholder="Enter PAN Number" maxLength={10}
                              minLength={10} required />
                            {idError && <p className="error">{idError}</p>}
                            {errors.idnumber && <p className="error">{errors.idnumber}</p>}
                          </div>
                        </div>
                        <div className="from_section">
                          <label className="formlabel">
                            PAN Image <label className="star">*</label>
                          </label>
                          <div className="input_field">
                            <input type="file" accept="image/*" onChange={(e) => {const file = e.target.files[0];SetIdImage(file);if (file) {setErrors((prevErrors) => ({ ...prevErrors, IdImage: "" }));}}}className="inputimg"required/>
                            {errors.IdImage && <p className="error">{errors.IdImage}</p>}
                          </div>
                        </div>
                      </>
                    )}

                    {idproof === "VoterId" && (
                      <>
                        <div className="from_section">
                          <label className="formlabel">
                            VoterId Number <label className="star">*</label>
                          </label>
                          <div className="input_field">
                          <span style={{padding:"2px"}}><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                            <input type="text" value={idnumber} onChange={handleIdNumberChange} placeholder="Enter VoterId Number" required />
                            {idError && <p className="error">{idError}</p>}
                            {errors.idnumber && <p className="error">{errors.idnumber}</p>}
                          </div>
                        </div>
                        <div className="from_section">
                          <label className="formlabel">
                            VoterId Image <label className="star">*</label>
                          </label>
                          <div className="input_field">
                          <input type="file" accept="image/*" onChange={(e) => {const file = e.target.files[0];SetIdImage(file);if (file) {setErrors((prevErrors) => ({ ...prevErrors, IdImage: "" }));}}}className="inputimg"required/>
                            {errors.IdImage && <p className="error">{errors.IdImage}</p>}
                          </div>
                        </div>
                      </>
                    )}

                    {idproof === "Passport" && (
                      <>
                        <div className="from_section">
                          <label className="formlabel">
                            Passport Number <label className="star">*</label>
                          </label>
                          <div className="input_field">
                          <span style={{padding:"2px"}}><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                            <input type="text" value={idnumber} onChange={handleIdNumberChange} placeholder="Enter Passport Number" required />
                            {idError && <p className="error">{idError}</p>}
                            {errors.idnumber && <p className="error">{errors.idnumber}</p>}
                          </div>
                        </div>
                        <div className="from_section">
                          <label className="formlabel">
                            Passport Image <label className="star">*</label>
                          </label>
                          <div className="input_field">
                          <input type="file" accept="image/*" onChange={(e) => {const file = e.target.files[0];SetIdImage(file);if (file) {setErrors((prevErrors) => ({ ...prevErrors, IdImage: "" }));}}}className="inputimg"required/>
                            {errors.IdImage && <p className="error">{errors.IdImage}</p>}
                          </div>
                        </div>
                      </>
                    )}

                    {idproof === "Driving License" && (
                      <>
                        <div className="from_section">
                          <label className="formlabel">
                            Driving License Number <label className="star">*</label>
                          </label>
                          <div className="input_field">
                          <span style={{padding:"2px"}}><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                            <input type="text" value={idnumber} onChange={handleIdNumberChange}  maxLength={15} minLength={15} placeholder="Enter Driving License Number" required />
                            {idError && <p className="error">{idError}</p>}
                            {errors.idnumber && <p className="error">{errors.idnumber}</p>}
                          </div>
                        </div>
                        <div className="from_section">
                          <label className="formlabel">
                            Driving License Image <label className="star">*</label>
                          </label>
                          <div className="input_field">
                          <input type="file" accept="image/*" onChange={(e) => {const file = e.target.files[0];SetIdImage(file);if (file) {setErrors((prevErrors) => ({ ...prevErrors, IdImage: "" }));}}}className="inputimg"required/>
                            {errors.IdImage && <p className="error">{errors.IdImage}</p>}
                          </div>
                        </div>
                      </>
                    )}

                    {idproof === "Aadhaar" && (
                      <>
                        <div className="from_section">
                          <label className="formlabel">
                            Aadhaar Number <label className="star">*</label>
                          </label>
                          <div className="input_field">
                          <span style={{padding:"2px"}}><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                          <input type="text" inputMode="numeric" value={idnumber}
                            onChange={handleIdNumberChange}  pattern="[0-9]*"
                            maxLength={12} minLength={12} placeholder="Enter ID Number"
                            required/>
                          {idError && <p className="error">{idError}</p>}
                          {errors.idnumber && <p className="error">{errors.idnumber}</p>}
                          </div>
                        </div>

                        <div className="from_section">
                          <label className="formlabel">
                            Aadhaar Image <label className="star">*</label>
                          </label>
                          <div className="input_field">
                          <input type="file" accept="image/*" onChange={(e) => {const file = e.target.files[0];SetIdImage(file);if (file) {setErrors((prevErrors) => ({ ...prevErrors, IdImage: "" }));}}}className="inputimg"required/>
                            {errors.IdImage && <p className="error">{errors.IdImage}</p>}
                          </div>
                        </div>
                      </>
                    )}

                    {!pid && (
                      <div className="from_section">
                        <label className="formlabel">
                          Is Attendant Assigned: <label className="star">*</label>
                        </label>
                        <div className="input_field">
                        <div className="radioinput">
                          <label className="formlabel">
                            <input type="radio" className="radiobtn" name="assign" value="Yes" checked={assign === "Yes"}
                              onChange={(e) => setAssign(e.target.value)} /> Yes
                          </label>
                          <label className="formlabel">
                            <input type="radio" className="radiobtn" name="assign" value="No" checked={assign === "No"}
                              onChange={(e) => setAssign(e.target.value)} /> No
                          </label>
                          </div>
                          {errors.assign && <p className="error">{errors.assign}</p>}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="row">
                    <label className="formlabel">Address <label className="star">*</label>
                    </label>
                    <div className="input_field">
                      <span className="addressicon"> <i className="fa fa-map-marker"></i></span>
                      <input type="text" value={address} onChange={(e) => { setAddress(e.target.value); if (e.target.value.trim()) {  setErrors((prevErrors) => ({ ...prevErrors, address: "" }));} }}placeholder="Ex: house/flat number, floor number, street, area, etc."required/>
                      {errors.address && <p className="error">{errors.address}</p>}
                    </div>
                  </div>

                  <div className="row registration-btn justify-content-center">
                    <button type="button" className="btn btn-success mx-3" onClick={cancel}>Cancel </button>
                    {!pid && (
                      <button type="submit" onClick={submit} className="btn btn-info mx-3"> Save</button>
                    )}
                    {pid && (
                      <button type="submit" onClick={addattdent} className="btn btn-info mx-3"> Continue</button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.icon}><img src={checkicon} height={120} width={120} /></div>
            <h4 style={{fontSize:"22px",marginTop:"20px"}}>Register Completed Successfully</h4>
            <h5 style={{fontSize:"16px",marginTop:"10px"}}>Registration Date : {chckedDate}</h5>
            <p style={{fontSize:"14px",marginTop:"10px"}}>Continue to complete the booking process...</p>
            <div style={styles.buttons}>
            <button className="btn btn-success mt-2" style={{width:"150px"}} onClick={handleCloseModal}>Home</button>
            </div>
          </div>
        </div>
      )}

      <style>{
        `.error {
          color: red;
          font-size: 12px;
          margin-top: 5px;
        }`
      }</style>
    </>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(79, 74, 74, 0.8)', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, 
  },
  modal: {
    backgroundColor: "#0c1a32",
    color: '#fff',
    padding: '50px 30px 40px 30px',
    borderRadius: '25px',
    textAlign: 'center',
    width: 'fit-content',
    boxShadow: "rgb(211, 220, 230,0.4) 0px 0px 10px 1px",
    zIndex: 1001, 
    height:"400px",
  },
  icon: {
    fontSize: '50px',
    color: '#a370f0',
    marginBottom: '15px',
  },
  details: {
    fontSize: '14px',
    margin: '15px 0',
  },
 
  buttons: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '20px',
  },
  button: {
    border: '10px !important',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Registration;
