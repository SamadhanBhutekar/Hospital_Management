import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import maleimg from "../logo/malelogo.svg";
import { Link } from "react-router";
import femalimg from "../logo/femalelogo.svg";
import checkicon from "../logo/checkbox-icon.svg";
import moment from "moment";

import { BASE_URL } from "./config";

const Payment_Settlement_Details = () => {
  const [checkdata, setCheckdata] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [chckedinDate, setCheckinDate] = useState();
  const [showModal, setModel] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [fromDate, setFromdate] = useState();
  const [toDate, setTodate] = useState();
  const [PymentUTRNo, setUteno] = useState();
  const [PaymentTransctionNo, setTransctionno] = useState();
  const [paymentMode, setPaymentmode] = useState("Cash");
  const [Narration, setAssign] = useState();
  const [showfrom, setFrom] = useState(false);
  const [AssignBedno, setAssignBedno] = useState(false);
  const [RefundAmount, setRefundAmount] = useState();
  const [remainingDays, setremainingDays] = useState();
  const [roomCategory, setRoomCategorys] = useState();
  const [packageamount, setackageamount] = useState();
  const [totalAmount, setTotalamount] = useState();
  const [patientid, setPatientid] = useState();
  const [Remark, setRemark] = useState("");
  const [transcatonDate, setDate] = useState();
  const [resid, setResid] = useState();
  const [errors, setErrors] = useState({});

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(

          `${BASE_URL}/payment_settlement/${id}`

        );
        const result = await response.json();
        const fromDate = new Date(result.fromDate);
        const AssignBedno = result.AssignBedno;
        const RoomCategorys = result.RoomCategory;
        const totalamount = result.totalAmount;
        const patientid = result.patientid;
        setPatientid(patientid);
        setTotalamount(totalamount);
        setRoomCategorys(RoomCategorys);
        setAssignBedno(AssignBedno);
        const toDate = new Date();

        setCheckdata(result ? [result] : []);
        const formatter = new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        const formattedFromDate = formatter.format(fromDate);
        const formattedToDate = formatter.format(toDate);

        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        const differenceInTime = toDate.getTime() - fromDate.getTime();
        const remainingDay = differenceInTime / (1000 * 60 * 60 * 24);
        setremainingDays(remainingDay);

        setFromdate(formattedFromDate);
        setTodate(formattedToDate);

        if (result) {
          setCheckdata(result ? [result] : []);
        } else {
          setCheckdata(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatientData();
  }, [id]);

  useEffect(() => {
    const resids = id;
    setResid(resids);

    let dailyRate =
      roomCategory === "General"
        ? 200
        : roomCategory === "Semi-Special"
        ? 500
        : roomCategory === "Special"
        ? 700
        : 0;

    let days = remainingDays;
    let cost = 0;
    if (days == 0) {
      cost = 200;
    }
    if (days > 0) {
      const first2Days = Math.min(2, days);
      cost += first2Days * dailyRate;
      days -= first2Days;
    }

    if (days > 0) {
      cost += Math.min(3, days) * dailyRate * 0.67;
      days -= 3;
    }

    if (days > 0) {
      cost += Math.min(5, days) * dailyRate * 0.7;
      days -= 5;
    }

    if (days > 0) {
      cost += Math.min(5, days) * dailyRate * 0.73;
      days -= 5;
    }

    if (days > 0) {
      cost += Math.min(5, days) * dailyRate * 0.8;
      days -= 5;
    }

    if (days > 0) {
      cost += Math.min(5, days) * dailyRate * 0.75;
      days -= 5;
    }

    if (days > 0) {
      cost += Math.min(5, days) * dailyRate * 0.6;
      days -= 5;
    }

    if (days > 0) {
      cost += days * dailyRate;
    }

    setackageamount(Math.ceil(cost));
  }, [remainingDays, roomCategory]);

  useEffect(() => {
    let newamount = totalAmount;
    let newcost = packageamount;
    const newtotalAmount = newamount - newcost;
    setRefundAmount(newtotalAmount);
  });

  const paymentsettelment = async (event) => {
    event.preventDefault();
    let errors = {};
    if (!Narration) errors.Narration = "Please select at least one option.";
    setErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const data = {
      resid,
      patientid,
      AssignBedno,
      RefundAmount,
      paymentMode,
      Narration,
      PymentUTRNo,
      PaymentTransctionNo,
      RecivedBy: "Anant",
      Remark,
      transcatonDate,
      checkStatus: "Check Out",
      packageStatus: "package",
    };

    try {

      let insertdata = await fetch(`${BASE_URL}/payment_settelment`, {

        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await insertdata.json();
      if (result) {
        setModel(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    const status = await fetch(

      `${BASE_URL}/change_status/${patientid}`,

      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ checkStatus: "Check Out" }),
      }
    );

    const result = await status.json();

    let packagestatus = await fetch(

      `${BASE_URL}/package_status/${patientid}`,

      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageStatus: "package" }),
      }
    );
    const statusdata = await packagestatus.json();
  };
  const handleContinue = async () => {
    setFrom(true);
  };

  const handleCloseModal = () => {
    navigate("/");
  };

  const cancal = () => {
    navigate("/");
  };
  const handlePaymentModeChange = (e) => {
    const selectedMode = e.target.value;
    setPaymentmode(selectedMode);
  };
  useEffect(() => {
    let currentDate = moment().format("YYYY-MM-DD hh:mm:ss A");
    setCheckinDate(currentDate);

    let Date = moment().format("YYYY-MM-DD");
    setDate(Date);
  });

  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div
        id="page-container"
        className={isActive ? "sidebar-open" : "sidebar-closed"}
      >
        {!showfrom && (
          <section className="section-card5">
            <div className="card1">
              {checkdata.map((checkdata, index) => (
                <div className="profile-card3" style={{ height: "440px" }}>
                  <div className="card-continer2">
                    {checkdata.gender === "Male" ? (
                      <img src={maleimg} alt="Male" className="resimg2" />
                    ) : (
                      <img src={femalimg} alt="Female" className="resimg2" />
                    )}
                  </div>
                  <div className="cards-container">
                    <h3 className="card-titles2" style={{ marginTop: "0px" }}>
                      Patient Details
                    </h3>
                    <div className="profile-details2">
                      <div className="detail-row2">
                        <span className="label">Patient Name</span>
                        <span className="value"> {checkdata.patientname}</span>
                      </div>
                      <div className="detail-row2">
                        <span className="label">Room Category</span>
                        <span className="value"> {checkdata.RoomCategory}</span>
                      </div>
                      <div className="detail-row2">
                        <span className="label">Check-In Date</span>
                        <span className="value">{fromDate}</span>
                      </div>
                      <div className="detail-row2">
                        <span className="label">Check-Out Date</span>
                        <span className="value">{toDate}</span>
                      </div>
                      <div className="detail-row2">
                        <span className="label">Package Amount</span>
                        <span className="value">₹ {packageamount}</span>
                      </div>
                      <div className="detail-row2">
                        <span className="label">Discount</span>
                        <span className="value">
                          ₹ {checkdata.DiscountAmount}
                        </span>
                      </div>
                      <div className="detail-row2">
                        <span className="label">Amount Paid </span>
                        <span className="value">
                          {" "}
                          ₹ {checkdata.totalAmount}
                        </span>
                      </div>
                      <div className="detail-row2">
                        <span className="label">Refundable Amount</span>
                        <span className="value"> ₹ {RefundAmount}</span>
                      </div>
                      <div className="detail-row2">
                        <span className="label">Balance Amount</span>
                        <span className="value">
                          ₹ {checkdata.balanceAmount}
                        </span>
                      </div>
                    </div>
                    <>
                      <div className="settbtn"style={{ display: "inline-block" }}>
                        <button className="btn btn-success detailsbtn" onClick={cancal}>
                          Cancal
                        </button>
                        <button className="btn btn-info detailsbtn" onClick={handleContinue}>
                          Continue
                        </button>
                      </div>
                    </>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {showfrom && (
          <div className="form_wrapper" style={{ marginTop: "100px" }}>
            <div className="form_container">
              <form>
                <div className="row">
                  <div className="from_section">
                    <input type="text" value={patientid} style={{ display: "none" }} readOnly/>
                    <label className="formlabel">Bed Number</label>
                    <div className="input_field">
                      <input type="text" value={AssignBedno} readOnly />
                    </div>
                  </div>
                  <div className="from_section">
                    <label className="formlabel">Refund Amount</label>
                    <div className="input_field">
                      <span>
                        {" "}
                        <i className="fas fa-rupee-sign rupees"></i>
                      </span>
                      <input type="text" value={RefundAmount} readOnly />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <label className="formlabel">Payment Mode</label>
                  <center>
                    <div className="input_field1 ">
                      <div className="paymentcard1">
                        <label className="formlabel">
                          <input type="radio" className="paymentradio" name="paymentMode"
                            value="Cash" checked={paymentMode === "Cash"}
                            onChange={handlePaymentModeChange}/>{" "}
                          Cash
                        </label>
                        <label className="formlabel">
                          <input type="radio" name="paymentMode"
                            value="Upi" checked={paymentMode === "Upi"}
                            className="paymentradio" onChange={handlePaymentModeChange}/>{" "}
                          UPI
                        </label>
                        <label className="formlabel">
                          <input type="radio" name="paymentMode" value="BankTransfer"
                            checked={paymentMode === "BankTransfer"} className="paymentradio"
                            onChange={handlePaymentModeChange}/>{" "}
                          Bank Transfer
                        </label>
                      </div>
                      {paymentMode === "Upi" && (
                        <input type="text" value={PymentUTRNo} onChange={(e) => setUteno(e.target.value)} className="mt-4" placeholder="Enter UTR Number"/>
                      )}
                      {paymentMode === "BankTransfer" && (
                        <input className="mt-4" onChange={(e) => setTransctionno(e.target.value)}
                          type="text" value={PaymentTransctionNo}
                          placeholder="Enter Transaction Number"/>
                      )}
                    </div>
                  </center>
                </div>
                <div className="row">
                  <label className="formlabel">Narration</label>
                  <center>
                    <div className="input_field1">
                      <div className="paymentcard1">
                        <label className="formlabel">
                          <input type="radio"  className="paymentradio" value="Payment"
                            checked={Narration === "Payment"} onChange={(e) => setAssign(e.target.value)} />
                          Payment
                        </label>
                        <label className="formlabel">
                          <input type="radio" className="paymentradio"
                            value="Refund"checked={Narration === "Refund"}
                            onChange={(e) => setAssign(e.target.value)}
                          />
                          Refund
                        </label>
                      </div>
                      {errors.Narration && (
                        <p className="error" style={{ color: "red" }}>
                          {errors.Narration}
                        </p>
                      )}
                    </div>
                  </center>
                </div>
                <div className="row">
                  <label className="formlabel">Recived By</label>
                  <div className="input_field">
                    <input type="text" value="Anant" readOnly />
                  </div>
                </div>
                <div className="row">
                  <label className="formlabel">Remark</label>
                  <div className="input_field1">
                    <textarea
                      type="text"
                      value={Remark}
                      onChange={(e) => setRemark(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <center>
                  <div className="paybuttons ">
                    <button className="btn btn-success mx-3" onClick={cancal}>
                      Cancal
                    </button>
                    <button type="submit"className="btn btn-info my-3" style={{width:"90px"}}
                      onClick={paymentsettelment} >
                      Submit
                    </button>
                  </div>
                </center>
              </form>
            </div>
          </div>
        )}
      </div>
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.icon}>
              <img src={checkicon} height={120} width={120} alt="Check Icon" />
            </div>
            <h4 className="mt-4" style={{fontSize:"20px"}}>Checked Out Successfully</h4>
            <h5  className="mt-2" style={{fontSize:"18px"}}>Checked Date: {chckedinDate}</h5>
            <div style={styles.buttons}>
              <button style={styles.button} onClick={handleCloseModal} className="btn btn-success mt-3">
                {" "}
                Home
              </button>
              <button style={styles.button} className="btn btn-info mt-3">
                <Link to={`/CheckOutHistory/${id}`}>Print Recipt</Link>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

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
    padding: '70px 20px 0px 20px',
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

export default Payment_Settlement_Details;
