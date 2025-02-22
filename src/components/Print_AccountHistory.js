import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { Link } from "react-router";
import Sidebar from "./Sidebar";
import moment from "moment";
import { useLocation } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";

import { BASE_URL } from "./config";


function Print_AccountHistory() {
  const [isActive, setIsActive] = useState(true);

  const handleToggle = () => {
    setIsActive(!isActive);
  };
  const { receipt } = useParams();
  const { id } = useParams();
  const [Checkindata, setCheckInData] = useState();
  const [todaydate, setcurrentdate] = useState();
  const [mobileno, setMobileno] = useState();
  const [priid, setPrid] = useState();
  const [paymenttitle, setpaymenttitle] = useState(false);
  const [packsPrice, setgetpackagePrice] = useState();
  const [RefundAmount, setgetRefundAmount] = useState();
  const [BalanceAmount, setgetbalanceAmount] = useState();
  const [RecivableAmount, setgetReceivableAmount] = useState();
  const printRef = useRef();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const flag = queryParams.get("flag");

  useEffect(() => {
    const fetchPrintData = async () => {
      try {
        let response = await fetch(

          `${BASE_URL}/print_transctiondetails/${id}`

        );
        let data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          let prid = data[0]._id;
          setPrid(prid);
        }

        setCheckInData(data);
        const currentdate = moment().format("DD MMM YYYY");
        setcurrentdate(currentdate);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };
    fetchPrintData();
  }, [id]);

  useEffect(() => {
    const pdata = async () => {
      const regisapi = await fetch(

        `${BASE_URL}/attedentmodificationinfo/${id}`

      );
      const result = await regisapi.json();
      const Mobileno = result.prinumber;
      setMobileno(Mobileno);
    };
    pdata();
  }, [id]);

  const TooltipButton = ({ iconClass, text, onClick }) => {
    const [visible, setVisible] = useState(false);

    return (
      <div
        className="tooltip-container"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={onClick} // Attach the onClick event
      >
        <button className="icon-button">
          <i className={iconClass} aria-hidden="true"></i>
        </button>
        {visible && <div className="tooltip-text">{text}</div>}
      </div>
    );
  };
  const handlePrint = () => {
    setpaymenttitle(true);
    if (flag === "payment" || flag === "chp") {
      setpaymenttitle("PAYMENT RECEIPT");
    } else if (flag === "Deposit" || flag === "chd") {
      setpaymenttitle("DEPOSIT RECEIPT");
    } else if (flag === "chr") {
      setpaymenttitle("REFUND RECEIPT");
    } else if (flag === "crd") {
      setpaymenttitle("REFUND DEPOSITE RECEIPT");
    } else if (flag === "modify") {
      setpaymenttitle("PACKAGE MODIFICATION RECEIPT");
    } else {
      setpaymenttitle(false);
    }
    requestAnimationFrame(() => {
      const printContent = printRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    });
  };

  const fetchTransactionData = async () => {
    try {

      const response = await fetch(`${BASE_URL}/report_transction`);

      const data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        let prid = data[0]?.resid || "No resid found";
        setPrid(prid);
      }
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  };
  fetchTransactionData();

  const Modificationdata = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/Package_modificationData/${id}`
      );
      const data = await response.json();
      let getpackagePrice = data.packagePrice;
      let getRefundAmount = data.RefundAmount;
      let getbalanceAmount = data.balanceAmount;
      let getReceivableAmount = data.ReceivableAmount;

      setgetpackagePrice(getpackagePrice);
      setgetRefundAmount(getRefundAmount);
      setgetbalanceAmount(getbalanceAmount);
      setgetReceivableAmount(getReceivableAmount);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  };
  Modificationdata();

  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div
        id="page-container"
        className={isActive ? "sidebar-open" : "sidebar-closed"}
      >
        <div className="receipt-container">
          <div className="receipt-top ">
            <h1>RECEIPT </h1>
            <div className="button-group">

              {(flag === "payment" || flag === "Deposit") && (
                <Link to={`/accountHistory/${id}`}>
                  <TooltipButton iconClass="fa fa-arrow-left" text="Go to Account" />
                </Link>
              )}

              {flag === "modify" && (
                <Link to={`/accountHistory/${id}`}>
                  <TooltipButton iconClass="fa fa-arrow-left" text="Go to Account"/>
                </Link>
              )}

              {(flag === "chp" ||
                flag === "chr" ||
                flag === "crd" ||
                flag === "chd") && (
                <Link to={`/CheckOutHistory/${priid}`}>
                  <TooltipButton iconClass="fa fa-arrow-left" text="Go to Account"/>
                </Link>
              )}
              <Link to="/">
                <TooltipButton iconClass="fa fa-home" text="Home" />
              </Link>
              <TooltipButton iconClass="fa fa-download" text="Download as PDF" onClick={handlePrint}/>
            </div>
          </div>
          <div className="receipt-card" ref={printRef}>
            {paymenttitle && (
              <>
                <center>
                  <h6 className="recipttitle">{paymenttitle}</h6>
                </center>
                <hr className="hr" />
              </>
            )}
            <div className="receipt-header">
              <h2>Late Dr. M.V. Govilkar Rugna Seva Sadan </h2>
              <div className="receipt-details">
                <p>Receipt Number</p>
                <p className="respno">{receipt}</p>
                <p className="dateofissue">Date of Issue</p>
                <p className="dateissue">{todaydate}</p>
              </div>
            </div>
            <hr className="hr" />
            {Checkindata && Checkindata.length > 0 && (
              <>
                <div className="transactions-list">
                  {Checkindata.map((item, index) => (
                    <div
                      className={index === 1 ? "second-record" : "record"}
                      style={{
                        backgroundColor: index === 1 ? "#13263c" : "#0c1a32",
                        padding: "20px",
                        marginBottom: "10px",
                        borderRadius: "5px",
                        color: "white",
                      }}
                    >
                      <p>Patient Name : {item.patientname}</p>
                      <p>Mobile Number : {mobileno}</p>
                      <p>Bed Category : {item.RoomCategory}</p>
                      <p>Bed Number : {item.AssignBedno}</p>
                      <p>
                        {" "}
                        Package Duration :{" "}
                        {moment(item.fromDate).format("DD MMM YYYY")} -{" "}
                        {moment(item.toDate).format("DD MMM YYYY")}
                      </p>
                      <table className="receipt-table">
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th>Mode</th>
                            <th>Amount (₹)</th>
                          </tr>
                        </thead>

                        {/* ---------------Chkin ------------- */}
                        <tbody>
                          {flag === "payment" && (
                            <>
                              <tr>
                                <td>Package Charges</td>
                                <td>{item.paymentMode}</td>
                                <td>{item.packagePrice}</td>
                              </tr>
                              <tr>
                                <td>Discount</td>
                                <td>{item.paymentMode}</td>
                                <td>-{item.DiscountAmount}</td>
                              </tr>
                              <tr className="total-row">
                                <td colSpan="2">Total Amount Received</td>
                                <td>{item.ReceivableAmount}</td>
                              </tr>
                            </>
                          )}

                          {flag === "Deposit" && (
                            <>
                              <tr>
                                <td>Deposit</td>
                                <td>{item.paymentMode}</td>
                                <td>{item.deposit}</td>
                              </tr>
                              <tr className="total-row">
                                <td colSpan="2">Total Amount Received</td>
                                <td>{item.deposit}</td>
                              </tr>
                            </>
                          )}

                          {/* ---------------Package Modification ------------- */}
                          {flag === "modify" && (
                            <>
                              <tr>
                                <td>Package_Charges</td>
                                <td>{item.paymentMode}</td>
                                <td>{packsPrice}</td>
                              </tr>
                              <tr>
                                <td>Refund</td>
                                <td>{item.paymentMode}</td>
                                <td>{RefundAmount}</td>
                              </tr>
                              <tr>
                                <td>Balance Amount</td>
                                <td>-</td>
                                <td>{BalanceAmount}</td>
                              </tr>
                              <tr>
                                <td>Payment</td>
                                <td>{item.paymentMode}</td>
                                <td>{RecivableAmount}</td>
                              </tr>

                              <tr className="total-row">
                                <td colSpan="2">Total Amount Received</td>
                                <td>{RecivableAmount}</td>
                              </tr>
                            </>
                          )}
                          
                          {/* ---------------Check Out ------------- */}

                          {flag === "chp" && (
                            <>
                              <tr>
                                <td>Package Charges</td>
                                <td>{item.paymentMode}</td>
                                <td>{item.packagePrice}</td>
                              </tr>
                              <tr>
                                <td>Discount</td>
                                <td>{item.paymentMode}</td>
                                <td>-{item.DiscountAmount}</td>
                              </tr>
                              <tr className="total-row">
                                <td colSpan="2">Total Amount Received</td>
                                <td>{item.ReceivableAmount}</td>
                              </tr>
                            </>
                          )}

                          {flag === "chr" && (
                            <>
                              <tr>
                                <td>Refund</td>
                                <td>{item.paymentMode}</td>
                                <td>{item.DiscountAmount}</td>
                              </tr>
                              <tr className="total-row">
                                <td colSpan="2">Total Amount Received</td>
                                <td>{item.DiscountAmount}</td>
                              </tr>
                            </>
                          )}
                          {flag === "crd" && (
                            <>
                              <tr>
                                <td>Refund Deposit</td>
                                <td>{item.paymentMode}</td>
                                <td>{item.deposit}</td>
                              </tr>
                              <tr className="total-row">
                                <td colSpan="2">Total Amount Received</td>
                                <td>{item.deposit}</td>
                              </tr>
                            </>
                          )}
                          {flag === "chd" && (
                            <>
                              <tr>
                                <td>Deposit</td>
                                <td>{item.paymentMode}</td>
                                <td>{item.deposit}</td>
                              </tr>
                              <tr className="total-row">
                                <td colSpan="2">Total Amount Received</td>
                                <td>{item.deposit}</td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                      <div className="signature">
                        <p>Authorised Signature</p>
                        <p>Anant</p>
                      </div>
                      <div className="payment-terms">
                        <h3>Payment Terms:</h3>
                        <p>
                          Advance Payment: Full payment required at booking or
                          check-in.
                        </p>
                        <p>No Installments: Installments not accepted.</p>
                        <p>
                          Refundable Deposit: Covers incidental charges,
                          refundable upon check-out.
                        </p>
                        <p>
                          Non-transferable: Payments non-transferable, subject
                          to cancellation policy.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Print_AccountHistory;
