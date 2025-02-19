
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import checkicon from '../logo/checkbox-icon.svg'
import { Link } from "react-router";
import moment  from "moment";

function Reservatin_Charges() {
  const [isActive, setIsActive] = useState(true);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const handleToggle = () => {
    setIsActive(!isActive);
  };
  const [patientname, setPatientName] = useState("");
  const [roomCategory, setRoomCategory] = useState("");
  const [packagePrice, setPackagePrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [showChargesFields, setShowChargesFields] = useState(false);
  const [doctor, setDoctor] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [errors, setErrors] = useState({});
  const [calculated, setCalculated] = useState(false); 
  const {id } = useParams();
  const [assign, setAssign] = useState("Cash");
  const {roomId} = useParams();
  const [hidedata, sethidedata] = useState(true); 
  const [hidesubbtn, sethideubbtn] = useState(false); 
  const [showChargesOptions, setShowChargesOptions] = useState(false);
  const [showDiscountOptions, setShowDiscountOptions] = useState(false);
  const [utrno,setUteno]=useState();
  const[transcationno, setTransctionno]=useState();
  const[remark,setRemark]=useState("");
  const navigate =useNavigate()

  const [poupdate,setPopupdate]=useState();
  
  useEffect(() => {
    const patientdata = async () => {
      const getdata = await fetch(`http://localhost:4000/res_charges/${id}`);
      const result = await getdata.json();
      if (result.length > 0) {
        setPatientName(result[0].patientname);
      } else {
        console.log("No data found");
      }
    };

    const RoomCategory = () => {
  
      if (roomId >= 1 && roomId <= 8) {
        setRoomCategory("General"); 
      } else if ((roomId >= 401 && roomId <= 404) || (roomId >= 501 && roomId <= 504)) {
        setRoomCategory("Special");
      } else {
        setRoomCategory("Semi-Special");
      }
    };

    RoomCategory();
    patientdata();
  }, [id]);

  const validateForm = () => {
    let newErrors = {};

    if (!doctor) newErrors.doctor = "Please select doctor name";
    if (!fromDate) newErrors.fromDate = "Please select a from date";
    if (!toDate) newErrors.toDate = "Please select a to date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateCharges = () => {
  if (!validateForm()) return;

  let dailyRate;
  let depositAmount;
  let totalCost = 0;

  if (roomCategory === "General") {
    dailyRate = 200;
    depositAmount = 500;
  } else if (roomCategory === "Semi-Special") {
    dailyRate = 500;
    depositAmount = 500;
  } else if (roomCategory === "Special") {
    dailyRate = 700;
    depositAmount = 500;
  }
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to - from);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    let remainingDays = totalDays;
    if (remainingDays===0) 
    {
      totalCost=200;
    }
    if (remainingDays > 0) 
    {
      const first2Days = Math.min(2, remainingDays);
      totalCost += first2Days * dailyRate; // Full price for the first 2 days
      remainingDays -= first2Days;
      // Apply discount starting from the 3rd day
      if (remainingDays > 0)
      {
          const first5Days = Math.min(3, remainingDays);
          totalCost += first5Days * dailyRate * (1 - 0.33); // 33% discount
          remainingDays -= first5Days;
      }
  }
    // Next 5 days with 30% discount
    if (remainingDays > 0) {
        const next5Days = Math.min(5, remainingDays);
        totalCost += next5Days * dailyRate * (1 - 0.30); // 30% discount
        remainingDays -= next5Days;
    }

    // Next 5 days with 27% discount
    if (remainingDays > 0) {
        const next5Days = Math.min(5, remainingDays);
        totalCost += next5Days * dailyRate * (1 - 0.27); // 27% discount
        remainingDays -= next5Days;
    }

    // Next 5 days with 20% discount
    if (remainingDays > 0) {
        const next5Days = Math.min(5, remainingDays);
        totalCost += next5Days * dailyRate * (1 - 0.20); // 20% discount
        remainingDays -= next5Days;
    }

    // Next 5 days with 25% discount
    if (remainingDays > 0) {
        const next5Days = Math.min(5, remainingDays);
        totalCost += next5Days * dailyRate * (1 - 0.25); // 25% discount
        remainingDays -= next5Days;
    }

    // Last 5 days with 40% discount
    if (remainingDays > 0) {
        const last5Days = Math.min(5, remainingDays);
        totalCost += last5Days * dailyRate * (1 - 0.40); // 40% discount
        remainingDays -= last5Days;
    }

    // If there are more than 30 days, charge full price for remaining days
    if (remainingDays > 0) {
        totalCost += remainingDays * dailyRate; // No discount
    }
    // Round up total cost
    totalCost = Math.ceil(totalCost); 
   
    // Final package cost including deposit
    const totalAmount = Math.ceil(totalCost + depositAmount); // Round up the total amount

    setPackagePrice(totalCost); // Total cost before deposit
    setDeposit(depositAmount); // Deposit
    setTotalAmount(totalAmount); // Total amount
    setShowChargesFields(true); // Show charges fields
    setCalculated(true); // Set calculated flag
    
    const newdate = new Date(fromDate);
    const formatdate = newdate.toLocaleString("en-US",{
      weekday:"long",
      year:"numeric",
      month:"long",
      day:"numeric",

    })
    setPopupdate(formatdate);
};

  const handleEdit = () => {
    setCalculated(false); // Reset calculated flag
    setShowChargesFields(false); // Hide charges fields
  };

// -----------------Calcualtion Discount-------------

  const [discountPercent, setDiscountPercent] = useState(0);
  const [flatDiscount, setFlatDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(packagePrice);
  const [discountType, setDiscountType] = useState(0);
  const [disaftertotalamt,setdisaftertotalamt]=useState()
  const[discountamount,setDisamount]=useState();

  useEffect(() => {
    let newPrice = packagePrice;

    if (discountType === "percentage" && discountPercent) {
      const discountAmount = (packagePrice * parseFloat(discountPercent)) / 100;
      newPrice = packagePrice - discountAmount;
    } else if (discountType === "flat" && flatDiscount) {
      newPrice = packagePrice - parseFloat(flatDiscount);
    }

    const Disamount =(Math.ceil(packagePrice-newPrice));
    setDisamount(Disamount)
    setdisaftertotalamt(Math.ceil(newPrice + deposit));
    setFinalPrice(newPrice > 0 ? Math.round(newPrice) : 0); // Round the result
  }, [discountPercent, flatDiscount, packagePrice, discountType,disaftertotalamt]);

const handleContinue=async ()=>
{
  setShowChargesOptions(true)
  sethidedata(false)
  sethideubbtn(true)
}
const handlePaymentModeChange = (e) => {
  const selectedMode = e.target.value;
  setAssign(selectedMode);
};

const handleSubmit = async () => 
{
  const Entrydate = moment().format("YYYY-MM-DD HH:mm:ss"); 
  const reservationData = 
  {
    patientid: id,
    patientname: patientname,
    doctor: doctor,
    fromDate: fromDate,
    toDate: toDate,
    packagePrice: packagePrice,
    ReceivableAmount: finalPrice,
    deposit: deposit,
    totalAmount: disaftertotalamt,
    AssignBedno: roomId,
    DiscountPercentage: discountPercent || 0,
    Discountflat: flatDiscount || 0,
    DiscountAmount: discountamount || 0,
    Narration: "package Charges",
    paymentMode: assign,
    PymentUTRNo: assign === "Upi" ? utrno : "0",
    PaymentTransctionNo: assign === "BankTransfer" ? transcationno : "0",
    RecivedBy: "Anant",
    Remark: remark,
    RoomCategory: roomCategory,
    ReservationStatus: "Reservation",
    balanceAmount:0, 
    EntryDate: Entrydate,
  };

  try {
    const response = await fetch("http://localhost:4000/Package_reservation_charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    });

    if (response.ok) {
      const result = await response.json();
      setShowModal(true); 
    } else {
      alert("Failed");
    }
  } catch (error) {
    alert("An error occurred");
  }
};
const handleCloseModal = () => {
  setShowModal(false);
  navigate("/"); 
};

const cancal = () => {
  const confirmLeave = window.confirm(
    "You have unsaved changes. Are you sure you want to leave?"
  );

  if (confirmLeave) {
    navigate(`/`); 
  }
};
  return (
    <>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div id="page-container" className={isActive ? 'sidebar-open' : 'sidebar-closed'}>
        <div className="form_wrapper" style={{width: "800px"}}>
          <div className="form_container">
            <form className="res-chargesform">
                  {hidedata && (
                    <>
                     <input type="text" value={id} style={{display:"none"}} readOnly />
                      <div className="row">
                        <label className="formlabel">Patient Name</label>
                        <div className="input_field1">
                          <span className="addressicon">
                            <i className="fa fa-map-marker"></i>
                          </span>
                          <input type="text" value={patientname} readOnly />
                        </div>
                      </div>

                      <div className="row">
                        <div className="from_section">
                          <label className="formlabel">Room Category</label>
                          <div className="input_field1">
                            <span>
                              <i aria-hidden="true" className="fa fa-user"></i>
                            </span>
                            <input type="text" value={roomCategory} readOnly />
                          </div>
                        </div>

                        <div className="from_section">
                          <label className="formlabel">
                            Recommended by <label className="star">*</label>
                          </label>
                          <div className="input_field1 select_option">
                            <select value={doctor} onChange={(e) => setDoctor(e.target.value)} required>
                              <option value="">Select Doctor Name</option>
                              <option value="Dr. Girish Bedre">Dr. Girish Bedre</option>
                              <option value="Dr. Manohar Shinde">Dr. Manohar Shinde</option>
                              <option value="Dr. Deshmukh">Dr. Deshmukh</option>
                              <option value="Dr. Nitin Jadhav">Dr. Nitin Jadhav</option>
                              <option value="Dr. Pilodkar">Dr. Pilodkar</option>
                              <option value="Dr. Aher">Dr. Aher</option>
                              <option value="Dr. Ganesh Jadhav">Dr. Ganesh Jadhav</option>
                              <option value="other">Other</option>
                            </select>
                            {errors.doctor && <p className="error-message">{errors.doctor}</p>}
                            <div className="select_arrow"></div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="from_section">
                          <label className="formlabel">
                            From Date <label className="star">*</label>
                          </label>
                          <div className="input_field1">
                            <span>
                              <i aria-hidden="true" className="fa fa-calendar"></i>
                            </span>
                            <input type="date" required value={fromDate}
                              onChange={(e) => setFromDate(e.target.value)}
                              onClick={(e) => e.target.showPicker()}  min={fromDate || new Date().toISOString().split("T")[0]}
                            />
                            {errors.fromDate && <p className="error-message">{errors.fromDate}</p>}
                          </div>
                        </div>

                        <div className="from_section">
                          <label className="formlabel">
                            To Date <label className="star">*</label>
                          </label>
                          <div className="input_field1">
                            <span>
                              <i aria-hidden="true" className="fa fa-calendar"></i>
                            </span>
                            <input type="date" required value={toDate}
                              onChange={(e) => setToDate(e.target.value)}
                              onClick={(e) => e.target.showPicker()}   min={fromDate || new Date().toISOString().split("T")[0]}
                            />
                            {errors.toDate && <p className="error-message">{errors.toDate}</p>}
                          </div>
                        </div>
                      </div>

                      {showChargesFields && (
                        <div>
                          <div className="row">
                            <label className="formlabel">Package</label>
                            <div className="input_field1">
                              <span>
                                <i className="fas fa-rupee-sign rupees"></i>
                              </span>
                              <input type="text" value={packagePrice} readOnly />
                            </div>
                          </div>

                          <div className="row">
                            <label className="formlabel">Deposit</label>
                            <div className="input_field1">
                              <span>
                                <i className="fas fa-rupee-sign rupees"></i>
                              </span>
                              <input type="text" value={deposit} readOnly />
                            </div>
                          </div>

                          <div className="row">
                            <label className="formlabel">Total Amount</label>
                            <div className="input_field1">
                              <span>
                                <i className="fas fa-rupee-sign rupees"></i>
                              </span>
                              <input type="text" value={totalAmount} readOnly />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
             
              {!calculated && (
                <center>
                  <button type="button" className="chargesbtn1 mt-3 " onClick={calculateCharges}>Calculate Charges</button>
                </center>
              )}

              {calculated && (
                <div className="">
                  {hidedata && (
                    <center>
                    <button type="button" className="chargesbtn2 mt-3" onClick={handleEdit}>Edit</button>
                    <button type="button" className="chargesbtn1 mt-3" onClick={handleContinue}>Continue</button>
                    </center>
                   )}
                </div>  
              )}
                {showChargesOptions && (
                  <>
                    <div className="row">
                      <div className="from_section">
                        <label className="formlabel">Assign Bed Number</label>
                        <div className="input_field1">
                          <span>
                            <i aria-hidden="true" className="fa fa-user"></i>
                          </span>
                          <input type="text" value={roomId} readOnly />
                        </div>
                      </div>

                      <div className="from_section">
                        <label className="formlabel">Sub-Total</label>
                        <div className="input_field1">
                          <span>
                            <i className="fas fa-rupee-sign rupees"></i>
                          </span>
                          <input type="text" value={packagePrice} readOnly />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="input_field">
                      <label className="formlabel" style={{marginRight:"20px"}}>Discount</label>
                        <input type="checkbox" checked={showDiscountOptions}
                        onChange={() => setShowDiscountOptions(!showDiscountOptions)}/>
                      
                        {showDiscountOptions && (
                          <>
                            <label className="formlabel">
                             <input className="disradio" type="radio" value="percentage"
                              checked={discountType === "percentage"}
                              onChange={() => {setDiscountType("percentage"); setFlatDiscount("");
                              }}/>
                            Percentage 
                            </label>
                            <label className="formlabel">
                              <input className="disradio"  type="radio"  value="flat"
                              checked={discountType === "flat"} onChange={() => {setDiscountType("flat"); setDiscountPercent(""); }}/>
                            Flat
                            </label>
                              
                             {discountType === "percentage" && 
                             (
                                <input type="number" className="disinput"  value={discountPercent}
                                onChange={(e) => setDiscountPercent(e.target.value)} placeholder="%" />
                              )}
                                {discountType === "flat" && (
                                <input type="number" className="disinput"  value={flatDiscount}
                                  onChange={(e) => setFlatDiscount(e.target.value)} placeholder="0" />
                              )}
                            <div>
                        </div>
                        </>
                      )}
                    </div>
                    </div> 
                        <div className="row">
                          <div className="from_section" style={{width:"255px"}}>
                            <label className="formlabel">Receivable Amount</label>
                            <div className="input_field1">
                              <span>
                                <i className="fas fa-rupee-sign rupees"></i>
                              </span>
                              <input type="text" value={finalPrice} readOnly />
                            </div>
                          </div>
                        
                          <div className="from_section" style={{width:"255px"}}>
                            <label className="formlabel">Deposit</label>
                            <div className="input_field1">
                              <span>
                                <i className="fas fa-rupee-sign rupees"></i>
                              </span>
                              <input type="text" value={deposit} readOnly />
                            </div>
                          </div>
                          <div className="from_section" style={{width:"255px"}}>
                            <label className="formlabel">Total Amount</label>
                            <div className="input_field1">
                              <input type="text" value={disaftertotalamt} readOnly />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="row" style={{display:"none"}}>
                          <div className="from_section">
                            <label className="formlabel">Discount Amount</label>
                            <div className="input_field1">
                              <input type="text" value={discountamount} readOnly />
                            </div>
                          </div>
                          </div>
  
                        </div>
                        <div className="row">
                          <label className="formlabel">Payment Mode</label>
                          <center>
                            <div className="input_field1 ">
                              <div className="paymentcard">
                              <label className="formlabel">
                                <input type="radio" className="paymentradio" name="paymentMode"value="Cash" checked={assign === "Cash"}  onChange={handlePaymentModeChange} />{" "}
                              Cash
                              </label>
                              <label className="formlabel">
                                <input type="radio" name="paymentMode" value="Upi"
                                  checked={assign === "Upi"}  className="paymentradio"  onChange={handlePaymentModeChange}/> {" "}
                                UPI
                              </label>
                                <label className="formlabel">
                                <input type="radio" name="paymentMode" value="BankTransfer"
                                  checked={assign === "BankTransfer"}  className="paymentradio"  onChange={handlePaymentModeChange}/>{" "}
                                Bank Transfer
                              </label>
                              </div>
                              {assign === "Upi" && 
                              <input type="text" value={utrno} onChange={(e)=> setUteno(e.target.value)} className="mt-4" placeholder="Enter UTR Number" />}
                              {assign === "BankTransfer" && 
                              <input className="mt-4" onChange={(e)=> setTransctionno(e.target.value)} type="text" value={transcationno} placeholder="Enter Transaction Number" />}
                            </div>
                          </center>
                        </div>

                      <div className="row">
                        <div className="from_section">
                          <label className="formlabel">Narration</label>
                          <div className="input_field1">
                            <input type="text" value="package Charges" readOnly />
                          </div>
                        </div>
                        <div className="from_section">
                          <label className="formlabel">Received By</label>
                          <div className="input_field1">
                            <span>
                              <i className="fas fa-rupee-sign rupees"></i>
                            </span>
                            <input type="text" value="Anant"  readOnly />
                          </div>
                          </div>
                        </div>
                        <div className="row">
                          <label className="formlabel">Remark</label>
                          <div className="input_field1">
                            <textarea type="text" value={remark} onChange={(e)=> setRemark(e.target.value)}></textarea>
                          </div>
                        </div>
                  </>
                )}
                {calculated && (
                  <div className="">
                    {hidesubbtn && (
                      <center>
                      <button type="button" className="chargesbtn2 mt-3" onClick={cancal}>Cancal</button>
                      <button type="button" className="chargesbtn1 mt-3" onClick={handleSubmit}>Submit</button>
                      </center>
                    )}
                  </div>
              )}
            </form>
          </div>
        </div>
      </div>
      {showModal && (
      <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.icon}>
          <img src={checkicon} alt="checkicon"  width={100} height={100} />
        </div>
        <h3>Payment Details Saved</h3>
        <div style={styles.details}>
          <p>Date : {poupdate}</p>
          <p>Amount Received :<i className="fas fa-rupee-sign rupees"></i> {disaftertotalamt}.00</p>
          <p>Mode of Payment : {assign}</p>
        </div>
        <div style={styles.buttons}>
          <button className="btn btn-success mt-2" onClick={handleCloseModal}>Home</button>
         <Link to={`/accountHistory/${id}`}><button className="btn btn-info mt-2" >Print Receipt</button></Link> 
        </div>
      </div>
    </div>
      )}
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
    padding: '40px 40px 40px 40px',
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
export default Reservatin_Charges;

