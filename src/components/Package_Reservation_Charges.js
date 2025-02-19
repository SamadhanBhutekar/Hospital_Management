import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import checkicon from '../logo/checkbox-icon.svg'
import { Link } from "react-router";
import moment from 'moment';
import { BASE_URL } from "./config";

function Package_Reservatin_Charges() {
  const [isActive, setIsActive] = useState(true);
  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const [roomCategory, setRoomCategory] = useState("");
  const [packagePrice,setPackagePrice]=useState(0)
  const [deposit, setDeposit] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showChargesFields, setShowChargesFields] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [errors, setErrors] = useState({});
  const [calculated, setCalculated] = useState(false); 
  const { patientid, id } = useParams();
  const [assign, setAssign] = useState("Cash");
  const [hidedata, sethidedata] = useState(true); 
  const [hidesubbtn, sethideubbtn] = useState(false); 
  const [showChargesOptions, setShowChargesOptions] = useState(false);
  const Navigate=useNavigate()
  const [roomcategory, setRoom] = useState(""); 
  const [NewRoomCategory, setNewRoomCategory] = useState("");
  const [AssignBedno, setAssignBedno] = useState("");
  const[totalamount,settotalAmt]= useState(0);
  const [showModal, setShowModal] = useState(false);
  const [packages,setpackage]=useState(0)
  const [RefundAmount,setRefundAmount]=useState(0)
  const [ReceivableAmount,setReceivableAmount]=useState(0)
  const [balanceAmount,setbalanceAmount]=useState(0)
  const [currrenDate,setCurrentdate]=useState(0)
  const [bedno,setGetAssignBedno]=useState(0)
  const [bedno1,setGetAssign]=useState(0)
  const [NewRoomAssign,setRoomNewCategory]=useState()
  
  useEffect(() => {
  const packagedata = async () => {
    try {
      const response = await fetch(`${BASE_URL}/package_data/${id}`);
      const data = await response.json();
      const latestRoom = data.reduce((latest, current) => {
        return new Date(current.EntryDate) > new Date(latest.EntryDate) ? current : latest;
      });
      const latestRoomCategory = latestRoom.NewRoomCategory;
      setRoomNewCategory(latestRoomCategory);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  packagedata()
},[id])
  useEffect(() => {
    const getdata = async () => 
    {
        const fetchdata = await fetch(`${BASE_URL}/print_transctiondetails/${id}`);
        const response = await fetchdata.json();
        const RoomCat = response.map((item)=>item.RoomCategory)[0];
        const totalAmt = response.map((item)=>item.totalAmount)[0];
        settotalAmt(totalAmt);
        setRoom(RoomCat)
    }
    getdata();

  },[id])

  useEffect(() => {
    const patientdata = async () => {
      const getdata = await fetch(`${BASE_URL}/res_charges/${id}`);
      const result = await getdata.json();

      if (result.length > 0) {
      } else {
        console.log("No data found");
      }
    };

    const RoomCategory = () => {
      const semiSpecialRooms = [
        "RN301A", "RN301B", "RN302A", "RN302B", "RN303A", "RN303B",
        "RN304A", "RN304B", "RN405A", "RN405B", "RN406A", "RN406B",
        "RN503A", "RN503B", "RN506A", "RN506B"
      ];

      if (patientid >= 1 && patientid <= 8) {
        setRoomCategory("General");
      } else if (semiSpecialRooms.includes(patientid)) {
        setRoomCategory("Semi-Special");
      } else if ((patientid >= 401 && patientid <= 404) || (patientid >= 501 && patientid <= 504)) {
        setRoomCategory("Special");
      } else {
        setRoomCategory("Error");
      }
    };

    RoomCategory();
    patientdata();
  }, [patientid, id]);

  const validateForm = () => {
    let newErrors = {};

    if (!NewRoomCategory) newErrors.NewRoomCategory = "Please select Room Category";
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
  
    if (NewRoomCategory === "General") {
      dailyRate = 200;
      depositAmount = 500;
    } else if (NewRoomCategory === "Semi-Special") {
      dailyRate = 500;
      depositAmount = 500;
    } else if (NewRoomCategory === "Special") {
      dailyRate = 700;
      depositAmount = 500;
    }
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const diffTime = Math.abs(to - from);
      const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      let remainingDays = totalDays;
      if (remainingDays==0) 
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

      const RefundAmt= totalamount-dailyRate;
      totalCost = Math.ceil(totalCost); 

      const ReceivableAmt = Math.max(totalCost - RefundAmt, 0);
    
      const blanceamount = Math.max(RefundAmt-totalCost  , 0);
      // Final package cost including deposit
      const totalAmount = Math.ceil(totalCost + depositAmount); // Round up the total amount
  
      setPackagePrice(totalCost); // Total cost before deposit
      setDeposit(depositAmount); // Deposit
      setTotalAmount(totalAmount); // Total amount
      setShowChargesFields(true); // Show charges fields
      setCalculated(true); // Set calculated flag
      setRefundAmount(RefundAmt); //refund amount
      setReceivableAmount(ReceivableAmt); 
      setbalanceAmount(blanceamount);

};

  const handleEdit = () => {
    setCalculated(false); // Reset calculated flag
    setShowChargesFields(false); // Hide charges fields
  };

  const handleContinue = () => {
    setShowChargesOptions(true)
    sethidedata(false)
    sethideubbtn(true)
    
  };

// -----------------Calcualtion Discount-------------
  const [discountPercent, setDiscountPercent] = useState("");
  const [flatDiscount, setFlatDiscount] = useState("");
  const [finalPrice, setFinalPrice] = useState(packagePrice);
  const [discountType, setDiscountType] = useState(null);
  const [disaftertotalamt,setdisaftertotalamt]=useState()

  useEffect(() => 
    {
      const currentDate = moment().format("DD MMM YYYY"); 
      setCurrentdate(currentDate);
    let newPrice = packagePrice;

    if (discountType === "percentage" && discountPercent) {
      const discountAmount = (packagePrice * parseFloat(discountPercent)) / 100;
      newPrice = packagePrice - discountAmount;
    } else if (discountType === "flat" && flatDiscount) {
      newPrice = packagePrice - parseFloat(flatDiscount);
    }
    setdisaftertotalamt(newPrice+deposit);

    setFinalPrice(newPrice > 0 ? Math.round(newPrice) : 0); // Round the result
  }, [discountPercent, flatDiscount, packagePrice, discountType,disaftertotalamt]);
  
  const cancel = () => {
    const confirmLeave = window.confirm(
      "You have unsaved changes. Are you sure you want to leave?"
    );

    if (confirmLeave) {
      Navigate(`/package_modification`); 
    }
  };

// --------------------Insert Data-------------------

const submit = async () => {
  let newErrors = {};
  if (!AssignBedno) newErrors.AssignBedno = "Please select Assign Bed Number";
  setShowChargesOptions(true);
  sethidedata(false);
  sethideubbtn(true);
  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return false; 
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(
    2,
    "0"
  )} ${String(currentDate.getHours()).padStart(2, "0")}:${String(
    currentDate.getMinutes()
  ).padStart(2, "0")}:${String(currentDate.getSeconds()).padStart(2, "0")}`;
  
  const data = 
    {
      patientid:id,
      RoomCategory:roomcategory,
      NewRoomCategory:NewRoomCategory,
      fromDate:fromDate,
      toDate:toDate,
      packagePrice:packagePrice,
      RefundAmount:RefundAmount,
      ReceivableAmount:ReceivableAmount,
      AssignBedno:AssignBedno,
      balanceAmount:balanceAmount,
      EntryDate: formattedDate,
      status:"modify",
    };

  try {
    const resrvationdata = await fetch(`${BASE_URL}/packagemodification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await resrvationdata.json();
    if (result) {
      setShowModal(true); 
    }
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};
const handleCloseModal = () => {
  setShowModal(false);
  Navigate("/"); 
};

useEffect(() => {
  const patienreg = async () => 
  {
      const fetchdata = await fetch(`${BASE_URL}/checkin_transctiondetails`);
      const response = await fetchdata.json();
      const GetAssignno = response.map((item)=>item.AssignBedno);
     setGetAssignBedno(GetAssignno);
  }
  patienreg();
},[])

useEffect(() => {
  const packagedata = async () => 
  {
      const packdata = await fetch(`${BASE_URL}/Package_modification`);
      const result = await packdata.json();
      const GetAssignno = result.map((item)=>item.AssignBedno);
      setGetAssign(GetAssignno);
  }
  packagedata();
},[])

const generalBeds = ["1", "2", "3", "4", "5", "6", "7", "8"];
const semiSpecialBeds = [
  "301A", "301B", "302A", "302B", "303A", "303B",
  "304A", "304B", "405A", "405B", "406A", "406B",
  "503A", "503B", "506A", "506B"
];
const specialBeds = ["401", "402", "403", "404", "501", "502", "503", "504"];

// Filter out assigned bedss
const GetAssignBedno = Array.isArray(bedno) ? bedno : [bedno];
const GetAssignBedno1 = Array.isArray(bedno1) ? bedno1 : [bedno1];
const availableGeneralBeds = generalBeds.filter((bed) => !GetAssignBedno.includes(bed) && !GetAssignBedno1.includes(bed));
const availableSemiSpecialBeds = semiSpecialBeds.filter((bed) => !GetAssignBedno.includes(bed) && !GetAssignBedno1.includes(bed));
const availableSpecialBeds = specialBeds.filter((bed) => !GetAssignBedno.includes(bed) && !GetAssignBedno1.includes(bed));

  return (
    <>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div id="page-container" className={isActive ? 'sidebar-open' : 'sidebar-closed'}>
        <div className="form_wrapper">
          <div className="form_container">
            <form className="res-chargesform">
                  {hidedata && (
                    <>
                    <center><h4 style={{color:"#94a3b8",marginBottom:"30px"}}>Package Modification</h4></center>
                      <div className="row">
                        <div className="from_section">
                          <label className="formlabel">Room Category {roomcategory}</label>
                          <div className="input_field1">
                            <span><i aria-hidden="true" className="fa fa-user"></i> </span>
                            {(NewRoomAssign?.length ?? 0) > 0 ? (
                              <input type="text" value={NewRoomAssign} readOnly />
                            ) : (
                              <input type="text" value={roomcategory} readOnly />
                            )}
                          </div>
                        </div>

                        <div className="from_section">
                          <label className="formlabel"> Recommended by <label className="star">*</label>
                          </label>
                          <div className="input_field1 select_option">
                          <select value={NewRoomCategory}onChange={(e) => {setNewRoomCategory(e.target.value);if (e.target.value.trim()) {setErrors((prevErrors) => ({ ...prevErrors, NewRoomCategory: "" })); }}}required >
                              <option value="">Room Category</option>
                              <option value="General">General</option>
                              <option value="Semi-Special">Semi-Special</option>
                              <option value="Special">Special</option>
                            </select>
                            {errors.NewRoomCategory && <p className="error-message">{errors.NewRoomCategory}</p>}
                            <div className="select_arrow"></div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="from_section">
                          <label className="formlabel">From Date <label className="star">*</label>
                          </label>
                          <div className="input_field1">
                            <span> <i aria-hidden="true" className="fa fa-calendar"></i> </span>
                              <input type="date" required value={fromDate} onChange={(e) => {
                              setFromDate(e.target.value);if (e.target.value) {
                              setErrors((prevErrors) => ({ ...prevErrors, fromDate: "" }));}}}
                               onClick={(e) => e.target.showPicker()} 
                              min={fromDate || new Date().toISOString().split("T")[0]} 
                              />
                            {errors.fromDate && <p className="error-message">{errors.fromDate}</p>}
                          </div>
                        </div>

                        <div className="from_section">
                          <label className="formlabel"> To Date <label className="star">*</label>
                          </label>
                          <div className="input_field1">
                            <span><i aria-hidden="true" className="fa fa-calendar"></i></span>
                              <input type="date" required  value={toDate} onChange={(e) => {
                               setToDate(e.target.value); if (e.target.value) {
                              setErrors((prevErrors) => ({ ...prevErrors, toDate: "" }));}
                              }} onClick={(e) => e.target.showPicker()}
                               min={fromDate || new Date().toISOString().split("T")[0]} 
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
                              <input type="text" value={packagePrice || ""}  
                               onChange={(e) => setpackage(e.target.value)} readOnly />
                            </div>
                          </div>

                          <div className="row">
                            <label className="formlabel">Refundable Amount</label>
                            <div className="input_field1">
                              <span>
                                <i className="fas fa-rupee-sign rupees"></i>
                              </span>
                              <input type="text" value={RefundAmount || ""}   readOnly />
                            </div>
                          </div>

                          <div className="row">
                            <label className="formlabel">Receivable Amount</label>
                            <div className="input_field1">
                              <span>
                                <i className="fas fa-rupee-sign rupees"></i>
                              </span>
                              <input type="text" value={ReceivableAmount}   readOnly />
                            </div>
                          </div>

                          <div className="row">
                            <label className="formlabel">Balance Amount</label>
                            <div className="input_field1">
                              <span>
                                <i className="fas fa-rupee-sign rupees"></i>
                              </span>
                              <input type="text" value={balanceAmount}  readOnly />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

              {!calculated && (
                <center>
                  <button type="button" className="chargesbtn1" onClick={calculateCharges}>Calculate Charges</button>
                </center>
              )}

              {calculated && (
                <div className="">
                  {hidedata && (
                    <center>
                    <button type="button" className="chargesbtn2" onClick={handleEdit}>Edit</button>
                    <button type="button" className="chargesbtn1" onClick={handleContinue}>Continue</button>
                    </center>
                   )}
                </div>  
              )}
                {showChargesOptions && (
                  <>
                    <div className="row">
                    <>
                      <div className="row">
                        <div className="from_section">
                          <label className="formlabel">
                            Assign Bed Number <label className="star">*</label>
                          </label>
                        
                            <div className="input_field1 select_option">
                              <select value={AssignBedno}
                                onChange={(e) => setAssignBedno(e.target.value)}
                              required >

                              <option value="">Select Bed Number</option>
                              {NewRoomCategory === "General" &&
                                availableGeneralBeds.map((bed) => (
                                  <option key={bed} value={bed}>
                                    {bed}
                                  </option>
                                ))}

                              {NewRoomCategory === "Semi-Special" &&
                                availableSemiSpecialBeds.map((bed) => (
                                  <option key={bed} value={bed}>
                                    {bed}
                                  </option>
                                ))}
                                
                              {NewRoomCategory === "Special" &&
                                availableSpecialBeds.map((bed) => (
                                  <option key={bed} value={bed}>
                                    {bed}
                                  </option>
                                ))}
                            </select>
                            {errors.AssignBedno && (
                              <p className="error-message">{errors.AssignBedno}</p>
                            )}
                            <div className="select_arrow"></div>
                          </div>
                        </div>

                        <div className="from_section">
                          <label className="formlabel">Receivable Amount</label>
                          <div className="input_field1">
                            <span>
                              <i className="fas fa-rupee-sign rupees"></i>
                            </span>
                            <input type="text" value={ReceivableAmount} readOnly />
                          </div>
                        </div>
                      </div>
                    </>                    
                    </div>
                    <div className="row">
                      <label className="formlabel">Payment Mode</label>
                      <center>
                        <div className="input_field1 ">
                          <div className="paymentcard">
                          <label className="formlabel">
                            <input type="radio" className="paymentradio" name="paymentMode"value="Cash"
                              checked={assign === "Cash"} onChange={(e) => setAssign(e.target.value)}
                            />{" "}
                            Cash
                          </label>
                          <label className="formlabel">
                            <input type="radio" name="paymentMode" value="Upi"
                              checked={assign === "Upi"}  className="paymentradio" onChange={(e) => setAssign(e.target.value)}/>
                            {" "}
                            UPI
                          </label>
                            <label className="formlabel">
                            <input type="radio" name="paymentMode" value="BankTransfer"
                              checked={assign === "BankTransfer"}  className="paymentradio" onChange={(e) => setAssign(e.target.value)}/>
                            {" "}
                            Bank Transfer
                          </label>
                          </div>
                          {assign === "Upi" && <input type="text" className="mt-4" placeholder="Enter UTR Number" />}
                          {assign === "BankTransfer" && <input className="mt-4" type="text" placeholder="Enter Transaction Number" />}
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
                        <input type="text" value="Anant" readOnly />
                      </div>
                      </div>
                    </div>

                    <div className="row">
                      <label className="formlabel">Remark</label>
                      <div className="input_field1">
                        <textarea type="text" placeholder="Add Remark"></textarea>
                      </div>
                    </div>
                  </>
                )}
                {calculated && (
                <div className="">
                  {hidesubbtn && (
                    <center>
                      <button type="button" className="chargesbtn2" onClick={cancel}>Cancal</button>
                      <button type="button" className="chargesbtn1" onClick={submit}>Submit</button>
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
          <img src={checkicon} alt="checkicon" width={100} height={100} />
        </div>
        <h3>Payment Details Saved</h3>
        <div style={styles.details}>
          <p>Date : {currrenDate}</p>
          <p>Amount Received :<i className="fas fa-rupee-sign rupees"></i> {ReceivableAmount}.00</p>
          <p>Mode of Payment : {assign}</p>
        </div>
        <div style={styles.buttons}>
          <button  className="btn btn-success" style={{width:"100px"}} onClick={handleCloseModal}>Home</button>
         <Link to={`/accountHistory/${id}`}><button style={styles.button} className="btn btn-info">Print Receipt</button></Link> 
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
    padding: '60px',
    borderRadius: '25px',
    textAlign: 'center',
    width: '400px',
    boxShadow: "rgb(211, 220, 230,0.4) 0px 0px 10px 1px",
    zIndex: 1001, 
  },
  icon: {
    fontSize: '50px',
    color: '#a370f0',
    marginBottom: '15px',
  },
  details: {
    fontSize: '16px',
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


export default Package_Reservatin_Charges;
